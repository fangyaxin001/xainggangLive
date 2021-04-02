<template>
	<!--pages/shop-tabbar/shop-tabbar.wxml-->
	<view class="shop-tabbar-container">
		<block v-for="(item, index) in list" :key="index">
			<view class="tabBar" @tap="tabChange" :data-index="index">
				<image class="tabIcon" :src="item.selectedIconPath" v-if="currentTab==index"></image>
				<image class="tabIcon" :src="item.iconPath" v-else></image>
				<text :class="'tabTitle ' + (activeTab==index?'on':'')">{{item.text}}</text>
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				activeTab: this.currentTab,
				list: [{
					// text: "店铺首页",
					iconPath: "../../static/images/tabbar/shop-home.png",
					selectedIconPath: "../../static/images/tabbar/shop-home-sel.png"
				}, {
					// text: "全部商品",
					iconPath: "../../static/images/tabbar/shop-prods.png",
					selectedIconPath: "../../static/images/tabbar/shop-prods-sel.png",
				}, {
					// text: "商品分类",
					iconPath: "../../static/images/tabbar/shop-category.png",
					selectedIconPath: "../../static/images/tabbar/shop-category-sel.png"
				}, {
					// text: "店内搜索",
					iconPath: "../../static/images/tabbar/shop-search.png",
					selectedIconPath: "../../static/images/tabbar/shop-search-sel.png"
				}],
				shopInfo: null
			};
		},

		components: {},
		props: {
			currentTab: {
				type: String,
				default: '0'
			},
			// renovationId: {
			// 	type: [Number,String],
			// 	default: ''
			// },
			// shopId: {
			// 	type: [Number,String],
			// 	default: ''
			// }
		},

		computed: {
			i18n() {
				return this.$t('index')
			}
		},

		beforeMount: function() {
			// 在组件实例进入页面节点树时执行
			var listText = this.list;
			var shopHomepage = this.i18n.shopHomepage;
			this.$set(listText[0], 'text', shopHomepage);
			var allCommodities = this.i18n.allCommodities;
			this.$set(listText[1], 'text', allCommodities);
			var commodityClassification = this.i18n.commodityClassification;
			this.$set(listText[2], 'text', commodityClassification);
			var storeSearch = this.i18n.storeSearch;
			this.$set(listText[3], 'text', storeSearch);

			// 店铺信息
			this.shopInfo = uni.getStorageSync('shopInfo')
		},
		destroyed: function() { // 在组件实例被从页面节点树移除时执行
		},
		methods: {
			toProdPage: function(e) {
				var prodid = e.currentTarget.dataset.prodid;
				this.$Router.push({
					path: '/pages/prod/prod',
					query: {
						prodid: prodid
					}
				})
			},

			// tabbar切换
			tabChange(e) {
				const {
					index
				} = e.currentTarget.dataset;
				this.activeTab = index
				if (this.activeTab == 0) {
					uni.redirectTo({
						url: this.shopInfo.renovationId ? '/packageShop/pages/feature-index/feature-index0?shopId=' + this.shopInfo.shopId +
							'&renovationId=' + this.shopInfo.renovationId : '/packageShop/pages/shopPage/shopPage?shopId=' + this.shopInfo.shopId
					});
				} else if (this.activeTab == 1) {
					uni.redirectTo({
						url: '/packageShop/pages/shopProds/shopProds'
					});
				} else if (this.activeTab == 2) {
					uni.redirectTo({
						url: '/packageShop/pages/shopCategory/shopCategory'
					});
				} else if (this.activeTab == 3) {
					uni.redirectTo({
						url: '/pages/search-page/search-page'
					});
				}
			}

		}
	};
</script>
<style>
	@import "./shop-tabbar.css";
</style>
