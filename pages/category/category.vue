<template>
	<!--pages/category/category.wxml-->
	<view class="container">
	<!-- 	<u-navbar :is-back="false" :title="i18n.classify">
			<view style=" width: 100%; text-align: right;padding-right: 30rpx;">
				<u-icon name="chat" color="#47D1D1" size="44"></u-icon>
				<view class="" style="width: 100%; color: #47D1D1; font-size: 16rpx; text-align: right;" >
					{{i18n.message}}
				</view>
			</view>
		</u-navbar> -->
		<!-- 头部搜索区 -->
		<view class="search-bar">
			<view class="search-box" @tap="toSearchPage">
				<image src="/static/images/icon/search.png" class="search-img"></image>
				<text class="sear-input">{{i18n.searchGoods}}</text>
			</view>
		</view>
		<!-- 滚动内容区 -->
		<view class="main">
			<!-- 左侧菜单start -->
			<scroll-view scroll-y="true" class="leftmenu">
				<block v-for="(item, index) in categoryList" :key="index">
					<view :class="'menu-item ' + (selIndex==index?'active':'')" :data-index="index" :data-id="item.categoryId" @tap="onMenuTab">
						<text>{{item.categoryName}}</text>
					</view>
				</block>
			</scroll-view>
			<!-- 左侧菜单end -->

			<!-- 右侧内容start -->
			<scroll-view scroll-y="true" class="rightcontent">
				<view class="adver-map">
					<view class="item-a">
						<image :src="categoryImg" mode="scaleToFill"></image>
					</view>
				</view>

				<block v-for="(item, subCateIndex) in subCategoryList" :key="subCateIndex">
					<view class="sub-category">
						<view class="sub-category-con">
							<view class="sub-cate-title">
								<text class="sub-cate-text">{{item.categoryName}}</text>
								<text class="view-all" v-if="item.categories" @tap="toCatePage" data-type="all" :data-subcateindex="subCateIndex" :data-parentid="item.categoryId">
									<u-icon name="arrow-right" color="#ffffff" size="28"></u-icon>
								</text>
							</view>
							<view class="th-cate-con" v-if="item.categories">
								<block v-for="(thCateItem, categoryId) in item.categories" :key="categoryId">
									<view class="sub-category-item" @tap="toCatePage" :data-categoryid="thCateItem.categoryId" :data-parentid="item.categoryId">
										<image :src="thCateItem.pic" mode="widthFix" class="sub-category-item-pic"></image>
										<text>{{thCateItem.categoryName}}</text>
									</view>
								</block>
							</view>
							<view class="empty-tips" v-else>
								{{i18n.noData}}
							</view>
						</view>
					</view>
				</block>

			</scroll-view>
			<!-- 右侧内容end -->
		</view>
	</view>
</template>

<script module="wxs" lang="wxs" src="../../wxs/number.wxs"></script>

<script>
	// pages/category/category.js
	var http = require("../../utils/http.js");
	var config = require("../../utils/config.js");
	var util = require("../../utils/util.js");

	export default {
		data() {
			return {
				selIndex: 0,
				categoryList: [],
				categoryImg: '',
				subCategoryList: [],
				parentId: ""
			};
		},

		components: {},
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
			util.transTabbar()
			var ths = this; //加载分类列表
			var params = {
				url: "/category/categoryInfo",
				method: "GET",
				data: {
					parentId: ''
				},
				callBack: function(res) {
					ths.setData({
						categoryImg: res[0].pic,
						categoryList: res
					});
					ths.getProdList(res[0].categoryId);
				}
			};
			http.request(params);
		},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {
			
		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			// 加载导航标题
			uni.setNavigationBarTitle({
				title:this.i18n.classifiedGoods
			});
			http.getCartCount()

			// #ifndef H5
			var logData = uni.getStorageSync('flowAnalysisLogDto')
			uni.setStorageSync('step', uni.getStorageSync('step') / 1 + 1)
			if (logData && logData.pageId != 6) {
				logData.pageId = 6
				logData.step = uni.getStorageSync('step')
				uni.setStorageSync('flowAnalysisLogDto', logData)
				http.saveLog(logData, 1)
			}
			// #endif
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
			/**
			 * 分类点击事件，获取子分类
			 */
			onMenuTab: function(e) {
				util.tapLog()
				// console.log(e);
				var id = e.currentTarget.dataset.id;
				var index = e.currentTarget.dataset.index; // this.getProdList(id);

				this.getProdList(this.categoryList[index].categoryId);
				this.setData({
					categoryImg: this.categoryList[index].pic,
					selIndex: index
				});
			},
			// 跳转搜索页
			toSearchPage: function() {
				util.tapLog()
				uni.navigateTo({
					url: '/pages/search-page/search-page'
				});
			},

			getProdList(categoryId) {
				this.setData({
					parentId: categoryId
				}); //加载子分类列表

				var params = {
					url: "/category/categoryInfo",
					method: "GET",
					data: {
						parentId: categoryId
					},
					callBack: res => {
						this.setData({
							subCategoryList: res
						});
					}
				};
				http.request(params);
			},

			// 跳转子分类商品页面
			toCatePage: function(e) {
				util.tapLog()
				const {
					type,
					parentid,
					categoryid,
					subcateindex
				} = e.currentTarget.dataset;
				uni.navigateTo({
					url: `/pages/sub-category/sub-category?parentId=${parentid}&categoryId=${type == 'all' ? this.subCategoryList[subcateindex].categories[0].categoryId : categoryid}`
				});
			}
		}
	};
</script>
<style>
	@import "./category.css";
</style>
