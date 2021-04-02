<template>
<!--pages/prod-classify/prod-classify.wxml--> 
<view class="container">
	<u-navbar  title="我的收藏">
		<view class="nav-bar" @click="flag=!flag"><text v-if="flag">管理</text><text v-else>完成</text></view>
	</u-navbar>
  <view class="coupon-condition" v-if="sts==4 && couponInfo.couponType === 1">{{i18n.limitedTimeOffer1}}{{couponInfo.cashCondition}}{{i18n.reduce}}{{couponInfo.reduceAmount}}{{i18n.coupon}}</view>
  <view class="coupon-condition" v-if="sts==4 && couponInfo.couponType === 2">{{i18n.limitedTimeOffer1}}{{couponInfo.cashCondition}}{{i18n.makeDa}}{{couponInfo.couponDiscount}}{{i18n.discount}}{{i18n.coupon}}</view>
  <!-- <view class="tit-background"></view> -->
  <view>
    <block v-for="(item, key) in 3" :key="key">
      <prod :item="item" :flag="flag" :showCancelCollect="showCancelCollect" v-on:getCollectionProd="getCollectionProd"></prod>
    </block>
  </view>
<view class="checkAll">
    <view class="">
    	<u-checkbox @click="checkedAll" shape="circle" active-color="#47D1D1" v-model="checked">全选</u-checkbox>
    </view>
	<view class="deletAll">删除</view>
</view>
  <view class="loadall" v-if="prodList.length > 10 && loadAll">{{i18n.endTips}}</view>

  <!-- 空 -->
  <view class="empty" v-if="!prodList.length">
    <view class="empty-icon">
      <image src="/static/images/icon/empty.png"></image>
    </view>
    <view class="empty-text">{{i18n.noProducts}}</view>
  </view>
</view>
</template>

<script>
// pages/prod-classify/prod-classify.js
var http = require("../../utils/http.js");
import prod from "../../components/production/production";

export default {
  data() {
    return {
		flag:true,
      sts: 0,
      prodList: [],
      title: "",
      current: 1,
      size: 20,
      pages: 0,
      tagid: 0,
      couponInfo: {}, // 单张优惠券信息
      couponId: "",
      showCancelCollect: false, // 是否展示取消收藏按钮，用于传值到商品列表页；
      loadAll: false, // 已加载全部
	  checked:false
    };
  },

  components: {
    prod
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
    this.setData({
      current: 1,
      pages: 0,
      sts: options.sts,
      title: options.title ? options.title : ""
    });

    if (options.tagid) {
      this.setData({
        tagid: options.tagid,
        couponId: options.tagid
      });
    }

   

    this.loadProdData(options);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.sts == 5) {
      // 收藏商品列表
      this.getCollectionProd();
    }
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
  onReachBottom: function () {
    if (this.current < this.pages) {
      this.setData({
        current: this.current + 1
      });
      this.loadProdData();
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
	  // 点击全选
	  checkedAll(){
		  if(checked){
			 console.log(checked)
			  // 循环列表给每个的布尔值设置为true
			  // this.list.map(val => {
			  // 				val.checked = true;
			  			}
		  },
    /**
     * 加载商品数据
     */
    loadProdData: function (options) {
      let sts = this.sts;

      if (sts == 0) {
        // 分组标签商品列表
        this.getTagProd();
      } else if (sts == 1) {
        // 新品推荐
        let url = "/prod/lastedProdPage";
        this.getActProd(url);
      } else if (sts == 2) {
        // 限时特惠
        let url = "/marking/discount/prodList";
        this.getActProd(url);
      } else if (sts == 3) {
        // 每日疯抢
        let url = "/prod/moreBuyProdList";
        this.getActProd(url);
      } else if (sts == 4) {
        // 优惠券商品列表
        this.getProdByCouponId(this.couponId);
        this.getCouponInfo();
      } else if (sts == 5) {
        // 收藏商品列表
        this.getCollectionProd();
      }
    },
    getActProd: function (url) {
      var ths = this;
      uni.showLoading();
      var params = {
        url: url,
        method: "GET",
        data: {
          current: ths.current,
          size: ths.size
        },
        callBack: function (res) {
          let list = [];

          if (res.current == 1) {
            list = res.records;
          } else {
            list = ths.prodList.concat(res.records);
          }

          ths.setData({
            prodList: list,
            pages: res.pages
          });
          uni.hideLoading()        }
      };
      http.request(params);
    },

    /**
     * 获取我的收藏商品
     */
    getCollectionProd: function () {
      var ths = this;
      uni.showLoading();
      var params = {
        url: "/api/v1/user/collection/prods",
        method: "GET",
        data: {
          current: ths.current,
          size: ths.size
        },
        callBack: function (res) {
          let list = [];

          if (res.current == 1) {
            list = res.records;
          } else {
            list = ths.prodList;
            list = list.concat(res.records);
          }

          ths.setData({
            prodList: list,
            pages: res.pages
          });
          uni.hideLoading()        }
      };
      http.request(params);
    },

    /**
     * 获取标签列表
     */
    getTagProd: function (id) {
      var ths = this;
      uni.showLoading();
      var param = {
        url: "/prod/prodListByTagId",
        method: "GET",
        data: {
          tagId: ths.tagid,
          current: ths.current,
          size: ths.size
        },
        callBack: res => {
          let list = [];

          if (res.current == 1) {
            list = res.records;
          } else {
            list = ths.prodList.concat(res.records);
          }

          ths.setData({
            prodList: list,
            pages: res.pages
          });
          uni.hideLoading()        }
      };
      http.request(param);
    },

    /**
     * 获取优惠券商品列表
     */
    getProdByCouponId(id) {
      var ths = this;
      uni.showLoading();
      var param = {
        url: "/coupon/prodListByCouponId",
        method: "GET",
        data: {
          couponId: id,
          current: this.current,
          size: this.size
        },
        callBack: res => {
          let list = [];

          if (res.current == 1) {
            list = res.records;
          } else {
            list = ths.prodList.concat(res.records);
          }

          ths.setData({
            prodList: list,
            pages: res.pages
          });
          uni.hideLoading()        }
      };
      http.request(param);
    },

    // 获取一张优惠券信息
    getCouponInfo() {
      var params = {
        url: "/coupon/couponById?couponId=" + this.tagid,
        method: "GET",
        callBack: res => {
          this.setData({
            couponInfo: res
          });
        }
      };
      http.request(params);
    }

  }
};
</script>
<style>
@import "./prod-classify.css";
</style>