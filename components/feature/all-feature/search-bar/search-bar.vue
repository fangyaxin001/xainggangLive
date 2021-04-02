<template>
	<view class="con" id="featureSearchBar" :style="{'margin-bottom':dataField.position===2&&fixSearchBar?(dataField.boxHeight+16) + 'px': '0',}">
		<view class="search-bar-container" :style="{background:dataField.bgColor, 'position': dataField.position===2&&fixSearchBar?'fixed': 'unset',
							 'top':dataField.position===2&&fixSearchBar?'0': 'unset','z-index':dataField.position===2&&fixSearchBar?'999': 'unset', }"
		 @tap="toSearchPage">
			<view class="search-bar" :style="{height: dataField.boxHeight + 'px',background:dataField.boxColor, color: dataField.textColor, borderRadius: dataField.boxRadio+ 'px', justifyContent: dataField.textAlgin }">
				<image src="../../../../static/images/icon/search.png" mode=""></image>
				<text>{{i18n.search}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				fixSearchBar: false,
				searchBarTop: 0
			}
		},
		props: {
			dataField: {
				type: Object,
				default: () => ({})
			},
			pageScorllTop: {
				type: Number,
				default: 0
			},
			shopId: {
				type: [Number, String],
				default: 0
			},
		},
		computed: {
			i18n() {
				return this.$t('index')
			}
		},
		watch: {
			pageScorllTop(nv) {
				let extraHeight = 0
				// #ifdef H5
				extraHeight = 40
				// #endif
				if (nv >= this.searchBarTop + extraHeight) {
					this.fixSearchBar = true
				} else {
					this.fixSearchBar = false
				}
			}
		},
		mounted() {
			this.getSearchBarScrollTop()
		},
		methods: {
			/**
			 * 获取搜索框所在位置
			 */
			getSearchBarScrollTop() {
				this.$nextTick(() => {
					setTimeout(() => {
						const query = this.createSelectorQuery()
						query.select('#featureSearchBar').boundingClientRect()
						query.selectViewport().scrollOffset()
						query.exec((res) => {
							if (res[0].top) {
								this.searchBarTop = res[0].top
							}
						})
					}, 200)
				})
			},
			/**
			 * 跳转搜索页面
			 */
			toSearchPage() {
				// 平台首页，跳转到平台搜索页面
				uni.navigateTo({
					url: this.shopId === 0 ? '/pages/search-page/search-page' : '/packageShop/pages/shopSearch/shopSearch'
				})
			}
		}
	}
</script>

<style>
	@import url("./search-bar.css");
</style>
