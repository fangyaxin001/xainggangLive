<template>
	<view>
		<u-navbar title=""></u-navbar>
		<!-- 第一阶段 -->
		<view class="pay" v-show="showIndex==0">
			<view class="pay-setps">
				<view class="c1">1</view>
				<view class="h2"></view>
				<view class="c2">2</view>
				<view class="h2"></view>
				<view class="c2">3</view>
			</view>
			<view class="pay-set-password">修改支付密碼</view>
			<view style="color: #333333; font-size: 24rpx;">請輸入支付密碼</view>
			<view style="margin: 30rpx;">
				<u-message-input type="number" :maxlength="6" :focus="true" mode="box" inactive-color="#D9D9D9" active-color="black" @change="getCode"></u-message-input>
			</view>
			<view class="pay-botTitle">
				支付密碼爲6位數字，用戶提現、設置密保、添加銀行 卡等操作，可保障資金安全
			</view>
		</view>
		<!-- 第二阶段 -->
		<view class="pay" v-show="showIndex == 1">
			<view class="pay-setps">
				<view class="c1">1</view>
				<view class="h1"></view>
				<view class="c1">2</view>
				<view class="h2"></view>
				<view class="c2">3</view>
			</view>
			<view class="pay-set-password">修改支付密碼</view>
			<view style="color: #333333; font-size: 24rpx;">請輸入支付密碼</view>
			<view style="margin: 30rpx;">
				<u-message-input type="number" :maxlength="6" :focus="true" mode="box" inactive-color="#D9D9D9" active-color="black" @change="getCode"></u-message-input>
			</view>
			<view class="pay-botTitle">
				支付密碼爲6位數字，用戶提現、設置密保、添加銀行 卡等操作，可保障資金安全
			</view>
		</view>
		<!-- 第三阶段 -->
		<view class="pay" v-show="showIndex==2">
			<view class="pay-setps">
				<view class="c1">1</view>
				<view class="h1"></view>
				<view class="c1">2</view>
				<view class="h1"></view>
				<view class="c1">3</view>
			</view>
			<view class="pay-set-password">修改支付密碼</view>
			<view style="color: #333333; font-size: 24rpx;">請輸入支付密碼</view>
			<view style="margin: 30rpx;">
				<u-message-input type="number" :maxlength="6" :focus="true" mode="box" inactive-color="#D9D9D9" active-color="black" @change="getCode"></u-message-input>
			</view>
			<view class="pay-botTitle">
				支付密碼爲6位數字，用戶提現、設置密保、添加銀行 卡等操作，可保障資金安全
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				showIndex:0
			}
		},
		methods: {
			// 获取验证码
			getCode() {

			}
		}

	}
</script>

<style lang="scss">
	.pay {
		text-align: center;

		&-setps {
			margin-top: 150rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		&-set-password {
			margin: 50rpx;
			font-size: 36rpx;
			color: #333333;
		}

		&-botTitle {
			width: 75%;
			margin: auto;
			text-align: center;
			color: #999999;
			line-height: 40rpx;
			font-size: 24rpx;
		
		}
		.c1{
			width: 60rpx;
			height:60rpx;
			line-height: 60rpx;
			color: #FFFFFF;
			text-align: center;
			background-color: #47D1D1;
			border-radius: 50%;
		}
		.h1{
			height: 5rpx;
			width: 100rpx;
			background-color: #47D1D1;
		}
		.c2{
			width: 60rpx;
			height:60rpx;
			line-height: 60rpx;
			color: #FFFFFF;
			text-align: center;
			background-color: #BFBFBF;
			border-radius: 50%;
		}
		.h2{
			height: 5rpx;
			width: 100rpx;
			background-color: #BFBFBF;
		}

	}
</style>
