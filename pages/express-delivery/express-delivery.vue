<template>
<!--pages/express-delivery/express-delivery.wxml-->
<!-- 物流信息 -->
<view class="container">
  <view class="wrapper">
    <view class="deliveryInfo" style="background:url(http://jiales.gz-yami.com/delivery-bg.png) center center no-repeat #fff;">
      <view class="icon-express" style="background:url(http://jiales.gz-yami.com/delivery-car.png) no-repeat;background-size:100% 100%;">
      </view>
      <view class="infoWarp">
        <view class="companyname">
          <text class="key">{{i18n.logisticsCompany}}：</text>
          <text class="value">{{companyName}}</text>
        </view>
        <view class="expno">
          <text class="key">{{i18n.waybillNumber}}：</text>
          <text class="value">{{dvyFlowId}}</text>
        </view>
      </view>
    </view>
    <view class="deliveryDetail">
      <block v-for="(item, index) in dvyData" :key="index">
        <view :class="'detailItem ' + (index==0?'lastest':'')">
          <view class="dot">
            <image src="/static/images/icon/delive-dot.png"></image>
            <image src="/static/images/icon/dot.png"></image>
          </view>
          <view class="detail">
            <view class="desc">{{item.acceptStation}}</view>
            <view class="time">{{item.acceptTime}}</view>
          </view>
        </view>
      </block>
      <block v-for="(item, index) in _dvyData" :key="index">
      
        <view :class="'detailItem ' + (index==0?'lastest':'')">
          <view class="dot">
            <image src="/static/images/icon/delive-dot.png"></image>
            <image src="/static/images/icon/dot.png"></image>
          </view>
          <view class="detail">
            <view class="desc">{{item.context}}</view>
            <view class="time">{{item.time}}</view>
          </view>
        </view>
      </block>
    </view>
  </view>
</view>
</template>

<script>
// pages/express-delivery/express-delivery.js
var http = require("../../utils/http.js");

export default {
  data() {
    return {
      companyName: "",
      dvyFlowId: "",
      dvyData: [],
      _dvyData: [] // 查询不到物流信息时展示的信息

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
    var ths = this;
    uni.showLoading();
    var params = {
      url: "/api/v1/delivery/check",
      method: "GET",
      data: {
        orderNumber: options.orderNum
      },
      callBack: function (res) {
        if (res.traces) {
          ths.setData({
            companyName: res.companyName,
            dvyFlowId: res.dvyFlowId,
            dvyData: res.traces.reverse()
          });
        } else {
          ths.setData({
            companyName: res.companyName,
            dvyFlowId: res.dvyFlowId,
            _dvyData: res.data
          });
        }

        uni.hideLoading()      }
    };
    http.request(params);
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
  methods: {}
};
</script>
<style>
@import "./express-delivery.css";
</style>