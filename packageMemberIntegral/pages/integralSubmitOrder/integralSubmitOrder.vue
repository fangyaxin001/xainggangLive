<template>
	<!-- 积分商品提交订单页面 -->
	<!--pages/integralSubmitOrder/integralSubmitOrder.wxml-->
	<view class="container">
		<u-navbar  title="確認訂單"></u-navbar>
		<view class="submit-order">
			<!-- 收货地址 -->
			<view class="delivery-addr" @tap="toAddrListPage">
				<view class="addr-bg" v-if="!userAddr" style="display: flex;align-items: center;justify-content: space-between;">
					<view class="add-addr">
						<view class="plus-sign-img">
							<image src="/static/images/icon/plus-sign.png"></image>
						</view>
						<text>{{i18n.addNewAddress}}</text>
					</view>
					<view class="arrow empty"></view>
				</view>
				<view style="display: flex;align-items: center; padding: 20rpx;" v-if="userAddr">
					<view class="addr-icon">
						<image style="width: 36rpx; height: 36rpx;" src="../../../static/images/proneler/dingwei.png"></image>
					</view>
					<view class="addr-bg whole" > 
						<view class="user-info">
							<text class="tab-hone">家</text>
							<text class="item"> 王小华(先生)</text>
							<text class="item">15212345678</text>
						</view>
						<view style="display: flex;align-items: center;justify-content: space-between;">
							<view class="addr">河南省郑州市二七区庆丰街</view>
							<view class="arrow"></view>
						</view>
						
					</view>
				</view>
			</view>

			<!-- <view class="shop-item" wx:for="{{shopCartOrders}}" wx:for-item="shopCart"> -->
			<!-- 店铺信息 -->
			<!-- <view class="shop-box">
        <view class="shop-icon">
          <image src="../../images/icon/shop.png"></image>
        </view>
        <view class="shop-name">{{shopCart.shopName}}</view>
      </view> -->
			<!-- /店铺信息 -->
			<!-- 店铺商品明细 -->
			<view class="prod-item">
				<!-- <block wx:for="{{shopCart.shopCartItemDiscounts}}" wx:for-item="shopCartItem"> -->
				<!-- <block wx:for="{{productItemDto}}" wx:key=''> -->
				<view class="item-box">

					<!-- 商品信息 --> 
					<view class="item-cont" >
						<view class="prod-pic">
							<image :src="productItemDto.pic"></image>
						</view>
						<view class="prod-info">
							<view class="prodname">{{productItemDto.prodName}} 这是title</view>
							<view class="prod-info-cont">{{productItemDto.skuName}} 这是规格</view>
							<view class="show-price" style="margin-top: 20rpx;" > 
								 
								<!-- <view class="price-nums">
									<text class="prodprice"><text class="symbol" v-if="productItemDto.price">￥</text>
										<text class="big-num" v-if="productItemDto.price">{{wxs.parsePrice(productItemDto.price)[0]}}</text>
										<text class="small-num" v-if="productItemDto.price">.{{wxs.parsePrice(productItemDto.price)[1]}}</text>
										<text class="small-num" decode="true" v-if="productItemDto.price">&ensp;+&ensp;</text>
									</text>
									<text class="prodcount">x{{productItemDto.prodCount}}</text>
								</view> -->
								<view class="show-price">
									<view class="">
										<image style="width: 29.49rpx;height: 35.39rpx;" src="../../../static/images/proneler/jifen-img.png" class="icon"></image>
									</view>
									<text class="red-word">1積分<text style="font-size: 26rpx;">+HK$</text>1999.00</text>
								</view>
								<view class="" style="color: #999999;">x1</view>
								<!-- 积分 -->
								<!-- <view class="integral-num">
									<text decode="true">{{productItemDto.scorePrice}} 222{{i18n.integral}}</text>
								</view> -->
							</view>
						</view>
					</view>
				</view>
				<!-- </block> -->
				<!-- </block> -->

				<!-- <view class='total-num'>
          <text class="prodcount">共{{totalCount}}件商品</text>
          <view class='prodprice'>合计：
            <text class='symbol'>￥</text>
            <text class='big-num'>{{wxs.parsePrice(total)[0]}}</text>
            <text class='small-num'>.{{wxs.parsePrice(total)[1]}}</text>
          </view>
        </view> -->
			</view>
			<!-- /店铺商品明细 -->

			<!-- 店铺优惠券和买家留言 -->
			<view class="order-msg">
				<view class="msg-item">
					<!-- <view class='item coupon' bindtap='showCouponPopup' data-index="{{index}}">
            <text class='item-tit'>优惠券：</text>
            <text class='coupon-btn' wx:if="{{shopCart.showCoupons.totalLength==0}}">暂无可用</text>
            <text class='coupon-btn' wx:else>{{shopCart.showCoupons.totalLength}}张可用</text>
            <text class="coupon-amount" wx:if="{{shopCart.showCoupons.couponAmount>0}}">－{{wxs.toPrice(shopCart.showCoupons.couponAmount)}}</text>
            <text class='arrow'></text>
          </view> -->
					<view class="" style=" padding: 16rpx 30rpx;">
						<view class="">
							<text>買家留言：</text>
						</view>
						<view class="" style="margin-top: 30rpx; border-bottom: 2rpx solid #EEEEEE;padding-bottom: 20rpx;">
							<input placeholder="建議留言前先與商家溝通" maxlength="100" :value="remarks" @input="onRemarkIpt"></input>
						</view>
					</view>
				</view>
	<!-- 总金额计算 -->
			<view class="">
				<view class="msg-item">
					<!-- 商品总额 -->
					<view class="item">
						<view class="item-tit">商品總額：</view>
						<view class="item-txt price">
							<text class="symbol">HK$</text>
							<text class="big-num">{{wxs.parsePrice(total)[0]}}</text>
							<text class="small-num">.{{wxs.parsePrice(total)[1]}}</text>
						</view>
					</view>
					<!-- 运费 -->
					<view class="item">
						<view class="item-tit">運費：</view>
						<view class="item-txt price">
							<text class="symbol">HK$</text>
							<text class="big-num">{{wxs.parsePrice(transfee)[0]}}</text>
							<text class="small-num">.{{wxs.parsePrice(transfee)[1]}}</text>
						</view>
					</view>
					<!-- 优惠金额 -->
					<view class="item">
						<view class="item-tit">优惠金额：</view>
						<view class="item-txt price">
							<text class="symbol">HK$</text>
							<text class="big-num">{{wxs.parsePrice(orderReduce)[0]}}</text>
							<text class="small-num">.{{wxs.parsePrice(orderReduce)[1]}}</text>
						</view>
					</view>
				 <!-- 统计 -->
				 <view style="display: flex; justify-content: flex-end;align-items: center;">
				 	<view class="item-tit">總計：</view>
				 	<view class="item-txt price">
				 		<text class="symbol">HK$</text>
				 		<text class="big-num">1999.00</text>
				 		<!-- <text class="small-num">.{{wxs.parsePrice(orderReduce)[1]}}</text> -->
				 	</view>
				 </view>
				</view>
			</view>
			</view>
			<!-- /店铺优惠券和买家留言 -->
			<!-- </view> -->


		
			<!-- /总金额计算 -->
		</view>


		<!-- 底部栏 -->
		<view class="submit-order-footer">
			<view class="sub-order">
				<view class="item-txt">{{i18n.total}}:<view class="price" style="margin-left: 10rpx;">
						<!-- 金额单位 -->
						<text class="symbol" >HK$</text> 
						<!-- 金额 -->
						<text class="big-num" v-if="actualTotal">{{wxs.parsePrice(actualTotal)[0]}}</text>
						<text class="small-num" v-if="actualTotal">.{{wxs.parsePrice(actualTotal)[1]}}</text>
						<text class="small-num" decode="true" v-if="actualTotal">&ensp;+&ensp;</text>
					<text style="float: right; color: #1A1A1A;">共2件</text>
					</view>
					<!-- 积分 -->
					<!-- <view class="integral-num">
						<text decode="true">{{scorePrice}} {{i18n.integral}}</text>
					</view> -->
				</view>
			</view>
			<view class="footer-box" @tap="toPay">提交訂單</view>
		</view>
	</view>

	<!-- 选择优惠券弹窗 -->
	<!-- <view class="popup-hide" wx:if="{{popupShow}}">
  <view class="popup-box">
    <view class="popup-tit">
      <text>优惠券</text>
      <text class="close" bindtap='closePopup'></text>
    </view>
    <view class="coupon-tabs">
      <view class="coupon-tab {{couponSts==1?'on':''}}" bindtap='changeCouponSts' data-sts='1'>可用优惠券({{coupons.canUseCoupons.length}})</view>
      <view class="coupon-tab {{couponSts==2?'on':''}}" bindtap='changeCouponSts' data-sts='2'>不可用优惠券({{coupons.unCanUseCoupons.length}})</view>
    </view>
    <view class='popup-cnt'>
      <block wx:for="{{coupons.canUseCoupons}}" wx:if="{{couponSts == 1}}" wx:key="couponId">
        <coupon item="{{item}}" order="{{true}}" bind:checkCoupon="checkCoupon" canUse="{{true}}"></coupon>
      </block>
      <block wx:for="{{coupons.unCanUseCoupons}}" wx:if="{{couponSts == 2}}" wx:key="couponId">
        <coupon item="{{item}}" order="{{true}}" canUse="{{false}}"></coupon>
      </block>
      <view class="botm-empty"  wx:if="{{couponSts==1 && !coupons.canUseCoupons.length}}">这里还没有优惠券，快去领券吧~</view>
      <view class="botm-empty"  wx:if="{{couponSts==2 && !coupons.canUseCoupons.length}}">暂无相关优惠券</view>
    </view>
    <view class="coupon-ok" wx:if="{{couponSts==1}}">
      <text bindtap='choosedCoupon'>确定</text>
    </view>
  </view>
</view> -->
</template>

<script module="wxs" lang="wxs" src="../../../wxs/number.wxs"></script>

<script>
	// pages/submit-order/submit-order.js
	var http = require("../../../utils/http.js");
	import coupon from "../../../components/coupon/coupon";

	export default {
		data() {
			return {
				popupShow: false,
				couponSts: 1,
				couponList: [],
				// 订单入口 0购物车 1立即购买
				orderEntry: "0",
				userAddr: null,
				orderItems: [],
				shopCartOrders: [],
				//所有店铺的数据
				productItemDto: [],
				//商品信息
				coupons: {
					totalLength: 0,
					canUseCoupons: [],
					noCanUseCoupons: []
				},
				actualTotal: 0,
				total: 0,
				totalCount: 0,
				transfee: 0,
				reduceAmount: 0,
				couponIds: [],
				orderReduce: 0,
				platformCoupons: [],
				//整个订单可以使用的优惠券列表
				scorePrice: 0,
				remarks: '',
				//留言
				isPurePoints: false // 是否纯积分商品

			};
		},

		components: {
			coupon
		},
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
			this.setData({
				orderEntry: options.orderEntry
			});
		},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			var pages = getCurrentPages();
			var currPage = pages[pages.length - 1];

			if (currPage.selAddress == "yes") {
				this.setData({
					//将携带的参数赋值
					userAddr: currPage.item
				});
			}


			// this.loadOrderData();
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
		mounted() {
			// this.loadOrderData()
		},
		methods: {
			//加载订单数据
			loadOrderData: function() {
				var addrId = 0;

				if (this.userAddr != null) {
					addrId = this.userAddr.addrId;
				}

				uni.showLoading({
					mask: true
				});
				console.log(JSON.parse(wx.getStorageSync("orderItem"))); // console.log(JSON.parse(wx.getStorageSync("basketIds")))

				var params = {
					url: "/api/v1/score/confirm",
					method: "POST",
					data: {
						addrId: addrId,
						orderItem: this.orderEntry === "1" ? JSON.parse(wx.getStorageSync("orderItem")) : undefined,
						basketIds: this.orderEntry === "0" ? JSON.parse(wx.getStorageSync("basketIds")) : undefined,
						couponIds: this.couponIds,
						userChangeCoupon: 1
					},
					callBack: res => {
						uni.hideLoading()						
						var shopCartOrders = res.shopCartOrders;
						this.setData({
							// shopCartOrders: shopCartOrders, //每个店铺的购物车信息
							productItemDto: res.productItemDto,
							//商品信息
							actualTotal: res.actualTotal,
							//实际总值
							total: res.total,
							//商品总值
							totalCount: res.totalCount,
							//商品总数  
							userAddr: res.userAddr,
							//地址Dto
							// transfee: res.totalTransfee, //总运费
							// orderReduce: res.orderReduce, //订单优惠金额(所有店铺优惠金额和使用积分抵现相加)
							scorePrice: res.productItemDto.scorePrice //商品所需积分
							// remarks: res.remarks,  //留言

						});
					},
					errCallBack: res => {
						uni.hideLoading()						
						this.chooseCouponErrHandle(res);
					}
				};
				http.request(params);
			},

			/**
			 * 优惠券选择出错处理方法
			 */
			// chooseCouponErrHandle(res) {
			//   // 优惠券不能共用处理方法
			//   if (res.statusCode == 601) {
			//     uni.showToast({
			//       title: res.data,
			//       icon: "none",
			//       duration: 3000,
			//       success: res => {
			//         this.setData({
			//           couponIds: []
			//         })
			//       }
			//     })
			//     setTimeout(() => {
			//       this.loadOrderData();
			//     }, 2500)
			//   }
			// },

			/**
			 * 提交订单
			 */
			toPay: function() {
				uni.navigateTo({
					url: '/pages/payWay/payWay?orderNumbers'
				});
				// if (!this.userAddr) {
				// 	uni.showToast({
				// 		title: this.i18n.pleaseSelectSddress,
				// 		icon: "none"
				// 	});
				// 	return;
				// }

				// this.submitOrder();
			},
			// 提交订单
			submitOrder: function() {
				uni.showLoading({
					mask: true
				}); // var shopCartOrders = this.data.shopCartOrders;
				// var orderShopParam = [];
				// shopCartOrders.forEach(shopCart => {
				// orderShopParam.push({
				//   remarks: shopCart.remarks,
				//   shopId: shopCart.shopId
				// });
				// })

				var params = {
					url: "/api/v1/score/submit",
					method: "POST",
					data: {
						// orderShopParam: orderShopParam
						remarks: this.remarks
					},
					callBack: res => {
						uni.hideLoading()						// this.calWeixinPay(res.orderNumbers);
						var isPurePoints = -1
						this.actualTotal == 0 ? isPurePoints = 1 : isPurePoints = -1
						uni.navigateTo({
							url: '/pages/payWay/payWay?orderNumbers=' + res.orderNumbers + '&isPurePoints=' + isPurePoints
						});
					}
				};
				http.request(params);
			},

			/**
			 * 唤起微信支付
			 */
			calWeixinPay: function(orderNumbers) {
				if (this.actualTotal == 0) {
					this.setData({
						isPurePoints: true
					});
				}

				uni.showLoading({
					mask: true
				});
				var params = {
					url: "/api/v1/order/pay",
					method: "POST",
					data: {
						payType: 1,
						orderNumbers: orderNumbers
					},
					callBack: res => {
						uni.hideLoading()
						if (this.isPurePoints) {
							uni.navigateTo({
								url: '/pages/pay-result/pay-result?sts=1&orderNumbers=' + orderNumbers + "&orderType=" + this.orderType
							});
						} else {
							wx.requestPayment({
								timeStamp: res.timeStamp,
								nonceStr: res.nonceStr,
								package: res.packageValue,
								signType: res.signType,
								paySign: res.paySign,
								success: e => {
									uni.navigateTo({
										url: '/pages/pay-result/pay-result?sts=1&orderNumbers=' + orderNumbers + "&orderType=" + this.orderType
									});
								},
								fail: err => {
									uni.navigateTo({
										url: '/pages/pay-result/pay-result?sts=0&orderNumbers=' + orderNumbers + "&orderType=" + this.orderType
									});
								}
							});
						}
					}
				};
				http.request(params);
			},
			changeCouponSts: function(e) {
				this.setData({
					couponSts: e.currentTarget.dataset.sts
				});
			},
			// 店铺优惠券弹框
			showCouponPopup: function(e) {
				var index = e.currentTarget.dataset.index;
				var shopCartOrders = this.shopCartOrders;
				this.setData({
					coupons: shopCartOrders[index].showCoupons,
					popupShow: true
				});
			},
			closePopup: function() {
				this.setData({
					popupShow: false
				});
			},

			/**
			 * 去地址页面
			 */
			toAddrListPage: function() {
				uni.navigateTo({
					url: '/pages/delivery-address/delivery-address?order=0'
				});
			},

			/**
			 * 确定选择好的优惠券
			 */
			choosedCoupon: function() {
				this.loadOrderData();
				this.setData({
					popupShow: false
				});
			},

			/**- 
			 * 优惠券子组件发过来
			 */
			checkCoupon: function(e) {
				var ths = this;
				let index = ths.couponIds.indexOf(e.detail.couponId);

				if (index === -1) {
					ths.couponIds.push(e.detail.couponId);
				} else {
					ths.couponIds.splice(index, 1);
				}
			},

			/**
			 * 输入备注
			 */
			onRemarkIpt: function(e) {
				this.remarks = e.detail.value
				// var index = e.currentTarget.dataset.index;
				// var shopCartOrders = this.shopCartOrders;
				// shopCartOrders[index].remarks = e.detail.value;
				// this.setData({
				// 	shopCartOrders: shopCartOrders
				// });
				// console.log(e.detail.value);
			}
		}
	};
</script>
<style>
	@import "./integralSubmitOrder.css";
</style>
