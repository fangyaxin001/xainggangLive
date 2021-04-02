<template>
	<view>
		<u-navbar title="提交成功"></u-navbar>
		<view class="suc-img">
			<image style="width: 120rpx; height: 120rpx;" src="../../static/images/icon/success.png" mode=""></image>
		</view>
		<view class="suc-title">
			提交成功
		</view>
		<view class="suc-conent">
			您的入駐申請已提交，屆時我們會在1-3個
			工作日對您提交的資料進行審核，並以短信方式把
			審核結果和後台地址給您發送到手機上，請注意查收
		</view>
		<view class="suc-name">
			請及時下載Gmall 11商家端
		</view>
		<view class="suc-er">
			<!-- <image src="" mode=""></image> -->
			<text>我是二维码，uI不给我图所以就没有</text>
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

<style>
.suc-img{
	text-align: center;
	margin-top:150rpx;
}
.suc-title{
	margin-top: 30rpx;
	text-align: center;
	color: #000000;
	font-size: 32rpx;
}
.suc-conent{
	font-size: 28rpx;
	color: #666666;
	text-align: center;
	padding: 40rpx;
	line-height: 50rpx;
}
.suc-name{
	font-size: 32rpx;
	color: #000000;
	text-align: center;
}
.suc-er{
	text-align: center;
	margin-top: 40rpx;
}
</style>
