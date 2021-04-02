<template>
<!--pages/alterShopPassword/alterShopPassword.wxml-->
<view class="set-accout">
  <!-- 输入旧密码 -->
  <view class="set-accout-item">
    <text class="item-tit" decode="true">{{i18n.oldPassword}}:</text>
    <input type="password" @input="bindOldPasswordInt" class="item-input" :placeholder="i18n.enterOldPassword"></input>
  </view>

  <!-- 输入密码 -->
  <view class="set-accout-item">
    <text class="item-tit" decode="true">{{i18n.newPassword}}:</text>
    <input type="password" @input="bindNewPasswordInt" class="item-input" :placeholder="i18n.newPasswordLength"></input>
  </view>

  <!-- 确认密码 -->
  <view class="set-accout-item">
    <text class="item-tit" decode="true">{{i18n.confirmNew}}:</text>
    <input type="password" @input="bindConfirmPasswordInt" class="item-input" :placeholder="i18n.enterNewPassword"></input>
  </view>

  <!-- 确认 -->
  <view class="confirm">
    <view class="confirm-btn" @tap="updateShopPassword">{{i18n.confirm}}</view>
  </view>


    <!-- tips -->
  <view class="tips-main">
    <view class="tips">{{i18n.alterShopPasswordTips}}</view>
  </view>
    

</view>
</template>

<script>
// pages/alterShopPassword/alterShopPassword.js
var http = require("../../utils/http.js");

export default {
  data() {
    return {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '' //确认密码

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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
	  //头部导航标题
	  uni.setNavigationBarTitle({
	      title:this.i18n.changeStorePassword
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
     * 修改密码
     */
    updateShopPassword: function () {
	  let ths = this
      uni.showLoading();

      if (this.oldPassword.length == 0) {
        uni.showToast({
          title: this.i18n.enterOldPassword,
          icon: 'none'
        });
      } else if (this.newPassword.length < 6 || this.newPassword.length > 12) {
        uni.showToast({
          title: this.i18n.enterNewPasswordTips,
          icon: 'none'
        });
      } else if (this.confirmPassword.length == 0) {
        uni.showToast({
          title: this.i18n.confirmNewEmpty,
          icon: 'none'
        });
      }  else if (this.newPassword != this.confirmPassword) {
        uni.showToast({
          title: this.i18n.comparedPassword,
          icon: 'none'
        });
      } else {
        var params = {
          url: "/api/v1/shop/updatePassword",
          methos: "POST",
          data: {
            password: this.oldPassword,
            newPassword: this.newPassword
          },
          callBack: res => {
            uni.hideLoading()            
			  uni.showToast({
              title: this.i18n.successfullyModified,
              duration: 2000,
			  })
			  setTimeout(function(){
				  	ths.$Router.pushTab('/pages/user/user')
			  },1000)
            }
        }
        http.request(params);
      }

    },

    /**
     * 获取input框的输入信息
     */
    bindOldPasswordInt: function (e) {
      this.setData({
        oldPassword: e.detail.value
      });
    },
    bindNewPasswordInt: function (e) {
      this.setData({
        newPassword: e.detail.value
      });
    },
    bindConfirmPasswordInt: function (e) {
      this.setData({
        confirmPassword: e.detail.value
      });
    }
  }
};
</script>
<style>
@import "./alterShopPassword.css";
</style>