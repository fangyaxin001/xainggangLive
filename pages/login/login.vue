<template>
	<!--pages/login/login.wxml-->
	<view class="login-container">
		<view class="content">
			<image src="/static/logo.png" class="c-logo"></image>
			<view class="title">{{i18n.yamiMall}}</view>
			<view class="msg">{{i18n.yamiMallJoin}}</view>
		</view>

		<!-- #ifdef H5 -->
		<view class="login-phone">
			<button class="authorized-btn" @tap="mobileBindLogin">{{i18n.weChatLogin}}</button>
		</view>
		<!-- #endif -->

		<!-- #ifdef MP-WEIXIN -->
		<view class="login-phone">
			<button class="authorized-btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">{{i18n.weChatLogin}}</button>
		</view>
		<!-- #endif -->
		<view class="login-phone">
			<button class="authorized-btn hole-btn" @tap="toLogin">{{i18n.existingLogin}}</button>
		</view>
		<!-- 返回首页按钮 -->
		<view class="login-phone back-con">
			<text class="back" @tap="backToIndex">{{i18n.backHomepage}}</text>
		</view>
	</view>

</template>

<script>
	var http = require("../../utils/http.js");
	import {
		AppType
	} from "../../utils/constant.js";
	export default {
		data() {
			return {

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
			// #ifdef MP-WEIXIN
			wx.login({
				success: res => {
					// 发送 res.code 到后台换取 openId, sessionKey, unionId
					http.request({
						login: true,
						url: '/appLogin',
						data: {
							principal: res.code,
							appType: 1
						},
						callBack: result => {
							wx.setStorageSync('tempToken', 'bearer' + result.access_token)
						}
					}, true)
				}
			})
			// #endif
		},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			uni.setNavigationBarTitle({
			    title:this.i18n.yamiMall
			});
		},

		/**
		 * 生命周期函数--监听页面隐藏
		 */
		onHide: function() {},

		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function() {
			wx.removeStorageSync('tempToken');
		},

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
			 * 手机号绑定登录 - H5 微信浏览器
			 */
			mobileBindLogin() {
				http.mpAuthLogin('/pages/binding-phone/binding-phone')
				// //
				// if (wx.getStorageSync('hadBindUser')) {
				// 	http.mpAuthLogin('/')
				// } else {
				// 	http.mpAuthLogin('/pages/binding-phone/binding-phone')
				// }
			},

			/**
			 * 获取手机号一键授权登陆 - 微信小程序
			 */
			getPhoneNumber(e) {
				// #ifdef MP-WEIXIN
				if (e.detail.errMsg === 'getPhoneNumber:ok') {
					var params = {
						url: '/user/registerOrBindUser',
						method: 'PUT',
						data: {
							appType: 1,
							encryptedData: e.detail.encryptedData,
							ivStr: e.detail.iv,
							img: wx.getStorageSync('userInfo').avatarUrl || '',
							nickName: wx.getStorageSync('userInfo').nickName || '',
							validateType: 2,
							registerOrBind: 2 // 验证类型 1注册 2绑定
						},
						callBack: res => {
							http.loginSuccess(res)
							this.$Router.pushTab('/pages/index/index')
						}
					}
					http.request(params)
				} else {
					wx.showToast({
						title: this.i18n.privilegeGrantFailed,
						icon: 'none'
					})
				}
				// #endif
			},

			/**
			 * 跳转账号登陆
			 */
			toLogin() {
				// #ifdef H5 
				http.mpAuthLogin('/pages/accountLogin/accountLogin', true)
				// #endif
				// #ifdef APP-PLUS || MP-WEIXIN
				uni.navigateTo({
					url: '/pages/accountLogin/accountLogin'
				})
				// #endif
			},

			/**
			 * 回到首页
			 */
			backToIndex() {
				uni.switchTab({
					url: '../index/index'
				})
			},

		}
	};
</script>
<style>
	@import "./login.css";
</style>
