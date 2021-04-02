<template>
  <view v-if="showPage">
  <!-- 确认订单 -->

  <!-- 参团流程 -->
  <view class="process">

    <view class="process-item choose-prod">
      <view class="process-icon">
        <image src="../../static/images/icon/gift.png"></image>
      </view>
      <view class="process-text">{{i18n.group1}}</view>
    </view>

    <view class="next-icon"><image src="/static/images/icon/more.png"></image></view>

    <view class="process-item invent">
      <view class="process-icon">
        <image src="../../static/images/icon/chat.png"></image>
      </view>
      <view class="process-text">{{i18n.group2}}</view>
    </view>

    <view class="next-icon"><image src="/static/images/icon/more.png"></image></view>

    <view class="process-item full">
      <view class="process-icon">
        <image src="/static/images/icon/enough.png"></image>
      </view>
      <view class="process-text">{{i18n.group3}}</view>
    </view>
  </view>
  <!-- 流程end -->


  <!--地址栏 -->
  <view class="address-box" @tap="toAddrListPage">
    <!-- 地址图标 -->
    <view class="addr-icon"><image src="/static/images/icon/addr.png"></image></view>
    <view class="add-addr" v-if="!userAddrDto">{{i18n.addShippingAddress}}</view>
    <block v-if="userAddrDto">
      <!-- 地址信息 -->
      <view class="recipient clearfix">
        <text class="username">{{userAddrDto.receiver}}</text>
        <text class="cellphone">{{userAddrDto.mobile}}</text>
      </view>
      <view class="addr-text">{{i18n.shippingAddress}}：{{userAddrDto.province}}{{userAddrDto.city}}{{userAddrDto.area}}{{userAddrDto.addr}}</view>
    </block>
    
    <!-- 右箭头 -->
    <view class="more-icon"><image src="/static/images/icon/more.png"></image></view>
    <!-- 下虚线 -->
    <view class="dotted-line"><image src="../../static/images/icon/dotted-line.png"></image></view>
  </view>
  <!--地址栏end -->


  <!-- 商品信息 -->
  <view class="prod-box">
    <!-- <view class="prod-shop">
      <view class="shop-icon"><image src="../../images/icon/shop.png"></image></view>
      <text class="shop-name">笑橙小店190827</text>
    </view> 
    -->
    <!-- 商品信息 -->
    <view class="prod-msg">
      <view class="prod-img">
        <image :src="orderInfo.prodPic"></image>
      </view>
      <view class="prod-text clearfix">
        <view class="prod-name">{{orderInfo.prodName}}</view>
        <view v-if="orderInfo.skuName" class="prod-sku">{{orderInfo.skuName}}</view>
        <view class="prod-price-box">
          <text class="prod-price">￥{{orderInfo.actPrice}}</text>
          <text class="prod-price-del">￥{{orderInfo.price}}</text>
          <text class="prod-amount">x {{orderInfo.prodTotalCount}}</text>
        </view>
      </view>
    </view>
  </view>
  <!-- 商品信息end -->


  <!-- 配送&留言 -->
  <view class="row">
    <!-- <view class="dispatching clearfix">
      <text class="dispatching-tit">配送方式</text>
      <text class="dispatching-way">快递 免运费</text>
    </view> -->
    <view class="live-message">
      <text class="message-tit">{{i18n.buyerMessage}}</text>
      <input class="message-int" maxlength="100" :placeholder="i18n.buyerTips" :value="remarks" @input="onRemarksInput"></input>
    </view>
  </view>
  <!-- 配送&留言 end -->


  <!-- 商品总额 -->
  <view class="sum">
    <view class="cost-box">
      <view class="prod-table clearfix">
        <text class="prod-table-tit">{{orderInfo.hasLeaderPrice?i18n.headPrice:i18n.groupPurchasePrice}}</text>
        <text class="prod-table-way">￥<text v-if="orderInfo.hasLeaderPrice" class="leader-price">{{orderInfo.leaderPrice}} </text><text :class="orderInfo.hasLeaderPrice?'del-line':''">{{orderInfo.prodTotalPrice}}</text></text>
      </view>
      <view class="prod-table clearfix">
        <text class="prod-table-tit">{{i18n.shipping}}</text>
        <text class="prod-table-way">￥{{orderInfo.transfee}}</text>
      </view>
    </view>
    <!-- 合计 -->
    <view class="total-cost">{{i18n.total}}：<text class="total-num">￥{{orderInfo.orderTotalPrice}}</text>
    </view>
  </view>
  <!-- 商品金额 end -->


  <!-- 底部 -->
  <view class="foot-box">
    <view class="foot">
      <view class="total-price">{{i18n.total}}：<text class="total-price-num">￥{{orderInfo.orderTotalPrice}}</text></view>
      <!-- 提交按钮 -->
      <view class="submit-btn" @tap="commitOrder">{{i18n.submitOrders}}</view>
    </view>
  </view>
  <!-- 底部end -->
  </view>
</template>

<script>
// pages/confirmOrder/confirmOrder.js
const http = require("../../../utils/http.js")
const config = require("../../../utils/config.js")
import {PayType,AppType} from "../../../utils/constant.js"
import Pay from "../../../utils/pay.js"

export default {
  data() {
    return {
      orderInfo: {},
      userAddr: null,
      remarks: "",
      userAddrDto: {},
			showPage: false, // 拼团信息展示
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
	      title:this.i18n.makeSureOrder
	  });
	  
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];

    if (currPage.selAddress == "yes") {
      this.setData({
        //将携带的参数赋值
        userAddr: currPage.item
      });
    }

    this.loadOrderData();
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
    onRemarksInput: function (e) {
      this.setData({
        remarks: e.detail.value
      });
    },
    //加载订单数据
    loadOrderData: function () {
      var addrId = 0;

      if (this.userAddr != null) {
        addrId = this.userAddr.addrId;
      }

      uni.showLoading({
        mask: true
      });
      let groupOrderItem = JSON.parse(wx.getStorageSync("groupOrderItem"));
      var params = {
        url: "/api/v1/group/order/confirm",
        method: "POST",
        data: {
          addrId: addrId,
          groupSkuId: groupOrderItem.groupSkuId,
          groupTeamId: groupOrderItem.groupTeamId,
          prodCount: groupOrderItem.prodCount
        },
        callBack: res => {
          uni.hideLoading();
          this.setData({
            orderInfo: res,
            userAddrDto: res.userAddrDto
          });
					this.showPage = true
        },
        errCallBack: errRes => {
          uni.showModal({
          	showCancel:false,
						title:this.i18n.tips,
						content:errRes.data,
						cancelText: this.i18n.cancel,
						confirmText: this.i18n.confirm,
						success: successRes => {
							if(successRes.confirm){
								uni.navigateBack({
									delta: 1,
								})
							}
						}
          })
        }
      };
      http.request(params);
    },

    // 提交订单
    commitOrder() {
      uni.showLoading();
      var orderShopParam = {
        remarks: this.remarks
      };
      http.request({
        url: `/api/v1/group/order/submit`,
        method: 'POST',
        data: orderShopParam,
        callBack: res => {
					uni.redirectTo({
						url: '/pages/payWay/payWay?orderNumbers=' + res.orderNumbers
					});
          // this.calWeixinPay(res.orderNumbers);
        },
				errCallBack: errRes => {
					uni.showModal({
						title: this.i18n.tips,
						content: errRes.data,
						confirmText: this.i18n.confirm,
						showCancel: false,
						success: (errModSuccess) => {
							if (errModSuccess.confirm) {
								uni.navigateBack({
									delta: 1,
								})
							}
						}
					})
				}
      });
    },

    /**
     * 唤起微信支付
     */
    calWeixinPay: function (orderNumbers) {
      const isOA = uni.getStorageSync('appType') == AppType.MP; // 是否微信内环境
      var payType= isOA ? PayType.WECHATPAY_MP : PayType.WECHATPAY_H5
      Pay.toOrderPay(payType,orderNumbers)
    },

    /**
     * 去地址页面
     */
    toAddrListPage: function () {
      uni.navigateTo({
        url: '/pages/delivery-address/delivery-address?order=0'
      });
    }
  }
};
</script>
<style>
@import "./groupConfirmOrder.css";
</style>