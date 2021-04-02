<template>
  <!-- 团购列表 -->
  <!--pages/aBulkList/aBulkList.wxml-->
  <view class="abulk-list-wrapper">
    <view class="banner">
      <view class="bg"><image src="../../static/images/icon/group-bg.png"></image></view>
      <view class="img"><image src="../../static/images/icon/group-banner.png"></image></view>
    </view>
    <view class="abulk-list">
      <!-- 商品项 -->
      <block v-for="(item, index) in aBulkList" :key="index">
        <view class="abulk-list-item" @tap="toAbulkListPage" :data-groupactivityid="item.groupActivityId" :data-prodid="item.prodId">
          <!-- 商品图片 -->
          <view class="prod-img">
            <image :src="item.prodPic"></image>
          </view>
          <!-- 商品信息 -->
          <view class="prod-msg">
            <view class="prod-title"><view class="prod-describe">{{item.groupNumber}} {{i18n.join}}</view>{{item.prodName}}</view>
            <view class="prod-price">
              <!-- 团购价 -->
              <view class="pic">
                <text class="symbol">￥</text>
                <text class="big-num">{{wxs.parsePrice(item.actPrice)[0]}}</text>
                <text class="small-num">.{{wxs.parsePrice(item.actPrice)[1]}}</text>
              </view>
              <!-- 原价 -->
              <view class="original-price">￥{{wxs.toPrice(item.price)}}</view>
              <!-- <view class="cart">
                <image src="../../images/tabbar/basket-sel.png"></image>
              </view> -->
            </view>
          </view>
        </view>
      </block>
    </view>
    <view class="empty" v-if="aBulkList.length==0">
			<view class="empty-icon">
				<image src="/static/images/icon/empty.png"></image>
			</view>
			<view class="empty-text">{{i18n.noProducts}}</view>
		</view>
		<!-- <pageBottomTips :isAll="loadAll" :empty="!aBulkList.length" /> -->
    <pageBottomTips :isAll="loadAll" />
  </view>
</template>

<script module="wxs" lang="wxs" src="../../../wxs/number.wxs"></script>

<script>
// pages/aBulkList/aBulkList.js
const http = require("../../../utils/http.js")
import pageBottomTips from '../../../components/pageBottomTips/pageBottomTips'

export default {
  data() {
    return {
      aBulkList: [],
      //商品列表
      current: 1,
      size: 20,
      pages: "",
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
    this.getAbulkList();
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
	      title:this.i18n.groupBuyingList
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
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.current < this.pages) {
      this.setData({
        current: this.current + 1
      });
      this.getAbulkList();
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
     * 获取团购商品列表
     */
    getAbulkList: function () {
      uni.showLoading();
      var params = {
        url: "/groupProd/page",
        method: "GET",
        data: {
          current: this.current,
          size: this.size
        },
        callBack: res => {
          uni.hideLoading()          
					var aBulkList = [];
          if (res.current == 1) {
            aBulkList = res.records;
          } else {
            aBulkList = this.aBulkList.concat(res.records);
          }
          if(res.total<=4 && res.total>0){
            this.setData({
              loadAll:true
            })
          }
          this.setData({
            aBulkList: aBulkList,
            pages: res.pages,
            current: res.current
          });
        }
      };
      http.request(params);
    },

    /**
     * 跳转到拼团商品详情
     */
    toAbulkListPage: function (e) {
      var prodId = e.currentTarget.dataset.prodid;
      var groupActivityId = e.currentTarget.dataset.groupactivityid;
      // uni.navigateTo({
      //   url: '/pages/prod/prod?prodid=' + prodId + "&groupActivityId=" + groupActivityId
      // });
      this.$Router.push({ path: '/pages/prod/prod', query: { prodid: prodId,groupActivityId: groupActivityId }})
    }
  }
};
</script>
<style>
@import "./aBulkList.css";
</style>