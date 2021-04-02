<template>
<!-- pages/specialDiscount/specialDiscount.wxml -->
<view class="discount-list">
  <image src="../../static/images/icon/activity-bg.png" class="list-bg"></image>
  <view :class="['item' , item.mobilePic ? '' : 'no-bg']" v-for="(item, index) in discountList" :key="item.discountId" @tap="toDiscountDetail" :data-discountid="item.discountId" v-if="endTimeList[index].flag">
    <image :src="item.mobilePic" class="bg"></image>
    <view class="text-box">
      <view class="info">{{item.discountName}}</view>
      <view class="shop">{{item.shopName}}{{i18n.specialty}}<image src="../../static/images/icon/activity-arr.png" class="arr"></image>
      </view>
      <view class="time">
        <view class="time-icon"></view>{{i18n.onlyLeft}}<view class="much-time" v-if="endTimeList[index].day">
          <view class="day">{{endTimeList[index].day}}</view>{{i18n.day}}</view>
        <!-- 大于24小时展示 -->
        <view class="number-box" v-if="endTimeList[index].day==0">
          <view class="number">{{endTimeList[index].hour}}</view>
          <view class="colon">:</view>
          <view class="number">{{endTimeList[index].min}}</view>
          <view class="colon">:</view>
          <view class="number">{{endTimeList[index].second}}</view>
        </view>
        <!-- 小于24小时展示 -->
      </view>
    </view>
  </view>
  <view class="empty" v-if="discountList.length==0">
    <view class="empty-icon">
      <image src="/static/images/icon/empty.png"></image>
    </view>
    <view class="empty-text">{{i18n.noProducts}}</view>
  </view>
  <!-- <pageBottomTips :isAll="loadAll" :empty="!discountList.length" /> -->
	<pageBottomTips :isAll="loadAll" />
</view>
</template>

<script>
// pages/specialDiscount/specialDiscount.js
var http = require("../../../utils/http.js");
var util = require("../../../utils/util.js");
import pageBottomTips from '../../../components/pageBottomTips/pageBottomTips';

export default {
  data() {
    return {
      discountList: [],
      //优惠活动列表
      current: 1,
      // 当前页数
      pages: 1,
      // 总页数
      endTimeList: [],
      //结束时间
      timer: '',
      loadAll: false, // 已加载全部
    };
  },

  components: {
		pageBottomTips
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
    this.getDiscountPage(1); //默认加载第一页
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
      this.getDiscountPage(this.current + 1);
    }else {
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
    // 获取优惠活动列表
    getDiscountPage(cur) {
      uni.showLoading();
      var ths = this;
      http.request({
        url: "/marking/discount/getDiscountList",
        data: {
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
            list = ths.discountList;
            Array.prototype.push.apply(list, res.records);
          }
          var endTimeList = [];
          list.forEach(item => {
            endTimeList.push({
              endTime: item.endTime
            });
          });
          this.setData({
            discountList: list,
            pages: res.pages,
            endTimeList: endTimeList,
            current: res.current,
						loadAll: res.pages == cur
          });
          this.countTime()
          uni.hideLoading()
				}
      });
    },

    // 倒计时
    countTime() {
      var endTimeList = this.endTimeList;
      endTimeList.forEach((item, index) => {
        // 获取当前时间
        let date = new Date();
        let now = date.getTime(); // 设置截止时间

        let end = util.dateToTimestamp(item.endTime); // 时间差

        let leftTime = end - now; // 定义变量 d,h,m,s保存倒计时的时间

        if (leftTime >= 0) {
          // 天
          item.day = Math.floor(leftTime / 1000 / 60 / 60 / 24); // 时

          let h = Math.floor(leftTime / 1000 / 60 / 60 % 24);
          item.hour = h < 10 ? '0' + h : h; // 分

          let m = Math.floor(leftTime / 1000 / 60 % 60);
          item.min = m < 10 ? '0' + m : m; // 秒

          let s = Math.floor(leftTime / 1000 % 60);
          item.second = s < 10 ? '0' + s : s;
          item.flag = true
        } else {
          item.day = 0;
          item.hour = '00';
          item.min = '00';
          item.second = '00';
          item.flag = false
        }
      });
      this.setData({
        endTimeList: endTimeList
      }); // 递归每秒调用countTime方法，显示动态时间效果,

      this.setData({
        timer: setTimeout(this.countTime, 1000)
      });

      this.$forceUpdate();
    },

    //跳转活动详情
    toDiscountDetail(e) {
      util.tapLog()
      var discountId = e.currentTarget.dataset.discountid;
      uni.navigateTo({
        url: '../discountDetail/discountDetail?discountId=' + discountId
      });
    }

  }
};
</script>
<style>
@import "./specialDiscount.css";
</style>