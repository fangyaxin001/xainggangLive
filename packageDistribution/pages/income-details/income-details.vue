<template>
  <!--pages/income-details/income-details.wxml-->
  <view class="container">
    <view>
      <view class="income-detail">
        <view class="gather-income">
          <view class="title">{{i18n.cumulativeIncome}}</view>
          <view class="number">{{wxs.toPrice(addupAmount)}}</view>
        </view>
        <view class="income-item">
          <view class="items">
            <view>{{i18n.availableBalance}}</view>
            <view>{{wxs.toPrice(settledAmount)}}</view>
          </view>
          <view class="items">
            <view>{{i18n.toBeSettled}}</view>
            <view>{{wxs.toPrice(unsettledAmount)}}</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 收益明细 -->
    <view class="income-block">
      <view class="block-title">
        <view>{{i18n.monthEarnings}}：￥{{wxs.toPrice(monthAmount)}}</view>
        <view>{{i18n.todayEarnings}}：￥{{wxs.toPrice(todayAmount)}}</view>
      </view>

      <view class="block-lists">
        <block v-for="(item, id) in records" :key="id">
          <view class="list-item">
            <view class="tit">
              <view class="tit-left">
                <!-- 0其他、1一代奖励、2二代奖励、3邀请奖励 -->
                <text class="origin" v-if="item.incomeType === 0">{{i18n.other}}</text>
                <text class="origin" v-if="item.incomeType === 1">{{i18n.reward1}}</text>
                <text class="origin" v-if="item.incomeType === 2">{{i18n.reward2}}</text>
                <text class="origin" v-if="item.incomeType === 3">{{i18n.reward3}}</text>
                <view class="date">{{item.updateTime}}</view>
              </view>
              <view class="income-num">
                <text v-if="item.state == -1" class="income-fail">{{wxs.toPrice(item.incomeAmount)}}</text>
                <text v-else>+{{wxs.toPrice(item.incomeAmount)}}</text>
                <text class="origin-status">{{item.state==-1?i18n.incomeExpired:(item.state==2?i18n.settled:i18n.unsettlement)}}</text>
              </view>
            </view>
          </view>
        </block>
      </view>

      <view class="empty" v-if="records.length==0">{{emptyMsg}}</view>
      <view class="loading" v-if="totalPage>1">{{loadingMsg}}</view>
    </view>
  </view>
</template>

<script module="wxs" lang="wxs" src="../../../wxs/number.wxs"></script>

<script>
// pages/income-details/income-details.js
var http = require("../../../utils/http.js");

export default {
  data () {
    return {
      "unsettledAmount": 0,
      // 待结算金额
      "settledAmount": 0,
      // 可提现金额
      "invalidAmount": 0,
      // 已失效金额
      "addupAmount": 0,
      // 累计收益
      "monthAmount": 0,
      // 本月收益
      "todayAmount": 0,
      // 今日收益
      records: [],
      // loadingMsg: i18n.loading,
	  loadingMsg: "",
      emptyMsg: "",
      totalPage: 1,
      pageNum: 1
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
  onLoad: function (options) { },

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
	      title:this.i18n.incomeBreakdown
	  });
	  
	  this.loadingMsg = this.i18n.loading,
	  
    // 获取钱包数据
    this.getDisWalletData(); // 获取收益数据

    this.getDisIncomeData(); // 获取收益列表

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
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.pageNum < this.totalPage) {
      this.loadPageData(this.pageNum + 1);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () { },
  methods: {
    /**
     * 获取我的钱包信息
     */
    getDisWalletData: function () {
      var ths = this;
      uni.showLoading();
      var params = {
        url: "/api/v1/distribution/wallet/info",
        method: "GET",
        // data: {
        //   shopId: 1
        // },
        callBack: function (res) {
          uni.hideLoading()
          ths.setData({
            "unsettledAmount": res.unsettledAmount,
            "settledAmount": res.settledAmount,
            "invalidAmount": res.invalidAmount,
            "addupAmount": res.addupAmount
          });
        }
      };
      http.request(params);
    },

    /**
     * 获取用户本月收益和今日收益
     */
    getDisIncomeData: function () {
      var ths = this;
      uni.showLoading();
      var params = {
        url: "/api/v1/distribution/income/statistics",
        method: "GET",
        // data: {
        //   shopId: 1
        // },
        callBack: function (res) {
          uni.hideLoading()
          ths.setData({
            "todayAmount": res.todayAmount,
            "monthAmount": res.monthAmount
          });
        }
      };
      http.request(params);
    },

    /**
     * 收入列表
     */
    loadPageData: function (pageNum) {
      var ths = this;
      var params = {
        url: "/api/v1/distribution/income/page",
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
          this.setData({
            records: records,
            totalPage: res.pages,
            pageNum: pageNum,
            loadingMsg: loadingMsg,
            emptyMsg: ths.i18n.noProfitToday
          });
        }
      };
      http.request(params);
    }
  }
};
</script>
<style>
@import "./income-details.css";
</style>
