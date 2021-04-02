<template>
  <!--components/platCoupon/platCoupon.wxml-->
  <view :class="'coupon-item ' + (canUse?'':'gray')">
    <view class="left">
      <view class="num"
            v-if="item.couponType == 1 || item.couponType == 3">
        <!-- ￥
      <text class="coupon-price">{{item.reduceAmount}}</text> -->
        <view class="cou-amount">{{item.reduceAmount}}</view>
        <view class="cou-text">{{i18n.yuan}}</view>
      </view>
      <view class="num"
            v-if="item.couponType == 2">
        <text class="coupon-price">{{item.couponDiscount}}</text>{{i18n.discount}}</view>
      <view class="condition">{{i18n.available}}{{item.cashCondition}}{{i18n.availableUse}}</view>
    </view>
    <view class="right">
      <view class="c-des">
        <!-- <text class="c-type">{{item.suitableProdType==0?'通用':'商品'}}</text> {{item.suitableProdType==0?'全场通用':'指定商品可用'}} -->
        <view class="cou-name">{{item.couponName}}</view>
      </view>
      <view class="c-date">
        <!-- <text wx:if="{{showTimeType==1 && item.couponType==2}}" class="c-data-info">领券{{item.validDays}}天后失效</text> -->
        <!-- <text wx:else class="c-data-info">{{item.startTime}}~{{item.endTime}}</text> -->
        <text class="c-data-info">{{item.startTime}}~{{item.endTime}}</text>
        <!-- <view class="cou-term"> {{item.validTimeType == 1?coupon.endTime+'前':'领取后' +coupon.afterReceiveDays}}结束</view> -->
        <!-- <text class="c-btn" wx:if="{{item.canReceive && !order}}" bindtap='receiveCoupon'>立即领取</text> -->
        <text class="c-btn get-btn"
              v-if="!item.canReceive && !order"
              @tap="useCoupon">{{i18n.useItNow}}</text>
      </view>
      <view v-if="order && canUse"
            class="sel-btn">
        <checkbox color="#EF103C"
                  :data-couponid="item.couponId"
                  :checked="item.choose"
                  @tap="checkCoupon"></checkbox>
      </view>
    </view>
    <image class="tag-img"
           src="/static/images/icon/coupon-used.png"
           v-if="type==1"></image>
    <image class="tag-img"
           src="/static/images/icon/coupon-ot.png"
           v-if="type==2"></image>
  </view>

  <!-- 券面 -->
  <!-- <view class="coupon-surface">
    <view class="coupon-content">
      <view class="coupon-left">
        <view class="cou-money-amount">
          <view class="cou-amount">{{coupon.reduceAmount}}</view>
          <view class="cou-text">元</view>
        </view>
        <view class="use-condition">满{{coupon.cashCondition}}元使用</view>
      </view>
      <view class="coupon-right">
        <view class="cou-name">{{coupon.couponName}}</view>
        <view class="cou-term"> {{coupon.validTimeType == 1?coupon.endTime+'前':'领取后' +coupon.afterReceiveDays}}结束</view>
      </view>
    </view>
  </view> -->
  <!-- 券面 -->
</template>

<script>
var http = require("../../utils/http.js");
var util = require("../../utils/util.js");
export default {
  data () {
    return {
      stsType: 4
    };
  },
  
  computed:{
  	i18n() {
  		return this.$t('index')
  	}
  },

  components: {},
  props: {
    item: Object,
    type: Number,
    order: Boolean,
    canUse: Boolean,
    index: Number,
    showTimeType: Number
  },
  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  beforeMount: function () {//console.log(this.data.item);
  },
  methods: {
    receiveCoupon () {
      util.checkAuthInfo(() => {
        var couponId = this.item.couponId;
        http.request({
          url: "/api/v1/myCoupon/receive",
          method: "POST",
          data: couponId,
          callBack: () => {
            var coupon = this.item;
            coupon.canReceive = false;
            this.setData({
              item: coupon
            });
          }
        });
      });
    },

    checkCoupon (e) {
      // this.triggerEvent('checkCoupon', this.data.index);
      this.$emit('checkCoupon', {
        couponId: e.currentTarget.dataset.couponid
      });
      console.log(e.currentTarget.dataset.couponid);
    },

    /**
     * 立即使用
     */
    useCoupon () {
      var url = '/pages/prod-classify/prod-classify?sts=' + this.stsType;
      var id = this.item.couponId;
      var title = this.i18n.couponEventGoods;

      if (id) {
        url += "&tagid=" + id + "&title=" + title;
      }

      uni.navigateTo({
        url: url
      });
    }

  }
};
</script>
<style>
@import "./platCoupon.css";
</style>