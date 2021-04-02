<template>
	<view>
		<!-- <u-navbar :title="i18n.thirdLogin"></u-navbar> -->
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
		<view class="account">
			<view style="padding: 5rpx;">
				<image style="width: 32rpx; height: 32rpx;" src="/static/images/login/vcode.png" mode="aspectFit"></image>
			</view>
			<view style="padding-left: 30rpx; width:420rpx">
				<u-input v-model="principal" type="number" maxlength="11" :placeholder="i18n.enterCode" />
			</view>
			
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
				   principal:'',
			}
		},
		methods: {
			
		},
		onLoad: function(options) {
			// if (options.isForgetPassword) {
			// 	this.isForgetPassword = options.isForgetPassword
			// }
			// if (options.isPersonalCenter) {
			// 	this.isPersonalCenter = options.isPersonalCenter
			// }
		},
		onShow: function() {
			//头部导航标题
			// uni.setNavigationBarTitle({
			// 	title: this.isForgetPassword ? this.i18n.changePassword : this.i18n.userLogin
			// });
		},
	}
</script>

<style>

</style>
