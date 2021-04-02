<template>
	<view class="snap-up">
		<view class="snap-up-head">
			<text class="snap-up-tit">{{dataField.activityType==1?'团购':'秒杀'}}</text>
			<view class="more-goods" @tap="toActiveList">
				<text class="more-goods-txt">更多{{dataField.activityType==1?'团购':'秒杀'}}</text>
				<view class="more-icon">
					<image src="/static/images/icon/more.png"></image>
				</view>
			</view>
		</view>

		<!-- 列表 -->
		<view class="snap-up-goods-show">
			<!-- 商品盒子 -->
			<view class="snap-up-goods-box" v-for="(item, index) in goodsList" :key="index" @tap="toActiveDetails(item)">
				<view class="img-box">
					<image :src="item.pic"></image>
					<!-- 拼团人数 -->
					<!-- <view class="group-number" v-if="item.prodType==3 ">
						
					</view> -->
				</view>
				<view class="snap-up-price">
					<text class="symbol">￥</text>
					{{wxs.toPrice(item.price)}}
					</view>
				<view class="original-price">
					<text class="symbol">￥</text>
					{{wxs.toPrice(item.oriPrice)}}
				</view>
			</view>
			<!-- 查看更多 -->
			<view class="view-more" @tap="toActiveList" v-if="goodsList.length > 3">{{'查看更多'}}
				<image class="view-more-icon" src="/static/images/icon/more-icon.png"></image>
			</view>
		</view>
	</view>
</template>

<script module="wxs" lang="wxs" src="../../../../wxs/number.wxs"></script>
<script>
	import http from '../../../../utils/http.js'
	export default {
		data() {
			return {
				goodsList: [],
				show: false
			};
		},
		components: {
		
		},
		mounted() {
			this.getGoodsList()
		},
		props: {
			dataField: {
				type: Object,
				default: () => ({})
			},
			shopId: {
				type: [Number, String],
				default: 0
			},
			will: {
				//需要获取的类型 默认首页
				type: String,
				default: 'home' //home 首页 ，feature 微页面  传 化名ID , goods 商品详情页，传商品ID ,ad 公共广告
			},
		},
		methods:{
			/**
			 * 跳转活动商品
			 */
			toActiveDetails(item) {
				if (item.prodType==1) {
					uni.navigateTo({
						url: '/pages/prod/prod?prodid=' + item.prodId
					})
					return
				}
				uni.navigateTo({
					url: '/packageActivities/pages/snapUpDetail/snapUpDetail?seckillId=' + item.activityId
				})
			},
			/**
			 * 跳转活动列表
			 */
			toActiveList() {
				//activityType: 1团购  2秒杀
				uni.navigateTo({
					url: this.dataField.activityType == 1? '/packageActivities/pages/aBulkList/aBulkList' : '/packageActivities/pages/snapUpList/snapUpList'
				})
			},
			/**
			 * 获取活动商品列表
			 */
			getGoodsList() {
				if (this.dataField.prodIds.length){
					http.request({
						url: '/prod/listProdByIdsAndType',
						method: 'GET',
						data: {
							prodIds: this.dataField.prodIds.toString(),
							prodType: this.dataField.activityType
						},
						callBack: res => {
							this.goodsList = res
						}
					})
				}
			},
		}
	}
</script>

<style>
	@import url("./promotional-activities.css");
</style>
