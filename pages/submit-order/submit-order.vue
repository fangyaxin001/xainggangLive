<template>
	<view>
		<!--pages/submit-order/submit-order.wxml-->
		<view class="container">
			<view class="submit-order">

				<!-- 收货地址 -->
				<view class="prod-item">
					<!-- 店铺 -->
					<view class="shop-box">
						<view class="shop-icon">
							<image style="width: 40rpx;height: 40rpx;" src="../../static/images/proneler/dingwei.png"></image>
						</view>
						<view class="shop-name">
							<view class="shop-name-flex">
								<view class="">
									<view class="shop-name-right">
										<view class="right-home">家</view>
										<view class="right-name"><text>王盼盼</text><text class="right-name-phone">16789987654</text></view>
									</view>
									<view class="right-city"> 郑州市 二七区 大学路 康桥华城国际中心1932</view>
								</view>
								<view class="">
									<u-icon name="arrow-right" color="#BFBFBF" size="28"></u-icon>
								</view>
							</view>
						</view>
					</view>
					<!-- 线段图 -->
					<!-- 	<view class="">
						<image src="" mode=""></image>
					</view> -->
				</view>



				<view class="shop-item">
					<view v-for="(shopCart, index) in shopCartOrders" :key="index">
						<!-- 店铺信息 -->
						<view class="shop-box">
							<view class="shop-icon">
								<image src="/static/images/icon/shop.png"></image>
							</view>
							<view class="shop-name">我的小铺 </view>
							<view class="shop-name" style="text-align: right;">
								<u-icon @click="" name="arrow-right" color="#BFBFBF" size="28"></u-icon>
							</view>
						</view>
						<!-- /店铺信息 -->

						<!-- 店铺商品明细 -->
						<view class="prod-item">
							<view v-for="(shopCartItem, index2) in shopCart.shopCartItemDiscounts" :key="index2">
								<view :class="['prod-block',shopCartItem.chooseDiscountItemDto?'discount':'']">
									<!-- 满减提示 -->
									<view class='discount-tips' :hidden='!shopCartItem.chooseDiscountItemDto' v-if="shopCartItem.chooseDiscountItemDto && preSellStatus!=1">
										<text class='text-block'>{{wxs.parseDiscount(shopCartItem.chooseDiscountItemDto.discountRule,curLang)}}</text>
										<text class='text-list'>{{wxs.parseDiscountMsg(shopCartItem.chooseDiscountItemDto.discountRule,shopCartItem.chooseDiscountItemDto.needAmount,shopCartItem.chooseDiscountItemDto.discount,curLang)}}</text>
										<text class="text-list reduce-amount">{{i18n.haveDiscount}} ￥{{wxs.parsePrice(shopCartItem.chooseDiscountItemDto.reduceAmount)[0]}}.{{wxs.parsePrice(shopCartItem.chooseDiscountItemDto.reduceAmount,curLang)[1]}}</text>
									</view>

									<!-- 商品信息 -->
									<view class="item-box">
										<view :class="[preSellStatus==1?'pre-sell' : '','item-cont']" v-for="(item, prodId) in shopCartItem.shopCartItems"
										 :key="prodId">
											<view class="prod-pic">
												<image :src="item.pic"></image>
											</view>
											<view class="prod-info">
												<view class="prodname">{{item.prodName}}</view>
												<view class="prod-info-cont">{{item.skuName}}</view>
												<view class="price-nums">
													<view class="prodprice">

													</view>
													<view class="prodcount">×{{item.prodCount}}</view>
												</view>
											</view>
										</view>
									</view>

								</view>
							</view>

						</view>
						<!-- 店铺优惠券和买家留言 -->
						<view class="msg-item">
							<view class="opren-box" @tap="showCouponPopup" :data-index="index" v-if="preSellStatus!=1">
								<view class="">
									<text class="text">優惠劵：</text>
								</view>
								<view style="color: #BFBFBF;" @click="poproFalg=true">
									<text>選擇優惠劵</text>
									<u-icon style="margin-left: 20rpx;" name="arrow-right" color="#BFBFBF" size="28"></u-icon>
								</view>
							</view>
							<view class="opren-box">
								<view class="tit">店鋪備註：</view>
								<view class="">
									<u-input v-model="remark" input-align="right" type="text" placeholder="建議留言前先與商家溝通" />
								</view>
							</view>
							<view class="opren-box">
								<view class="tit">平台優惠劵：</view>
								<view style="color: #BFBFBF;">
									<text>暫無可用</text>
									<u-icon style="margin-left: 20rpx;" name="arrow-right" color="#BFBFBF" size="28"></u-icon>
								</view>

							</view>
							<view class="opren-box">
								<view class="tit">積分抵扣：</view>
								<view style="color: #BFBFBF;">
									<text>不使用積分抵扣</text>
									<u-icon style="margin-left: 20rpx;" name="arrow-right" color="#BFBFBF" size="28"></u-icon>
								</view>
							</view>
							<view class="opren-box">
								<view class="tit">商品總額：</view>
								<view style="color: #BFBFBF;">
									<text>HK$</text>1999.00
								</view>
							</view>
							<view class="opren-box">
								<view class="tit">運費：</view>
								<view style="color: #BFBFBF;">
									<text>HK$</text>1999.00
								</view>
							</view>
							<view class="opren-box" style="border-bottom: none;">
								<view class="tit">總優惠金額：</view>
								<view style="color: #BFBFBF;">
									-<text>HK$</text>1999.00
								</view>
							</view>
						</view>
						<!-- /店铺优惠券和买家留言 -->
					</view>  
				</view> 
				<!-- /总金额计算 -->
			</view>

			<!-- 底部栏 -->
			<view v-if="tabbar" class="submit-order-footer">
				<view class="sub-order">
					<view class="item-txt">總計：：<view class="price">
							<text class="symbol" style="font-size: 20rpx;">HK$</text>
							<text class="big-num">1999.00</text>
							<!-- <text class="small-num">.{{wxs.parsePrice(actualTotal)[1]}}</text> -->
						</view>
					</view>
				</view>
				<view style="margin-right: 20rpx;color: #1A1A1A;">共2件</view>
				<view class="footer-box" @tap="toPay">提交訂單</view>
			</view>
		</view>
 
		<!-- 历史提货人弹窗 -->
		<view class="popup-hide" :hidden="!showRaisingUserList">
			<view class="popup-box address-list history-user">
				<view class="con-tit">
					<view class="close" @tap="closePopup"></view>
					<view class="tit-text">{{i18n.historicalPickPerson}}</view>
					<!-- <view class="sure"><image src="/static/images/icon/sure.png"></image></view> -->
				</view>
				<view class="address-box" v-if="stationUserInfo && stationUserInfo.length > 0">
					<radio-group @change="stationRadioChange" v-for="(item,index) in stationUserInfo" :key="index">
						<view class="item">
							<view class="text-box">
								<view class="address history-picker-user">
									<view class="gray">{{i18n.pickUpPerson}}：</view>
									<view>{{item.stationUserName}}</view>
								</view>
								<view class="address history-picker-user">
									<view class="gray">{{i18n.phoneNumber}}：</view>
									<view>{{item.stationUserMobile}}</view>
								</view>
							</view>
							<radio color="#EF103C" class="check" :value="String(index)" :checked="stationIdx == index" @tap="getStationItem(item)"></radio>
						</view>
					</radio-group>
				</view>
			</view>
		</view>

		<!-- 选择提货时间弹窗 -->
		<view class="popup-hide" :hidden="!showRaisingTimePop">
			<view class="popup-box raising-time">
				<view class="con-tit">
					<view class="tit-text">{{i18n.choosePickUpTime}}</view>
					<view class="close" @tap="closePopup"></view>
				</view>
				<view class="time-box">
					<view class="day-box" v-if="selStationItem && timeParams">
						<view :class="['item', dateIndex==dateIdx?'active':'']" v-for="(item,dateIdx) in timeParams" :key="dateIdx" @tap="changeData(item,dateIdx)">{{item.dateTime}}</view>
						<!-- <view class="item">07-10(后天)</view> -->
					</view>
					<block v-if="timeParams[dateIndex]">
						<view class="hour-box" v-if="timeParams[dateIndex].hourTimes">
							<radio-group v-for="(timeItem,timeIdx) in timeParams[dateIndex].hourTimes" :key="timeIdx">
								<view class="item" @tap="changeTime(timeItem,timeIdx)">
									<view :class="['number', timeIndex==timeIdx?'red-word':'']">{{timeItem}}</view>
									<radio color="#EF103C" class="check" :checked="timeIndex==timeIdx" :value="String(timeIdx)" v-if="timeIndex==timeIdx"></radio>
								</view>
							</radio-group>
						</view>
					</block>
				</view>
			</view>
		</view>
		<!-- 选择优惠劵 -->
<u-popup v-model="poproFalg" mode="bottom">
			<view class="popup-popro">
				<view class="popro-top">
					<view class="popro-dot">
						<view style="opacity: 0.5;margin-right: 10rpx;"></view>
						<view></view>
					</view>
					<view class="popro-top-title">選擇優惠券</view>
					<view class="popro-dot">
						<view></view>
						<view style="opacity: 0.5;margin-left: 10rpx;"></view>
					</view>
				</view>
				<view class="coupons">
					<u-radio-group v-model="coupin_value" @change="radioGroupChange" style="width: 100%;">
				  <view class="cou-list" v-for="(item,index) in 3" :key="index">
				  	  <view class="cou-list-left">
				  	  	<view style="font-size: 20rpx;"><text>HK$</text><text style="font-size: 40rpx;">5.00</text></view>
				  	  	<view style="font-size: 22rpx;margin-top: 20rpx; ">滿200港幣</view>
				  	  </view>
					  <view class="cou-list-right">
					  	<view class="list-right-flex">
							<view class="">滿200港幣减5港幣</view>
							<view class="">
								<u-radio active-color="#FA2033"  @change="radioChange"  name="哈哈" > </u-radio>
							</view>
						</view>
					  	<view style="color: #FF2B4C;font-size: 24rpx;margin-top: 30rpx;">全场可用</view>
					  	<view style="color: #999999;font-size: 24rpx;margin-top: 10rpx;">有效期至：2020-9-28  24:00</view>
					  </view>
				  </view>
				 
				  <view class="nocoupon">
				  	<view class="" >不使用優惠</view>
					<view class=""><u-radio active-color="#FA2033"  @change="radioChange"  name="嘿嘿" > </u-radio></view>
				  </view>
				 </u-radio-group>
				</view> 
			</view>
			  <view class="ysh">确定</view>
		</u-popup>
	</view>
</template>

<script module="wxs" lang="wxs" src="../../wxs/number.wxs"></script>

<script>
	var http = require("../../utils/http.js");
	var util = require("../../utils/util.js");
	var config = require("../../utils/config.js");
	var index = [18, 0, 0];
	var t = 0;
	var show = false;
	var moveY = 200;
	import coupon from "../../components/orderCoupon/coupon";
	// import coupon from "../../../components/coupon/coupon";
	import {
		PayType,
		AppType
	} from "../../utils/constant.js";
	import Wechat from "../../utils/wechat.js";
	import Pay from "../../utils/pay.js";
	export default {
		data() {
			return {
				coupin_value:'哈哈', //选中的优惠卡
				poproFalg:false,//控制选择优惠劵弹框
				remark: '',
				popupShow: false,
				orderEntry: "0", // 订单入口 0购物车 1立即购买
				userAddr: null,
				orderItems: [],
				shopCartOrders: [],
				//所有店铺的数据
				couponSts: 1,
				platformCoupons: {
					canUseLength: 0,
					canUseCoupons: [],
					unCanUseCoupons: []
				},
				// 平台优惠券数据
				showCoupons: {
					canUseCoupons: [],
					unCanUseCoupons: []
				},
				actualTotal: 0,
				total: 0,
				totalCount: 0,
				transfee: 0,
				reduceAmount: 0, //减免金
				couponIds: [],
				orderReduce: 0,
				userChangeCoupon: 0, // 用户有没有对优惠券进行改变
				orderReduce: 0,
				choose: true,
				totalScoreAmount: 0, //积分抵扣金额
				totalUsableScore: 0, //整个订单可以使用的积分数
				isScorePay: 0, //用户是否选择积分抵现(0不使用 1使用 默认不使用)
				isChecked: false, //是否选择会员积分抵现
				isProhibit: false, //（积分抵现）checkbox是否禁止
				totalLevelAmount: 0, //等级抵扣金额
				freeTransfee: 0, //用户等级免运费金额
				isCanUse: true,
				order: true,
				editorFlag: false, //用户点击编辑按钮所在区域隐藏
				userUseScore: '', // 积分数量
				scorePlaceholder: '', // 积分抵扣的占位符
				accountCanUseScore: 0, // 用户当前可用积分
				shopUseScore: '', // 积分抵现比例
				maxUsableScore: "", // 最大可用积分
				showScorePop: false, // 积分输入弹窗显隐
				isEditAddr: false, // 编辑地址
				showDistributionPop: false, // 选择物流方式弹窗
				addressList: [], // 地址列表
				showAddressListPop: false, // 可用地址弹窗
				isDistribution: true, // 配送方式tab状态
				showRaisingUserList: false, //选择历史提货人弹窗
				showRaisingTimePop: false, //选择提货时间弹窗
				dvyType: 1, // 配送类型 1:快递 2:自提 3：无需快递 4:同城配送
				filterShopItems: [], // 过滤掉的商品项
				addrId: 0,
				value: [0, 0, 0],
				provArray: [],
				cityArray: [],
				areaArray: [],
				province: "",
				city: "",
				area: "",
				provinceId: 0,
				cityId: 0,
				areaId: 0,
				receiver: "",
				mobile: "",
				addr: "",
				addrId: 0,
				animation: "",
				show: "",
				region: "",
				stationUserName: '', // 提货人
				stationUserMobile: '', // 提货人手机号
				stationUserInfo: [], //历史提货人
				stationIdx: null, // 历史提货人选中index
				selStationItem: {}, // 选中的自提点数据
				timeParams: [],
				dateIndex: 0, // 日期下标
				timeIndex: null, // 时间下标
				timeContent: '', // 选中的时间
				dateContent: '', // 选中的日期
				selectDistributionWay: true, // 选择订单发货方式
				orderScorePlaceHolder: '', // 积分弹窗输入框订单可使用积分提示占位符
				disabled: false, // 是否禁止输入框输入
				selStation: '', // 是否选择自提点
				errorTips: 0, //错误提示
				tabbar: true,
				// 获取屏幕高度
				windowHeight: '',
				// 判断是否输入了地址
				boolenRes: 1, //1地址确认状态  //0地址未确认状态
				preSellStatus: '', // 是否预售商品
				curLang: uni.getStorageSync('lang'),


				isHeXiao: '', // 是否核销商品， 0否 1是
			};
		},

		components: {
			coupon
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
			// this.setData({
			// 	orderEntry: options.orderEntry
			// });
			// if (options.dvyType) {
			// 	this.dvyType = options.dvyType
			// }
			// if (this.dvyType == 1 || this.dvyType == 4) { // 同城 || 邮寄
			// 	this.isDistribution = true
			// } else if (this.dvyType == 2) { // 自提
			// 	this.isDistribution = false
			// }
			// this.initCityData(this.provinceId, this.cityId, this.areaId)
			// this.loadOrderData(true)
			// this.loadAddressList()  //加载地址列表
		},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {
			this.animation = wx.createAnimation({
				transformOrigin: "50% 50%",
				duration: 0,
				timingFunction: "ease",
				delay: 0
			});
			this.animation.translateY(200 + 'vh').step();
			this.setData({
				animation: this.animation.export(),
				show: show
			});
		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			// 设置头部导航标题
			uni.setNavigationBarTitle({
				title: this.i18n.submitOrders
			});

			var pages = getCurrentPages();
			var currPage = pages[pages.length - 1];
			if (currPage.selStation == "yes") {
				this.setData({ //将携带的参数赋值
					selStationItem: currPage.selStationItem,
					timeParams: currPage.selStationItem.timeParams
				})
			}
			// 获取当前可用积分
			this.getUserLevelInfo()
			this.loadOrderData()
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
				// 选中某个单选框时，由radio时触发
					radioChange(e) {
						// console.log(e);
					},
					// 选中任一radio时，由radio-group触发
					radioGroupChange(e) {
						// console.log(e);
					},
			// 提交订单浮框的显隐
			showTabbar() {
				if (this.disabled == false) {
					this.tabbar = true
				}
			},
			hideTabbar() {
				if (this.disabled == false) {
					this.tabbar = false
				}
			},
			// 切换配送方式
			changeDistribution: function(sts) { // 邮寄或同城
				if (sts == 0) {
					this.isDistribution = true
					this.dvyType = 1
				} else if (sts == 1) { // 自提
					this.isDistribution = false
					this.dvyType = 2
				}
				this.loadOrderData()
			},

			// 选择配送方式
			disRadioChange(e) {
				console.log(e)
				this.dvyType = e.detail.value
				this.loadOrderData()
				this.showDistributionPop = false
			},

			// 选择地址
			addrRadioChange(e) {
				console.log(e)
				this.addrId = e.detail.value
				this.showAddressListPop = false
				this.isEditAddr = false
				this.getAddrDet()
			},
			selectAddr: function(item) {
				console.log(item)
				this.addrId = item.addrId
				this.showAddressListPop = false
				this.isEditAddr = false
				this.getAddrDet()
				this.setData({
					boolenRes: 1
				})
			},

			// 选择历史提货人
			stationRadioChange(e) {
				console.log(e)
				this.stationIdx = e.detail.value
				this.showRaisingUserList = false
				this.raisingUserList()
			},
			getStationItem: function(item) {
				this.stationUserName = item.stationUserName
				this.stationUserMobile = item.stationUserMobile
				this.showRaisingUserList = false
				console.log(item)
				console.log('提货人：', this.stationUserName)
				console.log('提货人手机号：', this.stationUserMobile)
			},

			// 加载地址列表
			loadAddressList: function() {
				var ths = this;
				wx.showLoading();
				var params = {
					url: "/api/v1/address/list",
					method: "GET",
					data: {},
					callBack: function(res) {
						ths.setData({
							addressList: res
						});
						wx.hideLoading();
					}
				};
				http.request(params);
			},
			//根据地址id请求地址详情
			getAddrDet: function() {
				wx.showLoading();
				var params = {
					url: "/api/v1/address/addrInfo/" + this.addrId,
					method: "GET",
					data: {},
					callBack: (res) => {
						wx.hideLoading();
						console.log(res)
						this.userAddr = res
						this.loadOrderData()
					}
				};
				http.request(params);
			},

			/**
			 * 获取会员积分详情
			 */
			getUserLevelInfo() {
				var params = {
					url: '/api/v1/score/scoreInfo',
					method: 'GET',
					dontTrunLogin: true,
					data: {},
					callBack: res => {
						this.setData({
							accountCanUseScore: res.score
						});
					}
				};
				http.request(params);
			},

			// 会员积分抵现选择
			useMemberPoints: function() {
				this.isChecked = !this.isChecked;
				if (this.maxUsableScore > 0) {
					//totalUsableScore整个订单可以使用的积分数
					this.setData({
						isScorePay: this.isChecked ? 1 : 0,
						userUseScore: this.isChecked ? this.userUseScore : 0
					});
					this.loadOrderData();
				}
			},

			/**
			 * 积分输入弹窗显示
			 */
			handleScorePop() {
				this.setData({
					showScorePop: true
				});
			},

			/**
			 * 积分抵扣输入框
			 */
			handleScoreInput(e) {
				this.userUseScore = Number(e.detail.value.replace(/[^\d]/g, ''))
			},

			/**
			 * 修改积分确定弹窗
			 */
			confirmScore() {
				if (!this.userUseScore || this.userUseScore < 0) {
					uni.showToast({
						title: this.i18n.enterCorrectPoints,
						icon: 'none'
					})
					return
				}
				if (this.userUseScore > this.maxUsableScore) {
					uni.showToast({
						title: this.i18n.mostUserPoints + this.maxUsableScore + this.i18n.integral,
						icon: 'none'
					});
					return
				}
				if (this.userUseScore > this.accountCanUseScore) {
					uni.showToast({
						title: this.i18n.notEnough,
						icon: 'none'
					})
					return
				}
				this.loadOrderData();
				this.closePopup();
			},

			//加载订单数据
			loadOrderData: function(isFirst) {
				var addrId = 0;
				if (this.userAddr != null) {
					addrId = this.userAddr.addrId;
				}
				uni.showLoading({
					mask: true
				});
				var params = {
					url: "/api/v1/order/confirm",
					method: "POST",
					data: {
						addrId: addrId,
						orderItem: this.orderEntry === "1" ? JSON.parse(wx.getStorageSync("orderItem")) : undefined,
						basketIds: this.orderEntry === "0" ? JSON.parse(wx.getStorageSync("basketIds")) : undefined,
						couponIds: this.couponIds,
						dvyType: this.dvyType, // 配送类型 1:快递 2:自提 3：无需快递 4:同城配送
						userChangeCoupon: this.userChangeCoupon,
						isScorePay: this.isScorePay,
						userUseScore: this.userUseScore ? this.userUseScore : 0
					},
					callBack: res => {
						uni.hideLoading();
						var shopCartOrders = res.shopCartOrders; // 购物车店铺商品信息列表
						var remarksList = []
						var couponIds = []
						if (!isFirst) {
							this.shopCartOrders.forEach(el => {
								remarksList.push(el.remarks)
							})
						}
						shopCartOrders.forEach((shopCart, index) => {
							if (isFirst) {
								shopCart.remarks = '';
							} else {
								shopCartOrders[index].remarks = remarksList[index]
							}
							shopCart.shopCoupons = this.splitCouponAndPushCouponIds(shopCart.coupons, couponIds);
						});

						// 平台优惠券
						var platformCoupons = this.splitCouponAndPushCouponIds(res.coupons, couponIds);

						var scorePlaceholder = this.i18n.use + ' ' + res.totalUsableScore + ' ' + this.i18n.pointsDeduction + ' ' +
							res.totalScoreAmount + this.i18n.yuan;
						var orderScorePlaceHolder = this.i18n.accountSurplus + ' ' + this.accountCanUseScore + ' ' + this.i18n.accountSurplus2 +
							' ' + res.maxUsableScore;

						this.setData({
							platformCoupons: platformCoupons, // 整个订单可以使用的优惠券列表
							shopCartOrders: shopCartOrders, // 所有的店铺的购物车信息
							actualTotal: res.actualTotal, // 实际总值
							total: res.total, // 商品总值
							totalCount: res.totalCount, // 商品总数
							userAddr: res.userAddr, // 地址Dto
							transfee: res.totalTransfee, // 总运费
							orderReduce: res.orderReduce, // 订单优惠金额(所有店铺优惠金额和使用积分抵现相加)
							totalScoreAmount: res.totalScoreAmount, // 积分抵扣金额
							totalUsableScore: res.totalUsableScore, // 使用的积分数量
							isScorePay: res.isScorePay, // 用户是否选择积分抵现(0不使用 1使用 默认不使用)
							totalLevelAmount: res.totalLevelAmount, // 等级抵扣金额
							freeTransfee: res.shopCartOrders.freeTransfee, // 用户等级免运费金额
							couponIds: couponIds,
							maxUsableScore: res.maxUsableScore, // 整个订单可以使用的积分数
							// scorePlaceholder: `使用${res.totalUsableScore}积分抵扣${res.totalScoreAmount}元`,
							// orderScorePlaceHolder: `账户剩余${this.accountCanUseScore}积分, 该订单最大可用${res.maxUsableScore}`,
							scorePlaceholder: scorePlaceholder,
							orderScorePlaceHolder: orderScorePlaceHolder,
							shopUseScore: res.shopUseScore, // 积分抵现比例;
							filterShopItems: res.filterShopItems, // 过滤掉的商品项
							preSellStatus: res.preSellStatus, // 是否预售商品

							isHeXiao: res.isVerification,
						});
						if (this.shopCartOrders.length > 1) {
							this.selectDistributionWay = false
						}
						this.disabledInput() // 是否禁止提货人输入框输入
						this.getStationUserInfo() // 历史提货人
					},
					errCallBack: err => {
						uni.hideLoading()
						uni.showModal({
							title: this.i18n.tips,
							content: err.data,
							showCancel: false, //是否显示取消按钮
							confirmText: this.i18n.confirm,
							success: (modalSuccess) => {
								if (modalSuccess.confirm) {
									uni.navigateBack({
										delta: 1,
									})
								}
							}
						})
					}
				};
				http.request(params);
			},

			/**
			 * 分割优惠券成
			 * 1. canUseCoupons 可使用优惠券列表
			 * 2. unCanUseCoupons 不可使用优惠券列表
			 * 3. couponAmount 选中的优惠券可优惠金额
			 * 4. 将选中的优惠券ids保存起来
			 * @param {*} coupons 优惠券列表
			 * @param {*} couponIds 选中的优惠券id
			 */
			splitCouponAndPushCouponIds(coupons, couponIds) {
				if (!coupons || !coupons.length) {
					return {
						canUseLength: 0,
						couponAmount: 0,
						canUseCoupons: [],
						unCanUseCoupons: []
					}
				}

				let canUseCoupons = [];
				let unCanUseCoupons = [];
				let couponAmount = 0;
				coupons.forEach(coupon => {
					if (coupon.canUse) {
						canUseCoupons.push(coupon);
					} else {
						unCanUseCoupons.push(coupon);
					}

					if (coupon.choose) {
						couponIds.push(coupon.couponId);
						couponAmount = coupon.reduceAmount;
					}
				});
				return {
					canUseLength: canUseCoupons.length,
					couponAmount: couponAmount,
					canUseCoupons: canUseCoupons,
					unCanUseCoupons: unCanUseCoupons
				};
			},

			/**
			 * 提交订单校验
			 */
			toPay: function() {
             uni.navigateTo({
				 url:'/pages/payWay/payWay'
			 })
			 return
				if (this.dvyType != 2) {
					if (!this.userAddr) {
						wx.showToast({
							title: this.i18n.pleaseSelectSddress,
							icon: "none"
						});
						return;
					}
					if (!this.shopCartOrders.length) {
						var title = this.dvyType == 1 ? this.i18n.expressDelivery : this.dvyType == 4 ? this.i18n.sameDelivery : ''
						wx.showToast({
							title: this.i18n.productNotSupported + title,
							icon: "none"
						});
						return;
					}
					if (this.dvyType == 4 && (!this.userAddr.lat || this.userAddr.lat == 0 || !this.userAddr.lng || this.userAddr.lng ==
							0)) {
						wx.showModal({
							title: this.i18n.tips,
							content: this.i18n.cityAddressPrompt,
							showCancel: false,
							success: res => {
								uni.navigateTo({
									url: '/pages/editAddress/editAddress?addrId=' + this.userAddr.addrId
								})
							}
						})
						// wx.showToast({
						// 	title: this.i18n.cityAddressPrompt,
						// 	icon: "none",
						// 	duration: 3000
						// });
						return;
					}
				} else if (this.dvyType == 2) {
					if (!this.shopCartOrders.length) {
						wx.showToast({
							title: this.i18n.productNotSupportedStop,
							icon: "none"
						});
						return;
					}
					if (!this.selStationItem.province) {
						wx.showToast({
							title: this.i18n.selectPickPoint,
							icon: "none"
						});
						return;
					}
					if (!this.stationUserName || !this.stationUserMobile) {
						wx.showToast({
							title: this.i18n.fillDeliveryPersonInformation,
							icon: "none"
						});
						return;
					}
					if (!util.checkPhoneNumber(this.stationUserMobile)) {
						wx.showToast({
							title: this.i18n.enterCorrectPhone,
							icon: "none"
						});
						return;
					}
					if (!this.dateContent || !this.timeContent) {
						wx.showToast({
							title: this.i18n.selectPickUpTime,
							icon: "none"
						});
						return;
					}
				}

				// 点击地址判断
				if (!this.boolenRes || this.addressList[0] === undefined) {
					uni.showToast({
						title: this.i18n.saveAndUseTips,
						icon: 'none'
					})
					return
				}

				this.submitOrder();
			},

			// 提交订单
			submitOrder: function() {
				var isPurePoints = this.actualTotal > 0 ? '' : 1 // 是否纯积分: 1是
				if (this.isScorePay == 1 && this.userUseScore <= 0) {
					console.log()
					uni.showToast({
						title: this.i18n.enterPoints,
						icon: 'none'
					})
					return
				}
				uni.showLoading({
					mask: true
				});
				var shopCartOrders = this.shopCartOrders;
				var orderShopParam = [];
				shopCartOrders.forEach(shopCart => {
					orderShopParam.push({
						remarks: shopCart.remarks,
						shopId: shopCart.shopId
					});
				});
				var orderSelfStationDto = {
					stationId: this.selStationItem.stationId,
					stationTime: this.dateContent + ' ' + this.timeContent,
					stationUserMobile: this.stationUserMobile,
					stationUserName: this.stationUserName
				}
				var params = {
					url: "/api/v1/order/submit",
					method: "POST",
					data: {
						orderShopParam: orderShopParam,
						// coupons: this.data.platformCoupons,
						coupons: this.coupons,
						isScorePay: this.isScorePay,
						orderSelfStationDto: orderSelfStationDto
					},
					callBack: res => {
						uni.hideLoading();
						this.$Router.replace({
							path: '/pages/payWay/payWay',
							query: {
								orderNumbers: res.orderNumbers,
								dvyType: this.dvyType,
								isPurePoints: isPurePoints
							}
						});
					}
				};
				http.request(params);
			},

			// 店铺切换可用/不可用优惠券列表
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
					showCoupons: index + '' === '-1' ? this.platformCoupons : shopCartOrders[index].shopCoupons,
					popupShow: true,
				});
			},
			closePopup: function() {
				this.setData({
					popupShow: false,
					showScorePop: false,
					showDistributionPop: false,
					showAddressListPop: false,
					showRaisingUserList: false,
					showRaisingTimePop: false
				});
				this.loadOrderData();
			},

			/**
			 * 去地址页面
			 */
			toAddrListPage: function() {
				// uni.navigateTo({
				// 	url: '/pages/delivery-address/delivery-address?order=0'
				// });
				this.isEditAddr = true
				this.setData({
					boolenRes: 0,
					addrId: '',
					editorFlag: false
					// province: "",
					// city: "",
					// area: "",
				})
			},

			/**
			 * 确定选择好的优惠券
			 */
			choosedCoupon: function() {
				var couponIds = this.couponIds; // 店铺优惠券单选操作
				if (!this.showCoupons) {
					this.setData({
						popupShow: false
					})
					return
				}
				var canUseCoupons = this.showCoupons.canUseCoupons;
				var checkedCouponId = ''
				for (var canUseCouponIndex in canUseCoupons) {
					var coupon = canUseCoupons[canUseCouponIndex];
					if (!coupon.choose && couponIds.indexOf(coupon.couponId) !== -1) {
						couponIds.splice(couponIds.indexOf(coupon.couponId), 1)
					}
					if (coupon.choose) {
						checkedCouponId = coupon.couponId
					}
				}
				couponIds.push(checkedCouponId)
				this.setData({
					couponIds: couponIds,
					popupShow: false
				});
				this.loadOrderData();
			},

			/**-
			 * 优惠券子组件发过来
			 */
			checkCoupon: function(e) {
				var showCoupons = this.showCoupons; // 店铺优惠券单选操作

				var canUseCoupons = showCoupons.canUseCoupons;

				for (var canUseCouponIndex in canUseCoupons) {
					if (e.couponId == canUseCoupons[canUseCouponIndex].couponId && canUseCouponIndex == e.index) {
						canUseCoupons[canUseCouponIndex].choose = !canUseCoupons[canUseCouponIndex].choose;
					} else {
						canUseCoupons[canUseCouponIndex].choose = false;
					}
				}
				this.setData({
					showCoupons: showCoupons,
					userChangeCoupon: 1
				});
			},

			/**
			 * 输入备注
			 */
			onRemarkIpt: function(e) {
				var index = e.currentTarget.dataset.index;
				var shopCartOrders = this.shopCartOrders;
				shopCartOrders[index].remarks = e.detail.value;
				this.setData({
					shopCartOrders: shopCartOrders
				});
			},

			/**
			 * 物流选择弹窗显示
			 */
			distributionPop() {
				this.setData({
					showDistributionPop: true
				});
			},

			/**
			 * 可用地址弹窗显示
			 */
			AddressListPop() {
				if (this.addressList.length) {
					this.setData({
						showAddressListPop: true
					});
				}
			},

			/**
			 * 历史提货人弹窗显示
			 */
			raisingUserList() {
				if (this.dvyType == 2 && !this.shopCartOrders.length) {
					uni.showToast({
						title: this.i18n.productNotSupportedStop,
						icon: 'none'
					})
					return
				}
				this.setData({
					showRaisingUserList: true
				});

			},

			/**
			 * 选择提货时间弹窗显示
			 */
			raisingTimePop() {
				if (!this.selStationItem.province) {
					uni.showToast({
						title: this.i18n.selectPickPoint,
						icon: 'none'
					})
				} else {
					this.setData({
						showRaisingTimePop: true
					});
					let a = (this.timeParams[0].dateTime).split('-')
					this.dateContent = a[0] + this.i18n.virtualMonth + a[1] + this.i18n.dayOfAMonth
				}
			},

			/**
			 * 选择自提点
			 */
			goSelectStore() {
				if (!this.shopCartOrders.length) {
					wx.showToast({
						title: this.i18n.productNotSupportedStop,
						icon: "none"
					});
					return;
				}
				this.setData({
					timeIndex: null, // 时间下标
				})
				uni.navigateTo({
					url: '/pages/selectStore/selectStore?shopId=' + this.shopCartOrders[0].shopId
				});
			},

			/**
			 * 禁止输入提货人信息
			 */
			disabledInput: function() {
				if (this.dvyType == 2 && !this.shopCartOrders.length) {
					this.disabled = true
				} else {
					this.disabled = false
				}
			},

			/**
			 * 获取历史提货人列表
			 */
			getStationUserInfo: function() {
				wx.showLoading();
				var params = {
					url: "/api/v1/orderSelfStation/getStationUserInfo",
					method: "GET",
					data: {},
					callBack: (res) => {
						wx.hideLoading();
						console.log(res)
						this.stationUserInfo = res
					}
				};
				http.request(params);
			},

			getConsigneeInt: function(e) {
				this.stationUserName = e.detail.value
			},
			getConMobileInt: function(e) {
				this.stationUserMobile = e.detail.value
			},

			/**
			 * 改变预约自提日期选择
			 */
			changeData: function(item, dateIdx) {
				this.dateIndex = dateIdx
				// console.log(this.dateIndex, this.timeParams[this.dateIndex].hourTimes)

				let a = (item.dateTime).split('-')
				console.log(a)

				this.dateContent = a[0] + this.i18n.month + a[1] + this.i18n.day
				console.log(this.dateContent);
			},

			/**
			 * 改变预约自提时间选择
			 */
			changeTime: function(timeItem, timeIdx) {
				this.timeIndex = timeIdx
				console.log(this.timeIndex)
				this.showRaisingTimePop = false
				this.timeContent = timeItem
				console.log(timeItem)
				console.log(this.timeContent)
			},


			/**
			 * 获取当前日期零点的时间戳
			 * @param date
			 */
			getStartTimestampOfDay: function() {
				let d = new Date
				// let c = d.toISOString()
				// let b= c.replace(/\d{2}:\d{2}:\d{2}\.\d{3}/g, "00:00:00.000")
				let n = d.getTime()
				console.log(n)
				return n
			},

			/**
			 * 处理当前日期与指定日期之间的关系
			 * @param date
			 */
			getWeekDayMappingOfCurrent: function() {
				const current = this.getStartTimestampOfDay();
				console.log(current)
				if (current) {
					return {
						[current - 2 * 86400000]: this.i18n.beforeYesterday,
						[current - 1 * 86400000]: this.i18n.yesterday,
						[current]: this.i18n.today,
						[current + 1 * 86400000]: this.i18n.tomorrow,
						[current + 2 * 86400000]: this.i18n.afterTomorrow
					};
				}
				return {};
			},

			/**
			 * 获取格式化的周几：前天、昨天、今天、明天、后天
			 * @param date
			 */
			// getWeekDayString: function() {
			// 	const timestamp = this.getStartTimestampOfDay();
			// 	const mapping = this.getWeekDayMappingOfCurrent();

			// 	console.log(mapping)
			// 	console.log(timestamp)

			// 	return mapping[timestamp];
			// },


			/**
			 * 获取全部省份
			 */
			initCityData: function(provinceId, cityId, areaId) {
				var ths = this;
				wx.showLoading();
				var params = {
					url: "/api/v1/area/listByPid",
					method: "GET",
					data: {
						pid: 0
					},
					callBack: function(res) {
						ths.setData({
							provArray: res
						});
						if (provinceId) {
							for (var index in res) {
								if (res[index].areaId == provinceId) {
									ths.setData({
										value: [Number(index), ths.value[1], ths.value[2]]
									});
								}
							}
						}
						ths.getCityArray(provinceId ? provinceId : res[0].areaId, cityId, areaId);
						wx.hideLoading();
					}
				};
				http.request(params);
			},

			/**
			 * 根据省份ID获取 城市数据
			 */
			getCityArray: function(provinceId, cityId, areaId) {
				wx.showLoading();
				var ths = this;
				var params = {
					url: "/api/v1/area/listByPid",
					method: "GET",
					data: {
						pid: provinceId
					},
					callBack: function(res) {
						//console.log(res)
						ths.setData({
							cityArray: res
						});

						if (cityId) {
							for (var index in res) {
								if (res[index].areaId == cityId) {
									ths.setData({
										value: [ths.value[0], Number(index), Number(ths.value[2])]
									});
								}
							}
						}

						ths.getAreaArray(cityId ? cityId : res[0].areaId, areaId);
						wx.hideLoading();
					}
				};
				http.request(params);
			},

			/**
			 * 根据城市ID获取 区数据
			 */
			getAreaArray: function(cityId, areaId) {
				var ths = this;
				var params = {
					url: "/api/v1/area/listByPid",
					method: "GET",
					data: {
						pid: cityId
					},
					callBack: function(res) {
						//console.log(res)
						ths.setData({
							areaArray: res
						});

						if (areaId) {
							for (var _index in res) {
								if (res[_index].areaId == areaId) {
									ths.setData({
										value: [ths.value[0], ths.value[1], Number(_index)]
									});
								}
							}

							index = ths.value;
							ths.setData({
								province: ths.province,
								city: ths.city,
								area: ths.area,
								provinceId: ths.provinceId,
								cityId: ths.cityId,
								areaId: ths.areaId
							});
						} else {
							ths.setData({
								province: ths.provArray[ths.value[0]].areaName,
								city: ths.cityArray[ths.value[1]].areaName,
								area: ths.areaArray[ths.value[2]].areaName,
								provinceId: ths.provArray[ths.value[0]].areaId,
								cityId: ths.cityArray[ths.value[1]].areaId,
								areaId: ths.areaArray[ths.value[2]].areaId
							});
						}

						wx.hideLoading();
					}
				};
				http.request(params);
			},


			bindRegionChange: function(e) {
				//console.log('picker发送选择改变，携带值为', e.detail.value)
				this.setData({
					region: e.detail.value
				});
			},

			onReceiverInput: function(e) {
				this.setData({
					receiver: e.detail.value
				});
			},
			onMobileInput: function(e) {
				this.setData({
					mobile: e.detail.value
				});
			},
			onAddrInput: function(e) {
				this.setData({
					addr: e.detail.value
				});
			},



			/**
			 * 保存地址
			 */
			onSaveAddr: function() {
				var receiver = this.receiver;
				var mobile = this.mobile;
				var addr = this.addr;
				console.log('提交的经纬度：', this.lng, ',', this.lat)
				if (this.addressList.length == 10) {
					wx.showToast({
						title: this.i18n.newAddressesLimit,
						icon: "none",
						duration: 1500
					});
					return;
				}
				if (!receiver) {
					wx.showToast({
						title: this.i18n.consigneeTips,
						icon: "none"
					});
					return;
				}
				if (!mobile) {
					wx.showToast({
						title: this.i18n.enterMobileNumber,
						icon: "none"
					});
					return;
				}
				if (!util.checkPhoneNumber(mobile)) {
					wx.showToast({
						title: this.i18n.enterCorrectPhone,
						icon: "none"
					});
					return;
				}
				if (!this.province || !this.city || !this.area) {
					wx.showToast({
						title: this.i18n.selectProvinceCity,
						icon: "none"
					});
					return;
				}
				if (!addr) {
					wx.showToast({
						title: this.i18n.selectDetailedAddress,
						icon: "none"
					});
					return;
				}
				if (this.dvyType == 4) {
					// 同城配送
					if (!this.lat || !this.lng || this.lat == '' || this.lng == '') {
						uni.showModal({
							title: this.i18n.tips,
							content: this.i18n.selectCoordinates,
							showCancel: false,
							success: res => {
								this.chooseLocation()
							}
						})
					}
				}


				wx.showLoading();
				var url = "/api/v1/address/addAddr";
				var method = "POST";

				// if (this.addrId != 0) {
				// 	url = "/api/v1/address/updateAddr";
				// 	method = "PUT";
				// }

				//添加或修改地址
				var params = {
					url: url,
					method: method,
					data: {
						receiver: this.receiver,
						mobile: this.mobile,
						addr: this.addr,
						province: this.province,
						provinceId: this.provinceId,
						city: this.city,
						cityId: this.cityId,
						areaId: this.areaId,
						area: this.area,
						userType: 0,
						// addrId: this.addrId,
						lat: this.lat, // 纬度
						lng: this.lng, // 经度
					},
					callBack: (res) => {
						wx.hideLoading();
						this.loadAddressList()
						wx.showToast({
							title: this.i18n.savedSuccessfully,
							icon: 'none',
							duration: 1000
						})
						this.addr = ''
						this.receiver = ''
						this.mobile = ''
						this.province = ''
						this.city = ''
						this.area = ''
						this.showAddressListPop = true
					}
				};
				http.request(params);
				this.setData({
					boolenRes: 0
				})
			},

			//滑动事件
			bindChange: function(e) {
				var val = e.detail.value; //判断滑动的是第几个column
				console.log(e)
				//若省份column做了滑动则定位到地级市和区县第一位

				if (index[0] != val[0]) {
					val[1] = 0;
					val[2] = 0; //更新数据
					console.log(this.provArray[val[0]])
					this.getCityArray(this.provArray[val[0]].areaId); //获取地级市数据
				} else {
					//若省份column未做滑动，地级市做了滑动则定位区县第一位
					if (index[1] != val[1]) {
						val[2] = 0; //更新数据
						this.getAreaArray(this.cityArray[val[1]].areaId); //获取区县数据
					} else {}
				}

				index = val;
				this.setData({
					value: [val[0], val[1], val[2]]
				});
				this.setData({
					province: this.provArray[this.value[0]].areaName,
					city: this.cityArray[this.value[1]].areaName,
					area: this.areaArray[this.value[2]].areaName,
					provinceId: this.provArray[this.value[0]].areaId,
					cityId: this.cityArray[this.value[1]].areaId,
					areaId: this.areaArray[this.value[2]].areaId
				});
			},

			//移动按钮点击事件
			translate: function(e) {
				if (t == 0) {
					moveY = 0;
					show = false;
					t = 1;
				} else {
					moveY = 200;
					show = true;
					t = 0;
				}

				this.setData({
					show: true
				}); // this.animation.translate(arr[0], arr[1]).step();

				this.animationEvents(this, moveY, show);
			},

			//隐藏弹窗浮层
			hiddenFloatView(e) {
				console.log('ss', e);
				moveY = 200;
				show = true;
				t = 0;
				this.animationEvents(this, moveY, show);
				this.setData({
					editorFlag: true
				})
			},

			// 点击屏幕外事件
			hiddenFloatViewScreenClick(e) {
				moveY = 200;
				show = true;
				t = 0;
				this.animationEvents(this, moveY, show);
			},

			//动画事件
			animationEvents: function(that, moveY, show) {
				//console.log("moveY:" + moveY + "\nshow:" + show);
				that.animation = wx.createAnimation({
					transformOrigin: "50% 50%",
					duration: 400,
					timingFunction: "ease",
					delay: 0
				});
				that.animation.translateY(moveY + 'vh').step();
				that.setData({
					animation: that.animation.export()
				});
			},

			// 空方法
			nono() {

			},

			/**
			 * 获取经纬度
			 */
			chooseLocation: function(e) {
				var that = this;
				console.log('进入chooseLocation函数')
				uni.chooseLocation({
					success: function(res) {
						console.log('succes1');
						console.log(res);
						that.setMapData(res);
					},
					fail: function() {
						console.log('fail')
						wx.getSetting({
							success(res) {
								console.log('请求获取定位权限')
								if (!res.authSetting['scope.userLocation']) {
									console.log("f1");
									wx.authorize({
										scope: 'scope.userLocation',

										success() {
											uni.chooseLocation({
												success: function(res) {
													that.setMapData(res);
													console.log(res)
												}
											});
											console.log('success2');
										},

										fail() {
											wx.showToast({
												title: this.i18n.authorityTips,
												icon: 'none'
											});
										}
									});
								}
							}
						});
					}
				});
			},

			setMapData(res) {
				this.lat = res.latitude; // 纬度
				this.lng = res.longitude; // 经度
				this.addr = res.address; // 详细地址
				this.name = res.name; // 详细地址

				console.log('腾讯/高德地图经纬度：', this.lng, '，', this.lat)

				this.qqMapTransBMap(this.lng, this.lat)
			},

			// 将腾讯/高德地图经纬度转换为百度地图经纬度
			qqMapTransBMap: function(lng, lat) {
				let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
				let x = lng;
				let y = lat;
				let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
				let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
				let lngs = z * Math.cos(theta) + 0.0065;
				let lats = z * Math.sin(theta) + 0.006;

				this.lng = lngs
				this.lat = lats

				console.log('百度地图经纬度：', this.lng, '，', this.lat)
				return {
					lng: lngs,
					lat: lats
				}
			},

		},

	};
</script>
<style>
	@import "./submit-order.css";
</style>
