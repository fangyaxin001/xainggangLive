<template>
	<!--pages/liveBroadcast/liveBroadcast.wxml-->
	<view class="broadcast-container">
		<view class="top-bg"></view>

		<view class="search-bar">
			<view class="select" @tap="changeShopOrProd">
				<image src="/static/images/icon/switch2.png" class="arrow"></image>
				<view class="key">{{searchType == 1?i18n.liveBroadcast:i18n.commodity}}</view>
			</view>
			<view class="search">
				<image src="/static/images/liveBroadcast/search.png" class="search-icon"></image>
				<input type="text" class="search-int" :value="searchKey" @input="getInputValue" @confirm='search' confirm-type='search'
				 :placeholder="i18n.inputBlogger" placeholder-class="placeholder"></input>
			</view>
		</view>


		<view class="carousel" v-if="liveTopList.length">
			<!-- swiper组件 -->
			<swiper-slider :swiperData="liveTopList" :isWechat="isWechat"></swiper-slider>
		</view>

		<view class="broadcast-list" v-if="liveBroadcastList.length > 0">
			<view class="item" v-for="(item, index) in liveBroadcastList" :key="index" :data-roomid="item.roomId" @tap="toLivePage">
				<view class="b-video">
					<view class="img-box">
						<image class="b-img" :src="item.feedsImg"></image>
					</view>
					<view class="b-situation">
						<view class="b-processing"><text class="dot">●</text><text class="state">{{item.liveStatus==101?i18n.liveing:item.liveStatus==102?i18n.notStarted:item.liveStatus==103?i18n.finished:item.liveStatus==104?i18n.noBroadcasting:item.liveStatus==105?i18n.suspend:item.liveStatus==106?i18n.abnormal:item.liveStatus==107?i18n.expired:''}}</text></view>
						<!-- <view class="people-num">{{item.viewerNum}}观看</view> -->
					</view>
					<view class="like">
						<image class="like-icon" src="/static/images/liveBroadcast/like-heart.png"></image>
						<!-- <view class="like-num">{{item.likeNum}}</view> -->
					</view>
				</view>
				<view class="b-content">
					<view class="b-tit">{{item.name}}</view>
					<view class="b-name">{{item.anchorName}}</view>
					<view class="b-prod-list" v-if="item.liveProdStores.length">
						<block v-for="(prod,idx) in item.liveProdStores" :key="idx">
							<view class="b-prod b-prod-img" v-if="idx < 2">
								<image class="" :src="prod.coverPic" :data-roomid="item.roomId" :data-url="prod.url" @tap="toLivePage"></image>
							</view>
						</block>
						<view class="b-prod b-prod-num">
							<view class="b-num">
								<view class="prod-num"><text v-if="item.liveProdStores.length > 2">+</text>{{item.liveProdStores.length > 2 ? item.liveProdStores.length-2 : item.liveProdStores.length}}</view>
								<view class="b-more">More</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="empty" v-if="!liveBroadcastList.length && !liveTopList.length">{{i18n.liveBroadcastTips}}</view>
		<view class="loadall" v-if="liveBroadcastList.length > 5 && loadAll">{{i18n.endTips}}</view>

	</view>

</template>

<script>
	var http = require("../../utils/http.js");
	var config = require("../..//utils/config.js");
	var util = require("../..//utils/util.js");
	// #ifdef H5
	import Wechat from "../../utils/wechat.js";
	// #endif
	import swiperSlider from "../../components/swiperSlider/swiperSlider";
	export default {
		data() {
			return {
				isWechat: false, //是否为微信环境

				// 轮播图相关：
				topicList: [{
						headUrl: '/static/images/icon/coupon-banner.png'
					},
					{
						headUrl: '/static/images/icon/coupon-banner.png'
					},
					{
						headUrl: '/static/images/icon/coupon-banner.png'
					},
					{
						headUrl: '/static/images/icon/coupon-banner.png'
					},
				],
				indicatorDots: false, //  是否显示面板指示点
				autoplay: true, // 是否自动切换
				circular: true, // 是否采用衔接滑动
				vertical: false, // 是否垂直衔接滑动
				interval: 5000, // 自动切换时间间隔
				duration: 300, // 滑动动画时长
				previousMargin: 120,
				nextMargin: 0,
				displayMultipleItems: 3,
				currentSwiper: '',

				liveTopList: null, // 置顶直播列表
				liveBroadcastList: [],
				current: 1,
				size: 10,
				pages: 1,
				loadAll: false,
				swiperIndex: 0,
				searchType: 1, // searchType 搜索类型 1.搜索直播间信息 2搜索商品名
				searchKey: '', // 搜索key
				prodId: '', // 商品id（商品详情页跳转列表时）
			};
		},

		components: {
			swiperSlider
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

			console.log('options:', options)
			if (options.prodId) {
				this.setData({
					prodId: options.prodId,
					searchType: 3
				})
			}
		},
		
		onShow: function() {
			//头部导航标题
			uni.setNavigationBarTitle({
				title: this.i18n.liveList
			})
			this.queryLiveList() // 播放列表
			this.queryTopLiveList() // 置顶直播列表
		},
		
		/**
		 * 生命周期函数--监听页面隐藏
		 */
		onHide: function() {
			this.searchKey = ''
		},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {
			if (this.current < this.pages) {
				this.setData({
					current: this.current + 1
				})
				this.queryLiveList()
			} else {
				this.setData({
					loadAll: true
				})
				console.log('loadAll:', this.loadAll)
			}
		},


		methods: {
			swiperChange(e) {
				this.setData({
					swiperIndex: e.detail.current,
				})
			},

			/**
			 * 置顶直播间列表信息
			 */
			queryTopLiveList: function() {
				wx.showLoading()
				var params = {
					url: "/live/liveRoom/pageTopRoom",
					method: "GET",
					data: {
						current: 1,
						size: 10
					},
					callBack: (res) => {
						wx.hideLoading();
						this.setData({
							liveTopList: res.records,
						})
					}
				}
				http.request(params);
			},

			/**
			 * 直播列表
			 */
			queryLiveList: function() {
				wx.showLoading()
				var params = {
					url: "/live/liveRoom/page",
					method: "GET",
					data: {
						name: this.searchKey,
						searchType: this.searchType,
						current: this.current,
						size: this.size,
						prodId: this.prodId
					},
					callBack: (res) => {
						wx.hideLoading();
						var list = []
						if (res.current == 1) {
							list = res.records
						} else {
							list = this.liveBroadcastList
							list = list.concat(res.records)
						}
						this.liveBroadcastList = list,
							this.pages = res.pages,
							this.current = res.current
					}
				}
				http.request(params);
			},


			/**
			 * 改变选择店铺搜索或者商品搜索
			 */
			changeShopOrProd: function() {
				// searchType 搜索类型 1.搜索直播间信息(直播间/博主) 2搜索商品名
				var searchType = this.searchType
				searchType == 1 ? searchType = 2 : searchType = 1
				this.setData({
					searchType: searchType,
					searchKey: ''
				})
			},

			/**
			 * 搜索输入框
			 */
			getInputValue: function(e) {
				this.setData({
					searchKey: e.detail.value
				})
			},

			/**
			 * 搜索 
			 */
			search: function() {
				this.current = 1
				this.queryLiveList()
			},

			/**
			 * 前往直播页面
			 */
			toLivePage: function(e) {
				this.roomId = e.currentTarget.dataset.roomid // 填写具体的房间号
				this.url = e.currentTarget.dataset.url
				util.checkAuthInfo(this.toLivePlayer)
			},
			toLivePlayer: function() {
				let roomId = this.roomId
				let url = this.url
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
	}
</script>

<style>
	@import "./liveBroadcast.css";
</style>
