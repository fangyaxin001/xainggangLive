<template>
	<view>
		<u-navbar title="平台消息"></u-navbar>
		<view class="platform" v-for="(item,index) in 4" :key="index" @click="platformDetial">
			<view class="platform-time">2020-11-03 12:33</view>
			<view class="platform-conent">
				<view v-show="index!=3" class=""><image style="width: 686rpx;height: 320rpx;" src="../../../static/images/icon/unionpay.png" mode="aspectFit"></image></view>
				<view class="platform-conent-title">
					<view style="font-size: 32rpx; color: #333333;padding:20rpx 30rpx;"> 雙旦禮遇 </view>
					<view style="color: #666666; font-size: 28rpx; padding: 0rpx 30rpx 30rpx 30rpx;"> 喜迎聖誕元旦雙旦節，豪禮送不停~ </view>
				</view>
			</view>
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
			// 详情页面
			platformDetial(){
				 uni.navigateTo({
				 	url:"/pages/my-message/my-message-platform/my-message-detial"
				 })
			},
		}
	}
</script>

<style lang="scss">
	page{
		background: #F8F8F8;
		}
	.platform {
		padding: 30rpx;

		&-time {
			text-align: center;
			font-size: 24rpx;
			color: #999999;
		}
		&-conent{ 
			margin-top: 20rpx; 
			&-title{
				background-color: #FFFFFF;
				border-bottom-right-radius: 15rpx;
				border-bottom-left-radius: 15rpx;
				}
		}
	}
</style>
