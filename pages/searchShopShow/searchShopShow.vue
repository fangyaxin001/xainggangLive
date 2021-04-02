<template>
	<!--pages/search-prod-show/search-prod-show.wxml-->
	<view class="container">
<u-navbar title="店鋪搜索" title-color="#333333"></u-navbar>
		<!-- 搜索框 -->
		<view class="fixed-box">
			<view class="search-bar">
				<view class="search-box">
					<input class="sear-input" :placeholder="i18n.inpKeyWords" :value="shopName" @input="getSearchContent" confirm-type="search"
					 @confirm="toSearchConfirm"></input>
					<image src="/static/images/icon/search.png" class="search-img"></image>
				</view>
			</view>
		</view>

		<!-- 商品列表 -->
		<view class="prod-list">
			<!-- 横向列表 -->
			<view class="cont-item">
				<block v-for="(item, index) in searchShopList" :key="index">
					<view class="prod-items" @tap="toShopPage(item)">
						<view class="hot-imagecont">
							<image :src="item.shopLogo" class="hotsaleimg"></image>
						</view>
						<view class="hot-text">
							<view class="hotprod-text">{{item.shopName}}</view>
							<view class="prod-text-info">
								<view class="fan">{{item.fansCount}}人關注</view>
								<view class="into">進店看看</view>
							</view>
						</view>
					</view>
				</block>
			</view>

			<!-- 纵向列表 -->
			<!-- <view class="cont-item" v-if="showType==2">
      <block v-for="(item, index) in searchShopList" :key="index">
        <view class="show-item" @tap="toShopPage" :data-shopid="item.shopId">
          <view class="more-prod-pic">
            <image :src="item.shopLogo" class="more-pic"></image>
          </view>
          <view class="prod-text-right">
            <view class="prod-text more">{{item.shopName}}</view>
            <view class="prod-price more">{{item.intro}}</view>
            <view class="prod-price more" v-if="item.prodCount">商品数量：{{item.prodCount}}</view>
          </view>
        </view>
      </block>
    </view> -->
	<!-- 加载完毕 -->
	     <view class="all-load" v-if="loadAll">没有更多商品了</view>
		</view>

		<!-- 列表为空 -->
		<view class="empty" v-if="!searchShopList.length">
			<view class="empty-icon">
				<image src="/static/images/icon/empty.png"></image>
			</view>
			<view class="empty-text">{{i18n.noData}}</view>
		</view> 
		<!-- 回到顶部 --> 
		<view class="promo-con"> 
			<view class="suspension-btn" v-if="showBacktop" @tap='hanldeScorllTop'>
				<image src="../../static/images/icon/back-to-top.png"></image>
			</view>
		</view>
		<!-- 回到顶部 end-->

	</view>
</template>

<script module="wxs" lang="wxs" src="../../wxs/number.wxs"></script>

<script>
	// pages/search-prod-show/search-prod-show.js
	var http = require("../../utils/http.js");
	import prod from "../../components/production/production";

	export default {
		data() {
			return {
				sts: 0,
				showType: 2,
				searchShopList: [],
				shopName: "",
				pages: 0,
				current: 1,
				size: 20,
				loadAll: false,
				scrollTop: "",
				showBacktop: false
			};
		},

		components: {
			prod
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
				shopName: options.shopName
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
			//头部导航标题
			// uni.setNavigationBarTitle({
			// 	title: this.i18n.shopSearch
			// });
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

			/**
			 * 回到页面顶部
			 */
			hanldeScorllTop () {
				uni.pageScrollTo({
					duration: 100,
					scrollTop: 0
				})
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
			//输入名称获取数据
			getSearchContent: function(e) {
				this.setData({
					shopName: e.detail.value
				});
			},

			/**
			 * 请求店铺列表接口
			 */
			toLoadData: function() {
				wx.showLoading();
				var params = {
					url: "/shop/searchShops",
					method: "GET",
					data: {
						current: this.current,
						size: this.size,
						shopName: this.shopName || this.$route.query.shopName
					},
					callBack: (res) => {
						wx.hideLoading();
						let list = [];

						if (res.current == 1) {
							list = res.records;
						} else {
							list = this.searchShopList;
							list = list.concat(res.records);
						}
						if (res.pages == res.current) {
							this.setData({
								loadAll: true
							})
						}
						this.setData({
							searchShopList: list,
							pages: res.pages
						});
					}
				};
				http.request(params);
			},

			//当前搜索页二次搜索商品
			toSearchConfirm: function(e) {
				// 搜索栏为空时
				if (this.shopName === '' || !this.shopName.trim()) {
					uni.showToast({
						title: this.i18n.inpKeyWords,
						duration: 1000,
						icon: 'none',
					});
					return
				}
				// 店铺搜索关键字
				let recentShopSearch = uni.getStorageSync('recentShopSearch') || [];
				recentShopSearch = recentShopSearch.filter(item => item !== e.detail.value);
				recentShopSearch.unshift(e.detail.value);
				if (recentShopSearch.length > 10) {
					recentShopSearch.pop();
				}
				// 将历史放到缓存中
				uni.setStorageSync('recentShopSearch', recentShopSearch);
				uni.redirectTo({
					url: '/pages/searchShopShow/searchShopShow?shopName=' + e.detail.value
				})
			},

			toShopPage: function(shopInfo) {
				// 缓存店铺的数据
				uni.setStorageSync('shopInfo', shopInfo)
				if (shopInfo.renovationId) {
					uni.navigateTo({
						url: '/packageShop/pages/feature-index/feature-index0?shopId=' + shopInfo.shopId + '&renovationId=' + shopInfo.renovationId
					})
				} else {
					uni.navigateTo({
						url: '/packageShop/pages/shopPage/shopPage?shopId=' + shopInfo.shopId
					})
				}
			}
		}
	};
</script>
<style>
	@import "./searchShopShow.css";
</style>
