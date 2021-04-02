<template>
	<view>
		<u-navbar title="我的足迹">
			<view class="compile" @click="compileFlag = !compileFlag"><text v-if="compileFlag">编辑</text><text v-else>完成</text></view>
		</u-navbar>
		<view class="footprint">
			<!-- 时间选择 -->
			<view class="footprint-time">
				<u-calendar v-model="timeFrontFlag" :mode="mode" @change="timeFront"></u-calendar>
				<u-calendar v-model="timeLaterFlag" :mode="mode" @change="timeLater"></u-calendar>
				<view class="footprint-time-box" @click="timeFrontFlag = true">
					<view class="">2020-05-03</view>
					<view class="">
						<u-icon name="calendar-fill" color="#7F7F7F" size="35" ></u-icon>
					</view>
				</view> 
				<view class="">至</view> 
				<view class="footprint-time-box" @click="timeLaterFlag = true"> 
					<view class="">2020-05-03</view> 
					<view class="">
						<u-icon name="calendar-fill" color="#7F7F7F" size="35"></u-icon>
					</view>
				</view>
			</view>
			<!-- 自己列表 -->
			<view class="footprint-list">
				<view class="footprint-list-data">5月30号</view>
				<view class="list-flex">
					<view class="list-conent" v-for="(item,index) in 6">
						<view class="checkend">
							<u-checkbox  v-if="compileFlag" 
								@change="checkboxChange" 
								v-model="checked"  
								shape="circle"
								active-color="#47D1D1"
							></u-checkbox>
						</view>
						<view class="">
							<image style="width: 246rpx; height: 246rpx;" src="../../packageActivities/static/images/icon/coupon-received.png" mode=""></image>
						</view>
						<view class="list-title">羽绒服男冬季保...</view>
						<view style="padding: 0 10rpx;color: #FA2033;"><text style="font-size: 20rpx;">HK$</text><text style="font-size: 32rpx;font-weight: bold;">9.80</text></view>
					</view>
				</view>
			</view>
		</view>
		<view class="checkAll" v-show="compileFlag">
			<view class="">
				<u-checkbox @click="checkedAll" shape="circle" active-color="#47D1D1" v-model="checked">全选</u-checkbox>
			</view>
			<view class="deletAll">删除</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				 
				compileFlag: true,
                  value:'',
			    checked:false,
				timeFrontFlag:false,// 选择开始时间
				timeLaterFlag:false,// 选择结束时间
				mode:"date"
			}
		},
		methods: {
			// 选中某个复选框时，由checkbox时触发
        checkboxChange(e){
			console.log(e);
		},
		// 选择开始时间
		timeFront(e){
			console.log(e) 
		},
		// 选择结束时间
		timeLater(e){
			console.log(e)
		},
		}
	}
</script>

<style lang="scss">
	.compile {
		width: 95%;
		text-align: right;
		color: #333333;
		font-size: 32rpx;
	}

	.checkAll {
		width: 100%;
		position: fixed;
		bottom: 0;
		left: 0;
		display: flex;
		justify-content: space-between;
		padding: 20rpx 30rpx;
		background-color: #F7F7F7;

		.deletAll {
			width: 200rpx;
			height: 72rpx;
			text-align: center;
			line-height: 72rpx;
			background-color: #A2A2A2;
			border-radius: 50rpx;
			color: white;
		}
	}

	.footprint {
		&-time{
			display: flex;
			align-items: center;
			width: 600rpx;
			margin-top: 30rpx;
			justify-content: space-around;
			&-box{
				display: flex;
				justify-content: space-between;
				border: 1rpx solid #BFBFBF;
				width: 245rpx;
				height: 56rpx;
				line-height: 56rpx;
				padding:0 10rpx;
				border-radius: 10rpx;
			}
		}
		&-list{
			margin-top: 20rpx;
			&-data{
				color: #666666;
				font-size: 24rpx;
				padding: 20rpx;
			}
			.list-flex{
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				.list-conent{
					position: relative;
					margin-bottom: 20rpx;
					.checkend{
						position: absolute;
						right: 0;
						z-index: 999;
					}
				}
				.list-title{
					width: 100%;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					padding: 20rpx 10rpx;
				}
			}
		}
	}
</style>
