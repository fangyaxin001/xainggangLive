<template>
	<!-- pages/logisticsInfo/logisticsInfo.wxml -->
	<!-- 物流信息 -->
	<view class="logistics-page">
		<view class="logistics-box" v-if="package.length">
			<!-- nav -->
			<view :class="'package-list ' + (package.length>=5?'package-overlength':'package-list-flex')">
				<block v-for="(item, index) in package" :key="index">
					<view class="package-item" :data-sts="index" @tap="navChange">
						<view :class="'nav-txt ' + (isCurrent == index?'active':'')">{{i18n.package}}{{index+1}}</view>
					</view>
				</block>
			</view>
			<!-- 包裹信息 -->
			<view :class="['package-info',{ mt100: (package.length>1) }]">
				<view class="package-prod">
					<!-- 单个包裹 -->
					<view class="single-package" v-if="package[isCurrent].orderItems.length == 1">
						<view class="prod-pic">
							<image :src="package[isCurrent].orderItems[0].pic ? package[isCurrent].orderItems[0].pic : '../../../images/icon/package-icon.png'"
							 class="prod-pic"></image>
							<view class="quantity">×{{package[isCurrent].orderItems[0].prodCount}}</view>
						</view>
						<view class="prod-con">
							<!-- 物流状态 1已揽收 2运输途中 3已签收 4问题件 201达到目的城市 -1删除 -->
							<view class="prod-status" v-if="package[isCurrent].status != -1">{{['',i18n.alreadyReceived,i18n.inTransit,i18n.signedInReceived,i18n.questionableDelivery,i18n.arriveDestinationCity][package[isCurrent].status]}}</view>
							<view class="prod-status" v-if="package[isCurrent].status == -1">{{i18n.delete}}</view>
							<view class="prod-carrier">{{i18n.carriageSource}}：{{package[isCurrent].deliveryDto.companyName}}</view>
							<view class="carrier">
								<text class="waybill-num">{{i18n.waybillNumber}}：{{package[isCurrent].deliveryDto.dvyFlowId}}</text>
								<text class="copy-btn" @tap="copyBtn">{{i18n.copy}}</text>
							</view>
						</view>
					</view>
					<!-- 多个包裹 -->
					<view class="multiple-package" v-if="package[isCurrent].orderItems.length > 1">
						<view class="prod-con">
							<view class="prod-status" v-if="package[isCurrent].status != -1">{{['',i18n.alreadyReceived,i18n.inTransit,i18n.signedInReceived,i18n.questionableDelivery,i18n.arriveDestinationCity][package[isCurrent].status]}}</view>
							<view class="prod-status" v-if="package[isCurrent].status == -1">{{i18n.delete}}</view>
							<view class="prod-carrier">{{i18n.carriageSource}}： {{package[isCurrent].deliveryDto.companyName}}</view>
							<view class="carrier">
								<text class="waybill-num">{{i18n.waybillNumber}}：{{package[isCurrent].deliveryDto.dvyFlowId}}</text>
								<text class="copy-btn" @tap="copyBtn">{{i18n.copy}}</text>
							</view>
						</view>
						<view class="prod-item">
							<block v-for="(prod, index) in package[isCurrent].orderItems" :key="index">
								<view class="prod-item-pic">
									<image :src="prod.pic ? prod.pic : '../../../images/icon/package-icon.png'" class="prod-pic"></image>
									<view class="quantity">×{{prod.prodCount}}</view>
								</view>
							</block>
						</view>
					</view>
				</view>
				<!-- 物流信息 -->
				<view class="logistics-info">
					<view class="logistics-box" v-if="package[isCurrent].deliveryDto.traces.length">
						<view class="logistics">
							<block v-for="(tracesItem, index) in package[isCurrent].deliveryDto.traces" :key="index">
								<view class="item">
									<view class="time">{{tracesItem.acceptTime}}</view>
									<view class="des">{{tracesItem.acceptStation}}</view>
								</view>
							</block>
						</view>
					</view>
					<!-- 物流信息为空 -->
					<view class="logistics-info-empty" v-if="!package[isCurrent].deliveryDto.traces.length">{{i18n.noDeliveryInformation}}</view>
				</view>
			</view>
		</view>
		<!-- 包裹信息为空 -->
		<view class="expresses-empty" v-if="!package.length">{{i18n.noPackageTips}}</view>
	</view>
</template>

<script>
	// pages/logisticsInfo/logisticsInfo.js
	var http = require("../../utils/http.js");
	var config = require("../../utils/config.js");
	import uniCopy from '@/js_sdk/copy/uni-copy.js'

	export default {
		data() {
			return {
				orderNumber: '',
				//运单编号
				isCurrent: 0,
				//当前nav
				package: [] //包裹集合信息

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
			uni.showLoading();
			var params = {
				url: '/api/v1/myDelivery/orderInfo/' + options.orderNumber,
				method: "GET",
				callBack: res => {
					uni.hideLoading()
					this.setData({
						package: res //包裹集合信息
					});
				}
			};
			http.request(params);
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
			    title:this.i18n.logisticsDetails
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
		onReachBottom: function() {},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {},
		methods: {
			/**
			 * nav切换
			 */
			navChange: function(e) {
				let sts = e.currentTarget.dataset.sts;
				this.setData({
					isCurrent: sts
				});
			},
			// 一键复制事件
			copyBtn: function() {
				uniCopy({
					content: this.package[this.isCurrent].dvyFlowId,
					success: (res) => {
						uni.showToast({
							title: res,
							icon: 'none'
						})
					},
					error: (e) => {
						uni.showToast({
							title: e,
							icon: 'none',
							duration: 3000,
						})
					}
				})
			}
		}
	};
</script>
<style>
	@import "./logisticsInfo.css";
</style>
