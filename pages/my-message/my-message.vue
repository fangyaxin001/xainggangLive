<template>
	<view>
		 	<u-navbar title="我的消息"></u-navbar>
			<view class="message-content" @click="goPlatform">
				<view class="">
					<image style="width: 90rpx; height: 90rpx;" src="../../static/images/proneler/pingtai-message.png" mode=""></image>
				</view>
				<view style="margin-left: 20rpx;" >
					<view style="color: #333333; font-size: 28rpx;">平台公告</view>
					<view class="detials" style="color: #999999; font-size: 24rpx;padding: 10rpx 0 ;">双12大放价!</view>	
				</view>
			</view>
			<view class="message-content" @click="goOrderList">
				<view class="">
					<image style="width: 90rpx; height: 90rpx;" src="../../static/images/proneler/order-message.png" mode=""></image>
				</view>
				<view style="margin-left: 20rpx;">
					<view style="color: #333333; font-size: 28rpx;">訂單消息</view>
					<view class="detials" style="color: #999999; font-size: 24rpx;padding: 10rpx 0 ;">您的订单 [马克公主情侣睡衣女秋冬…] 商家已发货…</view>	
				</view>
			</view>
			<u-gap height="20" bg-color="#F8F8F8"></u-gap>
			<view class="message-content" @click="goChat">
				<view class="">
					<image style="width: 90rpx; height: 90rpx;" src="../../static/images/proneler/kefu.png" mode=""></image>
				</view>
				<view style="margin-left: 20rpx;">
					<view style="color: #333333; font-size: 28rpx;">平台客服</view>
					<view class="detials" style="color: #999999; font-size: 24rpx;padding: 10rpx 0 ;">好的，亲</view>	
				</view>
			</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			// 跳转到平台公告
			goPlatform(){
				console.log(11)
				 uni.navigateTo({
				 	url:'/pages/my-message/my-message-platform/my-message-platform'
				 })
			},
			//跳转到订单消息
			goOrderList(){
				uni.navigateTo({
					url:'/pages/my-message/my-message-oreder/my-message-oreder'
				})
			},
			//跳转客服
			goChat(){
				uni.navigateTo({
					url:'/pages/chat/chatIm'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	page{
	 background-color: #F8F8F8;	
	}
.message-content{
	display: flex;
	padding: 20rpx;
	background-color: #FFFFFF;
	border-bottom: 2rpx solid #EEEEEE;
	.detials{
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}
</style>
