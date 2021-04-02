<template>
	<view>
		<!-- 分销员等级 -->
		<!--pages/salesmanLevel/salesmanLevel.wxml-->

		<!-- 头部等级展示 -->
		<view class="top-wrapper">
			<view class="toplevelshow">
				<view class="level-txt">{{levelName}}</view>


				<view class="level-progress">
					<view :class="(wxs.indexof(index+1)) + ' ' + (level == index ? 'current-level' : '') + ' level-block'" v-for="(item, index) in levelInfo"
					 :key="index" :data-index="index" @tap="clinkLevel">
						<view :class="'square-block ' + (clickLevel == index ? 'current-bg' : '')"></view>
						<view :class="'level-block-txt ' + (clickLevel == index ? 'current-color' : '')">{{item.name}}</view>
					</view>
				</view>
			</view>

		</view>

		<!-- 等级规则 -->
		<view class="rules-wrapper">
			<view class="riles-title">
				<view class="horizontal"></view>
				<view class="riles-title-txt">{{i18n.hierarchicalRules}}</view>
				<view class="horizontal"></view>
			</view>

			<view :class="'introduction-rules ' + (clickLevel == index  ? 'current-rules':'')" v-for="(rank, index) in levelInfo"
			 :key="index">
				<view class="intro-level-tit">
					<view class="salesman">{{rank.name}}</view>
				</view>
				<view class="intron-rule">
					<view class="rule-desc-tit">
						<view class="intro-icon">
							<image src="../../static/images/icon/inviolable-rights.png"></image>
						</view>
						<view class="intro-title">{{i18n.introductionUpgradeRules}}</view>
					</view>

					<view class="condition-box">
						<view class="condition">
							<view class="intro-detailed" v-if="rank.levelSetConditionsSwitch.addupAmount">
								<view class="triangle"></view>{{i18n.upgradeRules1}}<text>￥{{wxs.toPrice(rank.distributionLevelConditionDataVO.addupAmount)}}</text>
							</view>
							<view class="intro-detailed" v-if="rank.levelSetConditionsSwitch.boundCustomers">
								<view class="triangle"></view>{{i18n.upgradeRules2}}<text>{{rank.distributionLevelConditionDataVO.boundCustomers}}</text>{{i18n.people}}
							</view>
							<view class="intro-detailed" v-if="rank.levelSetConditionsSwitch.invitedVeeker">
								<view class="triangle"></view>{{i18n.upgradeRules3}}<text>{{rank.distributionLevelConditionDataVO.invitedVeeker}}</text>{{i18n.people}}
							</view>
							<view class="intro-detailed" v-if="rank.levelSetConditionsSwitch.invitedCustomers">
								<view class="triangle"></view>{{i18n.upgradeRules4}}<text>{{rank.distributionLevelConditionDataVO.invitedCustomers}}</text>{{i18n.people}}
							</view>
							<view class="intro-detailed" v-if="rank.levelSetConditionsSwitch.payNumber">
								<view class="triangle"></view>{{i18n.upgradeRules5}}<text>{{rank.distributionLevelConditionDataVO.payNumber}}</text>{{i18n.piecesBi}}
							</view>
							<view class="intro-detailed" v-if="rank.levelSetConditionsSwitch.sumOfConsumption">
								<view class="triangle"></view>{{i18n.upgradeRules6}}<text>￥{{wxs.toPrice(rank.distributionLevelConditionDataVO.sumOfConsumption)}}</text>
							</view>
							<view class="intro-detailed" v-if="rank.levelSetConditionsSwitch.successOrderNumber">
								<view class="triangle"></view>{{i18n.upgradeRules7}}<text>{{rank.distributionLevelConditionDataVO.successOrderNumber}}</text>{{i18n.piecesBi}}
							</view>
							<view class="intro-detailed" v-if="rank.levelSetConditionsSwitch.successTradingVolume">
								<view class="triangle"></view>{{i18n.upgradeRules8}}<text>￥{{wxs.toPrice(rank.distributionLevelConditionDataVO.successTradingVolume)}}</text>
							</view>
						</view>
					</view>

					<view class="buyprod" v-if="rank.distributionLevelConditionDataVO.commodity.length">
						<view class="buy-tit">
							<view class="triangle"></view>{{i18n.purchaseDesignatedGoods}}
						</view>
						<view class="prod-msg" @tap="toProdPage" :data-prodid="prod.prodId" v-for="(prod, index2) in rank.distributionLevelConditionDataVO.commodity"
						 :key="index2">
							<view class="prod-img">
								<image :src="prod.pic"></image>
							</view>
							<view class="prod-name">
								<view class="prod-name-txt">{{prod.prodName}}</view>
							</view>
						</view>
					</view>
				</view>


			</view>

		</view>

		<!-- 立即升级 -->
		<view class="upgrade-now" @tap="applicationUpgrade" v-if="clickLevel ==  level+1">
			<view class="upgrade">{{i18n.upgradeImmediately}}</view>
		</view>
	</view>
</template>

<script module="wxs" lang="wxs" src="../../../wxs/number.wxs"></script>

<script>
	// 查看等级
	// pages/salesmanLevel/salesmanLevel.js
	var http = require("../../../utils/http.js");

	export default {
		data() {
			return {
				levelInfo: [],
				//等级
				clickLevel: 0,
				// 用户点击的等级
				levelName: '',
				// 用户当前等级名称
				level: 0 // 用户当前等级
					,
				currentColor: "",
				currentbg: ""
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
			this.getLevelInfo(); // this.setData ({
			//   currentLev: this.data.currentLevel
			// })
			// console.log(this.data.currentLev)
			// console.log(this.data.currentLevel)
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
		onReachBottom: function() {},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {},
		methods: {
			/**
			 * 查看等级
			 */
			getLevelInfo: function() {
				uni.showLoading();
				var params = {
					url: '/api/v1/distribution/level/page',
					method: 'GET',
					data: {},
					callBack: res => {
						uni.hideLoading() 
						this.setData({
							levelInfo: res
						});

						if (res.length) {
							res.forEach(levelInfo => {
								if (levelInfo.isCurrentLevel) {
									this.setData({
										clickLevel: levelInfo.level - 1,
										level: levelInfo.level - 1,
										levelName: levelInfo.name
									});
								}
							});
						}
					}
				};
				http.request(params);
			},

			/**
			 * 申请升级
			 */
			applicationUpgrade: function() {
				var params = {
					url: '/api/v1/distribution/level/upgrade',
					method: 'POST',
					callBack: res => {
						console.log(res);
						uni.showToast({
							title: this.i18n.upgradeSuccessful,
							icon: 'none'
						});
						this.getLevelInfo();
					}
				};
				http.request(params);
			},

			/**
			 * 跳转到商品详情
			 */
			toProdPage: function(e) {
				var prodid = e.currentTarget.dataset.prodid;

				if (prodid) {
					// uni.navigateTo({
					// 	url: '/pages/prod/prod?prodid=' + prodid
					// });
					this.$Router.push({ path: '/pages/prod/prod', query: { prodid: prodid }})
				}
			},

			/**
			 * 点击切换当前等级规则
			 */
			clinkLevel: function(e) {
				this.setData({
					clickLevel: e.currentTarget.dataset.index,
					currentColor: 'current-color',
					currentbg: 'current-bg'
				});
				console.log(e.currentTarget.dataset.index);
			}
		}
	};
</script>
<style>
	@import "./salesmanLevel.css";
</style>
