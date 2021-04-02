<template>
	<view v-if="fullItemObj.actualTotal">
		<!--地址栏 -->
		<view class="address-part">
			<view class="address-box" @tap="toAddrListPage">
				<!-- 地址图标 -->
				<view class="addr-icon">
					<image src="/static/images/icon/addr.png"></image>
				</view>
				<!-- 地址为空 -->
				<view class="add-addr" v-if="!fullItemObj.userAddr">{{i18n.addShippingAddress}}</view>
				<!-- 地址信息 -->
				<block v-if="fullItemObj.userAddr">
					<view class="recipient clearfix">
						<text class="username">{{fullItemObj.userAddr.receiver}}</text>
						<text class="cellphone">{{fullItemObj.userAddr.mobile}}</text>
					</view>
					<view class="addr-text">{{i18n.shippingAddress}}：{{fullItemObj.userAddr.province}}{{fullItemObj.userAddr.city}}{{fullItemObj.userAddr.area}}{{fullItemObj.userAddr.addr}}</view>
				</block>

				<!-- 右箭头 -->
				<view class="more-icon">
					<image src="/static/images/icon/more.png"></image>
				</view>
			</view>
			<!-- 下虚线 -->
			<view class="dotted-line">
				<image src="../../static/images/icon/dotted-line.png"></image>
			</view>
		</view>
		<!--地址栏end -->


		<!-- 商品信息 -->
		<view class="goods-box">
			<!-- <view class="goods-shop">
    <view class="shop-icon"><image src="../../images/icon/shop.png"></image></view>
    <text class="shop-name">笑橙小店190827</text>
  </view> 
  -->
			<!-- 商品信息 -->
			<view class="goods-msg">
				<view class="goods-img">
					<image :src="fullItemObj.shopCartItem.pic"></image>
					<!-- <view class="miaosha">
        <image src="../../images/icon/miaosha.png"></image>
      </view> -->
				</view>
				<view class="goods-text clearfix">
					<view class="goods-name">{{fullItemObj.shopCartItem.prodName}}</view>
					<view class="miaosha">
						<image src="../../static/images/icon/miaosha.png"></image>
					</view>
					<view class="goods-sku">{{fullItemObj.shopCartItem.skuName}}</view>
					<text class="goods-price">￥{{wxs.toPrice(fullItemObj.shopCartItem.seckillPrice)}}</text>
					<text class="goods-price-del">￥{{wxs.toPrice(fullItemObj.shopCartItem.price)}}</text>
					<text class="goods-amount">x {{fullItemObj.shopCartItem.prodCount}}</text>
				</view>
			</view>
		</view>
		<!-- 商品信息end -->


		<!-- 配送&留言 -->
		<view class="row">
			<!-- <view class="dispatching clearfix">
    <text class="dispatching-tit">配送方式</text>
    <text class="dispatching-way">快递 免运费</text>
  </view> -->
			<view class="live-message">
				<text class="message-tit">{{i18n.buyerMessage}}</text>
				<input class="message-int" maxlength="100" :placeholder="i18n.buyerTips" :value="remarks" @input="onRemarksInput"></input>
			</view>
		</view>
		<!-- 配送&留言 end -->


		<!-- 商品总额 -->
		<view class="sum">
			<view class="cost-box">
				<view class="goods-table clearfix">
					<text class="goods-table-tit">{{i18n.goodsAmount}}</text>
					<text class="goods-table-way">￥{{wxs.toPrice(goodsPrice)}}</text>
				</view>
				<view class="goods-table clearfix">
					<text class="goods-table-tit">{{i18n.shipping}}</text>
					<text class="goods-table-way">+ ￥{{wxs.toPrice(transfee)}}</text>
				</view>
			</view>
			<!-- 合计 -->
			<view class="total-cost">{{i18n.total}}：<text class="total-num">￥{{wxs.toPrice(totalPrice)}}</text>
			</view>
		</view>
		<!-- 商品金额 end -->


		<!-- 底部 -->
		<view class="foot-box">
			<view class="foot">
				<view class="total-price">{{i18n.total}}：<text class="total-price-num">￥{{wxs.toPrice(totalPrice)}}</text></view>
				<!-- 提交按钮 -->
				<view class="submit-btn" @tap="commitOrder">{{i18n.submitOrders}}</view>
			</view>
		</view>
		<!-- 底部end -->
	</view>
</template>

<script module="wxs" lang="wxs" src="../../../wxs/number.wxs"></script>

<script>
	// pages/confirmOrder/confirmOrder.js
	var http = require("../../../utils/http.js");
	var config = require("../../../utils/config.js");
	import {
		PayType,
		AppType
	} from "../../../utils/constant.js";
	import Pay from "../../../utils/pay.js";
	export default {
		data() {
			return {
				orderPath: '',
				fullItemObj: {},
				totalPrice: 0,
				goodsPrice: 0,
				transfee: 0,
				orderParam: {},
				userAddr: null,
				remarks: ""
			};
		},

		components: {},
		props: {},
		computed:{
			i18n() {
				return this.$t('index')
			}
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			
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
			    title:this.i18n.makeSureOrder
			});
			
			var pages = getCurrentPages();  //当前页面栈
			var currPage = pages[pages.length - 1];  //当前页面
			if (currPage.selAddress == "yes") {
			  this.setData({
			    //将携带的参数赋值
			    userAddr: currPage.item
			  });
			}
			this.getSeckill();
		},

		/**
		 * 生命周期函数--监听页面隐藏
		 */
		onHide: function() {},

		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function() {},

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
		methods: {
			onRemarksInput: function(e) {
				this.setData({
					remarks: e.detail.value
				});
			},

			// 获取orderPath
			getSeckill() {
				var _this = this;

				http.request({
					url: '/api/v1/seckill/orderPath',
					method: 'GET',
					callBack: res => {
						_this.setData({
							orderPath: res
						});

						_this.confirmOrder();
					}
				});
			},

			// 确认订单
			confirmOrder() {
				var secKillObj = wx.getStorageSync("secKillObj");

				if (this.userAddr) {
					secKillObj.addrId = this.userAddr.addrId;
				}

				var orderPath = this.orderPath;

				var _this = this;

				http.request({
					url: `/api/v1/seckill/${orderPath}/confirm`,
					method: 'POST',
					data: secKillObj,
					callBack: res => {
						_this.setData({
							fullItemObj: res,
							goodsPrice: res.shopCartItem.prodCount * res.shopCartItem.seckillPrice,
							transfee: res.transfee,
							totalPrice: res.transfee + res.shopCartItem.prodCount * res.shopCartItem.seckillPrice,
							userAddr: res.userAddr
						});
					}
				});
			},

			// 提交订单
			commitOrder() {
				this.createSocket();
			},

			// ws
			createSocket() {
				var _this = this;

				wx.closeSocket();
				var st = wx.connectSocket({
					url: `${config.wsDomain}/seckill/websocket/${this.orderPath}`,
					method: 'get',
					fail: function(err) {
						uni.showToast({
							title: _this.i18n.wsConnectionFailed
						});
						console.log(err);
					},
					success: function(res) {
						console.log("connect");
						console.log(res);
					}
				});
				st.onOpen(function(res) {
					console.log("open");
					console.log(res);
					uni.showLoading({
						title: _this.i18n.desperatelyBuying,
						mask: true
					});
					setTimeout(() => {
						var orderShopParam = {
							remarks: _this.remarks,
							shopId: _this.fullItemObj.shopCartItem.shopId
						};
						http.request({
							url: `/api/v1/seckill/${_this.orderPath}/submit`,
							method: 'POST',
							data: orderShopParam
						});
					}, 1000);
				});
				st.onError(function(res) {
					console.log("error");
					console.log(res);
				});
				st.onClose(function(res) {
					console.log("close");
					console.log(res);
				});
				st.onMessage(function(res1) {
					console.log("mesg");
					console.log(res1);
					var orderParam = JSON.parse(res1.data);

					if (!orderParam.success) {
						uni.showToast({
							title: orderParam.msg,
							icon: "none"
						});
						return;
					}

					if (orderParam.obj) {
						// _this.calWeixinPay(orderParam.obj);
						uni.navigateTo({
							url: '/pages/payWay/payWay?orderNumbers=' + orderParam.obj
						});
					}

					wx.closeSocket();
				});
			},

			/**
			 * 唤起微信支付
			 */
			calWeixinPay: function(orderNumbers) {
				const isOA = uni.getStorageSync('appType') == AppType.MP; // 是否微信内环境
				var payType = isOA ? PayType.WECHATPAY_MP : PayType.WECHATPAY_H5
				Pay.toOrderPay(payType, orderNumbers)
			},

			/**
			 * 选择地址
			 */
			toAddrListPage: function() {
				uni.navigateTo({
					url: '/pages/delivery-address/delivery-address?order=0'
				});
			}
		}
	};
</script>
<style>
	@import "./confirmOrder.css";
</style>
