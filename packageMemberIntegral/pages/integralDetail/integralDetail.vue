<template>
	<view>
		<!-- 积分明细 -->
		<view class="integral-detail">
			<view class="integral-msg">
				<u-navbar title="積分明細" :background="background" back-icon-color="#ffffff" title-color="#ffffff" :border-bottom="false"></u-navbar>
				<view class="my-integral">
					<view class="number-box">
						<view class="text">{{userInfo.score}}</view>
						<view class="number">積分</view>
					</view>
					<view class="det">
					</view>
				</view>
			</view>
			<view class="detail-list">
				<view class="item" v-for="(item, logId) in scoreDetails" :key="logId">
					<view class="text-box">
						<!-- source来源 0注册送积分 1. 购物 2.会员等级提升加积分 3.签到加积分 4购物抵扣使用积分 5积分过期 6充值获赠 -->
						<!-- ioType出入类型 0=支出 1=收入 -->
						<view class="tit" v-if="item.source == 0">{{i18n.registerEarnPoints}}</view>
						<view class="tit" v-if="item.source == 1 && item.ioType == 1">{{i18n.rewardPointsGoods}}</view>
						<view class="tit" v-if="item.source == 1 && item.ioType == 0">{{i18n.refundShopping}}</view>
						<view class="tit" v-if="item.source == 2">{{i18n.pointsLevelPromotion}}</view>
						<view class="tit" v-if="item.source == 3">{{i18n.signGetPoints}}</view>
						<view class="tit" v-if="item.source == 4 && item.ioType == 1">{{i18n.refundGoodsPoints}}</view>
						<view class="tit" v-if="item.source == 4 && item.ioType == 0">{{i18n.purchaseGoodsPoints}}</view>
						<view class="tit" v-if="item.source == 5">{{i18n.pointsExpired}}</view>
						<view class="tit" v-if="item.source == 6">{{i18n.rechargeGetPoints}}</view>
						<view class="tit" v-if="item.source == 7">{{i18n.platformModification}}</view>
						<view class="time">{{item.createTime}}</view>
					</view>
					<view :class="'score ' + (item.ioType == 0 ? 'reduce':'add')">{{item.ioType == 0 ? "-":"+"}}{{item.score}}</view>
				</view>
			</view>
			<view class="loadall" v-if="scoreDetails.length > 10 && isAll">{{i18n.endTips}}</view>
			<view class="empty" v-if="!scoreDetails.length">{{i18n.noDetails}}</view>
		</view>

		<!-- 积分攻略弹框 -->
		<view class="score-strategy" v-if="showPop">
			<view class="mask"></view>
			<view class="explain-card">
				<view class="content-wrap">
					<view class="cont-title">{{i18n.integralStrategy}}</view>
					<image class="close-icon" @tap="clikcPop" src="/static/images/icon/close.png"></image>
					<view class="cont-det">
						<view class="cont-det-text" v-html="scoreExplain.paramValue"></view>
					</view>
				</view>
			</view>
		</view>
		<!-- /积分攻略弹框 -->

		<!-- /积分明细 -->
	</view>
</template>

<script>
	// pages/integralDetail/integralDetail.js
	var http = require("../../../utils/http.js");

	export default {
		data() {
			return {
				background: 'none',
				pages: 0,
				current: 1,
				size: 20,
				scoreDetails: [],
				//积分明细列表
				isAll: false,
				userInfo: {},
				//用户积分等级信息
				scoreExplain: {},
				//积分说明
				showPop: false, //攻略弹框显隐
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
		onLoad: function(options) {
			//请求积分明细
			this.getScoreDetails(); //获取用户积分等级信息

			this.getUserScore(); //积分攻略

			this.getScoreExplain();
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
			this.getNextPage();
		},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {},
		methods: {
			/**
			 * 获取用户积分等级信息
			 */
			getUserScore: function() {
				var param = {
					url: '/api/v1/user/userInfo',
					method: 'GET',
					data: {
						current: this.current,
						size: this.size
					},
					callBack: res => {
						this.setData({
							userInfo: res
						});
					}
				};
				http.request(param);
			},

			/**
			 * 请求积分明细
			 */
			getScoreDetails: function() {
				uni.showLoading();
				var param = {
					url: '/api/v1/score/page',
					method: 'GET',
					data: {
						current: this.current,
						size: this.size
					},
					callBack: res => {
						uni.hideLoading()
						var scoreDetails = [];

						if (this.current == 1) {
							this.setData({
								scoreDetails: res.records,
								pages: res.pages,
								current: res.current
							});
						} else {
							scoreDetails = this.scoreDetails;
							scoreDetails.push(...res.records);
							this.setData({
								scoreDetails
							});
						}

						console.log(this.scoreDetails);
					}
				};
				http.request(param);
			},

			/**
			 * 触底加载下一页
			 */
			getNextPage() {
				if (this.pages > this.current) {
					this.setData({
						current: this.current + 1
					});
					this.getScoreDetails();
				} else {
					this.setData({
						isAll: true
					});
				}
			},

			/**
			 * 积分攻略
			 */
			getScoreExplain: function() {
				var param = {
					url: '/api/v1/score/getScoreQuestion',
					method: 'GET',
					data: {},
					callBack: res => {
						this.setData({
							scoreExplain: res
						});
						console.log(this.scoreExplain);
					}
				};
				http.request(param);
			},

			/**
			 * 积分攻略弹框显隐
			 */
			clikcPop: function() {
				var showPop = !this.showPop;
				this.setData({
					showPop
				});
			}
		}
	};
</script>
<style>
	@import "./integralDetail.css";
	@import "../integralIndex/integralIndex.css";
</style>
