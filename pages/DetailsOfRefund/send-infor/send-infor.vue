<template>
	<view>
		<u-navbar title="填寫寄回信息"></u-navbar>
		<view class="commodity">
			<view class="commodity-img">
				<image style="width: 200rpx; height: 200rpx;" src="../../../packageActivities/static/images/icon/coupon-robbed.png"
				 mode=""></image>
			</view>
			<view class="commodity-detial">
				<view class="commodity-detial-title">Innisfree/悦诗风吟红石榴水乳护肤套装女提亮修护</view>
				<view class="commodity-detial-specification">提亮，抗初老</view>
				<view class="commodity-detial-price">
					<view>
						<text style="font-size: 20rpx;">HK$</text><text>1999.00</text>
					</view>
					<view style="font-size: 24rpx; color: #999999;">x1</view>
				</view>
			</view>
		</view>
		<view class="box-flex">
			<view class="box-flex-title">物流公司</view>
			<view @click="select" class="box-flex-right"><text>請選擇</text><text>
					<u-icon style="margin-left: 10rpx;" name="arrow-right" color="#BFBFBF" size="28"></u-icon>
				</text></view>
		</view>
		<view class="box-flex">
			<view class="box-flex-title">物流单号</view>
			<view class="box-flex-right">
				<u-input v-model="odd_number" type="text" input-align="right" placeholder="請填寫訂單編號" placeholder-style="color:#BFBFBF;" />
			</view>
		</view>
		<view class="box-flex">
			<view class="box-flex-title">物流公司</view>
			<view class="box-flex-right">
				<u-input v-model="odd_number" type="text" input-align="right" placeholder="13838383388" placeholder-style="color:#BFBFBF;" />
			</view>
		</view>
		<view class="box-flex">
			<view class="box-flex-title">物流公司</view>
			<view class="box-flex-right">
				<u-input v-model="odd_number" type="text" input-align="right" placeholder="請輸入（選填）" placeholder-style="color:#BFBFBF;" />
			</view>
		</view>
		<view class="upload-img">
			<view class="upload-img-box">
				<view class="">
					 <u-icon name="camera-fill" color="#D6D6D6" size="55"></u-icon>
				</view>
				<view class="addImg">添加照片</view>
			</view>
		</view>
		<view class="submit">提交</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				odd_number: '',
				// 演示地址，请勿直接使用
				action: 'http://www.example.com/upload',
				fileList: [{
					url: 'http://pics.sc.chinaz.com/files/pic/pic9/201912/hpic1886.jpg',
				}]
			}
		},
		methods: {
			// 点击选择
               select(){
				   uni.navigateTo({
				   	url:"/pages/DetailsOfRefund/physical-company/physical-company"
				   })
			   }
		}
	}
</script>

<style scoped lang="scss">
	page {
		padding: 0 30rpx;
	}

	.commodity {
		display: flex;
		padding: 30rpx 0;

		&-detial {
			margin-left: 20rpx;

			&-title {
				color: #333333;
			}

			&-specification {
				color: #999999;
				font-size: 24rpx;
				margin-top: 10rpx;
			}

			&-price {
				margin-top: 20rpx;
				display: flex;
				justify-content: space-between;
				color: #FA2033;
				align-items: center;
			}
		}
	}

	.box-flex {
		display: flex;
		justify-content: space-between;
		border-top: 2rpx solid #EEEEEE;
		height: 100rpx;
		align-items: center;

		&-title {
			color: #111111;
			font-size: 32rpx;
		}

		&-right {
			color: #BFBFBF;
		}
	}
	.upload-img{
		height: 300rpx;
		border-top: 2rpx solid #EEEEEE;
		padding-top: 30rpx;
		&-box{
			width:160rpx;
			height: 160rpx; 
			background-color: #F8F8F8;
			display: flex;
           flex-direction: column;
		   align-items: center;
		   justify-content: center;
		   border-radius: 15rpx;
		}
		.addImg{
			margin-top: 10rpx;
			color: #BFBFBF;
			font-size: 24rpx;
		}
	}
	.submit{
		width: 95%;
		margin: auto;
		background-color: #47D1D1;
		color: #FFFFFF;
		font-size: 32rpx;
		text-align: center;
		height: 88rpx; 
		line-height: 88rpx; 
		border-radius: 50rpx; 
		margin-top: 100rpx; 
	}
</style>
