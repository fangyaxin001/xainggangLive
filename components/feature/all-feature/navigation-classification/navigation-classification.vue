<template>
	<!-- 分类导航 -->
	<view class="fature-cate-item">
		<view v-for="(navItem, index) in dataField.nav" :key="index" :class="['item', dataField.size==4 ? 'column-four': 'column-five']"
		 @tap="toClassifyPage(navItem)">
			<image class="nav-img" :src="navItem.img" v-if="dataField.set.type==2 || dataField.set.type==1"></image>
			<text class="nav-title" v-if="dataField.set.type==2 || dataField.set.type==3">{{navItem.title}}</text>
		</view>
		<block v-if="dataField.nav.length % dataField.size !=0">
			<view v-for="(navItem, index) in dataField.size - (dataField.nav.length % dataField.size)" style="visibility: hidden;"
			 :key="index" :class="['item', dataField.size==4 ? 'column-four': 'column-five']">
				<image class="nav-img" :src="navItem.img" v-if="dataField.set.type==2 || dataField.set.type==1"></image>
				<text class="nav-title" v-if="dataField.set.type==2 || dataField.set.type==3">{{navItem.title}}</text>
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		data() {
			return {};
		},

		components: {

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
				default: 'home'
			}
		},

		mounted() {
			
		},

		methods: {
			/**
			 * 导航项目点击事件
			 * @param {Object} item 
			 * item.img		图文/图片导航 的图片链接
			 * item.link		商品id/自定义路径/微页面id
			 * item.linkType		1商品 2购物车 3个人中心 4自定义路径 5指定微页面	
			 * item.title		图文/文字导航 的标题
			 */
			toClassifyPage(item) {
				// 跳转购物车/个人中心
				if (item.linkType == 2 || item.linkType == 3) {
					uni.switchTab({
						url: item.linkType == 2 ? '/pages/basket/basket' : '/pages/user/user',
					})
					return
				}
				// 跳转自定义页面
				if (item.linkType == 4) {
					uni.navigateTo({
						url: item.link,
					})
					return
				}
				// 跳转微页面
				if (item.linkType == 5) {
					let pages = getCurrentPages()
					if (pages.length < 5) {
						uni.navigateTo({
							url: '/pages/feature-index/feature-index0?renovationId=' + item.link + '&shopId=' + this.shopId
						})
					} else {
						uni.redirectTo({
							url: '/pages/feature-index/feature-index0?renovationId=' + item.link + '&shopId=' + this.shopId
						})
					}
				}
			}
		}
	};
</script>

<style>
	@import url("./navigation-classification.css");
</style>
