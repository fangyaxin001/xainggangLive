<template>
<!-- 秒杀专场 -->
<!-- pages/snapUpList/snapUpList.wxml -->
<view class="seckill-box">
  <view class="banner">
    <view class="bg"><image src="../../static/images/icon/flash-bg.png"></image></view>
    <view class="img"><image src="../../static/images/icon/flash-banner.png"></image></view>
  </view>
  <view class="seckill-list">
    <!-- 秒杀商品 -->
    <block v-for="(item, index) in seckillList" :key="item.seckillId">
      <view class="item" @tap="toSeckillDetaile" :data-seckillid="item.seckillId">
        <!-- 商品图片 -->
        <view class="img-box"><image :src="item.pic" mode="aspectFit"></image></view>
        <!-- 商品信息 -->
        <view class="goods-msg">
          <!-- 秒杀在进行 -->
          <view class="countdown-box" v-if="countDownList[index].type===1">
            <view class="tip">{{i18n.onlyEnd}}</view>
            <view class="num">{{countDownList[index].day}}</view>
            <view class="text">{{i18n.day}}</view>
            <view class="num">{{countDownList[index].hou}}</view>
            <view class="text">:</view>
            <view class="num">{{countDownList[index].min}}</view>
            <view class="text">:</view>
            <view class="num">{{countDownList[index].sec}}</view>
          </view>
          <!-- 秒杀未开始 -->
          <view class="countdown-box" v-if="countDownList[index].type!=1">
            <view class="tip">{{i18n.onlyStart}}</view>
            <view class="num">{{countDownList[index].day}}</view>
            <view class="text">{{i18n.day}}</view>
            <view class="num">{{countDownList[index].hou}}</view>
            <view class="text">:</view>
            <view class="num">{{countDownList[index].min}}</view>
            <view class="text">:</view>
            <view class="num">{{countDownList[index].sec}}</view>
          </view>
          <view class="goods-name">
            <view class="discounts">{{i18n.reduce}}{{wxs.toPrice(item.price - item.seckillPrice)}}{{i18n.yuan}}</view>
            <view class="name">{{item.prodName}}</view>
          </view>
          <view class="progress-box">
            <view class="bg-box">
              <view class="progress" :style="'width: ' + (wxs.rounding((item.seckillOriginStocks - item.seckillTotalStocks) * 100 / item.seckillOriginStocks)) + '%'"></view>
            </view>
            <view class="text">{{i18n.haveCoupons}}{{wxs.rounding((item.seckillOriginStocks - item.seckillTotalStocks) * 100 / item.seckillOriginStocks)}}%</view>
          </view>
          <view class="goods-price">
            <view class="price-box">
              <text class="current-price"><text class="sub">￥</text>{{wxs.toPrice(item.seckillPrice)}}</text>
              <text class="original-price">￥{{wxs.toPrice(item.price)}}</text>
            </view>
            <view class="residue">{{i18n.onlyLeft}}{{item.seckillTotalStocks}}{{i18n.piece}}</view>
          </view>
        </view>
      </view>
    </block>
    <view class="empty" v-if="seckillList.length==0">
			<view class="empty-icon">
				<image src="/static/images/icon/empty.png"></image>
			</view>
			<view class="empty-text">{{i18n.noProducts}}</view>
		</view>
	<!-- <pageBottomTips :isAll="loadAll" :empty="!seckillList.length" /> -->
	<pageBottomTips :isAll="loadAll" />

  </view>
</view>
</template>

<script module="wxs" lang="wxs" src="../../../wxs/number.wxs"></script>

<script>
// pages/snapUpList/snapUpList.js
const app = getApp().globalData;
var http = require("../../../utils/http.js");
var config = require("../../../utils/config.js");
var util = require("../../../utils/util.js");
import pageBottomTips from '../../../components/pageBottomTips/pageBottomTips';
export default {
  data() {
    return {
      seckillList: [],
      // 秒杀商品列表
      countDownList: [],
      // 秒杀倒计时列表
      countDownEndTimeList: [],
      timer: '',
			current: 1,
      pages: 0,
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
  onLoad: function (options) {
    this.getSecList(); //秒杀商品列表
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
	      title:this.i18n.spikeSpecial
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
		if(this.current < this.pages) {
			this.current = this.current + 1
			this.getSecList()
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
    /**
     * 获取秒杀商品列表
     */
    getSecList() {
      http.request({
        url: "/seckill/pageProd",
        method: "GET",
				data: {
					current: this.current,
					size: 5,
				},
        callBack: res => {
          let result = res.records.filter(item => util.dateToTimestamp(item.endTime) > new Date().getTime());
          this.setData({
            seckillList: res.current==1? result : this.seckillList.concat(result),
						current: res.current,
						pages: res.pages
          });
          let endTimeList = []; // 倒计时数组
          for (let i = 0; i < this.seckillList.length; i++) {
            var objs = {};
            objs.eTime = this.seckillList[i].endTime;
            objs.sTime = this.seckillList[i].startTime;
            objs.countType = null; //1表示秒杀活动正在进行,0表示秒杀活动未开始
            endTimeList.push(objs);
          }
          this.setData({
            countDownEndTimeList: endTimeList
          });
          if(res.total<=4 && res.total>0){
            this.setData({
              loadAll:true
            })
          }
          this.countdown();
        }
      });
    },

    countdown() {
      // 获取当前时间，同时得到活动结束时间数组
      let newTime = new Date().getTime();
      let endTimeList = this.countDownEndTimeList;
      let countDownArr = []; // 对结束时间进行处理渲染到页面

      endTimeList.forEach(o => {
        if (newTime - util.dateToTimestamp(o.sTime) > 0) {
          let endTime = util.dateToTimestamp(o.eTime);
          let obj = null; // 如果活动未结束，对时间进行处理

          if (endTime - newTime > 0) {
            let time = (endTime - newTime) / 1000; // 获取天、时、分、秒

            let day = parseInt(time / (60 * 60 * 24));
            let hou = parseInt(time % (60 * 60 * 24) / 3600);
            let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
            let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
            obj = {
              day: this.timeFormat(day),
              hou: `${this.timeFormat(hou)}`,
              min: `${this.timeFormat(min)}`,
              sec: `${this.timeFormat(sec)}`,
              type: 1 // 表示秒杀正在进行

            };
          } // 活动已结束
          else {
              obj = {
                day: '00',
                hou: '00',
                min: '00',
                sec: '00'
              };
            }

          countDownArr.push(obj);
        } // 活动未开始
        else {
            let startTime = util.dateToTimestamp(o.sTime);
            let time = (startTime - newTime) / 1000;
            let obj = null; // 获取天、时、分、秒

            let day = parseInt(time / (60 * 60 * 24));
            let hou = parseInt(time % (60 * 60 * 24) / 3600);
            let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
            let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
            obj = {
              day: this.timeFormat(day),
              hou: `${this.timeFormat(hou)}`,
              min: `${this.timeFormat(min)}`,
              sec: `${this.timeFormat(sec)}`,
              type: 0 // 表示秒杀还没开始
            };
            countDownArr.push(obj);
          }
      }); // 渲染，然后每隔一秒执行一次倒计时函数

      this.setData({
        countDownList: countDownArr,
        timer: setTimeout(this.countdown, 1000)
      });
    },

    //小于10的格式化函数
    timeFormat(times) {
      return Number(times) < 10 ? '0' + times : times;
    },

    //跳转秒杀商品详情页
    toSeckillDetaile: function (e) {
      var seckillId = e.currentTarget.dataset.seckillid;
      uni.navigateTo({
        url: "../snapUpDetail/snapUpDetail?seckillId=" + seckillId
      });
    }
  }
};
</script>
<style>
@import "./snapUpList.css";
</style>