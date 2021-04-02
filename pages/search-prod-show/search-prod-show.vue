<template>
	<!--pages/search-prod-show/search-prod-show.wxml-->
	<view class="container"> 
	<u-navbar  >
		<view class="fixed-box">
			<view class="search-bar">
				<view class="search-box">
					<input class="sear-input" :placeholder="i18n.inpKeyWords" :value="prodName" @input="getSearchContent" confirm-type="search"
					 @confirm="toSearchConfirm"></input>
					<image src="/static/images/icon/search.png" class="search-img"></image>
				</view>
				<view class="search-list-img" @tap="changeShowType">
					<image v-if="showType==1" src="/static/images/icon/search-col.png"></image>
					<image v-if="showType==2" src="/static/images/icon/search-col2.png"></image>
				</view>    
			</view>
		
		</view>
	</u-navbar>
		<!-- 搜索框 -->
 <view class="tabs">
 	<view :class="'tab-item ' + (sts==0 && (i18n.Comprehensive.length===2?(orderBy==1?'down':'up'):(orderBy==1?'downEng':'upEng')))"
 	 @tap="onStsTap" data-sts="0">{{i18n.Comprehensive}}</view>
 	<view :class="'tab-item ' + (sts==1 && (orderBy==1?'down':'up'))" @tap="onStsTap" data-sts="1">{{i18n.sales}}</view>
 	<view :class="'tab-item ' + (sts==2 && (orderBy==1?'down':'up'))" @tap="onStsTap" data-sts="2">{{i18n.price}}</view>
 </view>
		<!-- 商品列表 -->
		<view class="prod-list">
			<!-- 横向列表 -->
			<view class="prod-show" >
				<view class="hotsale-item-cont" v-if="showType==1">
					<block v-for="(item, index) in 2" :key="index">
						<view class="cont-heng-box">
							<view class="">
								<image style="width: 346rpx; height: 346rpx;" src="../../packageActivities/static/images/icon/coupon-robbed.png" mode=""></image>
							</view>
							<view class="cont-heng-title">
							<view class="">天然酸奶粉 鲜奶发酵酸奶风味原料 纯酸奶</view>
							<view class="cont-heng-title-flex">
								<view style="color: #FA2033;"><text style="font-size: 20rpx;">HK$</text>1999.00</view>
								<view style="font-size: 20rpx;">已售9392件</view>
							</view>	
							</view>
						</view>
					</block>
				</view>
			</view>

			<!-- 纵向列表 -->
			<view class="cont-item" v-if="showType==2">
				<block v-for="(item, index) in searchProdList" :key="index">
					<view class="show-item" @tap="toProdPage" :data-prodid="item.prodId">
						<view class="more-prod-pic">
							<image :src="item.pic" class="more-pic"></image>
						</view>
						<view class="prod-text-right">
							<view class="prod-text more">{{item.prodName}}</view>
							<view class="cate-prod-info">{{item.praiseNumber}}{{i18n.evaluation}} {{item.positiveRating}}%{{i18n.praise}}</view>
							<view class="prod-price more"> 
								<text class="symbol">HK$</text>
								<text class="big-num">{{wxs.parsePrice(item.price)[0]}}</text>
								<text class="small-num">.{{wxs.parsePrice(item.price)[1]}}</text>
							</view>
						</view>
					</view>
				</block>
			</view>

			<!-- 加载完毕 -->
			<view class="all-load" style="color: #333333;" v-if="loadAll">沒有更多商品了</view>
		</view>

		<!-- 列表为空 -->
		<view class="empty" v-if="!searchProdList.length">
			<view class="empty-icon">
				<image src="/static/images/icon/empty.png"></image>
			</view>
			<view class="empty-text">{{i18n.noProducts}}</view>
		</view>
		
		<!-- 回到顶部 -->
    	<back-top-btn v-if="showBacktop"></back-top-btn>
	</view>
</template>

<script module="wxs" lang="wxs" src="../../wxs/number.wxs"></script>

<script>
	// pages/search-prod-show/search-prod-show.js
	var http = require("../../utils/http.js");
	import backTopBtn from "../../components/backTopBtn/backTopBtn";

	export default {
		data() {
			return {
				sts: 0,
				showType: 2,
				searchProdList: [],
				prodName: "",
				pages: 0,
				current: 1,
				size: 20,
				orderBy: 1, // 排序(0升序 1降序)
				loadAll: false, // 是否加载完成
				scrollTop: "",
      			showBacktop: false
			};
		},

		components: {
			backTopBtn
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
			this.setData({
				prodName: options.prodName
			});
			this.toLoadData();
		},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			// 设置头部导航标题
			uni.setNavigationBarTitle({
				title: this.i18n.searchResult
			});
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
		onReachBottom: function() {
			if (this.current < this.pages) {
				this.setData({
					current: this.current + 1
				});
				this.toLoadData();
			} else {
				this.loadAll = true
			}
		},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {},
		methods: {
			// 页面滚动到指定位置指定元素固定在顶部
			onPageScroll: function (e) {
				this.scrollTop = e.scrollTop
				if (this.scrollTop > 200) {
					this.setData({
						showBacktop: true
					})
				} else if (this.scrollTop < 200) {
					this.setData({
						showBacktop: false
					})
				}
			},

			changeShowType: function() {
				var showType = this.showType;

				if (showType == 1) {
					showType = 2;
				} else {
					showType = 1;
				}

				this.setData({
					showType: showType
				});
			},
			//输入商品获取数据
			getSearchContent: function(e) {
				this.setData({
					prodName: e.detail.value
				});
			},
			//请求商品接口
			toLoadData: function() {
				uni.showLoading();
				var ths = this; //热门搜索
				var params = {
					url: "/search/searchProdPage",
					method: "GET",
					data: {
						current: this.current,
						prodName: this.prodName || this.$route.query.prodName,
						size: this.size,
						sort: this.sts,
						orderBy: this.orderBy,
						isAllProdType: true
					},
					callBack: function(res) {
						console.log(res)
						uni.hideLoading()
						let list = [];

						if (res.current == 1) {
							list = res.records;
						} else {
							list = ths.searchProdList;
							list = list.concat(res.records);
						}
						ths.setData({
							searchProdList: list,
							pages: res.pages
						});
						
						if (res.pages == res.current) {
							ths.setData({
								loadAll: true
							})
						}
					}
				};
				http.request(params);
			},
			//当前搜索页二次搜索商品
			toSearchConfirm: function(e) {
				if (this.prodName === '' || !this.prodName.trim()) {
					uni.showToast({
						title: this.i18n.inpKeyWords,
						duration: 1000,
						icon: 'none',
					});
					return
				}
				// 商品搜索关键字
				let recentProdSearch = uni.getStorageSync('recentProdSearch') || [];
				recentProdSearch = recentProdSearch.filter(item => item !== e.detail.value);
				recentProdSearch.unshift(e.detail.value);
				if (recentProdSearch.length > 10) {
					recentProdSearch.pop();
				}
				// 将历史放到缓存中
				uni.setStorageSync('recentProdSearch', recentProdSearch);
				uni.redirectTo({
					url: '/pages/search-prod-show/search-prod-show?prodName=' + e.detail.value
				})
			},

			/**
			 * 状态点击事件
			 */
			onStsTap: function(e) {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 0
				});
				var sts = e.currentTarget.dataset.sts;
				this.orderBy = this.sts == sts ? this.orderBy == 0 ? 1 : 0 : this.orderBy
				this.setData({
					sts: sts,
					current: 1,
					pages: 1
				});
				this.toLoadData();
			},
			toProdPage: function(e) {
				var prodid = e.currentTarget.dataset.prodid;
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
		}
	};
</script>
<style>
	@import "./search-prod-show.css";
</style>
