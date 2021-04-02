<template>
	<!--pages/dis-centers/dis-center.wxml-->
	<view class="container">

		<!-- 用户信息 -->
		<view class="user-information">
			<view class="user-info-box">
				<view class="user-head-portrait">
					<image :src="distInfo.pic?distInfo.pic:'/static/images/icon/head04.png'"></image>
					<!-- <open-data type="userAvatarUrl"></open-data> -->
				</view>
				<view class="username">{{distInfo.nickName}}</view>
				<!-- <open-data type="userNickName"></open-data> -->
			</view>
			<!-- 等级入口 -->
			<view class="enter-grade" @tap="toSalesmanLevel">
				<view class="grade-icon">
					<image src="../../static/images/icon/grade.png"></image>
				</view>
				<view class="grade-text">{{distInfo.levelName}}</view>
			</view>
			<view class="notice" @tap="toNotice" data-dist="true">
				<view class="notice-icon">
					<image src="../../static/images/icon/notice.png"></image>
				</view>
				<view class="notice-txt" v-if="!disNotice.length">{{i18n.noAnnouncement}}</view>
				<block v-if="disNotice.length > 0">
					<swiper circular="true" vertical="true" autoplay="true" duration="1000" class="swiper-cont">
						<block v-for="(item, index) in disNotice" :key="index">
							<swiper-item class="items">{{item.msgTitle}}</swiper-item>
						</block>
					</swiper>
					<view class="right-more">
						<image src="../../static/images/icon/more2.png"></image>
					</view>
				</block>
			</view>
		</view>

		<view class="user-info">
			<view class="info-cont">
				<!-- 竖排 -->
				<!-- <view class='total-income'>
        <view class='income-dt '>
          <view class='total'>总收益（元）</view>
          <view class='num '>498.98</view>
        </view>
        <view class='rule '>
          <text class='symbol-what'>?</text>
          <text class='rule-tip'>提现规则</text>
        </view>
      </view>
      <view class='withdraw'>
        <text class='could-draw'>可提现金额： 100.00元</text>
        <text class='draw-btn'>提现</text>
      </view> -->

				<!-- 横排 -->
				<view class="income">
					<view class="income-left">
						<view class="item">{{i18n.myBalance}}</view>
						<view class="num">{{wxs.toPrice(settledAmount)}}</view>
					</view>
					<view class="income-right">
						<view class="item">{{i18n.totalIncome}}</view>
						<view class="num">{{wxs.toPrice(addupAmount)}}</view>
					</view>

				</view>
				<!-- <view class='rule ' bindtap='toWalletCashRulePage'>
          <text class='symbol-what'>?</text>
          <text class='rule-tip'>提现规则</text>
        </view> -->
				<view class="draw-btn" @tap="toWithdrawal">
					<view class="btn">{{i18n.withdrawalsNow}}</view>
				</view>
			</view>
		</view>

		<view class="lists">
			<view class="list-item" @tap="toPromotionProdPage">
				<image src="../../static/images/icon/tuiguang02.png" class="icon" mode="widthFix"></image>
				<text class="item-text">{{i18n.promoteGoods}}</text>
			</view>
			<view class="list-item" @tap="toInvitationCards">
				<image src="../../static/images/icon/tuiguang01.png" class="icon" mode="widthFix"></image>
				<text class="item-text">{{i18n.inviteFriends}}</text>
			</view>

			<!-- <view class='list-item'>
      <image src='../../images/icon/tuiguang03.png' class='icon' mode="widthFix"></image>
      <text class='item-text'>推广海报</text>
    </view> -->
		</view>


		<view class="sorting-menu">
			<view class="menu-cont">
				<view class="menu-cont-list" @tap="toMyUserPage">
					<view class="icon">
						<image src="../../static/images/icon/menu-01.png" mode="widthFix"></image>
					</view>
					<view class="list-title">{{i18n.myUser}}</view>
					<text class="arrow"></text>
				</view>
				<view class="menu-cont-list" @tap="toPromotionOrderPage">
					<view class="icon">
						<image src="../../static/images/icon/menu-02.png" mode="widthFix"></image>
					</view>
					<view class="list-title">{{i18n.myPromotion}}</view>
					<text class="arrow"></text>
				</view>
			</view>
			<view class="menu-cont">
				<view class="menu-cont-list" @tap="toIncomeDetailsPage">
					<view class="icon">
						<image src="../../static/images/icon/menu-03.png" mode="widthFix"></image>
					</view>
					<view class="list-title">{{i18n.incomeBreakdown}}</view>
					<text class="arrow"></text>
				</view>
				<view class="menu-cont-list" @tap="toWalletCashPage">
					<view class="icon">
						<image src="../../static/images/icon/menu-04.png" mode="widthFix"></image>
					</view>
					<view class="list-title">{{i18n.withdrawalsRecord}}</view>
					<text class="arrow"></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script module="wxs" lang="wxs" src="../../../wxs/number.wxs"></script>

<script>
	// pages/dis-centers/dis-center.js
	var http = require("../../../utils/http.js");

	export default {
		data() {
			return {
				unsettledAmount: 0,
				// 待结算金额
				settledAmount: 0,
				// 可提现金额
				invalidAmount: 0,
				// 已失效金额
				addupAmount: 0,
				// 累计收益
				disNotice: [],
				// 分销公告
				distInfo: {},
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
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			//头部导航标题
			uni.setNavigationBarTitle({
				title:this.i18n.distributioncenter
			});
			// 分销员信息
			this.getDisInfo();
			// 分销钱包数据
			this.getDisInfoData();
			// 获取分销公告
			this.getDistributionMsg();
		},
		methods: {
			/**
			 * 获取分销员信息
			 */
			getDisInfo() {
				http.request({
					url: "/api/v1/distribution/user/distributionUserInfo",
					method: "GET",
					data: {
						shopId: 1
					},
					callBack: res => {
						this.distInfo = res
					}
				})
			},
			// 跳转到分销员等级页面
			toSalesmanLevel() {
				uni.navigateTo({
					url: '/packageDistribution/pages/salesmanLevel/salesmanLevel'
				});
			},

			// 跳转到公告页面
			toNotice() {
				if(this.disNotice.length > 0) {
					uni.navigateTo({
						url: '/pages/recent-news/recent-news?isDist=' + true
					});
				}
			},

			// 获取分销公告
			getDistributionMsg: function() {
				var ths = this;
				var params = {
					url: '/api/v1/distribution/msg/page',
					method: 'GET',
					data: {
						// current: 1,
						isTop: 1 // size: 10

					},
					callBack: res => {
						ths.setData({
							disNotice: res.records
						});
					}
				};
				http.request(params);
			},

			/**
			 * 获取用户钱包数据
			 */
			getDisInfoData: function() {
				uni.showLoading();
				var params = {
					url: "/api/v1/distribution/user/info",
					method: "GET",
					// data: {
					//   shopId: 1
					// },
					callBack: res => {
						this.setData({
							settledAmount: res.distributionUserWallet.settledAmount,
							addupAmount: res.distributionUserWallet.addupAmount
						});
						uni.hideLoading()
					}
				};
				http.request(params);
			},

			/**
			 * 跳转收入明细
			 */
			toIncomeDetailsPage: function() {
				uni.navigateTo({
					url: '/packageDistribution/pages/income-details/income-details'
				});
			},

			/**
			 * 跳转提现记录
			 */
			toWalletCashPage: function() {
				uni.navigateTo({
					url: '/packageDistribution/pages/take-notes/take-notes'
				});
			},

			/**
			 * 跳转提现规则
			 */
			toWalletCashRulePage: function() {
				uni.navigateTo({
					url: '/packageDistribution/pages/draw-rule/draw-rule'
				});
			},

			/**
			 * 跳转至我的用户
			 */
			toMyUserPage: function() {
				uni.navigateTo({
					url: '/packageDistribution/pages/my-users/my-users'
				});
			},

			/**
			 * 跳转我的推广界面
			 */
			toPromotionOrderPage: function() {
				uni.navigateTo({
					url: '/packageDistribution/pages/promotion-order/promotion-order'
				});
			},

			/**
			 * 跳转我的推广商品
			 */
			toPromotionProdPage: function() {
				uni.navigateTo({
					url: '/packageDistribution/pages/promotionProd/promotionProd'
				});
			},

			/**
			 * 跳转到邀请好友页面
			 */
			toInvitationCards: function() {
				uni.navigateTo({
					url: '/packageDistribution/pages/InvitationCards/InvitationCards'
				});
			},

			/**
			 * 跳转到提现
			 */
			toWithdrawal: function() {
				uni.navigateTo({
					url: '/packageDistribution/pages/withdrawal/withdrawal'
				});
			}
		}
	};
</script>
<style>
	@import "./dis-center.css";
</style>
