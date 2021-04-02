<template>
	<!--pages/delivery-address/delivery-address.wxml-->
	<view class="container">
		<u-navbar title="地址管理"></u-navbar>
		<view class="main">
			<radio-group class="radio-group" v-if="reDraw">
				<block v-for="(item, index) in addressList" :key="index">
					<view class="address"> 
						<view class="personal" @tap="selAddrToOrder" :data-addrid="item.addrId">
							<view class="info-tit">
								<text class="company">公司</text>
								<text class="name">{{item.receiver}}</text>
								<text class="tel">{{item.mobile}}</text>
								<!-- <image src="/static/images/icon/revise.png" @tap.stop="toEditAddress" :data-addrid="item.addrId"></image> -->
							</view>
							<view class="addr">
								<text class="addr-get">{{item.province}}{{item.city}}{{item.area}}{{item.addr}}</text>
							</view> 
						</view> 
						<view class="select-btn">   
							<view class="box">   
								<label @tap="onDefaultAddr" :data-addrid="item.addrId">
									<radio :checked="item.commonAddr==1" color="#47D1D1"></radio>默認地址
								</label>
							</view>
							<view class=""> 
								<text style="display: inline-block;margin-right: 60rpx;"><u-icon style="margin-right: 10rpx;" name="lajitong" custom-prefix="custom-icon" size="32" color="#888888"></u-icon>删除</text>
								<text @click="compile"><u-icon style="margin-right: 10rpx;" name="bianji" custom-prefix="custom-icon" size="32" color="#888888" ></u-icon>编辑</text>
							</view>
							 
						</view>
					</view>
				</block>
			</radio-group>
		</view>
		<view class="footer" @tap="onAddAddr">
			<text>添加地址</text>
		</view>


		<!-- 列表为空 -->
		<view class="empty" v-if="addressList.length==0">
			<view class="empty-icon">
				<image src="/static/images/icon/empty-dot.png"></image>
			</view>
			<view class="empty-text">{{i18n.noShippingAddress}}</view>
		</view>

	</view>
</template>

<script>
	// pages/delivery-address/delivery-address.js
	var http = require("../../utils/http.js");

	export default {
		data() {
			return {
				defaultSize: 'mini',
				disabled: false,
				plain: true,
				loading: false,
				addressList: [],
				addAddress: '',
				order: -1,
				item: "",
				selAddress: "",
				reDraw: true
			};
		},

		components: {},
		props: {},
		computed:{
			i18n() {
				return this.$t('index')
			}
		},
		
		onLoad: function(option) {
			if (option.order) {
				this.setData({
					order: option.order
				});
			}
		},
		//加载地址列表
		onShow: function() {
			// 加载导航标题
			// uni.setNavigationBarTitle({
			//     title:this.i18n.shippingAddress
			// });
			this.getAddrList()
		},
		methods: {
			// 编辑
			compile(){
				uni.navigateTo({
					
					url:"/pages/editAddress/editAddress?flag=true"
				})
			},
			/**
			 * 获取收货地址列表
			 */
			getAddrList: function() {
				uni.showLoading();
				this.reDraw = false
				var params = {
					url: "/api/v1/address/list",
					method: "GET",
					callBack: (res) => {
						this.setData({
							addressList: res,
							reDraw: true
						});
						uni.hideLoading()					}
				};
				http.request(params);
			},

			/**
			 * 新增收货地址
			 */
			onAddAddr: function(e) {
				if(this.addressList.length == 10) {
					uni.showToast({
						title: this.i18n.addNewAddressTips,
						icon: 'none'
					})
				}else {
					uni.navigateTo({
						url: '/pages/editAddress/editAddress'
					});
				}
			},
			/**
			 * 设置为默认地址
			 */
			onDefaultAddr: function(e) {
				var addrId = e.currentTarget.dataset.addrid;
				uni.showLoading();
				var params = {
					url: "/api/v1/address/defaultAddr/" + addrId,
					method: "PUT",
					callBack: (res) => {
						uni.hideLoading()						
						this.getAddrList()
					}
				};
				http.request(params);
			},

			/**
			 * 修改地址
			 */
			toEditAddress: function(e) {
				var addrId = e.currentTarget.dataset.addrid;
				uni.navigateTo({
					url: '/pages/editAddress/editAddress?addrId=' + addrId
				});
			},

			/**
			 * 选择地址 跳转回提交订单页
			 */
			selAddrToOrder: function(e) {
				let id = e.currentTarget.dataset.addrid
				let item = null
				this.addressList.forEach(addrItem=>{ 
					if (addrItem.addrId == id) {
						item = addrItem
					}
				})
				if (this.order == 0) {
					var pages = getCurrentPages(); //当前页面
					var prevPage = pages[pages.length - 2]; //上一页面
					prevPage.item = item
					prevPage.selAddress = 'yes'
					//返回
					uni.navigateBack({
						delta: 1
					});
				}
			},
		}
	};
</script>
<style>
	@import "./delivery-address.css";
</style>
