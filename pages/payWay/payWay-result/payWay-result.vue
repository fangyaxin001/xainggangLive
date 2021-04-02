<template>
	<view>
		<u-navbar title="支付结果" title-color="#000000"></u-navbar>
		<view class="">
			<view class="pay-img">
				<image style="width: 120rpx; height: 120rpx;" src="../../../static/images/proneler/pay-success.png" mode=""></image>
			</view>
			<view class="pay-suc">支付成功</view>
			<view class="pay-order" @click="lookOrder">查看訂單</view>
			<view class="pay-home" @click="goHome">返回首頁</view>
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
			// 返回首页
			goHome(){
				uni.switchTab({
					url:"/pages/index/index"
				}) 
			},
			// 跳到订单页面
			lookOrder(){
				uni.navigateTo({
					url:"/pages/orderList/orderList"
				})
			}
		}
	}
</script>

<style>
.pay-img{
	margin-top: 180rpx;
	text-align: center;
}
.pay-suc{
	text-align: center;
}
.pay-order{
	width: 320rpx;
	height: 72rpx;
	margin: auto;
	background-color: #47D1D1;
	border-radius: 50rpx;
	color: white;
	text-align: center;
	line-height: 72rpx;
	margin-top: 300rpx;
}
.pay-home{
	width: 320rpx;
	height: 72rpx;
	margin: auto;
	border: 1rpx solid #47D1D1;
	border-radius: 50rpx;
	text-align: center;
	line-height: 72rpx;
	color: #47D1D1;
	margin-top: 30rpx;
}

</style>
