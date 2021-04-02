<template>
	<!-- 账号设置 -->
	<!--pages/accountSettings/accountSettings.wxml-->

	<view class="set-accout">

		<!-- 账号 -->
		<view class="set-accout-item">
			<text class="item-tit" decode="true">{{i18n.loginAccount}}:</text>
			<input type="text" @input="bindPhoneNumInt" class="item-input" maxlength="11" :placeholder="i18n.enterPhone"></input>
			<!-- 微信获取手机号码 -->
			<!-- <view class="userphone clearfix">
      <view class="show-num" v-if="phoneNumber != ''">{{phoneNumber}}</view>
      <button class="get-userphone-btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">点击获取手机号</button>
    </view> -->
		</view>

		<!-- 验证码 -->
		<view class="set-accout-item">
			<text class="item-tit" decode="true">{{i18n.verificationCode}}:</text>
			<input class="item-input valid-input" type="text" @input="bindValidCodeInt" :placeholder="i18n.enterCode" />
			<text class="send-code" v-show="show" @click="getValidCode">{{i18n.getCode}}</text>
			<text v-show="!show" class="send-code" style="cursor: not-allowed;">{{count}} s</text>
		</view>

		<!-- 密码 -->
		<view class="set-accout-item">
			<text class="item-tit" decode="true">{{i18n.password}}:</text>
			<input type="password" @input="bindPasswordInt" class="item-input" :placeholder="i18n.passwordLength"></input>
		</view>

		<!-- 确认密码 -->
		<view class="set-accout-item">
			<text class="item-tit" decode="true">{{i18n.confirmNew}}:</text>
			<input type="password" @input="bindConfirmPasswordInt" class="item-input" :placeholder="i18n.enterPasswordAgain"></input>
		</view>

		<!-- 确认 -->
		<view class="confirm">
			<view class="confirm-btn" @tap="accountSettingsSubmit">{{i18n.confirm}}</view>
		</view>


		<!-- tips -->
		<view class="tips-main">
			<view class="tips">{{i18n.accountTip}}</view>
		</view>


	</view>
</template>

<script>
	// pages/accountSettings/accountSettings.js
	var http = require("../../utils/http.js");
	var util = require('../../utils/util.js');

	export default {
		data() {
			return {
				// username: '',
				password: '',
				phoneNumber: '',
				countryCode: '',
				//区号
				confirmPassword: '', //确认密码
				// 验证码相关
				show: true,
				count: '',
				timer: null,
				hadGotCode: false, //是否已经点击了获取验证码
				validCode: '',

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
			    title:this.i18n.storeAccountSettings
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
			 * 获取用户手机号码
			 */
			// getPhoneNumber: function (e) {
			//   uni.showLoading(); // 参数e是绑定的授权方法自动传入过来的, 主要是为了拿到vi和encryptedData值从后台换取用户联系方式

			//   var iv = e.detail.iv;
			//   var encryptedData = e.detail.encryptedData; //调用后台接口获取用户手机号码

			//   var params = {
			//     url: "/api/v1/user/getPhoneNumber",
			//     method: "GET",
			//     data: {
			//       encryptedData: encryptedData,
			//       ivStr: iv
			//     },
			//     callBack: res => {
			//       uni.hideLoading()			//       this.setData({
			//         phoneNumber: res.phoneNumber,
			//         countryCode: res.countryCode
			//       });
			//       console.log(this.phoneNumber);
			//     }
			//   };
			//   http.request(params);
			// },


			/**
			 * 获取验证码
			 */
			getValidCode: function() {
				if (!util.checkPhoneNumber(this.phoneNumber) || this.phoneNumber.length != 11) {
					uni.showToast({
						title: this.i18n.enterValidPhone,
						icon: 'none'
					});
					return
				}
				if (this.hadGotCode) {
					return
				}
				var params = {
					url: "/api/v1/shop/sendCode",
					method: "POST",
					data: {
						mobile: this.phoneNumber,
						shopAccount: 1,
					},
					callBack: res => {
						this.hadGotCode = true
						const timeCount = 60;
						if (!this.timer) {
							this.count = timeCount;
							this.show = false;
							this.timer = setInterval(() => {
								if (this.count > 0 && this.count <= timeCount) {
									this.count--;
								} else {
									this.show = true;
									clearInterval(this.timer);
									this.timer = null;
									this.hadGotCode = false
								}
							}, 1000)
						}
					}
				};
				http.request(params);
			},

			/**
			 * 获取登陆账号数据
			 */
			bindPhoneNumInt: function(e) {
				this.setData({
					phoneNumber: e.detail.value
				})
			},

			/**
			 * 获取输入的验证码的值
			 */
			bindValidCodeInt: function(e) {
				console.log(e.detail.value)
				this.setData({
					validCode: e.detail.value
				});
				console.log(validCode)
			},

			/**
			 * 获取登录密码数据
			 */
			bindPasswordInt: function(e) {
				this.setData({
					password: e.detail.value
				});
			},

			/**
			 * 获取确认密码数据
			 */
			bindConfirmPasswordInt: function(e) {
				this.setData({
					confirmPassword: e.detail.value
				});
			},

			/**
			 * 请求接口
			 */
			accountSettingsSubmit: function() {
				if (!util.checkPhoneNumber(this.phoneNumber) || this.phoneNumber.trim().length != 11) {
					uni.showToast({
						title: this.i18n.enterValidPhone,
						icon: 'none'
					});
				} else if (this.validCode.length == 0) {
					uni.showToast({
						title: this.i18n.enterCode,
						icon: 'none'
					});
				} else if (this.password.trim().length < 6 || this.password.trim().length > 12) {
					uni.showToast({
						title: this.i18n.enterCorrectLoginPassword,
						icon: 'none'
					});
				} else if (this.confirmPassword != this.password) {
					uni.showToast({
						title: this.i18n.loginPasswordTips,
						icon: 'none'
					});
				} else {
					uni.showLoading();
					var params = {
						url: "/api/v1/shop/saveUsernameAndPassword",
						method: "POST",
						data: {
							username: this.phoneNumber.trim(),
							password: this.password.trim(),
							code: this.validCode.trim()
						},
						callBack: res => {
							uni.hideLoading()							
							uni.showToast({
								icon: 'success',
								title: this.i18n.setupSucceeded,
								duration: 2000,
								success: ()=> {
									// uni.switchTab({
									// 	url: '/pages/user/user'
									// });
									this.$Router.pushTab('/pages/user/user')
								}
							})
						}
					};
					http.request(params);
				}
			}
		}
	};
</script>
<style>
	@import "./accountSettings.css";
</style>
