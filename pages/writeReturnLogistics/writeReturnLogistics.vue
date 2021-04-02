<template>
<!-- 填写退货物流 -->
<!--pages/writeReturnLogistics/writeReturnLogistics.wxml-->

<view class="page">
  <!-- 物流公司 -->
  <picker class="picker-box" mode="selector" @change="chooseLogisticsCompany" :value="expressId" :range="deliveryList" range-key="dvyName">
    <view class="select-show select-box clearfix">
      <text class="select-text">{{i18n.logisticsCompany}}</text>
      <text class="select-results select-reason">{{deliveryList && deliveryList[expressId] ? deliveryList[expressId].dvyName : ''}}</text>
      <view class="right-arrow"><image src="/static/images/icon/more.png"></image></view>
    </view>
  </picker>
  

  <!-- 退货信息 -->
  <view class="write-msg">
    <!-- 单号 -->
    <view class="item-num">
      <label class="item-num-tit">{{i18n.logisticsOrderNo}}</label>
      <input class="item-num-num" maxlength="20" :placeholder="i18n.logisticsOrderNoTips" :value="expressNo" @input="onExpressNoInput"></input>
    </view>
    <!-- 说明 -->
    <view class="item-num">
      <label class="item-num-tit">{{i18n.remarks}}</label>
      <input class="item-num-num refund-explain" :placeholder="i18n.optional200Words" maxlength="200" :value="senderRemarks" @input="onSenderRemarksInput"></input>
    </view>

    <!-- 上传照片 -->
    <view class="item-num">
      <label class="item-num-tit upload-tit">{{i18n.uploadCertificate}}</label>
      <view class="upload-img">
        <view class="upload-tips">{{i18n.uploadPics}}</view>
        <!-- 预览缩略图 -->
          <block v-for="(imgItem, idx) in imgs" :key="idx">
            <view class="q-image-wrap">
              <!-- 图片缩略图  -->
              <image class="q-image" :src="imgItem.url" mode="aspectFill" :data-idx="idx"></image>
              <!-- 移除图片的按钮  -->
              <view class="q-image-remover" :data-idx="idx" @tap="removeImage"><image src="/static/images/icon/close2.png"></image></view>
            </view>
          </block>
        <!-- 添加图片按钮 -->
        <view class="upload-btn" v-if="imgs.length < 5" @tap="getUploadImg">+</view>
      </view>
    </view>
    <!-- 上传照片end -->
  </view>
  <!-- 退货信息end -->


  <!-- 提交btn -->
  <view class="submit-btn" @tap="writeLogisticsMsg">{{i18n.submit}}</view>


</view>
</template>

<script>
// pages/writeReturnLogistics/writeReturnLogistics.js
var http = require("../../utils/http.js");

export default {
  data() {
    return {
      // 物流公司选择
      deliveryList: [],
      expressId: 0,
      //物流公司id
      expressName: '',
      //物流公司名称
      expressNo: '',
      //物流单号
      imgs: [],
      //图片凭证
      mobile: '',
      //手机号码
      refundSn: '',
      //退款编号名称
      senderRemarks: '' //备注信息

    };
  },

  components: {},
  props: {},

  computed: {
    i18n() {
      return this.$t('index')
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      refundSn: options.refundSn
    });
    this.loadDeliveryData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //头部导航标题
    uni.setNavigationBarTitle({
      title: this.i18n.fillInReturn
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () { },
  methods: {
    /**
     * 选择物流公司
     */
    chooseLogisticsCompany: function (e) {
      this.setData({
        expressId: e.detail.value
      });
    },
    onExpressNoInput: function (e) {
      this.setData({
        expressNo: e.detail.value
      });
    },
    onSenderRemarksInput: function (e) {
      this.setData({
        senderRemarks: e.detail.value
      });
    },

    /**
     * 填写&提交物流信息
     */
    writeLogisticsMsg: function (e) {
      uni.showLoading();

      if (this.expressNo.length == 0) {
        uni.showToast({
          icon: 'none',
          title: this.i18n.logisticsOrderNoTips
        });
      } else {
        var pics = '';
        this.imgs.forEach(function (item) {
          pics += item.path + ',';
        });

        if (pics != '') {
          pics = pics.substring(0, pics.length - 1);
        }
        var parmas = {
          url: "/api/v1/orderRefund/submitExpress",
          method: "POST",
          data: {
            expressId: this.deliveryList[this.expressId].dvyId,
            //物流公司id
            expressName: this.deliveryList[this.expressId].dvyName,
            //物流公司名称
            expressNo: this.expressNo,
            //物流单号
            imgs: pics,
            //图片凭证
            mobile: this.mobile,
            //手机号码
            refundSn: this.refundSn,
            //退款编号名称
            senderRemarks: this.senderRemarks //备注信息

          },
          callBack: res => {
            uni.hideLoading()// 物流填写跳转页面
            uni.navigateTo({
              url: '/pages/DetailsOfRefund/DetailsOfRefund?refundSn=' + this.refundSn
            });
            // uni.navigateBack({
            //   delta: 1
            // });
          }
        };
        http.request(parmas);
      }
    },

    /**
     * 上传图片
     */
    getUploadImg: function () {
      var ths = this;
      wx.chooseImage({
        count: 5,
        // 默认9
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          // 图片的本地临时文件路径列表
          var tempFilePaths = res.tempFilePaths;
          uni.showLoading({
            mask: true
          });
          var params = {
            url: "/api/v1/file/upload",
            filePath: tempFilePaths[0],
            name: 'file',
            callBack: function (res2) {
              uni.hideLoading()
              var img = {};
              img.path = JSON.parse(res2).filePath;
              img.url = JSON.parse(res2).resourcesUrl + JSON.parse(res2).filePath;
              var imgs = ths.imgs;
              imgs.push(img);
              ths.setData({
                imgs: imgs
              });
            }
          };
          http.upload(params);
        }
      });
    },

    /**
     * 删除图片
     */
    removeImage: function (e) {
      // const index = e.target.dataset.index
      // const idx = e.target.dataset.idx;
      var idx = e.currentTarget.dataset.idx;
      var imgs = this.imgs;
      imgs.splice(idx, 1);
      this.setData({
        imgs: imgs
      });
    },

    loadDeliveryData() {
      uni.showLoading();
      http.request({
        url: "/api/v1/delivery/list",
        method: "get",
        data: {},
        callBack: res => {
          uni.hideLoading()
          this.setData({
            deliveryList: res
          });
        }
      });
    }

  }
};
</script>
<style>
@import "./writeReturnLogistics.css";
</style>