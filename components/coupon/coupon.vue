<template>
  <view :class="'coupon-item ' + (showIndex==1?'':'gray')">
    <view class="left">
      <view class="num"
            v-if="item.couponType == 1 || item.couponType == 3">HK$<text class="coupon-price">{{item.reduceAmount}}88</text>
      </view>
	  <!-- 满减卷 -->
	  <view class="num"
	        v-else>HK$<text class="coupon-price">88</text>
	  </view>
	  <!-- 打折劵 -->
      <view class="num"
            v-if="item.couponType == 2">
        <text class="coupon-price">{{item.couponDiscount}}</text>{{i18n.discount}}</view>
		
      <view class="coupon-condition">{{i18n.available}}{{item.cashCondition}}{{i18n.availableUse}}</view>
    </view>    
    <view class="right" >
     <view class="c-des">
        <text class="c-type">满00可用</text><text style="color: #666666;font-size: 24rpx;">快过期</text></view>
     <view class="period">有效期至：2020-08-24 </view>
	  <view class="c-date" v-if="item && update" >
        <view style="color: #999999;font-size: 22rpx;" @click="couponDetial">
        	详情信息
			<text v-if="!flag"><u-icon  name="arrow-right" color="#999999" size="28"></u-icon></text>
			<text v-else><u-icon  name="arrow-up" color="#999999" size="28"></u-icon></text>
        </view>  
      </view>
	  <view class="cosbox" v-show="flag">
	  	<view class="">· 不能和其他优惠券叠加使用</view>
	  	<view class="">· 所有新品上架都能使用</view>
	  </view>
    <!--  <view v-if="order && canUse"
            class="sel-btn">
        <checkbox color="#EF103C"
                  :data-couponid="item.couponId"
                  :checked="item.choose"
                  @tap="checkCoupon"></checkbox>
      </view> -->
	 
    </view>
	 <view class="goright" v-if="Iflag">使用</view>
	 <view class="goright" v-else>已過期</view>
    <!-- 我的优惠券状态(优惠券状态 0:失效 1:有效 2:使用过) -->
    <!-- 已使用 -->
  <!--  <image class="tag-img"
           src="/static/images/icon/coupon-used.png"
           v-if="type==2 && myCoupon"></image> -->
    <!-- 已过期 -->
<!--    <image class="tag-img"
           src="/static/images/icon/coupon-ot.png"
           v-if="type==0 && myCoupon"></image> -->
  </view>
</template>


<script>
var http = require("../../utils/http.js");
var util = require("../../utils/util.js");

export default {
  data() {
    return {
		showIndex:1,//假的索引，暂时控制优惠卷 1为用过 2为没用过
      stsType: 4,
			item: this.couponItem, // 领券操作会直接修改父组件传递的数据引起报错,这个用来存数据
			update: true,  // 组件内部数据改变不触发视图重绘,这个用来手动重绘
			flag:false,
			Iflag:false
    };
  },

  components: {},
  props: {
    // item: Object,
		couponItem: Object,
    type: [Number, String],
    order: Boolean,
    canUse: Boolean,
    index: Number,
    showTimeType: Number,
		myCoupon: Boolean
  },
  
  computed:{
  	i18n() {
  		return this.$t('index')
  	}
  },
  
  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  beforeMount: function () {

  },
  methods: {
	  // 点击查看详情
	  couponDetial(){
		  this.flag= !this.flag
	  },
    receiveCoupon(e) {
      util.checkAuthInfo(() => {
        var couponId = this.item.couponId;
        http.request({
          url: "/api/v1/myCoupon/receive",
          method: "POST",
          data: couponId,
          callBack: (res) => {
            this.update = false
            var coupon = this.item;
            coupon.canReceive = false;
            this.setData({
              item: coupon
            });
						uni.showToast({
              title: res,
              mask: true,
            })
            this.update = true
          }
        });
      });
    },

    checkCoupon(e) {
      this.$emit('checkCoupon', {
        couponId: e.currentTarget.dataset.couponid
      });
    },

    /**
     * 立即使用
     */
    useCoupon() {
      util.checkAuthInfo(() => {
        var url = '/pages/prod-classify/prod-classify?sts=' + this.stsType;
        var id = this.item.couponId;
        var title = this.i18n.couponEventGoods;

        if (id) {
          url += "&tagid=" + id + "&title=" + title;
        }

        uni.navigateTo({
          url: url
        });
      });
    }

  }
};
</script>
<style>
@import "./coupon.css";
</style>