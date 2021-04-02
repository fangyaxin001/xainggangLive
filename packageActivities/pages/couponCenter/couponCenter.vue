<template>
<view class="container">
  <view class="coupons">
    <view class="banner">
      <view class="bg"><image src="../../static/images/icon/coupon-bg.png"></image></view>
      <view class="img"><image src="../../static/images/icon/coupon-banner.png"></image></view>
    </view>
    <view class="con-box">
      <view class="c-tit" v-if="couponList.length">{{i18n.universalCoupon}}</view>
      <scroll-view scroll-x="true" class="general-box" v-if="couponList.length">
        <view class="general">
          <view class="item" v-for="(item, index) in couponList" :key="item.couponId">
           <view :class="'item-box ' + ((item.canGoUse) ? 'received' : (!item.stocks ? 'robbed' : '') )">
            <view class="item-con">
              <view class="number" v-if="item.couponType == 1">
                <view class="symbol">￥</view>
                <view class="text">{{item.reduceAmount}}</view>
              </view>
              <view class="number" v-if="item.couponType == 2">
                <view class="text">{{item.couponDiscount}}</view>
                <view class="symbol">{{i18n.discount}}</view>
              </view>
              <view class="condition">{{i18n.available}}{{item.cashCondition}}{{i18n.availableUse}}</view>
              <view class="scope" v-if="item.suitableProdType == 0">{{i18n.universalAll}}</view>
              <view class="scope" v-if="item.suitableProdType != 0">{{i18n.universalOnly}}</view>
              <view class="progress-box">
                <view class="text" v-if="item.stocks == 0">{{i18n.nocoupons}}</view>
                <view class="text" v-if="item.stocks != 0">{{i18n.haveCoupons}}{{wxs.rounding((item.sourceStock - item.stocks) * 100 / item.sourceStock)}}%</view>
                <view class="progress" :style="'width: ' + (wxs.rounding((item.sourceStock - item.stocks) * 100 / item.sourceStock)) + '%'"></view>
              </view>
            </view>
            <view class="item-btn" v-if="!item.canGoUse && item.stocks" :data-couponid="item.couponId" data-coupontype="1" :data-couponindex="index" @tap="receiveCoupon">{{i18n.getIt}}</view>
            <view class="item-btn" v-if="item.canGoUse" :data-couponid="item.couponId" @tap="useCoupon">{{i18n.toUse}}</view>
            <view class="item-btn" v-if="!item.canGoUse && !item.stocks">{{i18n.nocoupons1}}</view>
            <view class="icon" v-if="item.canGoUse"><image src="../../static/images/icon/coupon-received.png"></image></view>
            <view class="icon" v-if="!item.canGoUse && !item.stocks"><image src="../../static/images/icon/coupon-robbed.png"></image></view>
           </view>
          </view>
        </view>
      </scroll-view>
      <view class="c-tit" v-if="prodCouponList.length">{{i18n.recommendCoupons}}</view>
      <view class="special" v-if="prodCouponList.length">
        <view class="item" v-for="(item, index) in prodCouponList" :key="item.couponId">
          <view :class="'item-box ' + ((item.canGoUse) ? 'received' : (!item.stocks ? 'robbed' : ''))">
            <!-- 多商品券 -->
            <view class="item-con" v-if="item.prods.length > 1">
              <view class="shop-msg">
                <view class="logo"><image :src="item.shopLogo"></image></view>
                <view class="name">{{item.shopName}}</view>
              </view>
              <view class="prod-msg">
                <view class="p-item" v-for="(prod, prodIndex) in item.prods" :key="prodIndex">
                  <view class="img"><image :src="prod.pic"></image></view>
                  <view class="price">￥{{prod.price}}</view>
                </view>
              </view>
            </view>
            <view class="item-btn" v-if="item.prods.length > 1">
              <view class="btn-box">
                <view class="number" v-if="item.couponType == 1">
                  <view class="symbol">￥</view>
                  <view class="text">{{item.reduceAmount}}</view>
                </view>
                <view class="number" v-if="item.couponType == 2">
                  <view class="text">{{item.couponDiscount}}</view>
                  <view class="symbol">{{i18n.discount}}</view>
                </view>
                <view class="condition">{{i18n.available}}{{item.cashCondition}}{{i18n.availableUse}}</view>
                <view class="progress-box">
                  <view class="text" v-if="item.stocks == 0">{{i18n.nocoupons}}</view>
                  <view class="text" v-if="item.stocks != 0">{{i18n.haveCoupons}}{{wxs.rounding((item.sourceStock - item.stocks) * 100 / item.sourceStock)}}%</view>
                  <view class="progress" :style="'width: ' + (wxs.rounding((item.sourceStock - item.stocks) * 100 / item.sourceStock)) + '%'"></view>
                </view>
                <view class="btn" v-if="!item.canGoUse && item.stocks" :data-couponid="item.couponId" data-coupontype="2" :data-couponindex="index" @tap="receiveCoupon">{{i18n.getIt}}</view>
                <view class="btn" v-if="item.canGoUse" :data-couponid="item.couponId" :data-prodlist="item.prods" @tap="useCoupon">{{i18n.toUse}}</view>
                <view class="btn" v-if="!item.canGoUse && !item.stocks">{{i18n.nocoupons}}</view>
              </view>
            </view>
            <!-- /多商品券 -->
            <!-- 单商品券 -->
            <view class="left" v-if="item.prods.length == 1">
              <view class="img"><image :src="item.prods[0].pic"></image></view>
              <view class="text-box">
                <view class="goods-name">{{item.prods[0].prodName}}</view>
                <view class="coupon-number">
                  <view class="number" v-if="item.couponType == 1">
                    <view class="symbol">￥</view>
                    <view class="text">{{item.reduceAmount}}</view>
                  </view>
                  <view class="number" v-if="item.couponType == 2">
                    <view class="text">{{item.couponDiscount}}</view>
                    <view class="symbol">{{i18n.discount}}</view>
                  </view>
                </view>
								<view class="condition">{{i18n.available}}{{item.cashCondition}}{{i18n.availableUse}}</view>
              </view>
            </view>
            <view class="right" v-if="item.prods.length == 1">
              <view class="btn-box">
                <view class="progress-text" v-if="item.stocks == 0">{{i18n.nocoupons}}</view>
                <view class="progress-text" v-if="item.stocks != 0">{{i18n.haveCoupons}}{{wxs.rounding((item.sourceStock - item.stocks) * 100 / item.sourceStock)}}%</view>
                <view class="progress-box">
                  <view class="progress" :style="'width: ' + (wxs.rounding((item.sourceStock - item.stocks) * 100 / item.sourceStock)) + '%'"></view>
                </view>
                <view class="btn" v-if="!item.canGoUse && item.stocks" :data-couponid="item.couponId" data-coupontype="2" :data-couponindex="index" @tap="receiveCoupon">{{i18n.getIt}}</view>
                <view class="btn" v-if="item.canGoUse" :data-couponid="item.couponId" :data-prodlist="item.prods" @tap="useCoupon">{{i18n.toUse}}</view>
                <view class="btn" v-if="!item.canGoUse && !item.stocks">{{i18n.nocoupons}}</view>
              </view>
            </view>
            <!-- /单商品券 -->
            <!-- 已领取 -->
            <view class="icon" v-if="item.canGoUse || item.userHasCount == 0"><image src="../../static/images/icon/coupon-received.png"></image></view>
            <view v-else>
            	<view class="icon" v-if="!item.canGoUse && !item.stocks"><image src="../../static/images/icon/coupon-robbed.png"></image></view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="loadall" v-if="prodCouponList.length > 10 && loadAll">{{i18n.endTips}}</view>

    <!-- 空 -->
    <view class="empty" v-if="couponList.length==0 && prodCouponList.length==0">
      <view class="empty-icon">
        <image src="/static/images/icon/empty.png"></image>
      </view>
      <view class="empty-text">{{i18n.merchantCoupon}}</view>
    </view>
  </view>
</view>
</template>

<script module="wxs" lang="wxs" src="../../../wxs/number.wxs"></script>

<script>
// pages/couponCenter/couponCenter.js
var http = require("../../../utils/http.js");
var config = require("../../../utils/config.js");
var util = require("../../../utils/util.js");

export default {
  data() {
    return {
      couponList: [],
      // 通用券列表
      prodCouponList: [],
      // 商品券列表
      selectedCouponId: 0,
      // 要领取的优惠券id
      current: 1,
      size: 20,
      // 当前页数
      pages: 1, // 总页数
      loadAll: false, // 已加载全部
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
  onLoad: function (options) {//获取通用列表
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
	      title:this.i18n.couponCenter
	  });
	  
    this.getCouponList();
    this.getProdCouponList(1);
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},

  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom: function () {
    if (this.current < this.pages) {
      this.getProdCouponList(this.current + 1);
    }else {
      this.setData({
        loadAll: true
      })
    }
  },
  methods: {
    /**
     * 获取通用列表
     */
    getCouponList() {
      var params = {
        url: "/api/v1/myCoupon/generalCouponList",
        method: "GET",
        callBack: res => {
          this.initCouponCanGoUseFlag(res);
          this.setData({
            couponList: res
          });
        }
      };
      http.request(params);
    },

    /**
     * 获取指定商品券
     */
    getProdCouponList(cur) {
      var params = {
        url: "/api/v1/myCoupon/getCouponPage",
        method: "GET",
        data: {
          current: cur,
          size: this.size
        },
        callBack: res => {
          this.initCouponCanGoUseFlag(res.records);
          let list = [];

          if (res.current == 1) {
            list = res.records;
          } else {
            list = this.prodCouponList;
            list = list.concat(res.records);
          }

          this.setData({
            prodCouponList: list,
            pages: res.pages,
            current: res.current
          });
        }
      };
      http.request(params);
    },

    /**
     * 初始化优惠券去可以使用的标记
     */
    initCouponCanGoUseFlag(couponList) {
      couponList.forEach(coupon => {
        coupon.canGoUse = coupon.curUserReceiveCount >= coupon.limitNum;
				// coupon.canGoUse = coupon.curUserReceiveCount >= coupon.limitNum && coupon.userHasCount > 0;
      });
    },

    /**
     * 设置优惠券去可以使用的标记
     */
    setCouponCanGoUseFlag(index, couponType) {
      if (couponType == 1) {
        var tempCouponList = this.couponList;
        tempCouponList[index].canGoUse = true;
        tempCouponList[index].stocks -= 1;
        this.setData({
          couponList: tempCouponList
        });
      } else if (couponType == 2) {
        var tempCouponList = this.prodCouponList;
        tempCouponList[index].canGoUse = true;
        tempCouponList[index].stocks -= 1;
        this.setData({
          prodCouponList: tempCouponList
        });
      }
    },

    /**
     * 立即领取
     */
    receiveCoupon(e) {
      this.setData({
        selectedCouponId: e.currentTarget.dataset.couponid
      });
      util.checkAuthInfo(() => {
        var ths = this;

        if (ths.selectedCouponId) {
          uni.showLoading();
          http.request({
            url: "/api/v1/myCoupon/receive",
            method: "POST",
            data: ths.selectedCouponId,
            callBack: data => {
              uni.hideLoading()              
							uni.showToast({
                title: ths.i18n.successfullyReceived,
                icon: 'success',
                duration: 2000
              });
              this.setCouponCanGoUseFlag(e.currentTarget.dataset.couponindex, e.currentTarget.dataset.coupontype);
            }
          });
        }
      });
    },

    /**
     * 立即使用
     */
    useCoupon(e) {
      let url = '/pages/prod-classify/prod-classify?sts=4';
      let couponId = e.currentTarget.dataset.couponid;
      var title = this.i18n.couponEventGoods;
      var prodList = e.currentTarget.dataset.prodlist;

      if (prodList && prodList.length == 1) {
        // uni.navigateTo({
        //   url: '/pages/prod/prod?prodid=' + prodList[0].prodId
        // });
        this.$Router.push({ path: '/pages/prod/prod', query: { prodid: prodList[0].prodId }})
      } else {
        if (couponId) {
          url += "&tagid=" + couponId + "&title=" + title;
        }

        uni.navigateTo({
          url: url
        });
      }
    }

  }
};
</script>
<style>
@import "./couponCenter.css";
</style>