<template> 
  <view class="wallet-container">
	  <u-navbar title="我的錢包" :background="{background:'#191129'}" title-color="#ffffff" :border-bottom="false" back-icon-color="#ffffff"></u-navbar>
    <!-- 余额 -->
    <view class="wallet-info">
		<view class="wallet-info-img">
			<view class="w-banner">
			  <view class="w-tit">縱餘額</view>
			  <view class="w-num">
				  <view class="">
				  	<image style="width: 24rpx;height: 22rpx;"   src="../../static/images/proneler/vv.png" mode=""></image>
				  </view>
				  <view style="margin-left: 10rpx;">
				  	HK$ 50.00
				  </view>
			  </view>
			</view>
			<view class="recharge-btn">
			  <view class="btn" @tap="toRechargeBalance">充值</view>
			</view>
		</view>
      
    </view>
    <!-- 明细 -->
    <view class="wallet-detail">
      <view class="det-tit">餘額明細</view>
      <view class="det-list">
       <view class="det-list-item" v-for="(item,index) in 3" :key="index"> 
		   <view > 訂購付款</view>
       	<view :class=" index == 0 ? 'itemstyle' : '' " style="font-size: 32rpx;"><text style="font-size: 24rpx;">+HK$</text> 50.00</view>
       </view>
	   
      </view>
    </view>
    <!-- 空 -->
    <!-- <view class="list-empty" v-if="!walletList.length">{{i18n.noBalanceDetails}}</view> -->
    <!-- 加载完成 -->
    <!-- <view class="all-load" v-if="walletList.length > 8 && loadAll">{{i18n.endTips}}</view> -->
  </view>
</template>

<script module="wxs" lang="wxs" src="../../wxs/number.wxs"></script>

<script>
var http = require("../../utils/http.js");
export default {
  data () {
    return {
      balance: 0,
      walletList: [],
      current: 1,
      size: 20,
      pages: 1,
      loadAll: false,
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
  onLoad: function(options) {
    this.queryBalance() //请求余额
    this.queryWalletDetailed() //请求明细
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.current < this.pages) {
      this.setData({
        current: this.current + 1
      })
      this.queryWalletDetailed()
    } else {
      this.setData({
        loadAll: true
      })
    }
    console.log('明细列表：',this.walletList)
  },

  methods: {
    /**
     * 请求余额
     */
    queryBalance: function() {
      var params = {
        url: '/api/v1/userBalance/getBalanceInfo',
        method: 'GET',
        data: {},
        callBack: res => {
          this.balance = res
        }
      };
      http.request(params)
    },

    
    /**
     * 请求余额明细
     */
    queryWalletDetailed: function() {
      var params = {
        url: '/api/v1/userBalanceLog/log',
        method: 'GET',
        data: {
          current: this.current,
          size: this.size
        },
        callBack: res => {
          this.walletList = res.current == 1 ? res.records : this.walletList.concat(res.records)
          this.pages = res.pages
          this.current = res.current
        }
      };
      http.request(params)
    },


    // 跳转余额充值
    toRechargeBalance: function() {
      uni.navigateTo({
        url: '/pages/rechargeBalance/rechargeBalance',
      });
    }

  }
}
</script>

<style>
@import "./myWallet.css";
page{
	background-color: #F7F7F7;
}
</style>