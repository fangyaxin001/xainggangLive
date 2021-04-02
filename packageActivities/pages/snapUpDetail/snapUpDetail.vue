<template>
	<view class="" v-if="countDownList[0]">

		<!-- 秒杀商品详情 -->
		<!-- pages/snapUpDetail/snapUpDetail.wxml -->
		<view class="top-goods-box">
			<!-- 商品图片 -->
			<!-- 轮播图 -->
			<!-- 轮播图 -->
			<view class="swiper-con">
				<view class="video-container" v-if="video && isPlaying">
					<video enable-progress-gesture="false" objectFit="fill" id="myVideo" @ended="playEnd" :src="video" controls></video>
				</view>
				<view class="play-btn" v-if="video" @tap="videoOper">
					<image class="play-icon" v-if="!isPlaying" src="/static/images/icon/play-red.png"></image>
					<text :class="'play-text' + isPlaying ? 'video-stop':'video-play'">{{isPlaying?this.i18n.quitPlaying: ''}}</text>
				</view>
				<swiper v-if="!isPlaying" :indicator-dots="indicatorDots" :autoplay="autoplay" :indicator-color="indicatorColor"
				 :interval="interval" :duration="duration" :indicator-active-color="indicatorActiveColor">
					<block v-for="(item, index) in imgs" :key="index">
						<swiper-item>
							<image :src="item"></image>
						</swiper-item>
					</block>
				</swiper>
			</view>
			<!-- 轮播图end -->
			<!-- 倒计时栏 -->
			<view class="countdown-box">
				<!-- 秒杀 -->
				<text class="second-kill">{{i18n.spike}}</text>
				<view class="countdown-content">
					<!-- 秒杀未开始 -->
					<view v-if="countDownList[0].type===0">
						<text class="countdown-tips">{{i18n.onlyStart}}</text>
						<text class="countdown-time"><text class="countdown-tips">{{countDownList[0].day}}</text>{{countDownList[0].hou}}{{countDownList[0].min}}{{countDownList[0].sec}}</text>
					</view>
					<!-- 秒杀在进行 -->
					<view v-if="countDownList[0].type===1">
						<text class="countdown-tips">{{i18n.onlyEnd}}</text>
						<text class="countdown-time"><text class="countdown-tips">{{countDownList[0].day}}</text>{{countDownList[0].hou}}{{countDownList[0].min}}{{countDownList[0].sec}}</text>
					</view>
					<!-- 秒杀已结束 -->
					<view v-if="countDownList[0].type===2">
						<text class="countdown-tips">{{i18n.secondKillOver}}</text>
						<text class="countdown-time"><text class="countdown-tips">{{countDownList[0].day}}</text>{{countDownList[0].hou}}{{countDownList[0].min}}{{countDownList[0].sec}}</text>
					</view>
				</view>
			</view>
			<!-- 商品信息 -->
			<view class="goods-msg">
				<!-- 标题 -->
				<view class="goods-title">{{seckilldet.prodName}}</view>
				<!-- 价格 -->
				<!-- 秒杀开始后 -->
				<view class="goods-price display">
					<text class="current-price">
						<text class="sub">￥</text>1.00 -<text class="sub">￥</text>2.00</text>
					<text class="original-price">￥2.00 - ￥3.00</text>
				</view>
				<!-- 秒杀开始前 -->
				<view class="goods-price">
					<text class="current-price">
						<text class="sub">￥</text>{{wxs.toPrice(defaultSku.seckillPrice)}}</text>
					<text class="original-price">￥{{wxs.toPrice(originalPrice)}}</text>
				</view>
				<!-- 运费 -->
				<view class="other-infor clearfix">
					<!-- <text class="freight">运费：免运费</text> -->
					<text class="inventory" v-if="seckilldet && seckilldet.seckill">{{i18n.remaining}}：{{defaultSku.seckillStocks}}</text>
				</view>
				<!-- 【秒杀】预计开始时间 -->
				<!-- <view class="expect-start">
      <text class="second-kill-icon">秒杀</text>预计 {{seckilldet.seckill.startTime}} 开始
    </view> -->
			</view>
		</view>
		<!-- 颜色 -->
		<view class="choose-color" @tap="showModal">{{i18n.select}}：
			<text v-for="(value, key) in skuGroup" :key="key">
				<block v-for="(skuItem,index) in selectedProp" :key="index">
					<text decode="true">{{index < selectedProp.length-1 ? skuItem +'，' : skuItem+'&nbsp; &nbsp;'}}</text>
				</block>
			</text>
			<view class="more-icon">
				<image src="/static/images/icon/more.png"></image>
			</view>
		</view>
		<!-- 商品详情 -->
		<view class="prod-detail">
			<view v-html="content"></view>
		</view>
		<!-- 商品详情end -->
		<!-- 底部弹框 -->
		<view class="modals" :hidden="hideModal">
			<view class="modals-cancel" @tap="hideModalFun"></view>
			<view class="bottom-dialog-body bottom-pos" :animation="animationData">
				<!-- 上部 -->
				<view class="top-content">
					<view class="top-content-img-box">
						<image :src="defaultSku.pic?defaultSku.pic:pic"></image>
					</view>
					<!-- 商品信息 -->
					<view class="goods-msg-box">
						<view class="goods-names">{{seckilldet.prodName}}</view>
						<view class="goods-prices" v-if="findSku">{{i18n.secondKillPrice}}：￥<text class="rmb-symbol">{{wxs.toPrice(defaultSku.seckillPrice)}}</text>
						</view>
						<view class="goods-prices" v-if="!findSku">{{i18n.outOfStock}}</view>
						<!-- 关闭按钮 -->
					</view>
					<view class="close-btn" @tap="hideModalFun">
						<image src="/static/images/icon/close.png"></image>
					</view>
				</view>
				<!-- 规格 -->
				<view class="sku-selectbox" v-if="seckilldet.skuList.length && seckilldet.skuList.length > 0">
					<view class="choose-color-box">
						<view class="items sku-text" v-for="(skuLine, key) in skuGroup" :key="key">
							<text class="color-txt">{{key}}</text>
							<view class="color-box">
								<text class="color-item" @click="toChooseItem(skuLineItem, key)" :class="[selectedProp.indexOf(skuLineItem) !== -1?'color-item-current':'',  isSkuLineItemNotOptional(allProperties,selectedPropObj,key,skuLineItem,propKeys)? 'dashed' : '']"
								 v-for="skuLineItem in skuLine" :key="skuLineItem">{{skuLineItem}}</text>
							</view>
						</view>
					</view>
				</view>
				<!-- 数量 -->
				<view class="quantity">
					<view class="left-text">
						<view class="left-text-top">{{i18n.purchaseQuantity}}</view>
						<view class="left-text-bottom" v-if="defaultSku">{{i18n.remaining}}{{defaultSku.seckillStocks}}{{i18n.piece}}</view>

					</view>
					<!-- 数量加减 -->
					<view class="right-choose">
						<view :class="['subtract',prodNum>1?'current-state':'']" @tap="onCountMinus">–</view>
						<view class="show-num current-state">
							<input type="number" :value="prodNum" @input="prodNumInp"></input>
						</view>
						<view class="add current-state" @tap="onCountPlus">＋</view>
					</view>
				</view>
				<!-- 确认按钮 -->
				<view :class="'confirm-btn ' + (findSku && defaultSku.seckillStocks >= prodNum && defaultSku.seckillStocks >0? '':'gray')" @tap="seckillconfirm"
				 v-if="countDownList[0].type==1">
					<view class="confirm">{{i18n.confirm}}</view>
				</view>
				<view class="confirm-btn gray" v-else>
					<view class="confirm">{{i18n.secondKillTips}}</view>
				</view>
			</view>
		</view>

		<!-- 【秒杀】立即抢购btn -->
		<view class="footer">
			<view class="foot-btn" @tap="toHomePage">
				<image src="/static/images/tabbar/homepage.png"></image>{{i18n.homepage}}
			</view>
			<view class="foot-btn" @tap="handleCustomService">
				<image src="/static/images/icon/shop-customer-service.png"></image>{{i18n.service}}
			</view>
			<view class="foot-btn buy-btn" v-if="countDownList[0].type===1" @tap="showModal">
				{{i18n.immediatelyBuy}}
			</view>
			<view class="foot-btn buy-btn retail-price-buy" v-if="countDownList[0].type===0" @tap="toProdDetailsPage">
				{{i18n.retailPricePurchase}}
			</view>
		</view>

		<!-- 直播悬浮按钮 -->
		<view class="live" v-if="liveRoomParams && liveRoomParams.length" :data-roomid="liveRoomParams[0].roomId" :data-url="liveRoomParams[0].url"
		 @tap='toLivePage'>
			<image class="earn" src="/static/images/liveBroadcast/living03.png"></image>
		</view>

	</view>
</template>

<script module="wxs" lang="wxs" src="../../../wxs/number.wxs"></script>

<script>
	// pages/snapUpDetail/snapUpDetail.js
	var http = require("../../../utils/http.js");
	var util = require("../../../utils/util.js");
	// #ifdef H5
	import Wechat from "../../../utils/wechat.js";
	// #endif
	export default {
		data() {
			return {
				isWechat: false, //是否为微信环境
				hideModal: true,
				seckillId: 0,
				seckilldet: {},
				countdown: "",
				// 秒杀倒计时
				countdownlist: [],
				// 秒杀倒计时列表
				clearTimer: null,
				originalPrice: 0,
				skuList: [],
				skuGroup: {},
				defaultSku: undefined,
				selectedProp: [],
				selectedPropObj: {},
				propKeys: [],
				allProperties: [],
				seckillPrice: 0,
				prodNum: 1,
				maxNum: 1,
				orderPath: '',
				seckillTotalStocks: 1,
				//秒杀活动剩余库存
				findSku: true,
				isAuthInfo: true,
				countDownListTimer: '',
				countDownList: "",
				animationData: "",
				content: '', // 商品详情富文本
				// 轮播图片相关
				imgs: '',
				indicatorDots: true,
				indicatorColor: '#f2f2f2',
				indicatorActiveColor: '#EF103C',
				isAuthInfo: true,
				autoplay: true,
				interval: 3000,
				duration: 1000,
				video: '', // 商品视频
				isPlaying: false,
				showBacktop: false,
				liveRoomParams: [], // 直播列表信息
				shopId: '',
				pic: "",
			};
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
			// #ifdef H5
			this.isWechat = Wechat.isWechat()
			// #endif
			// #ifdef APP-PLUS
			this.isWechat = false
			// #endif
			// #ifdef MP-WEIXIN
			this.isWechat = true
			// #endif

			this.setData({
				seckillId: options.seckillId
			});
			this.getskdet(true);
		},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			//头部导航标题
			uni.setNavigationBarTitle({
				title: this.i18n.secondsKillProductDetails
			});
		},

		/**
		 * 生命周期函数--监听页面隐藏
		 */
		onHide: function() {
			this.hideModal = true
			if (this.isPlaying) {
				this.stopPlay()
			}
		},

		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function() {
			clearTimeout(this.countDownListTimer);
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
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {},
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
				let num = Number(e.detail.value.replace(/[^\d]/g,''))
				this.prodNum = num
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
			 * 获取秒杀商品详情
			 */
			getskdet(isFirst) {
				http.request({
					url: "/seckill/prod?seckillId=" + this.seckillId,
					method: "GET",
					callBack: res => {
						let endTimeList = [];
						var objs = {};
						// 轮播图片
						var imgStrs = res.imgs;
						var imgs = imgStrs.split(",");
						objs.eTime = res.seckill.endTime;
						objs.sTime = res.seckill.startTime;
						objs.countType = null; //1表示秒杀活动正在进行,0表示秒杀活动未开始
						endTimeList.push(objs);
						this.setData({
							imgs,
							seckillTotalStocks: res.seckill.seckillTotalStocks,
							seckilldet: res,
							countdownlist: endTimeList,
							skuList: res.skuList,
							seckillPrice: res.seckill.seckillPrice,
							maxNum: res.seckill.maxNum,
							originalPrice: res.price,
							content: util.formatHtml(res.content),
							video: res.video ? res.video : '',
							liveRoomParams: res.liveRoomParams, // 直播列表
							shopId: res.shopId,
							pic: res.pic,
						});
						// 初始化视频
						if (res.video) {
							this.$nextTick(() => {
								this.videoContext = uni.createVideoContext('myVideo', this)
							})
						}
						if (isFirst) this.groupSkuProp(res.skuList, res.price); // 组装sku
						this.countdownFun();
						console.log(res)
					}
				});
			},

			// 倒计时
			countdownFun() {
				// 获取当前时间，同时得到活动结束时间数组
				let newTime = new Date().getTime();
				let endTimeList = this.countdownlist;
				let countDownArr = []; // 对结束时间进行处理渲染到页面

				endTimeList.forEach(o => {
					if (newTime - util.dateToTimestamp(o.sTime) > 0) {
						let endTime = util.dateToTimestamp(o.eTime);
						let obj = null; // 如果活动未结束，对时间进行处理
						if (endTime - newTime > 0) {
							let time = (endTime - newTime) / 1000; // 获取天、时、分、秒
							let day = parseInt(time / (60 * 60 * 24));
							let hou = parseInt(time % (60 * 60 * 24) / 3600);
							let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
							let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
							// obj = {
							// 	day: `${this.timeFormat(day)} 天`,
							// 	hou: `${this.timeFormat(hou)} 时`,
							// 	min: `${this.timeFormat(min)} 分`,
							// 	sec: `${this.timeFormat(sec)} 秒`,
							// 	type: 1 // 表示秒杀正在进行
							// };
							obj = {
								day: this.timeFormat(day) + this.i18n.day,
								hou: this.timeFormat(hou) + ':',
								min: this.timeFormat(min) + ':',
								sec: this.timeFormat(sec),
								type: 1 // 表示秒杀正在进行

							};
						} // 活动已结束
						else {
							obj = {
								day: '00',
								hou: '00',
								min: '00',
								sec: '00'
							};
						}
						countDownArr.push(obj);
					} // 活动未开始
					else {
						let startTime = util.dateToTimestamp(o.sTime);
						let time = (startTime - newTime) / 1000;
						let obj = null; // 获取天、时、分、秒

						let day = parseInt(time / (60 * 60 * 24));
						let hou = parseInt(time % (60 * 60 * 24) / 3600);
						let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
						let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
						// obj = {
						// 	day: `${this.timeFormat(day)} 天`,
						// 	hou: `${this.timeFormat(hou)} 时`,
						// 	min: `${this.timeFormat(min)} 分`,
						// 	sec: `${this.timeFormat(sec)} 秒`,
						// 	type: 0 // 表示秒杀还没开始
						// };
						obj = {
							day: this.timeFormat(day) + this.i18n.day,
							hou: this.timeFormat(hou) + ':',
							min: this.timeFormat(min) + ':',
							sec: this.timeFormat(sec),
							type: 0
						};
						countDownArr.push(obj);
					}
				}); // 渲染，然后每隔一秒执行一次倒计时函数
				this.setData({
					countDownList: countDownArr,
					countDownListTimer: setTimeout(this.countdownFun, 1000)
				});
			},

			// 小于10的格式化函数
			timeFormat(times) {
				return times < 10 ? '0' + times : times;
			},

			/**
			 * 组装SKU
			 */
			groupSkuProp: function(skuList) {
				if (skuList.length == 1 && skuList[0].properties == "") {
					this.defaultSku = skuList[0]
					return;
				}
				var skuGroup = {};
				var allProperties = [];
				var propKeys = [];
				var selectedPropObj = {}
				var defaultSku = null;
				for (var i = 0; i < skuList.length; i++) {
					var isDefault = false;
					if (!defaultSku && skuList[i].seckillPrice == this.seckillPrice) { //找到和商品价格一样的那个SKU，作为默认选中的SKU
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
			 * 规格点击事件
			 */
			toChooseItem(skuLineItem, key, event) {
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
			 * 减数量
			 */
			onCountMinus: function() {
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
				this.getskdet();
				var prodNum = this.prodNum;
				var seckillTotalStocks = this.defaultSku.seckillStocks;
				if (this.maxNum == -1) {
					// 此秒杀不限购
					if (seckillTotalStocks > 1 && prodNum < seckillTotalStocks) {
						this.setData({
							prodNum: prodNum + 1
						});
					} else {
						uni.showToast({
							title: this.i18n.insufficientStock,
							icon: 'none',
							duration: 1000,
							mask: true
						});
					}
				} else {
					// 限购
					if (seckillTotalStocks < 1 || seckillTotalStocks <= prodNum ) {
						uni.showToast({
							title: this.i18n.insufficientStock,
							icon: 'none',
							duration: 1000,
							mask: true
						});
						return
					}
					if (prodNum < this.maxNum) {
						// 数量未达限购数量
						this.setData({
							prodNum: prodNum + 1
						});
					} else {
						uni.showToast({
							title: this.i18n.purchaseLimit + this.maxNum + this.i18n.piece,
							icon: 'none',
							duration: 1000,
							mask: true
						});
					}
				}
			},

			// 确认秒杀商品
			seckillconfirm() {
				if (!this.findSku) {
					return;
				}
				if (!this.defaultSku.seckillStocks || this.defaultSku.seckillStocks < this.prodNum) {
					uni.showToast({
						title: this.i18n.insufficientStock,
						icon: 'none',
						duration: 1000,
						mask: true
					});
					return
				}
				if (this.prodNum < 1 || !this.prodNum) {
					uni.showToast({
						title: this.i18n.leastTips,
						icon: 'none',
						duration: 2000
					});
					return;
				}
				if (this.maxNum!=-1 && this.prodNum > this.maxNum) {
					uni.showToast({
						title: this.i18n.purchaseLimit + this.maxNum + this.i18n.piece,
						icon: 'none',
						duration: 1000,
						mask: true
					});
					return
				}
				var secKillObj = {};
				secKillObj.addrId = 0;
				secKillObj.prodCount = this.prodNum;
				secKillObj.seckillSkuId = this.defaultSku.seckillSkuId;
				wx.setStorageSync("secKillObj", secKillObj);
				uni.navigateTo({
					url: '/packageActivities/pages/confirmOrder/confirmOrder'
				});
			},

			//  零售价购买
			toProdDetailsPage: function(e) {
				uni.navigateTo({
					url: '/pages/prod/prod?prodid=' + this.seckilldet.prodId
				});
			},

			/**
			 * 显示遮罩层
			 */
			showModal: function() {
				var ths = this;
				util.checkAuthInfo(ths.showMoadlFun);
			},

			showMoadlFun() {
				var ths = this;
				ths.setData({
					hideModal: false
				});
				var animation = wx.createAnimation({
					duration: 600,
					//动画的持续时间 默认400ms 数值越大，动画越慢 数值越小，动画越快 
					timingFunction: 'ease' //动画的效果 默认值是linear 

				});
				ths.animation = animation;
				setTimeout(function() {
					ths.fadeIn(); //调用显示动画
				}, 100);
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
			 * 隐藏遮罩层
			 */
			hideModalFun: function() {
				var that = this;
				var animation = wx.createAnimation({
					duration: 800,
					//动画的持续时间 默认400ms 数值越大，动画越慢 数值越小，动画越快 
					timingFunction: 'ease' //动画的效果 默认值是linear

				});
				this.animation = animation;
				that.fadeDown(); //调用隐藏动画

				setTimeout(function() {
					that.setData({
						hideModal: true
					});
				}, 720); //先执行下滑动画，再隐藏模块
			},

			/**
			 * 动画集
			 */
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
			 * 跳转到首页
			 */
			toHomePage: function() {
				uni.switchTab({
					url: '/pages/index/index'
				});
			},

			/**
			 * 跳转到购物车
			 */
			toCartPage: function() {
				uni.switchTab({
					url: '/pages/basket/basket'
				});
			},

			/**
			 * 跳转直播
			 */
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
				console.log('isWechat:', this.isWechat)
				let roomId = this.roomId
				let url = this.url
				console.log('roomId:', roomId, '，', 'url:', url)
				if (this.isWechat) {
					// 开发者在直播间页面路径上携带自定义参数（如示例中的path和pid参数），后续可以在分享卡片链接和跳转至商详页时获取
					let customParams = encodeURIComponent(JSON.stringify({
						path: url
					}))
					wx.navigateTo({
						url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}&custom_params=${customParams}`
					}) // 其中wx2b03c6e691cd7370是直播组件appid不能修改
				} else {
					uni.showToast({
						title: this.i18n.pleaseOpenInWechat,
						icon: 'none'
					})
				}
			},



		}
	};
</script>
<style>
	@import "./snapUpDetail.css";
</style>
