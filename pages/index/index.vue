<template>
	<!--index.wxml-->
	<view class="">
		<view class="container" v-if="!renovationId">
			<!-- 搜索框 -->
			<view class="bg-sear">
				<view class="scrolltop">
					<view class="section" @tap="toSearchPage">
						<image src="/static/images/icon/search.png" class="search-img"></image>
						<text class="placeholder">{{i18n.search}}</text>
					</view>
				</view> 
			</view>
			<!-- 搜索框end -->

			<!-- 导航&公告 -->
			<view class="content">
				<!-- swiper -->
				<swiper circular="true" :autoplay="autoplay" :indicator-color="indicatorColor" :interval="interval" :duration="duration"
				 :indicator-active-color="indicatorActiveColor" class="card-swiper" indicator-dots previous-margin="20rpx"
				 next-margin="20rpx">
					<block v-for="(item, seq) in indexImgs" :key="seq">
						<swiper-item class="banner-item">
							<view class="img-box">
								<image :src="item.imgUrl" :data-prodid="item.relation" @tap="toIndexImgContent" class="banner"></image>
							</view>
						</swiper-item>
					</block>
				</swiper>
				<!-- end swiper -->

				<!-- 板块 -->
				<view class="cat-item">
					<view class="item" @tap="toClassifyPage" data-sts="1">
						<image src="/static/images/icon/newProd.png"></image>
						<text>{{i18n.newProduct}}</text>
					</view>
					<view class="item" @tap="toSpecialDiscount" data-sts="2">
						<image src="/static/images/icon/timePrice.png"></image>
						<text>{{i18n.limitedTimeOffer}}</text>
					</view>
					<view class="item" @tap="toAbulkPage">
						<image src="/static/images/icon/group.png"></image>
						<text>{{i18n.groupDiscount}}</text>
					</view>
					<view class="item" @tap="toSecKillPage" data-sts="3">
						<image src="/static/images/icon/neweveryday.png"></image>
						<text>{{i18n.spikeSpecial}}</text>
					</view>
					<view class="item" @tap="toCouponCenter">
						<image src="/static/images/icon/newprods.png"></image>
						<text>{{i18n.couponCenter}}</text>
					</view>
				</view>
				<!-- 板块end -->

				<!-- 消息播放 -->
				<view class="message-play" @tap="onNewsPage">
					<image src="/static/images/icon/horn.png" class="hornpng"></image>
					<swiper vertical="true" autoplay="true" duration="1000" circular="true" class="swiper-cont">
						<block v-for="(item, id) in news" :key="id">
							<swiper-item class="items">{{item.title}}</swiper-item>
						</block>
					</swiper>
					<text class="arrow"></text>
				</view>
				<!-- 消息播放end -->

			</view>
			<!-- 导航&公告end -->

			<!-- 直播列表入口 -->
			<!-- #ifdef MP-WEIXIN -->
			<!-- <view class="live-enter" @tap="toLiveListPage">
				<image src="/static/images/liveBroadcast/live-enter.png"></image>
			</view>	 -->
			<!-- #endif -->

			<!-- 秒杀 -->
			<view class="snap-up clearfix" v-if="snapUpList.length">
				<!-- 头部 -->
				<view class="snap-up-head clearfix">
					<text class="snap-up-tit">{{i18n.spike}}</text>
					<!-- 倒计时 -->
					<!-- <view class="snap-up-time">
					<text class="white">12点场</text>
					<text class="snap-up-countdown">00:14:53</text>
				</view> -->
					<!-- 更多 -->
					<view class="more-goods" @tap="toSnapUpPage">
						<text class="more-goods-txt">{{i18n.moreSpikes}}</text>
						<view class="more-icon">
							<image src="/static/images/icon/more.png"></image>
						</view>
					</view>
				</view>

				<!-- 列表 -->
				<view class="snap-up-goods-show">
					<!-- 商品盒子 -->
					<view class="snap-up-goods-box" v-for="(item, index) in snapUpList" :key="index" @tap="toSnapUpListPage"
					 :data-seckillid="item.seckillId">
						<view class="img-box">
							<image :src="item.pic"></image>
						</view>
						<view class="snap-up-price"><text class="symbol">￥</text>{{wxs.toPrice(item.seckillPrice)}}</view>
						<view class="original-price">￥{{wxs.toPrice(item.price)}}</view>
					</view>
					<!-- 查看更多 -->
					<view class="view-more" @tap="toSnapUpPage" v-if="snapUpList.length > 3">{{i18n.seeMore}}
						<image class="view-more-icon" src="/static/images/icon/more-icon.png"></image>
					</view>
				</view>

			</view>
			<!-- 秒杀end -->

			<!-- 团购 -->
			<view class="abulk clearfix" v-if="aBulkList.length">
				<!-- 头部 -->
				<view class="snap-up-head clearfix">
					<text class="snap-up-tit">{{i18n.groupBuy}}</text>
					<!-- 倒计时 -->
					<!-- <view class="snap-up-time">
					<text class="white">12点场</text>
					<text class="snap-up-countdown">00:14:53</text>
				</view> -->
					<!-- 更多 -->
					<view class="more-goods" @tap="toAbulkPage">
						<text class="more-goods-txt">{{i18n.moreGroupBuy}}</text>
						<view class="more-icon">
							<image src="/static/images/icon/more.png"></image>
						</view>
					</view>
				</view>

				<!-- 列表 -->
				<view class="snap-up-goods-show">
					<!-- 商品盒子 -->
					<view class="snap-up-goods-box" v-for="(item, index) in aBulkList" :key="index" @tap="toAbulkListPage"
					 :data-groupactivityid="item.groupActivityId" :data-prodid="item.prodId">
						<view class="img-box">
							<image :src="item.prodPic"></image>
						</view>
						<view class="purchase-conditions">
							<view class="group-number">{{item.groupNumber}}{{i18n.join}}</view>
							<view class="snap-up-price"><text class="symbol">￥</text>{{wxs.toPrice(item.actPrice)}}</view>
						</view>
						<view class="original-price">￥{{wxs.toPrice(item.price)}}</view>
					</view>
					<!-- 查看更多 -->
					<view class="view-more" @tap="toAbulkPage" v-if="aBulkList.length > 3">{{i18n.seeMore}}
						<image class="view-more-icon" src="/static/images/icon/more-icon.png"></image>
					</view>
				</view>

			</view>
			<!-- 团购end -->

			<!-- 商城热卖 -->
			<view class="goods-list">
				<view class="title">
					<text>{{i18n.hotSale}}</text>
				</view>
				<view class="goods-item-cont">
					<block v-for="(prod, prodId) in hotSalesList" :key="prodId">
						<view class="prod-items" @tap="toProdPage" :data-prodid="prod.prodId">
							<view class="goods-item-imagecont">
								<image :src="prod.pic" class="goods-item-img"></image>
							</view>
							<view class="goods-item-text">
								<view class="goods-item-prod-text">{{prod.prodName}}</view>
								<view class="prod-info">{{prod.brief}}</view>
								<view class="prod-text-info">
									<view class="price">
										<text class="symbol">￥</text>
										<text class="big-num">{{wxs.parsePrice(prod.price)[0]}}</text>
										<text class="small-num">.{{wxs.parsePrice(prod.price)[1]}}</text>
									</view>
								</view>
							</view>
						</view>
					</block>
					<view class="tips" v-if="isAll">{{i18n.allLoaded}}</view>
				</view>
			</view>

			<!-- 回到顶部 -->
			<back-top-btn v-if="showBacktop"></back-top-btn>
			
		</view>
		<view v-if="renovationId">
			<feature ref="featureIndex" @pageLoaded="pageLoaded" :pageLoad="pageLoad" :pageId="renovationId" :shopId="0"
			 :pageScorllTop="pageScorllTop"></feature>
		</view>
	</view>
</template>

<script module="wxs" lang="wxs" src="../../wxs/number.wxs"></script>

<script>
	//index.js
	//获取应用实例
	var http = require("../../utils/http.js");
	var config = require("../../utils/config.js");
	var util = require("../../utils/util.js");
	const app = getApp().globalData;
	import backTopBtn from "../../components/backTopBtn/backTopBtn";
	import feature from '../../components/feature/index/index.vue'
	// const updateManager = wx.getUpdateManager();

	export default {
		data() {
			return {
				indicatorDots: true,
				indicatorColor: '#d1e5fb',
				indicatorActiveColor: '#1b7dec',
				autoplay: true,
				interval: 3000,
				duration: 1000,
				indexImgs: [],
				seq: 0,
				news: [],
				hotSalesList: [],
				sts: 0,
				current: 1,
				sort: 1,
				isAll: false,
				snapUpList: [],
				//秒杀列表
				aBulkList: [], //团购列表
				pages: "",
				scrollTop: "",
				showBacktop: false,


				// 装修
				pageLoad: false,
				renovationId: '', // 页面id
				shopId: '',
				pageScorllTop: 0, // 页面滚动距离
				platformHomePage: ''
			};
		},

		components: {
			backTopBtn,
			feature
		},
		props: {},
		onLoad: function() {
			console.log(11)
			util.transTabbar();
			http.request({
				url: '/shopRenovation/getHomePage',
				method: 'GET',
				callBack: res => {
					console.log(res)
					if (res.homeStatus === 1) {
						this.renovationId = res.renovationId
						this.shopId = res.shopId
					} else {
						this.getAllData();
					}
				}
			})
		},
		computed: {
			i18n() {
				return this.$t('index')
			}
		},
		onShow: function() {
			// uni.setNavigationBarTitle({
			// 	title: this.i18n.yamiMultiStore
			// });

			// #ifndef H5
			var logData = uni.getStorageSync('flowAnalysisLogDto')
			uni.setStorageSync('step', uni.getStorageSync('step') / 1 + 1)
			if (logData && logData.pageId != 1 || uni.getStorageSync('step') == 1) {
				logData.pageId = 1
				logData.step = uni.getStorageSync('step')
				uni.setStorageSync('flowAnalysisLogDto', logData)
				http.saveLog(logData, 1)
			}
			// #endif
			http.getCartCount(); //重新计算购物车总数量
		},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {
			this.getNextPage();
		},
		onPullDownRefresh: function() {
			// uni.showNavigationBarLoading() //在标题栏中显示加载
			//模拟加载
			var ths = this;
			this.setData({ //下拉刷新
				current: 1
			})
			setTimeout(function() {
				ths.getAllData(); // uni.hideNavigationBarLoading() //完成停止加载

				wx.stopPullDownRefresh(); //停止下拉刷新
			}, 100);
		},
		onShareAppMessage: function(e) {
			return {
				path: "pages/index/index"
			};
		},

		// 页面滚动到指定位置指定元素固定在顶部
		onPageScroll: function(e) {
			this.scrollTop = e.scrollTop
			this.pageScorllTop = e.scrollTop
			if (this.scrollTop > 800) {
				this.setData({
					showBacktop: true
				})
			} else if (this.scrollTop < 800) {
				this.setData({
					showBacktop: false
				})
			}
		},


		methods: {
			// 页面加载回调
			pageLoaded(e) {
				uni.setNavigationBarTitle({
					title: e.detail.title
				})
				this.pageLoaded = false
				setTimeout(() => {
					uni.hideLoading()
					this.pageLoaded = true
				}, 1)
			},

			/**
			 * 跳转到商品详情页
			 */
			toProdPage: function(e) {
				util.tapLog()
				var prodid = e.currentTarget.dataset.prodid;
				if (prodid) {
					// uni.navigateTo({
					//   url: '/pages/prod/prod?prodid=' + prodid
					// });
					this.$Router.push({
						path: '/pages/prod/prod',
						query: {
							prodid: prodid
						}
					})
				}
			},
			// 点击轮播图跳转相应页面
			toIndexImgContent: function(e) {
				util.tapLog()
				var prodid = e.currentTarget.dataset.prodid;
				if (prodid) {
					this.$Router.push({
						path: '/pages/prod/prod',
						query: {
							prodid: prodid,
							bannerEnter: '1'
						}
					})
				}
			},
			toCouponCenter: function() {
				util.checkAuthInfo(() => {
					uni.navigateTo({
						url: '/packageActivities/pages/couponCenter/couponCenter'
					})
				})
			},

			/**
			 * 跳转到直播列表
			 */
			toLiveListPage: function() {
				util.tapLog()
				uni.navigateTo({
					url: '/pages/liveBroadcast/liveBroadcast',
				})
			},

			/**
			 * 秒杀
			 */
			getSnapUpList: function() {
				uni.showLoading();
				var params = {
					url: "/seckill/pageProd",
					method: "GET",
					data: {
						size: 20
					},
					callBack: res => {
						uni.hideLoading();
						let result = res.records.filter(item => util.dateToTimestamp(item.endTime) > new Date().getTime()); //过滤掉秒杀时间已结束的商品

						this.setData({
							snapUpList: result
						});
					}
				};
				http.request(params);
			},

			/**
			 * 跳转秒杀列表页
			 */
			toSnapUpPage: function() {
				util.tapLog()
				uni.navigateTo({
					url: '/packageActivities/pages/snapUpList/snapUpList'
				});
			},
			toSnapUpListPage: function(e) {
				util.tapLog()
				var seckillId = e.currentTarget.dataset.seckillid;
				// uni.navigateTo({
				//   url: "/pages/snapUpDetail/snapUpDetail?seckillId=" + seckillId
				// });
				this.$Router.push({
					path: '/packageActivities/pages/snapUpDetail/snapUpDetail',
					query: {
						seckillId: seckillId
					}
				})
			},

			/**
			 * 团购
			 */
			getAbulk: function() {
				uni.showLoading();
				var param = {
					url: "/groupProd/indexList",
					method: "GET",
					data: {},
					callBack: res => {
						uni.hideLoading();
						this.setData({
							aBulkList: res
						});
					}
				};
				http.request(param);
			},

			/**
			 * 跳转团购列表页
			 */
			toAbulkPage: function() {
				util.tapLog()
				uni.navigateTo({
					url: '/packageActivities/pages/aBulkList/aBulkList'
				});
			},
			toAbulkListPage: function(e) {
				util.tapLog()
				var prodId = e.currentTarget.dataset.prodid;
				var groupActivityId = e.currentTarget.dataset.groupactivityid;
				this.$Router.push({
					path: '/pages/prod/prod',
					query: {
						prodid: prodId,
						groupActivityId: groupActivityId
					}
				})
			},
			// 跳转搜索页
			toSearchPage: function() {
				util.tapLog()
				uni.navigateTo({
					url: '/pages/search-page/search-page'
				});
			},
			//跳转商品活动页面
			toClassifyPage: function(e) {
				util.tapLog()
				// 跳转至新品推荐   
				var url = '/pages/New-products/New-products?sts=' + e.currentTarget.dataset.sts;
				var id = e.currentTarget.dataset.id;
				var title = e.currentTarget.dataset.title;   
				if (id) {
					url += "&tagid=" + id + "&title=" + title;
				}
				uni.navigateTo({
					url: url 
				});
			},
			toSecKillPage: function() {
				uni.navigateTo({
					url: '/packageActivities/pages/snapUpList/snapUpList'
				});
			},
			toSpecialDiscount: function() {
				this.$Router.push('/packageActivities/pages/specialDiscount/specialDiscount')
			},
			//跳转公告列表页面
			onNewsPage: function() {
				uni.navigateTo({
					url: '/pages/recent-news/recent-news'
				});
			},

			getAllData() {
				uni.showLoading();
				// http.getCartCount(); //重新计算购物车总数量

				this.getIndexImgs();
				this.getNoticeList();
				this.getHotSalesProds();
				this.getSnapUpList();
				this.getAbulk();
			},

			//加载轮播图
			getIndexImgs() {
				//加载轮播图
				var params = {
					url: "/indexImgs/0",
					method: "GET",
					data: {},
					callBack: res => {
						this.setData({
							indexImgs: res,
							seq: res
						});
						uni.hideLoading();
					}
				};
				http.request(params);
			},

			getNoticeList() {
				// 加载公告
				var params = {
					url: "/shop/notice/topNoticeList/0",
					method: "GET",
					data: {},
					callBack: res => {
						this.setData({
							news: res
						});
						uni.hideLoading();
					}
				};
				http.request(params);
			},

			/**
			 * 加载热销商品列表
			 */
			getHotSalesProds() {
				uni.showLoading();
				var param = {
					url: "/search/searchProdPage",
					method: "GET",
					data: {
						current: this.current,
						size: 20,
						sort: 1,
						orderBy: 1
					},
					callBack: res => {
						uni.hideLoading();
						var hotSalesList = [];

						if (this.current == 1) {
							this.setData({
								hotSalesList: res.records,
								pages: res.pages,
								current: res.current
							});
						} else {
							hotSalesList = this.hotSalesList;
							hotSalesList.push(...res.records);
							this.setData({
								hotSalesList
							});
						}
					}
				};
				http.request(param);
			},

			// 触底加载下一页
			getNextPage() {
				if (this.pages > this.current) {
					this.setData({
						current: this.current + 1
					});
					this.getHotSalesProds();
				} else {
					this.setData({
						isAll: true
					});
				}
			}

		}
	};
</script>
<style>
	@import "./index.css";
</style>
