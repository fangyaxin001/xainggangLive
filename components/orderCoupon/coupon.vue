<template>
	<view :class="'coupon-item ' + (canUse?'':'gray')">
		<view class="left"> 
			<view class="num" v-if="item.couponType == 1 || item.couponType == 3">￥<text class="coupon-price">{{item.reduceAmount}}</text>
			</view>
			<view class="num" v-if="item.couponType == 2">
				<text class="coupon-price">{{item.couponDiscount}}</text>{{i18n.discount}}</view>
			<view class="coupon-condition">{{i18n.available}}{{item.cashCondition}}{{i18n.availableUse}}</view>
		</view>
		<view class="right">
			<view class="c-des">
				<text class="c-type">{{item.suitableProdType==0?i18n.universal:i18n.commodity}}</text>{{item.suitableProdType==0?i18n.allUniversal:i18n.specifiedItems}}</view>
			<view class="c-date" v-if="item && update">
				<view v-if="showTimeType==1 && item.validTimeType==2" class="c-data-info">{{i18n.getCoupons + ' '}}{{item.validDays}}{{i18n.invalid}}</view>
				<view v-else class="c-data-info">{{item.startTime}}~{{item.endTime}}</view>
				<view class="c-btn" v-if="item.canReceive && !order" @tap="receiveCoupon">{{i18n.getIt}}</view>
				<view class="c-btn get-btn" v-if="!item.canReceive && !order" @tap="useCoupon">{{i18n.useItNow}}</view>
				<view class="no-use-btn" v-if="item.canUse==false && !order" @tap="receiveCoupon">{{i18n.getIt}}</view>
			</view>
			<view v-if="order && canUse" class="sel-btn">
				<checkbox color="#EF103C" :data-couponid="item.couponId" :checked="item.choose" @tap="checkCoupon"></checkbox>
			</view>
		</view>
		<!-- 我的优惠券状态(优惠券状态 0:失效 1:有效 2:使用过) -->
		<!-- 已使用 -->
		<image class="tag-img" src="/static/images/icon/coupon-used.png" v-if="type==2 && myCoupon"></image>
		<!-- 已过期 -->
		<image class="tag-img" src="/static/images/icon/coupon-ot.png" v-if="type==0 && myCoupon"></image>
	</view>
</template>


<script>
	var http = require("../../utils/http.js");
	var util = require("../../utils/util.js");

	export default {
		data() {
			return {
				stsType: 4,
				update: true, // 组件内部数据改变不触发视图重绘,这个用来手动重绘
			};
		},

		components: {},
		props: {
			item: Object,
			// couponItem: Object,
			type: Number,
			order: Boolean,
			canUse: Boolean,
			index: Number,
			showTimeType: Number,
			myCoupon: Boolean
		},

		computed: {
			i18n() {
				return this.$t('index')
			}
		},

		// 生命周期函数，可以为函数，或一个在methods段中定义的方法名
		beforeMount: function() {

		},
		methods: {
			receiveCoupon(e) {
				util.checkAuthInfo(() => {
					var couponId = this.item.couponId;
					http.request({
						url: "/api/v1/myCoupon/receive",
						method: "POST",
						data: couponId,
						callBack: (res) => {
							this.update = false
							var coupon = this.item;
							coupon.canReceive = false;
							this.setData({
								item: coupon
							});
							uni.showToast({
								title: res,
								mask: true,
							})
							this.update = true
						}
					});
				});
			},

			checkCoupon(e) {
				this.$emit('checkCoupon', {
					couponId: e.currentTarget.dataset.couponid,
					index: this.index
				});
			},

			/**
			 * 立即使用
			 */
			useCoupon() {
				util.checkAuthInfo(() => {
					var url = '/pages/prod-classify/prod-classify?sts=' + this.stsType;
					var id = this.item.couponId;
					var title = this.i18n.couponEventGoods;
					if (id) {
						url += "&tagid=" + id + "&title=" + title;
					}
					uni.navigateTo({
						url: url
					});
				});
			}

		}
	};
</script>
<style>
	@import "./coupon.css";
</style>
