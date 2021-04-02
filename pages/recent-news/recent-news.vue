<template>
<view>
<!--pages/recent-news/recent-news.wxml-->
<view class="container">
	<view class="recent-news" v-if="!isMemberMessage">
		<!-- 分销公告 -->
		<block v-for="(item, index) in distNews" :key="index">
			<view class="news-item" @tap="toNewsDetail" :data-id="item.msgId" data-type="dist">
				<view class="news-item-title">{{item.msgTitle}}</view>
				<view class="news-item-date">
					{{item.startTime}}
				</view>
			</view>
		</block>
		<!-- 普通公告 -->
		<block v-for="(item, index) in news" :key="index">
			<view class="news-item" @tap="toNewsDetail" :data-id="item.id">
				<view class="news-item-title">{{item.title}}</view>
				<view class="news-item-date">
					{{item.publishTime}}
				</view>
			</view>
		</block>
	</view>
	<!-- 会员消息展示 -->
	<view class="recent-news member-message-container" v-if="isMemberMessage">
		<view class="tab">
			<text :class="'tab-item ' + (status==0?'active':'')" @tap="changeTab" data-sts="0">{{i18n.unread}}</text>
			<text :class="'tab-item ' + (status==1?'active':'')" @tap="changeTab" data-sts="1">{{i18n.read}}</text>
		</view>
		<!-- 消息列表 -->
		<view class="message-list">
			<block v-for="(item, msgId) in messageList" :key="msgId">
				<view class="news-item">
					<view class="message-content">{{item.message}}</view>
					<view class="news-item-date">
						{{item.createTime}}
					</view>
				</view>
			</block>
      		<!-- 列表为空 -->
      <view class="empty" v-if="!messageList.length">
        <view class="empty-icon">
          <image src="../../static/images/icon/empty.png"></image>
        </view>
        <view class="empty-text">{{i18n.noData}}</view>
      </view>

		</view>
	</view>
</view>
</view>
</template>

<script>
// pages/recent-news/recent-news.js
var http = require("../../utils/http.js");
var config = require("../../utils/config.js");

export default {
  data() {
    return {
      news: [],
      disNotice: [],
      status: 0,
      // 会员消息列表: 0未读消息  1已读消息
      isMemberMessage: false,
      current: 1,
      pages: 0,
      isDist: "",
      distNews: "",
      messageList: "",
			// 店内公告
			showNews: false,
			shopId: 0,  // 默认0;平台
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
    this.setData({
      isDist: options.isDist
    });
    uni.setNavigationBarTitle({
      title: options.showMessage ? this.i18n.myMessage : this.i18n.latestAnnouncement
    });

    if (options.showMessage) {
      this.setData({
        isMemberMessage: true
      });
    }
		
		if (options.shopId) {
			this.setData({
				shopId: options.shopId
			})
		}
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.judgeMessageList()
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
  onReachBottom: function () {
    if (this.current < this.pages) {
      this.setData({
        current: this.current + 1
      });
      this.judgeMessageList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  methods: {
    // 判断是什么消息列表
    judgeMessageList () {
      if (this.isMemberMessage) {
					// 获取未读消息列表
					this.getMessageList();
				} else {
					var ths = this;
					if (ths.isDist == 'true') {
						// 加载分销的公告
						var params = {
							url: "/api/v1/distribution/msg/page",
							method: "GET",
							data: {
								current: this.current,
								size: 20,
							},
							callBack: function(res) {
								var list = [];
								if (res.current == 1) {
									list = res.records;
								} else {
									list = ths.distNews.concat(res.records);
								}
								ths.setData({
									distNews: list,
									pages: res.pages
								});
							}
						};
						http.request(params);
					} else {
						//加载公告
						var params = {
							url: `/shop/notice/noticeList/${this.shopId}`,
							method: "GET",
							data: {
								current: this.current,
								size: 20,
							},
							callBack: function(res) {
								var list = [];
								if (res.current == 1) {
									list = res.records;
								} else {
									list = ths.news.concat(res.records);
								}
								ths.setData({
									news: list,
									pages: res.pages
								});
							}
						};
						http.request(params);
					}
				}
    },
    // 跳转公告详情页
    toNewsDetail: function (e) {
      var id = e.currentTarget.dataset.id;
      var type = e.currentTarget.dataset.type;

      if (type == 'dist') {
        wx.navigateTo({
          url: '/pages/news-detail/news-detail?id=' + e.currentTarget.dataset.id + '&type=' + type
        });
      } else {
        wx.navigateTo({
          url: '/pages/news-detail/news-detail?id=' + e.currentTarget.dataset.id
        });
      }
    },

    /**
     *  获取消息列表
     */
    getMessageList() {
      if(!this.status){
        // 新消息接口每请求一次都会使总page减一所以需要让它默认当前页
				this.current = 1
			}
      var params = {
        url: '/api/v1/myNotifyLog/unReadCountList',
        method: 'GET',
        data: {
          current: this.current,
          size: 10,
          status: this.status
        },
        callBack: res => {
          var list = [];

          if (res.current == 1 && this.messageList.length == 0) {
            list = res.records;
          } else {
            list = this.messageList.concat(res.records);
          }
          if(!res.records.length){
            list = []
          }
          this.setData({
            messageList: list,
            current: res.current,
            pages: res.pages
          });
        }
      };
      http.request(params);
    },

    /**
     * 切换消息类型
     */
    changeTab(e) {
      this.setData({
        status: e.currentTarget.dataset.sts,
        current: 1
      });
      this.getMessageList();
    }

  }
};
</script>
<style>
@import "./recent-news.css";
</style>