<template>
  <!--pages/promotion-order/promotion-order.wxml-->
  <view class="container">
    <view class="pro-order">
      <view class="title">
        <!-- (0:待支付 1:待结算 2:已结算 -1:订单失效) -->
        <text @tap="onStsTap" data-state="0" :class="state==0?'on':''">{{i18n.all}}</text>
        <text @tap="onStsTap" data-state="1" :class="state==1?'on':''">{{i18n.unsettlement}}</text>
        <text @tap="onStsTap" data-state="2" :class="state==2?'on':''">{{i18n.settled}}</text>
        <text @tap="onStsTap" data-state="-1" :class="state==-1?'on':''">{{i18n.incomeExpired}}</text>
      </view>

      <!-- 推广订单列表 -->
      <view class="main">
        <view class="prod-item" v-for="(item, id) in records" :key="id">
          <view class="order-num">
            <text>{{i18n.orderNumber}}：{{item.orderNumber}}</text>
            <view class="order-state">
              <!-- <text :class="'order-sts  ' + (item.status==2?'red':'') + '  ' + ((item.status==1)?'gray':'')">{{item.status==1?i18n.settled:(item.status==2?i18n.unsettlement:'')}}</text> -->
              <text class="colorTop" v-if="item.state==0">{{i18n.toBePaid}}</text>
              <text class="colorTop" v-if="item.state==1">{{i18n.unsettlement}}</text>
              <text class="colorTop" v-if="item.state==2">{{i18n.settled}}</text>
              <text class="colorTop" v-if="item.state==-1">{{i18n.incomeExpired}}</text>
            </view>
          </view>
          <!-- 一个订单单个商品的显示 -->
          <block v-if="item.orderItemDtoList.length===1">

            <block v-for="(prod, index) in item.orderItemDtoList" :key="index">
              <view>
                <view class="item-cont">
                  <view class="prod-pic">
                    <image :src="prod.pic"></image>
                  </view>
                  <view class="prod-info">
                    <view class="prodname">{{prod.prodName}}</view>
                    <view class="prod-info-cont">{{prod.skuName||''}}</view>
                    <view class="price-nums">
                      <text class="prodprice">
                      <text class="symbol">￥</text>
                      <!-- <text class='big-num'>{{wxs.parsePrice(35)[0]}}</text>
                      <text class='small-num'>.{{wxs.parsePrice(00)[1]}}</text>-->
                      <text class="big-num">{{wxs.toPrice(prod.price)}}</text>
                      </text>
                      <text class="prodcount">x{{prod.prodCount}}</text>
                    </view>
                  </view>
                </view>
              </view>
            </block>
          </block>
          <!-- 一个订单多个商品时的显示 -->
          <block v-else>
            <view class="item-cont" @tap="toOrderDetailPage" :data-ordernum="item.orderNumber">
              <scroll-view scroll-x="true" scroll-left="0" scroll-with-animation="false" class="categories">
                <block v-for="(prod, index) in item.orderItemDtoList" :key="index">
                  <view class="prod-pic">
                    <image :src="prod.pic"></image>
                  </view>
                </block>
              </scroll-view>
            </view>
          </block>
          <view class="total-num">
            <view>
              <text class="prodcount">{{i18n.inTotal}}{{item.productNums}}{{i18n.items}}</text>
              <view class="prodprice">{{i18n.total}}：<text class="symbol">￥</text>
                <text class="big-num">{{wxs.toPrice(item.actualTotal)}}</text>
                <!-- <text class='big-num'>{{wxs.parsePrice(35)[0]}}</text> -->
                <!-- <text class='small-num'>.{{wxs.parsePrice(00)[1]}}</text> -->
              </view>
            </view>
            <view class="prodprice">{{i18n.commission}}：<text class="symbol color">￥</text>
              <!-- <text class='big-num color'>{{wxs.parsePrice(35)[0]}}</text>
              <text class='small-num color'>.{{wxs.parsePrice(00)[1]}}</text> -->
              <text class="big-num color">{{wxs.toPrice(item.incomeAmount)}}</text>
            </view>

          </view>
        </view>
      </view>

      <!-- 空 -->
      <view class="empty" v-if="records.length==0">{{emptyMsg}}</view>
      <!-- 加载到底~ -->
      <view class="loading" v-if="totalPage>1">{{loadingMsg}}</view>

      <!-- end 推广订单列表 -->
    </view>
  </view>
</template>

<script module="wxs" lang="wxs" src="../../../wxs/number.wxs"></script>

<script>
// pages/promotion-order/promotion-order.js
const http = require("../../../utils/http.js")

export default {
  data() {
    return {
      sts: 0,
      state: '',
      records: [],
      // loadingMsg: "正在加载..",
      loadingMsg: "",
      emptyMsg: "",
      totalPage: 1,
      pageNum: 1,
      current: 0,
      size: 20,
      pages: 0
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
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
	  //头部导航标题
	  uni.setNavigationBarTitle({
	      title:this.i18n.myPromotion
	  });
	  
	  this.loadingMsg = this.i18n.loading,
	  
    this.loadPageData(1);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.pageNum < this.totalPage) {
      this.loadPageData(this.pageNum + 1);
    }
  },
  methods: {
    /**
     * 点击切换事件 0:全部
     */
    onStsTap: function (e) {
      let state = e.currentTarget.dataset.state;
      this.setData({
        state: state,
        current: 1,
        size: 20,
        pages: 0
      });
      uni.showLoading({
        mask: true
      });
      this.loadPageData(1);
    },

    /**
     * 通过状态加载分销订单列表
     */
    loadPageData: function (pageNum) {
      let ths = this;
      var state = ths.state;

      if (state === "0") {
        state = '';
      }

      var params = {
        url: "/api/v1/distribution/income/myPromotionOrder",
        method: "GET",
        data: {
          current: pageNum,
          size: this.size,
          state: state
        },
        callBack: res => {
          console.log(res);
          uni.hideLoading()          
					var records = [];
          if (res.current == 1) {
            records = res.records;
          } else {
            records = this.records.concat(res.records);
          }
          var loadingMsg = this.loadingMsg;
          if (pageNum == res.pages) {
            loadingMsg = ths.i18n.noMore;
          }

          this.setData({
            records: records,
            totalPage: res.pages,
            pageNum: pageNum,
            loadingMsg: loadingMsg,
            emptyMsg: ths.i18n.noRecordsFound
          });
        }
      };
      http.request(params);
    }
  }
};
</script>
<style>
@import "./promotion-order.css";
</style>