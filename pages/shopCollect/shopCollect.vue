<template>
<!-- 店铺收藏 -->
<!--pages/shopCollect/shopCollect.wxml-->

<view class="shop-collect">
  <view class="top-fixed">
    <view class="show-shop-num clearfix">
      <view class="shop-num">您收藏了<text class="red">3</text>个店铺</view>
      <view class="editor red">编辑</view>
    </view>
  </view>

  <!-- 店铺 -->
  <view class="shop-item">
    <view class="logo">
      <image src></image>
    </view>
    <view class="shop-name">店铺名称店铺名称店铺名称店铺名称店铺名称</view>
    <view class="self-operate">自营</view>
  </view>

  <view class="shop-item">
    <view class="logo">
      <image src></image>
    </view>
    <view class="shop-name">店铺名称</view>
  </view>

  <!-- 如果无收藏店铺 -->
  <!-- <view class="empty">
    <view class="empty-icon">
      <image src="../../images/icon/empty.png"></image>
    </view>
    <view class="empty-text">您还没有收藏店铺</view>
  </view> -->

</view>
</template>

<script>

export default {
  data() {
    return {};
  },

  components: {},
  props: {},
  
  computed:{
  	i18n() {
  		return this.$t('index')
  	}
  },
  
  onShow: function () {
  	  //头部导航标题
  	  uni.setNavigationBarTitle({
  	      title:this.i18n.collectionShops
  	  });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

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
  methods: {}
};
</script>
<style>
@import "./shopCollect.css";
</style>