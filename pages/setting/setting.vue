<template>
	<view>
		<u-navbar title="设置"></u-navbar>
		<view class="lang" @click="goPassword">
			<view class="">修改密碼</view>
			<view class="">
				<u-icon name="arrow-right" color="#999999" size="30"></u-icon>
			</view>
		</view>
		<view class="lang" @click="goPayPassword">
			<view class="">修改支付密碼</view>
			<view class="">
				<u-icon name="arrow-right" color="#999999" size="30"></u-icon>
			</view>
		</view>
		<view class="lang" @click="setBangingPhone">
			<view class="">修改綁定手機號碼</view>
			<view class="">
				<u-icon name="arrow-right" color="#999999" size="30"></u-icon>
			</view>
		</view>
		<view class="lang" @click="goFeedback">
			<view class="">意見提交</view>
			<view class="">
				<u-icon name="arrow-right" color="#999999" size="30"></u-icon>
			</view>
		</view>
		<view class="lang" @click="aboutUs">
			<view class="">關於我們</view>
			<view class="">
				<u-icon name="arrow-right" color="#999999" size="30"></u-icon>
			</view>
		</view>
		<u-gap height="20" bg-color="#F6F6F6"></u-gap>
		<view class="lang" @click="cacheFlag=true">
			<view class="">清除緩存</view>
			<view class=""><text>3.54M</text>
				<u-icon name="arrow-right" color="#999999" size="30"></u-icon>
			</view>
		</view>
		<view class="lang" @click="examineUpdate">
			<view class="" >檢查更新</view>
			<view class=""><text>1.0.3</text>
				<u-icon name="arrow-right" color="#999999" size="30"></u-icon>
			</view>
		</view>
		<view class="langbot" @click="quitFlag=true">
			退出登录
		</view>
		<!-- 消息提示组件 -->
		<u-toast ref="uToast" />
		<!-- 模态框组件 -->
		<u-modal v-model="cacheFlag" content="確定清楚本地緩存嗎？" :show-cancel-button="true" @confirm="confirm" @cancel="cancel"></u-modal>
		<u-modal v-model="quitFlag" content="確定退出當前賬號嗎？"  :show-cancel-button="true"></u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cacheFlag: false, //是否打开缓存\
				quitFlag:false,//是否退出登录
			};
		},
		methods: {
			// 去修改密码
			goPassword() {
				uni.navigateTo({
					url: "/pages/setting/setting-password/setting-password"
				})
			},
			// 去修改支付密码
			goPayPassword() {
				uni.navigateTo({
					url: "/pages/setting/setting-pay-password/setting-pay-password"
				})
			},
			// 修改绑定手机号
			setBangingPhone() {
				uni.navigateTo({
					url: "/pages/setting/setting-phone-password/setting-phone-password"
				})
			},
			// 提交反馈
			goFeedback() {
				uni.navigateTo({
					url: "/pages/setting/feedback/feedback"
				})
			},
			// 关于我们
			aboutUs() {
				uni.navigateTo({
					url: "/pages/setting/About-Us/About-Us"
				})
			},
			// 清除缓存我点了确定
			confirm() {
				console.log("我点击了确定")
			},
			// 清除缓存我点了取消
			cancel() {
				console.log("我点击了取消")
			},
			// 检查更新
			examineUpdate(){
				this.$refs.uToast.show({
									title: '已是最新版本～',
									type: 'default',
									position:'bottom'
								})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F6F6F6;
	}

	.lang {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 120rpx;
		border-bottom: 2rpx solid #EEEEEE;
		padding: 20rpx;
		background-color: #FFFFFF;

	}

	.langbot {
		position: fixed;
		bottom: 0;
		height: 100rpx;
		line-height: 100rpx;
		width: 100%;
		text-align: center;
		background-color: #FFFFFF;
		font-size: 32rpx;
		color: #999999;
	}
</style>
