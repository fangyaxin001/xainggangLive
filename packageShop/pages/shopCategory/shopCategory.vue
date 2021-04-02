<template>
<view class="container">
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
		<!-- 店铺信息 -->
		<shopHeader :shopId="shopInfo.shopId"></shopHeader>
	</view>
	

  <!-- 头部搜索区 -->
<!--  <view class="search-bar">
    <view class="search-box" @tap="toShopSearchPage">
      <image src="/static/images/icon/search.png" class="search-img"></image>
      <text class="sear-input">{{i18n.searchForItems}}</text>
    </view>
  </view> -->
  
  <!-- 滚动内容区 -->
  <view class="main">
  	<!-- 左侧菜单start -->
  	<scroll-view scroll-y="true" class="leftmenu" >
  		<block v-for="(item, index) in shopCategoryList" :key="index">
  			<view :class="'menu-item ' + (selIndex==index?'active':'')" :data-index="index" :data-id="item.categoryId" @tap="onMenuTab">
  				<text>{{item.categoryName}}</text>
  			</view>
  		</block>
  	</scroll-view>
  	<!-- 左侧菜单end -->
  
  	<!-- 右侧内容start -->
  	<scroll-view scroll-y="true" class="rightcontent" lower-threshold="200" @scrolltolower="loadNextPage" :scroll-top="prodListScrollTop">
  		 
  		<block v-for="(item, index) in prodList" :key="index">
  			<view class="sub-category">
  				<view class="sub-category-con">
  					<view class="sub-cate-title">
  						<text class="sub-cate-text">{{item.categoryName}}常用分类</text>
  						<text class="view-all" @tap="toCatePage" data-type="all" :data-subcateindex="subCateIndex" :data-parentid="item.categoryId">
  							<u-icon name="arrow-right" color="#ffffff" size="28"></u-icon>
  						</text>
  					</view>
  					<view class="th-cate-con" v-if="item.categories">
  						<block v-for="(thCateItem, categoryId) in item.categories" :key="categoryId">
  							<view class="sub-category-item" @tap="toCatePage" :data-categoryid="thCateItem.categoryId" :data-parentid="item.categoryId">
  								<image :src="thCateItem.pic" mode="widthFix" class="sub-category-item-pic"></image>
  								<text>{{thCateItem.categoryName}}</text>
  							</view>
  						</block>
  					</view>
  					<view class="empty-tips" v-else>暂无数据</view>
  				</view>
  			</view>
  		</block>
  
  	</scroll-view>
  	<!-- 右侧内容end -->
  </view>
  <shop-tabbar style="position:fixed;bottom:0;width:100%;left:0;right:0;" currentTab="2"></shop-tabbar>
</view>
</template>

<script module="wxs" lang="wxs" src="../../../wxs/number.wxs"></script>

<script>
// pages/shopCategory/shopCategory.js
var http = require("../../../utils/http.js");
import shopTabbar from '../../components/shop-tabbar/shop-tabbar';
import shopHeader from '../../components/shopHeader/shopHeader';
export default {
  data() {
    return {
      shopInfo: {},
      shopCategoryList: [],
      selIndex: 0,
      prodList: [],
      categoryLength: 0,
      shopCategoryId: 0,
      current: 1,
      pages: 0,
      prodListScrollTop: 0
    };
  },

  // filters: {
  //     ellipsis (value) {
  //       if (!value) return ''
  //       if (value.length > 4) {
  //         return value.slice(0,4)+''
  //       }
  //       return value
  //     }
  //   },

  components: {
    shopTabbar,
    shopHeader
  },
  props: {},
  watch: {
    prodListScrollTop() {
      console.log(this.prodListScrollTop)
    }
  },

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
      shopInfo: wx.getStorageSync("shopInfo")
    });
    this.getShopCategory();
    this.getProdListByCategoryId()
    // shopCategoryList
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
    uni.setNavigationBarTitle({
      title: this.i18n.commodityClassification
    });
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
  onReachBottom: function () { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () { },
  methods: {
    // 加载下一页
    loadNextPage() {
      if (this.current < this.pages) {
        this.current = this.current + 1
        this.getProdListByCategoryId()
      }
    },
    // 跳转店内搜索页
    toShopSearchPage: function () {
      uni.navigateTo({
        url: '../shopSearch/shopSearch?shopId=' + this.shopInfo.shopId
      });
    },
    // 分类点击事件
    onMenuTab: function (e) {
      let categoryId = e.currentTarget.dataset.categoryid;
      const {
        index
      } = e.currentTarget.dataset;
      this.setData({
        selIndex: index,
        shopCategoryId: categoryId,
        current: 1,
        pages: 0,
        prodListScrollTop: 0
      });
      this.getProdListByCategoryId();
    },
    // 获取店内分类列表

    getShopCategory: function () {
      let shopId = this.shopInfo.shopId;
      var params = {
        url: '/category/categoryInfo',
        method: 'GET',
        data: {
          shopId
        },
        callBack: res => {
          // 添加长度标识
          res.forEach((item, index) => {
            item.categoryLength = item.categoryName.length
          })
          this.setData({
            shopCategoryList: res,
            shopCategoryId: res[0].categoryId
          });
          this.getProdListByCategoryId();
        }
      };
      http.request(params);
    },

    // 根据店铺分类id获取商品
    getProdListByCategoryId() {
      var params = {
        url: '/search/searchProdPage',
        method: 'GET',
        data: {
          shopCategoryId: this.shopCategoryId,
          shopId: this.shopInfo.shopId,
          current: this.current,
          // 新增参数
          isAllProdType: true,
          size: 20,
          sort: 0
        },
        callBack: res => {
          var list = []
          if (res.current == 1) {
            list = res.records
          } else {
            list = this.prodList.concat(res.records)
          }
          this.setData({
            prodList: list,
            current: res.current,
            pages: res.pages
          });
        }
      };
      http.request(params);
    },

    // 跳转商品详情页
    toProdPage: function (e) {
      var prodid = e.currentTarget.dataset.prodid;
      // uni.navigateTo({
      //   url: '/pages/prod/prod?prodid=' + prodid
      // });
      this.$Router.push({ path: '/pages/prod/prod', query: { prodid: prodid } })
    }
  }
};
</script>
<style>
@import "./shopCategory.css";
</style>