<template>
<!--pages/shopInfo/shopInfo.wxml-->
<!-- 店铺信息 & 收藏 -->
<view class="container">
  <view class="shopInfo">
    <view class="shopLogo">
      <image :src="shopInfo.shopLogo"></image>
    </view>
    <view class="shopTitle">
      <view class="shopName">{{shopInfo.shopName}}</view>
      <!-- <view class="shopDesc">亚米小店,官方自营</view> -->
    </view>
    <view class="collection" @tap="addOrCannelCollection">
      <image v-if="!isCollection" src="/static/images/icon/prod-col.png"></image>
      <image v-if="isCollection" src="/static/images/icon/prod-col-red.png"></image>{{i18n.collection}}</view>
  </view>
  <!-- 评分栏 -->
  <view class="grade">
    <view class="gradeItem">{{i18n.evaluation}}<text class="fraction">87.7</text>
    </view>
    <view class="gradeItem">{{i18n.evaluation}}<text class="fraction">87.7</text>
    </view>
    <view class="gradeItem">{{i18n.evaluation}}<text class="fraction">87.7</text>
    </view>
  </view>

  <!-- 其他信息 -->
  <view class="other">
    <view class="otherItem">
      <text class="itemContent">{{i18n.contactCustomerService}}</text>
      <image class="otherIcon" src></image>
    </view>
    <view class="otherItem">
      <text class="itemContent">{{i18n.certificateInformation}}</text>
      <image class="otherIcon" src></image>
    </view>
  </view>
    <view class="shopDetails">
    <view class="otherItem">
      <text class="itemContent">{{i18n.storeProfile}}</text>
      <view>{{i18n.yamiSelfSupermarket}}</view>
    
    </view>
    <view class="otherItem">
      <text class="itemContent">{{i18n.openingTime}}</text>
     <view>{{i18n.openingTime1}}</view>
    </view>
  </view>
</view>
</template>

<script>
// pages/shopInfo/shopInfo.js
var http = require("../../../utils/http.js");

export default {
  data() {
    return {
      shopInfo: {}
    };
  },

  components: {},
  props: {},
  
  computed:{
  	i18n() {
  		return this.$t('index')
  	}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.getShopInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
	  //头部导航标题
	  uni.setNavigationBarTitle({
	      title:this.i18n.storeInformation
	  });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  methods: {
    // 获取店铺详情
    getShopInfo: function () {
      var ths = this; //热门搜索

      var params = {
        url: "/shop/headInfo",
        method: "GET",
        data: {
          shopId: 1
        },
        callBack: function (res) {
          // console.log(res)
          ths.setData({
            shopInfo: res
          });
        }
      };
      http.request(params);
    }
  }
};
</script>
<style>
@import "./shopInfo.css";
</style>