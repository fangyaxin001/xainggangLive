<template>
	<view class="prod-items"  :data-prodid="item.prodId" :data-groupactivityid="item.groupActivityId">
		<!-- flag 控制收藏管理，显示隐藏复选框 -->
				<u-checkbox  v-if="!flag" 
				style="margin-right: 20rpx;width: 80rpx;"
					@change="checkboxChange" 
					v-model="checked" 
					:name="name"
					shape="circle"
					active-color="#47D1D1"
				></u-checkbox>
		<view class="hot-imagecont">
			<image src="../../static/images/icon/coupon-used.png" class="hotsaleimg"></image>
		</view>
	  <view class="prod-items-right">
	  	<view class="prod-title">达而稳（DOREWIN）手机投屏线连接电视同屏线mhl线投影仪苹果安卓…</view>
		<view class="collect-price ">
			<view style="color: #FA2033;">
				<text style="display: inline-block;margin-top: 20rpx; font-size: 20rpx;">HK$</text><text style="font-size: 28rpx;">1999.00</text>
			</view>
			<view style="font-size: 24rpx; color: #999999;">銷量149件</view>
		</view>
	  </view>
	  
	</view>
</template>

<script module="wxs" lang="wxs" src="../../wxs/number.wxs"></script>

<script>
	var http = require("../../utils/http.js");

	export default {
		data() {
			return {
				checked:true,
				name:"我是傻狗",
			
			};
		},

		components: {},
		props: {
			item: Object,
			sts: String,
			showCancelCollect: Boolean,
			flag:Boolean,
		},
		
		computed:{
			i18n() {
				return this.$t('index')
			}
		},
		
		methods: {
			goDetial(){
				console.log(11)
				uni.navigateTo({
					url:"/pages/prod/prod"
				})
			},
			checkboxChange(e){
				console.log(e)
			},
			toProdPage: function(item) {
				console.log(item)
				console.log(11)
				
				var prodid = item.prodId;
				var groupActivityId = item.groupactivityid;
				this.$Router.push({ path: '/pages/prod/prod', query: { prodid: prodid }})
				if (groupActivityId) {
					// uni.navigateTo({
					// 	url: '/pages/prod/prod?prodid=' + prodId + "&groupActivityId=" + groupActivityId
					// });
					this.$Router.push({ path: '/pages/prod/prod', query: { prodid: prodid, groupActivityId: groupActivityId}})
				}
			},
			handleCancelCollection(e) {
				var prodid = e.currentTarget.dataset.prodid;
				uni.showLoading();
				var params = {
					url: "/api/v1/user/collection/addOrCancel",
					method: "POST",
					data: prodid,
					callBack: (res) => {
						uni.showToast({
							title: res ? this.i18n.collectionAdded : this.i18n.collectionCancelled,
							duration: 1200,
							icon: 'none',
						})
						this.$emit('getCollectionProd')
						uni.hideLoading()					}
				};
				http.request(params);
			}
		}
	};
</script>
<style>
	@import "./production.css";
</style>
