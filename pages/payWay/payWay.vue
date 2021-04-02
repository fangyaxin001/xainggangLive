<template>
	<view class="pay-way">
		<u-navbar  title="收銀台"></u-navbar>
		<view class="pay-number">
			<view class="price" style="color: #FA2033;" >
			 <view class="">
			 	<image style="width: 29.49rpx;height: 35.39rpx;" src="../../static/images/proneler/jifen-img.png" class="icon"></image>
			 </view>
			 <text class="red-word">1積分<text style="font-size: 31rpx;">+HK$</text>1999.00</text>
			<!-- 	<view class="big-num">
					asdadasdas
				</view> -->
				<!-- <view class="small-num" >.asdad</view> -->
				<!-- <view class="big-num" v-if="actualTotal"><text class="small-num">￥</text>{{wxs.parsePrice(actualTotal)[0]}}</view> -->
				
				<!-- <view class="small-num" v-if="actualTotal">.{{wxs.parsePrice(actualTotal)[1]}}</view> -->
				<!-- <view class="small-num" v-if="actualTotal">.{{wxs.parsePrice(actualTotal)[1]}}</view> -->
				<!-- <text class="small-num" decode="true" v-if="actualTotal && orderScore">&nbsp;&nbsp;+&nbsp;&nbsp;</text> -->
				<!-- <view class="big-num" v-if="orderScore">{{orderScore + ' '}}<text class="small-num">{{i18n.integral}}</text></view> -->
			</view>
			<view class="time">支付剩餘時間 &nbsp; 00:29:59</view>
		</view>
<!-- 支付方式 -->
<view class="select-pay-way">選擇支付方式</view>
		<view class="ways" >
			<radio-group @change="handlePayTypeChange">
				<!-- #ifdef H5 -->
				<label>
					<!-- ALIPAY_H5: 6, 支付宝H5支付 -->
					<view class="item" @tap="payType = PayTypeConstant.ALIPAY_H5" v-if="!isWechat">
						<view class="pay-name">
							<view class="img">
								<image src="../../static/images/icon/alipay.png" mode=""></image>
							</view>
							<view class="name">{{i18n.PayWithAli}}</view>
						</view>
						<view class="check">
							<radio :checked="payType==PayTypeConstant.ALIPAY_H5"></radio>
						</view>
					</view>
				</label>
				<label>
					<!-- WECHATPAY_MP: 5, 微信公众号支付 -->
					<view class="item" @tap="payType = PayTypeConstant.WECHATPAY_MP" v-if="isWechat && !isAli">
						<view class="pay-name">
							<view class="img">
								<image src="../../static/images/icon/wxpay.png" mode=""></image>
							</view>
							<view class="name">{{i18n.payWithWeChat}}</view>
						</view>
						<view class="check">
							<radio :checked="payType==PayTypeConstant.WECHATPAY_MP"></radio>
						</view>
					</view>
				</label>
				<label>
					<!-- WECHATPAY_H5: 4, 微信H5支付 -->
					<view class="item" @tap="payType = PayTypeConstant.WECHATPAY_H5" v-if="!isWechat && !isAli">
						<view class="pay-name">
							<view class="img">
								<image src="../../static/images/icon/wxpay.png" mode=""></image>
							</view>
							<view class="name">{{i18n.payWithWeChat}}</view>
						</view>
						<view class="check">
							<radio :checked="payType==PayTypeConstant.WECHATPAY_H5"></radio>
						</view>
					</view>
				</label>
				<!-- <view class="item" >
					<view class="pay-name">
						<view class="img"><image src="../../static/images/icon/unionpay.png" mode=""></image></view>
						<view class="name">银行卡快捷支付</view>
					</view>
					<view class="check">
						<radio></radio>
					</view>
				</view> -->
				<!-- #endif -->

				<!-- #ifdef APP-PLUS -->
				<label>
					<!-- WECHATPAY_APP: 8, 微信APP支付 -->
					<view class="item" @tap="payType = PayTypeConstant.WECHATPAY_APP">
						<view class="pay-name">
							<view class="img">
								<image src="../../static/images/icon/wxpay.png" mode=""></image>
							</view>
							<view class="name">{{i18n.payWithWeChat}}</view>
						</view>
						<view class="check">
							<radio :checked="payType==PayTypeConstant.WECHATPAY_APP"></radio>
						</view>
					</view>
				</label>
				<label>
					<!-- ALIPAY_APP: 7, 支付宝APP支付 -->
					<view class="item" @tap="payType = PayTypeConstant.ALIPAY_APP">
						<view class="pay-name">
							<view class="img">
								<image src="../../static/images/icon/alipay.png" mode=""></image>
							</view>
							<view class="name">{{i18n.PayWithAli}}</view>
						</view>
						<view class="check">
							<radio :checked="payType==PayTypeConstant.ALIPAY_APP"></radio>
						</view>
					</view>
				</label>
			
				<!-- #endif -->

				<!-- #ifdef MP-WEIXIN -->
				<label>
					<!-- WECHATPAY: 1, 小程序支付 -->
					<view class="item" @tap="payType = PayTypeConstant.WECHATPAY">
						<view class="pay-name">
							<view class="img">
								<image src="../../static/images/icon/wxpay.png" mode=""></image>
							</view>
							<view class="name">{{i18n.payWithWeChat}}</view>
						</view>
						<view class="check">
							<radio :checked="payType==PayTypeConstant.WECHATPAY"></radio>
						</view>
					</view>
				</label>
				<!-- #endif -->

				<!-- 余额支付 -->
				<label>
					<!-- BALANCEPAY: 9, 余额支付 -->
					<view class="item" @tap="payType = PayTypeConstant.BALANCEPAY">
						<view class="pay-name">
							<view class="img">
								<image src="../../static/images/icon/balancePay.png" mode=""></image>
							</view>
							<view class="name">{{i18n.balancePay}}</view>
						</view>
						<view class="check">
							<radio :checked="payType==PayTypeConstant.BALANCEPAY"></radio>
						</view>
					</view>
				</label>
				<!-- 余额支付 end -->
			</radio-group>
		</view>
		<view class="sure-pay" @tap="toPay">立即支付</view>
	</view>
</template>

<script module="wxs" lang="wxs" src="../../wxs/number.wxs"></script>

<script>
	var http = require("../../utils/http.js");
	import {PayType,AppType} from "../../utils/constant.js";
	import Wechat from "../../utils/wechat.js";
	import Pay from "../../utils/pay.js";
	import util from "../../utils/util.js";
	export default {
		data() {
			return {
				isWechat: false, //是否为微信环境
				orderNumbers: '', //订单号
				actualTotal: 0, //订单价格
				totalBalance: 0, //当前账户余额
				payType: PayType.ALIPAY_H5, //支付类型，默认支付宝
				PayTypeConstant: PayType, //支付类型常量
				timer: '', //定时器名称
				endTime: '', //订单过期时间
				countDown: false, //倒计时变量
				hou: '', //时
				min: '', //分
				sec: '', //秒
				orderScore: 0, // 订单使用积分
				orderType: '', // 订单类型 1团购 2秒杀
				isAli: false, // 是否支付宝H5环境内
			}
		},
		
		computed:{
			i18n() {
				return this.$t('index')
			}
		},
		
		onShow: function () {
			  //头部导航标题
			
		},
		
		methods: {
			/**
			 * 修改支付类型
			 */
			handlePayTypeChange() {},
			//获取订单价格
			getActualTotal: function() {
				uni.showLoading({
					mask: true
				});
				var params = {
					url: "/api/v1/myOrder/orderDetail",
					method: "GET",
					data: {
						orderNumber: this.orderNumbers
					},
					callBack: res => {
						uni.hideLoading()
						this.setData({
							//需支付金额
							actualTotal: res.actualTotal,
							orderScore: res.orderScore,
							orderType: res.orderType // 订单类型（1团购订单 2秒杀订单）
						});
					},
					errCallBack: res => {
						uni.hideLoading()
					}
				};
				http.request(params);
			},

			/**
			 * 获取账户当前余额
			 */
			queryCurrentBalance: function() {
				var params = {
					url: "/api/v1/user/getUserInfo",
					method: "GET",
					data: {},
					callBack: res => {
						this.totalBalance = res.totalBalance
					}
				};
				http.request(params);
			},

			// 获取订单过期时间
			getEndTime: function() {
				uni.showLoading({
					mask: true
				});
				var params = {
					url: "/api/v1/order/getOrderPayInfoByOrderNumber",
					method: "GET",
					data: {
						orderNumbers: this.orderNumbers
					},
					callBack: res => {
						uni.hideLoading()
						this.setData({
							//订单过期时间
							endTime: res.endTime,
							actualTotal: res.totalFee,
							orderScore: res.totalScore
						});
						this.getCountDown()
					},
					errCallBack: res => {
						uni.hideLoading()
					},
				};
				http.request(params);
			},

			// 倒计时
			getCountDown: function() {
				var nowTime = new Date().getTime(); //现在时间（时间戳）
				var endTime = new Date(this.endTime.replace(/\-/g, '/')).getTime(); //结束时间（时间戳）
				var time = (endTime - nowTime) / 1000; //距离结束的毫秒数
				// 获取时、分、秒
				let hou = parseInt(time % (60 * 60 * 24) / 3600);
				let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
				let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
				hou = this.timeFormin(hou),
				min = this.timeFormin(min),
				sec = this.timeFormin(sec)
				this.setData({
				  hou: this.timeFormat(hou),
				  min: this.timeFormat(min),
				  sec: this.timeFormat(sec)
				})
				// 每1000ms刷新一次
				if (time > 0) {
					this.setData({
						countDown: true,
						timer: setTimeout(this.getCountDown, 1000)
					})
				} else {
					this.setData({
						countDown: false,
					})
					// uni.navigateTo({
					// 	url: '/pages/orderList/orderList'
					// })
					this.$Router.push('/pages/orderList/orderList')
				}
			},
			//小于10的格式化函数（2变成02）
			timeFormat(num) {
				return num < 10 ? '0' + num : num;
			},
			//小于0的格式化函数（不会出现负数）
			timeFormin(num) {
				return num < 0 ? 0 : num;
			},

			// 去支付
			toPay: function() {
				// 跳转到支付结果
				uni.navigateTo({
					url:"/pages/payWay/payWay-result/payWay-result"
				})
				return
				
				util.tapLog(2, this.orderNumbers)
				if(this.payType == 9) {
					if (this.actualTotal > this.totalBalance) {
						uni.showToast({
							title: this.i18n.shortBalance + this.totalBalance,
							icon: 'none',
							duration: 3000
						});
						return
					}
					uni.showModal({
						title: this.i18n.tips,
						content: this.i18n.confirmBalancePay,
						showCancel: true,//是否显示取消按钮
						cancelText: this.i18n.cancel,
						confirmText: this.i18n.confirm,
						success: (res) => {
							if (res.confirm) {
								//点击确定
								// uni.redirectTo({
								// 	url: '/pages/pay-result/pay-result?sts=1&orderNumbers=' + this.orderNumbers
								// });
								Pay.toOrderPay(this.payType, this.orderNumbers, this.isPurePoints, this.dvyType,'','',this.orderType)
							} else if (res.cancel) {
								console.log('用户点击取消');
								uni.showToast({
									title: this.i18n.cancelBalancePay,
									icon: 'none',
									duration: 1500
								});
							}
						},
					})
					return
				}
				if(this.orderScore > 0 && this.actualTotal <= 0) {
					this.payType = 0 // 积分支付
				}
				console.log(this.payType, this.orderNumbers, this.isPurePoints, this.dvyType)
				Pay.toOrderPay(this.payType, this.orderNumbers, this.isPurePoints, this.dvyType)
			}
		},
		onLoad: function(options) {
			// #ifdef H5
			this.isWechat = Wechat.isWechat()
			// #endif
			// #ifdef APP-PLUS
			this.isWechat = false
			this.payType = PayType.ALIPAY_APP
			// #endif
			// #ifdef MP-WEIXIN
			this.isWechat = false
			this.payType = PayType.WECHATPAY
			// #endif
			if (options.isPurePoints) {
				// 纯积分订单
				this.isPurePoints = options.isPurePoints
			}
			if (options.dvyType) {
				this.dvyType = options.dvyType
			}
			if (this.isWechat) {
				// 如果是微信环境打开h5,使用公众号支付
				this.payType = PayType.WECHATPAY_MP
			}

			this.isAli = uni.getStorageSync('appType') == AppType.ALI; // 是否支付宝内环境

			this.orderNumbers = options.orderNumbers
			this.getActualTotal()
			this.getEndTime()
			this.queryCurrentBalance()
		},

		onUnload: function() {
			clearTimeout(this.timer);
		},
	}
</script>

<style>
	@import "./payWay.css";
</style>
