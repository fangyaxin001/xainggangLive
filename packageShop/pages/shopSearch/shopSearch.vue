<template>
	<!--pages/search-page/search-page.wxml-->
	<view class="container">
		<!-- 搜索框 -->
		<view class="search-bar">
			<view class="search-box">
				<input :placeholder="i18n.searchSllShop" class="sear-input" confirm-type="search" @confirm="toSearchProdPage" @input="getSearchContent"
				 :value="prodName"></input>
				<image src="/static/images/icon/search.png" class="search-img"></image>
			</view>
			<text class="search-hint" @tap="toSearchProdPage" :data-shopid="shopId">{{i18n.search}}</text>
		</view>

		<view class="search-display">
			<!-- 热门搜索 -->
			<view class="hot-search">
				<view class="title-text">{{i18n.shopHotSearch}}</view>
				<view class="hot-search-tags">
					<block v-for="(item, index) in hotSearchList" :key="index">
						<text class="tags" @tap="onHistSearch" :data-name="item.content">{{item.title}}</text>
					</block>
				</view>

			</view>

			<!-- 搜索历史 -->
			<view class="history-search">
				<view class="title-text history-line">{{i18n.searchHistory}}<view class="clear-history">
						<image src="/static/images/icon/clear-his.png" @tap="clearSearch"></image>
					</view>
				</view>
				<block v-for="(item, index) in recentSearch" :key="index">
					<view class="his-search-tags">
						<text class="tags" @tap="onHistSearch" :data-name="item">{{item}}</text>
					</view>
				</block>
			</view>
		</view>
		<shop-tabbar style="position:fixed;bottom:0;width:100%;left:0;right:0;" currentTab="3"></shop-tabbar>
	</view>
</template>

<script>
	// pages/search-page/search-page.js
	var http = require("../../../utils/http.js");
	import shopTabbar from '../../components/shop-tabbar/shop-tabbar';

	export default {
		data() {
			return {
				hotSearchList: [],
				prodName: "",
				recentSearch: [],
				shopId: uni.getStorageSync('shopInfo').shopId
			};
		},

		components: {
			shopTabbar
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
			this.getHotSearch();

		},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			//头部导航标题
			uni.setNavigationBarTitle({
			    title:this.i18n.storeSearch
			});
			
			// 获取搜索历史
			this.getRecentSearch()
		},
		
		/**
		 * 生命周期函数--监听页面隐藏
		 */
		onHide: function() {
			this.prodName = ''
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
			//热门搜索
			getHotSearch() {
				var ths = this;
				var params = {
					url: "/search/hotSearchByShopId",
					method: "GET",
					data: {
						number: 10,
						sort: 1,
						shopId: this.shopId
					},
					callBack: function(res) {
						ths.setData({
							hotSearchList: res
						});
					}
				};
				http.request(params);
			},

			/**
			 * 获取历史搜索
			 */
			getRecentSearch: function() {
				let recentSearch = wx.getStorageSync('recentSearch');
				this.setData({
					recentSearch
				});
			},

			/**
			 * 搜索提交
			 */
			toSearchProdPage: function() {
				// 判断搜索框是否为空
				if (!this.prodName.trim()) {
					uni.showToast({
						title: this.i18n.inpKeyWords,
						icon: 'none',
					})
					return
				}
				// 记录最近搜索
				let recentSearch = wx.getStorageSync('recentSearch') || [];
				recentSearch = recentSearch.filter(item => item !== this.prodName);
				recentSearch.unshift(this.prodName);
				if (recentSearch.length > 10) {
					recentSearch.pop();
				}
				wx.setStorageSync('recentSearch', recentSearch); // 跳转到商品列表页
				uni.navigateTo({
					url: '/packageShop/pages/shopSearchResult/shopSearchResult?prodName=' + this.prodName
				});
			
			},

			/**
			 * 清空搜索历史
			 */
			clearSearch: function() {
				wx.removeStorageSync('recentSearch');
				this.getRecentSearch();
			},
			//输入商品名获取数据 || 绑定输入值
			getSearchContent: function(e) {
				this.setData({
					prodName: e.detail.value.trim()
				})
			},
			//点击搜素历史
			onHistSearch: function(e) {
				var name = e.currentTarget.dataset.name;
				this.setData({
					prodName: name
				});
				this.toSearchProdPage();
			}
		}
	};
</script>
<style>
	@import "./shopSearch.css";
</style>
