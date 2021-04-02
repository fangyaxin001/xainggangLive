<template>
	<view :class="isForgetPassword ? '' :'con'">

		<image v-if="!isForgetPassword" style="width: 150rpx; height: 150rpx;" src="/static/images/login/logo.png" @tap="toIndex"
		 mode="aspectFit"></image>
		<!-- 登录 -->
		<view class="login-form" v-if="!isForgetPassword">

			<view v-if="phoneLogin">
				<view :class="['item',errorTips==1? 'error':'']">
					<!-- 账号 -->
					<view class="account">
						<view class="">
							<image style="width: 32rpx; height: 32rpx;" src="/static/images/login/phone.png" mode="aspectFit"></image>
						</view>
						<view style="padding-left: 30rpx; width: 100%;">
							<u-input v-model="principal" type="number" maxlength="11" :placeholder="i18n.enterUsername" />
						</view>
						<!-- <text class="input-item">{{i18n.username}}</text> -->
						<!-- <input type="text" @input="getInputVal" data-type="account" placeholder-class="inp-palcehoder" :placeholder="i18n.enterUsername"> -->
					</view>
					<!-- 没有输入账号提示错误 -->
					<view class="error-text" v-if="errorTips==1"><text class="warning-icon">!</text>{{i18n.usernameWarn}}</view>
				</view>
				<view :class="['item',errorTips==2? 'error':'']">
					<!-- 密码 -->
					<view class="account">
						<view class="">
							<image style="width: 32rpx; height: 32rpx;" src="/static/images/login/password.png" mode="aspectFit"></image>
						</view>
						<view style="padding-left: 30rpx; width: 100%;">
							<u-input v-model="credentials" :type="type" :placeholder="i18n.enterPassword" :password-icon="passwordIcon" />
						</view>
						<!-- <text class="input-item">{{i18n.password}}</text> -->
						<!-- <input type="password" @input="getInputVal" data-type="password" placeholder-class="inp-palcehoder" :placeholder="i18n.enterPassword"> -->
					</view>
					<!-- 没有输入密码提示错误 -->
					<view class="error-text" v-if="errorTips==2"><text class="warning-icon">!</text>{{i18n.enterPassword}}</view>
				</view>
				<!-- 验证码登录 -->
				<view class="code-login" @click="phoneLogin=false">{{i18n.codeLogin}}</view>
			</view>
			<!-- 验证码登录 -->
			<view v-else>
           <view :class="['item',errorTips==1? 'error':'']">
           	<!-- 账号 -->
           	<view class="account">
           		<view class="">
           			<image style="width: 32rpx; height: 32rpx;" src="/static/images/login/phone.png" mode="aspectFit"></image>
           		</view>
           		<view style="padding-left: 30rpx; width: 100%;">
           			<u-input v-model="principal" type="number" maxlength="11" :placeholder="i18n.enterUsername" />
           		</view>
           		<!-- <text class="input-item">{{i18n.username}}</text> -->
           		<!-- <input type="text" @input="getInputVal" data-type="account" placeholder-class="inp-palcehoder" :placeholder="i18n.enterUsername"> -->
           	</view>
           	<!-- 没有输入账号提示错误 --> 
           	<view class="error-text" v-if="errorTips==1"><text class="warning-icon">!</text>{{i18n.usernameWarn}}</view>
           </view>
		   <view :class="['item',errorTips==2? 'error':'']">
		   	<!-- 密码 --> 
		   	<view class="account">
		   		<view style="padding: 5rpx;">
		   			<image style="width: 32rpx; height: 32rpx;" src="/static/images/login/vcode.png" mode="aspectFit"></image>
		   		</view>
		   		<view style="padding-left: 30rpx; width:420rpx">
		   			<u-input v-model="principal" type="number" maxlength="11" :placeholder="i18n.enterCode" />
		   		</view>
		   		<text class="input-btn" @tap="getCode" v-if="show">{{i18n.getCode}}</text>
		   		<text class="input-btn" v-if="!show">{{count}} s</text>
		   	</view>
		   	<!-- 没有输入密码提示错误 -->
		   	<view class="error-text" v-if="errorTips==2"><text class="warning-icon">!</text>{{i18n.enterPassword}}</view>
		   </view>
		   <!-- 账号密码登录 -->
		   <view class="code-login"  @click="phoneLogin=true">{{i18n.phonelogin}}</view>
			</view>
		</view>

		<!-- 忘记密码 -->
		<view class="login-form" v-if="isForgetPassword">
			<!-- <view class="form-title">{{i18n.changePassword}}</view> -->
			<view :class="['item',errorTips ? 'error':'']" v-if="!nextBtn">
				<view class="account">
					<view style="padding: 5rpx;">
						<image style="width: 32rpx; height: 32rpx;" src="/static/images/login/phone.png" mode="aspectFit"></image>
					</view>
					<view style="padding-left: 30rpx; width: 100%;">
						<u-input v-model="principal" type="number" maxlength="11" :placeholder="i18n.enterPhone" />
					</view>
					<!-- 	<input type="number" v-model="principal" placeholder-class="inp-palcehoder" :placeholder="i18n.enterPhone"
					 maxlength="11"> -->
				</view>
				<view class="error-text" v-if="errorTips==1"><text class="warning-icon">!</text>{{i18n.phoneWarn}}</view>
				<view class="error-text" v-if="!principal && errorTips==8"><text class="warning-icon">!</text>{{i18n.enterPhone}}</view>
			</view>
			<!-- 验证码 -->
			<view :class="['item',errorTips ? 'error':'']" v-if="!nextBtn">
				<view class="account">
					<view style="padding: 5rpx;">
						<image style="width: 32rpx; height: 32rpx;" src="/static/images/login/vcode.png" mode="aspectFit"></image>
					</view>
					<view style="padding-left: 30rpx; width:420rpx">
						<u-input v-model="principal" type="number" maxlength="11" :placeholder="i18n.enterCode" />
					</view>
					<!-- <text class="input-item">{{i18n.verificationCode}}</text>
					<input style="width: 370rpx;" type="text" class="int-yzm" maxlength="6" v-model="validCode" placeholder-class="inp-palcehoder"
					 :placeholder="i18n.enterCode"> -->
					<text class="input-btn" @tap="getCode" v-if="show">{{i18n.getCode}}</text>
					<text class="input-btn" v-if="!show">{{count}} s</text>
				</view>
				<view class="error-text" v-if="errorTips==3"><text class="warning-icon">!</text>{{i18n.enterCode}}</view>
				<view class="error-text" v-if="errorTips==6"><text class="warning-icon">!</text>{{i18n.enterCodeFirst}}</view>
			</view>
			<!-- 新密码 -->
			<view :class="['item',errorTips ? 'error':'']" v-if="!nextBtn">
				<view class="account">
					<!-- <text class="input-item">{{i18n.newPassword}}</text>
					<input type="password" @input="getPassInputVal" data-type="0" :value="newPassWord" placeholder-class="inp-palcehoder"
					 :placeholder="i18n.enterNew"> -->
					<view style="padding: 5rpx;">
						<image style="width: 32rpx; height: 32rpx;" src="/static/images/login/password.png" mode="aspectFit"></image>
					</view>
					<view style="padding-left: 30rpx; width: 100%;">
						<u-input v-model="credentials" :type="type" :placeholder="i18n.enterNew" :password-icon="passwordIcon" />
					</view>
				</view>

				<view class="error-text" v-if="errorTips==4"><text class="warning-icon">!</text>{{i18n.enterNew}}</view>
				<view class="error-text" v-if="errorTips==9"><text class="warning-icon">!</text>{{i18n.passwordVerification}}</view>
				<view class="error-text" v-if="errorTips==10"><text class="warning-icon">!</text>{{i18n.enterNewPasswordTips}}</view>
			</view>
			<!-- 新密码 -->
			<!-- 	<view :class="['item',errorTips ? 'error':'']" v-if="nextBtn">
				<view class="account">
					<text class="input-item">{{i18n.confirmNew}}</text>
					<input type="password" @input="getPassInputVal" data-type="1" :value="comNewPassWord" placeholder-class="inp-palcehoder"
					 :placeholder="i18n.enterNewAgain">
				</view>
				<view class="error-text" v-if="errorTips==5"><text class="warning-icon">!</text>{{i18n.enterNewAgain}}</view>
				<view class="error-text" v-if="errorTips==7 && !identical"><text class="warning-icon">!</text>{{i18n.comparedPassword}}</view>
			</view> -->
		</view>
		<view v-if="!isForgetPassword">
			<!-- 登录 回到首页 -->
			<button class="authorized-btn" @tap="login">{{i18n.login}}</button>
			<!-- <button class="to-idx-btn" @tap="toIndex">{{i18n.backHomepage}}</button> -->
			<view class="operate">
				<view style="color: #47D1D1;" :class="(i18n.registeredUsername.length>3?'to-registerEn':'to-register')" @tap="toRegitser"><text>{{i18n.registeredUsername}}</text></view>|
				<view style="color: #999999;" :class="(i18n.registeredUsername.length>3?'forgot-passwordEn':'forgot-password')"
				 @tap="forgotPassword">{{i18n.changePassword}}</view>
			</view>
			<!-- 第三方登录 -->
			<view class="fast-login">
				<u-divider>{{i18n.fastLogin}}</u-divider>
				<view @click="thirdPartyLogin">
					<image class="fast-img" src="/static/images/login/fast.png" mode=""></image>
				</view>
				<view class="facebook">{{i18n.facebook}}</view>
			</view>
		</view>

		<view v-if="isForgetPassword && !nextBtn">
			<button class="authorized-btn" @tap="nextStep">{{i18n.accomplish}}</button>
			<!-- <button class="to-idx-btn" @tap="goBack" v-if="!isPersonalCenter">{{i18n.BackLogin}}</button> -->
		</view>
		<view v-if="isForgetPassword && nextBtn">
			<button class="authorized-btn" @tap="changePassWord">{{i18n.confirmChanges}}</button>
			<button class="to-idx-btn" @tap="goBack" v-if="!isPersonalCenter">{{i18n.BackLogin}}</button>
		</view>
	</view>
</template>

<script>
	var http = require("../../utils/http");
	var util = require('../../utils/util.js');
	import {
		AppType
	} from '../../utils/constant.js'
	export default {
		data() {
			return {
				phoneLogin: true,
				type: 'password', //控制显示隐藏
				passwordIcon: true,
				mobile: '',
				principal: '',
				credentials: '',
				isForgetPassword: false, //是否修改密码
				isPersonalCenter: false, //是否从个人中心页面跳转过来
				show: true, //获取验证码按钮

				// 验证码相关
				validCode: '', //验证码
				count: '',
				timer: null,

				nextBtn: false, //修改密码下一步
				newPassWord: '', //新密码
				comNewPassWord: '', //确认新密码

				checkRegisterSmsFlag: '', // 校验验证码成功的标识
				errorTips: 0, //错误提示
				identical: Boolean, //是否一致

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
			if (options.isForgetPassword) {
				this.isForgetPassword = options.isForgetPassword
			}
			if (options.isPersonalCenter) {
				this.isPersonalCenter = options.isPersonalCenter
			}
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
				title: this.isForgetPassword ? this.i18n.changePassword : this.i18n.userLogin
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
			// 跳转第三方登录
			thirdPartyLogin(){
				uni.navigateTo({
					url:"../thirdLogin/thirdLogin"
				})
			},
			// 返回登录
			 
			/**
			 * 输入框的值
			 */
			getInputVal: function(e) {
				const type = e.currentTarget.dataset.type;
				// 手机号码
				if (type == 'account') {
					this.setData({
						principal: e.detail.value
					});
					// 判读手机号码格式是否正确
					// if (!util.checkPhoneNumber(this.principal)&&this.principal.length===11) {
					// 	this.setData({
					// 		errorTips: 1
					// 	})
					// 	return
					// }else{
					// 	this.setData({
					// 		errorTips: ''
					// 	})
					// }
					// 密码 
				} else if (type == 'password') {
					this.setData({
						credentials: e.detail.value
					});
				}
			},

			getPassInputVal: function(e) {
				var type = e.currentTarget.dataset.type
				if (type == 0) {
					this.newPassWord = e.detail.value;
					// 密码由字母加数字或符号至少两种以上字符组成6-20位半角字符，区分大小写
					var reg = new RegExp("^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z\\W]{6,20}$");
					let result = reg.test(this.newPassWord);
					if (!result) {
						this.setData({
							errorTips: 9,
						})
						return
					} else {
						this.setData({
							errorTips: 0,
						})
					}
				} else if (type == 1) {
					if (this.errorTips == 9) {
						this.setData({
							errorTips: 10,
						})
						return
					}
					this.comNewPassWord = e.detail.value
					setTimeout(() => {
						if (this.errorTips == 9 || this.errorTips == 10) {
							return
						}
						if (this.comNewPassWord && this.newPassWord && (this.comNewPassWord != this.newPassWord)) {
							this.setData({
								errorTips: 7,
								identical: false
							})
						} else if (!this.comNewPassWord) {
							this.errorTips = 5
						} else {
							this.setData({
								errorTips: 0,
								identical: true
							})
						}
					}, 1000)
				}
			},

			/**
			 * 登录
			 */
			login() {
				// #ifdef H5
				var ua = navigator.userAgent.toLowerCase();
				var data = {
					appType: ua.search(/MicroMessenger/i) > -1 ? AppType.MP : AppType.H5,
					principal: ua.search(/MicroMessenger/i) > -1 ? this.principal + ':' + util.getUrlKey('code') : this.principal,
					credentials: this.credentials,
					loginType: 0, //账号登录
				}
				// #endif
				// #ifdef APP-PLUS
				var data = {
					appType: uni.getStorageSync('appType'),
					principal: this.principal,
					credentials: this.credentials,
					loginType: 0, //账号登录
				}
				// #endif				

				if (this.principal.length == 0) {
					this.setData({
						errorTips: 1
					})
					return
				} else if (this.credentials.length == 0) {
					this.setData({
						errorTips: 2
					})
					return
				} else {
					this.setData({
						errorTips: 0
					})
					// #ifdef H5 || APP-PLUS
					var params = {
						url: "/login",
						method: "post",
						data: data,
						callBack: res => {
							http.loginSuccess(res, () => {
								uni.showToast({
									title: this.i18n.loginSuccessful,
									icon: 'none',
									complete: () => {
										this.$Router.pushTab('/pages/index/index')
									}
								})
							})

						},
					}
					http.request(params)

					// #endif

					// #ifdef MP-WEIXIN
					wx.login({
						success: (res) => {
							var params = {
								url: "/login",
								method: "post",
								data: {
									appType: 1,
									credentials: this.credentials,
									loginType: 0,
									principal: this.principal + ':' + res.code
								},
								callBack: result => {
									http.loginSuccess(result)
									this.$Router.pushTab('/pages/index/index')
								},
							}
							http.request(params)
						},
					})
					// #endif
				}
			},


			/**
			 * 修改密码（登录页修改密码按钮）
			 */
			forgotPassword() {
				this.setData({
					isForgetPassword: true,
					principal: '',
					credentials: ''
				})
			},


			/**
			 * 获取验证码
			 */
			getCode: function() {
				if (!this.principal.trim()) {
					this.errorTips = 8
					return
				}
				// 判断手机号码格式是否正确
				if (!util.checkPhoneNumber(this.principal)) {
					this.setData({
						errorTips: 1
					})
					return
				}
				var params = {
					url: "/sms/sendUpdatePwdCode",
					method: "POST",
					data: {
						mobile: this.principal,
					},
					callBack: res => {
						const timeCount = 60;
						if (!this.timer) {
							this.count = timeCount
							this.show = false;
							this.timer = setInterval(() => {
								if (this.count > 0 && this.count <= timeCount) {
									this.count--;
								} else {
									clearInterval(this.timer);
									this.timer = null
									this.show = true
								}
							}, 1000)
						}
					}
				};
				http.request(params);
			},

			/**
			 * 校验验证码
			 */
			// checkValidCode() {
			// 	if (!this.principal.trim()){
			// 		this.errorTips = 8
			// 		return
			// 	}
			// 	if (!util.checkPhoneNumber(this.principal)) {
			// 		this.setData({
			// 			errorTips: 1
			// 		})
			// 		return
			// 	}
			// 	if (!this.validCode.trim()) { // 请输入验证码
			// 		this.setData({
			// 			errorTips: 3
			// 		})
			// 		return
			// 	}
			// 	if(this.errorTips == 9 || this.errorTips == 10){
			// 		return
			// 	}
			// 	if (!this.newPassWord) {
			// 		this.setData({
			// 			errorTips: 4
			// 		})
			// 		return
			// 	}
			// 	if (!this.newPassWord.trim()) {
			// 		// uni.showToast({
			// 		// 	title: this.i18n.pwdCantBeEmpty,
			// 		// 	icon: 'none',
			// 		// })
			// 		this.setData({
			// 			errorTips: 10
			// 		})
			// 		return
			// 	}
			// 	if (!this.comNewPassWord) {
			// 		this.setData({
			// 			errorTips: 5
			// 		})
			// 		return
			// 	}
			// 	if (this.comNewPassWord && this.newPassWord && (this.comNewPassWord != this.newPassWord)) {
			// 		this.setData({
			// 			errorTips: 7,
			// 			identical: false
			// 		})
			// 		return
			// 	}

			// 	// 校验验证码
			// 	var params = {
			// 		url: "/user/checkUpdatePwdSms",
			// 		method: "put",
			// 		data: {
			// 			mobile: this.principal,
			// 			validCode: this.validCode
			// 		},
			// 		callBack: res => {
			// 			this.setData({
			// 				checkRegisterSmsFlag: res
			// 			})
			// 			this.changePassWord()
			// 		}
			// 	};
			// 	http.request(params);
			// },

			/**
			 *  修改密码（下一步）
			 */
			nextStep() {
				if (!this.principal.trim()) {
					this.errorTips = 8
					return
				}
				if (!util.checkPhoneNumber(this.principal)) {
					this.setData({
						errorTips: 1
					})
					return
				}
				if (!this.validCode.trim()) { // 请输入验证码
					this.setData({
						errorTips: 3
					})
					return
				}
				// 校验验证码
				var params = {
					url: "/user/checkUpdatePwdSms",
					method: "put",
					data: {
						mobile: this.principal,
						validCode: this.validCode
					},
					callBack: res => {
						this.setData({
							checkRegisterSmsFlag: res,
							nextBtn: !this.nextBtn
						})
					}
				};
				http.request(params);
			},

			/**
			 * 修改密码(确认按钮)
			 */
			changePassWord() {

				if (this.errorTips == 9 || this.errorTips == 10) {
					return
				}
				if (!this.newPassWord) {
					this.setData({
						errorTips: 4
					})
					return
				}
				if (!this.newPassWord.trim()) {
					// uni.showToast({
					// 	title: this.i18n.pwdCantBeEmpty,
					// 	icon: 'none',
					// })
					this.setData({
						errorTips: 10
					})
					return
				}
				if (!this.comNewPassWord) {
					this.setData({
						errorTips: 5
					})
					return
				}
				if (this.comNewPassWord && this.newPassWord && (this.comNewPassWord != this.newPassWord)) {
					this.setData({
						errorTips: 7,
						identical: false
					})
					return
				}

				var params = {
					url: "/user/updatePwd",
					method: "put",
					data: {
						appType: uni.getStorageSync('appType'), // 应用类型
						checkRegisterSmsFlag: this.checkRegisterSmsFlag, // 校验登陆注册验证码成功的标识
						mobile: this.principal,
						password: this.newPassWord,
						validCode: this.validCode,
						validateType: 1 //验证类型 1验证码验证 2 小程序encryptedData验证 3 密码验证
					},
					callBack: res => {
						uni.showToast({
							title: this.i18n.successfullyModified,
							icon: 'none',
							duration: 1500
						})
						setTimeout(() => {
							this.setData({
								isForgetPassword: false
							})

							// 请求退出登陆接口
							http.request({
								url: '/api/v1/logout',
								method: 'GET',
							})
							uni.removeStorageSync('loginResult');
							uni.removeStorageSync('token');
							uni.removeStorageSync('tempToken');
							uni.removeStorageSync('recentSearch');
							uni.removeStorageSync('hadBindUser');
							util.removeTabBadge()
							// 重置uuid、uuidSession、sessionTimeStamp、step、flowAnalysisLogDto
							uni.setStorageSync('uuid', util.getUuid())
							uni.setStorageSync('uuidSession', util.getUuid())
							uni.setStorageSync('sessionTimeStamp', new Date().getTime())
							uni.setStorageSync('step', 0)
							uni.setStorageSync('flowAnalysisLogDto', '')

							// #ifdef H5
							if (uni.getStorageSync('appType') == AppType.MP) {
								http.mpAuthLogin('/pages/accountLogin/accountLogin', true)
							} else {
								uni.redirectTo({
									url: "/pages/accountLogin/accountLogin"
								})
							}
							// #endif
							// #ifdef APP-PLUS
							uni.redirectTo({
								url: "/pages/accountLogin/accountLogin"
							})
							// #endif

						}, 1500);
					},
				};
				http.request(params);
			},

			//返回
			goBack() {
				this.setData({
					principal: '',
					errorTips: '',
					newPassWord: '',
					validCode: '',
					comNewPassWord: '',
					isForgetPassword: false,
					nextBtn: false
				})
			},

			/**
			 * 去注册
			 */
			toRegitser() {
				uni.navigateTo({
					url: "/pages/register/register"
				})
			},

			/**
			 * 回到首页
			 */
			toIndex() {
				this.$Router.pushTab('/pages/index/index')
			}

		}
	};
</script>
<style>
	@import "./accountLogin.css";
</style>
