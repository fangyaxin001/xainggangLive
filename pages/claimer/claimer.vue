<template>
<view class="claimer-mian">
<button class="claimer-mian-btn">{{i18n.applyDistributor}}</button>

</view>
</template>

<script>
var http = require("../../utils/http.js");

export default {
  data() {
    return {
      shopid: 1,
      content: '',
      pic: '',
      title: ''
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
        data: {
          shopId: shopid
        },
        callBack: res => {
          this.setData({
            content: res.content,
            pic: res.pic,
            title: res.title
          });
        }
      };
      http.request(params);
    }
  }
};
</script>
<style>
@import "./claimer.css";
</style>