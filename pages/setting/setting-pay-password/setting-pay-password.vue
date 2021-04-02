<template>
	<view>
		<u-navbar title="修改支付密碼"></u-navbar>
		<view class="lang" @click="setOldpay">
			<view class="">鬮支付密碼驗證</view>
			<view class=""><u-icon name="arrow-right" color="#999999" size="30"></u-icon></view>
		</view>
		<view class="lang" @click="setCodepay">
			<view class="">手機號驗證修改</view>
			<view class=""><u-icon name="arrow-right" color="#999999" size="30"></u-icon></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		methods:{
			// 跳转到旧密码修改
			setOldpay(){
				 uni.navigateTo({
				 	url:"/pages/setting/setting-pay-password/changePay-password/changePay-password"
				 })
			},
			// 跳转到手机号验证码修改
			setCodepay(){
				uni.navigateTo({
					url:"/pages/setting/setting-pay-password/changePay-codePassword/changePay-codePassword"
				})
			}
		}
	}
</script>

<style lang="scss">
page{
		background-color: #F6F6F6;
	}
.lang{
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 120rpx;
	border-bottom: 2rpx solid #EEEEEE;
	padding: 20rpx;
	background-color: #FFFFFF;
	
}
</style>

