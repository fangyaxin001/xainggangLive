<template>
<view class="claimer-mian">

  <image :src="pic" class="dist-pic" mode="widthFix"></image>
  <view class="dist-cont">
    <rich-text :nodes="content" space="emsp"></rich-text>
  </view>
  <!-- <button class='claimer-mian-btn'>申请成为分销员</button> -->
  <view class="claimer-mian-btn" @tap="onApplyDist">{{i18n.applyDistributor}}</view>
</view>
</template>

<script>
var http = require("../../../utils/http.js");

export default {
  data() {
    return {
      shopid: 1,
      content: '',
      pic: '',
      title: '',
      scene: ""
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
    //加载分销员推广
    // console.log(decodeURIComponent(options.scene),'11')
    this.setData({
      scene: this.$Route.query.scene
    });
    this.getClaimerList(this.shopid);
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
     * 查看
     */
    getClaimerList: function (shopid) {
      //uni.showLoading();
      var params = {
        url: "/api/v1/distribution/recruit/info",
        method: "GET",
        // data: {
        //   shopId:shopid,
        // },
        callBack: res => {
          this.setData({
            content: res.content,
            pic: res.pic,
            title: res.title
          }); //设置标题

          wx.setNavigationBarTitle({
            title: res.title
          });
        }
      };
      http.request(params);
    },
    onApplyDist: function () {
      // console.log(this.data.scene)
      if (this.scene) {
        uni.navigateTo({
          url: '/packageDistribution/pages/applyDistCon/applyDistCon?scene=' + this.scene
        });
      } else {
        uni.navigateTo({
          url: '/packageDistribution/pages/applyDistCon/applyDistCon'
        });
      }
    }
  }
};
</script>
<style>
@import "./applyDist.css";
</style>