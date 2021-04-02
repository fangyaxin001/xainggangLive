<template>
<view class="container">
  <view class="main">
    <!-- 信息输入框 -->
    <view class="section">
      <input :placeholder="i18n.mobilePhone" type="number" maxlength="11" @input="onMobileInput"></input>
    </view>
    <view class="section" v-if="needRealName">
      <input :placeholder="i18n.actualName" type="text" @input="onRealNameInput"></input>
    </view>
    <view class="section" v-if="needIdCardNo">
      <input :placeholder="i18n.identification" type="text" maxlength="18" @input="onIdCardNoInput"></input>
    </view>
    <view v-if="neddIdCardPic">
      <view class="upload" @tap="uploadIdCardFront">
        <image v-if="identityCardPicFrontCom" :src="identityCardPicFrontCom"></image>
        <text v-else>{{i18n.uploadIDFront}}</text>
      </view>
      <view class="upload" @tap="uploadIdCardBack">
        <image v-if="identityCardPicBackCom" :src="identityCardPicBackCom"></image>
        <text v-else>{{i18n.uploadIDBack}}</text>
      </view>
      <view class="upload" @tap="uploadIdCardHold">
        <image v-if="identityCardPicHoldCom" :src="identityCardPicHoldCom"></image>
        <text v-else>{{i18n.uploadIDHand}}</text>
      </view>
    </view>


    <!-- 提交申请栏 -->
    <view class="submit-btn" @tap="submitDisterApply">
      <text>{{i18n.submitApplication}}</text>
    </view>
    <!--end 提交申请栏 -->
  </view>
</view>
</template>

<script>
var http = require("../../../utils/http.js");
var util = require("../../../utils/util.js");

export default {
  data() {
    return {
      identityCardNumber: "",
      identityCardPicBack: "",
      identityCardPicFront: "",
      identityCardPicHold: "",
      identityCardPicBackCom: "",
      identityCardPicFrontCom: "",
      identityCardPicHoldCom: "",
      realName: "",
      sharerCardNo: "",
      // shopId: 1,
      userMobile: "",
      needIdCardNo: false,
      neddIdCardPic: false,
      needRealName: false,
      distributionCardNo: ""
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
  	      title:this.i18n.applyDistributor
  	  });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    uni.showLoading();
    var params = {
      url: "/api/v1/distribution/register/condition",
      method: "GET",
      callBack: res => {
        this.setData({
          needIdCardNo: res.identityCardNumber,
          neddIdCardPic: res.identityCardPic,
          needRealName: res.realName
        });
        uni.hideLoading()      }
    };
    http.request(params);

    if (this.$Route.query.scene) {

      // #ifdef MP-WEIXIN
      const scene = decodeURIComponent(this.$Route.query.scene);
      this.setData({
        distributionCardNo: scene
      });
      // #endif

      // #ifdef H5 || APP-PLUS
      this.distributionCardNo = this.$Route.query.scene
      // #endif

    }
  },
  methods: {
    onMobileInput: function (e) {
      this.setData({
        userMobile: e.detail.value
      });
    },
    onRealNameInput: function (e) {
      this.setData({
        realName: e.detail.value
      });
    },
    onIdCardNoInput: function (e) {
      this.setData({
        identityCardNumber: e.detail.value
      });
    },
    uploadIdCardFront: function () {
      var ths = this
      wx.chooseImage({
        count: 1,
        // 默认9
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) =>{
          var tempFilePaths = res.tempFilePaths;
          uni.showLoading({
            mask: true
          });
          var params = {
            url: "/api/v1/file/upload",
            filePath: tempFilePaths[0],
            name: 'file',
            callBack: (res2) => {
              wx.hideLoading()
							this.identityCardPicFrontCom = JSON.parse(res2).resourcesUrl + JSON.parse(res2).filePath
							this.identityCardPicFront =JSON.parse(res2).filePath
            }
          };
          http.upload(params);
        }
      });
    },
    uploadIdCardBack: function () {
      var ths = this;
      wx.chooseImage({
        count: 1,
        // 默认9
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          var tempFilePaths = res.tempFilePaths;
          uni.showLoading({
            mask: true
          });
          var params = {
            url: "/api/v1/file/upload",
            filePath: tempFilePaths[0],
            name: 'file',
            callBack: function (res2) {
              uni.hideLoading();
              ths.setData({
                identityCardPicBackCom: JSON.parse(res2).resourcesUrl + JSON.parse(res2).filePath,
                identityCardPicBack: JSON.parse(res2).filePath
              });
            }
          };
          http.upload(params);
        }
      });
    },
    uploadIdCardHold: function () {
      var ths = this;
      wx.chooseImage({
        count: 1,
        // 默认9
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          var tempFilePaths = res.tempFilePaths;
          uni.showLoading({
            mask: true
          });
          var params = {
            url: "/api/v1/file/upload",
            filePath: tempFilePaths[0],
            name: 'file',
            callBack: function (res2) {
              uni.hideLoading();
              ths.setData({
                identityCardPicHoldCom: JSON.parse(res2).resourcesUrl + JSON.parse(res2).filePath,
                identityCardPicHold: JSON.parse(res2).filePath
              });
            }
          };
          http.upload(params);
        }
      });
    },

    /**
     * 提交申请
     */
    submitDisterApply: function () {
      var identityCardNumber = this.identityCardNumber;
      var identityCardPicBack = this.identityCardPicBack;
      var identityCardPicFront = this.identityCardPicFront;
      var identityCardPicHold = this.identityCardPicHold;
      var distributionCardNo = this.distributionCardNo;
      var realName = this.realName;
      var userMobile = this.userMobile;
      var needIdCardNo = this.needIdCardNo;
      var neddIdCardPic = this.neddIdCardPic;
      var needRealName = this.needRealName;
			
			if (userMobile.length == 0) {
				uni.showToast({
				  title: this.i18n.enterMobileNumber,
				  icon: "none"
				});
			} else if (!util.checkPhoneNumber(userMobile)) {
        uni.showToast({
          title: this.i18n.enterCorrectPhone,
          icon: "none"
        });
      } else if (needRealName && realName.length < 2) {
        uni.showToast({
          title: this.i18n.enterRealName,
          icon: "none"
        });
      } else if (needIdCardNo && !util.checkIDCard(identityCardNumber)) {
        uni.showToast({
          title: this.i18n.identificationTips,
          icon: "none"
        });
      } else if (neddIdCardPic && identityCardPicFront == "") {
        uni.showToast({
          title: this.i18n.uploadIDFront,
          icon: "none"
        });
      } else if (neddIdCardPic && identityCardPicBack == "") {
        uni.showToast({
          title: this.i18n.uploadIDBack,
          icon: "none"
        });
      } else if (neddIdCardPic && identityCardPicHold == "") {
        uni.showToast({
          title: this.i18n.uploadIDHand,
          icon: "none"
        });
      } else {
        uni.showLoading({
          mask: true
        });
        var params = {
          url: "/api/v1/distribution/register/addDistributionUser",
          method: "post",
          data: {
            identityCardNumber: identityCardNumber,
            identityCardPicBack: identityCardPicBack,
            identityCardPicFront: identityCardPicFront,
            identityCardPicHold: identityCardPicHold,
            realName: realName,
            sharerCardNo: distributionCardNo,
            // shopId: 1,
            userMobile: userMobile
          },
          callBack: res => {
            uni.hideLoading()
            uni.showModal({
              content: this.i18n.applicationSubmitted,
              showCancel: false,
			  cancelText: this.i18n.cancel,
			  confirmText: this.i18n.confirm,
              complete: ()=> {
                // uni.switchTab({
                //   url: '/pages/user/user'
                // });
                this.$Router.pushTab('/pages/user/user')
              }
            });
          }
        };
        http.request(params);
      }
    }
  }
};
</script>
<style>
@import "./applyDistCon.css";
</style>
