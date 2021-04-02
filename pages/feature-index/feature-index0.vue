<template>
	<view>
		<feature v-if="pageLoaded" ref="featureIndex" @pageLoaded="pageLoaded" :pageLoad="pageLoad" :pageId="renovationId" :shopId="shopId" :pageScorllTop="pageScorllTop"></feature>
	</view>
</template>

<script>
	import feature from '../../components/feature/index/index.vue'
	export default {
		data() {
			return {
				pageLoad: false,
				renovationId: '', // 页面id
				shopId: '',
				pageScorllTop: 0, // 页面滚动距离
			}
		},
		components: {
			feature
		},
		mounted() {
		
		},
		onLoad: function(options) {
			uni.showLoading()
			if (options.renovationId) {
				this.renovationId = options.renovationId
			}
			if (options.shopId) {
				this.shopId = options.shopId
			}
		},
		onShow:function() {
			this.$nextTick(() => {
				this.$refs.featureIndex.getPageInfoById()
			})
		},
		onPageScroll: function(e) {
			this.pageScorllTop = e.scrollTop
		},
		methods: {
			// 页面加载回调
			pageLoaded(e) {
				uni.setNavigationBarTitle({
					title: e.detail.title
				})
				this.pageLoaded = false
				setTimeout(() => {
					uni.hideLoading()
					this.pageLoaded = true
				}, 1)
			}
		}
	}
</script>

<style>

</style>
