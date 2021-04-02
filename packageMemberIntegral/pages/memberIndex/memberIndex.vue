<template>
<!-- 会员首页 -->
<view class="member-index">
  <!-- 会员信息 -->
  <view class="member-msg">
    <image src="../../static/images/icon/memberIndexBg.png" class="m-bg"></image>
    <view class="member-info">
      <view class="head-portrait">
        <image :src="userInfo.pic? userInfo.pic : '/static/images/icon/head04.png'"></image>
      </view>
      <view class="text-box">
        <view class="name-box">
          <text class="name">{{userInfo.nickName}}</text>
          <view class="level">
            <image :src="userMemberInfo.levelType == 0 ?'/static/images/icon/normal-icon.png':'/static/images/icon/integral-icon.png'" class="l-bg"></image>
            <view class="text" v-if="userMemberInfo.userLevel">{{userMemberInfo.userLevel.levelName}}</view>
          </view>
        </view>
        <view class="date">{{userMemberInfo.levelType == 0 ? i18n.notPayingMember: wxs.spliceDate(userMemberInfo.endTime)+ i18n.expire}}</view>
      </view>
      <view class="buy-btn" @tap="buyMember">{{i18n.buyMembership}}</view>
    </view>
    <view class="grow-box">
      <view class="item">
        <view class="text">{{i18n.currentGrowthValue}}</view>
        <view class="number-box" @tap="toMemberCenter">
          <text class="number">{{userCenterInfo.growth}}</text>
          <view class="arr">
            <image src="/static/images/icon/white-arr.png"></image>
          </view>
        </view>
      </view>
      <view class="item">
        <view class="text">{{i18n.currentPoints}}</view>
        <view class="number-box" @tap="toIntegralDetail">
          <text class="number">{{userCenterInfo.score}}</text>
          <view class="arr">
            <image src="/static/images/icon/white-arr.png"></image>
          </view>
        </view>
      </view>
    </view>
  </view>
  <!-- /会员信息 -->
  <!-- 签到 -->
  <view class="sign-in">
    <view class="member-tit">
      <view class="text">{{i18n.dailySignIn}}</view>
    </view>
    <view class="con-box">
      <view class="item" @tap="getPoints" v-for="(item, index) in userCenterInfo.scoreList" :key="index" :data-index="index">
        <view class="number" v-if="signInItem<index+1 && 7>userCenterInfo.signInCount">+{{item}}</view>
				<view class="number" v-if="signInItem<index+1 && 7<=userCenterInfo.signInCount">+{{userCenterInfo.scoreList[6]}}</view>
        <view class="number active num-text" @tap="getPoints" data-type="1" v-if="signInItem==index+1 && userCenterInfo.isSignIn==0">{{i18n.signIn}}</view>
        <view class="number active num-text" v-if="(signInItem>=index+1 && userCenterInfo.isSignIn==1)||(signInItem>index+1 && userCenterInfo.isSignIn==0)">{{i18n.signedIn}}</view>
        <view class="day" v-if="userCenterInfo.signInCount<7">{{i18n.dayItem}}{{index+1}}{{i18n.day}}</view>
				<view class="day" v-if="userCenterInfo.signInCount>=7">{{i18n.dayItem}}{{index+1+(userCenterInfo.signInCount-7+1)}}{{i18n.day}}</view>
      </view>
    </view>
  </view>
  <!-- /签到 -->
  <!-- 积分活动 -->
  <view class="activity">
    <view class="member-tit">
      <view class="text">{{i18n.integralActivity}}</view>
    </view>
    <view class="con-box">
      <view class="item" @tap="goodsListViewMore">
        <image src="../../static/images/icon/integralActBg1.png" class="bg"></image>
        <view class="b-text">{{i18n.pointsMall}}</view>
        <view class="s-text">{{i18n.exchangePointsGoods}}</view>
      </view>
      <view class="item" @tap="toLuckyDraw">
        <image src="../../static/images/icon/integralActBg2.png" class="bg"></image>
        <view class="b-text">{{i18n.largeTurntable}}</view>
        <view class="s-text">{{i18n.PointsLuckyDraw}}</view>
      </view>
    </view>
  </view>
  <!-- /积分活动 -->
  <!-- 任务 -->
  <view class="mission">
    <view class="member-tit">
      <view class="text">{{i18n.integralTask}}</view>
      <!-- <view class="more">查看更多</view> -->
    </view>
    <view class="con-box">
      <!-- <view class="item">
        <view class="mission-box">
          <view class="name">购买付费会员</view>
          <view class="mission-des">购买付费会员可获得积分/次</view>
        </view>
        <view class="btn" bindtap="buyMember">去购买</view>
      </view> -->
      <view class="item">
        <view class="mission-box">
          <view class="name">{{i18n.shoppingMall}}</view>
          <view class="mission-des">{{i18n.shoppingMallGet}}，{{userCenterInfo.shopScore}}{{i18n.itemYuan}}</view>
        </view>                                                                                                                                                                             
        <view class="btn" @tap="toIndexPage">{{i18n.goShopping}}</view>
      </view>
      <view class="item">
        <view class="mission-box">
          <view class="name">{{i18n.registerNewUsers}}</view>
          <view class="mission-des">{{i18n.registerNewUsersTips}}{{userCenterInfo.registerScore}}{{i18n.integral}}</view>
        </view>
        <view class="btn" v-if="userCenterInfo.isRegister == 0" @tap="getPoints" data-type="11">{{i18n.toComplete}}</view>
        <view class="btn done" v-if="userCenterInfo.isRegister == 1">{{i18n.completed}}</view>
      </view>
    </view>
  </view>
  <!-- /任务 -->
  <!-- 积分兑换 -->
  <view class="integral-list" v-if="scoreProdList.length">
    <view class="member-tit">
      <view class="text">{{i18n.pointsExchange}}</view>
      <view class="more" @tap="goodsListViewMore">{{i18n.seeMore}}</view>
    </view>
    <view class="con-box">
      <block v-for="(prod, prodId) in scoreProdList" :key="prodId">
        <goodsitem :prod="prod"></goodsitem>
      </block>
    </view>
  </view>
  <!-- 积分兑换 -->
</view>
</template>

<script module="wxs" lang="wxs" src="../../../wxs/number.wxs"></script>

<script>
// pages/memberIndex/memberIndex.js
var http = require("../../../utils/http.js");
var util = require("../../../utils/util.js");
import goodsitem from "../../components/IntegralGoodsList/IntegralGoodsList.vue";

export default {
  data() {
    return {
      isAuthInfo: true,
      loginResult: {},
      userCenterInfo: {},
			signInItem: '', // 领取积分签到第几个签到按钮，大于7天，一直为第六个签到按钮
      current: 1,
      size: 20,
      scoreProdList: [],
      //积分商品列表
      userInfo: {},
      //个人信息
      userMemberInfo: {}, // 用户等级信息
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
    // 获取会员中心信息
    this.getMemberCenterInfo(); //请求积分商品列表

    this.getScoreProdList(); //获取用户信息

    this.getUserInfo(); // 获取用户会员信息

    this.getUserMemberInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      isAuthInfo: Boolean(wx.getStorageSync('loginResult').nickName),
      loginResult: wx.getStorageSync('loginResult')
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
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  methods: {
    /**
     * 获取用户当前会员信息
     */
    getUserMemberInfo() {
      
      // 付费会员等级
      var params = {
        url: '/api/v1/score/scoreLevel/page',
        method: 'GET',
        data: {
          levelType: 0
        },
        callBack: res => {
          this.setData({
            userMemberInfo: res,
            levelType: res.levelType
          });
        }
      };
      http.request(params);
    },

    /**
     * 获取用户信息
     */
    getUserInfo: function () {
      var param = {
        url: '/api/v1/user/userInfo',
        method: 'GET',
        data: {},
        callBack: res => {
          this.setData({
            userInfo: res
          });
        }
      };
      http.request(param);
    },

    /**
     * 获取会员中心信息
     */
    getMemberCenterInfo: function () {
      var params = {
        url: "/api/v1/score/scoreInfo",
        method: "GET",
        data: {},
        callBack: res => {
					// 领取积分签到第几个签到按钮，大于7天，一直为第六个签到按钮
					let signInItem = ''
					if (res.signInCount>=7) {
						signInItem = 6
					} else {
						signInItem = res.signInCount
					}
          this.setData({
            userCenterInfo: res,
						signInItem
          })
        }
      };
      http.request(params);
    },

    /**
     * 获取积分的方法（签到）
     */
    getPoints(e) {
			var  index = Number(e.currentTarget.dataset.index);
			var params = {
				url: '/api/v1/score/updateUserScore',
				method: 'GET',
				data: {},
				callBack: res => {
					uni.showToast({
						title: res,
						icon: 'none'
					});
					this.getMemberCenterInfo();
				}
			};

			if (this.userCenterInfo.isSignIn == 1 && this.signInItem == index + 1) {
				uni.showToast({
					title: this.i18n.hasAlreadySigned,
					icon: 'none'
				});
			} else if (this.userCenterInfo.isSignIn == 0 && this.signInItem == index + 1) {
				http.request(params);
			} else if (this.signInItem > index + 1) {
				uni.showToast({
					title: this.i18n.hasAlreadySigned,
					icon: 'none'
				});
			} else {
			}
    },

    /**
     * 跳转到积分明细(当前积分)
     */
    toIntegralDetail: function () {
      uni.navigateTo({
        url: '/packageMemberIntegral/pages/integralDetail/integralDetail'
      });
    },

    /**
     * 跳转到会员中心(当前成长值)
     */
    toMemberCenter: function () {
      uni.navigateTo({
        url: '/packageMemberIntegral/pages/memberCenter/memberCenter'
      });
    },

    /**
     * 购买会员跳转页面
     */
    buyMember: function () {
      uni.navigateTo({
        url: '/packageMemberIntegral/pages/buyVip/buyVip'
      });
    },

    /**
     * 去购物
     */
    toIndexPage: function () {
      this.$Router.pushTab('/pages/index/index')
      // uni.switchTab({
      //   url: '../../..
      // });
    },

    /**
     * 积分兑换 查看更多
     */
    goodsListViewMore: function () {
      uni.navigateTo({
        url: '/packageMemberIntegral/pages/integralIndex/integralIndex'
      });
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
          size: this.size
        },
        callBack: res => {
          uni.hideLoading()          
					this.setData({
            scoreProdList: res.records
          });
        }
      };
      http.request(param);
    },

    /**
     * 跳转大转盘抽奖
     */
    toLuckyDraw() {
      uni.showToast({
        title: this.i18n.comingOnlineSoon,
        icon: 'none'
      }); // uni.navigateTo({
      //   url: '/packageMemberIntegral/pages/luckyDraw/luckyDraw',
      // })
    }

  }
};
</script>
<style>
@import "./memberIndex.css";
</style>