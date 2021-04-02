<template>
	<view>
		<u-navbar title="修改密碼"></u-navbar>
		<view class="lang" @click="setChangePhone">
			<view class="">舊密碼驗證修改</view>
			<view class=""><u-icon name="arrow-right" color="#999999" size="30"></u-icon></view>
		</view>
		<view class="lang" @click="setChangeCode">
			<view class="">手機號碼驗證修改</view>
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
			// 旧密码修改密码
			setChangePhone(){
				uni.navigateTo({
					url:"/pages/setting/setting-password/change-old-password/change-old-password"
				})
			},
			// 验证码修改密码
			setChangeCode(){
				uni.navigateTo({
					url:"/pages/setting/setting-password/change-phone-password/change-phone-password"
				})
			},
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
