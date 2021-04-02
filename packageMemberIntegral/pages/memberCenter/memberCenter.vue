<template>
<!-- 会员中心 -->
<!--pages/memberCenter/memberCenter.wxml-->
<view class="member-index">
  <!-- 会员信息 -->
  <view class="member-msg">
    <view class="member-container">
      <image src="../../static/images/icon/memberLevelBg.png" :class="'m-bg ' + (isSmallScreen?'small-screen':'')"></image>
      <view class="member-info">
        <view class="member-info-top">
          <view class="user-info">
            <image class="user-avatar" :src="userInfo.pic?userInfo.pic:'/static/images/icon/head04.png'"></image>
            <view class="user-nickname">
              <view class="nickname">{{memberInfo.nickName}}</view>
              <!-- <view class="user-score" bindtap="routeTo" data-path="scoreDet">
                <image class="score-img" src="../../images/icon/integral.png"></image>
                <text> 积分: {{memberInfo.score}} </text>
                <image class="right-arr" src="../../images/icon/white-arr.png"></image>
              </view> -->
            </view>
          </view>
          <view class="user-level">
            <text v-if="memberInfo.userLevel">{{memberInfo.userLevel.levelName}}</text>
            <!-- <image wx:if="{{(memberInfo.userLevel.level>1 && memberInfo.levelType ==0) || memberInfo.levelType !=0}}" class="level-img" src='../../images/icon/vip{{memberInfo.userLevel.level}}.png'></image> -->
          </view>
        </view>

        <view class="member-info-bottom">
          <view class="vip-level-progress">
            <view class="level-tips">
              <text v-if="memberInfo.nextGrowth -memberInfo.growth < 0">{{i18n.currentGrowthFull}}</text>
              <text v-else>{{i18n.upgradeStillNeeded}} {{memberInfo.nextGrowth -memberInfo.growth}}{{i18n.growthValue}}</text>
              <progress class="level-progress" :percent="percent" backgroundColor="#feeee0" activeColor="#9e642e" active="true" border-radius="8" stroke-width="4"></progress>
              <view class="level-span">
                <text v-if="memberInfo.userLevel">{{memberInfo.userLevel.levelName}}</text>
                <text>{{memberInfo.nextLevelName}}</text>
              </view>
            </view>
            <view class="level-text" v-if="memberInfo.nextGrowth">{{i18n.growthValue}} {{memberInfo.growth}} / {{memberInfo.nextGrowth}}</view>
            <view class="level-text" v-else>{{i18n.growthValue}} {{memberInfo.growth}}</view>
          </view>
        </view>
      </view>

    </view>
  </view>
  <!-- /会员信息 -->

  <!-- 会员成长说明 -->
  <view class="member-growth" v-if="memberInfo.levelType!=1">
    <view class="member-tit">
      <view class="text">{{i18n.memberGrowthDescription}}</view>
    </view>
    <!-- 成长值 -->
    <view class="growth-value">
      <view class="value-table">
        <view class="tr">
          <view class="td-left th">{{i18n.grade}}</view>
          <view class="td-right th">{{i18n.correspondingGrowthValue}}</view>
        </view>
        <view class="tr" v-for="(item, id) in userLevels" :key="id">
          <view class="td-left">{{item.levelName}}</view>
          <view class="td-right">{{item.needGrowth}}</view>
        </view>
      </view>

    </view>
    <!-- 成长值 -->

  </view>
  <!-- /会员成长说明 -->


  <!-- vip专属权益 -->
  <view class="member-growth member-rights">
    <view class="member-tit">
      <view class="text">{{i18n.exclusiveMembers}}</view>
      <text class="more-rights" @tap="toogleShowRights">{{i18n.moreInterests}}></text>
    </view>
    <view class="rights-container" v-if="memberInfo.userLevel">
      <block v-for="(right, rightsId) in memberInfo.userLevel.userRights" :key="rightsId">
        <view class="right-item">
          <view class="right-lf">
            <image mode="widthFix" :src="right.icon"></image>
          </view>
          <view class="right-rt">
            <view class="right-tit">{{right.rightsName}}</view>
            <view class="right-desc">{{right.description}}</view>
          </view>
        </view>
      </block>
    </view>
  </view>
  <!-- /vip专属权益 -->


  <!-- 弹窗Swiper -->
  <view class="swiperPop" v-if="showRights">
    <view class="mask" v-if="showRights" @tap="toogleShowRights">
      <view class="close">
        <image src="/static/images/icon/close-white.png"></image>
      </view>
    </view>
    <swiper indicator-dots indicator-active-color="#fff" indicator-color="rgba(255,255,255,.2)" :duration="duration" next-margin="20rpx" previous-margin="50rpx">
      <block v-for="(levelItem, id) in userLevels" :key="id">
        <swiper-item class="member-item">
          <view class="swiper-box">
            <view class="top-bg">
              <image class="member-bg" :src="levelItem.img"></image>
              <view class="top-con">
                <view class="member-title">{{levelItem.levelName}}</view>
                <text class="member-desc">{{levelItem.userRights.length}}{{i18n.itemXiang}} {{i18n.exclusiveMembers}}</text>
              </view>
            </view>
            <view class="rights-item-con">
              <block v-for="(right, rightsId) in levelItem.userRights" :key="rightsId">
                <view class="rights-item">
                  <view class="rights-img">
                    <image mode="heightFix" :src="right.icon"></image>
                  </view>
                  <view class="rights-tit">{{right.rightsName}}</view>
                  <view class="rights-desc">{{right.description}}</view>
                </view>
              </block>
            </view>
          </view>
        </swiper-item>
      </block>
    </swiper>
  </view>
  <!-- /弹窗Swiper -->

</view>
</template>

<script module="wxs" lang="wxs" src="../../../wxs/number.wxs"></script>

<script>
// pages/memberCenter/memberCenter.js
var http = require("../../../utils/http");

export default {
  data() {
    return {
      interval: 2000,
      duration: 1000,
      showRights: false,
      memberInfo: {},
      userInfo: {},
      userLevels: [],
      percent: 0,
      isSmallScreen: false // 是否小屏幕(高度低于568: 如iphone5)

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
    var ths = this; // 获取设备信息, 调整背景头图高度

    wx.getSystemInfo({
      success: function (res) {
        console.log(res);

        if (res.screenHeight <= 568) {
          ths.setData({
            isSmallScreen: true
          });
        }
      },
      fail: function (res) {},
      complete: function (res) {}
    }); // 获取用户信息

    this.setData({
      userInfo: wx.getStorageSync('loginResult')
    }); // 获取当前会员信息

    this.getMemberInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

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
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  methods: {
    /**
     * 跳转
     */
    routeTo(e) {
      const path = e.currentTarget.dataset.path;

      if (path == 'scoreDet') {
        uni.navigateTo({
          url: '/pages/integralDetail/integralDetail'
        });
      }
    },

    /**
     * 获取用户当前会员信息
     */
    getMemberInfo() {
      uni.showLoading();
      var params = {
        url: '/api/v1/score/scoreLevel/page',
        method: 'GET',
        data: {
          levelType: 0
        },
        callBack: res => {
          uni.hideLoading()          
					this.setData({
            memberInfo: res,
            userLevels: res.userLevels,
            percent: res.growth / res.nextGrowth * 100
          });
        }
      };
      http.request(params);
    },

    /**
     * 显/隐更多权益
     */
    toogleShowRights() {
      this.setData({
        showRights: !this.showRights
      });
    }

  }
};
</script>
<style>
@import "./memberCenter.css";
</style>