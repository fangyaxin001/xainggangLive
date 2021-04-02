<template>
	<view>
		<u-navbar title="申請做商家"></u-navbar>
		<view class="text-box">
			<view class="">負責人</view>
			<view class="">
				<u-input v-model="principal" type="text" input-align="right" placeholder="請輸入姓名" :clearable="false" maxlength="7" />
			</view>
		</view>
		<view class="text-box">
			<view class="">身份證號碼</view>
			<view class="">
				<u-input v-model="IDnum" type="number" input-align="right" placeholder="請輸入身份證號碼" :clearable="false" maxlength="18" />
			</view>
		</view>
		<view class="text-box">
			<view class="">聯繫方式</view>
			<view class="">
				<u-input v-model="contact_way " type="text" input-align="right" placeholder="請輸入手機號碼" :clearable="false" maxlength="7" />
			</view>
		</view>
		<view class="text-box">
			<view class="">請選擇入駐類型 <text style="display: inline-block;margin-left: 15rpx;">
					<u-icon name="arrow-down" color="#CCCCCC" size="28"></u-icon>
				</text></view>
			<view @click="goExplain" class="">
				<u-icon name="question-circle" color="#5A5A68" size="32"></u-icon>
			</view>
		</view>
		<view class="city-box">
			<view class="">所在地址</view>
			<view class="elect">
				<u-dropdown ref="uDropdown" title-size="25" height="60" :border-bottom="true">
					<u-dropdown-item title="河南省">
						<view class="slot-content" style="background-color: #FFFFFF;">
							<scroll-view scroll-y="true" style="height: 600rpx;">
								<view class="u-text-center u-content-color u-m-t-20 u-m-b-20" style="border-bottom: 2rpx solid #EEEEEE;padding-bottom: 10rpx;">河南省</view>
								<view class="u-text-center u-content-color u-m-t-20 u-m-b-20">河北省</view>
							</scroll-view>
						</view>
					</u-dropdown-item>
				</u-dropdown>
			</view>
			<view class="elect">
				<u-dropdown ref="uDropdown" title-size="25" height="60" :border-bottom="true">
					<u-dropdown-item title="郑州市">
						<view class="slot-content" style="background-color: #FFFFFF;">
							<scroll-view scroll-y="true" style="height: 600rpx;">
								<view class="u-text-center u-content-color u-m-t-20 u-m-b-20" style="border-bottom: 2rpx solid #EEEEEE; padding-bottom: 10rpx;">郑州市</view>
								<view class="u-text-center u-content-color u-m-t-20 u-m-b-20">叫做市</view>
							</scroll-view>

						</view>
					</u-dropdown-item>
				</u-dropdown>
			</view>
			<view class="">

			</view>
		</view>
		<view class="textarea-box">
			<view class="">詳細地址</view>
			<view class="">
				<u-input v-model="principal" type="textarea" placeholder="請輸入詳細地址" :clearable="false" maxlength="7" />
			</view>
		</view>
		<view class="nexttTo" @click="nexttTo">下一步</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				principal: '', //负责人
				IDnum: '', //身份证号码
				contact_way: '', //联系方式
			}
		},
		methods: {
			// 获取选中的值
			closeDropdown() {
				this.$refs.uDropdown.close();
			},
			// 商家类型说明
			goExplain() {
				uni.navigateTo({
					url: "/pages/apply-merchant/explain/explain"
				})
			},
			// 下一步
			nexttTo() {
				uni.navigateTo({
					url: "/pages/sunmit-succeed/sunmit-succeed"
				})
			}
		}
	}
</script>

<style>
	.text-box {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 30rpx;
		border-bottom: 2rpx solid #EEEEEE;
		height: 120rpx;
	}

	.city-box {
		display: flex;
		padding: 20rpx 30rpx;
		border-bottom: 2rpx solid #EEEEEE;
		align-items: center;
	}

	.textarea-box {
		padding: 20rpx 30rpx;
		border-bottom: 2rpx solid #EEEEEE;
	}

	.elect {
		margin-left: 30rpx;
		border: 1rpx solid #EEEEEE;
		width: 180rpx;
	}

	.nexttTo {
		width: 95%;
		margin: auto;
		background-color: #47D1D1;
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		color: #FFFFFF;
		font-size: 32rpx;
		border-radius: 50rpx;
		margin-top: 300rpx;
	}
</style>
