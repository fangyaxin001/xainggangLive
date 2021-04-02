<template>
<!-- pages/stationOrderList/stationOrderList.wxml -->
<view class="container">
  <view class="main">
    <!-- 订单列表 -->
    <block v-for="(item, shopIndex) in stationList" :key="item.orderNumber">
      <view class="prod-item">
        <!-- 店铺 -->
        <!-- <view class="shop-box">
          <view class="shop-icon">
            <image src="/static/images/icon/shop.png"></image>
          </view>
          <view class="shop-name">{{item.shopName}}</view>
        </view> -->
        <!-- 订单编号 -->
        <view class="order-num">
          <checkbox color="#EF103C" class="check" @tap="orderRadioChange(shopIndex)" :data-shopindex="shopIndex" :checked="item.checked"></checkbox>
          <text>{{i18n.orderNumber}}：{{item.orderNumber}}</text>
          <view class="order-state">
            <text :class="['order-sts' , {red: (item.status < 5) }]">{{['',i18n.toBePaid,i18n.goodsBePicked,i18n.toBeReceived,i18n.toBeEvaluated,i18n.completed,i18n.cancelled,i18n.inAGroup][item.status]}}</text>
            <view class="clear-btn" v-if="item.status==5 || item.status==6">
              <image src="/static/images/icon/clear-his.png" class="clear-list-btn" @tap="delOrderList" :data-ordernum="item.orderNumber"></image>
            </view>
          </view>
        </view>
        <!-- 商品列表 -->
        <!-- 一个订单单个商品的显示 -->
        <block v-for="(prod, prodId) in item.orderItemDtos" :key="prodId">
          <view class="item-cont" @tap="toOrderDetailPage" :data-ordernum="item.orderNumber">
            <view class="prod-pic">
              <image :src="prod.pic"></image>
            </view>
            <view class="prod-info">
              <view class="prodname">{{prod.prodName}}</view>
                <view class="prod-info-cont">{{prod.skuName}}</view>
                <view class="price-nums">
                  <text class="prodprice">
                    <text class="symbol" v-if="item.actualTotal">￥</text>
                    <text class="big-num" v-if="item.actualTotal">{{wxs.parsePrice(prod.price)[0]}}</text>
                    <text class="small-num" v-if="item.actualTotal">.{{wxs.parsePrice(prod.price)[1]}}</text>
                    <text class="small-num" v-if="item.actualTotal && item.orderType==3" decode="true">&emsp;+&emsp;</text>
                    <text class="small-num" v-if="prod.useScore && item.orderType==3">{{prod.useScore}} {{i18n.integral}}</text>
                  </text>
                  <text class="prodcount">x{{prod.prodCount}}</text>
                </view>
              </view>
          </view>
        </block>
        <view class="total-num">
          <view class="spell-group-icon" v-if="item.orderType">
          <!-- orderType 订单类型(0普通订单 1团购订单 2秒杀订单) -->
          {{['',i18n.aGroup,i18n.spike,i18n.integral][item.orderType]}}
          </view>
          <view class="right">
            <view class="prodcount">{{i18n.inTotal}}{{item.productNums}}{{i18n.items}}</view>
            <view class="prodprice">{{i18n.total}}：<text class="symbol" v-if="item.actualTotal">￥</text>
              <text class="big-num" v-if="item.actualTotal">{{wxs.parsePrice(item.actualTotal)[0]}}</text>
              <text class="small-num" v-if="item.actualTotal">.{{wxs.parsePrice(item.actualTotal)[1]}}</text>
              <text class="small-num" v-if="item.actualTotal && item.orderType==3">+</text>
              <text class="small-num" v-if="item.orderType==3">{{item.orderItemDtos[0].useScore}} {{i18n.integral}}</text>
            </view>
          </view>
        </view>
        <!-- end 商品列表 -->
      </view>
    </block>

    <!-- 提交按钮 -->
    <view class="confirm" @tap="confirmRemoval" v-if="stationList.length">{{i18n.confirmPickUp}}</view>
  </view>

  <!-- 空 -->
  <view class="empty" v-if="!stationList.length">
    <view class="empty-icon">
      <image src="/static/images/icon/empty.png"></image>
    </view>
    <view class="empty-text">{{i18n.noOrderTips}}</view>
  </view>

</view>
<!-- end 订单列表 -->
</template>

<script module="wxs" lang="wxs" src="../../wxs/number.wxs"></script>

<script>
var http = require("../../utils/http.js");
var config = require("../../utils/config.js");
	import {PayType,AppType} from "../../utils/constant.js";
	import Pay from "../../utils/pay.js";
export default {
  data() {
    return {
      stationList: [],
      stationId: 2,
      orderNumbers: [], //选中的订单
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
    if (options.stationId) {
      this.stationId = options.stationId
    }
  },

  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
	  //头部导航标题
	  uni.setNavigationBarTitle({
	      title:this.i18n.pickUpOrderList
	  });
	  
    this.loadStationOrderData();
  },

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
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  methods: {
    /**
     * 加载自提点订单数据
     */
    loadStationOrderData: function (sts, current) {
      uni.showLoading(); //加载自提点订单列表
      var params = {
        url: "/api/v1/myStationOrder/getOrderBystationId",
        method: "GET",
        data: {
          stationId: this.stationId
        },
        callBack: (res) => {
          uni.hideLoading()
          this.stationList = res
        },
      };
      http.request(params);
    },

    /**
     * 查看订单详情
     */
    toOrderDetailPage: function (e) {
      // uni.navigateTo({
      //   url: '/pages/order-detail/order-detail?orderNum=' + e.currentTarget.dataset.ordernum
      // });
      this.$Router.push({
        path:'/pages/order-detail/order-detail', query: {orderNum:e.currentTarget.dataset.ordernum}
      })
    },

    /**
     * 订单选择
     */
    orderRadioChange: function(shopIndex) {
      console.log(shopIndex)
      var stationList = this.stationList
      let checked = stationList[shopIndex].checked
      console.log(checked)
      stationList[shopIndex].checked = !checked; // 改变状态
      console.log(stationList[shopIndex].checked)
      let orderNumbers = []
      this.stationList.forEach((el) => {
        if(el.checked) {
          orderNumbers.push(el.orderNumber)
        }
      })
      this.orderNumbers = orderNumbers.join()
      console.log(this.orderNumbers)
    },

    /**
     * 一键取件
     */
    confirmRemoval: function() {
			var ths = this;
      var  orderNumbers = ths.orderNumbers
      if(ths.orderNumbers == "") {
        uni.showToast({
          title: ths.i18n.SelectOrderPickup,
          icon: 'none',
          duration: 1500,
        })
      }else {
        uni.showModal({
          title: ths.i18n.tips,
          content: ths.i18n.confirmPickUpTips,
					cancelText: ths.i18n.cancel,
					confirmText: ths.i18n.confirm,
					confirmColor: '#E43130',
          success: (res) => {
              if (res.confirm) {
                uni.showLoading();
                var params = {
                  url: "/api/v1/myStationOrder/orderStationByOrderNumber",
                  method: "PUT",
                  data: orderNumbers,
                  callBack: () => {
                    uni.hideLoading()            
                    uni.showToast({
                      title: ths.i18n.pickUpSuccessfully,
                      icon: 'none',
                      duration: 1500,
                    })
										ths.setData({
											orderNumbers: []
										})
                    setTimeout(() => {
											ths.loadStationOrderData()
                    }, 1500);
                  }
                };
                http.request(params);
              } else if (res.cancel) {
                // console.log('用户点击取消');
              }
          }
        });
      }
    },

  }
};
</script>
<style>
@import "./stationOrderList.css";
</style>