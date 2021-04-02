<template>
	<!-- 商品详情 -->
	<view>
		<view :class="['container', skuShow || commentShow ? 'overflow' : '']" v-if="!commentShow">
			<!-- 轮播图 & 商品视频-->
			<view class="swiper-con">
				<view class="video-container" v-if="video && isPlaying">
					<video enable-progress-gesture="false" objectFit="fill" id="myVideo" @ended="playEnd" :src="video" controls></video>
				</view>
				<view class="play-btn" v-if="video" @tap="videoOper">
					<image class="play-icon" v-if="!isPlaying" src="/static/images/icon/play-red.png"></image>
					<text :class="'play-text ' + (isPlaying?'video-stop':'video-play')" v-if="isPlaying">{{isPlaying?i18n.quitPlaying:''}}</text>
				</view>

				<swiper v-if="!isPlaying" :circular="true" :indicator-dots="indicatorDots" :autoplay="video ? false : autoplay"
				 :indicator-color="indicatorColor" :interval="interval" :duration="duration" :indicator-active-color="indicatorActiveColor">
					<block v-for="(item, imgIndex) in imgs" :key="imgIndex">
						<swiper-item>
							<image :src="item"></image>
						</swiper-item>
					</block>
				</swiper>
			</view>
			<!-- 轮播图 & 商品视频end -->
			<!-- 倒计时栏 -->
			<view class="countdown-box" v-if="groupActivityId">
				<!-- 拼团 -->
				<text class="second-kill">{{i18n.aGroup}}</text>
				<view class="countdown-content">
					<text class="countdown-tips" v-if="groupActivity.activityStatus === 1">{{i18n.onlyStart}}</text>
					<text class="countdown-tips" v-if="groupActivity.activityStatus !== 1">{{i18n.onlyEnd}}</text>
					<!-- <text class="countdown-time">{{endOfGroupTime.day}} {{i18n.day}} {{endOfGroupTime.hou}} {{i18n.time}} {{endOfGroupTime.min}} {{i18n.minute}}	{{endOfGroupTime.sec}} {{i18n.second}}</text> -->
					<text class="countdown-time">{{endOfGroupTime.day}}<text class="countdown-tips">{{i18n.day}}</text>{{endOfGroupTime.hou}}:{{endOfGroupTime.min}}:{{endOfGroupTime.sec}}</text>
				</view>
			</view>
			<!-- 预售 -->
			<view class="pre-sale" v-if="preSellStatus == 1 && !groupActivityId">
				<view class="pre-sale-text">{{i18n.preSale}}</view>
				<view class="send-time"><text class="countdown-tips">{{i18n.expect}}</text> {{preSellTime}} <text class="countdown-tips">{{i18n.startDelivery}}</text></view>
			</view>
			<!-- 商品信息 -->
			<view class="prod-info">
				<view class="tit-wrap">
					<view class="prod-tit">{{prodName}}</view>
					<view class="col" @tap="addOrCannelCollection">
						<image v-if="!isCollection" src="/static/images/icon/prod-col.png"></image>
						<image v-if="isCollection" src="/static/images/icon/prod-col-red.png"></image>{{i18n.collection}}
					</view>
				</view>
				<view class="sales-p">{{brief}}</view>
				<!-- 普通商品价格 -->
				<view class="prod-price" v-if="!groupActivityId">
					<text class="price">￥<text class="price-num">{{wxs.parsePrice(defaultSku.price)[0]}}</text>.{{wxs.parsePrice(defaultSku.price)[1]}}</text>
					<text v-if="prodType == 3" style="color:'#e43130'">+</text>
					<text class="price" v-if="prodType == 3">￥<text class="price-num">{{wxs.parsePrice(defaultSku.scorePrice)[0]}}</text>.{{wxs.parsePrice(defaultSku.scorePrice)[1]}}</text>
					<text class="condition" v-if="preSellStatus == 1">{{i18n.preSale}}</text>
					<!-- <text class="sales"></text> -->
				</view>
				<!-- 拼团商品价格 -->
				<view class="goods-price" v-if="groupActivityId">
					<view class="current-price">
						<text class="current-price"><text class="sub">￥{{detaultGroupSku.actPrice}}</text></text>
						<text class="condition">{{groupActivity.groupNumber}}{{i18n.groupPrice}}</text>
					</view>
					<view class="original">{{i18n.originalPrice}}<text class="original-price">￥{{wxs.parsePrice(detaultGroupSku.price)[0]}}.{{wxs.parsePrice(detaultGroupSku.price)[1]}}</text></view>
				</view>

				<!-- 积分商品价格 -->
				<!-- <view class="integral-prod-price" v-if>100积分</view> -->
			</view>
			<!-- 商品信息end -->
			<!-- 拼团+预售商品 -->
			<view class="sendway" v-if="preSellStatus==1 && groupActivityId">
				<view class="coupon-tit">{{i18n.preSale}}</view>
				<view class="sendway-item pre-sale-red"><text decode="true">{{i18n.expect}} &nbsp; {{preSellTime}} &nbsp;
						{{i18n.startDelivery}}</text></view>
			</view>
			<!-- 预购信息end -->
			<!-- 配送方式 -->
			<view class="sendway" v-if="isHeXiao == 0">
				<view class="coupon-tit">{{i18n.delivery}}</view>
				<view class="coupon-con">
					<view class="sendway-item" v-if="deliveryModeVO.hasShopDelivery">
						<image src="/static/images/icon/allow.png"></image>{{i18n.expressDelivery}}
					</view>
					<view class="sendway-item" v-if="deliveryModeVO.hasCityDelivery">
						<image src="/static/images/icon/allow.png"></image>{{i18n.sameDelivery}}
					</view>
					<view class="sendway-item" v-if="deliveryModeVO.hasUserPickUp">
						<image src="/static/images/icon/allow.png"></image>{{i18n.pickStore}}
					</view>
				</view>
			</view>
      
      <view class="sendway" v-if="isHeXiao == 1">
      	<view class="coupon-tit">{{i18n.verificat}}</view>
      </view>
			<!-- 配送方式end -->

			<!-- 满减折 -->
			<view class="discount" v-if="prodDiscountList.length && preSellStatus!=1" @tap="clickDiscount">
				<view class="coupon-tit">{{i18n.promotion}}</view>
				<view class="coupon-con discount-con">
					<block v-for="(item,index) in prodDiscountList" :key="index" v-if="index<1">
						<view class="discount-item">
							<view class="discount-tag">{{wxs.parseDiscount(item.discountRule,curLang)}}</view>
							<text class="discount-content">
								<text v-if="item.discountType">{{i18n.every}}</text> {{item.discountName}}，{{i18n.maximumDiscount}}{{item.maxReduceAmount}}{{i18n.yuan}}
							</text>
						</view>
					</block>
				</view>
				<!-- <view class="num">共{{prodDiscountList.length}}张</view> -->
				<view class="more">...</view>
			</view>
			<!-- 满减折end -->

			<!-- 领券 -->
			<view class="coupon" @tap="showPopup" v-if="couponList.length && !groupActivityId && preSellStatus!=1">
				<view class="coupon-tit">{{i18n.coupons}}</view>
				<view :class="['coupon-con',curLang=='en'?'coupon-con-en':'']">
					<text class="item" v-for="(item, index) in couponList" :key="index" v-if="index<2">
						<block v-if="item.couponType == 1">{{wxs.parseDiscountProd(item.couponType,item.cashCondition,item.reduceAmount, curLang)}}</block>
						<block v-if="item.couponType == 2">{{wxs.parseDiscountProd(item.couponType,item.cashCondition,item.couponDiscount, curLang)}}</block>
					</text>
				</view>
				<view class="num">{{i18n.inTotal}}{{couponList.length}}{{i18n.piecesZ}}</view>
				<view class="more">...</view>
			</view>
			<!-- 领券end -->

			<!-- 拼团信息 -->
			<view class="spell-infor" v-if="joinGroupList.length">
				<view class="spell-infor-title">{{i18n.joinAGroup}}</view>
				<view class="spell-infor-content" v-for="(item, groupTeamId) in joinGroupList" :key="groupTeamId">
					<!-- 头像 -->
					<view class="head-img">
						<image :src="item.sharePic"></image>
					</view>
					<!-- 信息 -->
					<view class="spell-msg">
						<view class="username">{{item.shareNickName}}</view>
						<view class="spell-text">{{i18n.lack}}<text class="red-font">{{item.groupNumber - item.joinNum}}</text>{{i18n.lack1}}
							{{item.endOfGroupTime.hou}}{{i18n.time}}{{item.endOfGroupTime.min}}{{i18n.minute}}{{item.endOfGroupTime.sec}}{{i18n.second}}</view>
					</view>
					<!-- 凑团按钮 -->
					<view class="join-group" @tap="toSpellGroupDetail" :data-groupteamid="item.groupTeamId">{{i18n.toGatherGroup}}</view>
				</view>
				<!-- 详情 -->
				<view class="rules clearfix">
					<text class="rules-text01">{{i18n.groupInvitation}}{{groupActivity.groupNumber}}{{i18n.groupInvitationTips}}</text>
					<!-- <text class="rules-text02">玩法详情</text>
		<view class="right-arrow"><image src="../../images/icon/more.png"></image></view> -->
				</view>
			</view>


			<!-- 拼团信息end -->

			<!-- 已选规格 -->
			<view class="sku" @tap="showSku">
				<view class="sku-tit">{{i18n.selected}}</view>
				<!-- <view class="sku-con">{{selectedProp.length>0?selectedProp+',':''}}{{prodNum}}件</view> -->
				<view class="sku-con">
					<block v-for="(skuItem,index) in selectedProp" :key="index">
						<text decode="true">{{index < selectedProp.length-1 ? skuItem +'，' : skuItem+'&nbsp; &nbsp;'}}</text>
					</block>
					<text>{{prodNum}}{{i18n.piece}}</text>
				</view>
				<view class="more">...</view>
			</view>
			<!-- 已选规格end -->

			<!-- 评价 -->
			<view class="cmt-wrap box-radius">
				<view class="cmt-tit" @tap="showComment(-1)">
					<view class="cmt-t">{{i18n.evaluation}}<text class="cmt-good" decode="true">{{i18n.praise}}&nbsp;{{prodCommData.positiveRating}}%</text>
					</view>
					<view class="cmt-count">{{i18n.inTotal}} {{prodCommData.number}} {{i18n.itemTiao}}<text class="cmt-more"></text>
					</view>
				</view>
				<view class="cmt-cont">
					<view class="cmt-tag">
						<text @tap="showComment(-1)">{{i18n.all + ' '}}({{prodCommData.number}})</text>
						<text @tap="showComment(0)">{{i18n.praise + ' '}}({{prodCommData.praiseNumber}})</text>
						<text @tap="showComment(1)">{{i18n.mediumEvaluation + ' '}}({{prodCommData.secondaryNumber}})</text>
						<text @tap="showComment(2)">{{i18n.badEvaluation + ' '}}({{prodCommData.negativeNumber}})</text>
						<text @tap="showComment(3)">{{i18n.havePictures + ' '}}({{prodCommData.picNumber}})</text>
					</view>
					<view class="cmt-items">
						<view class="cmt-item" v-for="(item, prodCommId) in littleCommPage" :key="prodCommId">
							<view class="cmt-user">
								<text class="date">{{item.recTime}}</text>
								<view class="cmt-user-info">
									<image class="user-img" :src="item.pic?item.pic:'/static/images/icon/head04.png'"></image>
									<view class="nickname">{{item.isAnonymous==1?i18n.anonymousEvaluation:item.nickName}}</view>
									<comm-star :value="item.score"></comm-star>
								</view>
							</view>
							<view class="cmt-cnt">
								<text decode="true">{{item.content}}</text>
							</view>
							<scroll-view class="cmt-attr" scroll-x="true" v-if="item.pics && item.pics.length">
								<image :src="commPic" v-for="(commPic, index) in item.pics" :key="index" :data-pics="item.pics" :data-src="commPic"
								 @tap="clickImg"></image>
							</scroll-view>
						</view>
					</view>
					<view class="cmt-more-v" v-if="prodCommPage.records.length > 2">
						<text @tap="showComment(-1)">{{i18n.viewAllEvaluation}}</text>
					</view>
				</view>
			</view>
			<!-- 评价 end -->


			<!-- 店铺 -->
			<view class="shop-box box-radius" @tap="toShopPage">
				<!-- top -->
				<view class="shopbox-head">
					<view class="sl">
						<view class="shop-logo">
							<image :src="shopInfo.shopLogo"></image>
						</view>
						<view class="shop-con">
							<view class="shop-name">{{shopInfo.shopName}}</view>
							<view class="shop-fol">
								<view class="self-operate" v-if="shopId==1">{{i18n.selfShop}}</view>
								<view class="fol-num">{{shopInfo.fansCount < 10000 ? shopInfo.fansCount + i18n.haveSpacePeople:shopInfo.fansCount/10000 + i18n.tenThousandPeople}}{{i18n.follow}}</view>
							</view>
						</view>
					</view>
					<view class="sr">
						<view class="enter-shop">{{i18n.enterShop}}</view>
					</view>
				</view>
				<!-- middle -->
				<!-- <view class="shop-situation">
        <view class="situation-item">
          <view class="situation-item-num">612354</view>
          <view class="situation-item-txt">粉丝人数</view>
        </view>
        <view class="situation-item">
          <view class="situation-item-num">309</view>
          <view class="situation-item-txt">全部商品</view>
        </view>
      </view> -->
				<!-- bottom -->
				<!-- <view class="handle-shop">
        <view class="handle-shop-item">
          <view class="handle-shop-icon star-icon"><image src="../../images/icon/star-empty.png"></image></view>
          <text class="handle-txt">收藏店铺</text>
        </view>
        <view class="handle-shop-item">
          <view class="handle-shop-icon shop-icon"><image src="../../images/icon/shop.png"></image></view>
          <text class="handle-txt">进入店铺</text>
        </view>
      </view> -->
			</view>
			<!-- 店铺end -->


			<!-- 商品详情 -->
			<view class="prod-detail">
				<view>
					<rich-text :nodes="content"></rich-text>
				</view>
			</view>
			<!-- 商品详情end -->

			<!-- 底部按钮 -->
			<view :class="'cart-footer ' + (findSku?'':'gray')" v-if="!groupActivityId">
				<view class="btn icon" @tap="toHomePage">
					<image src="/static/images/tabbar/homepage.png"></image>{{i18n.homepage}}
				</view>
				<view class="btn icon" @tap="handleCustomService">
					<image src="/static/images/icon/shop-customer-service.png"></image>{{i18n.service}}
				</view>
				<view class="btn icon" @tap="toCartPage">
					<image src="/static/images/tabbar/basket.png"></image>{{i18n.shoppingCart}}
					<view class="badge" v-if="totalCartNum>0">{{totalCartNum>99?'99+':totalCartNum}}</view>
				</view>
				<block v-if="preSellStatus != 1">
					<view class="btn cart cart-radius" @tap="addToCart">
						<text>{{i18n.addShoppingCart}}</text>
					</view>
					<view class="btn buy cart-radius" @tap="buyNow">
						<text>{{i18n.buyNow}}</text>
					</view>
				</block>
				<view class="btn pre-sale-buy cart-radius" @tap="buyNow" v-if="preSellStatus == 1">{{i18n.buyNow}}</view>
			</view>
			<!-- 底部按钮 end -->

			<!-- 积分 底部按钮 -->
			<!-- <view class="ex-integral-foot">
		<view class="ex-integral-btn">立即兑换</view>
		</view> -->

			<!-- 【拼团】底部按钮 -->
			<view class="foot-box" v-if="groupActivityId">
				<view class="footer">
					<view class="foot-btn" @tap="toHomePage">
						<image src="/static/images/tabbar/homepage.png"></image>{{i18n.homepage}}
					</view>
					<view class="foot-btn" @tap="handleCustomService">
						<image src="/static/images/icon/shop-customer-service.png"></image>{{i18n.service}}
					</view>
					<view class="foot-btn" @tap="toCartPage">
						<image src="/static/images/tabbar/basket.png"></image>{{i18n.shoppingCart}}
						<view class="badge" v-if="totalCartNum>0">{{totalCartNum>99?'99+':totalCartNum}}</view>
					</view>
					<view class="buy-btn alone-buy cart-radius" @tap="showSku" data-alonebuy="1">
						<text>{{i18n.individualShopping}}</text>
					</view>
					<view :class="['buy-btn group-buy cart-radius', groupActivity.activityStatus === 1 ? 'gray-btn' : '']" @tap="showGroupSku">
						<text>{{i18n.startAGroup}}</text>
					</view>
				</view>
			</view>
			<!-- end 底部按钮 -->


			<!-- 满减折弹窗 -->
			<view class="popup-hide" v-if="showDiscountPopup">
				<view class="popup-box radius">
					<view class="popup-tit radius">
						<text>{{i18n.promotion}}</text>
						<text class="close" @tap='clickDiscount'></text>
					</view>
					<view class="popup-cnt popup-discount">
						<view class="coupon-con discount-con">
							<block v-for="(item, index) in prodDiscountList" :key="index">
								<view class="discount-item">
									<view class="discount-tag">{{wxs.parseDiscount(item.discountRule,curLang)}}</view>
									<text class="discount-content">
										<text v-if="item.discountType">{{i18n.every}}</text>{{item.discountName}}，{{i18n.maximumDiscount}}{{item.maxReduceAmount}}{{i18n.yuan}}</text>
								</view>
							</block>
						</view>
					</view>
				</view>
			</view>
			<!-- 满减折弹窗 end -->

			<!-- 优惠券 -->
			<view class="popup-hide" v-if="popupShow">
				<view class="popup-box radius">
					<view class="popup-tit radius">
						<text>{{i18n.coupon}}</text>
						<text class="close" @tap="closePopup"></text>
					</view>
					<view class="popup-cnt">
						<block v-for="(item, couponId) in couponList" :key="couponId">
							<coupon :showTimeType="1" :canUse="item.canUse" :couponItem="item"></coupon>
						</block>
					</view>
				</view>
			</view>
			<!-- 优惠券 end -->

			<!-- 规格弹窗 -->
			<view class="pup-sku" v-if="skuShow">
				<view class="pup-sku-main radius">
					<view class="pup-sku-header radius">
						<view class="close" @tap="closePopup"></view>
						<view class="pup-sku-img">
							<image :src="defaultSku.pic?defaultSku.pic:pic"></image>
						</view>
						<view class="pup-sku-prod">
							<!-- <view class="prod-title">{{prodName}}</view> -->
							<view class="pup-sku-price" v-if="skuShowType==0 && findSku">￥<text class="pup-sku-price-int">{{wxs.parsePrice(defaultSku.price)[0]}}</text>.{{wxs.parsePrice(defaultSku.price)[1]}}</view>
							<view class="pup-sku-price group-sku-pri" v-if="skuShowType==1 && findSku">
								<text>￥<text class="pup-sku-price-int">{{wxs.parsePrice(detaultGroupSku.actPrice)[0]}}</text>.{{wxs.parsePrice(detaultGroupSku.actPrice)[1]}}</text>
								<text class="act-price-con">{{groupActivity.groupNumber}}{{i18n.groupPrice}}</text>
							</view>
							<view class="pup-sku-price" v-if="!findSku">{{i18n.outOfStock}}</view>
							<view class="pup-sku-prop">
								<view>
									<text>{{i18n.selected}}</text>
									<text decode="true">
										<block v-for="(skuItem,index) in selectedProp" :key="index">
											{{index < selectedProp.length-1 ? '&nbsp;' + skuItem + '，' : '&nbsp;' + skuItem +'&nbsp;&nbsp;'}}
										</block>{{'&nbsp;'+prodNum+'&nbsp;'}}{{i18n.piece}}
									</text>
								</view>
								<view>
									<text>{{i18n.inventory}}</text>
									<text decode="true">{{'&nbsp;'+defaultSku.stocks}}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="pup-sku-body">
						<view class="pup-sku-area">
							<view class="sku-box" v-if="skuList.length">
								<view class="items sku-text" v-for="(skuLine, key) in skuGroup" :key="key">
									<text class="sku-kind">{{key}}</text>
									<view class="con">
										<text class="sku-choose-item" @click="toChooseItem(skuLineItem, key)" :class="[selectedProp.indexOf(skuLineItem) !== -1?'active':'',  isSkuLineItemNotOptional(allProperties,selectedPropObj,key,skuLineItem,propKeys)? 'dashed' : '']"
										 v-for="skuLineItem in skuLine" :key="skuLineItem">{{skuLineItem}}</text>
									</view>
								</view>
							</view>

							<!-- <block v-for="(value, key) in skuGroup" :key="key">
            <view class="sku-kind">{{key}}</view>
            <view class="sku-choose">
              <block v-for="(item, index) in value" :key="index">
                <text :class="'sku-choose-item ' + (wxs.array_contain(selectedProp,item)?'active':'') + ' ' + ['gray','','dashed'][wxs.props_contain2(allProperties,selectedPropObj,key,item,propKeys)]" :data-ok="wxs.props_contain2(allProperties,selectedPropObj,key,item,propKeys)" @tap="toChooseItem" :data-key="key" :data-val="item">{{item}}</text>
              </block>
            </view>
          </block> -->
						</view>
						<view class="pup-sku-count">
							<view class="num-wrap">
								<view class="minus" @tap="onCountMinus">
									<text class="row"></text>
								</view>
								<view class="text-wrap">
									<input type="number" :value="prodNum" @input="prodNumInp"></input>
								</view>
								<view class="plus" @tap="onCountPlus">
									<text class="row"></text>
									<text class="col"></text>
								</view>
							</view>
							<view class="count-name">{{i18n.quantity}}</view>
						</view>
					</view>
					<view :class="'pup-sku-footer ' + (findSku && defaultSku.stocks >= prodNum?'':'gray')">
						<block v-if="skuShowType==0 && preSellStatus != 1">
							<view class="btn cart" @tap="addToCart" v-if="skuShowType==0">{{i18n.addShoppingCart}}</view>
							<view class="btn buy" @tap="buyNow" v-if="skuShowType==0">{{i18n.buyNow}}</view>
						</block>
						<view class="btn pre-sale-buy" @tap="buyNow" v-if="preSellStatus == 1">{{i18n.buyNow}}</view>
						<view :class="['btn buy',groupActivity.activityStatus === 1 ? 'gray-btn' : '']" @tap="groupConfirmOrder"
						 data-teamid="0" v-if="skuShowType==1">{{i18n.startAGroup}}</view>
					</view>
				</view>
			</view>
			<!-- 规格弹窗 end -->

			<!-- 评价弹窗 -->

			<!-- 评价弹窗 end -->
			<!-- 分享弹窗 -->
			<view class="promo-share" v-if="shareShow">
				<view class="promo-main">
					<view class="promo-icons-close" @tap="closeEarn">
						<image src="/static/images/icon/close.png"></image>
					</view>
					<view class="promo-tit">
						<text>{{i18n.shareFriendsNow}}</text>
					</view>
					<view class="promo-desc">
						<text>{{i18n.shareFriendsTips1}}</text>
					</view>
					<view class="promo-icons">
						<!-- #ifdef H5 -->
						<button class="promo-img1" @tap="onShareWay" open-type="share" v-if="isWechat">
							<image src="/static/images/icon/weixin.png"></image>{{i18n.weChat}}
						</button>
						<!-- #endif -->
						<!-- #ifdef MP-WEIXIN -->
						<button class="promo-img1" open-type="share">
							<image src="/static/images/icon/weixin.png"></image>{{i18n.weChat}}
						</button>
						<!-- #endif -->
						<view class="promo-img1" @tap="genWeixinCode">
							<image src="/static/images/icon/erweima.png"></image>{{i18n.QRCode}}
						</view>

					</view>
					<view class="promo-btn" @tap="toDistCenterPage">{{i18n.myDistributorCenter}}</view>
				</view>
			</view>
			<!-- 分享弹窗 end -->

			<!-- 二维码弹窗 -->
			<view class="code-popup" v-if="wxCodeShow">
				<view class="code-main">
					<view class="close-v" @tap.stop="closeCodePopup">
						<image src="/static/images/icon/close.png" class="close-png"></image>
					</view>
					<view class="code-v">
						<image :src="shareWxCode" class="wx-code"></image>
					</view>
					<!-- #ifndef H5 -->
					<view class="code-txt" @tap="downloadImg">{{i18n.saveAlbum}}</view>
					<!-- #endif -->
				</view>
			</view>
			<!-- 二维码弹窗 end -->
			<!-- <login-popup bind:onGotUserInfo="onGotUserInfo" isAuthInfo="{{isAuthInfo}}"></login-popup> -->

			<!-- 引导分享蒙版 -->
			<view class="guide-share-mask" v-if="guideShare">
				<view class="mask"></view>
				<view class="guide-share-close" @tap="guideShare=false">
					<image src="../../static/images/icon/close.png" mode=""></image>
				</view>
				<view class="guide-content">
					<view class="share-img">
						<image src="../../static/images/icon/shareIcon.png"></image>
					</view>
					<view class="share-word">
						<view class="big-word">{{i18n.shareFriendsNow}}</view>
						<view class="small-word">{{i18n.shareFriendsTips2}}</view>
					</view>
				</view>
			</view>
			<!-- 引导分享蒙版 end -->

			<!-- 直播悬浮按钮 -->
			<!-- #ifdef MP-WEIXIN -->
			<view class="live" v-if="liveRoomParams && liveRoomParams.length" :data-roomid="liveRoomParams[0].roomId" :data-url="liveRoomParams[0].url"
			 @tap='toLivePage'>
				<!-- <image class="earn" src="/static/images/liveBroadcast/living03.png"></image> -->
				<rhythm-beat></rhythm-beat>
				<view class="live-txt">{{i18n.inLive}}</view>
			</view>
			<!-- #endif -->

			<!-- 回到顶部 && 普通分享 -->
			<view class="promo-con">
				<!-- <view class="suspension-btn" v-if="!(isDist && isDistProd) || (isDist && !isDistProd) &&" @tap='handleShare'>
				<image src="../../static/images/icon/share-prod.png"></image>
			</view> -->
				<!-- #ifdef MP-WEIXIN -->
				<button class="suspension-btn btn-type" open-type='share' v-if="!(isDist && isDistProd)">
					<image src="../../static/images/icon/share-prod.png"></image>
				</button>
				<!-- #endif -->

				<!-- 赚字浮层 -->
				<view class="earn" v-if="isDist && isDistProd" @tap="onShowShare">{{i18n.earn}}</view>
				<!-- 赚字浮层 end -->
				<view class="suspension-btn" v-if="showBacktop" @tap='hanldeScorllTop'>
					<image src="../../static/images/icon/back-to-top.png"></image>
				</view>
			</view>
			<!-- 回到顶部 && 分享 end-->

		</view>

		<!-- 评价弹窗 -->
		<view :class="prodCommData.number?'cmt-popup':'cmt-no-popup'" v-if="commentShow">
			<view class="cmt-tit">
				<view class="cmt-t">{{i18n.productEvaluation}}<text class="cmt-good">{{i18n.rating}}{{prodCommData.positiveRating}}%</text>
				</view>
				<text class="close" @tap="closePopup"></text>
			</view>
			<view class="cmt-cont">
				<view class="cmt-tag">
					<text @tap="getProdCommPage" data-evaluate="-1" :class="evaluate==-1?'selected':''">{{i18n.all + ' '}}({{prodCommData.number}})</text>
					<text @tap="getProdCommPage" data-evaluate="0" :class="evaluate==0?'selected':''">{{i18n.praise + ' '}}({{prodCommData.praiseNumber}})</text>
					<text @tap="getProdCommPage" data-evaluate="1" :class="evaluate==1?'selected':''">{{i18n.mediumEvaluation + ' '}}({{prodCommData.secondaryNumber}})</text>
					<text @tap="getProdCommPage" data-evaluate="2" :class="evaluate==2?'selected':''">{{i18n.badEvaluation + ' '}}({{prodCommData.negativeNumber}})</text>
					<text @tap="getProdCommPage" data-evaluate="3" :class="evaluate==3?'selected':''">{{i18n.havePictures + ' '}}({{prodCommData.picNumber}})</text>
				</view>
				<view class="cmt-items">
					<view class="cmt-item" v-for="(item, prodCommId) in prodCommPage.records" :key="prodCommId">
						<view class="cmt-user">
							<text class="date">{{item.recTime}}</text>
							<view class="cmt-user-info">
								<!-- 匿名头像图片-->
								<image class="user-img" :src="item.pic?item.pic:'/static/images/icon/head04.png'"></image>
								<view class="nickname">{{item.isAnonymous==1?i18n.anonymousEvaluation:item.nickName}}</view>
								<comm-star :value="item.score"></comm-star>
							</view>
						</view>
						<view class="cmt-cnt">
							<text decode="true">{{item.content}}</text>
						</view>
						<scroll-view class="cmt-attr" scroll-x="true" v-if="item.pics && item.pics.length">
							<image :src="commPic" v-for="(commPic, index) in item.pics" :key="index" :data-pics="item.pics" :data-src="commPic"
							 @tap="clickImg"></image>
						</scroll-view>
						<view class="cmt-reply" v-if="item.replyContent">
							<text class="reply-tit">{{i18n.shopReply}}：</text><text class="reply-content">{{item.replyContent}}</text></view>
					</view>
				</view>
				<!-- 列表空 -->
				<view class="empty" v-if="!prodCommPage.records.length">
					<view class="empty-icon">
						<image src="/static/images/icon/empty-com.png"></image>
					</view>
					<view class="empty-text">{{i18n.noProductReviewsTips}}</view>
				</view>
				<!-- /列表空 -->
				<view class="load-more" v-if="prodCommPage.pages > prodCommPage.current">
					<text @tap="getMoreCommPage">{{i18n.clickLoadMore}}</text>
				</view>
			</view>
		</view>

	</view>
</template>

<script module="wxs" lang="wxs" src="../../wxs/number.wxs"></script>

<script>
	// pages/prod/prod.js
	const app = getApp().globalData;
	var http = require("../../utils/http.js");
	var config = require("../../utils/config.js");
	var util = require("../../utils/util.js");
	var Qr = require("../../utils/wxqrcode.js");
	import coupon from "../../components/coupon/coupon";
	import commStar from "../../components/commStar/commStar";
	import loginPopup from "../../components/loginPopup/loginPopup";
	import rhythmBeat from "../../components/rhythmBeat/rhythmBeat";
	// #ifdef H5
	import Wechat from "../../utils/wechat.js";
	// #endif
	export default {
		components: {
			coupon,
			commStar,
			loginPopup,
			rhythmBeat
		},
		data() {
			return {
				isWechat: false, //是否为微信环境
				shopId: 1,
				shopInfo: {}, // 店铺信息
				picDomain: config.picDomain,
				indicatorDots: true,
				indicatorColor: '#f2f2f2',
				indicatorActiveColor: '#EF103C',
				isAuthInfo: true,
				autoplay: true,
				interval: 3000,
				duration: 1000,
				prodNum: 1,
				totalCartNum: 0,
				groupActivityId: 0,
				pic: "",
				imgs: '',
				prodName: '',
				price: 0,
				actPrice: 0,
				content: '',
				prodId: 0,
				brief: '',
				skuId: 0,
				popupShow: false,
				// 是否获取过用户领取过的优惠券id
				loadCouponIds: false,
				skuShow: false,
				skuGroupShow: false,
				commentShow: false,
				couponList: [],
				skuList: [],
				skuGroup: {},
				findSku: true,
				defaultSku: "",
				detaultGroupSku: "",
				selectedProp: [],
				selectedPropObj: {},
				selectedProperties: "",
				propKeys: [],
				allProperties: [],
				prodCommData: {},
				prodCommPage: {
					current: 0,
					pages: 0,
					records: []
				},
				littleCommPage: [],
				evaluate: -1,
				isCollection: false,
				shareShow: false,
				isDist: false,
				//是否分销员
				isDistProd: false,
				//是否分销商品
				distributionCardNo: "",
				//分销员卡号
				wxCodeShow: false,
				//是否显示二维码弹层
				shareWxCode: "",
				//分享二维码图片路径
				groupActivity: {},
				// 团购活动
				endOfGroupTime: {},
				// 距离团购活动结束还剩多久
				joinGroupList: [],
				// 可加入的团列表
				skuShowType: 0,
				// sku的显示类型 0普通sku 1拼团sku
				totalStocks: 0,
				// 活动剩余库存
				hasMaxNum: false,
				// 是否限购
				maxNum: 0,
				// 限购数量
				joinGroupListTimer: '',
				endOfGroupTimer: '',
				scene: '',
				prodDiscountList: [], // 商品促销活动列表
				shopLogo: "",
				teamId: "",
				prodType: 0, //商品类型(0普通商品 1拼团 2秒杀 3积分)
				showDiscountPopup: false, //促销弹窗显隐

				guideShare: false, // 引导蒙版

				deliveryModeVO: null, // 配送方式
        isHeXiao: '',   // 是否核销商品， 0否 1是

				video: '', // 商品视频
				isPlaying: false,
				showBacktop: false,
				liveRoomParams: [], // 直播列表

				// 预售
				preSellStatus: 0, // 预售状态 1：开启 0：未开启
				preSellTime: '', // 预售发货时间

				scrollTop: -1, // 滚动监听
				carNum: '', //购物车图标右上角数字
				curLang: uni.getStorageSync('lang')
			};
		},

		components: {
			coupon,
			commStar,
			loginPopup
		},
		props: {},

		computed: {
			i18n() {
				return this.$t('index')
			}
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			// console.log(i18n.available);
			// #ifdef H5
			this.isWechat = Wechat.isWechat()
			// #endif
			// #ifdef APP-PLUS
			this.isWechat = false
			// #endif

			this.setData({
				prodId: this.$Route.query.prodid,
				distributionCardNo: this.$Route.query.cardno || '',
			})
			// 普通的跳转
			if (this.$Route.query.prodid) {
				this.executionFunction()
			}
			// 扫码进入 (小程序)
			if (this.$Route.query.scene) {
				let scene = decodeURIComponent(this.$Route.query.scene)
				// 如果是微信小程序中下载保存的二维码
				if (scene.indexOf(',') !== -1) {
					this.setData({
						prodId: scene.split(',')[0],
						distributionCardNo: scene.split(',')[1]
					});
					this.executionFunction()
				} else {
					this.setData({
						scene: scene
					});
					//根据Ticket获取保存的内容
					this.getContent();
				}
			}
		},

		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function() {
			clearTimeout(this.joinGroupListTimer);
			clearTimeout(this.endOfGroupTimer);
		},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {

			uni.setNavigationBarTitle({
				title: this.i18n.commodityDetails
			});

			// 加载购物车数字
			this.getCartCount()
		},

		/**
		 * 页面相关事件处理函数--监听页面隐藏
		 */
		onHide: function() {
			this.skuShow = false
			if (this.isPlaying) {
				this.stopPlay()
			}
		},

		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function() {},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {},

		/**
		 * 页面滚动事件
		 */
		onPageScroll: function(e) {
			// console.log(e)
			this.scrollTop = e.scrollTop
			if (this.scrollTop > 80) {
				this.setData({
					showBacktop: true
				});
			} else if (this.scrollTop < 80) {
				this.setData({
					showBacktop: false
				});
			}
			// this.showBacktop = e.scrollTop > 700
		},

		/**
		 * 用户点击转发
		 */
		onShareAppMessage: function(res) {
			if (res.from === 'button') {
				var cardno = wx.getStorageSync("distCardNo");
				return {
					title: this.prodName,
					path: '/pages/prod/prod?prodid=' + this.prodId + '&cardno=' + cardno,
					imageUrl: this.pic
				};
			} else {
				return {
					title: this.prodName,
					path: '/pages/prod/prod?prodid=' + this.prodId,
					imageUrl: this.pic
				};
			}
		},
		watch: {
			skuShow(nv) {
				if (nv && this.isPlaying) {
					this.stopPlay()
				}
			},
			commentShow(nv) {
				if (nv && this.isPlaying) {
					this.stopPlay()
				}
			},
			showDiscountPopup(nv) {
				if (nv && this.isPlaying) {
					this.stopPlay()
				}
			},
			popupShow(nv) {
				if (nv && this.isPlaying) {
					this.stopPlay()
				}
			}
		},
		methods: {
			/**
			 * 输入商品数量
			 */
			prodNumInp(e) {
				let num = Number(e.detail.value.replace(/[^\d]/g, ''))
				this.prodNum = num
			},
			/**
			 * 获取购物车
			 */
			getCartCount() {
				var params = {
					url: '/api/v1/shopCart/prodCount',
					method: "GET",
					dontTrunLogin: true,
					callBack: res => {
						this.totalCartNum = res
					}
				}
				http.request(params)
			},
			/**
			 * 咨询客服
			 */
			handleCustomService() {
				util.checkAuthInfo(() => {
					uni.navigateTo({
						url: '/pages/chat/chatIm?shopid=' + this.shopId
					});
				})
			},

			/**
			 * 执行函数
			 */
			executionFunction: function() {
				//加载商品数据
				this.getProdInfo();
				// 加载评论数据
				this.getProdCommData();
				// 加载评论项
				this.getLittleProdComm();

				// 获取商品是否被收藏信息
				this.getCollection()
				// 查询分销开关是否开启
				this.getDistInfo()


				//分销员转发过来的，需要绑定用户
				if (this.cardno) {
					this.bindDistUser(this.cardno);
				}

				// 获取商品所有促销活动
				this.getPordDiscountList();
			},

			/**
			 * 根据Ticket获取保存的内容
			 */
			getContent: function() {
				http.request({
					url: "/qrcodeTicket/getContent",
					method: "GET",
					data: {
						ticket: this.scene
					},
					callBack: res => {
						var content = JSON.parse(res.content);
						var ids = JSON.parse(content.content);
						if (res.type == 1) {
							//pc团购二维码跳转
							this.setData({
								prodId: ids.prodId,
								groupActivityId: ids.groupActivityId
							});
						} else if (res.type == 2) {
							//分销员二维码跳转
							this.setData({
								prodId: ids.shareProdId,
								distributionCardNo: ids.cardNo
							});
						}
						this.executionFunction(); //所有需要加载的函数
					}
				});
			},

			/**
			 * 分销绑定用户
			 */
			bindDistUser(cardno) {
				http.request({
					url: "/api/v1/distribution/bindUser",
					method: "post",
					data: cardno
				});
			},

			/**
			 * 查询分销相关信息
			 */
			getDistInfo() {
				//查询分销开关是否开启
				http.request({
					url: "/api/v1/distribution/distributionBasicSet/canDistribution",
					method: "GET",
					dontTrunLogin: true,
					// data: {
					//   shopId: this.data.shopId,
					// },
					callBack: res => {
						if (res == 1) {
							this.getIsDistInfo();
						}
					}
				});
			},

			/**
			 * 查询用户 是否为分销员
			 */
			getIsDistInfo() {
				http.request({
					url: "/api/v1/distribution/user/distributionUserInfo",
					method: "GET",
					callBack: res => {
						if (res && res.state == 1) {
							this.setData({
								isDist: true
							});
							this.getIsDistProd();
							wx.setStorageSync("distCardNo", res.cardNo);
						}
					}
				});
			},

			/**
			 * 查询是否为分销商品
			 */
			getIsDistProd() {
				http.request({
					url: "/api/v1/distribution/prod/isDistributionProd",
					method: "GET",
					data: {
						prodId: this.prodId
					},
					callBack: res => {
						if (res) {
							this.setData({
								isDistProd: true
							});
						}
					}
				});
			},

			/**
			 * 获取商品是否被收藏信息
			 */
			getCollection() {
				uni.showLoading();
				var params = {
					url: "/api/v1/user/collection/isCollection",
					method: "GET",
					dontTrunLogin: true,
					data: {
						prodId: this.prodId
					},
					callBack: res => {
						this.setData({
							isCollection: res
						});
						uni.hideLoading()
					}
				};
				http.request(params);
			},

			/**
			 * 添加或者取消收藏商品
			 */
			addOrCannelCollection() {
				util.tapLog()
				util.checkAuthInfo(() => {
					var params = {
						url: "/api/v1/user/collection/addOrCancel",
						method: "POST",
						data: this.prodId,
						callBack: res => {
							this.setData({
								isCollection: !this.isCollection
							});
							uni.showToast({
								title: res ? this.i18n.collectionAdded : this.i18n.collectionCancelled,
								duration: 1200,
								icon: 'none',
							})
						}
					};
					http.request(params);
				})

			},

			// 获取商品信息
			getProdInfo() {
				uni.showLoading();
				var params = {
					url: "/prod/prodInfo",
					method: "GET",
					data: {
						prodId: this.prodId // userType: 0

					},
					callBack: res => {
						this.prodInfo = res
						var imgStrs = res.imgs;
						var imgs = imgStrs.split(",");
						var content = util.formatHtml(res.content);
						this.setData({
							imgs: imgs,
							content: content,
							price: res.price,
							prodName: res.prodName,
							prodId: res.prodId,
							brief: res.brief,
							totalStocks: res.totalStocks,
							// skuId: res.skuId
							skuList: res.skuList,
							pic: res.pic,
							shopId: res.shopId,
							prodType: res.prodType, //商品类型(0普通商品 1拼团 2秒杀 3积分)
							deliveryModeVO: res.deliveryModeVO, // 配送方式
              isHeXiao: res.isVerification,  // 是否核销商品
							video: res.video ? res.video : '',
							liveRoomParams: res.liveRoomParams, // 直播列表
							preSellStatus: res.preSellStatus, // 预售状态 1：开启 0：未开启
							preSellTime: res.preSellTime, //预售发货时间
						})
						// 初始化视频
						if (res.video) {
							this.$nextTick(() => {
								this.videoContext = uni.createVideoContext('myVideo', this)
							})
						}
						// 团购商品
						if (res.prodType === 1) {
							this.setData({
								groupActivityId: res.activityId
							});
							this.getGroupActivity();
							// this.getJoinGroupList();
						}

						// 获取优惠券
						this.getCouponList();
						// 组装sku
						this.groupSkuProp(res.skuList, res.price);
						this.getShopInfo();
						uni.hideLoading()
					},
					errCallBack: err => {
						if (err.statusCode == 400) {
							uni.showModal({
								title: this.i18n.tips,
								content: err.data,
								showCancel: false,
								cancelText: this.i18n.cancel,
								confirmText: this.i18n.confirm,
								success: (res) => {
									if (res.confirm) {
										uni.navigateBack({
											delta: 1
										})
									}
								}
							})
						}
					}
				};
				http.request(params);
			},

			/**
			 * 获取店铺信息
			 */
			getShopInfo() {
				http.request({
					url: "/shop/headInfo",
					method: "GET",
					data: {
						shopId: this.shopId
					},
					callBack: res => {
						this.setData({
							shopInfo: res
						})
						uni.setStorageSync('shopInfo', res)
					}
				});
			},

			getProdCommData() {
				http.request({
					url: "/prod/prodCommData",
					method: "GET",
					data: {
						prodId: this.prodId
					},
					callBack: res => {
						this.setData({
							prodCommData: res
						});
					}
				});
			},

			// 获取部分评论
			getLittleProdComm() {
				if (this.prodCommPage.records.length) {
					return;
				}

				this.getProdCommPage();
			},

			getMoreCommPage(e) {
				this.getProdCommPage();
			},

			/**
			 * 获取分页获取评论
			 */
			getProdCommPage(e) {
				if (e) {
					if (e.currentTarget.dataset.evaluate === this.evaluate) {
						return;
					}
					util.tapLog()

					this.setData({
						prodCommPage: {
							current: 0,
							pages: 0,
							records: []
						},
						evaluate: e.currentTarget.dataset.evaluate
					});
				}

				http.request({
					url: "/prod/prodCommPageByProd",
					method: "GET",
					data: {
						prodId: this.prodId,
						size: 10,
						current: this.prodCommPage.current + 1,
						evaluate: this.evaluate
					},
					callBack: res => {
						res.records.forEach(item => {
							if (item.pics) {
								item.pics = item.pics.split(',');
							}
						});
						let records = this.prodCommPage.records;
						records = records.concat(res.records);
						this.setData({
							prodCommPage: {
								current: res.current,
								pages: res.pages,
								records: records
							}
						}); // 如果商品详情中没有评论的数据，截取两条到商品详情页商品详情

						if (!this.littleCommPage.length) {
							this.setData({
								littleCommPage: records.slice(0, 2)
							});
						}
					}
				});
			},

			/**
			 * 评论小图点击事件(点击图片显示大图)
			 */
			clickImg: function(e) {
				const current = e.currentTarget.dataset.src //获取当前点击的 图片 url
				var pics = e.currentTarget.dataset.pics
				// #ifndef APP-PLUS
				var urls = pics.indexOf(',') > -1 ? pics.split(',') : [pics]
				// #endif
				// #ifdef APP-PLUS
				var urls = pics
				// #endif
				// #ifndef MP-WEIXIN
				uni.previewImage({
					current: current,
					urls: urls
				})
				// #endif
				// #ifdef MP-WEIXIN
				wx.previewImage({
					current: current,
					urls: pics
				})
				// #endif
			},


			getCouponList() {
				http.request({
					url: "/coupon/listByProdId",
					method: "GET",
					data: {
						prodId: this.prodId,
						shopId: this.shopId
					},
					callBack: res => {
						this.setData({
							couponList: res
						});
					}
				});
			},

			/**
			 * 团购商品详情信息
			 */
			getGroupActivity() {
				http.request({
					url: "/groupProd/info",
					method: "GET",
					data: {
						prodId: this.prodId,
						groupActivityId: this.groupActivityId
					},
					callBack: res => {
						if (res.success) {
							this.setData({
								groupActivity: res.obj,
								maxNum: res.obj.maxNum,
								hasMaxNum: res.obj.hasMaxNum
							});
							if (res.obj.hasGroupTip) {
								this.getJoinGroupList()
							}
							this.setDefaultGroupSku();
							this.groupActivityCountdown(res.obj);
						} else {
							this.setData({
								groupActivityId: null
							});
						}
					}
				});
			},

			// 团购倒计时
			groupActivityCountdown(groupActivity) {
				let endOfGroupTime; // activityStatus 1 未开始

				if (groupActivity.activityStatus === 1) {
					// endOfGroupTime = util.endOfStartTime(util.dateToTimestamp(groupActivity.startTime), new Date().getTime());
					endOfGroupTime = util.endOfStartTime(new Date().getTime(), util.dateToTimestamp(groupActivity.startTime));
				} else {
					endOfGroupTime = util.endOfStartTime(new Date().getTime(), util.dateToTimestamp(groupActivity.endTime));
				}
				if (this.endOfGroupTime.signs == 0) {
					clearTimeout(this.joinGroupListTimer);
					clearTimeout(this.endOfGroupTimer);
					// 拼团结束，刷新当前页面
					uni.redirectTo({
						url: '/pages/prod/prod?prodid=' + this.prodId
					})
					return
				}
				this.setData({
					endOfGroupTime: endOfGroupTime,
					endOfGroupTimer: setTimeout(() => this.groupActivityCountdown(groupActivity), 1000)
				});
			},

			// 可加入的拼团列表
			getJoinGroupList() {
				http.request({
					url: "/groupProd/joinGroupList",
					method: "GET",
					data: {
						prodId: this.prodId,
						groupActivityId: this.groupActivityId,
						showSize: 3
					},
					callBack: res => {
						this.setData({
							joinGroupList: res
						});
						this.joinGroupListCountdown(res);
					}
				});
			},

			joinGroupListCountdown(joinGroupList) {
				joinGroupList.forEach(item => {
					item.endOfGroupTime = util.endOfStartTime(new Date().getTime(), util.dateToTimestamp(item.endTime));
					if (!item.endOfGroupTime.signs) {
						uni.redirectTo({
							url: '/pages/prod/prod?prodid=' + this.prodId
						})
					}
				});
				this.setData({
					joinGroupList: joinGroupList,
					joinGroupListTimer: setTimeout(() => this.joinGroupListCountdown(joinGroupList), 1000)
				});
			},

			/**
			 * 组装SKU
			 */
			groupSkuProp: function(skuList, defaultPrice) {
				if (skuList.length == 1 && skuList[0].properties == "") {
					this.defaultSku = skuList[0]
					this.setDefaultGroupSku();
					return;
				}
				var skuGroup = {};
				var allProperties = [];
				var propKeys = [];
				var selectedPropObj = {}
				var defaultSku = null;
				for (var i = 0; i < skuList.length; i++) {
					var isDefault = false;
					if (!defaultSku && skuList[i].price == defaultPrice) { //找到和商品价格一样的那个SKU，作为默认选中的SKU
						defaultSku = skuList[i];
						isDefault = true;
					}
					var properties = skuList[i].properties; //版本:公开版;颜色:金色;内存:64GB
					allProperties.push(properties);
					var propList = properties.split(";"); // ["版本:公开版","颜色:金色","内存:64GB"]

					for (var j = 0; j < propList.length; j++) {

						var propval = propList[j].split(":"); //["版本","公开版"]
						var props = skuGroup[propval[0]]; //先取出 版本对应的值数组

						//如果当前是默认选中的sku，把对应的属性值 组装到selectedProp
						if (isDefault) {
							propKeys.push(propval[0]);
							selectedPropObj[propval[0]] = propval[1];
						}

						if (props == undefined) {
							props = []; //假设还没有版本，新建个新的空数组
							props.push(propval[1]); //把 "公开版" 放进空数组
						} else {
							if (props.indexOf(propval[1]) === -1) { //如果数组里面没有"公开版"
								props.push(propval[1]); //把 "公开版" 放进数组
							}
						}
						skuGroup[propval[0]] = props; //最后把数据 放回版本对应的值
					}
				}
				this.defaultSku = defaultSku
				this.propKeys = propKeys
				this.selectedPropObj = selectedPropObj
				this.parseSelectedObjToVals(skuList);
				this.skuGroup = skuGroup
				this.allProperties = allProperties
				this.setDefaultGroupSku();
			},

			/**
			 * 将已选的 {key:val,key2:val2}转换成 [val,val2]
			 */
			parseSelectedObjToVals: function(skuList) {
				var selectedPropObj = this.selectedPropObj
				var selectedProperties = "";
				var selectedProp = [];
				for (var key in selectedPropObj) {
					selectedProp.push(selectedPropObj[key]);
					selectedProperties += key + ":" + selectedPropObj[key] + ";";
				}
				selectedProperties = selectedProperties.substring(0, selectedProperties.length - 1);
				this.selectedProp = selectedProp
				this.selectedProperties = selectedProperties
				this.selectedPropObj = selectedPropObj

				var findSku = false;
				for (var i = 0; i < skuList.length; i++) {
					if (skuList[i].properties == selectedProperties) {
						findSku = true;
						this.defaultSku = skuList[i]
						break;
					}
				}
				this.findSku = findSku
				this.setDefaultGroupSku();
			},

			/**
			 * 判断当前的规格值 是否可以选
			 */
			isSkuLineItemNotOptional(allProperties, selectedPropObj, key, item, propKeys) {
				var selectedPropObj = Object.assign({}, selectedPropObj)
				var properties = "";
				selectedPropObj[key] = item;
				for (var j = 0; j < propKeys.length; j++) {
					properties += propKeys[j] + ":" + selectedPropObj[propKeys[j]] + ";";
				}
				properties = properties.substring(0, properties.length - 1);
				for (var i = 0; i < allProperties.length; i++) {
					if (properties == allProperties[i]) {
						return false;
					}
				}
				for (var i = 0; i < allProperties.length; i++) {
					if (allProperties[i].indexOf(item) >= 0) {
						return true;
					}
				}
				return false;
			},

			/**
			 * 规格点击事件
			 */
			toChooseItem(skuLineItem, key, event) {
				util.tapLog()
				this.selectedPropObj[key] = skuLineItem;
				this.parseSelectedObjToVals(this.skuList);
			},

			//判断数组是否包含某对象
			array_contain: function(array, obj) {
				for (var i = 0; i < array.length; i++) {
					if (array[i] == obj) //如果要求数据类型也一致，这里可使用恒等号===
						return true;
				}
				return false;
			},
			/**
			 * 设置选中的拼团sku
			 */
			setDefaultGroupSku() {
				if (this.groupActivityId) {
					var groupSkuList = this.groupActivity.groupSkuList;

					if (groupSkuList) {
						for (var i = 0; i < groupSkuList.length; i++) {
							if (groupSkuList[i].properties == this.selectedProperties) {
								this.setData({
									detaultGroupSku: groupSkuList[i]
								});
								break;
							}
						}
					}
				}
			},

			/**
			 * 去凑团
			 */
			toSpellGroupDetail(e) {
				util.tapLog()
				const groupTeamId = e.currentTarget.dataset.groupteamid
				util.checkAuthInfo(() => {
					uni.navigateTo({
						url: '/packageActivities/pages/spellGroupDetails/spellGroupDetails?groupTeamId=' + groupTeamId
					})
				})
			},

			/**
			 * 跳转到首页
			 */
			toHomePage: function() {
				util.tapLog()
				this.$Router.pushTab('/pages/index/index')
			},

			/**
			 * 跳转到购物车
			 */
			toCartPage: function() {
				util.tapLog()
				this.$Router.pushTab('/pages/basket/basket')
			},

			/**
			 * 加入购物车
			 */
			addToCart: function(event) {
				if (!this.findSku) {
					return;
				}
				if (!this.skuShow) {
					this.skuShow = true
					return
				}
				uni.showLoading({
					mask: true
				}); // 查看是否授权

				util.checkAuthInfo(this.callChangeItem);
			},

			callChangeItem() {
				util.tapLog(4)
				if (this.prodNum < 1) {
					uni.showToast({
						title: this.i18n.leastTips,
						icon: 'none'
					})
					this.prodNum = 1
					return
				}
				uni.showLoading({
					mask: true
				});
				http.request({
					url: "/api/v1/shopCart/changeItem",
					method: "POST",
					data: {
						basketId: 0,
						count: this.prodNum,
						prodId: this.prodId,
						shopId: this.shopId,
						shopName: this.shopName,
						skuId: this.defaultSku.skuId,
						distributionCardNo: this.distributionCardNo
					},
					callBack: res => {
						this.setData({
							totalCartNum: this.totalCartNum + this.prodNum,
							skuShow: false
						});
						uni.showToast({
							title: this.i18n.successfullyAddedCart,
							icon: "none"
						});
					}
				});
			},

			/**
			 * 立即购买
			 */
			buyNow: function() {
				util.tapLog()
				if (!this.findSku) {
					return;
				}
				if (!this.skuShow) {
					this.skuShow = true
					return
				}
				if (this.prodNum < 1) {
					uni.showToast({
						title: this.i18n.leastTips,
						icon: 'none'
					})
					this.prodNum = 1
					return
				}
				if (!this.defaultSku.stocks || this.defaultSku.stocks < this.prodNum) {
					uni.showToast({
						title: this.i18n.insufficientStock,
						icon: 'none',
					})
					return
				}
				uni.showLoading({
					mask: true
				});
				// 查看是否授权
				util.checkAuthInfo(() => {
					uni.setStorageSync("orderItem", JSON.stringify({
						prodId: this.prodId,
						skuId: this.defaultSku.skuId,
						prodCount: this.prodNum,
						shopId: this.shopId,
						distributionCardNo: this.distributionCardNo
					}))
					uni.navigateTo({
						url: '/pages/submit-order/submit-order?orderEntry=1'
					})
				});
			},

			/**
			 * 减数量
			 */
			onCountMinus: function() {
				util.tapLog()
				var prodNum = this.prodNum;
				if (prodNum > 1) {
					this.setData({
						prodNum: prodNum - 1
					});
				}
			},

			/**
			 * 加数量
			 */
			onCountPlus: function() {
				util.tapLog()
				var prodNum = parseInt(this.prodNum); // 取整数
				// 判断是否限购
				if (this.hasMaxNum && this.skuShowType == 1) {
					if (prodNum < this.defaultSku.stocks && prodNum < this.maxNum) {
						this.setData({
							prodNum: prodNum + 1
						});
					} else if (prodNum <= this.defaultSku.stocks && this.defaultSku.stocks < this.maxNum) {
						uni.showToast({
							title: this.i18n.insufficientStock,
							icon: 'none',
							duration: 1000,
							mask: true
						})
					} else {
						uni.showToast({
							title: this.i18n.purchaseLimit + this.maxNum + this.i18n.piece,
							icon: 'none'
						});
					}
				} else {
					if (prodNum < this.defaultSku.stocks) {
						this.setData({
							prodNum: prodNum + 1
						});
					} else {
						uni.showToast({
							title: this.i18n.insufficientStock,
							icon: 'none',
							duration: 1000,
							mask: true
						})
					}
				}
			},

			/**
			 * 优惠券
			 */
			showPopup: function() {
				util.tapLog()
				if (this.loadCouponIds) {
					this.setData({
						popupShow: true,
					});
					return;
				}

				http.request({
					url: "/api/v1/myCoupon/listCouponIds",
					method: "GET",
					data: {},
					callBack: myCouponList => {
						var couponList = this.couponList;
						couponList.forEach(coupon => {
							if (myCouponList && myCouponList.length) {
								// 领取该优惠券数量
								var couponLimit = 0
								// 改用户是否有可以使用的优惠券
								var isMyUseCoupon = false
								myCouponList.forEach(myCouponItem => {
									if (myCouponItem.couponId == coupon.couponId) {
										couponLimit = couponLimit + myCouponItem.curUserReceiveCount
										if (myCouponItem.status == 1 && myCouponItem.curUserReceiveCount > 0) {
											isMyUseCoupon = true
										}
									}
								});

								// 判断用户是否到达领取优惠券上限
								if (couponLimit >= coupon.limitNum || coupon.stocks == 0) {
									coupon.canReceive = false
									// 判断领取优惠券到达上限后,该种优惠券如果没有可用优惠券,则不可领取和使用
									if (isMyUseCoupon == false) {
										coupon.canUse = false
									} else {
										coupon.canUse = true
									}
								} else {
									coupon.canUse = true
									coupon.canReceive = true
								}
							} else {
								coupon.canUse = true
								coupon.canReceive = true
							}
						});
						this.setData({
							couponList: couponList,
							popupShow: true,
							loadCouponIds: true
						});
					}
				});
			},
			showSku: function(e) {
				util.tapLog()
				if (e.currentTarget.dataset.alonebuy == 1) {
					this.setData({
						skuShow: true,
						skuShowType: 0
					});
				} else {
					if (this.groupActivityId) {
						this.setData({
							skuShow: true,
							skuShowType: 1
						});
					} else {
						this.setData({
							skuShow: true,
							skuShowType: 0
						});
					}
				}
			},
			showGroupSku: function() {
				util.tapLog()
				if (this.isPlaying) {
					this.stopPlay()
				}
				if (this.groupActivity.activityStatus === 1) {
					uni.showToast({
						title: this.i18n.actNotBegin,
						icon: 'none',
					})
					return
				}
				this.setData({
					skuShow: true,
					skuShowType: 1
				});
			},
			showComment: function(e) {
				util.tapLog()
				this.setData({
					commentShow: true,
					evaluate: e,
					prodCommPage: {
						current: 0,
						pages: 0,
						records: []
					},
				});
				this.getProdCommPage();
			},
			closePopup: function() {
				util.tapLog()
				this.setData({
					popupShow: false,
					skuShow: false,
					commentShow: false
				});
			},
			onShowShare: function() {
				util.tapLog()
				this.setData({
					shareShow: true
				});
			},
			closeEarn: function() {
				util.tapLog()
				this.setData({
					shareShow: false
				});
			},
			toDistCenterPage: function() {
				uni.navigateTo({
					url: '/packageDistribution/pages/dis-center/dis-center'
				});
			},

			/**
			 * 生成小程序二维码
			 */
			genWeixinCode() {
				uni.showLoading({
					mask: true
				});
				var cardNo = wx.getStorageSync("distCardNo");
				var content = JSON.stringify({
					shareProdId: this.prodId,
					cardNo: cardNo
				});
				console.log(content);
				http.request({
					url: "/qrcodeTicket/miniQrCode",
					method: "GET",
					responseType: 'arraybuffer',
					data: {
						content: content,
						type: 2
					},
					callBack: res => {
						// 微信小程序

						// #ifdef MP-WEIXIN
						this.setData({
						wxCodeShow: true,
						shareShow: false,
						shareWxCode: "data:image/jpg;base64," + wx.arrayBufferToBase64(res)
						});
						uni.hideLoading();
						// #endif
						
						// #ifdef H5 || APP-PLUS
						cardNo = uni.getStorageSync("distCardNo");
						let code =`${config.domain.replace('\/api','')}/pages/prod/prod?prodid=${this.prodId}&cardno=${cardNo}`
						this.shareWxCode = Qr.createQrCodeImg(code, {size: 250});
						console.log(code);
						this.wxCodeShow = true;
						this.shareShow = false
						uni.hideLoading();
						// #endif

					}
				});
			},

			/**
			 * 关闭二维码弹窗
			 */
			closeCodePopup() {
				util.tapLog()
				this.setData({
					wxCodeShow: false
				});
			},

			/**
			 * 保存图片至相册
			 */
			downloadImg() {
				util.tapLog()
				uni.showLoading({
					mask: true
				});
				var cardno = wx.getStorageSync("distCardNo");
				wx.downloadFile({
					header: {
						'Authorization': wx.getStorageSync('token')
					},
					url: config.domain + "/api/v1/distribution/qrCode/invitation?page=pages/prod/prod&scene=" + this.prodId + ',' +
						cardno,
					success: (res) => {
						uni.hideLoading() //图片保存到本地
						wx.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: (data) => {
								uni.showToast({
									title: this.i18n.savedSuccessfully,
									icon: 'none',
									duration: 2000
								});
							},
							fail: function(err) {
								wx.openSetting({
									success(settingdata) {
										if (settingdata.authSetting['scope.writePhotosAlbum']) {} else {}
									}
								});
							},
							complete(res) {}
						});
					}
				});
			},

			/**
			 * 用户点击分享到微信小程序
			 * @param {Object} sharedata 支付需要的参数
			 * @param {Object} cb 成功回调
			 * @param {Object} errorCb 失败回调
			 */
			onShareWay() {
				var cardno = wx.getStorageSync("distCardNo");
				var sharedata = {
					title: this.prodName, // 分享标题
					imgUrl: this.imgs[0], // 分享图标
					link: config.domain.replace('/api', '') + '/pages/prod/prod?prodid=' + this.prodId + '&cardno=' + cardno, // 分享链接
					desc: this.brief ? this.brief : this.i18n.shartTips, // 分享描述
					type: '', // 分享类型,music、video或link，不填默认为link
					dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
				};
				Wechat.callWexinShare(sharedata, () => {
					this.shareShow = false
					this.guideShare = true
				}, (failMsg) => {
					console.log(failMsg)
				})
			},

			/**
			 * 获取用户信息
			 */
			onGotUserInfo: function(e) {
				if (e.detail.errMsg != "getUserInfo:fail auth deny") {
					this.setData({
						isAuthInfo: true
					});
					http.updateUserInfo();
				}
			},

			/**
			 * 确认开团
			 */
			groupConfirmOrder: function(e) {
				util.tapLog()
				if (!this.findSku) {
					return;
				}
				if (this.groupActivity.activityStatus === 1) {
					uni.showToast({
						title: this.i18n.actNotBegin,
						icon: 'none',
					})
					return
				}
				if (this.prodNum < 1) {
					uni.showToast({
						title: this.i18n.leastTips,
						icon: 'none'
					})
					this.prodNum = 1
					return
				}
				if (this.prodNum > this.defaultSku.stocks) {
					uni.showToast({
						title: this.i18n.insufficientStock,
						icon: 'none',
						duration: 1000,
						mask: true
					})
					return
				}
				uni.showLoading({
					mask: true
				});
				this.setData({
					teamId: e.currentTarget.dataset.teamid
				}); // 查看是否授权

				util.checkAuthInfo(() => {
					uni.setStorageSync("groupOrderItem", JSON.stringify({
						groupSkuId: this.detaultGroupSku.groupSkuId,
						prodCount: this.prodNum,
						groupTeamId: this.teamId
					}));
					uni.navigateTo({
						url: '/packageActivities/pages/groupConfirmOrder/groupConfirmOrder'
					});
				});
			},

			/**
			 * 跳转到店铺页
			 */
			toShopPage: function() {
				util.tapLog()
				uni.navigateTo({
					url: this.shopInfo.renovationId ? '/packageShop/pages/feature-index/feature-index0?shopId=' + this.shopInfo.shopId +
						'&renovationId=' + this.shopInfo.renovationId : '/packageShop/pages/shopPage/shopPage?shopId=' + this.shopInfo
						.shopId
				});
			},

			/**
			 * 通过商品id获取商品所有促销活动
			 */
			getPordDiscountList() {
				http.request({
					url: "/marking/discount/getDiscountByProdId",
					method: "GET",
					data: {
						prodId: this.prodId
					},
					callBack: res => {
						this.setData({
							prodDiscountList: res
						});
					}
				});
			},
			/**
			 * 促销活动弹窗
			 */
			clickDiscount: function() {
				this.showDiscountPopup = !this.showDiscountPopup
			},

			/**
			 * 视频的方法
			 */
			videoOper() {
				if (this.isPlaying) {
					this.stopPlay()
				} else {
					this.startPlay()
				}
			},
			playEnd() {
				this.stopPlay()
			},

			startPlay() {
				this.setData({
					isPlaying: true,
				})
				setTimeout(() => {
					this.videoContext.seek(0)
					this.videoContext.play()
				}, 200)
			},
			stopPlay() {
				this.setData({
					isPlaying: false
				})
				setTimeout(() => {
					this.videoContext.seek(0)
					this.videoContext.stop()
				}, 200)
			},

			/**
			 * 分享方法
			 */
			handleShare() {
				// #ifdef H5

				// #endif
				// #ifdef APP-PLUS

				// #endif
			},

			/**
			 * 回到页面顶部
			 */
			hanldeScorllTop() {
				uni.pageScrollTo({
					duration: 100,
					scrollTop: 0
				})
			},

			/**
			 * 前往直播页面
			 */
			toLivePage: function(e) {
				console.log(e)
				this.roomId = e.currentTarget.dataset.roomid // 填写具体的房间号
				this.url = e.currentTarget.dataset.url
				util.checkAuthInfo(this.toLivePlayer)
			},
			toLivePlayer: function() {
				console.log(this.isWechat)
				let roomId = this.roomId
				let url = this.url
				console.log('roomId:', roomId, '，', 'url:', url)
				if (this.isWechat) {
					if (this.liveRoomParams.length == 1) {
						// 开发者在直播间页面路径上携带自定义参数（如示例中的path和pid参数），后续可以在分享卡片链接和跳转至商详页时获取
						let customParams = encodeURIComponent(JSON.stringify({
							path: url
						}))
						console.log('customParams:', customParams)
						wx.navigateTo({
							url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}&custom_params=${customParams}`
						}) // 其中wx2b03c6e691cd7370是直播组件appid不能修改
					} else {
						wx.navigateTo({
							url: '/pages/liveBroadcast/liveBroadcast?prodId=' + this.prodId,
						})
					}
				} else {
					uni.showToast({
						title: this.i18n.pleaseOpenInWechat,
						icon: 'none'
					})
				}
			}

		}
	};
</script>
<style>
	@import "./prod.css";
</style>
