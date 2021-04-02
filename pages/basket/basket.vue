<template>
	<!--pages/basket/basket.wxml-->
	<view class="container">
		<u-navbar  title="購物車" title-color="#000000">
			<view class="administration" v-show="flag" @click="flag = false">管理</view>
			<view class="administration" v-show="!flag" @click="flag = true">完成</view>
		</u-navbar>
		<view class="prod-list" v-for="(shopCarta, topIndexa) in 2" :key="topIndexa">
			<view v-for="(shopCart, topIndex) in shopCartOrders" :key="topIndex" class="shop-item">
				<!-- 头部店铺 -->
				<view class="head-shop">
					<view class="btn choose-btn">
						<label>
							<checkbox @tap="onSelectedShopItem" :data-topindex="topIndex" :checked="shopCart.checked" color="#E43130"></checkbox>
						</label>
					</view>
					<view class="shop-box">
						<view class="shop-icon">
							<image src="../../static/images/proneler/redhome.png"></image>
						</view>
						<view class="shop-name">爱壹家官方旗舰店</view> 
						<view class="" style="margin-left: 10rpx;">
							<u-icon name="arrow-right" color="#999999" size="28"></u-icon>
						</view>
					</view>
				</view>
				<!-- /头部店铺 --> 
				<view v-for="(item, scIndex) in shopCart.shopCartItemDiscounts" :key="scIndex">
					<view :class="'prod-block ' + (item.chooseDiscountItemDto?'discount':'')">
						<!-- 满减提示 -->
						<view class="discount-tips" v-if="item.chooseDiscountItemDto">
							<text class="text-block">{{wxs.parseDiscount(item.chooseDiscountItemDto.discountRule,curLang)}}</text>
							<text class="text-list">{{wxs.parseDiscountMsg(item.chooseDiscountItemDto.discountRule,item.chooseDiscountItemDto.needAmount,item.chooseDiscountItemDto.discount,curLang)}}</text>
							<text class="text-list reduce-amount" v-if="item.chooseDiscountItemDto.reduceAmount >0">{{i18n.haveDiscount}}￥{{wxs.parsePrice(item.chooseDiscountItemDto.reduceAmount)[0]}}.{{wxs.parsePrice(item.chooseDiscountItemDto.reduceAmount)[1]}}</text>
						</view>

						<!-- 商品item -->
						<view v-for="(prod, index) in item.shopCartItems" :key="index">
							<view class="goods-item">
								<!-- 商品信息 -->
								<view class="item">
									<view class="btn">
										<label>
											<checkbox @tap="onSelectedItem" :data-topindex="topIndex" :data-scindex="scIndex" :data-index="index" :value="toString(prod.prodId)"
											 :checked="prod.checked" color="#E43130"></checkbox>
										</label>
									</view>
									<view class="prodinfo">
										<view class="pic" @tap="toProdPage" :data-prodid="prod.prodId">
											<image :src="prod.pic"></image>
										</view>
										<view class="opt">
											<view class="prod-name">{{prod.prodName}}</view>
											<view class="prod-center-row">
												<view :class="'prod-info-text ' + (prod.skuName?'':'empty-n')">{{prod.skuName}}</view>
												<view class="prod-discount" v-if="prod.discounts.length>0">
													<text class="prod-discount-tit" @tap="onChooseDiscount(prod.basketId,prod.discountId,prod.discounts,prod.checked)">{{wxs.getCurrDiscountName(prod.discountId,prod.discounts,curLang)}}</text>
												</view>
											</view>
											<view class="price-count">
												<view class="price" style="color: #FA2033;">
													<text class="symbol" >HK$</text>
													<text class="big-num">{{wxs.parsePrice(prod.price)[0]}}</text>
													<text class="small-num">.{{wxs.parsePrice(prod.price)[1]}}</text>
												</view>
												<view class="m-numSelector">
													<view @tap="onCountMinus" class="minus" :data-topindex="topIndex" :data-scindex="scIndex" :data-index="index"></view>
													<input type="number" :value="prod.prodCount" disabled></input>
													<view @tap="onCountPlus" class="plus" :data-topindex="topIndex" :data-scindex="scIndex" :data-index="index"></view>
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
        <!--猜你喜欢 -->
		<view class="guess-like">
			<view class="like-top">
				<view class=""><image style="width: 138rpx; height: 28rpx;"   src="../../static/images/proneler/love-left.png" mode="aspectFit"></image></view>
				<view class="like-top-title" >猜你喜欢</view>
				<view class=""><image style="width: 138rpx; height: 28rpx;" src="../../static/images/proneler/love-right.png" mode="aspectFit"></image></view>
			</view>
			<view class="like-body">
				<view class="like-body-box" v-for="(item,index) in 10 " :key="index">
					<view class="">
					 <image style="width: 346rpx;height: 346rpx;" src="../../static/images/proneler/shoping-img.png" mode=""></image>	
					</view>
					<view class="text-title">
						<view class="eplice">羽绒服男冬季保暖加绒羽绒衣情...</view>
						<view class="sales-volume">月销2333</view>
						<view class="price-flex">
							<view class="price-flex-left">
								<text style="font-size: 20rpx;">HK$</text>1999.00
							</view>
							<view class="price-flex-right">HK$1999.00</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 底部按钮 -->
		<!-- 英文时候购物车底部字体出现遮蔽 -->
		<view class="cart-footer" v-if="shopCartOrders.length>0" :style="i18n.instantReduction.length>2?'height:130rpx':''">
			<view class="btn all">
				<label @tap="onSelAll">
					<checkbox :checked="allChecked" ></checkbox>全选
				</label> 
			</view>
			<view v-show="flag" class="btn del" @tap="onDelBasket">
				<text>(已选2件)</text>
			</view>
			<view class="btn total" v-show="flag">
				<view class="total-con" @tap.stop="showPriDet">
					<view class="finally">
						<text class="blod">合计:</text>
						<view class="price">
							<text class="symbol">HK$</text>
							<text class="big-num">{{wxs.parsePrice(finalMoney)[0]}}</text>
							<text class="small-num">.{{wxs.parsePrice(finalMoney)[1]}}</text>
						</view>
					</view>
					<!-- <view class="total-msg" v-if="subtractMoney>0">{{i18n.instantReduction}}:￥{{wxs.toPrice(subtractMoney)}}</view> -->
					<!-- 总额:￥{{wxs.toPrice(totalMoney)}}  -->
				</view>
				<!-- <view class="arrow-icon" @tap.stop="showPriDet">
					<image src="../../static/images/icon/down-arrow.png" v-if="hidePriModal"></image>
					<image src="../../static/images/icon/up-arrow.png" v-if="!hidePriModal"></image>
				</view> -->
			</view>
			<view class="" style="display: flex;">
				<view v-show="!flag" class="btn settle" @tap="toFirmOrder">
					<text>加入收藏</text>
				</view>
				<view v-show="!flag" class="btn settle " style="background-color: #808080;" @tap="toFirmOrder">
					<text>删除</text>
				</view>
			</view>
			<view v-show="flag" class="btn settle" @tap="toFirmOrder">
				<text>结算</text>
			</view>
		</view>
		<!-- end 底部按钮 -->

		<!-- 底部活动选择弹框 -->
		<view class="modals modals-bottom-dialog" :hidden="hideModal">
			<view class="modals-cancel" @tap="hideModalFun"></view>
			<view class="bottom-dialog-body bottom-pos radius" :animation="animationData">
				<view class="discount-title radius">{{i18n.selectPromotion}}</view>
				<view class="radio-group">
					<radio-group @change="radioChange" v-if="reDraw">
						<label v-for="(item, index) in prodDiscounts" :key="index">
							<view class="radio-item">
								<radio color="#e43130" :value="String(item.discountId)" :checked="item.discountId==discountId"></radio>
								<view class="radio-text">
									{{item.discountName}}
								</view>
							</view>
						</label>
						<label>
							<view class="radio-item">
								<radio color="#e43130" value="-1" :checked="discountId==-1"></radio>
								<view class="radio-text">
									{{i18n.notPromotion}}
								</view>
							</view>
						</label>
					</radio-group>
				</view>
			</view>
		</view>

		<!-- 底部金额明细弹框 -->
		<view class="pri-modal modals-bottom-dialog" :hidden="hidePriModal">
			<view class="modals-cancel" @tap="hidePriModalFun"></view>
			<view class="bottom-dialog-box bottom-pos radius" :animation="animationData">
				<view class="discount-title radius">{{i18n.amountDetails}}</view>
				<view class="price-detail">
					<view class="price-detail-item">
						<view class="det-tit">{{i18n.comTotal}}</view>
						<view class="det-num">￥{{wxs.toPrice(totalMoney)}}</view>
					</view>
					<view class="price-detail-item" v-if="subtractMoney > 0">
						<view class="det-tit">{{i18n.promotionalDiscount}}</view>
						<view class="det-num">-￥{{wxs.toPrice(subtractMoney)}}</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 空 -->
		<view class="empty" v-if="!shopCartOrders.length">
			<view class="empty-icon">
				<image src="/static/images/icon/empty-basket.png"></image>
			</view>
			<view class="empty-text">{{i18n.shoppingTips}}</view>
		</view>

		<!-- 商品配送方式选择 -->
		<view class="select-distribution modals-bottom-dialog" v-if="showDeliveryWay">
			<view class="modals-cancel" @tap="hideDeliveryFun"></view>
			<view class="bottom-dialog-box bottom-pos radius" :animation="animationData">
				<view class="discount-title radius">{{i18n.chooseCom}}</view>
				<view class="distribution-prods">
					<view class="des">{{i18n.deliveryTips}}</view>
					<view class="p-item" v-if="hasShopDeliveryList.length > 0">
						<view class="p-tit">{{i18n.expressDelivery}}</view>
						<view class="p-con">
							<view class="prods-item">
								<view class="pic" v-for="(item,index) in hasShopDeliveryList" :key="index">
									<image :src="item.pic"></image>
									<view class="prod-count">x{{item.prodCount}}</view>
								</view>
							</view>
							<view class="p-btn" @tap="toSubmitOrder(1)">{{i18n.toSettle}}</view>
						</view>
						<view class="p-total">{{i18n.inTotal}}
							<!-- <view class="num">{{hasShopDeliveryList.length}}</view>{{i18n.piece}}，{{i18n.total}}：<view class="price">￥{{totalSdPri}}</view> -->
							<view class="num">{{hasShopDeliveryProdCount}}</view>
							{{i18n.items}}
						</view>
					</view>
					<view class="p-item" v-if="hasCityDeliveryList.length > 0">
						<view class="p-tit">{{i18n.sameDelivery}}</view>
						<view class="p-con">
							<view class="prods-item">
								<view class="pic" v-for="(item,index) in hasCityDeliveryList" :key="index">
									<image :src="item.pic"></image>
									<view class="prod-count">x{{item.prodCount}}</view>
								</view>
							</view>
							<view class="p-btn" @tap="toSubmitOrder(4)">{{i18n.toSettle}}</view>
						</view>
						<view class="p-total">{{i18n.inTotal}}
							<!-- <view class="num">{{hasCityDeliveryList.length}}</view>{<view class="num">{{hasCityDeliveryList.length}}</view>{{i18n.piece}}，{{i18n.total}}：<view class="price">￥{{totalCdPri}}</view> -->
							<view class="num">{{hasCityDeliveryProdCount}}</view>{{i18n.items}}
						</view>
					</view>
					<view class="p-item" v-if="hasUserPickUpList.length > 0">
						<view class="p-tit">{{i18n.pickStore}}</view>
						<view class="p-con">
							<view class="prods-item">
								<view class="pic" v-for="(item,index) in hasUserPickUpList" :key="index">
									<image :src="item.pic"></image>
									<view class="prod-count">x{{item.prodCount}}</view>
								</view>
							</view>
							<view class="p-btn" @tap="toSubmitOrder(2)">{{i18n.toSettle}}</view>
						</view>
						<view class="p-total">{{i18n.inTotal}}
							<!-- <view class="num">{{hasUserPickUpList.length}}</view>{{i18n.piece}}，{{i18n.total}}：<view class="price">￥{{totalPuPri}}</view> -->
							<view class="num">{{hasUserPickUpProdCount}}</view>{{i18n.items}}
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script module="wxs" lang="wxs" src="../../wxs/number.wxs"></script>

<script>
	// pages/basket/basket.js
	var http = require("../../utils/http.js");
	const Big = require("../../utils/big.min.js");
	import {
		AppType
	} from "../../utils/constant.js"
	import util from "../../utils/util.js";


	export default {
		data() {
			return {
				//所有店铺的数据
				flag:true,
				shopCartOrders: [],
				shopCartItemDiscounts: [],
				finalMoney: 0,
				totalMoney: 0,
				subtractMoney: 0,
				allChecked: false,
				hideModal: true, //模态框的状态  true-隐藏  false-显示
				hidePriModal: true, //金额明细模态框的状态  true-隐藏  false-显示
				animationData: {},
				prodDiscounts: [],
				discountId: 0, //促销活动id
				basketId: 0,
				currentDiscounts: [], //促销活动列表
				reDraw: true,

				showDeliveryWay: false, // 选择配送方式弹窗
				hasCityDeliveryList: [], // 同城配送
				hasShopDeliveryList: [], // 店铺配送
				hasUserPickUpList: [], // 用户自提
				totalCdPri: 0, // 同城配送总额
				totalSdPri: 0, // 店铺配送总额
				totalPuPri: 0, // 用户自提总额
				hasShopDeliveryProdCount: 0, // 店铺配送商品总数
				hasCityDeliveryProdCount: 0, // 同城配送商品总数
				hasUserPickUpProdCount: 0, // 用户自提商品总数
				dvyType: 1, // 配送类型 1:快递 2:自提 3：无需快递 4:同城配送
				requestingNum: 0,

				basketReqData: [], // 请求购物车的数据
				curBasketItemCheck: false, // 切换满减活动时商品是否勾选
				// shopSelectArr: [], // 选中的店铺
				curLang: uni.getStorageSync('lang')
			};
		},

		components: {},
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
			util.transTabbar()
		},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {}, 
		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() { 
			// #ifndef H5
			var logData = uni.getStorageSync('flowAnalysisLogDto')
			uni.setStorageSync('step', uni.getStorageSync('step') / 1 + 1)
			if (logData && logData.pageId != 8) {
				logData.pageId = 8
				logData.step = uni.getStorageSync('step')
				uni.setStorageSync('flowAnalysisLogDto', logData)
				http.saveLog(logData, 1)
			}
			// #endif
			this.showDeliveryWay = false
			if (!uni.getStorageSync('token')) {
				this.shopCartOrders = []
				util.removeTabBadge()
			}
			//加载购物车
			this.loadBasketData(null);
		},
		onHide: function() {
			this.hidePriModal = true
			this.hideModal = true
		},
		methods: {
			/**
			 * 加载购物车方法
			 * @param {Object} discountData 选择的满减活动
			 */
			loadBasketData(discountData) {
				var reqData = [];
				var shopCartIds = [];
				if (discountData) {
					reqData.push(discountData)
				}
				this.shopCartOrders.forEach(shopCart => {
					shopCart.shopCartItemDiscounts.forEach(cItems => {
						cItems.shopCartItems.forEach(pItem => {
							if (pItem.checked) {
								shopCartIds.push(pItem.basketId);
							}
						})
					})
				})
				reqData = [...this.basketReqData, ...reqData]
				uni.showLoading(); //加载购物车
				var params = {
					url: "/api/v1/shopCart/info",
					method: "POST",
					data: reqData,
					callBack: res => {
						if (res.length > 0) {
							var shopCartOrders = res;
							if (shopCartIds.length == 0) {
								this.setData({
									shopCartOrders: shopCartOrders,
								});
							} else { // 修改购物车
								var checkedLog = []
								this.shopCartOrders.forEach(shopCart => {
									shopCart.shopCartItemDiscounts.forEach(shopCartItemDiscount => {
										shopCartItemDiscount.shopCartItems.forEach(shopCartItem => {
											if (shopCartItem.checked) {
												checkedLog.push(shopCartItem.basketId)
											}
										})
									})
								})
								shopCartOrders.forEach(newShopCart => {
									newShopCart.shopCartItemDiscounts.forEach(newShopCartItemDiscount => {
										newShopCartItemDiscount.shopCartItems.forEach(shopCartItem => {
											if (checkedLog.includes(shopCartItem.basketId)) {
												shopCartItem.checked = true
											}
										})
									})
								})
								this.shopCartOrders = shopCartOrders
							}
						} else {
							this.setData({
								shopCartOrders: []
							});
						}
						this.calTotalPrice(); //计算总价
						this.checkAllSelected()
					}
				};
				http.request(params);
				http.getCartCount(); //重新计算购物车总数量
			},

			/**
			 * 结算(结算按钮)
			 */
			toFirmOrder: function() {
				if (this.basketReqData.length > 50) {
					uni.showModal({
						title: this.i18n.tips,
						content:  this.i18n.basketSelectedCount + this.basketReqData.length + this.i18n.basketCountOver,
						confirmText: this.i18n.confirm,
						showCancel: false,
						success: res => {},
						fail: () => {},
						complete: () => {}
					});
					return
				}
				var shopCartOrders = this.shopCartOrders;
				var basketIds = [];
				var selectShopId = []
				var hasCityDeliveryList = [] // 同城配送
				var hasShopDeliveryList = [] // 店铺配送
				var hasUserPickUpList = [] // 用户自提

				var hasShopDeliveryProdCount = 0 // 店铺配送商品总数
				var hasCityDeliveryProdCount = 0 // 同城配送商品总数
				var hasUserPickUpProdCount = 0 // 用户自提商品总数
				var totalCdPri = 0
				var totalSdPri = 0
				var totalPuPri = 0

				shopCartOrders.forEach(shopCart => {
					var shopCartItemDiscounts = shopCart.shopCartItemDiscounts;
					shopCartItemDiscounts.forEach(shopCartItemDiscount => {
						shopCartItemDiscount.shopCartItems.forEach(shopCartItem => {
							if (shopCartItem.checked) {
								basketIds.push(shopCartItem.basketId);
								selectShopId.push(shopCart.shopId)
								// 将商品item放入对应数组中
								if (shopCartItem.deliveryModeVO.hasCityDelivery) {
									hasCityDeliveryList.push(shopCartItem) // 同城配送
									var x = new Big(totalCdPri)
									var y = new Big(shopCartItem.price)
									totalCdPri = x.plus(y).valueOf()
									hasCityDeliveryProdCount += shopCartItem.prodCount
									// totalCdPri += shopCartItem.price
								}
								if (shopCartItem.deliveryModeVO.hasShopDelivery) {
									hasShopDeliveryList.push(shopCartItem) // 店铺配送
									var x = new Big(totalSdPri)
									var y = new Big(shopCartItem.price)
									totalSdPri = x.plus(y).valueOf()
									hasShopDeliveryProdCount += shopCartItem.prodCount
									// totalSdPri += shopCartItem.price
								}
								if (shopCartItem.deliveryModeVO.hasUserPickUp) {
									hasUserPickUpList.push(shopCartItem) // 用户自提
									var x = new Big(totalPuPri)
									var y = new Big(shopCartItem.price)
									totalPuPri = x.plus(y).valueOf()
									hasUserPickUpProdCount += shopCartItem.prodCount
									// totalPuPri += shopCartItem.price
								}
							}
						});
					});
				});

				console.log(selectShopId)
				var shopSelectArr = [...new Set(selectShopId)] // 选中的商品所在店铺去重
				console.log(shopSelectArr)

				this.totalCdPri = totalCdPri
				this.totalSdPri = totalSdPri
				this.totalPuPri = totalPuPri

				this.hasCityDeliveryProdCount = hasCityDeliveryProdCount
				this.hasShopDeliveryProdCount = hasShopDeliveryProdCount
				this.hasUserPickUpProdCount = hasUserPickUpProdCount

				this.hasShopDeliveryList = hasShopDeliveryList
				this.hasCityDeliveryList = hasCityDeliveryList
				this.hasUserPickUpList = hasUserPickUpList

				if (!basketIds.length) {
					uni.showToast({
						title: this.i18n.selectProduct,
						icon: "none"
					});
					return;
				}

				wx.setStorageSync("basketIds", JSON.stringify(basketIds));
				// 判断：多个店铺直接结算（配送方式默认快递），单个店铺根据商品判断可选择的配送方式
				if ((basketIds.length == 1 && shopSelectArr.length == 1) || shopSelectArr.length > 1) {
					// 店铺列表大于1（多店铺），直接结算
					uni.navigateTo({
						url: '/pages/submit-order/submit-order?orderEntry=0' + '&dvyType=1' //dvyType 配送类型 1:快递 2:自提 3：无需快递 4:同城配送
					});
				} else if (basketIds.length > 1 && shopSelectArr.length == 1) {
					//单个店铺
					var animation = wx.createAnimation({
						duration: 600,
						timingFunction: 'ease'
					});
					this.animation = animation;
					this.showDeliveryWay = true // 底部选择配送方式弹窗
					setTimeout(() => {
						this.fadeIn();
					}, 200);
				}
			},

			/**
			 * 单个店铺去结算
			 */
			toSubmitOrder: function(dvyType) {
				util.tapLog()
				let basketIds = []
				console.log('dvyType:', dvyType)
				if (dvyType == 1) { // 快递
					this.hasShopDeliveryList.forEach((el) => {
						basketIds.push(el.basketId)
					})
				} else if (dvyType == 4) { // 同城
					this.hasCityDeliveryList.forEach((el) => {
						basketIds.push(el.basketId)
					})
				} else if (dvyType == 2) { // 自提
					this.hasUserPickUpList.forEach((el) => {
						basketIds.push(el.basketId)
					})
				}
				console.log(basketIds)
				wx.setStorageSync("basketIds", JSON.stringify(basketIds));
				uni.navigateTo({
					url: '/pages/submit-order/submit-order?orderEntry=0' + '&dvyType=' + dvyType
				});
			},


			// 关闭配送方式选择弹窗
			hideDeliveryFun() {
				util.tapLog()
				var that = this;
				var animation = wx.createAnimation({
					duration: 800,
					timingFunction: 'ease',
				})
				this.animation = animation
				that.fadeDown();
				setTimeout(function() {
					that.setData({
						showDeliveryWay: false
					})
				}, 680)
			},


			/**
			 * 全选
			 */
			onSelAll: function() {
				util.tapLog()
				var allChecked = this.allChecked;
				allChecked = !allChecked; //改变状态

				var shopCartOrders = this.shopCartOrders;
				shopCartOrders.forEach(shopCart => {
					shopCart.checked = allChecked;
					var shopCartItemDiscounts = shopCart.shopCartItemDiscounts;
					for (var i = 0; i < shopCartItemDiscounts.length; i++) {
						var cItems = shopCartItemDiscounts[i].shopCartItems;
						for (var j = 0; j < cItems.length; j++) {
							cItems[j].checked = allChecked;
							if (allChecked) {
								this.basketReqData.push({
									basketId: cItems[j].basketId,
									discountId: '',
									isCheck: allChecked
								})
							} else {
								this.basketReqData = []
							}
						}
					}
				});
				this.setData({
					allChecked: allChecked,
					shopCartOrders: shopCartOrders
				});
				this.loadBasketData()
			},

			/**
			 * 每一项的选择事件
			 */
			onSelectedItem: function(e) {
				util.tapLog()
				var index = e.currentTarget.dataset.index; // 获取data- 传进来的index
				var scindex = e.currentTarget.dataset.scindex;
				var topindex = e.currentTarget.dataset.topindex;
				var shopCartOrders = this.shopCartOrders;
				var shopCartItemDiscounts = shopCartOrders[topindex].shopCartItemDiscounts; // 获取购物车列表
				var checked = shopCartItemDiscounts[scindex].shopCartItems[index].checked; // 获取当前商品的选中状态
				shopCartItemDiscounts[scindex].shopCartItems[index].checked = !checked; // 改变状态
				this.setData({
					shopCartOrders: shopCartOrders
				});
				if (shopCartItemDiscounts[scindex].shopCartItems[index].checked) {
					this.basketReqData.push({
						basketId: shopCartItemDiscounts[scindex].shopCartItems[index].basketId,
						discountId: '',
						isCheck: true
					})
				} else {
					var sliceIndex = null
					this.basketReqData.forEach((el, index) => {
						if (!el.checked) {
							sliceIndex = index
						}
					})
					this.basketReqData.splice(sliceIndex, 1)
				}
				this.loadBasketData()
			},

			/**
			 * 每一个店铺的选择
			 */
			onSelectedShopItem: function(e) {
				util.tapLog()
				var topindex = e.currentTarget.dataset.topindex;
				var shopCartOrders = this.shopCartOrders;
				var checked = shopCartOrders[topindex].checked; // 获取当前商品的选中状
				shopCartOrders[topindex].checked = !checked; // 改变状态
				shopCartOrders[topindex].shopCartItemDiscounts.forEach(shopCartItem => {
					var cItems = shopCartItem.shopCartItems;
					for (var j = 0; j < cItems.length; j++) {
						cItems[j].checked = !checked;
					}
				});
				this.setData({
					shopCartOrders: shopCartOrders
				});
				this.checkAllSelected(); //检查全选状态
				this.calTotalPrice(); //计算总价
			},

			/**
			 * 检查全选状态
			 */
			checkAllSelected: function() {
				var allChecked = true;
				var shopCartOrders = this.shopCartOrders;
				var flag = false;
				shopCartOrders.forEach(shopCart => {
					var shopChecked = true;
					var shopCartItemDiscounts = shopCart.shopCartItemDiscounts;
					for (var i = 0; i < shopCartItemDiscounts.length; i++) {
						var cItems = shopCartItemDiscounts[i].shopCartItems;
						for (var j = 0; j < cItems.length; j++) {
							if (!cItems[j].checked) {
								shopChecked = false;
								allChecked = false;
								flag = true;
							}
							cItems[j].checked = !!cItems[j].checked
						}
					}

					shopCart.checked = shopChecked;
				});
				this.setData({
					allChecked: allChecked,
					shopCartOrders: shopCartOrders
				});
			},

			/**
			 * 计算购物车总额
			 */
			calTotalPrice: function() {
				var shopCartOrders = this.shopCartOrders;
				var shopCartIds = [];
				shopCartOrders.forEach(shopCart => {
					var shopCartItemDiscounts = shopCart.shopCartItemDiscounts;
					for (var i = 0; i < shopCartItemDiscounts.length; i++) {
						var cItems = shopCartItemDiscounts[i].shopCartItems;
						for (var j = 0; j < cItems.length; j++) {
							if (cItems[j].checked) {
								shopCartIds.push(cItems[j].basketId);
							}
						}
					}
				});
				var ths = this;

				var params = {
					url: "/api/v1/shopCart/totalPay",
					method: "POST",
					data: shopCartIds,
					callBack: function(res) {
						ths.setData({
							finalMoney: res.finalMoney,
							totalMoney: res.totalMoney,
							subtractMoney: res.subtractMoney
						});
						uni.hideLoading()
					}
				};
				http.request(params);
			},

			/**
			 * 减少数量
			 */
			onCountMinus: function(e) {
				var index = e.currentTarget.dataset.index;
				var scindex = e.currentTarget.dataset.scindex;
				var topindex = e.currentTarget.dataset.topindex;
				var shopCartOrders = this.shopCartOrders;
				var shopCartItemDiscounts = shopCartOrders[topindex].shopCartItemDiscounts;
				var prodCount = shopCartItemDiscounts[scindex].shopCartItems[index].prodCount;

				if (prodCount > 1) {
					this.updateCount(shopCartOrders, topindex, scindex, index, -1);
				}
			},

			/**
			 * 增加数量
			 */
			onCountPlus: function(e) {
				var index = e.currentTarget.dataset.index;
				var scindex = e.currentTarget.dataset.scindex;
				var topindex = e.currentTarget.dataset.topindex;
				var shopCartOrders = this.shopCartOrders;
				this.updateCount(shopCartOrders, topindex, scindex, index, 1);
			},

			/**
			 * 改变购物车数量接口
			 */
			updateCount: function(shopCartOrders, topindex, scindex, index, prodCount) {
				util.tapLog()
				var shopCartItemDiscounts = shopCartOrders[topindex].shopCartItemDiscounts;
				var ths = this;
				uni.showLoading({
					mask: true
				});
				var params = {
					url: "/api/v1/shopCart/changeItem",
					method: "POST",
					data: {
						count: prodCount,
						prodId: shopCartItemDiscounts[scindex].shopCartItems[index].prodId,
						skuId: shopCartItemDiscounts[scindex].shopCartItems[index].skuId,
						shopId: shopCartItemDiscounts[scindex].shopCartItems[index].shopId
					},
					callBack: function(res) {
						shopCartItemDiscounts[scindex].shopCartItems[index].prodCount += prodCount;
						ths.setData({
							shopCartOrders: shopCartOrders
						});
						var discountData = {
							basketId: shopCartItemDiscounts[scindex].shopCartItems[index].basketId,
							discountId: shopCartItemDiscounts[scindex].shopCartItems[index].discountId
						}
						ths.loadBasketData(discountData)
						uni.hideLoading()
					}
				};
				http.request(params);
			},

			/**
			 * 删除购物车商品
			 */
			onDelBasket: function() {
				util.tapLog()
				var ths = this;
				var shopCartOrders = this.shopCartOrders;
				var basketIds = [];
				shopCartOrders.forEach(shopCart => {
					var shopCartItemDiscounts = shopCart.shopCartItemDiscounts;
					for (var i = 0; i < shopCartItemDiscounts.length; i++) {
						var cItems = shopCartItemDiscounts[i].shopCartItems;
						for (var j = 0; j < cItems.length; j++) {
							if (cItems[j].checked) {
								basketIds.push(cItems[j].basketId);
							}
						}
					}
				});
				if (basketIds.length == 0) {
					var ths = this
					uni.showToast({
						title: ths.i18n.selectProduct,
						icon: "none"
					});
				} else {
					this.showPriDet()
					this.hideModalFun()
					this.hidePriModal = true
					uni.showModal({
						title: '',
						content: ths.i18n.deleteProductTips,
						cancelText: ths.i18n.cancel,
						confirmText: ths.i18n.confirm,
						confirmColor: "#EF103C",

						success(res) {
							if (res.confirm) {
								uni.showLoading({
									mask: true
								});
								var params = {
									url: "/api/v1/shopCart/deleteItem",
									method: "DELETE",
									data: basketIds,
									callBack: res2 => {
										uni.hideLoading()
										ths.loadBasketData();
									}
								};
								http.request(params);
							}
						}
					});
				}
			},

			/**
			 * 点击满减活动 弹窗
			 */
			onChooseDiscount(basketId, discountId, discounts, checked) {
				util.tapLog()
				this.reDraw = false
				this.setData({
					prodDiscounts: discounts,
					hideModal: false,
					discountId: discountId,
					basketId: basketId,
					curBasketItemCheck: Boolean(checked), // 当前展示满减活动的商品是否已选中
				});
				var animation = wx.createAnimation({
					duration: 600,
					timingFunction: 'ease'
				});
				this.animation = animation;
				this.reDraw = true
				setTimeout(() => {
					this.fadeIn();
				}, 200);
			},
			radioChange(e) {
				util.tapLog()
				this.loadBasketData({
					basketId: this.basketId,
					discountId: e.detail.value,
					isCheck: this.curBasketItemCheck
				});
				this.fadeDown()
				setTimeout(() => {
					this.setData({
						hideModal: true
					});
				}, 500)
				this.reDraw = false
			},

			// 隐藏遮罩层
			hideModalFun: function() {
				util.tapLog()
				this.reDraw = false
				var that = this;
				var animation = wx.createAnimation({
					duration: 800,
					timingFunction: 'ease'
				});
				this.animation = animation;
				that.fadeDown();
				setTimeout(function() {
					that.setData({
						hideModal: true
					});
				}, 720);
			},
			//动画集
			fadeIn: function() {
				this.animation.translateY(0).step();
				this.setData({
					animationData: this.animation.export() //动画实例的export方法导出动画数据传递给组件的animation属性

				});
			},
			fadeDown: function() {
				this.animation.translateY(300).step();
				this.setData({
					animationData: this.animation.export()
				});
			},

			/**
			 * 跳转到商品详情
			 */
			toProdPage(e) {
				util.tapLog()
				// uni.navigateTo({
				// 	url: '/pages/prod/prod?prodid=' + e.currentTarget.dataset.prodid
				// });
				this.$Router.push({
					path: '/pages/prod/prod',
					query: {
						prodid: e.currentTarget.dataset.prodid
					}
				})
			},


			/**
			 * 金额明细弹窗
			 */
			showPriDet() {
				util.tapLog()
				var that = this;
				if (this.hidePriModal == true) {
					this.hidePriModal = false
					var animation = wx.createAnimation({
						duration: 500,
						timingFunction: 'ease',
					})
					this.animation = animation
					setTimeout(function() {
						that.fadeIn();
					}, 100)
				} else if (this.hidePriModal == false) {
					this.hidePriModalFun()
				}
			},

			hidePriModalFun() {
				util.tapLog()
				var that = this;
				var animation = wx.createAnimation({
					duration: 800,
					timingFunction: 'ease',
				})
				this.animation = animation
				that.fadeDown();
				setTimeout(function() {
					that.setData({
						hidePriModal: true
					})
				}, 680)
			},

		}
	};
</script>
<style>
	@import "./basket.css";
</style>
