<template>
	<view>
		<u-navbar title="我的月卡"></u-navbar>
		<view class="monthCart">
			<view class="monthCart-img">
				<view class=""> </view>
				<view class="">
					<image style="width: 342rpx; height: 346rpx;" src="../../../static/images/proneler/vipright.png" mode=""></image>
				</view>
			</view>
			<!-- 无门栏劵 -->
			<view class="none-juan">
				<view class="juan-felx">
					<view style="color: #333333;font-size: 32rpx;">無門檻劵</view>
					<view style="color: #FF6464;font-size: 24rpx;">價值100港幣</view>
				</view>
				<view class="vip-img">
					<view class="vip-img-box">
						<image style="width: 186.57rpx; height: 229.92rpx;" src="../../../static/images/proneler/vip-box.png" mode=""></image>
						<view class="I-box">
							<view class="top-one">無門檻</view>
							<view class="top-two"><text style="font-size: 74rpx;">5</text><text style="font-size: 22rpx;">港幣</text></view>
							<view class="top-sty">全場通用</view>
						</view>
					</view>
					<view class="vip-img-box">
						<image style="width: 186.57rpx; height: 229.92rpx;" src="../../../static/images/proneler/vip-box.png" mode=""></image>
						<view class="I-box">
							<view class="top-one">無門檻</view>
							<view class="top-two"><text style="font-size: 74rpx;">5</text><text style="font-size: 22rpx;">港幣</text></view>
							<view class="top-sty">全場通用</view>
						</view>
					</view>
					<view class="vip-img-box">
						<image style="width: 186.57rpx; height: 229.92rpx;" src="../../../static/images/proneler/vip-box.png" mode=""></image>
						<view class="I-box">
							<view class="top-one">無門檻</view>
							<view class="top-two"><text style="font-size: 74rpx;">5</text><text style="font-size: 22rpx;">港幣</text></view>
							<view class="top-sty">全場通用</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 满减劵 -->
			<view class="none-juan" style="margin-top: 130rpx;">
				<view class="juan-felx">
					<view style="color: #333333;font-size: 32rpx;">滿減券</view>
					<view style="color: #FF6464;font-size: 24rpx;">價值100港幣</view>
				</view>
				<view class="vip-img">
					<view class="vip-img-box">
						<image style="width: 186.57rpx; height: 229.92rpx;" src="../../../static/images/proneler/vip-box.png" mode=""></image>
						<view class="I-box">
							<view class="top-one">無門檻</view>
							<view class="top-two"><text style="font-size: 74rpx;">5</text><text style="font-size: 22rpx;">港幣</text></view>
							<view class="top-sty">全場通用</view>
						</view>
					</view>
					<view class="vip-img-box">
						<image style="width: 186.57rpx; height: 229.92rpx;" src="../../../static/images/proneler/vip-box.png" mode=""></image>
						<view class="I-box">
							<view class="top-one">無門檻</view>
							<view class="top-two"><text style="font-size: 74rpx;">5</text><text style="font-size: 22rpx;">港幣</text></view>
							<view class="top-sty">全場通用</view>
						</view>
					</view>
					<view class="vip-img-box">
						<image style="width: 186.57rpx; height: 229.92rpx;" src="../../../static/images/proneler/vip-box.png" mode=""></image>
						<view class="I-box">
							<view class="top-one">無門檻</view>
							<view class="top-two"><text style="font-size: 74rpx;">5</text><text style="font-size: 22rpx;">港幣</text></view>
							<view class="top-sty">全場通用</view>
						</view>
					</view>
				</view>
			</view>
			<view class="onceBuy" v-show="!flag" @click="onceBuy">立即購買</view>
			<view class="onceBuy" v-show="flag">本月已購買</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
             flag:false
			}
		},
		methods: {
			// 跳转立即购买
           onceBuy(){
			    uni.navigateTo({
			    	url:"/packageMemberIntegral/pages/buyVip/pay-order-vip/pay-order-vip"
			    })
		   }
		},
		onLoad(option){
			console.log(option)
		   if(option.flag){
			   this.flag = true
		   }
		}
	}
</script>
<style>
	page {
	
	}
	
</style>
<style scoped lang="scss">
	.monthCart { 
		width: 100%;
		background: url(../../../static/images/proneler/vipBc.png) no-repeat center;
		background-size: cover;
		overflow: hidden; 
		&-img {
			display: flex;
			justify-content: space-between;
		}

		// 无门栏劵
		.none-juan {
			width: 95%;
			margin: auto;
			background-color: #FFFFFF;
			border-radius: 15rpx;
			height: 250rpx;
			padding: 30rpx;      

			.juan-felx {
				display: flex;
				justify-content: space-between;
			}

			.vip-img {
				display: flex;
				justify-content: space-around;
				margin-top: 30rpx;

				&-box {
					position: relative;

					.I-box {
						width: 100%;
						position: absolute;
						top: 0;
						text-align: center;
						color: #FD3E16;

						.top-one {
							font-size: 20rpx;
							margin-top: 15rpx;
						} 
						.top-sty {
							margin-top: 52rpx;
							font-size: 19rpx;
						}
					}
				}

			}
		}
		// 立即购买
		.onceBuy{
			width: 95%;
			margin: auto;
			height: 88rpx;
			text-align: center;
			line-height: 88rpx;
			background-color: #F8C33B;
			border-radius: 44rpx;
			margin-top: 150rpx;
			margin-bottom: 350rpx;
		}
	}
</style>
