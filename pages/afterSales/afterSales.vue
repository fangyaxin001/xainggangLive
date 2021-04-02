<template>
<!-- 退款/售后 -->
<!--pages/afterSales/afterSales.wxml-->
<view class="page">
  <view class="goods-list"> 
    <view class="goods-item" v-for="(item, index) in 3" :key="index">
      <!-- 店铺 -->
     <view class="order-num">
     	<text>訂單編號：{{item.orderNumber}}</text>
     	<view class="order-state">
     		<view class="" style="color: #47D1D1;">
     			<text class="order-tui-state" >退货</text>
     			<text>待審覈</text>
     		</view>
     		
     	</view> 
     </view>
     <block >
     	<block v-for="(prod, prodId) in 1" :key="prodId">
     		<view>
     			<view class="item-cont" @tap="toRefundDetails" :data-ordernum="item.orderNumber">
     				<view class="prod-pic">
     					<image src="../../packageMemberIntegral/static/images/icon/dianjichoujiang@2x.png"></image>
     				</view>
     				<view class="prod-info">
     					<view class="prodname">8888888888</view>
     					<view class="sku-box">
     						<!-- 拼团icon -->
     						<text class="spell-group-icon">
     							<!-- orderType 订单类型(0普通订单 1团购订单 2秒杀订单) -->
     							asadasd
     						</text>
     						<!-- 拼团icon end -->
     						<!-- 配送类型 1:快递 2:自提 3：无需快递) -->
     						<text class="spell-group-icon" v-if="item.dvyType == 2">{{i18n.pickitUp}}</text>
     						<text class="prod-info-cont"2222</text>
     					</view>
     					<view class="price-nums">
     						<text class="prodprice">
     							<text class="symbol" >HK$</text>
     							<text class="big-num" v-if="item.actualTotal">{{wxs.parsePrice(prod.price)[0]}}</text>
     							<text class="small-num" v-if="item.actualTotal">.{{wxs.parsePrice(prod.price)[1]}}</text>
     							<text class="small-num" v-if="item.actualTotal && item.orderType==3" decode="true">&emsp;+&emsp;</text>
     							<text class="small-num" v-if="prod.useScore && item.orderType==3">{{prod.useScore}} {{i18n.integral}}</text>
     						</text>
     						<text class="prodcount">x22</text>
     					</view>
     				</view>
     			</view>
     		</view>
     	</block>
     </block>

      <!-- 退款进度提示 -->
      <view class="goods-item-tips">
        <!-- <view class="rmb-icon"> -->
          <!-- 仅退款 -->
          <!-- <image src="/static/images/icon/rmb-icon.png" v-if="item.applyType == 1"></image> -->
          <!-- 退货退款 -->
          <!-- <image src="/static/images/icon/refunds.png" v-if="item.applyType == 2"></image> -->
        </view>
        <!-- applyType  申请类型:1,仅退款,2退款退货 -->
        <!-- 处理退款状态:(1.买家申请 2.卖家接受 3.买家发货 4.卖家收货 5.退款成功 6.买家撤回申请 7.商家拒绝 -1.退款关闭) -->
       <!-- <view class="refund-type" v-if="item.applyType == 1">{{i18n.refund01}}</view>
        <view class="refund-type" v-if="item.applyType == 2">{{i18n.refund02}}</view>
        <view class="refund-process" v-if="item.returnMoneySts == 1">{{i18n.refund1}}</view>
        <view class="refund-process" v-if="item.returnMoneySts == 2  && item.applyType == 1">{{i18n.refund21}}</view>
        <view class="refund-process" v-if="item.returnMoneySts == 2 && item.applyType == 2">{{i18n.refund22}}</view>
        <view class="refund-process" v-if="item.returnMoneySts == 3 && item.applyType == 2">{{i18n.refund3}}</view>
        <view class="refund-process" v-if="item.returnMoneySts == 4 && item.applyType == 2">{{i18n.refund4}}</view>
        <view class="refund-process" v-if="item.returnMoneySts == 5">{{i18n.refund5}}</view>
        <view class="refund-process" v-if="item.returnMoneySts == 6">{{i18n.refund6}}</view>
        <view class="refund-process" v-if="item.returnMoneySts == 7">{{i18n.refund7}}</view>
		<view class="refund-process" v-if="item.returnMoneySts == -1">{{i18n.refund_1}}</view> -->
	<view style="display: flex;justify-content: flex-end;padding: 20rpx 10rpx;">
		<text  class="button" @tap="onCancelOrder" :data-ordernum="item.orderNumber" hover-class="none">取消訂單</text>
		<!-- <text class="button warn"  bindtap="" data-ordernum="{{item.orderNumber}}" hover-class='none'>再次购买</text> -->
		<text  class="button warn" :data-dvytype="item.dvyType" :data-ordertype="item.orderType" @tap="onPayAgain"
		 :data-ordernum="item.orderNumber" hover-class="none">去付款</text>
	</view>
        
      </view>
      
    </view>

    <!-- <view class="empty" wx:if="{{!list.length}}">您还没有退款/售后订单哦~</view> -->
    <!-- 空 -->
    <view class="empty" v-if="list.length">
      <view class="empty-icon">
        <image src="/static/images/icon/empty.png"></image>
      </view>
      <view class="empty-text">{{i18n.refundEmpty}}</view> 
    </view>
    
  </view>
</view>
</template>

<script>
// pages/afterSales/afterSales.js
var http = require("../../utils/http.js");

export default {
  data() {
    return {
      list: [],
      current: 1,
      pages: 0,
      startTime: '',
      //开始时间
      endTime: '' //结束时间
      //orderItems: '',  //订单项

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
    this.myRefundOrder(); //退款订单列表
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
		title:"退款/售後"
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
  onReachBottom: function () {
    console.log('触底pages:',this.pages)
    if (this.current < this.pages) {
      this.setData({
        current: this.current + 1
      })
      this.myRefundOrder()
    } else {
      this.setData({
        loadAll: true
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  methods: {
    /**
     * 我的退款订单列表
     */
    myRefundOrder: function (e) {
      uni.showLoading();
      var params = {
        url: "/api/v1/orderRefund/list",
        method: "GET",
        data: {
          current: this.current,
          size: 20,
          startTime: this.startTime,
          endTime: this.endTime
        },
        callBack: res => {
          console.log(res);
          var list = []
          if(res.current == 1 ) {
            list = res.records
          }else {
            list = this.list
            list = list.concat(res.records)
          }
          console.log('list:',list)
          this.list = list,
          this.pages = res.pages,
          this.current = res.current
          uni.hideLoading()        
        }
      };
      http.request(params);
    },

    /**
     * 点击查看详情跳转页面
     */
    toRefundDetails: function (e) {
      // var refundSn = e.currentTarget.dataset.refundsn;
      // console.log(refundSn);
      uni.navigateTo({
        url: '/pages/DetailsOfRefund/DetailsOfRefund?refundSn'
      });
    }
  }
};
</script>
<style>
@import "./afterSales.css";
</style>