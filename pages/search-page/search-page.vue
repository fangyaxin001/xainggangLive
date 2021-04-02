<template>
	<!--pages/search-page/search-page.wxml-->
	<view class="container">
		<u-navbar title="搜索" title-color="#333333"></u-navbar>
       	<!-- <u-navbar  :title="i18n.seach"> </u-navbar> -->
		<!-- 搜索框 -->
		<view class="search-bar">
			<view class="select-theme" @tap="changeShopOrProd">
				<view class="select">
					<text>{{selectItem == 0? i18n.shop : i18n.commodity}}</text>
					<image src="/static/images/icon/switch.png" class="arrow"></image>
				</view>
			</view> 
			<view class="search-box">
				<input placeholder="脉动600ml*瓶" class="sear-input" confirm-type="search" @confirm="toSearchProdPage"
				 @input="getSearchContent" :value="searchKey"></input>
				<image src="/static/images/icon/search.png" class="search-img"></image>
			</view>
			<!-- 搜索历史有数据的时候显示，没有则隐藏 -->
			<text v-show="recentProdSearch.length>0" class="search-hint" @tap="goBackIndex">取消</text>
		</view>
          
		<view class="search-display">
			
			<!-- 搜索历史 -->
			<view class="history-search">
				<view class="title-text history-line">
				<view style=" display: inline-block;">
					<image style="width: 34rpx; height: 34rpx;" src="/static/images/login/lishi.png" mode=""></image>
				</view><text style="display: inline-block; margin-left:15rpx;font-size: 32rpx;">{{i18n.searchHistory}}</text>
					
				</view>
				<!-- 商品 -->
				<block v-if="recentProdSearch && recentProdSearch.length > 0">
					<block v-for="(item, index) in recentProdSearch" :key="index">
						<view class="his-search-tags" v-if="selectItem == 1">
							<text class="tags" @tap="onHistSearch" :data-name="item">{{item}}22 <u-icon style="margin-left: 15rpx;" name="close" color="#999999" size="24"></u-icon> <text></text></text>
						</view>
					</block>
				</block>
				<!-- 店铺 -->
				<block v-if="recentShopSearch && recentShopSearch.length > 0">
					<block v-for="(item, index) in recentShopSearch" :key="index">
						<view class="his-search-tags" v-if="selectItem == 0">
							<text class="tags" @tap="onHistSearch" :data-name="item">{{item}}</text>
						</view>
					</block>
				</block>
			</view>
			<!-- 热门搜索 -->
			<view class="hot-search">
				<view class="title-text">
					<view style=" display: inline-block;">
						<image style="width: 34rpx; height: 34rpx;" src="/static/images/login/hot.png" mode=""></image>
					</view>
				 <text style="display: inline-block; margin-left:15rpx;font-size: 32rpx;">{{i18n.popularSearches}}</text>
				 <view class="clear-history">
				 	<image  src="/static/images/icon/clear-his.png" @tap="clearSearch"></image>
				 </view>
				 </view>
				<view class="hot-search-tags">
					<block v-if="selectItem == 1 && hotProdSearchList.length">
						<block v-for="(item, index) in hotProdSearchList" :key="index">
							<text :class="index<=1 ? 'gettags' : '' " class="tags" @tap="onHistSearch" :data-name="item.content">{{item.title}}</text>
						</block>
					</block>
					<block v-if="selectItem == 0 && hotShopSearchList.length">
						<block v-for="(item, index) in hotShopSearchList" :key="index">
							<text class="tags" @tap="onHistSearch" :data-name="item.shopName">{{item.shopName}}</text>
						</block>
					</block>
				</view>

			</view>

		</view>
	</view>
</template>

<script>
	// pages/search-page/search-page.js
	var http = require("../../utils/http.js");

	export default {
		data() {
			return {
				hotProdSearchList: [], // 商品热搜
				hotShopSearchList: [], // 店铺
				searchKey: "", // 搜索关键字
				recentShopSearch: [], // 店铺搜索历史
				recentProdSearch: [], // 商品搜索历史
				selectItem: 1, // 选择搜索店铺或者搜索商品 0店铺 1商品
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
		onLoad: function(options) {},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			// 加载导航标题
			// uni.setNavigationBarTitle({
			// 	title: this.i18n.search
			// });
			// 商品热搜
			this.prodHotSearch()
			//店铺热搜
			this.shopHotSearch()
			// 获取搜索历史
			this.getRecentSearch();
		},

		/**
		 * 生命周期函数--监听页面隐藏
		 */
		onHide: function() {
			this.searchKey = ''
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
		onReachBottom: function() {},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {},
		methods: {
			/**
			 * 改变选择店铺搜索或者商品搜索
			 */
			changeShopOrProd: function() {
				// 选择搜索店铺或者搜索商品 0店铺 1商品
				this.selectItem == 0 ? this.selectItem = 1 : this.selectItem = 0
			},

			/**
			 * 商品热搜
			 */
			prodHotSearch: function() {
				var params = {
					url: '/search/hotSearch',
					method: "GET",
					data: {
						number: 10,
						sort: 1,
					},
					callBack: (res) => {
						this.hotProdSearchList = res
					}
				};
				http.request(params); // 获取历史搜索
			},
			//店铺热搜
			shopHotSearch: function() {
				var params = {
					url: '/shop/hotShops',
					method: "GET",
					data: {},
					callBack: (res) => {
						this.hotShopSearchList = res
					}
				};
				http.request(params); // 获取历史搜索
			},

			/**
			 * 搜索店铺(商品)提交
			 */
			toSearchProdPage: function() {
				// 判断搜索框是否为空
				if (this.searchKey === '' || !this.searchKey.trim()) {
					uni.showToast({
						title: this.i18n.inpKeyWords,
						icon: 'none',
					})
					return
				}
				if (this.selectItem == 0) {
					// 记录最近搜索(搜索历史) 
					// 店铺搜索关键字
					let recentShopSearch = uni.getStorageSync('recentShopSearch') || [];
					recentShopSearch = recentShopSearch.filter(item => item !== this.searchKey);
					recentShopSearch.unshift(this.searchKey);
					if (recentShopSearch.length > 10) {
						recentShopSearch.pop();
					}
					// 将历史放到缓存中
					uni.setStorageSync('recentShopSearch', recentShopSearch);
					uni.navigateTo({
						url: '/pages/searchShopShow/searchShopShow?shopName=' + this.searchKey
					});
				} else if (this.selectItem == 1) {
					// 商品搜索关键字
					let recentProdSearch = uni.getStorageSync('recentProdSearch') || [];
					recentProdSearch = recentProdSearch.filter(item => item !== this.searchKey);
					recentProdSearch.unshift(this.searchKey);
					if (recentProdSearch.length > 10) {
						recentProdSearch.pop();
					}
					// 将历史放到缓存中
					uni.setStorageSync('recentProdSearch', recentProdSearch);
					// 跳转到商品(店铺)列表页
					uni.navigateTo({
						url: '/pages/search-prod-show/search-prod-show?prodName=' + this.searchKey
					});
				}
			},

			/**
			 * 获取历史搜索
			 */
			getRecentSearch: function() {
				let recentShopSearch = wx.getStorageSync('recentShopSearch');
				let recentProdSearch = wx.getStorageSync('recentProdSearch');
				this.setData({
					recentShopSearch,
					recentProdSearch
				});
			},

			/**
			 * 清空搜索历史
			 */
			clearSearch: function() {
				if(!this.selectItem){
				  wx.removeStorageSync('recentShopSearch');
				}
				else{
				  wx.removeStorageSync('recentProdSearch');
				}
				this.getRecentSearch();
			},
			// 返回首页
			goBackIndex: function() {
				uni.navigateBack({
					//url: '/pages/search-page/search-page',
				});
			},
			//输入商品名获取数据 || 绑定输入值
			getSearchContent: function(e) {
				this.setData({
					searchKey: e.detail.value
				}); // this.data.searchKey=e.detail.value
			},
			//点击搜素历史
			onHistSearch: function(e) {
				var name = e.currentTarget.dataset.name;
				this.setData({
					searchKey: name
				});
				this.toSearchProdPage();
			}
		}
	};
</script>
<style>
	@import "./search-page.css";
</style>
