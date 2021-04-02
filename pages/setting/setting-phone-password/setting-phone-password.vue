<template>
	<view> 
		<view  v-show="flag" >
			<u-navbar title="修改綁定手機號碼" title-width="300"></u-navbar>
					<view class="set-pass">
						<view class="">我們要對您綁定的手機號碼進行驗證：</view>
						<view class="">{{'13733996420' | conceal}}</view>
						<view class="">
							<u-message-input  type="number" :maxlength="6" :focus="true" mode="box" inactive-color="#D9D9D9" active-color="black" @change="getCode"></u-message-input>
						</view>
						<view style="color: #3B9DFF;">獲取驗證碼</view>
					</view>
					<view class="bottom-sub" @click="flag=false">下一步</view>
				</view>
				<!-- 下一步之后 -->
				<view v-show="!flag">
					<u-navbar title="綁定新手機" title-width="300"></u-navbar>
					<view class="password">
						<u-field style="height: 100rpx;"label-width="200" v-model="password" label="新密碼" placeholder="請輸入新密碼">
						</u-field>
					</view>
					<view class="newpassword">
						<u-field style="height: 100rpx;"label-width="200" 
						 v-model="passwords" label="確認新密碼" 
						  placeholder="請再次輸入新密碼">
						  <u-button class="right-set" throttle-time="200" hover-class="none" size="mini" slot="right" type="success" @click="getCode">{{codeText}}</u-button>
						</u-field>
					</view> 
					<view class="bottom-sub" @click="subimt">完成</view>
				</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:'',
				flag :true,
				password:'',
				passwords:'',
				codeText:"发送验证码",
			}
		},
		filters: {
			conceal(value) {
				let mphone = value.substring(0, 3) + '****' + value.substring(7);
				
				return mphone
			}
		},
		methods: {
			// 验证码输入的值
			getCode(e) {
				console.log(e)
			},
			subimt(){
				uni.navigateTo({
					url:"/pages/setting/setting-password/setting-password"
				})
			},
		}
	}
</script>
<style lang="scss">
	.set-pass {
		text-align: center;

		view {
			margin-top: 50rpx;
		}
	}

	.bottom-sub {
		margin: 80rpx auto;
		text-align: center;
		width: 95%;
		height: 88rpx;
		line-height: 88rpx;
		background-color: #47D1D1;
		border-radius: 40rpx;
		color: #FFFFFF;
		font-size: 32rpx;
	}
	.right-set{
		background-color: #FFFFFF;
		color: #808080;
		font-size: 30rpx;
	}
</style>
