<template>
<!-- 我的优惠券 -->
<view class="container">
  <view class="h-tabs">
    <!-- 我的优惠券状态(优惠券状态 0:失效 1:有效 2:使用过) -->
    <view :class="'h-tab ' + (type==1?'on':'')" data-type="1" @tap="changeTab">全部<text v-show="unUseCount">({{unUseCount}})</text> 
	<view :class="type==1?'onmath':''"></view>
	</view>
    <view :class="'h-tab ' + (type==2?'on':'')" data-type="2" @tap="changeTab">未使用<text v-show="useCount">({{useCount}})</text>
	<view :class="type==2?'onmath':''"></view>
	</view>
    <view :class="'h-tab ' + (type==0?'on':'')" data-type="0" @tap="changeTab">已过期<text v-show="expiredCount">({{expiredCount}})</text>
	<view :class="type==0?'onmath':''"></view>
	</view>
  </view>
  <view class="coupons">
    <block v-for="(item, id) in 1" :key="id">
      <coupon @longtap="delCouponHandle" :data-couponid="item.couponId" :canUse="type == 1" :couponItem="item" :type="type" :myCoupon="true"></coupon>
    </block>
  </view> 
  <!-- <view class="empty" wx:if="{{!couponList.length}}">这里还没有任何东西~</view> -->
  <!-- 空 -->
<!--  <view class="empty" v-if="!couponList.length">  
    <view class="empty-icon">  
      <image src="/static/images/icon/empty.png"></image>  
    </view>  
    <view class="empty-text">{{i18n.couponTips}}</view>  
  </view> -->

</view>
</template>

<script>
// pages/myCoupon/myCoupon.js
var http = require("../../../utils/http.js");
import coupon from "../../../components/coupon/coupon";

export default {
  data() {
    return {
      type: 1,
      couponList: [],
      unUseCount: 0,
      useCount: 0,
      expiredCount: 0,
      pages: 0,
      current: 1,
      size: 20
    };
  },

  components: {
    coupon
  },
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
    this.couponCount();
    this.loadMyCouponData(this.type);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
	  uni.setNavigationBarTitle({
	      title:this.i18n.myDiscountCoupon
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
  onPullDownRefresh: function () {
    if (this.current < this.pages) {
      this.loadOrderData(this.sts, this.current + 1);
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.current < this.pages) {
      this.setData({
        current: this.current + 1
      });
      this.loadMyCouponData(this.type);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  methods: {
    /**
     * 获取我的优惠券列表
     */
    loadMyCouponData(type) {
			uni.showLoading()
      // 我的优惠券状态(status优惠券状态 0:失效 1:有效 2:使用过)
      var params = {
        url: "/api/v1/myCoupon/getCouponList",
        method: "GET",
        data: {
          status: type,
          current: this.current,
          size: this.size
        },
        callBack: res => {
					uni.hideLoading()
          let list = [];
          if (res.current == 1) {
            list = res.records;
          } else {
            list = this.couponList.concat(res.records);
          }
          this.setData({
            couponList: list,
            pages: res.pages
          });
        }
      };
      http.request(params);
    },

    /**
     *  标签切换事件
     */
    changeTab(e) {
      this.setData({
        current: 1,
        type: e.currentTarget.dataset.type,
        couponList: []
      });
      this.loadMyCouponData(this.type);
    },

    /**
     *  获取各个状态下优惠券数量
     */
    couponCount() {
      var ths = this;
      var params = {
        url: "/api/v1/myCoupon/getMyCouponsStatusCount",
        method: "GET",
        data: {},
        callBack: function (res) {
          ths.setData({
            unUseCount: res.unUseCount,
            expiredCount: res.expiredCount,
            useCount: res.useCount
          });
        }
      };
      http.request(params);
    },

    /**
     * 删除优惠券
     */
    delCouponHandle(e) {
      let couponId = e.currentTarget.dataset.couponid;
      let ths = this;
      uni.showModal({
        title: '',
        content: ths.i18n.deleteCouponTips,
				cancelText: ths.i18n.cancel,
				confirmText: ths.i18n.confirm,
        confirmColor: "#EF103C",

        success(res) {
          if (res.confirm) {
            uni.showLoading();
            let params = {
              url: "/api/v1/myCoupon/deleteCoupon/" + couponId,
              method: "DELETE",
              data: {},
              callBack: function (res) {
                ths.loadMyCouponData(ths.type);
                uni.hideLoading()              }
            };
            http.request(params);
          } else if (res.cancel) {
          }
        }

      });
    }

  }
};
</script>
<style>
@import "./myCoupon.css";
</style>