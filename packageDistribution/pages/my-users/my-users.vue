<template>
	<!--pages/my-users/my-users.wxml-->
	<view class="container">
		<view class="my-user">
			<view class="user-bg">
				<!-- <view class="user-bg-my">我的用户</view> -->
				<view class="text">{{i18n.inTotal}}<view class="number">{{totalInvite}}</view>{{i18n.people}}</view>
			</view>
			<view class="user-list" v-if="records.length>0">
				<view class="title">
					<text class="subtitle">{{i18n.avatar}}</text>
					<text class="subtitle">{{i18n.nickname}}</text>
					<text class="subtitle">{{i18n.bindingDate}}</text>
				</view>
				<view class="lists" v-for="(item, id) in records" :key="id">
					<view class="list-item">
						<view class="items">
							<view class="img">
								<image :src="item.pic?item.pic:'/static/images/icon/head04.png'"></image>
							</view>
						</view>
						<text class="items">{{item.nickName}}</text>
						<text class="items">{{item.bindTime}}</text>
					</view>
				</view>
			</view>
			<view class="empty" v-if="records.length==0">{{emptyMsg}}</view>
			<view class="loading" v-if="totalPage>1">{{loadingMsg}}</view>
		</view>

	</view>
</template>

<script>
	// pages/my-users/my-users.js
	var http = require("../../../utils/http.js");

	export default {
		data() {
			return {
				totalInvite: 0,
				records: [],
				// loadingMsg: this.i18n.loading,
				loadingMsg: "",
				emptyMsg: "",
				totalPage: 1,
				pageNum: 1
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
		onLoad: function(options) {},

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
			    title:this.i18n.myUser
			});
			
			this.loadingMsg = this.i18n.loading;
			
			this.loadPageData(1);
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
			if (this.pageNum < this.totalPage) {
				this.loadPageData(this.pageNum + 1);
			}
		},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {},
		methods: {
			/**
			 * 加载用户数据
			 */
			loadPageData: function(pageNum) {
				var ths = this;
				uni.showLoading();
				var params = {
					url: "/api/v1/distribution/bindUserList",
					method: "GET",
					data: {
						// shopId: 1,
						current: pageNum,
						size: 20
					},
					callBack: res => {
						uni.hideLoading()
						var records = [];

						if (res.current == 1) {
							records = res.records;
						} else {
							records = this.records.concat(res.records);
						}

						var loadingMsg = this.loadingMsg;

						if (pageNum == res.pages) {
							loadingMsg = ths.i18n.noMore;
						}

						ths.setData({
							records: records,
							totalPage: res.pages,
							pageNum: pageNum,
							loadingMsg: loadingMsg,
							emptyMsg: ths.i18n.noUsersYet,
							totalInvite: res.total
						});
					}
				};
				http.request(params);
			}
		}
	};
</script>
<style>
	@import "./my-users.css";
</style>
