<template>
	<view v-if="dataField.imageList.length" class="image_ad">
		<!--一行一个-->
		<view v-if="dataField.indicator === 1">
			<view v-for="(item, index) in dataField.imageList" :key="index" class="one-line" @tap.stop="adFun(item)">
				<image style="width:100vw;" mode="widthFix" :src="item.url"></image>
			</view>
		</view>
		<!--轮播海报-->
		<view v-if="dataField.indicator === 2" class="swiper-box">
			<image mode="widthFix" :src="dataField.imageList[swiperCurrent].url" style="width:100vw;opacity: 0;"></image>
			<swiper :indicator-dots="dataField.swiperOption.indicatorDots" :indicator-color="dataField.swiperOption.indicatorColor" :indicator-active-color="dataField.swiperOption.indicatorActiveColor" :autoplay="autoPlay" :interval="interval" :circular="circular" :duration="duration"
			 @change="swiperEnd">
				<block v-for="(item, index) in dataField.imageList" :key="index">
					<swiper-item>
						<image style="width:100vw;" @tap.stop="adFun(item)" :src="item.url" mode="widthFix" class="swiper-image"></image>
					</swiper-item>
				</block>
			</swiper>
		</view>
		<!--小图横向滑动-->
		<view v-if="dataField.indicator === 3">
			<scroll-view scroll-x class="ad-scroll">
				<view v-for="(item, index) in dataField.imageList" :key="index" class="ad-scroll-item">
					<image style="width:100vw;" @tap.stop="adFun(item)" :src="item.url" mode="widthFix" class="sli-image"></image>
				</view>
			</scroll-view>
		</view>

		<!--热区-->
		<view v-if="dataField.indicator === 4">
			<view v-for="(item, index) in dataField.imageList" :key="index" class="hot-area-4">
				<image style="width:100vw;" mode="widthFix" :src="item.url"></image>
				<!--wx:if="{{boxItem.link}}"-->
				<view v-for="(boxItem, boxIndex) in item.activeBoxs" :key="boxIndex" class="hot-area-one" :style="'width:' + (boxItem.width*dpr) + 'px;height:' + (boxItem.height*dpr) + 'px;transform: translateX(' + (boxItem.translateX*dpr) + 'px) translateY(' + (boxItem.translateY*dpr) + 'px);'"
				@tap.stop="adFun(boxItem)"></view>
			</view>
		</view>

	</view>
</template>

<script>
	const app = getApp();

	export default {
		data() {
			return {
				dpr: 375 / 491,
				swiperCurrent: 0
			};
		},

		components: {},
		props: {
			indicatorDots: {
				type: Boolean,
				default: true
			},
			autoPlay: {
				type: Boolean,
				default: true
			},
			circular: {
				type: Boolean,
				default: true
			},
			interval: {
				type: Number,
				default: 3000
			},
			duration: {
				type: Number,
				default: 500
			},
			dataField: {
				type: Object,
				default: () => ({
					indicator: 0,
					imageList: []
				})
			},
			shopId: {
				type: [Number, String],
				default: 0
			},
			will: {
				//需要获取的类型 默认首页
				type: String,
				default: 'home' //home 首页 ，feature 微页面  传 化名ID , goods 商品详情页，传商品ID ,ad 公共广告

			}
		},

		mounted() {
			uni.getSystemInfo({
				success: res => {
					this.setData({
						dpr: res.screenWidth / 491
					});
				}
			});
		},

		methods: {
			/**
			 * 点击事件
			 */
			adFun(item) {
				// item.type: 1商品详情; 2购物车; 3个人中心; 4自定义页面;
				if (item.type==1) {
					uni.navigateTo({
						url: '/pages/prod/prod?prodid=' + item.link
					})
					return
				}
				// 跳转自定义页面
				if(item.type==2 || item.type==3) {
					uni.switchTab({
						url: item.type == 2? '/pages/basket/basket': '/pages/user/user',
					})
					return
				}
				// 跳转自定义页面
				if(item.type==4) {
					uni.navigateTo({
						url: item.link,
					})
					return
				}
			},

			/**轮播Index*/
			swiperEnd(ev) {
				this.setData({
					swiperCurrent: ev.detail.current || 0
				});
			}

		}
	};
</script>
<style>
	@import "./image-ad.css";
</style>
