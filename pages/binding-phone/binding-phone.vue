<template>
	<!--pages/binding-phone/binding-phone.wxml-->
	<view class="container" v-if="showPage">
		<view class="binding-phone">
			<!-- <block wx:for='{{couponList}}' wx:key=''> -->
			<view class="item">
				<text class="item-tip">{{i18n.mobilePhone}}：</text>
				<input :placeholder="i18n.enterMobileNumber" type="number" maxlength="11" :value="mobile" @input="onPhoneInput"></input>
			</view>
			<view class="item">
				<text class="item-tip">{{i18n.verificationCode}}：</text>
				<input :placeholder="i18n.enterCode" type="number" :value="code" @input="onCodeInput"></input>
				<text class="get-code gray" v-if="show" @tap="getCode">{{i18n.getCode}}</text>
				<text class="get-code gray" v-if="!show">{{count}} s</text>
			</view>
			<!-- </block> -->
		</view>

		<view class="btn-box">
			<text class="sure-btn gray" v-if="!infoComplete">{{i18n.bind}}</text>
			<text class="sure-btn" v-else @tap="bindMobile">{{i18n.bind}}</text>
		</view>
	</view>
</template>

<script>
	// pages/binding-phone/binding-phone.js
	var http = require("../../utils/http.js");
	var util = require("../../utils/util.js");
	import {AppType} from "../../utils/constant.js";

	export default {
		data() {
			return {
				mobile: '',
				code: '',
				infoComplete: false,
				show: true,
				count: '',
				timer: null,
				hadGotCode: false,
				showPage: false
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
			uni.showLoading()
			uni.setNavigationBarTitle({
				title:this.i18n.pageSkipping
			})
			setTimeout(()=>{
				if (uni.getStorageSync('hadBindUser')) {
					uni.hideLoading()
					this.$Router.pushTab('/pages/index/index')
				} else {
					uni.hideLoading()
					this.showPage = true
					// 设置头部导航标题
					uni.setNavigationBarTitle({
						title:this.i18n.bindingMobilePhone
					})
					uni.hideLoading()
				}
			}, 800)
		},

		/**
		 * 生命周期函数--监听页面隐藏
		 */
		onHide: function() {

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
			/**
			 * 获取验证码
			 */
			getCode() {
				if (!util.checkPhoneNumber(this.mobile)) {
					uni.showToast({
						title: this.i18n.enterMobileNumberTips,
						icon: 'none',
					})
					return
				}
				if (this.hadGotCode) {
					return
				}
				this.hadGotCode = true
				var params = {
					url: "/user/sendBindSms",
					method: "PUT",
					data: {
						mobile: this.mobile,
					},
					callBack: res => {
						this.hadGotCode = true
						const timeCount = 60;
						if (!this.timer) {
							this.count = timeCount
							this.show = false;
							this.timer = setInterval(() => {
								if (this.count > 0 && this.count <= timeCount) {
									this.count--;
								} else {
									clearInterval(this.timer);
									this.timer = null,
										this.show = true,
										this.hadGotCode = false
								}
							}, 1000)
						}
					}
				};
				http.request(params);
			},

			onPhoneInput: function(e) {
				this.setData({
					mobile: e.detail.value
				});
			},
			onCodeInput: function(e) {
				this.setData({
					code: e.detail.value,
				});
				if (this.$data.mobile && this.$data.code) {
					this.setData({
						infoComplete: true,
					})
				} else {
					this.setData({
						infoComplete: false,
					})
				}
			},
			/**
			 * 绑定手机号
			 */
			bindMobile() {
				var params = {
					url: '/user/registerOrBindUser',
					method: 'PUT',
					data: {
						appType: AppType.MP,
						mobile: this.mobile,
						validCode: this.code,
						validateType: 1, // 验证类型:1验证码验证 ,
						registerOrBind:2 // 验证类型 1注册 2绑定
					},
					callBack: res => {
						http.loginSuccess(res)
						this.$Router.pushTab('/pages/index/index')
					},
				}
				http.request(params)
			},
		}
	};
</script>
<style>
	@import "./binding-phone.css";
</style>
