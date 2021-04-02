<template>
<!-- 申请退款（选择退款方式） -->
<!--pages/chooseRefundWay/chooseRefundWay.wxml-->

<view class="page">
  <!-- 头部商品信息 -->
  <view class="top-box">
    <text class="order-number">{{i18n.orderNumber}}：{{refundItem.orderNumber}}</text>
  </view>
  <view class="goods-msg-box" v-if="refundType==2">
    <view class="img-box">
      <image :src="refundItem.pic"></image>
    </view>
    <view class="goods-msg">
      <view class="goods-title">{{refundItem.prodName}}</view>
      <view class="goods-quantity">{{i18n.quantity}}：{{refundItem.prodCount}}{{i18n.piece}}</view>
    </view>
  </view>
  <view v-if="refundType==1">
    <block v-for="(item, index) in refundItem.orderItemDtos" :key="index">
      <view class="refund-goods-item">
        <!-- 图片 -->
        <view class="img-box">
          <image :src="item.pic"></image>
        </view>
        <!-- 信息 -->
        <view class="goods-text">
          <view class="goods-title">{{item.prodName}}</view>
          <view class="goods-quantity">{{i18n.quantity}}：{{item.prodCount}}{{i18n.piece}}</view>
        </view>
      </view>
    </block>
  </view>


  <!-- 选择退款方式 -->
  <view class="choose-refund-way">
    <view class="choose-tit">{{i18n.chooseRefundMethod}}</view>
    <!-- 仅退款 -->
    <view class="refund-way" @tap="toRefundPage" data-type="1">
      <view class="refund-way-tit">{{i18n.refund01}}</view>
      <view class="refund-way-explain">{{i18n.goodsTips1}}</view>
      <view class="enter">
        <image src="/static/images/icon/more.png"></image>
      </view>
    </view>
    <!-- 退货退款 -->
    <view class="refund-way" @tap="toRefundPage" data-type="2">
      <view class="refund-way-tit">{{i18n.refund02}}</view>
      <view class="refund-way-explain">{{i18n.goodsTips2}}</view>
      <view class="enter">
        <image src="/static/images/icon/more.png"></image>
      </view>
    </view>

  </view>


</view>
</template>

<script>

export default {
  data() {
    return {
      refundItem: {},
      refundType: 2, //退款类型 1整单  2单个物品
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
    //拿到上页传来的数据存入本地缓存
    var refundItem = wx.getStorageSync("refundItem");
    console.log(options)
    var refundType = options.refundType   // 退款类型 1整单  2单个物品
    this.setData({
      refundItem: refundItem,
      refundType: refundType
    });
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
	      title:this.i18n.requestRefund
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
    toRefundPage:function(e){
      var type = e.currentTarget.dataset.type;
      console.log(this.refundType)
      uni.redirectTo({ //通过uni.redirectTo实现跳转（关闭当前页面，跳转到应用内某个页面）
        url: '/pages/applyRefund/applyRefund?type='+ type + '&refundType=' + this.refundType,
      })
    },

  }
};
</script>
<style>
@import "./chooseRefundWay.css";
</style>