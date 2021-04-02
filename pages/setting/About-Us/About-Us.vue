<template>
	<view>
		<u-navbar title="關於我們"></u-navbar>
		<view class="img">
			<image style="width: 150rpx; height: 150rpx;" src="../../../static/images/proneler/about-logo.png" mode=""></image>
		</view>
		<view class="send-banben">当前版本1.0</view>
		<view class="fiexd-title">
			<view >copyright©2018-2019 某某APP</view>
			<view style="margin-top: 10rpx;">All Ringhts Reserved</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss" scoped>
	.img {
		text-align: center;
		margin-top: 120rpx;
	}

	.send-banben {
		text-align: center;
		margin-top: 30rpx;
	}
	.fiexd-title{
		width: 100%;
		position: fixed;
		bottom:  100rpx;
		text-align: center;
		color: #BFBFBF;
		}
</style>
