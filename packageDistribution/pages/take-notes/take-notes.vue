<template>
  <!--pages/take-notes/take-notes.wxml-->
  <view class="container">
    <view class="empty" v-if="!records">{{i18n.noRecords}}</view>
    <view class="take-notes">
      <view class="total">
        <text>{{i18n.totalWithdrawal}}：</text>
        <text class="total-num">￥{{wxs.toPrice(totalWithdrawCash)}}</text>
      </view>
      <block v-for="(item, id) in records" :key="id">
        <view class="items">
          <view class="left">
            <!-- <view class='text' wx:if="{{item.moneyFlow==0}}">微信红包</view>
            <view class='text' wx:if="{{item.moneyFlow==1}}">企业支付</view>-->
            <view class="text">{{i18n.wechatPayment}}</view>
            <view class="date">{{item.createTime}}</view>
          </view>
          <view class="right">
            <view class="number">+ {{wxs.toPrice(item.amount)}}</view>
            <view class="status" v-if="item.state==-1">{{i18n.theFallback}}</view>
            <view class="status" v-if="item.state==0">{{i18n.withdrawing}}</view>
            <view class="status" v-if="item.state==1">{{i18n.hasArrived}}</view>
          </view>
        </view>
      </block>
      <view class="empty" v-if="records.length==0">{{emptyMsg}}</view>
      <view class="loading" v-if="totalPage>1">{{loadingMsg}}</view>
    </view>
  </view>
</template>

<script module="wxs" lang="wxs" src="../../../wxs/number.wxs"></script>

<script>
// pages/take-notes/take-notes.js
var http = require("../../../utils/http.js");

export default {
  data () {
    return {
      totalWithdrawCash: 0,
      records: [],
      // loadingMsg: this.i18n.loading,
	  loadingMsg: "",
      emptyMsg: "",
      totalPage: 1,
      pageNum: 1,
      current: ""
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
	  this.loadingMsg = this.i18n.loading
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
	      title:this.i18n.withdrawalsRecord
	  });
	  
    this.getTotalWithdrawCash();
    this.loadPageData(1);
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
  onPullDownRefresh: function () {
    if (this.current < this.pages) {
      this.setData({
        current: this.current + 1
      });
      this.getWithdrawCashPage();
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.pageNum < this.totalPage) {
      this.loadPageData(this.pageNum + 1);
    }
  },
  methods: {
    /**
     * 获取提现总金额
     */
    getTotalWithdrawCash: function () {
      var ths = this;
      uni.showLoading();
      var params = {
        url: "/api/v1/distribution/withdrawCash/totalWithdrawCash",
        method: "GET",
        // data: {
        //   shopId: 1
        // },
        callBack: function (res) {
          uni.hideLoading()
          ths.setData({
            totalWithdrawCash: res
          });
        }
      };
      http.request(params);
    },

    /**
     * 分页获取提现记录
     */
    loadPageData: function (pageNum) {
      var ths = this;
      uni.showLoading();
      var params = {
        url: "/api/v1/distribution/withdrawCash/page",
        method: "GET",
        data: {
          // shopId: 1,
          current: pageNum,
          size: 20
        },
        callBack: res => {
          uni.hideLoading()
          var records = [];

          if (res.current == 1) {
            records = res.records;
          } else {
            records = this.records.concat(res.records);
          }

          var loadingMsg = this.loadingMsg;

          if (pageNum == res.pages) {
            loadingMsg = ths.i18n.noMore;
          }

          console.log(res);
          ths.setData({
            records: records,
            totalPage: res.pages,
            pageNum: pageNum,
            loadingMsg: loadingMsg,
            emptyMsg: ths.i18n.noWithdrawalRecord
          });
        }
      };
      http.request(params);
    }
  }
};
</script>
<style>
@import "./take-notes.css";
</style>