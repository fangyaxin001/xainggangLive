<template>
	<view class="goods-box" v-if="dataField.size!=1">
		<view v-for="(item, index) in nGoods" :key="index" class="goods-box-item">
			<view v-for="(goodsItem, goodsIndex) in item" :key="goodsIndex" class="goods-item" @tap.stop="goodsFun(goodsItem.prodId)">
				<view class="goods-item-content" :class="{'goods-item-three':dataField.size==3}">
					<view class="goods-img" :class="{'goods-img-three':dataField.size==3}" :style="'background-image: url(' + goodsItem.pic + ');'"></view>
					<view class="goods-box-info" :class="{'goods-box-info-three':dataField.size==3}" v-if="state.productName">
						<view class="goods-info-title" :class="{'goods-info-title-three':dataField.size==3}" v-if="state.productName">
							{{goodsItem.prodName}}
						</view>
						<view class="goods-info-desc" v-if="state.sellingPoint">
							<text>{{goodsItem.brief}}</text>
						</view>
						<view class="goods-info-price  goods-cell-3" :class="{'goods-info-price-three':dataField.size==3}" v-if="state.price || state.buyBtn">
							<view class="price-info" v-if="state.price">
								<text class="symbol">￥</text>
								<text class="big-num">{{wxs.parsePrice(goodsItem.price)[0]}}</text>
								<text class="small-num">.{{wxs.parsePrice(goodsItem.price)[1]}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
	<!-- 一列 -->
	<view class="goods-box-one" v-else>
		<view v-for="(goodsItem, index) in nGoods[0]" :key="index" class="goods-one-column-item" @tap.stop="goodsFun(goodsItem.prodId)">
			<view class="goods-img-one">
				<image :src="goodsItem.pic" mode=""></image>
			</view>
			<view class="goods-info-one">
				<view class="goods-name-one" v-if="state.productName">
					{{goodsItem.prodName}}
				</view>
				<view class="goods-brief-one" v-if="state.sellingPoint">
					{{goodsItem.brief}}
				</view>
				<view class="goods-price-one" v-if="state.price">
					<text class="symbol">¥ </text>
					<text class="big-num">{{wxs.parsePrice(goodsItem.price)[0]}}</text>
					<text class="small-num">.{{wxs.parsePrice(goodsItem.price)[1]}}</text>
				</view>
			</view>
		</view>
	</view>
	
</template>

<script module="wxs" lang="wxs" src="../../../../wxs/number.wxs"></script>
<script>
	const app = getApp();
	import http from '../../../../utils/http.js'
	export default {
		data() {
			return {
				goods: [],
				nGoods: [],
				state: {
					//显示状态
					productName: false,
					//1
					sellingPoint: false,
					//2
					price: false,
					//3
					buyBtn: false //4
				}
			};
		},

		components: {
			// vanTag
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
			}
		},

		mounted() {
			let data = this.dataField;
			this.setData({
				state: {
					//显示状态
					productName: data.showContent.find(x => x * 1 === 1),
					//1
					sellingPoint: data.showContent.find(x => x * 1 === 2),
					//2
					price: data.showContent.find(x => x * 1 === 3),
					//3
					buyBtn: data.showContent.find(x => x * 1 === 4) //4
				}
			});
			if (this.dataField.goods) {
				http.request({
					url: '/prod/listProdByIdsAndType',
					method: 'GET',
					data: {
						prodIds: this.dataField.goods.toString(),
						prodType: ''
					},
					callBack: res => {
						this.goods = res
						this.carding()
					}
				})
			}
		},

		methods: {
			/**梳理数据*/
			carding() {
				let dataField = this.dataField;
				// 单独一列
				if (dataField.size == 1) {
					this.nGoods.push(this.goods)
					return
				}
				// 两列或三列
				let columnNum = dataField.size || 2;
				let cur = 1;
				let cell_1 = [];
				let cell_2 = [];
				let cell_3 = [];
				this.goods.map((li, index) => {
					if (cur === 1) {
						cell_1.push(li);
					} else if (cur === 2) {
						cell_2.push(li);
					} else if (cur === 3) {
						cell_3.push(li);
					}
					cur++;
					if (cur > columnNum) {
						cur = 1;
					}
					if (index === this.goods.length - 1) {
						this.nGoods.push(cell_1, cell_2);
						if (cell_3.length) {
							this.nGoods.push(cell_3);
						}
						this.setData({
							nGoods: this.nGoods
						});
					}
				})
			},

			/**
			 * 点击商品事件
			 * */
			goodsFun(id) {
				uni.navigateTo({
					url: '/pages/prod/prod?prodid=' + id
				})
			}
		}
	};
</script>
<style>
	@import "./goods.css";
</style>
