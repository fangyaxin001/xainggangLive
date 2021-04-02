<template>
	<!--pages/sub-category/sub-category.wxml-->
	<view class="container">
		<u-navbar ></u-navbar>
		<!-- 顶部子分类tab -->
		<scroll-view scroll-x="true" class="category-tit "  :scroll-into-view="intoView" :scroll-with-animation="true">
			<block v-for="(item, index) in subCategoryList" :key="index">
				<view :class="'category-item ' + (item.categoryId==categoryId? 'on':'')" @tap="onSubCategoryTap" :id="'sw' + item.categoryId" :data-id="item.categoryId">{{item.categoryName}}
				<view class="item-heng" v-show="item.categoryId==categoryId"></view>
				</view>
				
			</block>
		</scroll-view> 
		<!-- 商品列表 -->
		<view class="prod-item">
			<block v-for="(item, key) in prodList" :key="key"  >
				<view class="item-list" @click="goCommodityDetails">
					<view class="">
						<image style="width: 340rpx;height: 340rpx;" src="../../static/images/proneler/shangpin-img.png" mode=""></image>
					</view>   
					<view style="padding: 20rpx;">
						<view >天然酸奶粉 鲜奶发酵酸奶风味原料 纯酸奶</view>
						<view style="color: #FA2033;margin-top: 20rpx; "> <text style="font-size: 20rpx;"> HK$</text> 1999.00</view>
					</view>
				</view>
			</block>
		</view>
		<!-- 空 || 加载完毕 --> 
		<view class="empty all" v-if="!prodList.length || current == pages">
		  <view class="empty-icon" v-if="!prodList.length">
		    <image src="/static/images/icon/empty.png"></image>
		  </view> 
		  <view class="empty-text">{{!prodList.length?i18n.noCommodity:i18n.endTips}}</view>
		</view>
	</view>
</template> 
<script>
	// pages/sub-category/sub-category.js
	var http = require("../../utils/http.js"); 
	export default {
		data() {
			return {
				subCategoryList: [],
				categoryId: 0,
				prodList: [],
				parentId: "",
				current: 1,
				pages: 0,
				intoView: ''
			};
		},

		components: {
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
			this.setData({
				parentId: options.parentId,
				categoryId: options.categoryId,
				intoView: options.intoView
			});
			this.getSubCategory();
			this.getProdList();
		},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {},

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
				this.current = this.current + 1
				this.getProdList()
			}
		},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {},
		methods: {
			// 跳转到详情
			goCommodityDetails(){
			uni.navigateTo({
				url:"/packageActivities/pages/snapUpDetail/snapUpDetail"
			})
			},
			/**
			 * 获取顶栏子分类数据
			 */
			getSubCategory() {
				var params = {
					url: "/category/categoryInfo",
					method: "GET",
					data: {
						parentId: this.parentId,
					},
					callBack: res => {
						this.setData({
							subCategoryList: res
						});
					}
				};
				http.request(params);
			},

			/**
			 * 根据分类id获取商品列表数据
			 */
			getProdList() {
				var params = {
					url: "/search/searchProdPage",
					method: "GET",
					data: {
						categoryId: this.categoryId,
						current: this.current,
						size: 10,
						sort: 0,
						isAllProdType: true
					},
					callBack: res => {
						this.setData({
							prodList: res.current == 1 ? res.records : this.prodList.concat(res.records),
							current: res.current,
							pages: res.pages
						});
					}
				};
				http.request(params);
			},

			/**
			 * 切换顶部分类
			 */
			onSubCategoryTap(e) {
				this.setData({
					categoryId: e.currentTarget.dataset.id,
					current: 1,
					pages: 1,
					intoView: 'sw' + e.currentTarget.dataset.id
				});
				this.getProdList();
			},
		}
	};
</script>
<style>
	@import "./sub-category.css";
</style>
