<template>
	<view>
		<u-navbar title="修改密碼"></u-navbar>
		<view class="password">
			<u-field style="height: 100rpx;" label-width="200" icon="lock" :icon-style="iconStyle" v-model="password" label="旧密码" placeholder="請輸入舊密碼">
			</u-field>
		</view>
		<view class="newpassword">
			<u-field style="height: 100rpx;" label-width="200" icon="lock" :icon-style="iconStyle" v-model="password" label="新密碼" placeholder="請輸入新密碼">
			</u-field>
		</view>
		<view class="newpasswords">
			<u-field style="height: 100rpx;" label-width="200" icon="lock" :icon-style="iconStyle" v-model="password" label="確認新密碼"
			 placeholder="請再次輸入新密碼">
			</u-field>
		</view>
		<view class="bottom-sub">提交</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				iconStyle: {
                 marginRight:"10rpx"
				},
				password:'',//旧密码
				newpassword:'',//新密码
				newpasswords:'',//确认新密码
			};
		}
	}
</script>	

<style lang="scss">
	
	.password {
		width: 100%;

	}
	.bottom-sub{ 
       margin: 120rpx auto; 
		text-align: center;
		width: 95%;
		height: 88rpx;
		line-height: 88rpx;
		background-color: #47D1D1;
		border-radius: 40rpx;
		color: #FFFFFF;
		font-size: 32rpx;
	}
</style>
