<template>
	<!--pages/order-detail/order-detail.wxml-->

	<view class="container">
		<view class="nav-top">
			<u-navbar back-icon-color="#ffffff" title-color="#ffffff" :border-bottom="false" title="訂單詳情" background="{ background:''}"></u-navbar>
			<view class="order-pay">
				<view class="order-pay-title">
					<view class="order-pay-stats">訂單待付款</view>
					<view class="order-pay-time">剩余时间：23:59:59</view>
				</view>
				<view class="">
					<image style="width: 140rpx;height: 140rpx;" src="../../static/images/proneler/orderDetialimg.png" mode=""></image>
				</view>
			</view>
		</view>
		<view class="order-detail">

			<!-- 配送地址 -->
			<!-- 	<view class="address-box" v-if="((dvyType == 1 || dvyType == 4) && userAddrDto) && verificatMsg.isVerification == 0">
				<view class="img">
					<image src="/static/images/icon/addr.png"></image>
				</view>
				<view class="user-info">
					<view class="name">{{userAddrDto.receiver}}北京市</view>
					<view class="phone">{{userAddrDto.mobile}}</view>
				</view>
				<view class="address-detail">{{userAddrDto.province}}{{userAddrDto.city}}{{userAddrDto.area}}{{userAddrDto.addr}}</view>
			</view> -->

			<!-- 自提地址 -->
			<view class="delivery-certificate" v-if="dvyType == 2  && verificatMsg.isVerification == 0">
				<view class="tit">
					<text v-if="status == 2 ">{{i18n.deliveryVoucher}}</text>
					<text v-if="status > 2">{{i18n.pickup}}</text>
				</view>
				<view class="address">
					<view class="text">{{stationAddress}}</view>
					<view class="icon-box">
						<view class="icon" @tap="callStation">
							<image src="/static/images/icon/phone.png"></image>
						</view>
						<view class="icon bl" @tap="openMap">
							<image src="/static/images/icon/addr.png"></image>
						</view>
					</view>
				</view>
				<!-- 没付款时 -->
				<view class="code-box no-code" v-if="status == 1">
					<view class="text-box">
						<view class="item">
							<view class="i-lable">{{i18n.pickingCode}}：</view>
							<view class="i-text fw">{{stationCode?stationCode:i18n.deliveryCodeTips}}</view>
						</view>
						<view class="item">
							<view class="i-lable">{{i18n.picker}}：阿萨</view>
							<view class="i-text">
								<text>{{stationUserName}}阿萨</text>
								<text>{{stationUserMobile}}</text>
							</view>
						</view>
					</view>
				</view>
				<!-- 已付款时 -->
				<view class="code-box code-det" @tap="viewCertificate" v-if="status == 2">
					<view class="code">
						<image :src="stationQrCode"></image>
						<!-- <canvas class="qrcode-img" canvas-id="orderQrcode"></canvas> -->
					</view>
					<view class="text-box">
						<view class="item">
							<view class="i-lable">{{i18n.pickingCode}}：</view>
							<view class="i-text fw">{{stationCode}}</view>
						</view>
						<view class="item">
							<view class="i-lable">{{i18n.picker}}：</view>
							<view class="i-text">
								<text>{{stationUserName}}</text>
								<text>{{stationUserMobile}}</text>
							</view>
						</view>
						<view class="item">
							<view class="i-lable">{{i18n.appointmentTime}}：</view>
							<view class="i-text">{{stationTime}}</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 商品信息 -->
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
							<view class=""><u-icon name="arrow-right" color="#333" size="32"></u-icon> </view>
						</view>
					</view>
				</view> 
			</view>
               <!-- 订单商品列表 -->
			   <view class="order-list">
			   	<view class="list-item">
			   		<view class="list-item-img">
			   			<image style="width: 200rpx; height: 200rpx;" src="../../static/images/proneler/shangpin-img.png" mode=""></image>
			   		</view>
					<view class="list-item-right">
						<view class="list-item-right-title">Innisfree/悦诗风吟红石榴水乳护肤套装女提亮修护</view>
						<view class="list-item-right-introduce">提亮，抗初老</view>
						<view class="list-item-flex">
							<view class="list-item-price"><text style="font-size: 24rpx;">HK$</text><text>1999.00</text></view>
							<view class="list-item-num">x1</view>
						</view>
					</view>
			   	</view>
				<view class="list-item">
					<view class="list-item-img">
						<image style="width: 200rpx; height: 200rpx;" src="../../static/images/proneler/shangpin-img.png" mode=""></image>
					</view>
					<view class="list-item-right">
						<view class="list-item-right-title">Innisfree/悦诗风吟红石榴水乳护肤套装女提亮修护</view>
						<view class="list-item-right-introduce">提亮，抗初老</view>
						<view class="list-item-flex">
							<view class="list-item-price"><text style="font-size: 24rpx;">HK$</text><text>1999.00</text></view>
							<view class="list-item-num">x1</view>
						</view>
					</view>
				</view>
				<view class="all-price">
					<view class="all-price-flex">
						<view class=""> 商品总额</view>
						<view class=""> HK$155.4</view>
					</view>
					<view class="all-price-flex">
						<view class=""> 运费</view>
						<view class=""> ￥0.00</view>
					</view> 
				</view>
				<view class="all-price-end">
					<view style="font-size: 24rpx; color: #999999;margin-right: 20rpx;"> 实付款</view>
					<view class="list-item-price"><text style="font-size: 24rpx;">HK$</text><text>1999.00</text></view>
				</view>
			   </view>
			<!-- 核销码信息 -->
			<!-- <view class="writeOff" v-if="verificatMsg.isVerification == 1">
				<view class="writeTitle">{{i18n.verificat}}</view>
				<image :src="verificatMsg.verQRCodeBase64Str" mode="aspectFill"></image>
				<view class="writeCode">{{verificatMsg.verificationCode}}</view>
			</view> -->

			<!-- 订单信息 -->
			<view class="order-msg">
				<view class="order-msg-title">
					<view class="order-shu"> </view>
					<view class="order-msg-title">訂單信息</view>
				</view>
				<view class="msg-item">
					<view class="item">
						<text class="item-tit">訂單備註</text>
						<text class="item-txt inlinlock">邮寄时请备注送到楼上，不想下楼去拿，别放到快递柜，不然投诉啊</text>
						
					</view>
					<view class="item">
						<text class="item-tit">訂單編號</text>
						<view  style="margin-left: 30rpx;">
								<text class="item-txt">2018101902315</text>
								<text class="inlinlock fuzhi" style="color: #2F98FE;" >复制</text>
						</view> 
					</view>
					<view class="item">
						<text class="item-tit">下單時間</text>
						<text  class="inlinlock item-txt">2019-12-06 08:00</text> 
					</view>
				</view>
				
			</view> 

			<!-- 底部栏 -->
			<view class="order-detail-footer">
				<view class="clear-order" @click="clearOrder">取消订单</view>
				<view class="refund-full" data-refundtype="1"  v-show="false">去付款</view>
				<view class="refund-full" data-refundtype="1"  v-show="false">確認收貨</view>
				<view class="refund-full" data-refundtype="1"  @click="ApplySales">申請售後</view>
				<view class="refund-full" data-refundtype="1"  v-show="false">去付款</view>
				<view class="refund-full" data-refundtype="1"  v-show="false">去付款</view>
				
			</view>

			<!-- 团购底部 -->
			<view class="order-detail-footer" v-if="orderType==1&& status>1 && status!=6">
				<view class="group-det" @tap="toGroupDetails" :data-ordernumber="orderNumber">{{i18n.viewGroupDetails}}</view>
			</view>

		</view>
		<!-- 这是取消订单弹框 -->
		<u-popup v-model="clearFlag" mode="bottom" border-radius="20">
					<view class="popup-box">
						<view class="popup-clear-order">取消订单</view>
						<view class="chear-cause">请选择取消订单原因</view>
						<view class="">
							<u-radio-group v-model="value" @change="radioGroupChange" style="width: 100%;padding: 0 30rpx;">
								<view class="logistics-company">
									<view class="">不想买了</view>
									<view class="">
										<u-radio @change="radioChange" active-color="#47D1D1" name="不想买了"></u-radio>
									</view>
								</view>
								<view class="logistics-company">
									<view class="">信息填写错误，重新拍</view>
									<view class="">
										<u-radio @change="radioChange" active-color="#47D1D1"></u-radio>
									</view>
								</view>
								<view class="logistics-company">
									<view class="">卖家缺货</view>
									<view class="">
										<u-radio @change="radioChange" active-color="#47D1D1"></u-radio>
									</view>
								</view>
							<view class="logistics-company">
								<view class="">其他原因</view>
								<view class="">
									<u-radio @change="radioChange" active-color="#47D1D1"></u-radio>
								</view>
							</view>
							</u-radio-group>
						</view>
						<view class="popup-bot-flex">
							<view style="background-color: #F6F6F6;" @click="clearFlag=false">取消</view>
							<view style="background-color: #47D1D1;color: #FFFFFF;">确定</view>
						</view>
					</view>
				</u-popup>
	</view>
</template>

<script module="wxs" lang="wxs" src="../../wxs/number.wxs"></script>

<script>
	// pages/order-detail/order-detail.js
	var http = require("../../utils/http.js");
	var Qr = require("../../utils/wxqrcode");
	var util = require("../../utils/util.js");
	// var qrCode = require("../../utils/weapp-qrcode.js")

	export default {
		data() {
			return {
				value: "不想买了", //取消订单所勾选的值
				clearFlag:false,//控制取消订单弹框弹出
				orderItemDtos: [],
				remarks: "",
				actualTotal: 0,
				userAddrDto: null,
				orderNumber: "",
				createTime: "",
				status: 0,
				productTotalAmount: '',
				transfee: '',
				reduceAmount: '',
				prodid: '',
				orderType: 0,
				shopName: '', //店铺名称
				canRefund: false, // 能否退款
				canAllRefund: false, // 能否增单退款
				isLastProd: false, //最后一款商品
				irrevocable: false, //不可撤销
				sum: [], //本单已申请单个退款的商品数组
				dvyType: 1, //配送类型 1:快递 2:自提 3：无需快递

				id: 0, // 自提信息id
				stationAddress: '', // 自提点的地址
				stationCode: '', // 提货码
				stationId: 0, // 自提点id
				stationPhone: '', // 自提点的联系电话
				stationTime: '', // 自提时间(用户下单时选择)
				stationUserMobile: '', // 自提人的手机
				stationUserName: '', // 自提人的名字
				stationQrCode: '', // 提货码二维码
				stationName: '', // 自提点名称

				payType: '', //订单支付类型
				orderScore: 0, // 整单使用积分,
				verificatMsg: ''
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
			if (options.orderNum) {
				this.orderNumber = options.orderNum
			}
		},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			// 加载导航标题

			this.loadOrderDetail(this.orderNumber) //请求订单详情数据

			this.setData({
				isLastProd: false
			})
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
			// 跳转到申请售后
			ApplySales(){
				console.log("111")
				uni.navigateTo({
					url:"/pages/applyRefund/applyRefund"
				})
			},
			// 选中某个单选框时，由radio时触发
			radioChange(e) {
				// console.log(e);
			},
			// 选中任一radio时，由radio-group触发
			radioGroupChange(e) {
				// console.log(e);
			},
			// 取消订单
			clearOrder(){
				this.clearFlag=true
			},
			//跳转商品详情页
			toProdPage: function(e) {
				util.tapLog()
				var prodid = e.currentTarget.dataset.prodid;

				if (this.orderType == 3) {
					uni.navigateTo({
						url: '/packageMemberIntegral/pages/convertProdDet/convertProdDet?prodId=' + prodid
					});
				} else {
					// uni.navigateTo({
					// 	url: '/pages/prod/prod?prodid=' + prodid
					// });
					this.$Router.push({
						path: '/pages/prod/prod',
						query: {
							prodid: prodid
						}
					})
				}
			},

			/**
			 * 是否最后一个商品在执行单个商品退款事件
			 */
			lastProdApplyRefund: function() {
				if (this.status == 2) { //待发货状态下
					// 遍历商品list
					if (this.orderItemDtos.length > 1) { //如果商品列表长度大于1
						let sum = []
						this.orderItemDtos.forEach((el, index) => {
							if (el.refundSn) { //如果拥有退款单号
								sum.push(el)
								this.setData({
									sum
								})
							}
						})
						if (this.sum.length == this.orderItemDtos.length - 1) {
							// 如果拥有退款单号的item等于商品列表数据长度-1，那么点击的这件商品就是最后一件商品
							this.setData({
								isLastProd: true
							})
						} else if (this.sum.length == this.orderItemDtos.length) {
							// 如果拥有退款单号的item等于商品列表数据长度，那么不可撤销申请
							this.setData({
								irrevocable: true //不可撤销
							})
						}
					};
				}
			},

			/**
			 * 申请退款
			 */
			applyRefund: util.throttle(function(item, refundtype) {
				util.tapLog()
				// refundType 退款类型 1整单  2单个物品
				let status = this.status
				var type = this.status == 2 ? '1' : '2'
				this.loadOrderDetail(this.orderNumber) //请求订单详情数据
				if (refundtype == 1) { //整单退款
					var items = {}
					items.orderNumber = this.orderNumber;
					items.actualTotal = this.actualTotal; // 订单总额
					items.transfee = this.transfee; // 订单运费
					items.status = this.status; //订单状态
					items.orderItemDtos = this.orderItemDtos;
					items.orderScore = this.orderScore, // 整单积分
						// 将数据存储到本地
						wx.setStorageSync("refundItem", items);
				} else if (refundtype == 2) { //单个商品退款
					this.lastProdApplyRefund() //是否最后一个商品执行单个商品退款
					if (this.orderItemDtos.length == 1) { // 是否只有一件商品
						item.isOnlyProd = true
					} else {
						item.isOnlyProd = false
					}
					// 将数据存储到本地
					item.orderNumber = this.orderNumber;
					item.transfee = this.transfee; // 本单运费
					item.status = this.status; //订单状态
					item.isLastProd = this.isLastProd ? this.isLastProd : undefined // 是否最后一款商品
					//拿到存储在本地的订单项数据
					wx.setStorageSync("refundItem", item);
				}
				/**  判断跳转页面（根据订单是否已发货）*/
				if (status == 2) { //待发货，直接跳转到申请页，不需要选择退货方式
					uni.navigateTo({ //通过uni.redirectTo实现跳转（关闭当前页面，跳转到应用内某个页面）
						url: `/pages/applyRefund/applyRefund?type=${type}&refundType=${refundtype}`,
					})
				} else { //已发货，跳转到选择退货方式页
					uni.navigateTo({
						url: '/pages/chooseRefundWay/chooseRefundWay?refundType=' + refundtype
					})
				}
			}, 600),

			/**
			 * 查看退款
			 */
			viewRefund: function(e) {
				util.tapLog()
				var refundSn = e.currentTarget.dataset.refundsn;
				this.lastProdApplyRefund() //是否最后一个商品执行单个商品退款
				uni.navigateTo({
					url: '/pages/DetailsOfRefund/DetailsOfRefund?refundSn=' + refundSn + '&irrevocable=' + this.irrevocable
				})
			},

			/**
			 * 加载订单数据
			 */
			loadOrderDetail: function(orderNum) {
				var ths = this;
				uni.showLoading(); //加载订单详情

				var params = {
					url: "/api/v1/myOrder/orderDetail",
					method: "GET",
					data: {
						orderNumber: orderNum
					},
					callBack: function(res) {
						ths.setData({
							orderNumber: orderNum,
							actualTotal: res.actualTotal,
							//实际支付总额（商品总额+运费)
							userAddrDto: res.userAddrDto,
							remarks: res.remarks,
							orderItemDtos: res.orderItemDtos,
							createTime: res.createTime,
							status: res.status,
							productTotalAmount: res.total,
							//所有商品总额
							transfee: res.transfee,
							//运费
							reduceAmount: res.reduceAmount,
							orderType: res.orderType,
							shopName: res.shopName,
							canRefund: res.canRefund,
							canAllRefund: res.canAllRefund,
							payType: res.payType,
							dvyType: res.dvyType, // 配送类型 1:快递 2:自提 3：无需快递
							orderScore: res.orderScore, // 整单使用积分

							verificatMsg: {
								isVerification: res.isVerification,
								verQRCodeBase64Str: res.verQRCodeBase64Str,
								verificationCode: res.verificationCode,
							}, //核销信息
						});
						if (res.dvyType == 2) {
							ths.loadStationDetail(orderNum)
						}
						uni.hideLoading()
					}
				};
				http.request(params);
			},

			/**
			 * 加载订单详情自提信息
			 */
			loadStationDetail: function(orderNum) {
				uni.showLoading(); //加载订单详情
				var params = {
					url: "/api/v1/myStationOrder/stationDetail",
					method: "GET",
					data: {
						orderNumber: orderNum
					},
					callBack: (res) => {
						uni.hideLoading()
						this.id = res.id, // 自提信息id
							this.stationAddress = res.stationAddress, // 自提点的地址
							this.stationCode = res.stationCode, // 提货码
							this.stationId = res.stationId, // 自提点id
							this.stationPhone = res.stationPhone, // 自提点的联系电话
							this.stationTime = res.stationTime, // 自提时间(用户下单时选择)
							this.stationUserMobile = res.stationUserMobile, // 自提人的手机
							this.stationUserName = res.stationUserName, // 自提人的名字
							this.stationName = res.stationName, // 自提点名称
							this.lat = this.bMapTransQQMap(res.lng, res.lat).lat, // 纬度
							this.lng = this.bMapTransQQMap(res.lng, res.lat).lng, // 经度
							this.getQrcode(this.stationCode)
					}
				};
				http.request(params);
			},

			/**
			 * 拨打自提点电话
			 */
			callStation: function() {
				util.tapLog()
				uni.makePhoneCall({
					// 手机号
					phoneNumber: this.stationPhone,
					// 成功回调
					success: (res) => {
						console.log(res)
					},
					// 失败回调
					fail: (res) => {
						console.log(res)
					}
				});
			},

			// 将百度地图经纬度转换为腾讯/高德地图经纬度
			bMapTransQQMap: function(lng, lat) {
				let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
				let x = lng - 0.0065;
				let y = lat - 0.006;
				let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
				let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
				let lngs = z * Math.cos(theta);
				let lats = z * Math.sin(theta);
				return {
					lng: lngs,
					lat: lats
				}
			},

			/**
			 * 打开地图
			 */
			openMap: function() {
				util.tapLog()
				uni.openLocation({
					latitude: this.lat,
					longitude: this.lng,
					success: function() {
						console.log('success');
					}
				});
			},

			/**
			 * 生成二维码
			 */
			getQrcode: function(stationCode) {
				this.stationQrCode = Qr.createQrCodeImg(stationCode)
			},

			// #ifdef  APP-PLUS
			/**
			 * 一键复制事件
			 */
			// 设置系统剪贴板的内容。
			copyBtn() {
				util.tapLog()
				// 除了h5以外都可用的复制方法
				uni.setClipboardData({
					data: this.orderNumber,
					success: function() {
						uni.showToast({
							title: this.i18n.copySucceeded,
							icon: 'none',
							duration: 1000
						})
					}
				});
			},
			// #endif

			// 查看提货凭证
			viewCertificate() {
				util.tapLog()
				var cont = {
					stationCode: this.stationCode, // 提货码
					stationAddress: this.stationAddress, // 自提点的地址
					stationPhone: this.stationPhone, // 自提点的联系电话
					stationTime: this.stationTime, // 自提时间(用户下单时选择)
					orderNumber: this.orderNumber, // 订单编号
					stationName: this.stationName
				}
				console.log('提货凭证con：', cont)
				uni.setStorageSync('stationCont', cont)
				uni.navigateTo({
					url: '/pages/deliveryCertificate/deliveryCertificate'
				})
			},
			/**
			 * 查看团购详情
			 */
			toGroupDetails: function(e) {
				util.tapLog()
				uni.navigateTo({
					url: '/packageActivities/pages/spellGroupDetails/spellGroupDetails?orderNumber=' + e.currentTarget.dataset.ordernumber,
				});
			},

		}
	};
</script>
<style>
	@import "./order-detail.css";
</style>
