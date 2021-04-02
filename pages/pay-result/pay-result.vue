<template>
  <!--pages/pay-result/pay-result.wxml-->
  <view class="container">
    <!-- 失败 -->
    <view v-if="sts == 0">
      <view class="pay-sts fail">{{i18n.paymentFailed}}</view>
      <view class="tips">
        {{i18n.paymentFailedTips1}}
        <text class="warn">{{i18n.paymentFailedTips2}}</text>
        {{i18n.paymentFailedTips3}}
      </view>
      <view class="tips">{{i18n.paymentFailedTips4}}</view>
      <view class="btns">
        <text class="button checkorder" @tap="toOrderList">{{i18n.checkOrder}}</text>
        <text class="button payagain" @tap="payAgain">{{i18n.payAgain}}</text>
      </view>
    </view>
    <!-- 成功 -->
    <view v-if="sts == 1">
      <view class="pay-sts succ">{{i18n.paymentSuccessful}}</view>
      <view class="tips">{{i18n.thankPurchase}}</view>
      <view class="btns">
        <text class="button checkorder" @tap="toOrderList">{{i18n.checkOrder}}</text>
        <text class="button shopcontinue" @tap="toIndex">{{i18n.continueShopping}}</text>
      </view>
    </view>
  </view>
</template>

<script>
var http = require("../../utils/http.js");
import { PayType, AppType } from "../../utils/constant.js";
import Pay from "../../utils/pay.js";
import util from "../../utils/util.js";
export default {
  data () {
    return {
      sts: 0,
      orderNumbers: '',
      selPayType: '',
      orderType: '', // 订单类型 1团购 2秒杀
			hadUpload: false
    };
  },

  components: {},
  props: {},
  computed: {
    i18n () {
      return this.$t('index')
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      sts: options.sts,
      orderNumbers: options.orderNumbers,
      orderType: options.orderType
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 设置头部导航标题
    uni.setNavigationBarTitle({
      title: this.i18n.paymentResults
    });
		if (this.sts == 1) {
			if (!this.hadUpload) {
				util.tapLog(null,this.orderNumbers, true)
				this.hadUpload = true
			}
		}
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
		this.hadUpload = false
	},

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
    toOrderList: function () {
      let paySts = this.sts == 0 ? 1 : 2
      if (this.orderType == 1) { //团购
        paySts = 0
      }
      this.$Router.replace({
        path: '/pages/orderList/orderList', query: { sts: paySts }
      })
    },
    toIndex: function () {
      this.$Router.pushTab('/pages/index/index')
    },
    payAgain: function () {
      this.$Router.replace({
        path: '/pages/payWay/payWay', query:{ orderNumbers:this.orderNumbers}
      })
    }
  }
};
</script>
<style>
@import "./pay-result.css";
</style>