<!-- 个人资料 -->
<!-- 个人资料 -->
<!-- images/personalInformation/personalInformation.wxml -->
<template>
	<view class="personal-information">
		<u-navbar title="我的資料"></u-navbar>
		<!-- 头像 -->
		<view class="portrait-box">
			<view class="head-portrait clearfix">
				<view class="head-txt">{{i18n.avatar}}</view>
				<view class="station-photo-con">
					<view class="add-img" @click="headShow = true">
						<image class="add-img-icon" :src="photoFiles?photoFiles:( pic? pic : '/static/images/icon/head04.png')" mode="widthFix"></image>
					</view>
				</view>
			</view> 
				<u-popup v-model="headShow" mode="bottom"  border-radius="14">
							<view class="head-title">修改頭像</view>
							<view @click="getUploadImg('camera')" class="head-title">拍照</view>
							<view @click="getUploadImg('album')" class="head-title">从手机相册选择</view>
							<u-gap height="20" bg-color="#F8F8F8"></u-gap>
							<view @click="headShow=false" class="cancel">取消</view>
				 </u-popup> 
			<view class="persone-info">
				<!-- ID -->
				<view class="msg-item nickname">
					<view class="msg-item-txt">ID</view>
					<view class="right-arrow">454545</view>
				</view>
				<!-- 昵称 -->
				<view class="msg-item nickname">
					<view class="msg-item-txt">{{i18n.nickname}}</view>
					<view class="right-arrow">
						<input type="text" class="choose-value" :value="nickName" @input="getNickNameInt" maxlength="50">
						<!-- <view class="choose-value">
            {{nickName}}
          </view> -->
						<!-- <image src="/static/images/icon/more.png" class="right-arrow-img"></image> -->
					</view>
				</view>
				<!-- 性别 -->
				<view class="msg-item gender">
					<!-- 性别选择 -->
					<picker class="gender-picker" @change="bindPickerChange" :value="sex" :range="genderArray">
						<view class="msg-item-txt">{{i18n.gender}}</view>
						<view class="right-arrow">
							<view class="choose-value">{{genderArray[sex]}}</view>
						</view>
					</picker>
				</view>
				<!-- 电话 -->
				<!-- <view class="msg-item phone">
        <view class="msg-item-txt">电话</view>
        <view class="phone-num" v-if="phoneNumber">
          <button class="get-phone-num" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
            授权获取手机号
          </button>
        </view>
        <view class="phone-num" v-if="!phoneNumber">{{phoneNumber}}</view>
      </view> -->
				<!-- 生日 -->
				<view class="msg-item birthday">
					<picker class="birthday-picker" mode="date" :value="date" start="" end="" @change="bindDateChange">
						<view class="msg-item-txt">生日</view>
						<view class="right-arrow">
							<view class="choose-value" v-if="date">{{date}}</view>
							<view class="choose-value" v-if="!date"></view>

						</view>
					</picker>
				</view>

			</view>

			<view class="confirm" v-if="isChange" @tap="setUserInfo">{{i18n.confirm}}</view>
		</view>
	</view>
</template>

<script module="wxs" lang="wxs" src="../../wxs/number.wxs"></script>

<script>
	//index.js
	//获取应用实例
	var http = require("../../utils/http.js");
	var config = require("../../utils/config.js");
	var util = require("../../utils/util.js");
	const app = getApp().globalData;

	export default {
		data() {
			return {
				headShow:false,
				photoFiles: '',
				// genderArray: ['男', '女'],
				// genderArray: [this.i18n.female, this.i18n.male],
				// 不能直接这样的，要读取后保存进来
				genderArray: [],
				genderIndex: 0,
				date: '2020-01-01', //用户生日
				dateIndex: 0,

				// birthDate: '',   //用户生日
				nickName: '', //用户昵称
				score: 0, //积分
				sex: 0, //性别
				phoneNumber: '', //手机号
				countryCode: '', //区号
				pic: '',
				isChange: false, // 是否修改用户信息
			};
		},

		components: {},
		props: {},

		computed: {
			i18n() {
				return this.$t('index')
			}
		},

		onLoad: function() {
			//加载会员信息
			this.genderArray.push(this.i18n.female)
			this.genderArray.push(this.i18n.male)
			this.queryUserInfo()
		},
		onShow: function() {
			//头部导航标题
			// uni.setNavigationBarTitle({
			//     title:this.i18n.personalData
			// });
		},
		methods: {
			/**
			 * 上传图片
			 */
			getUploadImg: function(e) {
				var source = []
				if(e == "album"){
					source.push("album")
				}else{
				   source.push("camera")
				}
				uni.chooseImage({
					count: 1, // 默认9
					sizeType: ['compressed'],
					sourceType: source,
					type: 'image',
					extension: ['.png', '.jpg', '.jpeg', '.webp'],
					success: (res) => {

						let resType = res.tempFiles[0].type.substring(0, 5)
						if (resType != 'image' || res.tempFiles[0].type.substring(6, 7) == 'g') {

							uni.showToast({
								title: this.i18n.imageTypeRestrictions,
								icon: 'none',
								duration: 2000,
								mask: true
							});
							return
						}
						var tempFilePaths = res.tempFilePaths;
						uni.showLoading({
							mask: true
						})
						var params = {
							url: "/api/v1/file/upload",
							filePath: tempFilePaths[0],
							name: 'file',
							callBack: (res2) => {
								uni.hideLoading();
								this.photoFiles = JSON.parse(res2).resourcesUrl + JSON.parse(res2).filePath,
									this._photoFiles = JSON.parse(res2).filePath
								this.isChange = true
							},
						};
						http.upload(params);
					},
					fail: (failMsg) => {
						console.log(failMsg)
					}
				})
			},


			// 获取用户信息
			queryUserInfo: function() {
				uni.showLoading();
				var params = {
					url: "/api/v1/user/userInfo",
					method: "GET",
					data: {},
					callBack: (res) => {
						uni.hideLoading();
						// var date = this.data.date
						// var phoneNumber = this.data.phoneNumber
						this.date = res.birthDate, //用户生日
							this.nickName = res.nickName, //用户昵称
							this.score = res.score, //积分
							this.sex = Number(res.sex), //性别
							this.phoneNumber = res.userMobile, //用户手机号
							this.pic = res.pic
						console.log('sex:', this.sex)
						if (!res.birthDate) {
							// 获取当前日期并改变日期展示格式
							var curDate = new Date();
							var seperator1 = "-";
							var month = curDate.getMonth() + 1 < 10 ? "0" + (curDate.getMonth() + 1) : curDate.getMonth() + 1; //截取月份
							var strDate = curDate.getDate() < 10 ? "0" + curDate.getDate() : curDate.getDate(); //截取日期
							this.date = curDate.getFullYear() + seperator1 + month + seperator1 + strDate //将年月日用'-'拼接起来
							console.log(this.date)
						}
					}
				};
				http.request(params);
			},

			//用户昵称
			getNickNameInt: function(e) {
				this.nickName = e.detail.value
				this.isChange = true
			},

			// 选择性别
			bindPickerChange: function(e) {
				this.sex = e.detail.value
				this.isChange = true
			},

			// 选择日期
			bindDateChange: function(e) {
				this.date = e.detail.value
				this.isChange = true
			},


			/**
			 * 设置用户信息
			 */
			setUserInfo: function() {
				if (!this.nickName.trim()) {
					uni.showToast({
						title: this.i18n.nicknameEmptyTips,
						icon: 'none',
					})
					return
				}
				if (this.isChange) {
					uni.showLoading();
					var params = {
						url: "/api/v1/user/setUserInfo",
						method: "PUT",
						data: {
							avatarUrl: this.photoFiles,
							birthDate: this.date,
							sex: this.sex,
							nickName: this.nickName
						},
						callBack: (res) => {
							uni.hideLoading();
							uni.showToast({
								title: this.i18n.successfullyModified,
								icon: 'none',
								duration: 1000
							})
							setTimeout(() => {
								this.queryUserInfo()
								// uni.switchTab({
								//   url: '/pages/user/user'
								// })
								this.$Router.pushTab('/pages/user/user')
							}, 1000)
						}
					};
					http.request(params);
				}
			},



		},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {

		},
		onPullDownRefresh: function() {

		},
		onShareAppMessage: function(e) {
			return {

			};
		},
	};
</script>
<style>
	@import "./personalInformation.css";
</style>
