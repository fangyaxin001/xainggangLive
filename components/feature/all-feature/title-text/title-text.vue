<template>
	<view class="text-title">
		<view class="title-row">
			<view class="title" :style="{'width':!dataField.isLink?'100%':dataField.linkStyle==1?'85%':dataField.linkStyle==2?'80%':'95%', textAlign: dataField.align, fontSize: dataField.titleSize +'px', fontWeight: dataField.titleWeight }">
				{{dataField.title}}
			</view>
			<view class="title-more" v-if="dataField.isLink" @tap="viewMore">
				<view class="more-text" v-if="dataField.linkStyle!=3">{{dataField.linkText}}</view>
				<view class="more-icon" v-if="dataField.linkStyle!=1">
					<image src="../../../../static/images/icon/more.png" mode=""></image>
				</view>
			</view>
		</view>
		<view class="decs-row" v-if="dataField.desc" :style="{width: '100%', textAlign: dataField.align,fontSize: dataField.descSize +'px', fontWeight: dataField.descWeight }">
			{{dataField.desc}}
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
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
		},
		mounted() {
			// console.log(this.dataField)
		},
		methods: {
			/**
			 * 点击查看更多
			 */
			viewMore() {
				// console.log(this.dataField.link)
				let item = this.dataField.link
				// item.type:  1商品详情; 2购物车; 3个人中心; 4小程序路径 5微页面
				if (item.type === 1) {
					console.log('跳转商品详情,商品id' + item.link)
				} else if (item.type === 2) {
					console.log('跳转购物车页面')
				} else if (item.type === 3) {
					console.log('跳转个人中心')
				} else if (item.type === 4) {
					console.log('跳转指定页面: ',item.link)
				}
			}
		}
	}
</script>

<style>
	@import url("./title-text.css");
</style>
