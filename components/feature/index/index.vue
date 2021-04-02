<template>
	<view class="micro-box">
		<view v-for="(item, index) in list" :key="index">
			<searchBar :dataField="item.dataField" :shopId="shopId" v-if="item.type === 'search'" :pageScorllTop="pageScorllTop" />
			<image-ad :dataField="item.dataField" :shopId="shopId" v-if="item.type === 'imageAd' || item.type === 'hotArea'" />
			<goods :dataField="item.dataField" :shopId="shopId" v-if="item.type === 'goods'" />
			<notice :dataField="item.dataField" :shopId="shopId" v-if="item.type === 'notice'" />
			<navigationClassification :dataField="item.dataField" :shopId="shopId" v-if="item.type === 'tabNav'" />
			<titleText :dataField="item.dataField" :shopId="shopId" v-if="item.type === 'titleText'" />
			<promotionalActivities :dataField="item.dataField" :shopId="shopId" v-if="item.type === 'promotionalActivities'" />
		</view>
	</view>
</template>

<script>
	import http from '../../../utils/http.js'

	import imageAd from "../all-feature/image-ad/image-ad";
	import goods from "../all-feature/goods/goods";
	import notice from "../all-feature/notice/notice";
	import navigationClassification from '../all-feature/navigation-classification/navigation-classification'
	import titleText from '../all-feature/title-text/title-text'
	import promotionalActivities from '../all-feature/promotional-activities/promotional-activities'
	import searchBar from '../all-feature/search-bar/search-bar'
	export default {
		data() {
			return {
				list: [],
			};
		},
		components: {
			imageAd,
			goods,
			notice,
			navigationClassification,
			titleText,
			promotionalActivities,
			searchBar
		},
		props: {
			isShowMicro: {
				type: Boolean,
				default: true
			},
			wid: {
				// ID
				type: String,
				default: ''
			},
			pageLoad: {
				type: Boolean,
				default: false
			},
			pageId: {
				type: [Number, String],
				default: 466
			},
			shopId: {
				type: [Number, String],
				default: ''
			},
			pageScorllTop: {
				type: Number,
				default: 0
			}
		},
		mounted() {
			this.getPageInfoById()
		},
		computed: {
			i18n() {
				return this.$t('index')
			}
		},

		methods: {
			/**
			 * 请求页面数据
			 */
			getPageInfoById() {
				// shopId、pageId  在进入店铺主页时获取
				let params = {
					url: '/shopRenovation/info',
					method: 'GET',
					data: {
						renovationId: this.pageId,
						shopId: this.shopId
					},
					callBack: (res) => {
						if (!res && !res.content) {
							// 没获取到数据，可能是对应id的页面被删了
							uni.showToast({
								title: this.i18n.pageGone,
								icon: 'none',
								duration: 1200
							})
							// setTimeout(() => {
							// 	uni.navigateBack({
							// 		delta: 1
							// 	})
							// }, 1500)
							return
						}

						let pageData = JSON.parse(res.content);
						this.list = pageData
						this.$emit('pageLoaded', {
							detail: {
								code: 0,
								data: '已获取数据',
								title: pageData[0].dataField.title
							}
						})
					}
				}
				http.request(params)
			},
		}
	};
</script>
<style>
	@import "./index.css";
</style>
