<template>
<view class="InvitationCards-mian">
  <view class="InvitationCards-ont">
    <view class="InvitationCards-in">
      <view class="title">
        <view class="hrLineLeft">
          <view class="line"></view>
          <view class="circle"></view>
        </view>
        <view class="centerText">{{i18n.invitationCard}}</view>
        <view class="hrLineRight">
          <view class="circle"></view>
          <view class="line"></view>
        </view>
      </view>
      <view class="InvitationCards-in-image">
				<image :src="distInfo.pic ? distInfo.pic : '../../../static/images/icon/head01.png'" mode=""></image>
      </view>
      <view class="userinfo-name">
				<text>{{distInfo.nickName}}</text>
      </view>
      <view class="InvitationCards-yaoqi">{{i18n.inviteJoin}}</view>
      <view class="InvitationCards-in-image2">
        <image :src="shareWxCode"></image>
      </view>
    </view>
  </view>
  <view class="InvitationCards-mian-text">
    <text>{{i18n.screenshotTips}}</text>
  </view>
</view>
</template>

<script>
import { H5 } from '../../../js_sdk/hhyang-uni-simple-router/helpers/compile.js';
var http = require("../../../utils/http.js");
var config = require("../../../utils/config.js");
var Qr = require("../../../utils/wxqrcode");
import Wechat from "../../../utils/wechat.js"
export default {
  data() {
    return {
      shareWxCode: "", //生成的二维码路径 微信端
      qrSrc: '', // 生成的二维码路径 h5端
      isWechat: false, // 是否微信环境
			distInfo:{}
    };
  },

  components: {},
  props: {},
  computed:{
  	i18n() {
  		return this.$t('index')
  	}
  },

  onShow: function () {
		//头部导航标题
		uni.setNavigationBarTitle({
			title:this.i18n.invitationCard
    });
    // #ifdef H5
    this.isWechat = Wechat.isWechat()
    // #endif
		this.genWeixinCode();
		this.getDisInfo();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  methods: {
		/**
		 * 获取分销员信息
		 */
		getDisInfo() {
			http.request({
				url: "/api/v1/distribution/user/distributionUserInfo",
				method: "GET",
				data: {
					shopId: 1
				},
				callBack: res => {
					this.distInfo = res
				}
			})
		},
    /**
    * 生成小程序二维码
    */
    genWeixinCode() {
        
        uni.showLoading({
            mask: true
          });
          var cardno = wx.getStorageSync("distCardNo");
          http.request({
            url: "/api/v1/distribution/qrCode/invitation",
            method: "GET",
            responseType: 'arraybuffer',
            data: {
              page: "packageDistribution/pages/applyDist/applyDist",
              // page: "pages/prod/prod",
              scene: cardno
            },
            callBack: res => {
            // 微信小程序

						// #ifdef MP-WEIXIN
						this.setData({
						shareWxCode: "data:image/jpg;base64," + wx.arrayBufferToBase64(res)
            });
            uni.hideLoading();
						// #endif
						
            // #ifdef H5 || APP-PLUS
            cardno = uni.getStorageSync("distCardNo");
            let code =`${config.domain.replace('\/api','')}/packageDistribution/pages/applyDistCon/applyDistCon?scene=${cardno}`
						this.shareWxCode = Qr.createQrCodeImg(code, {size: 250});
            uni.hideLoading();
            // #endif
            
            }
        });
    }

  }
};
</script>
<style>
@import "./InvitationCards.css";
</style>
