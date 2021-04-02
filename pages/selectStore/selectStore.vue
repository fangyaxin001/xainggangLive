<template>
	<view class="container">
		<view class="search">
			<image src="/static/images/icon/search.png" class="img"></image>
			<input class="input" :placeholder="i18n.findPickUpPoints" @input="getInt" @confirm="search()" />
		</view>
		<view class="select-store">
			<view class="store-list" v-if="stationList.length">
				<view class="list-tit">{{i18n.recentPickUpPoint}}</view>
				<radio-group @change="stationRadioChange">
					<view class="item">
						<radio class="check" :value="stationList[0]?String(stationList[0].stationId):''" :checked="stationId == stationList[0].stationId"
						 @tap="getStationItem(stationList[0])"></radio>
						<view class="store-info">
							<view class="name">
								<view class="text">{{stationList[0].stationName}}</view>
								<view class="distance">{{stationList[0].distanceCont}}</view>
							</view>
							<view class="address">{{i18n.address}}：{{stationList[0].province}}{{stationList[0].city}}{{stationList[0].area}}{{stationList[0].addr}}</view>
							<view class="time">{{i18n.pickUpTime}}：{{stationList[0].timeDate.startTime + ' - ' + stationList[0].timeDate.endTime}}</view>
						</view>
					</view>
				</radio-group>

				<view class="list-tit">{{i18n.pickupNearby}}</view>
				<radio-group @change="stationRadioChange" v-for="(item,index) in stationList" :key="index">
					<view class="item" v-if="index > 0">
						<radio class="check" :value="String(item.stationId)" :checked="stationId == item.stationId" @tap="getStationItem(item)"></radio>
						<view class="store-info">
							<view class="name">
								<view class="text">{{item.stationName}}</view>
								<view class="distance">{{item.distanceCont}}</view>
							</view>
							<view class="address">{{i18n.address}}：{{item.province}}{{item.city}}{{item.area}}{{item.addr}}</view>
							<view class="time">{{i18n.pickUpTime}}：{{item.timeDate.startTime + ' - ' + item.timeDate.endTime}}</view>
						</view>
					</view>
				</radio-group>
			</view>
			<view class="foot-btn" v-if="stationList.length">
				<view class="btn" @tap="saveAndUse">{{i18n.saveAndUse}}</view>
			</view>
			<view class="st-empty" v-if="!stationList.length">{{i18n.noData}}</view>
		</view>
	</view>
</template>

<script>
	var http = require("../../utils/http.js");
	var big = require("../../utils/big.min.js");
	import Wechat from "../../utils/wechat.js";
	export default {
		data() {
			return {
				isWechat: false,  //是否为微信环境
				lat: '', // 纬度
				lng: '', // 经度
				searchStationName: '', // 自提点名称
				stationList: [], // 自提点列表
				stationId: 0, // 选中自提点id
				current: 1,
				size: 7,
				pages: 1,
				selStationItem: {}, // 选择的自提点item
			}
		},

		computed:{
			i18n() {
				return this.$t('index')
			}
		},

		onLoad: function(options) {
			// #ifdef H5
			this.isWechat = Wechat.isWechat()
			// #endif
			if(options.shopId) {
				this.shopId = options.shopId
			}
			console.log(options)
			console.log(this.shopId)
			this.getCurrentLocation() //获取地理位置信息
		},
		onShow: function() {
			//头部导航标题
			uni.setNavigationBarTitle({
			    title:this.i18n.selectPickUpPoint
			});
		},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {
			if (this.current < this.pages) {
				this.current = this.current + 1
				this.getUserStation();
			}
		},
		methods: {
			/**
			 * 获取当前地理位置
			 */
			getCurrentLocation: function() {
				if(this.isWechat) {
					console.log('微信环境')
					Wechat.getLocation((res) => {
						console.log('res:', res)
						this.lat = res.latitude
						this.lng = res.longitude
						console.log("获取当前地理位置：", '纬度：',this.lat, '经度：',this.lng)
						this.getUserStation()
					}, (failMsg) => {
						console.log(failMsg)
						uni.showToast({
							title: '获取定位失败，无法加载自提点列表！',
							icon: 'none',
							duration: 1500
						});
					})
				}else {
					console.log('非微信环境')
					uni.getLocation({
						// #ifdef APP-PLUS
						type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回国测局坐标，可用于 uni.openLocation 的坐标，app平台高德SDK仅支持返回gcj02
						// #endif
						// #ifdef H5
						type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回国测局坐标，可用于 uni.openLocation 的坐标，app平台高德SDK仅支持返回gcj02
						// #endif
						success: (res) => {
							console.log('res:', res)
							this.lat = res.latitude
							this.lng = res.longitude
							console.log("获取当前地理位置：", '纬度：',this.lat, '经度：',this.lng)
							this.getUserStation()
						},
						fail: (res) => {
							console.log(res)
							uni.showToast({
								title: this.i18n.locateFailure,
								icon: 'none',
								duration: 1500
							});
						}
					});
				}
			},
			/**
			 * 请求自提点列表
			 */
			getUserStation: function() {
				uni.showLoading();
				let params = {
					url: '/api/v1/station/userstation',
					method: 'GET',
					data: {
						current: this.current,
						size: this.size,
						lat: this.lat,   // 纬度 '23.151021',
						lng: this.lng,    // 经度 '113.326621',
						stationName: this.searchStationName,
						shopId: this.shopId
					},
					callBack: (res) => {
						uni.hideLoading()
						res.records.forEach((el) => {
							el.timeDate = JSON.parse(el.timeDate)
							el.timeDate.startTime = this.formatDuring(el.timeDate.shopTime[0]).dateStr // 自提点开始时间
							el.timeDate.endTime = this.formatDuring(el.timeDate.shopTime[1]).dateStr // 自提点结束时间
							if(el.stationStartTime = 1) {
								var nowdate = this.formatDuring(new Date()).date1
							}
							if(el.distance > 1000) {
								el.distance = new big(el.distance)
								// 保留两位小数
								  big.DP = 2
								//   // 向下取整
								  // big.RM = 3
								el.distance = (el.distance).div(1000).valueOf()
								el.distanceCont = el.distance + 'km'
							}else {
								el.distanceCont = el.distance + 'm'
							}
						})
						this.stationList = res.current == 1 ? res.records : this.stationList.concat(res.records),
						this.pages = res.pages
						this.current = res.current
						console.log('自提点列表stationList:',this.stationList)
					}
				};
				http.request(params)
			},

			/**
			 * 时间转换
			 */
			formatDuring: function (mss) {
				var time = new Date(mss);
				var year = time.getFullYear(); //getFullYear方法以四位数字返回年份
				var month = time.getMonth() + 1; // getMonth方法从 Date 对象返回月份 (0 ~ 11)，返回结果需要手动加一
				var days = time.getDate(); // getDate方法从 Date 对象返回一个月中的某一天 (1 ~ 31)
				var hours = time.getHours(); // getHours方法返回 Date 对象的小时 (0 ~ 23)
				var minutes = time.getMinutes(); // getMinutes方法返回 Date 对象的分钟 (0 ~ 59)
				var seconds = time.getSeconds(); // getSeconds方法返回 Date 对象的秒数 (0 ~ 59)
				var dateStr;
				var data = {};
				data.year = year;
				data.month = month < 10 ? '0' + month : month;
				data.days = days < 10 ? '0' + days : days;
				data.hours = hours < 10 ? '0' + hours : hours;
				data.minutes = minutes < 10 ? '0' + minutes : minutes;
				data.seconds = seconds < 10 ? '0' + seconds : seconds;
				return {
					date1: data.year + '-' + data.month + '-' + data.days,
					dateStr: data.hours + ':' + data.minutes + ':' + data.seconds
				}
			},

			/**
			 * 搜索自提点
			 */
			getInt: function(e) {
				this.searchStationName = e.detail.value
			},

			search: function() {
				this.getUserStation()
			},

			/**
			 * 自提点选择
			 */
			stationRadioChange: function(e) {
				this.stationId = e.detail.value
			},

			/**
			 * 获取当前选中的自提点item
			 */
			getStationItem: function(item) {
				this.selStationItem = item
				// wx.setStorageSync("selStationItem", JSON.stringify(selStationItem));
				// console.log('当前选中的自提点item',this.selStationItem)
			},

			/**
			 * 保存并使用
			 */
			saveAndUse: function() {
				if(JSON.stringify(this.selStationItem) == "{}") {
					wx.showToast({
						title: this.i18n.selStore,
						icon: 'none',
						duration: 1500
					})
					return
				}
				var pages = getCurrentPages(); //当前页面
				var prevPage = pages[pages.length - 2]; //上一页面
				prevPage.selStationItem = this.selStationItem // 直接赋值到上一页面
				prevPage.timeContent = '' , // 改变上一页面预约时间的值
				prevPage.selStation = 'yes'
				// console.log('跳转确认订单页')
				// return
				uni.navigateBack({
					delta: 1, // 回退前 1 页面
				})
			},

		}
	}
</script>

<style>
	@import "./selectStore.css";
</style>
