<template>
<!-- 提示登录弹框 -->
<view class="login-popup" v-if="!isAuthInfo">
  <view class="log-pop-main">
    <view class="log-pop-tit">{{i18n.welcomeYami}}</view>
    <view class="log-pop-msg">{{i18n.authorizeLogin}}</view>
    <view class="log-pop-btns">
      <button class="log-pop-no" @tap="hidePopup">{{i18n.cancel}}</button>
      <button class="log-pop-ok" open-type="getUserInfo" lang="zh_CN" @getuserinfo="onGetUserInfo">{{i18n.confirm}}</button>
    </view>
  </view>
</view>
</template>

<script>
var http = require("../../utils/http.js");

export default {
  data() {
    return {};
  },

  components: {},
  props: {
    isAuthInfo: Boolean
  },
  
  computed:{
  	i18n() {
  		return this.$t('index')
  	}
  },
  
  methods: {
    /**
      * 获取用户信息
      */
    onGetUserInfo: function (e) {
      this.$emit('onGotUserInfo', e.detail);
    },
    hidePopup: function () {
      this.setData({
        isAuthInfo: true
      });
    }
  }
};
</script>
<style>
@import "./loginPopup.css";
</style>