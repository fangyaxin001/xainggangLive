<template>
	<!--pages/search-prod-show/search-prod-show.wxml-->
	<view class="container">

		<!-- 搜索框 -->
		<view class="fixed-box">
			<view class="search-bar">
				<view class="search-box">
					<input class="sear-input" :value="prodName" @input="getSearchContent" confirm-type="search" @confirm="toSearchConfirm"
					:placeholder="i18n.searchSllShop"
					></input>
					<image src="/static/images/icon/search.png" class="search-img"></image>
				</view>
				<view class="search-list-img" @tap="changeShowType">
					<image v-if="showType==1" src="/static/images/icon/search-col.png"></image>
					<image v-if="showType==2" src="/static/images/icon/search-col2.png"></image>
				</view>
			</view>
			<view class="tabs">
				<view :class="(curLang=='en'? 'en ': '') + 'tab-item complete ' + (sts==0 && (orderBy==1?'down':'up'))" @tap="onStsTap" data-sts="0">{{i18n.default}}</view>
				<view :class="'tab-item ' + (sts==1 && (orderBy==1?'down':'up'))" @tap="onStsTap" data-sts="1">{{i18n.sales}}</view>
				<view :class="'tab-item ' + (sts==2 && (orderBy==1?'down':'up'))" @tap="onStsTap" data-sts="2">{{i18n.price}}</view>
			</view>
		</view>

		<!-- 商品列表 -->
		<view class="prod-list">
			<!-- 纵向列表 -->
			<view class="prod-show" v-if="showType==1">
				<view class="hotsale-item-cont">
					<block v-for="(item, index) in searchProdList" :key="index">
						<prod :item="item" sts="6"></prod>
					</block>
				</view>
			</view>

			<!-- 横向列表 -->
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
								<text class="symbol">￥</text>
								<text class="big-num">{{wxs.parsePrice(item.price)[0]}}</text>
								<text class="small-num">.{{wxs.parsePrice(item.price)[1]}}</text>
							</view>
						</view>
					</view>
				</block>
			</view>
		</view>


		<!-- <view class="empty-tips" wx:if="{{searchProdList.length==0}}"> 暂无商品 </view> -->
		<!-- 空 -->
		<view class="empty" v-if="searchProdList.length==0">
			<view class="empty-icon">
				<image src="/static/images/icon/empty.png"></image>
			</view>
			<view class="empty-text">{{i18n.noProducts}}</view>
		</view>
		<view class="tips" v-if="current == pages">{{i18n.allLoaded}}</view>

		<!-- 回到顶部 -->
    	<back-top-btn v-if="showBacktop"></back-top-btn>
	</view>
</template>

<script module="wxs" lang="wxs" src="../../../wxs/number.wxs"></script>

<script>
	// pages/search-prod-show/search-prod-show.js
	var http = require("../../../utils/http.js");
	import prod from "../../../components/production/production";
	import backTopBtn from "../../../components/backTopBtn/backTopBtn";

	export default {
		data() {
			return {
				sts: 0,
				showType: 2,
				searchProdList: [],
				prodName: "",
				shopId: undefined,
				current: 1,
				pages: 0,
				orderBy:1,//状态点击事件
				curLang: 'en', // 当前语言
				scrollTop: "",
      			showBacktop: false
			};
		},

		components: {
			prod,
			backTopBtn
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
			if (options.shopId) {
				this.setData({
					shopId: options.shopId
				});
			} else {
				this.setData({
					shopId: uni.getStorageSync("shopInfo").shopId
				});
			}

			this.setData({
				prodName: options.prodName,
				curLang: uni.getStorageSync('lang')
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
			uni.setNavigationBarTitle({
			    title:this.i18n.storeSearchResults
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
			// 店铺搜索结果分页
			if (this.current < this.pages) {
				this.current = this.current + 1
				this.toLoadData()
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
				if (this.scrollTop > 80) {
					this.setData({
						showBacktop: true
					})
				} else if (this.scrollTop < 80) {
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
				var ths = this; //热门搜索

				var params = {
					url: "/search/searchProdPage",
					method: "GET",
					data: {
						current: this.current,
						prodName: this.prodName,
						size: 10,
						sort: this.sts,
						orderBy: this.orderBy,
						shopId: this.shopId,
						isAllProdType: true
					},
					callBack: function(res) {
						console.log(res)
						var temp = []
						if (res.current == 1) {
							temp = res.records
						} else {
							temp = ths.searchProdList.concat(res.records)
						}
						ths.setData({
							searchProdList: temp,
							pages: res.pages,
							current: res.current
						});
					}
				};
				http.request(params);
			},
			//当前搜索页二次搜索商品
			toSearchConfirm: function() {
				// 搜索栏为空时
				if(this.prodName === '' || !this.prodName.trim()){
					uni.showToast({
						title: this.i18n.inpKeyWords,
						icon:'none',
					})
					return
				}
				let recentSearch = wx.getStorageSync('recentSearch') || [];
				recentSearch = recentSearch.filter(item => item !== this.prodName);
				recentSearch.unshift(this.prodName);
				if (recentSearch.length > 10) {
					recentSearch.pop();
				}
				wx.setStorageSync('recentSearch', recentSearch);
				
				this.toLoadData();
			},

			/**
			 * 状态点击事件
			 */
			onStsTap: function(e) {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 0
				})
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
				// 	url: '/pages/prod/prod?prodid=' + prodid
				// });
				this.$Router.push({ path: '/pages/prod/prod', query: { prodid: prodid }})
			}
		}
	};
</script>
<style>
	@import "./shopSearchResult.css";
</style>
