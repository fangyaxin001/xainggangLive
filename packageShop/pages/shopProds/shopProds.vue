<template>
	<!--pages/allGoods/allGoods.wxml-->
	<view class="shop-container">
   <u-navbar :border-bottom="false" :background="{background: '#ffffff' }" >
	  <view class="bg-sear">
	  	<view class="section" @tap="toShopSearchPage" :data-shopid="shopInfo.shopId">
	  		<image class="search-img" src="/static/images/icon/search.png"></image>
	  		<text class="placeholder">{{i18n.searchForItems}}</text>
	  	</view>  
	  </view>
	  <view style="text-align: center;" >
		<view class=""><image style="width: 35rpx; height: 35rpx;" src="../../../static/images/proneler/select-icon.png" mode=""></image></view>
	  	<view class="" style="font-size: 16rpx;   color: #000000; transform: scale(0.8);">分类</view>
	  </view>
   </u-navbar>
	<!-- 店铺信息 --> 
		<!-- 搜索框 && 排序tab -->
		<view class="head-bg">
			<view class="bg-sears">
				<view :class="topFlag? 'navtop' : ''"> 
					<view class="tab-tit">
						<view :class="(curLang=='en'? 'en ': '') + 'tab-item ' + (sort==0 && (orderBy==1?'down':'up'))" @tap="onStsTap" data-sort="0">
							<text>{{i18n.default}}</text>
						</view>
						<view :class="'tab-item ' + (sort==1 && (orderBy==1?'down':'up'))" @tap="onStsTap" data-sort="1">
							<text>{{i18n.sales}}</text>
						</view>
						<view :class="'tab-item ' + (sort==2 && (orderBy==1?'down':'up'))" @tap="onStsTap" data-sort="2">
							<text>{{i18n.price}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 商品列表 -->
		<view class="prodlist-item-cont">
			<block v-for="(prod, prodId) in shopProdList" :key="prodId"> 
				<prod-item :prod="prod"></prod-item>
			</block>
			<block v-for="(prod, prodId) in shopProdList" :key="prodId">
				<prod-item :prod="prod"></prod-item>
			</block>
		</view>

		<view class="tips" v-if="isAll">{{i18n.allLoaded}}</view>
		<shop-tabbar style="position:fixed;bottom:0;width:100%;left:0;right:0;" currentTab="1"></shop-tabbar>

    <!-- 回到顶部 -->
    <back-top-btn v-if="showBacktop"></back-top-btn>
	</view>
</template>

<script>
// pages/allGoods/allGoods.js
var http = require("../../../utils/http.js");
import shopTabbar from '../../components/shop-tabbar/shop-tabbar';
import prodItem from "../../components/prodListItem/prodListItem";
import shopHeader from '../../components/shopHeader/shopHeader';
import backTopBtn from "../../../components/backTopBtn/backTopBtn";

export default {
  data() {
    return {
      topFlag: false,
      shopInfo: {},
      shopProdList: [],
      shopId: 0,
      sort: 0,
      orderBy: 1, //状态点击事件
      current: 1,
      // 当前页
      pages: 0,
      // 总页码
      isAll: false,
      currentTab: true,
      curLang: '',
		scrollTop: "",
		showBacktop: false
    };
  },

  components: {
    shopTabbar,
    prodItem,
    shopHeader,
    backTopBtn
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
  onLoad: function (options) {
    this.setData({
      shopInfo: wx.getStorageSync("shopInfo"),
      curLang: uni.getStorageSync('lang')
    });
    console.log('页面shopInfo：', this.shopInfo)
    if (options.shopId) {
      this.setData({
        shopId: options.shopId
      });
    } else {
      this.setData({
        shopId: this.shopInfo.shopId
      });
    }
    this.getShopProds();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //头部导航标题
    // uni.setNavigationBarTitle({
    //   title: this.i18n.allCommodities
    // });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getNextPage();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () { },

  methods: {
	// 页面滚动到指定位置指定元素固定在顶部
	onPageScroll: function (e) {
		this.scrollTop = e.scrollTop
		if (this.scrollTop > 80) {
			this.setData({
				topFlag: true,
				showBacktop: true
			})
		} else if (this.scrollTop < 80) {
			this.setData({
				topFlag: false,
				showBacktop: false
			})
		}
	},

    /**
     * tab栏切换
     */
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

    /**
     * 跳转搜索页
     */
    toShopSearchPage: function (e) {
      const shopId = e.currentTarget.dataset.shopid;
      uni.navigateTo({
        url: '/packageShop/pages/shopSearch/shopSearch?shopId=' + shopId
      });
    },

    // 获取店铺商品
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

    // 触底加载下一页
    getNextPage() {
      if (this.pages > this.current) {
        this.setData({
          current: this.current + 1
        });
        this.getShopProds();
      } else {
        this.setData({
          isAll: true
        });
      }
    },

    // 跳转商品详情
    toProdPage: function (e) {
      var prodid = e.currentTarget.dataset.prodid;

      if (prodid) {
        uni.navigateTo({
          url: '/pages/prod/prod?prodid=' + prodid
        });
      }
    }
  }
};
</script>
<style>
@import "./shopProds.css";
</style>
