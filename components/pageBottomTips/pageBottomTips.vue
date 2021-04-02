<template>
	<view>
		<!-- 加载完成 -->
		<view class="load-all" v-if="isAll">{{i18n.endTips}}</view>
		<!-- 列表为空 -->
		<view class="empty" v-if="empty">
		  <view class="empty-icon">
		    <image src="../../static/images/icon/empty.png"></image>
		  </view>
		  <view class="empty-text">{{i18n.noData}}</view>
		</view>
	</view>
</template>

<script>
	import i18n from '../../main.js'
	export default {
		data() {
			return {
				
			};
		},
		props: {
			isAll: Boolean,
			empty: Boolean
		},
		computed: {
			i18n() {
				return this.$t('index')
			}
		}
	}
</script>

<style>
	@import url("./pageBottomTips.css");
</style>
