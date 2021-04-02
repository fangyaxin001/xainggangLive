<template>
	<view>
		<u-navbar title="訂單信息"></u-navbar>
		<view class="oreder">
			<view class="oreder-conent" v-for="(item,index) in 5" :key="index">
				<view class="oreder-flex">
					<view style="font-size: 34rpx;">您的訂單已發貨</view>
					<view style="font-size: 24rpx; color: #BFBFBF;">2020-11-12 13:12</view>
				</view>
				<view class="order-title">
					<view><image style="width: 140rpx; height: 140rpx;" src="../../../static/images/icon/logo.png" mode=""></image></view>
					<view  style="margin-left: 20rpx; color: #999999; font-size: 28rpx;">您的訂單[陝西特産 新鮮冬棗…]商家已 發貨，請耐心等待</view>
				</view>
				<view style="font-size: 24rpx; color: #999999;margin-top: 30rpx;">来自467327746576</view>
			</view>
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

		}
	}
</script>

<style lang="scss" scoped>
	page {
		background: #F8F8F8;
	}

	.oreder {
		padding: 10rpx 30rpx;

		&-conent {
			background-color: #FFFFFF;
			padding:30rpx 20rpx;
			margin-top: 20rpx;
			border-radius: 20rpx;
		}

		&-flex {
			display: flex;
			justify-content: space-between;
			align-items: center;
		} 
		.order-title{
			display: flex;
			align-items: center;
			background: #FAFAFA;
			margin-top: 20rpx;
		}
	
	}
</style>
