<template>
<!-- pages/discountDetail/discountDetail.wxml -->
<view class="discount-detail">
  <view :class="['banner' , discountDetail.mobilePic ? '' : 'no-bg']">
    <image class="bg" :src="discountDetail.mobilePic"></image>
    <view class="text-box">
      <view class="time">
        <view class="text">{{i18n.endOfDistance}}</view>
        <view class="number">{{hour}}</view>
        <view class="colon">:</view>
        <view class="number">{{min}}</view>
        <view class="colon">:</view>
        <view class="number">{{second}}</view>
      </view>
      <view class="info">{{discountDetail.discountName}}</view>
      <view class="shop">{{discountDetail.shopName}}{{i18n.specialty}}</view>
    </view>
  </view>
  <view class="discount-prod">
    <view class="item" v-for="(item, prodId) in discountProdList" :key="prodId" @tap="toDiscountProdDet" :data-prodid="item.prodId">
      <view class="img">
        <image :src="item.pic"></image>
      </view>
      <view class="msg">
        <view class="name-des">
          <view class="name">{{item.prodName}}</view>
          <view class="des">{{item.brief}}</view>
        </view>
        <view class="price-btn">
          <view class="price-box">
            <view class="price">
              <text class="symbol">￥</text>
              <text class="big">{{wxs.parsePrice(item.activityPrice)[0]}}</text>
              <text class="small">.{{wxs.parsePrice(item.activityPrice)[1]}}</text>
            </view>
            <view class="old-price">￥{{wxs.toPrice(item.price)}}</view>
          </view>
          <view class="btn">{{i18n.immediatelyBuy}}</view>
        </view>
      </view>
    </view>
  </view>
</view>
</template>

<script module="wxs" lang="wxs" src="../../../wxs/number.wxs"></script>

<script>
// pages/discountDetail/discountDetail.js
var http = require("../../../utils/http.js");
var util = require("../../../utils/util.js");

export default {
  data() {
    return {
      discountDetail: {},
      //活动详情
      discountId: '',
      hour: 0,
      //时
      min: 0,
      //分
      second: 0,
      //秒
      discountProdList: [],
      //限时特惠商品列表
      current: 1,
      // 当前页数
      pages: 1,
      // 总页数
      endTime: '',
      //结束时间
      timer: ''
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
    const {
      discountId
    } = options;
    this.setData({
      discountId
    });
    this.getDiscountDet();
    this.getDiscountProdList(1); //默认加载第一页
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
  	      title:this.i18n.limitedTimeOffer
  	  });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearTimeout(this.timer);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.current < this.pages) {
      this.getDiscountProdList(this.current + 1);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  methods: {
    // 获取活动详情
    getDiscountDet() {
      // 请求详情数据
      var _this = this;

      http.request({
        url: "/marking/discount/getDiscountByDiscountId/" + this.discountId,
        method: "GET",
        callBack: res => {
          _this.setData({
            discountDetail: res,
            endTime: res.endTime
          });

          _this.countTime();
        }
      });
    },

    // 获取限时特惠商品列表
    getDiscountProdList(cur) {
      uni.showLoading();
      var ths = this;
      http.request({
        url: "/marking/discount/prodList",
        data: {
          discountId: this.discountId,
          //活动id
          current: cur,
          //当前页
          size: 20
        },
        method: "GET",
        callBack: res => {
          var list = [];

          if (res.current == 1) {
            list = res.records;
          } else {
            list = ths.discountProdList;
            Array.prototype.push.apply(list, res.records);
          }

          this.setData({
            discountProdList: list,
            pages: res.pages,
            current: res.current
          });
          uni.hideLoading()        }
      });
    },

    // 倒计时
    countTime() {
      // 获取当前时间
      let date = new Date();
      let now = date.getTime(); // 设置截止时间

      let end = util.dateToTimestamp(this.endTime); // 时间差

      let leftTime = end - now; // 定义变量 d,h,m,s保存倒计时的时间

      if (leftTime >= 0) {
        // 时
        let h = Math.floor(leftTime / 1000 / 60 / 60); // 分

        let m = Math.floor(leftTime / 1000 / 60 % 60); // 秒

        let s = Math.floor(leftTime / 1000 % 60);
        this.setData({
          hour: h < 10 ? '0' + h : h,
          min: m < 10 ? '0' + m : m,
          second: s < 10 ? '0' + s : s
        });
      } else {
        this.setData({
          hour: '00',
          min: '00',
          second: '00'
        });
      } // 等于0的时候不调用


      if (Number(this.hour) === 0 && Number(this.min) === 0 && Number(this.second) === 0) {
        this.$Router.push({ path: '/packageActivities/pages/specialDiscount/specialDiscount'})
        return;
      } else {
        // 递归每秒调用countTime方法，显示动态时间效果,
        this.setData({
          timer: setTimeout(this.countTime, 1000)
        });
      }
    },

    //跳转商品详情
    toDiscountProdDet(e) {
      var prodid = e.currentTarget.dataset.prodid;

      if (prodid) {
        uni.navigateTo({
          url: '/pages/prod/prod?prodid=' + prodid
        });
      }
    }

  }
};
</script>
<style>
@import "./discountDetail.css";
</style>