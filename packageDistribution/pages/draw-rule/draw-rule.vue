<template>
<!--pages/draw-rule/draw-rule.wxml-->
<view class="container">
  <view class="withdrawal">
    <view class="title">{{i18n.WithdrawalRules}}</view>
    <view class="rule-block">
      <!-- <text class='tip'>1.单次提现额度不得低于100元</text>
      <text class='tip'>2.提现后3-7天内到账</text>
      <text class='tip'>3.每个用户同时只能发起1笔提现订单</text>
      <text class='tip'>4.必须先设置提现银行卡</text> -->
      <text class="tip">{{i18n.WithdrawalRules1}}{{amountMin}}{{i18n.yuan}}</text>
      <text class="tip">{{i18n.WithdrawalRules2}}{{amountMax}}{{i18n.yuan}}</text>
      <text class="tip" v-if="frequency==-1">{{i18n.WithdrawalRules3}}</text>
      <text class="tip" v-else>{{i18n.WithdrawalRules31}}{{frequency}}{{i18n.WithdrawalRules32}}{{number}}{{i18n.WithdrawalRules33}}</text>
      <text class="tip">4.{{paymentExplain}}</text>
    </view>
  </view>
</view>
</template>

<script>
// pages/draw-rule/draw-rule.js
var http = require("../../../utils/http.js");

export default {
  data() {
    return {
      "frequency": 0,
      //提现频率(天)
      "number": 0,
      //提现次数(N天N次)
      "amountMax": 0,
      //单笔提现最高
      "amountMin": 0,
      //单笔提现最低     
      "paymentExplain": '' //打款说明
      ,
      frequency: "",
      amountMax: "",
      amountMin: "",
      number: "",
      paymentExplain: ""
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
  onLoad: function (options) {},

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
	      title:this.i18n.WithdrawalRules
	  });
	  
    this.loadWithdrawCashRule();
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
    /**
     * 加载提现规则
     */
    loadWithdrawCashRule: function () {
      var ths = this;
      uni.showLoading();
      var params = {
        url: "/api/v1/distribution/withdrawCash/info",
        method: "GET",
        // data: {
        //   shopId: 1
        // },
        callBack: function (res) {
          uni.hideLoading()          
					ths.setData({
            frequency: res.frequency,
            amountMax: res.amountMax,
            amountMin: res.amountMin,
            number: res.number,
            paymentExplain: res.paymentExplain
          });
        }
      };
      http.request(params);
    }
  }
};
</script>
<style>
@import "./draw-rule.css";
</style>