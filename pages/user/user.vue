<template>
	<!--pages/user/user.wxml-->
	<view class="container">
		<u-navbar :is-back= "false" title="個人中心"title-color="#000000" title-size="36">
			<view style="width: 95%;display: flex; justify-content: flex-end;">
				<view @click="goMessage"  style="text-align: center;font-size: 16rpx; color: #47D1D1;margin-right: 10rpx;">
					<view class="">
						<!-- <u-icon name="chat" color="#47D1D1" size="38"></u-icon> -->
						<image style="width: 30rpx; height: 30rpx;" src="../../static/images/proneler/chat.png" mode=""></image>
					</view>
					<view >消息</view>
				</view>
				<view style="text-align: center;font-size: 16rpx; color: #47D1D1;" @click="goSetting">
					<view class="">
				  	  <image style="width: 30rpx; height: 30rpx;"  src="../../static/images/proneler/setting.png" mode=""></image>
					</view>
					<view class="">设置</view>
				</view>
			</view> 
		</u-navbar> 
		<!-- 用户信息 -->
		<view class="userinfo-none" v-if="isAuthInfo">
			<view class="default-pic" @tap="toPersonalInformation">
				<image :src="userInfo.pic? userInfo.pic : '/static/images/icon/head04.png'"></image>
			</view>
			<view class="none-login">
				<view class="member-lev"@tap="toPersonalInformation">
					<text class="nick-name" >{{userInfo.nickName ? userInfo.nickName:'我是开发者00一号'}}</text>
					<view class="level">
						<u-icon name="arrow-right" color="#999999" size="28"></u-icon> 
						<!-- <view class="text">{{userLevelInfo.levelName}}</view> -->
					</view>
				</view>

				<view class="member-integral" @tap="toMemberInteral">
					<image src="/static/images/icon/jifen.png"></image>
					<text>{{userLevelInfo.score?userLevelInfo.score:'0'}}</text>
					
				</view>
				<!-- <text class="update-info" bindtap="updateInfo">更新信息</text> -->
				<view class="buy-member" @tap="toBuyMember">
					<text>月卡購買</text>
				</view>
			</view>
		</view>
        <!-- 未登录用户信息 -->
		<view class="userinfo-none" v-if="!isAuthInfo" @tap="onGotUserInfo">
			<view class="default-pic">
				<image src="/static/images/icon/head04.png"></image>
			</view>
			<view class="none-login">
				<button class="unlogin">{{i18n.notLoggedIn}}</button>
				<button class="click-login">{{i18n.clickAccountLogin}}</button>
			</view>
		</view>
		<!-- end 用户信息 -->
             
		<!-- 钱包数据 -->
		<view class="wallet-data" v-if="isAuthInfo">
			<view class="data-item" @tap="toMyWallet">
				<view class="data-num">{{i18n.currencySymbol + totalBalance}}</view>
				<view class="data-name">{{i18n.balance}}</view>
			</view>
			<view class="data-item" @tap="toMyCouponPage">
				<view class="data-num">{{couponNum}}</view>
				<view class="data-name">{{i18n.coupon}}</view>
			</view>
			<view class="data-item" @tap="toMemberInteral">
				<view class="data-num">{{score}}</view>
				<view class="data-name">{{i18n.userIntegral}}</view>
			</view>
			<view class="data-item" @tap="toMyMessage">
				<!-- #ifndef MP-WEIXIN -->
				<!-- 除了小程序，其它平台均存在的代码 -->
				<view class="data-num">{{messageCount}}<sup class="dot" v-if="messageCount > 0">●</sup></view>
				<!-- #endif -->
				<!-- #ifdef MP-WEIXIN -->
				<!-- 只在微信小程序平台存在的代码 -->
				<view class="data-num">{{messageCount}}<view class="point" v-if="messageCount > 0">●</view></view>
				<!-- #endif -->
				<view class="data-name">{{i18n.messageNotify}}</view>
			</view>
		</view>
		<!-- 钱包数据 end -->
 <!--       <view class="prens">
        	 <view class="prens-view">
        	 	<view class="">HKR$</view>
        	 	<view style="color: #999999;font-size: 24rpx;margin-top: 10rpx;">餘額</view>
        	 </view>
			 <view class="">
			 	<view class="">4</view>
			 	<view style="color: #999999;font-size: 24rpx;margin-top: 10rpx;">優惠劵</view>
			 </view>
			 <view class="">
			 	<view class="">2.1w</view>
			 	<view style="color: #999999;font-size: 24rpx;margin-top: 10rpx;">積分</view>
			 </view>
			 <view class="">
			 	<view class="">456</view>
			 	<view style="color: #999999;font-size: 24rpx;margin-top: 10rpx;">消息通知</view>
			 </view>
        </view> -->
		<!-- 省钱月卡 -->
		<view class="save-money">
			<view class="save-bc">
				<image style="height: 140rpx;width: 100%;" src="../../static/images/icon/bcVip.png" mode=""></image>
			</view>
			<view class="intitle">
				<view class="intitle-flex">
					<view class="">
						<image style="width: 35rpx; height: 35rpx;"  src="../../static/images/icon/huangguan.png" mode=""></image>
					</view>
					<view style="margin-left: 15rpx;"> 省錢月卡 以節省HK$400 </view>
				</view>
				<view class="Immediately-opened">立即开通</view>
			</view>
		</view>
		<view class="list-cont"> 
			<!-- 订单状态 -->
			<view class="total-order">
				<view class="order-tit">
					<text style="font-weight:bold">我的訂單</text>
					<view class="checkmore" @tap="toOrderListPage" data-sts="0">
						<text>全部订单</text>
						<text class="arrowhead"></text>
					</view>
				</view>
				<view class="procedure">
					<view class="items" @tap="toOrderListPage" data-sts="1">
						<image src="/static/images/proneler/payment.png"></image>
						<text>待付款</text>
						<text class="num-badge" v-if="orderAmount.unPay>0">{{orderAmount.unPay}}</text>
					</view>
					<view class="items" @tap="toOrderListPage" data-sts="2">
						<image src="/static/images/proneler/dropShipping.png"></image>
						<text>待發貨</text>
						<text class="num-badge" v-if="orderAmount.payed>0">{{orderAmount.payed}}</text>
					</view>
					<view class="items" @tap="toOrderListPage" data-sts="3">
						<image src="/static/images/proneler/collectingCargo.png"></image>
						<text>待收款</text>
						<text class="num-badge" v-if="orderAmount.consignment>0">{{orderAmount.consignment}}</text>
					</view>
					<view class="items" @tap="toOrderListPage" data-sts="5">
						<image src="/static/images/proneler/offStocks.png"></image>
						<text>已完成</text>
					</view>
					<view class="items" @tap="toAfterSalesPage">
						<image src="/static/images/proneler/afterSale.png"></image>
						<text>取消/售後</text>
						<text class="num-badge after-sale-num-badge" v-if="orderAmount.refund>0">{{orderAmount.refund}}</text>
					</view>
				</view>
			</view>
			<!--end 订单状态 -->

			<!-- <view class="prod-col">
      <view class="col-item" bindtap='myCollectionHandle'>
        <view class="num">{{collectionCount}}</view>
        <view class="tit">我的收藏</view>
      </view>
      <view class="col-item">
        <view class="num">5</view>
        <view class="tit">我的消息</view>
      </view>
      <view class="col-item">
        <view class="num">3</view>
        <view class="tit">我的足迹</view>
      </view>
    </view> -->
            <!-- 必备工具 -->
			<view class="essential-tool">
				<view style="font-weight: bold;font-size: 28rpx; margin: 30rpx;">必备工具</view>
				<view class="tool-list">
					<view class="tool-list-box" @tap="toCouponCenter">
						<view class="">
							<image src="/static/images/proneler/center.png" mode=""></image>
						</view>
						<view class="">領劵中心</view>
					</view>
					<view class="tool-list-box" @tap="toBuyMember">
						<view class="">
							<image src="/static/images/proneler/c2.png" mode=""></image>
						</view>
						<view class="">我的月卡</view>
					</view>
					<view class="tool-list-box" @tap="toAddressList">
						<view class="">
							<image src="/static/images/proneler/c3.png" mode=""></image>
						</view>
						<view class="">收貨地址</view>
					</view>
					<view class="tool-list-box" @tap="myCollectionHandle">
						<view class="">
							<image src="/static/images/proneler/c4.png" mode=""></image>
						</view>
						<view class="">我的收藏</view>
					</view>
					
					<view class="tool-list-box" @tap="applyAShop">
						<view class="">
							<image src="/static/images/proneler/c5.png" mode=""></image>
						</view>
						<view class="">申請做商家</view>
					</view>
					<view class="tool-list-box"  @tap="gotoChat">
						<view class="">
							<image src="/static/images/proneler/c6.png" mode=""></image>
						</view>
						<view class="">聯繫平台</view>
					</view>
					<view class="tool-list-box" @click="kefuMessage">
						<view class="">
							<image src="/static/images/proneler/c7.png" mode=""></image>
						</view>
						<view class="">客服消息</view>
					</view>
					<view class="tool-list-box" @click="myfootprint">
						<view class="">
							<image src="/static/images/proneler/c8.png" mode=""></image>
						</view>
						<view class="">我的足跡</view>
					</view>
				</view>
			</view>
		
			
		</view>

	</view>
</template>

<script>
	// pages/user/user.js
	var http = require("../../utils/http.js");
	var util = require("../../utils/util.js");
	import Wechat from '../../utils/wechat.js'
	import { PayType, AppType } from "../../utils/constant.js";

	export default {	
		data() {
			return {
				shopId: 0,
				orderAmount: {},
				sts: '',
				collectionCount: 0,
				//分销开关
				canDistribution: true,
				isAuthInfo: true,
				shopAuditStatus: null,
				//店铺状态：0 未审核 1已通过 -1未通过 null 未开店
				isSetPassword: false,
				//是否已经设置过支付密码
				loginResult: {},
				userLevelInfo: {},
				shopStatus: '', // 店铺状态

				userInfo: {}, // 用户信息
				messageCount: 0, // 消息数量

				couponNum: 0,  //优惠券数量
				score: 0, //用户积分
				totalBalance: 0, //用户余额
				notifyNum: 0,
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
			// uni.setNavigationBarTitle({
			// 	title: this.i18n.personalCenter
			// });
			http.getCartCount()
			// #ifndef H5
			var logData = uni.getStorageSync('flowAnalysisLogDto')
			uni.setStorageSync('step', uni.getStorageSync('step') / 1 + 1)
			if (logData && logData.pageId != 12) {
				logData.pageId = 12
				logData.step = uni.getStorageSync('step')
				uni.setStorageSync('flowAnalysisLogDto', logData)
				http.saveLog(logData, 1)
			}
			// #endif
			this.setData({
				isAuthInfo: Boolean(uni.getStorageSync('loginResult').userId),
				loginResult: uni.getStorageSync('loginResult')
			});
			// 排除 tempToken 影响，真实登陆后再请求数据
			if (uni.getStorageSync('token')) {
				//加载订单数据
				this.loadOrderCountFun();
				// 获取会员信息
				this.getUserLevelInfo();
				// 查询分销是否开启
				this.getDistInfo()
				// 查询用户信息
				this.queryUserInfo()
				// 获取用户消息
				this.getMyNotifyRemind()
				//钱包数据
				this.queryUserData()
			}
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
			// 跳转到设置页面
			goSetting(){
				uni.navigateTo({
					url:'/pages/setting/setting' 
				})
			},
			// 跳转至我的消息页
			goMessage(){
				uni.navigateTo({
					url:'/pages/my-message/my-message' 
				})
			},
			// 跳转我的足迹
			myfootprint(){
				console.log(11)
				uni.navigateTo({
					url:'/pages/footprint/footprint'
				})
			},
			/** * 获取未读消息数量 */
			getMyNotifyRemind() {
				var params = {
					url: '/api/v1/myNotifyLog/unReadCount',
					method: 'GET',
					dontTrunLogin: true,
					data: {},
					callBack: res => {
						if (uni.getStorageSync('token')) {
							this.setData({
								messageCount: res
							});
						}
					}
				};
				http.request(params)
			},
			/** * 跳转站内消息 */
			toMyMessage() {
				util.checkAuthInfo(() => {
					uni.navigateTo({
						url: '/pages/recent-news/recent-news?showMessage=1'
					})
				})
			},
			/** * 切换语言 */
			changeLangs() {
				if (uni.getStorageSync("lang").indexOf('zh') != -1) {
					this._i18n.locale = 'en';
					uni.setStorageSync('lang', 'en')
				} else {
					this._i18n.locale = 'zh_CN';
					uni.setStorageSync('lang', 'zh_CN')
				}
				uni.reLaunch({
					url: '/pages/user/user',
					success: function (e) {
						var page = getCurrentPages().pop();  //跳转页面成功之后
						if (!page) return;
						console.log(page)
						page.onLoad(); //如果页面存在，则重新刷新页面
					}
				})
			},
			/** * 钱包数据 */
			queryUserData: function() {
				var params = {
					url: "/api/v1/user/getUserInfo",
					method: "GET",
					dontTrunLogin: true,
					data: {},
					callBack: res => {
						if (uni.getStorageSync('token')) {
							this.setData({
								couponNum: res.couponNum,  //优惠券数量
								score: res.score, //用户积分
								totalBalance: res.totalBalance, //用户余额
								notifyNum: res.notifyNum,  // 消息提醒
							});
						}
					}
				};
				http.request(params);
			},

			// 加载订单数据
			loadOrderCountFun() {
				uni.showLoading();
				var params = {
					url: "/api/v1/user/centerInfo",
					method: "GET",
					dontTrunLogin: true,
					data: {},
					callBack: res => {
						uni.hideLoading();
						if (uni.getStorageSync('token')) {
							this.setData({
								shopAuditStatus: res.shopStatus,
								isSetPassword: res.isSetPassword,
								orderAmount: res.orderCountData,
								shopId: res.shopId,
								shopStatus: res.shopStatus,
							});
						}
					 wx.setStorageSync("shopInfo", res)
					}
				};
				http.request(params);
			},

			// 我的钱包
			toMyWallet() {
				util.checkAuthInfo(() => {
					uni.navigateTo({
						url: '/pages/myWallet/myWallet'
					})
				})
			},

			/** * 扫一扫 */
			sacnCode: util.throttle(function() {
				util.tapLog()
				util.checkAuthInfo(() => {
					// #ifdef H5
					if (!Wechat.isWechat()) {
						uni.showToast({
							title: this.i18n.openInWeChatBrowser,
							icon: "none"
						})
						return
					}
					Wechat.scanQRCode((codeStr) => {
						var code = ''
						// 处理扫码结果
						if (codeStr.indexOf(',') > -1) {
							code = codeStr.split(',')[1]
						} else {
							code = codeStr
						}
						uni.navigateTo({
							url: '/pages/stationOrderList/stationOrderList?stationId=' + code
						})
					}, () => {
						uni.showToast({
							title: this.i18n.failedInvokeScan,
							icon: 'none'
						})
					})
					// #endif

					// #ifdef APP-PLUS || MP-WEIXIN
					uni.scanCode({
						success: (e) => {
							uni.navigateTo({
								url: '/pages/stationOrderList/stationOrderList?stationId=' + e.result
							})
						},
						fail: (err) => {
							console.log(err)
						}
					})
					// #endif
				})

			}, 1000),
			/** * 获取用户信息 */
			queryUserInfo: function() {
				wx.showLoading();
				var params = {
					url: "/api/v1/user/userInfo",
					method: "GET",
					data: {},
					dontTrunLogin: true,
					callBack: (res) => {
						wx.hideLoading();
						this.userInfo = res
            console.log('555---------------',this.userInfo)
					}
				};
				http.request(params);
			},

			/** * 查询分销相关信息 */
			getDistInfo() {
				//查询分销开关是否开启
				http.request({
					url: "/api/v1/distribution/distributionBasicSet/canDistribution",
					method: "GET",
					// data: {
					//   shopId: 1,
					// },
					dontTrunLogin: true,
					callBack: res => {
						this.setData({
							canDistribution: res == 1
						});
					}
				});
			},

			/** * 跳转分销员中心 */
			toDistCenter: function() {
				util.tapLog()
				util.checkAuthInfo(() => {
					http.request({
						url: "/api/v1/distribution/user/distributionUserInfo",
						method: "GET",
						callBack: res => {
							console.log(res);

							if (res && res.state == 1) {
								// wx.setStorageSync("isDister", true);
								wx.setStorageSync("distCardNo", res.cardNo);
								wx.setStorageSync('distInfo', res);
								uni.navigateTo({
									url: '/packageDistribution/pages/dis-center/dis-center'
								});
							} else if (res && res.state == 0) {
								uni.showToast({
									title: this.i18n.applicationReview,
									icon: "none"
								});
							} else if (res && res.state == 3) {
								uni.showModal({
									title: '',
									content: this.i18n.applicationFailed,
									cancelText: this.i18n.cancel,
									confirmText: this.i18n.confirm,
									confirmColor: "#EF103C",

									success(res2) {
										if (res2.confirm) {
											uni.navigateTo({
												url: '/packageDistribution/pages/applyDist/applyDist'
											});
										} else if (res2.cancel) {
											console.log('用户点击取消');
										}
									}

								});
							} else if (res && res.state == -1) {
								uni.showModal({
									title: '',
									content: this.i18n.distributorBanned,
									confirmColor: "#EF103C",
									cancelText: this.i18n.cancel,
									confirmText: this.i18n.confirm,

									success(res2) {
										if (res2.confirm) {
											console.log('用户点击确认');
										} else if (res2.cancel) {
											console.log('用户点击取消');
										}
									}

								});
							} else if (res && res.state == 2) {
								uni.showModal({
									title: '',
									content: this.i18n.distributorCleared,
									confirmColor: "#EF103C",
									cancelText: this.i18n.cancel,
									confirmText: this.i18n.confirm,

									success(res2) {
										if (res2.confirm) {
										uni.navigateTo({
											url: '../../packageDistribution/pages/applyDistCon/applyDistCon'
										})
										} else if (res2.cancel) {
										
										}
									}

								});
							} else {
								uni.navigateTo({
									url: '/packageDistribution/pages/applyDist/applyDist'
								});
							}
						}
					});
				})
			},
			toAfterSalesPage: function() {
				util.tapLog()
				util.checkAuthInfo(()=>{
					uni.navigateTo({
						url: '/pages/afterSales/afterSales'
					});
				})
			},
      
			//积分中心
			toPointsCenter: function() {
				util.tapLog()
				util.checkAuthInfo(() => {
					uni.navigateTo({
						url: '/packageMemberIntegral/pages/memberIndex/memberIndex'
					});
				})
			},
			toCouponCenter: function() {
				util.tapLog()
				util.checkAuthInfo(() => {
					uni.navigateTo({
						url: '/packageActivities/pages/couponCenter/couponCenter'
					})
				})
			},
			toMyCouponPage: function() {
				util.tapLog()
				util.checkAuthInfo(() => {
					uni.navigateTo({
						url: '/packageActivities/pages/myCoupon/myCoupon'
					})
				})
			},
			toAddressList: function() {
				util.tapLog()
				util.checkAuthInfo(() => {
					uni.navigateTo({
						url: '/pages/delivery-address/delivery-address'
					})
				})
			},
			toOrderListPage: function(e) {
				util.tapLog()
				util.checkAuthInfo(() => {
					var sts = e.currentTarget.dataset.sts;
					// uni.navigateTo({
					// 	url: '/pages/orderList/orderList?sts=' + sts
					// })
					this.$Router.push({
						path: '/pages/orderList/orderList',
						query: {
							sts: sts
						}
					})
				})
			},

			/** * 查询所有的收藏量 */
			showCollectionCount: function() {
				var ths = this;
				uni.showLoading();
				var params = {
					url: "/api/v1/user/collection/count",
					method: "GET",
					data: {},
					callBack: function(res) {
						uni.hideLoading();
						ths.setData({
							collectionCount: res
						});
					}
				};
				http.request(params);
			},

			/** * 我的收藏跳转 */
			myCollectionHandle: function() {
				util.tapLog()
				util.checkAuthInfo(() => {
					var url = '/pages/prod-classify/prod-classify?sts=5'
					var id = 0
					var title = this.i18n.myCollection
					if (id) {
						url += "&tagid=" + id + "&title=" + title
					}
					uni.navigateTo({
						url: url
					})
				})
			},


			/** * 跳转修改密码 */
			setPassword: function() {
				util.tapLog()
				uni.navigateTo({
					url: '/pages/accountLogin/accountLogin?isForgetPassword=true' + '&isPersonalCenter=true'
				});
			},

			/** * 跳转到修改用户头像昵称资料 */
			toPersonalInformation: function() {
				util.tapLog()
				uni.navigateTo({
					url: '/pages/personalInformation/personalInformation'
				})
			},


			/** * 获取用户信息 */
			onGotUserInfo: function(e) {
				util.tapLog()
				util.checkAuthInfo()
			},

			/** * 跳转到申请开店 */
			applyAShop: function() {
				uni.navigateTo({
					url:"/pages/apply-merchant/apply-merchant"
				})
				// util.tapLog()
				// util.checkAuthInfo(() => {
				// 	if (this.shopAuditStatus == 0) {
				// 		uni.showToast({
				// 			title: this.i18n.shopOpeningReview,
				// 			icon: "none"
				// 		});
				// 	} else {
					
				// 	}
				// })
				
			},

			/** * 跳转到账号设置 */
			settingAccout: function() {
				util.tapLog()
				util.checkAuthInfo(() => {
					uni.navigateTo({
						url: '/pages/accountSettings/accountSettings'
					});
				})
			},
			//跳转修改店铺密码
			alterPassword: function() {
				util.tapLog()
				util.checkAuthInfo(() => {
					uni.navigateTo({
						url: '/pages/alterShopPassword/alterShopPassword'
					})
				})
			},

			/** * 跳转到我的店铺 */
			enterMyShop: function(e) {
				util.checkAuthInfo(() => {
					uni.navigateTo({
						url: '/packageShop/pages/shopPage/shopPage?shopId=' + e.currentTarget.dataset.shopid
					})
				})
			},
			/** * 跳转到和客服聊天的界面 */
			gotoChat() {
				util.checkAuthInfo(() => {
					uni.navigateTo({
						url: '/pages/chat/chatIm?shopid=0'
					})
				})
			},
			// 跳转到消息页
			kefuMessage(){
				util.checkAuthInfo(() => {
					uni.navigateTo({
						url: '/pages/my-message/my-message'
					})
				})
			},
			/** * 跳转到和商家客服聊天的界面 */
			gotoMessageBox() {
				util.checkAuthInfo(() => {
					uni.navigateTo({
						url: '/pages/chat/chat'
					})
				})
			},
			/** * 更新用户信息 */
			updateInfo() {
				util.tapLog()
				http.updateUserInfo();
			},

			/** * 获取会员积分详情 */
			getUserLevelInfo() {
				var params = {
					url: '/api/v1/score/scoreInfo',
					method: 'GET',
					dontTrunLogin: true,
					data: {},
					callBack: res => {
						this.setData({
							userLevelInfo: res
						});
					}
				};
				http.request(params);
			},

			/** * 跳转购买会员 */
			toBuyMember() {
				util.tapLog()
				util.checkAuthInfo(() => {
					uni.navigateTo({
						url: '/packageMemberIntegral/pages/buyVip/buyVip'
					});
				});
			},

			/** * 跳转积分中心 */
			toMemberInteral() {
				util.tapLog()
				util.checkAuthInfo(() => {
					uni.navigateTo({
						url: '/packageMemberIntegral/pages/integralIndex/integralIndex'
					});
				});
			},

			/** * 退出登录 */
			logout: function() {
				util.tapLog()
				// 请求退出登陆接口
				http.request({
					url: '/api/v1/logout',
					method: 'GET',
				})
				uni.removeStorageSync('loginResult');
				uni.removeStorageSync('token');
				uni.removeStorageSync('tempToken');
				uni.removeStorageSync('recentSearch');
				uni.removeStorageSync('hadBindUser');
				util.removeTabBadge()
				// 重置uuid、uuidSession、sessionTimeStamp、step、flowAnalysisLogDto
				uni.setStorageSync('uuid', util.getUuid())
				uni.setStorageSync('uuidSession', util.getUuid())
				uni.setStorageSync('sessionTimeStamp', new Date().getTime())
				uni.setStorageSync('step', 0)
				uni.setStorageSync('flowAnalysisLogDto', '')
				let emptyObj = {}
				this.setData({
					orderAmount: emptyObj,
					couponNum: 0,  //优惠券数量
					score: 0, //用户积分
					totalBalance: 0, //用户余额
					notifyNum: 0,  // 消息提醒
					messageCount: 0,
				})
				this.$Router.pushTab('/pages/index/index')
			},
      
      // 扫码核销
      ScanCode(){
        uni.scanCode({
          success: function (res) {
            console.log(res.result)
            wx.showLoading();
            var params = {
            	url: "/api/v1/order/orderVerification?" + res.result,
            	method: "post",
            	data: {},
            	dontTrunLogin: true,
            	callBack: (res) => {
            		wx.hideLoading();
            	}
            };
            http.request(params);
          }
        });
      }
		}
	};
</script>
<style>
	@import "./user.css";
</style>
