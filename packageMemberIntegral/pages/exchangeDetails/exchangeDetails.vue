<template>
<!-- 兑换详情 -->
<!--pages/exchangeDetails/exchangeDetails.wxml-->
<view class="exchange-details">
  <!-- 兑换商品详情 -->
  <view class="exhcange-prod-detail">
    <view class="ex-prod-img">
      <image :src="product.pic"></image>
    </view>
    <view class="ex-info">
      <view class="ex-info-top">
        <view class="info-lfet-top">{{product.prodName}}</view>
        <view class="info-lfet-bottom">{{i18n.recent30Days}}{{product.soldNum}}{{i18n.itemFen}}</view>
      </view>
    </view>
    <view class="ex-info-bottom">
      <view class="info-num">{{product.scorePrice}}</view>
      <view class="info-text">{{i18n.integral}}</view>
      <view class="info-price">+￥9.9~￥19.9</view>
    </view>
  </view>

  <!-- 权益介绍 -->
  <view class="inviolable-rights">
    <view class="inv-tit">{{i18n.productIntroduction}}</view>
    <view class="inv-det">
      <!-- <view class="inv-det-tit">使用规则</view> -->
      <view class="inv-det-con">{{product.brief}}</view>
    </view>
  </view>

  <!-- 立即兑换 -->
  <view class="foot-out-box">
    <view class="redeem-now">
      <view class="redeem-now-btn">{{i18n.redeemNow}}</view>
    </view>
  </view>

</view>
</template>

<script>
// pages/exchangeDetails/exchangeDetails.js
var http = require("../../../utils/http.js");

export default {
  data() {
    return {
      prodId: 0,
      product: []
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
    this.setData({
      prodId: options.prodId
    });
    this.getProd();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

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
    getProd: function () {
      //获取积分商品信息
      var params = {
        url: "/prod/prodInfo",
        method: "GET",
        data: {
          prodId: this.prodId
        },
        callBack: res => {
          this.setData({
            product: res
          });
          console.log("id", this.prodId);
          console.log("prod", this.product);
        }
      };
      http.request(params);
    },
    compare: function () {}
  }
};
</script>
<style>
@import "./exchangeDetails.css";
</style>