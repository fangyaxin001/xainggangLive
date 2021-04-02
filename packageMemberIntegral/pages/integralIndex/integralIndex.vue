<template>
<!-- 积分商城 -->
<view class="integral-index"> 
  <view class="integral-msg">
	  <u-navbar  title="我的積分" :background="background" back-icon-color="#ffffff" title-color="#ffffff" :border-bottom="false"></u-navbar>
    <view class="my-integral">
		<!-- <view class="topnav">
			<view class=""><u-icon name="arrow-left" color="#2979ff" size="28"></u-icon></view>
			<view class="">我的積分</view>
			<view class=""> </view>
		</view> -->
      <view class="number-box">
        <view class="text">16800</view>
        <view class="number">我的積分</view>
      </view>
      <view class="det" @tap="navigateTo" data-path="scoreDet">{{i18n.detailed}}
      </view>
    </view> 
  </view>

 
  <view class="integral-list">
    <view class="duihuan" >
      <view class="duihuan-title">積分兌換</view>
	  <view class="duihuan-heng" ></view>
    </view>
    
      <!-- <view class="item" wx:for="{{scoreProdList}}" wx:key="prodId" wx:for-item="prod" bindtap="toScoreProdDet" data-scoreprodid="{{prod.prodId}}">
        <view class="img">
          <image src="{{prod.pic}}" />
        </view>
        <view class="name">{{prod.prodName}}</view>
        <view class="price">
          <image src="/static/images/icon/integral-icon.png" class="icon" />
          {{prod.scorePrice}}积分+{{prod.price}}元
        </view>
        <view class="old-price">市场价￥{{prod.oriPrice}}</view>
      </view> -->
     <!-- <scroll-view scroll-y="true" class="scroll-box" > -->
		 <view class="con-box">
     	<block v-for="(prod, prodId) in 10" :key="prodId">
     	  <goodsitem :prod="prod" @tap="toScoreProdDet" :data-scoreprodid="prod.prodId"></goodsitem>
     	</block> 
    </view>
	<!-- </scroll-view> -->
    <!-- <view class="loadall" v-if="scoreProdList.length > 10 && loadAll">{{i18n.endTips}}</view> -->
    <!-- <view class="empty" v-if="!scoreProdList.length">{{i18n.noData}}</view> -->
  </view>
</view>
</template>

<script>
// pages/integralIndex/integralIndex.js
var http = require("../../../utils/http.js");
import goodsitem from "../../components/IntegralGoodsList/IntegralGoodsList.vue";

export default {
  data() {
    return { 
		background:'none',
      current: 1,
      size: 20,
      scoreProdList: [],
      scoreInfo: "",
      pages: "",
      loadAll: false, // 已加载全部
    };
  },

  components: {
    goodsitem
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
    this.getScoreProdList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取当前积分信息
    this.getScoreInfo();
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
      this.current = this.current + 1
      this.getScoreProdList()
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
     * 跳转
     */
    navigateTo(e) {
      const path = e.currentTarget.dataset.path;

      if (path == 'scoreDet') {
        uni.navigateTo({
          url: '/packageMemberIntegral/pages/integralDetail/integralDetail'
        });
      } else if (path == 'scoreIndex') {
        uni.navigateTo({
          url: '/packageMemberIntegral/pages/memberIndex/memberIndex'
        });
      }
    },

    /**
     * 获取当前积分信息
     */
    getScoreInfo() {
      var params = {
        url: '/api/v1/score/scoreInfo',
        method: 'GET',
        data: {},
        callBack: res => {
          this.setData({
            scoreInfo: res
          });
        }
      };
      http.request(params);
    },

    /**
     * 获取积分商品列表
     */
    getScoreProdList() {
      var param = {
        url: "/api/v1/score/prodScorePage",
        method: "GET",
        data: {
          current: this.current,
          size: this.size,
        },
        callBack: res => {
          uni.hideLoading()          
					var scoreProdList = [];

          if (this.current == 1) {
            this.setData({
              scoreProdList: res.records,
              pages: res.pages,
              current: res.current
            });
          } else {
            scoreProdList = this.scoreProdList;
            scoreProdList.push(...res.records);
            this.setData({
              scoreProdList
            });
          }
        }
      };
      http.request(param);
    },

    /**
     * 跳转积分商品详情
     */
    toScoreProdDet(e) {
      console.log(e);
      const prodId = e.currentTarget.dataset.scoreprodid;
      uni.navigateTo({
        url: '/packageMemberIntegral/pages/convertProdDet/convertProdDet?prodId=' + prodId
      });
    }

  }
};
</script>
<style>
@import "./integralIndex.css";
</style>