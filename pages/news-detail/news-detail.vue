<template>
  <!--pages/news-detail/news-detail.wxml-->
  <view class="container">
    <view class="news-detail">
      <view class="news-detail-title" v-if="news.msgTitle">{{news.msgTitle}}</view>
      <view class="news-detail-title" v-else>{{news.title}}</view>
      <rich-text :nodes="news.content"></rich-text>
    </view>
  </view>
</template>

<script>
// pages/news-detail/news-detail.js
var http = require("../../utils/http.js");
var util = require('../../utils/util.js');

export default {
  data () {
    return {
      news: {
        title: '',
        //标题
        msgTitle: '',
        //分销通知标题
        content: '',
        id: 0
      }
    };
  },

  components: {
		
	},
  props: {},
  computed: {
    i18n () {
      return this.$t('index')
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type == 'dist') {
      // 加载分销公告
      var params = {
        url: '/api/v1/distribution/msg/info',
        method: "GET",
        data: {
          msgId: options.id
        },
        callBack: res => {
          if (res.content) {
            res.content = util.formatHtml(res.content)
          }
          this.setData({
            news: res
          });
        }
      };
      http.request(params);
    } else {
      //加载公告详情
      var params = {
        url: '/shop/notice/info/' + options.id,
        method: "GET",
        callBack: res => {
          if (res.content) {
						res.content = util.formatHtml(res.content)
          }
          this.setData({
            news: res
          });
        }
      };
      http.request(params);
    }
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
      title: this.i18n.latestAnnouncement
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
  methods: {}
};
</script>
<style>
@import "./news-detail.css";
</style>