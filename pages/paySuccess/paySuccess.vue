<template>
	<view class="container">
		<view class="pay-success">
			<view class="pay-det">
				<view class="text">{{i18n.orderPaymentSuccessful}}</view>
				<view class="number">
					<text>￥</text>
					<text class="price">{{actualTotal?actualTotal.toFixed(2):0.00}}</text>
				</view>
			</view>
			<view class="pay-bottom">
				<view class="view-code" @tap="viewCodePop">{{i18n.viewDeliveryCode}}</view>
				<view class="other-action">
					<view class="item" @tap="toIndex">{{i18n.continueShopping}}</view>
					<view class="item bl" @tap="toOrderList">{{i18n.checkOrder}}</view>
				</view>
			</view>
		</view>

		<!-- 查看提货码 -->
		<view class="popup-hide" :hidden="!showCodePop">
			<view class="popup-mask" @tap="closePopup"></view>
			<view class="code-box">
				<view class="con-tit">{{i18n.pickingCode}}</view>
				<view class="address">
					<view class="item">
						<view class="label">{{i18n.deliveryAddress}}：</view>
						<view class="det">{{stationInfo.stationAddress}}</view>
					</view>
					<view class="item">
						<view class="label">{{i18n.takeDeliveryTime}}：</view>
						<view class="det">{{stationInfo.stationTime}}</view>
					</view>
				</view>
				<view class="code">
					<image :src="stationQrCode"></image>
				</view>
				<view class="code-num">{{stationInfo.stationCode}}</view>
				<view class="code-btn" @tap="closePopup">{{i18n.iGotIt}}</view>
			</view>
		</view>
	</view>
</template>

<style>
	@import "./paySuccess.css";
</style>

<script>
	var http = require("../../utils/http.js");
	var Qr = require("../../utils/wxqrcode");
	export default {
		data() {
			return {
				showCodePop: false, //选择提货时间弹窗
				stationInfo: {}, // 自提点信息
				stationQrCode: '', // 提货码二维码
				orderNumbers: '1285873452313612288',
				actualTotal: 0, // 实际金额
			};
		},
		
		computed:{
			i18n() {
				return this.$t('index')
			}
		},
		
		onShow: function () {
			  //头部导航标题
			  uni.setNavigationBarTitle({
			      title:this.i18n.paymentSuccessful
			  });
		},
		
		onLoad: function(options) {
			if (options.orderNumbers) {
				this.orderNumbers = options.orderNumbers
			}
			this.queryActualTotal()
		},
		methods: {
			viewCodePop() {
				this.setData({
					showCodePop: true,
				});
				this.queryStationInfo()
			},
			closePopup: function() {
				this.setData({
					showCodePop: false,
				});
			},

			/**
			 * 请求实付金额
			 */
			queryActualTotal: function() {
				uni.showLoading(); //加载订单详情
				var params = {
					url: "/api/v1/myOrder/orderDetail",
					method: "GET",
					data: {
						orderNumber: this.orderNumbers
					},
					callBack: (res) => {
						uni.hideLoading()
						this.actualTotal = res.actualTotal
					}
				};
				http.request(params);
			},

			/**
			 * 请求自提点数据
			 */
			queryStationInfo: function() {
				uni.showLoading(); //加载订单详情
				var params = {
					url: "/api/v1/myStationOrder/stationDetail",
					method: "GET",
					data: {
						orderNumber: this.orderNumbers
					},
					callBack: (res) => {
						uni.hideLoading() 
						this.stationInfo = res

						this.getQrcode(res.stationCode)
					}
				};
				http.request(params);
			},

			/**
			 * 生成二维码
			 */
			getQrcode: function(stationCode) {
				this.stationQrCode = Qr.createQrCodeImg(stationCode)
			},

			// 继续购物
			toIndex: function() {
				this.$Router.pushTab('/pages/index/index')
			},

			//查看详情
			toOrderList: function() {
				// uni.navigateTo({
				// 	url: '/pages/orderList/orderList?sts=0'
				// });
				this.$Router.push({
					path: '/pages/orderList/orderList', query: {sts:0}
				})
			},

		}
	};
</script>
