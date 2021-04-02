<template>
	<view>
		<u-navbar title="歷史反饋" ></u-navbar> 
		<view class="feed">
			<!-- 反馈信息 -->
			<view class="feed-list" v-for="(item,index) in 3 " :key="index">
				<view class="">
					<image style="width: 72rpx; height: 72rpx;" src="../../../../packageDistribution/static/images/icon/menu-03.png" mode="aspectFit"></image>
				</view>
				<view class="feed-list-conent">
					<!-- 内容 -->
					<view class="feed-list-conent-title">
						反饋內容反饋內容反饋內容反饋內容反饋內容反饋內容反饋內容反饋內容反饋內容反饋內容…
					</view>
					<!-- 图片 -->
					<view class="feed-list-conent-img" v-if="index!=1">
						<view class="" v-for="(item,index) in 3 " :key="index">
							<image style="width: 180rpx;height: 180rpx;" src="../../../../packageMemberIntegral/static/images/icon/zhuanpan@2x.png" mode=""></image>
						</view>
					</view>
					<!-- 联系方式 -->
					<view style="font-size: 24rpx; margin-top: 30rpx;" v-if="index!=2">聯繫方式：18654683658</view>
					<view style="color: #999999; font-size: 24rpx;margin-top: 30rpx;">
						<view class="">反饋類型：測試類型</view>
						<view style="margin-top: 15rpx;">反饋時間：2020-10-09</view>
					</view>
					<view class="feed-list-conent-pingtai">平台回復：您的反饋已收到</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
.feed{
	&-list{
		display: flex;
		border-bottom: 2rpx solid #EEEEEE;
		padding: 30rpx ;
		
		&-conent{
			margin-left: 20rpx;
			&-title{
				color: #333333;
				line-height: 46rpx;
			}
			&-img{
				margin-top: 30rpx;
				display: flex;
			     justify-content: space-between;
			}
			&-pingtai{
				height: 88rpx;
				line-height: 88rpx;
				color: #496A9D;
				background-color: #F8F8F8;
				padding: 0 20rpx;
				margin-top: 20rpx;
				border-radius:15rpx;
			}
		}
	}
}
</style>
