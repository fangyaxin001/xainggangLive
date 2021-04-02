<template>
	<!-- pages/shopPage/shopPage.wxml -->
	<view class="shop-container">
   
		<!-- 渐变背景 -->
		<view class="head-bg shop-index">
			<u-navbar :border-bottom="false" :background="{ background: '' }"> 
			<!-- 搜索框 -->
			<view class="bg-sear">
				<view :class="'bg-search ' + (topFlag? 'navtop' : '')">
					<view class="section" @tap="toShopSearchPage" :data-shopid="shopId">
						<image src="/static/images/icon/search.png" class="search-img"></image>
						<text class="placeholder">请输入商品名称</text>
					</view>
				</view>
			</view></u-navbar>
			<shopHeader style="color: #fff;" :shopId="shopId"></shopHeader>
		</view>
		<!-- /渐变背景 -->

		<!-- 内容大盒子 -->
		<view :class="'prod-wrapper'">
			<!-- 轮播图 -->
			<view v-if="indexImgs" :class="'content ' + (indexImgs.length? '' : 'display')">
				<swiper :autoplay="autoplay" :indicator-color="indicatorColor" :interval="interval" :duration="duration"
				 :indicator-active-color="indicatorActiveColor" circular="true" class="pic-swiper" indicator-dots>
					<block v-for="(item, index) in indexImgs" :key="index">
						<swiper-item class="banner-item">
							<view class="img-box">
								<image :src="item.imgUrl" :data-prodid="item.relation" @tap="toProdPage" class="banner"></image>
							</view>
						</swiper-item>
					</block>
				</swiper>
			</view>
			<!-- 店内公告 -->
			<!-- <view class="message-play" @tap="onNewsPage" v-if="news.length">
			<image src="/static/images/icon/horn.png" class="hornpng"></image>
			<swiper vertical="true" autoplay="true" duration="1000" circular="true" class="swiper-cont">
				<block v-for="(item, id) in news" :key="id">
					<swiper-item class="items">{{item.title}}</swiper-item>
				</block>
			</swiper>
			<text class="arrow"></text>
		</view> -->
			<!-- 热销TOP榜 -->
			<view class="hot">
				<view class="hot-flex">
					<view class="hot-dian">
						<view class="qina_yuan"> </view>
						<view class="shen_yuan"> </view>
					</view>
					<view class="hot-title">
						热销TOP榜
					</view>
					<view class="hot-dian">
						<view class="shen_yuan"> </view>
						<view class="qina_yuan"> </view>
					</view>
				</view>
				<view class="hot-list" v-for="(item,index) in shopProdList" :key="index" v-show="index<3">
					<view class="">
						<image style="width: 172rpx; height: 172rpx;" :src="item.pic" mode="aspectFit"></image>
					</view>
					<view style="margin-left: 20rpx;">
						<view style="font-size: 28rpx;color: #333333;font-weight: Medium;" >{{item.prodName}}</view>
						<view style="color: #999999;font-size: 24rpx;margin: 10rpx 0;">月销2333</view>
						<view style="color: #FA2033;"><text style="font-size: 20rpx;">HK$</text><text style="font-size: 28rpx;">{{item.price}}</text></view>
					</view>
				</view>
			</view>
			<view class="tab-tit">
				<view :class="(curLang=='en'? 'en ': '') + 'tab-item ' + (sort==0 && (orderBy==1?'down':'up'))" @tap="onStsTap" data-sort="0">
					<text>{{i18n.synthesize}}</text>
				</view>
				<view :class="'tab-item ' + (sort==1 && (orderBy==1?'down':'up'))" @tap="onStsTap" data-sort="1">
					<text>{{i18n.salesVolume}}</text>
				</view>
				<view :class="'tab-item ' + (sort==2 && (orderBy==1?'down':'up'))" @tap="onStsTap" data-sort="2">
					<text>{{i18n.price}}</text>
				</view>
				<view :class="'tab-item ' + (sort==2 && (orderBy==1?'down':'up'))" @tap="onStsTap" data-sort="3">
					<text>{{i18n.newProduct}}</text>
				</view>
			</view>
			<!-- 商品列表 -->
			<view class="prod-list">
				 
				<view class="prodlist-item-cont">
					<block v-for="(prod, index) in shopProdList" :key="index">
						<view class="prod-items" @tap="toProdPage" :data-prodid="prod.prodId">
							<view class="hot-imagecont">
								<image :src="prod.pic" class="hotsaleimg"></image>
							</view>
							<view class="hot-text">
								<view class="prod-name">{{prod.prodName}}</view>
								<view class="prod-info">
									<view class="brief">{{prod.brief}}</view>
								</view>
								<view class="prod-text-info">
									<view class="price">
										<text class="symbol">HK$</text>
										<text class="big-num">{{prod.price}}</text>
									</view>
									<view style="color: #999999; font-size: 24rpx; text-decoration:line-through" >
										<text class="symbol">HK$</text>
										<text class="big-num">{{prod.price}}</text>
									</view>
								</view>
							</view>
						</view>
					</block>

					<!-- 查看更多商品 -->
					<view class="view-more" v-if="shopProdList.length>=6" @tap="toShopProds">{{i18n.viewMoreProducts}}</view>
					<view class="view-more" v-if="!shopProdList.length">{{i18n.noData}}</view>
				</view>

			</view>
		</view>

		<!-- /内容大盒子 -->
		<shop-tabbar style="position:fixed;bottom:0;width:100%;left:0;right:0;" :shopId="shopId"></shop-tabbar>

		<!-- 回到顶部 -->
		<back-top-btn v-if="showBacktop"></back-top-btn>
	</view>
</template>

<script>
	// pages/shopPage/shopPage.js
	var http = require("../../../utils/http.js");
	import shopTabbar from '../../components/shop-tabbar/shop-tabbar';
	import shopHeader from '../../components/shopHeader/shopHeader';
	import backTopBtn from "../../../components/backTopBtn/backTopBtn";

	export default {
		components: {
			shopTabbar,
			shopHeader,
			backTopBtn
		},
		data() {
			return {
				shopId: 0,
				shopInfo: {},
				indicatorDots: true,
				indicatorColor: '#d1e5fb',
				indicatorActiveColor: '#1b7dec',
				autoplay: true,
				interval: 2000,
				duration: 1000,
				indexImgs: null,
				topFlag: false,
				isCollection: false,
				shopProdList: [],
				news: [],
				scrollTop: "",
				showBacktop: false
			};
		},
		props: {},
		computed: {
			i18n() {
				return this.$t('index')
			}
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			uni.showLoading({
				title: '',
				mask: true
			});

			// uni.setNavigationBarTitle({
			// 	title: this.i18n.myShop
			// });

			if (options.shopId) {
				this.setData({
					shopId: options.shopId
				});
			} else {
				this.setData({
					shopId: uni.getStorageSync("shopInfo").shopId
				});
			}

			// 进入页面时判断店铺状态
			var shopInfo = uni.getStorageSync("shopInfo")
			// shopStatus店铺状态(-1:未开通 0: 停业中 1:营业中 2:平台下线 3:平台下线待审核)，可修改
			if (shopInfo.shopStatus == 0 || shopInfo.shopStatus == 2 || shopInfo.shopStatus == 3) {
				uni.showModal({
					title: this.i18n.tips,
					content: this.i18n.storeStatusTips,
					showCancel: false, //是否显示取消按钮
					cancelText: this.i18n.cancel,
					confirmText: this.i18n.confirm,
					success: (res) => {
						if (res.confirm) {
							this.$Router.pushTab('/pages/user/user')
						}
					}
				})
			}

			this.getIndexImgs();
			this.getShopProds();
		},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			this.getNoticeList()
		},

		/**
		 * 生命周期函数--监听页面隐藏
		 */
		onHide: function() {},

		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function() {},

		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function() {},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {},
		methods: {
			onStsTap: function (e) {
			  uni.pageScrollTo({
			    scrollTop: 0, //距离页面顶部的距离
			    duration: 0
			  })
			  var sort = e.currentTarget.dataset.sort;
					this.orderBy = this.sort == sort ? this.orderBy == 0 ? 1 : 0 : this.orderBy
			  this.setData({
			    sort: sort,
			    currentTab: false,
			    current: 1,
			    pages: 0,
			    isAll: false
			  });
			  this.getShopProds();
			},
			getShopProds() {
			  uni.showLoading();
			  var params = {
			    url: '/search/searchProdPage',
			    method: 'GET',
			    data: {
			      shopId: this.shopInfo.shopId,
			      sort: this.sort,
			      current: this.current,
			      orderBy: this.orderBy,
			      size: 10,
			      isAllProdType: true
			    },
			    callBack: res => {
			      uni.hideLoading()
			      var shopProdList = [];
			      if (this.current == 1) {
			        this.setData({
			          shopProdList: res.records,
			          pages: res.pages,
			          current: res.current
			        });
			      } else {
			        shopProdList = this.shopProdList;
			        shopProdList.push(...res.records);
			        this.setData({
			          shopProdList
			        });
			      }
							if (res.pages == res.current) {
								this.isAll = true
							}
			    }
			  };
			  http.request(params);
			},
			// 加载公告
			getNoticeList() {
				var params = {
					url: "/shop/notice/topNoticeList/" + this.shopId,
					method: "GET",
					data: {},
					callBack: res => {
						this.setData({
							news: res
						});
						uni.hideLoading();
					}
				};
				http.request(params);
			},

			//跳转公告列表页面
			onNewsPage: function() {
				uni.navigateTo({
					url: '/pages/recent-news/recent-news?shopId=' + this.shopId
				});
			},


			//加载轮播图
			getIndexImgs() {
				var shopId = this.shopId; //加载轮播图
				var params = {
					url: `/indexImgs/${shopId}`,
					method: "GET",
					data: {},
					callBack: res => {
						this.setData({
							indexImgs: res // seq: res
						});
						uni.hideLoading()
					}
				};
				http.request(params);
			},

			// 跳转店铺详情页
			toShopInfo(e) {
				const shopId = e.currentTarget.dataset.shopid;
				uni.navigateTo({
					url: '/pages/shopInfo/shopInfo?shopId=' + shopId
				});
			},

			// 跳转店内搜索页
			toShopSearchPage: function(e) {
				uni.navigateTo({
					url: '/packageShop/pages/shopSearch/shopSearch?shopId=' + e.currentTarget.dataset.shopid
				});
			},

			// 跳转所有商品页
			toShopProds(e) {
				uni.navigateTo({
					url: '/packageShop/pages/shopProds/shopProds?shopId=' + e.currentTarget.dataset.shopid
				});
			},

			// 收藏/取消收藏
			// addOrCannelCollection() {
			//   this.setData({
			//     isCollection: !this.isCollection
			//   });
			// },

			// 跳转商品详情页
			toProdPage: function(e) {
				var prodid = e.currentTarget.dataset.prodid;

				if (prodid) {
					// uni.navigateTo({
					//   url: '/pages/prod/prod?prodid=' + prodid
					// });
					this.$Router.push({
						path: '/pages/prod/prod',
						query: {
							prodid: prodid
						}
					})
				}
			},

			// 获取店铺商品
			getShopProds() {
				var ths = this;
				var params = {
					url: '/search/searchProdPage',
					method: 'GET',
					data: {
						shopId: this.shopId,
						isAllProdType: true
					},
					callBack: res => {
						uni.hideLoading()
						this.setData({
							shopProdList: res.records
						});
					}
				};
				http.request(params);
			},

			// 设置页面标题
			setNavTitle() {
				uni.setNavigationBarTitle({
					title: this.shopInfo.shopName
				});
			},

			// 页面滚动事件
			onPageScroll: function(e) {
				var _this = this;
				if (e.scrollTop > 76) {
					_this.setData({
						topFlag: true,
						showBacktop: true
					});
				} else {
					_this.setData({
						topFlag: false,
						showBacktop: false
					});
				}
			}
		}
	};
</script>
<style>
	@import "./shopPage.css";
</style>
<style scoped>
</style>
