<template>
	<view>
		<u-navbar title="选择物流公司"></u-navbar>
		<u-radio-group v-model="value" @change="radioGroupChange" style="width: 100%;padding: 0 30rpx;">
			<view class="logistics-company">
				<view class="">協作快遞韵达</view>
				<view class="">
					<u-radio @change="radioChange" active-color="#47D1D1" name="協作快遞韵达"></u-radio>
				</view>
			</view>
			<view class="logistics-company">
				<view class="">順豐快遞公司</view>
				<view class="">
					<u-radio @change="radioChange" active-color="#47D1D1"></u-radio>
				</view>
			</view>
			<view class="logistics-company">
				<view class="">圓通快遞公司</view>
				<view class="">
					<u-radio @change="radioChange" active-color="#47D1D1"></u-radio>
				</view>
			</view>
			<view class="logistics-company">
				<view class="">立通快遞公司</view>
				<view class="">
					<u-radio @change="radioChange" active-color="#47D1D1"></u-radio>
				</view>
			</view>
			<view class="logistics-company">
				<view class="">中通快遞公司</view>
				<view class="">
					<u-radio @change="radioChange" active-color="#47D1D1"></u-radio>
				</view>
			</view>
			<view class="logistics-company">
				<view class="">天天快遞公司</view>
				<view class="">
					<u-radio @change="radioChange" active-color="#47D1D1"></u-radio>
				</view>
			</view>
		</u-radio-group>

	</view>
</template>

<script>
	export default {
		data() {
			return { 
				value: "協作快遞韵达",
			};
		},
		methods: {
			// 选中某个单选框时，由radio时触发
			radioChange(e) {
				// console.log(e);
			},
			// 选中任一radio时，由radio-group触发
			radioGroupChange(e) {
				// console.log(e);
			}
		}
	}
</script>

<style lang="scss">
	.logistics-company {
		width: 100%;
		display: flex;
		justify-content: space-between;
		padding: 30rpx 0;
		border-bottom: 2rpx solid #EEEEEE;
	}
</style>
