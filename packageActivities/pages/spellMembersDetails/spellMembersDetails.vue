<template>
<!-- 团员详情 -->
<!--pages/spellMembersDetails/spellMembersDetails.wxml-->
<view class="page">
  <view class="member-list" v-for="(teamUser, userId) in teamUserList" :key="userId">
    <view class="member-item">
      <view class="head-img">
        <image :src="teamUser.pic?teamUser.pic:'../../../static/images/icon/head04.png'"></image>
        <!-- 团长标识 -->
        <text v-if="teamUser.identityType ==1" class="group-leader">{{i18n.teamLeader}}</text>
      </view>
      <view class="member-msg">
        <view class="member-name">{{teamUser.nickName}}</view>
        <view v-if="teamUser.identityType ==1" class="time">{{teamUser.createTime}} {{i18n.startAGroup}}</view>
        <!-- 参团 -->
        <view v-else class="time">{{teamUser.createTime}} {{i18n.jionInGroup}}</view>
      </view>
    </view>
  </view>
</view>
</template>

<script>
// pages/spellMembersDetails/spellMembersDetails.js
const app = getApp().globalData;
var http = require("../../../utils/http.js");
var config = require("../../../utils/config.js");
var util = require("../../../utils/util.js");

export default {
  data() {
    return {
      teamUserList: []
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
    let groupTeamId = options.groupTeamId;
    this.getGroupTeamInfo(groupTeamId);
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
	      title:this.i18n.membersTheDetails
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
     * 获取活动列表
     */
    getGroupTeamInfo: function (groupTempId) {
      http.request({
        url: "/api/v1/groupTeam/joinUsers",
        method: "GET",
        data: {
          groupTeamId: groupTempId
        },
        callBack: res => {
          this.setData({
            teamUserList: res
          });
        }
      });
    }
  }
};
</script>
<style>
@import "./spellMembersDetails.css";
</style>