<template>
	<view>
		<u-navbar title="支付訂單"></u-navbar>
		<!-- 支付价格 -->
		<view class="money-box">
			<view class="money"> <text style="">HK$</text><text style="font-size: 45rpx;">1999.00</text></view>
			<view class="money-time"> 支付剩餘時間 00:29:59</view>
		</view>
		<!-- 支付方式 -->
		<view class="payMode">
			<view class="payMode-title">選擇支付方式</view>
			<u-radio-group style="width: 100%;" v-model="value" @change="radioGroupChange">
				<view class="payMode-list">
					<view class="payMode-list-left">
						<view class="">
							<image style="width: 56rpx; height: 56rpx;" src="../../../../static/images/proneler/credit-cart.png" mode=""></image>
						</view>
						<view class="cart">信用卡</view>
					</view>
					<view class="">
						<u-radio active-color="#47D1D1" :name="credit_cart.name" :disabled="credit_cart.disabled" @change="radioChange"></u-radio>
					</view>
				</view>
				<view class="payMode-list">
					<view class="payMode-list-left">
						<view class="">
							<image style="width: 56rpx; height: 56rpx;" src="../../../../static/images/proneler/alipay-cart.png" mode=""></image>
						</view>
						<view class="cart">Alipay</view>
					</view>
					<view class="">
						<u-radio active-color="#47D1D1" :name="alipay_cart.name" :disabled="alipay_cart.disabled" @change="radioChange"></u-radio>
					</view>
				</view>
				<view class="payMode-list">
					<view class="payMode-list-left">
						<view class="">
							<image style="width: 56rpx; height: 56rpx;" src="../../../../static/images/proneler/payme-cart.png" mode=""></image>
						</view>
						<view class="cart">Payme</view>
					</view>
					<view class="">
						<u-radio active-color="#47D1D1" :name="payme_cart.name" :disabled="payme_cart.disabled" @change="radioChange"></u-radio>
					</view>
				</view>
				<view class="payMode-list">
					<view class="payMode-list-left">
						<view class="">
							<image style="width: 56rpx; height: 56rpx;" src="../../../../static/images/proneler/shu-cart.png" mode=""></image>
						</view>
						<view class="cart">數轉快</view>
					</view>
					<view class="">
						<u-radio active-color="#47D1D1" :name="shu_cart.name" :disabled="shu_cart.disabled" @change="radioChange"></u-radio>
					</view>
				</view>
			</u-radio-group>
		</view>
		<view class="carePay" @click="carePay">立即支付</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				credit_cart: {
					name: '信用卡',
					disabled: false
				},
				alipay_cart: {
					name: 'Alipay',
					disabled: false
				},
				payme_cart: {
					name: 'Payme',
					disabled: false
				},
				shu_cart: {
					name: '數轉快',
					disabled: false
				},

				// u-radio-group的v-model绑定的值如果设置为某个radio的name，就会被默认选中
				value: '信用卡',
			};
		},
		methods: {
			// 选中某个单选框时，由radio时触发
			radioChange(e) {
				console.log(e);
			},
			// 选中任一radio时，由radio-group触发
			radioGroupChange(e) {
				console.log(e);
			},
			// 立即支付
			carePay(){
				uni.navigateTo({
					url:"/packageMemberIntegral/pages/buyVip/buyVip?flag=1"
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #F8F8F8;
	}

	.money-box {
		text-align: center;
		background-color: #FFFFFF;
		overflow: hidden;
padding: 30rpx;
		.money {
			color: #FA2033;
			font-size: 32rpx;
			margin-top: 50rpx;
			font-weight: blod;
		}

		.money-time {
			color: #666666;
			font-size: 28rpx;
			margin: 50rpx;
		}
	}

	// 支付方式
	.payMode {
		background-color: #FFFFFF;
		margin-top: 20rpx;
		padding: 30rpx; 
		&-title {
			font-size: 28rpx;
			color: #666666;
			height: 75rpx; 
			border-bottom: 2rpx solid #EEEEEE;
		}

		&-list {
			display: flex;
			justify-content: space-between;
			padding: 30rpx 0 30rpx 0;
            width: 100%;
			&-left {
				display: flex;
				align-items: center;

				.cart {
					margin-left: 30rpx;
					font-size: 32rpx;
					color: #333333;
				}
			}
		}
	}
	.carePay{
		width: 90%;
		margin: auto;
		text-align: center;
		color: #FFFFFF;
		font-size: 32rpx;
		background-color: #47D1D1;
		border-radius: 40rpx;
		height: 88rpx;
		line-height: 88rpx;
		margin-top: 150rpx;
		}
</style>
