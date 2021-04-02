<template>
	<!-- pages/orderList/orderList.wxml -->
	<view class="container">
		<!-- 头部菜单 -->
		<view class="order-tit">
			<text @tap="onStsTap" data-sts="0" :class="sts==0?'on':''">{{i18n.all}}</text>
			<text @tap="onStsTap" data-sts="1" :class="sts==1?'on':''">{{i18n.toBePaid}}</text>
			<text @tap="onStsTap" data-sts="2" :class="sts==2?'on':''">{{i18n.toBeDelivered}}</text>
			<text @tap="onStsTap" data-sts="3" :class="sts==3?'on':''">{{i18n.toBeReceived}}</text>
      <text @tap="onStsTap" data-sts="8" :class="sts==8?'on':''">{{i18n.toUsed}}</text>
			<text @tap="onStsTap" data-sts="5" :class="sts==5?'on':''">{{i18n.completed}}</text>
		</view>
		<!-- 头部菜单 end --> 
		<!-- 订单列表 -->
		<view class="main">
			<block v-for="(item, orderNumber) in list" :key="orderNumber">
				<view class="prod-item">
				
					<!-- 订单编号 -->
					<view class="order-num">
						<text>訂單編號：{{item.orderNumber}}</text>
						<view class="order-state">
							<view class="" style="color: #47D1D1;">
								待付款
							</view>
							
						</view>
					</view>
					<!-- 商品列表 -->
					<!-- 一个订单单个商品的显示 -->
					<block v-if="item.orderItemDtos.length==1">
						<block v-for="(prod, prodId) in item.orderItemDtos" :key="prodId">
							<view>
								<view class="item-cont" @tap="toOrderDetailPage" :data-ordernum="item.orderNumber">
									<view class="prod-pic">
										<image :src="prod.pic"></image>
									</view>
									<view class="prod-info">
										<view class="prodname">{{prod.prodName}}</view>
										<view class="sku-box">
											<!-- 拼团icon -->
											<text class="spell-group-icon" v-if="item.orderType">
												<!-- orderType 订单类型(0普通订单 1团购订单 2秒杀订单) -->
												{{['',i18n.aGroup,i18n.spike,i18n.integral][item.orderType]}}
											</text>
											<!-- 拼团icon end -->
											<!-- 配送类型 1:快递 2:自提 3：无需快递) -->
											<text class="spell-group-icon" v-if="item.dvyType == 2">{{i18n.pickitUp}}</text>
											<text class="prod-info-cont">{{prod.skuName}}</text>
										</view>
										<view class="price-nums">
											<text class="prodprice">
												<text class="symbol" v-if="item.actualTotal">HK$</text>
												<text class="big-num" v-if="item.actualTotal">{{wxs.parsePrice(prod.price)[0]}}</text>
												<text class="small-num" v-if="item.actualTotal">.{{wxs.parsePrice(prod.price)[1]}}</text>
												<text class="small-num" v-if="item.actualTotal && item.orderType==3" decode="true">&emsp;+&emsp;</text>
												<text class="small-num" v-if="prod.useScore && item.orderType==3">{{prod.useScore}} {{i18n.integral}}</text>
											</text>
											<text class="prodcount">x{{prod.prodCount}}</text>
										</view>
									</view>
								</view>
							</view>
						</block>
					</block>
					<!-- 一个订单多个商品时的显示 -->
					<block v-else>
						<view class="item-cont" @tap="toOrderDetailPage" :data-ordernum="item.orderNumber">
							<scroll-view scroll-x="true" scroll-left="0" scroll-with-animation="false" class="categories">
								<block v-for="(prod, prodId) in item.orderItemDtos" :key="prodId">
									<view class="prod-pic">
										<!-- 拼团icon -->
										<!-- <view class="spell-group-order"><image src="../../images/icon/spell-group-order.png"></image></view> -->
										<!-- 拼团icon end -->
										<image :src="prod.pic"></image>
									</view>
								</block>
							</scroll-view>
						</view>
					</block>
					<!-- 总计 -->
					<view class="total-num">
						<!-- <text class="prodcount">{{i18n.inTotal}}{{item.totalCounts}}{{i18n.items}}</text> -->
						<!-- <view class="prodprice">{{i18n.total}}：
							<text class="symbol" v-if="item.actualTotal">￥</text>
							<text class="big-num" v-if="item.actualTotal">{{wxs.parsePrice(item.actualTotal)[0]}}</text>
							<text class="small-num" v-if="item.actualTotal"  decode="true">.{{wxs.parsePrice(item.actualTotal)[1] + '&nbsp;'}}</text>
							<text class="small-num" v-if="(item.actualTotal && item.userScore > 0)">+</text>
							<text class="big-num" v-if="item.userScore > 0"  decode="true">{{'&nbsp;' + item.userScore + '&nbsp;'}} <text class="small-num">{{i18n.integral}}</text></text>
						</view> -->
					</view>
					<!-- 商品列表 end -->
					<view class="prod-foot">
						<view class="btn"> 
							<text  class="button" @tap="onCancelOrder" :data-ordernum="item.orderNumber" hover-class="none">取消訂單</text>
							<!-- <text class="button warn"  bindtap="" data-ordernum="{{item.orderNumber}}" hover-class='none'>再次购买</text> -->
							<text  class="button warn" :data-dvytype="item.dvyType" :data-ordertype="item.orderType" @tap="onPayAgain"
							 :data-ordernum="item.orderNumber" hover-class="none">去付款</text>
							<text v-if="(item.status==3 || item.status==5) && item.dvyType != 2" class="button" @tap="toDeliveryPage" :data-ordernum="item.orderNumber"
							 hover-class="none">查看物流</text>
							<text v-if="item.status==3" class="button warn" @tap="onConfirmReceive" :data-ordernum="item.orderNumber"
							 hover-class="none">确认收货</text>
							 <text v-if="item.status==3" class="button warn" @tap="onConfirmReceive" :data-ordernum="item.orderNumber"
							  hover-class="none">申請售後</text>
							<!-- 评价status==5 -->
							<text v-if="item.status==5 && item.orderItemDtos[0].commSts==0 && item.shopId !== null " class="button warn" @tap="onComment" :data-info="JSON.stringify(item.orderItemDtos)"
							 :data-ordernum="item.orderNumber" hover-class="none">评价</text>
						</view>
					</view>
				</view>
			</block>
		</view>
		<!-- 订单列表 end -->

		<!-- 到底了~ -->
		<view class="loadall" v-if="list.length > 10 && loadAll">{{i18n.endTips}}</view>
		<!-- 空 -->
		<view class="empty" v-if="!list.length">
			<view class="empty-icon">
				<image src="/static/images/icon/empty.png"></image>
			</view> 
			<view class="empty-text">{{i18n.noOrderTips}}</view>
		</view>
	</view>
</template>

<script module="wxs" lang="wxs" src="../../wxs/number.wxs"></script>
<script>
const http = require("../../utils/http.js")
const config = require("../../utils/config.js")
const util = require("../../utils/util.js")
import { PayType, AppType } from "../../utils/constant.js"
import Pay from "../../utils/pay.js"

export default {
	data() {
		return {
			list: [],
			current: 1,
			pages: 0,
			sts: 0,
			endTime: '', //订单过期时间
			loadAll: false // 已加载全部
		}
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
		if (options.sts) {
			this.setData({
				sts: options.sts
			});
		}
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {
		// 加载导航标题
		uni.setNavigationBarTitle({
			title:"我的訂單"
		});
		uni.pageScrollTo({
			scrollTop: 0,
			duration: 0 
		})
		this.loadOrderData(this.sts, 1);
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function() {

	},

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
	onReachBottom: function() {
		if (this.current < this.pages) {
			this.loadOrderData(this.sts, this.current + 1);
		} else {
			this.setData({
				loadAll: true
			})
		}
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {},
	methods: {
		/**
		 * 加载订单数据
		 */
		loadOrderData: function(sts, current) {
			var ths = this;
			wx.showLoading(); //加载订单列表
			var params = {
				url: "/api/v1/myOrder/myOrder",
				method: "GET",
				data: {
					current: current,
					size: 10,
					status: sts
				},
				callBack: function(res) {
					res.records.forEach(orderItem => {
						orderItem.totalCounts = 0
						if (orderItem.returnMoneySts == null) {
							orderItem.returnMoneySts = 0
						}
						orderItem.orderItemDtos.forEach(prod => {
							orderItem.totalCounts += prod.prodCount
						})
					})
					var list = [];
					if (res.current == 1) {
						list = res.records;
					} else {
						list = ths.list.concat(res.records)
					}
					ths.setData({
						list: list,
						pages: res.pages,
						current: res.current,
					});
					uni.hideLoading();
				},
			};
			http.request(params);
		},

		/**
		 * 状态点击事件
		 */
		onStsTap: function(e) {
			util.tapLog()
			var sts = e.currentTarget.dataset.sts;
			this.setData({
				sts: sts
			});
			uni.pageScrollTo({
				scrollTop: 0,
				duration: 0 
			})
			this.loadOrderData(sts, 1);
		},

		/**
		 * 跳转店铺首页
		 */
		toShopIndex: function(e) {
			let shopid = e.currentTarget.dataset.shopid
			util.tapLog()
			if (shopid) {
				uni.navigateTo({
					url: '/packageShop/pages/shopPage/shopPage?shopId=' + shopid
				})
			}else{
				uni.navigateTo({
					url: '/packageMemberIntegral/pages/integralIndex/integralIndex'
				})
			}
		},

		/**
		 * 查看物流
		 */
		toDeliveryPage: function(e) {
			util.tapLog()
			uni.navigateTo({
				url: '/pages/logisticsInfo/logisticsInfo?orderNumber=' + e.currentTarget.dataset.ordernum
			});
		},

		/**
		 * 取消订单
		 */
		onCancelOrder: function(e) {
			util.tapLog()
			var ordernum = e.currentTarget.dataset.ordernum;
			
			// var ths = this;
			// uni.showModal({
			// 	title: '',
			// 	content: ths.i18n.cancelOrderTips,
			// 	confirmColor: "#3e62ad",
			// 	cancelColor: "#3e62ad",
			// 	cancelText: ths.i18n.no,
			// 	confirmText: ths.i18n.yes,

			// 	success(res) {
			// 		if (res.confirm) {
			// 			uni.showLoading({
			// 				mask: true
			// 			});
			// 			var params = {
			// 				url: "/api/v1/myOrder/cancel/" + ordernum,
			// 				method: "PUT",
			// 				data: {},
			// 				callBack: function(res) {
			// 					//console.log(res);
			// 					ths.loadOrderData(ths.sts, 1);
			// 					uni.hideLoading();
			// 				}
			// 			};
			// 			http.request(params);
			// 		} else if (res.cancel) { //console.log('用户点击取消')
			// 		}
			// 	}

			// });
		},

		/**
		 * 付款
		 */
		onPayAgain: function(e) {
			const dvyType = e.currentTarget.dataset.dvytype
			util.tapLog()
			uni.showLoading({
				mask: true
			});
			var params = {
				url: "/api/v1/order/getOrderPayInfoByOrderNumber",
				method: "GET",
				data: {
					orderNumbers: e.currentTarget.dataset.ordernum
				},
				callBack: res => {
					uni.hideLoading();
					this.setData({
						//订单过期时间
						endTime: res.endTime.replace(/-/g, "/"),
					});
					var nowTime = new Date().getTime(); //现在时间（时间戳）
					var endTime = new Date(this.endTime).getTime(); //结束时间（时间戳）
					var time = (endTime - nowTime) / 1000; //距离结束的毫秒数
					if (time > 0) {
						uni.navigateTo({
							url: '/pages/payWay/payWay?orderNumbers=' + e.currentTarget.dataset.ordernum
						})
					} else {
						uni.showModal({
							title: this.i18n.tips,
							content: this.i18n.orderExpired,
							cancelText: this.i18n.cancel,
							confirmText: this.i18n.confirm,
							showCancel: false,
							confirmColor: "#e43130",
							success: (res) => {
								if (res.confirm) {
									this.loadOrderData(this.sts, 1);
								} else if (res.cancel) {
									//console.log('用户点击取消')
								}
							}
						});
						return;
					}
				},
				errCallBack: res => {
					uni.hideLoading();
				},
			};
			http.request(params);
		},

		/**
		 * 查看订单详情
		 */
		toOrderDetailPage: function(e) {
			util.tapLog()
			// uni.navigateTo({
			// 	url: '/pages/order-detail/order-detail?orderNum=' + e.currentTarget.dataset.ordernum
			// });
			this.$Router.push({
				path:'/pages/order-detail/order-detail', query: {orderNum:e.currentTarget.dataset.ordernum}
			})
		},

		/**
		 * 确认收货
		 */
		onConfirmReceive: function(e) {
			util.tapLog()
			var ths = this;
			uni.showModal({
				title: '',
				content: ths.i18n.haveRceivedGoods,
				cancelText: ths.i18n.cancel,
				confirmText: ths.i18n.confirm,
				confirmColor: "#EF103C",

				success(res) {
					if (res.confirm) {
						uni.showLoading({
							mask: true
						});
						var params = {
							url: "/api/v1/myOrder/receipt/" + e.currentTarget.dataset.ordernum,
							method: "PUT",
							data: {},
							callBack: function(res) {
								//console.log(res);
								ths.loadOrderData(ths.sts, 1);
								uni.hideLoading();
							}
						};
						http.request(params);
					} else if (res.cancel) { //console.log('用户点击取消')
					}
				}

			});
		},
		//删除已完成||已取消的订单
		delOrderList: function(e) {
			util.tapLog()
			var ths = this;
			uni.showModal({
				title: '',
				content: ths.i18n.sureDeleteOrder,
				cancelText: ths.i18n.cancel,
				confirmText: ths.i18n.confirm,
				confirmColor: "#EF103C",

				success(res) {
					if (res.confirm) {
						var ordernum = e.currentTarget.dataset.ordernum;
						uni.showLoading();
						var params = {
							url: "/api/v1/myOrder/" + ordernum,
							method: "DELETE",
							data: {},
							callBack: function(res) {
								ths.loadOrderData(ths.sts, 1);
								uni.hideLoading();
							}
						};
						http.request(params);
					} else if (res.cancel) {
					}
				}

			});
		},

		/**
		 * 跳转评价页面
		 */
		onComment: function(e) {
			util.tapLog()
			var info = e.currentTarget.dataset.info;
			uni.setStorageSync("orderItemInfo", info);
			uni.navigateTo({
				url: '/pages/prodComm/prodComm'
			});
		}
	}
}
</script>
<style>
	@import "./orderList.css";
</style>
