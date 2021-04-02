<template>
	<view class="register">
		<view class="con">
			<image style="width: 150rpx; height: 150rpx;" src="/static/images/login/logo.png" @tap="toIndex" mode="aspectFit"></image>
			<!-- 第一步 -->  
			<template >
				<view class="login-form">
					<view :class="['item',errorTips==1 || MobileEmpty? 'error':'']">
						<!-- 手机号 -->    
						<view class="account">    
							<view style="padding: 5rpx;">    
								<image style="width: 32rpx; height: 32rpx;" src="/static/images/login/phone.png" mode="aspectFit"></image>
							</view>
							<view style="padding-left: 30rpx; width: 100%;">
								<u-input v-model="mobile" type="number" maxlength="11" :placeholder="i18n.redisterPhone" />
							</view>
							<!-- <text class="input-item">+86</text>
							<input type="number" v-model="mobile" data-type="account" placeholder-class="inp-palcehoder" :placeholder="i18n.enterMobileNumber"
							 maxlength="11"></input> -->
						</view>
						<view class="error-text" v-if="errorTips==1"><text class="warning-icon">!</text>{{i18n.enterValidPhone}}</view>
						<view class="error-text" v-if="MobileEmpty"><text class="warning-icon">!</text>{{i18n.enterMobileNumber}}</view>
					</view>
					<view :class="['item',errorTips==2 || errorTips==6? 'error':'']">
						<!-- 验证码 -->
						<view class="account">
					<!-- 		<input type="text" class="int-yzm" v-model="validCode" placeholder-class="inp-palcehoder" :placeholder="i18n.enterCode" maxlength="6"></input>
							<text class="input-item" @click="getCode" v-if="show">{{i18n.getCode}}</text>
							<text class="input-item getcode" v-if="!show">{{count}} s</text> -->
							<view style="padding: 5rpx;">
								<image style="width: 32rpx; height: 32rpx;" src="/static/images/login/vcode.png" mode="aspectFit"></image>
							</view>
							<view style="padding-left: 30rpx; width:420rpx">
								<u-input v-model="validCode" type="number" maxlength="6" :placeholder="i18n.enterCode" />
							</view>
							<text class="input-btn" @tap="getCode" v-if="show">{{i18n.getCode}}</text>
							<text class="input-btn" v-if="!show">{{count}} s</text>
						</view>
						<view class="error-text" v-if="errorTips==2"><text class="warning-icon">!</text>{{i18n.enterCode}}</view>
						<view class="error-text" v-if="errorTips==6"><text class="warning-icon">!</text>{{i18n.enterCodeFirst}}</view>
					</view>
					<view :class="['item',errorTips ? 'error':'']">
						<!-- 密码 -->
						<view class="account">
							<view style="padding: 5rpx;">
								<image style="width: 32rpx; height: 32rpx;" src="/static/images/login/password.png" mode="aspectFit"></image>
							</view>
							<view style="padding-left: 30rpx; width: 100%;">
								<u-input v-model="password" :type="type" :placeholder="i18n.redisterWord" :password-icon="passwordIcon" />
							</view>
							<!-- <text class="input-item">{{i18n.setPassword}}</text>
							
							<input type="password" @input="getPassInputVal" data-type="0" v-model="password" placeholder-class="inp-palcehoder"
							 :placeholder="i18n.pleaseSetPassword"></input> -->
						</view>
						<view class="error-text" v-if="errorTips==4"><text class="warning-icon">!</text>{{i18n.enterPassword}}</view>
						<view class="error-text" v-if="errorTips==9"><text class="warning-icon">!</text>{{i18n.passwordVerification}}</view>
						<view class="error-text" v-if="errorTips==10"><text class="warning-icon">!</text>{{i18n.enterNewPasswordTips}}</view>
					</view>
					<!-- <view class="to-login"><view class="to-login-text" @tap="toLogin">{{i18n.haveAnAccount}}<text>{{i18n.goToLogin}}></text></view></view> -->
				</view>
				<!-- 按钮 -->
				<view>
					<button class="authorized-btn" @tap="registerNext">{{i18n.redisterShow}}</button>
					<!-- <button class="to-idx-btn" @tap="toIndex">{{i18n.backHomepage}}</button> -->
				</view>
				<view class="xieyi">
					<!-- 用户协议 -->
					<u-checkbox-group>
						<u-checkbox size="25" v-model="checked" shape="circle"  active-color="#47D1D1"><text style="font-size: 23rpx;">{{i18n.readeConsent}}</text><text class="saml-xieyi"> {{i18n.userXieyi}}</text></u-checkbox>
					</u-checkbox-group>
				</view>
			</template>

			<!-- 第二步 -->
		<!-- 	<template v-if="registerStep==2">
				<view class="login-form">
					<view :class="['item',errorTips==3? 'error':'']"> -->
						<!-- 设置账号 -->
					<!-- 	<view class="account">
							<text class="input-item">{{i18n.setAccountNumber}}</text>
							<input type="text" @input="getPassInputVal" v-model="userName" data-type="account" placeholder-class="inp-palcehoder" :placeholder="i18n.pleaseSetAccount"></input>
						</view>
						<view class="error-text" v-if="errorTips==3"><text class="warning-icon">!</text>{{i18n.setAccountNumberTips}}</view>
					</view>
					
					<view :class="['item',errorTips==5 || errorTips==7? 'error':'']"> -->
						<!-- 确认密码 -->
					<!-- 	<view class="account">
							<text class="input-item">{{i18n.confirmNew}}</text>
							<input type="password" @input="getPassInputVal" data-type="1" v-model="confirmPwd" placeholder-class="inp-palcehoder"
							 :placeholder="i18n.enterPasswordAgain"></input>
						</view>
						<view class="error-text" v-if="errorTips==5"><text class="warning-icon">!</text>{{i18n.confirmPasswordAgain}}</view>
						<view class="error-text" v-if="errorTips==7 && !identical"><text class="warning-icon">!</text>{{i18n.ConfirmPasswordNot}}</view>
					</view>
				</view> -->
				<!-- 按钮 -->
			<!-- 	<view>
					<button class="authorized-btn" @click="registerNext">{{i18n.nextStep}}</button>
					<button class="to-idx-btn" @tap="toIndex">{{i18n.backHomepage}}</button>
				</view>
			</template> -->

			<!-- 第三步 -->
			<template v-if="registerStep==3">
				<view class="login-form">
					<view class="successful">{{i18n.registrationSuccessful}}</view>
				</view>
				<!-- 按钮 -->
				<view>
					<button class="authorized-btn" @tap="toIndex">{{i18n.backHomepage}}</button>
				</view>
			</template>

		</view>
	</view>
</template>

<script>
	var http = require("../../utils/http");
	var util = require('../../utils/util.js');

	export default {
		data() {
			return {
				checked:false,
				type: 'password', //控制显示隐藏
				passwordIcon: true,
				mobile: '',
				principal: '',
				registerStep: 1, // 注册步骤
				errorTips: 0, // 输入错误提示:  1手机号输入错误  2验证码输入错误  3账号输入错误  4密码输入错误  5验证密码输入错误
				mobile: '',
				userName: '',
				password: '',
				confirmPwd: '',
				checkRegisterSmsFlag: '', // 校验登陆注册验证码成功的标识

				// 验证码相关
				validCode: '',
				show: true,
				count: '',
				timer: null,
				identical: Boolean, // 是否一致
				MobileEmpty: false, // 手机号是否为空
			};
		},

		components: {},
		props: {},

		computed: {
			i18n() {
				return this.$t('index')
			}
		},
		
		onShow: function () {
			  //头部导航标题
			  uni.setNavigationBarTitle({
			      title:this.i18n.userRegistration
			  });
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {},

		methods: {
			// 去登录页
		
			/**
			 * 获取验证码
			 */
			getCode() {
				if (!this.mobile) {
					this.MobileEmpty = true
					this.errorTips = 0
					return
				}
				if (!util.checkPhoneNumber(this.mobile)) {
					this.MobileEmpty = false
					this.errorTips = 1
					return
				}
				this.MobileEmpty = false
				this.errorTips = 0
				// console.log('获取验证码')
				var params = {
					url: "/user/sendRegisterSms",
					method: "put",
					data: {
						mobile: this.mobile,
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



			getPassInputVal: function(e) {
				var type = e.currentTarget.dataset.type
				// console.log('type:', type)
				if(type == "account"){
					this.userName = e.detail.value
					if (!util.checkUserName(this.userName)) {
						this.errorTips = 3
						return
					}
					else{
						// this.passWord = e.detail.value;
						// 密码由字母加数字或符号至少两种以上字符组成6-20位半角字符，区分大小写
						var reg = new RegExp("^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z\\W]{6,20}$");
						let result = reg.test(this.passWord);
						if(!result){
							this.setData({
								errorTips: 9,
							})
							return
						}else{
							this.setData({
								errorTips: 0,
							})
							if (this.confirmPwd && this.passWord && (this.confirmPwd != this.passWord)) {
								this.setData({
									errorTips: 7,
									identical: false
								})
							}
						}
					}
				}
			    if(type == 0){
					this.passWord = e.detail.value;
				}
				if(type == 1){
					this.confirmPwd = e.detail.value
				}
				if (type == 0 && this.errorTips!= 3) {
					this.passWord = e.detail.value;
					// 密码由字母加数字或符号至少两种以上字符组成6-20位半角字符，区分大小写
					var reg = new RegExp("^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z\\W]{6,20}$");
					let result = reg.test(this.passWord);
					if(!result){
						this.setData({
							errorTips: 9,
						})
						return
					}else{
						this.setData({
							errorTips: 0,
						})
						if (this.confirmPwd && this.passWord && (this.confirmPwd != this.passWord)) {
							this.setData({
								errorTips: 7,
								identical: false
							})
						}
					}
				} else if (type == 1 && this.errorTips!= 3) {
					if(this.errorTips == 9){
						this.setData({
							errorTips: 10,
						})
						return
					}
					this.confirmPwd = e.detail.value
					setTimeout(() => {
						if(this.errorTips == 9 || this.errorTips == 10){
							return
						}
						if (this.confirmPwd && this.passWord && (this.confirmPwd != this.passWord)) {
							this.setData({
								errorTips: 7,
								identical: false
							})
						} else if (!this.confirmPwd) {
							this.errorTips = 5
						} else {
							this.setData({
								errorTips: 0,
								identical: true
							})
						}
					}, 1000)
				}
				console.log('passWord:', this.passWord)
				console.log('confirmPwd:', this.confirmPwd)
			},




			/**
			 * 注册-下一步按钮
			 */
			registerNext() {
				if (this.registerStep == 1) {
					// if (!util.checkPhoneNumber(this.mobile)) {
						// console.log('手机号出错')
						if (!this.mobile) {
							this.MobileEmpty = true
						} else if (!util.checkPhoneNumber(this.mobile)) {
							this.errorTips = 1
						} else if (!this.validCode.trim()) {
							console.log(this.validCode)
							this.errorTips = 2
						} else if(!this.password.trim()) {
							this.errorTips = 10
							return
						}else {
							// console.log('校验验证码')
							this.errorTips = 0
							// 校验验证码
							var params = {
								url: "/user/checkRegisterSms",
								method: "put",
								data: {
									mobile: this.mobile,
									validCode: this.validCode
								},
								callBack: res => {
									console.log(res)
									// let registerStep = this.registerStep += 1;
									// this.registerStep = registerStep;
									// 这个是token
										this.checkRegisterSmsFlag = res
									// console.log(this.registerStep)
								
								},
							};
							http.request(params);
							var loginparams = {
								url: "/user/registerOrBindUser",
								method: "put",
								data: {
									appType: 4, // 应用类型 1小程序 2微信公众号 3 PC 4 H5
									checkRegisterSmsFlag: this.checkRegisterSmsFlag, // 校验登陆注册验证码成功的标识
									mobile: this.mobile,
									userName: "19522357413",
									password: this.password,
									validateType: 1, //  验证类型 1验证码验证 2 小程序encryptedData验证 3 密码验证
									registerOrBind: 1 // 验证类型 1注册 2绑定好
								},
								callBack: res => {
									uni.hideLoading()
									let registerStep = this.registerStep
									registerStep += 1
									this.setData({
										registerStep
									})
									wx.setStorageSync('loginResult', res)
									wx.setStorageSync('token', 'bearer' + res.access_token);
								}
							};
							http.request(loginparams);
							// let registerStep = this.registerStep += 1;
							// this.registerStep = registerStep
						}
					} 
				},

				/**
				 * 去登陆
				 */
				toLogin() {
						uni.navigateTo({
							url: "/pages/accountLogin/accountLogin"
						});
					},
					/**
					 * 回到首页
					 */
					toIndex() {
						this.$Router.pushTab('/pages/index/index')
					},
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
}
</script>

<style>
	@import "./register.css";
</style>
