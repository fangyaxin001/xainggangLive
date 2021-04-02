<template>
<view class="container">
  <view class="comm-list">
    <view class="comm-item" v-for="(item, index) in orderItemInfo" :key="index">
      <!-- 商品标题内容 -->
      <view class="item-top">
        <view class="top-pic">
          <image mode="widthFix" :src="item.pic"></image>
        </view>
        <view class="top-tit">{{item.prodName}}</view>
      </view>
      <!-- 评价星级 -->
      <view class="item-star">
        <view>{{i18n.score}}</view>
        <comm-star :value="item.score?item.score:5" type="write" :index="index" @onStarChange="onStarChange"></comm-star>
      </view>
      <!-- 内容填写 -->
      <view class="item-con">
        <textarea :placeholder="i18n.shareTips" maxlength="500" :value="content" @input="onContentInput" :data-index="index">{{ content }}</textarea>
      </view>
      <!-- 添加图片 -->
      <view class="item-pics">
        <!-- 预览缩略图 -->
        <view class="question-images">
          <block v-for="(imgItem, idx) in item.images" :key="idx">
            <view class="q-image-wrap">
              <!-- 图片缩略图  -->
              <image class="q-image" :src="imgItem.url" mode="aspectFill" :data-idx="idx" :data-index="index" @tap="comPicPreView"></image>
              <!-- 移除图片的按钮  -->
              <view class="q-image-remover" :data-idx="idx" :data-index="index" @tap="removeImage">{{i18n.delete}}</view>
            </view>
          </block>
					<!-- 添加 -->
					<view class="add-pic" :data-idx="index" @tap="getUploadImg" v-if="item.images.length < 9">+</view>
        </view>
      </view>
			<!-- 提示 -->
			<view class="img-tip">({{i18n.maxUpPic}})</view>
			<!--/提示-->
      <!-- 匿名评价 -->
      <view class="item-btm">
        <checkbox color="red" :data-index="index" @tap="onSelectedItem" :checked="item.isAnonymous == 1">{{i18n.anonymousEvaluation}}</checkbox>
      </view>
    </view>
  </view>

  <view class="comm-btn" @tap="submitComm">{{i18n.postReview}}</view>

</view>
</template>

<script>
var http = require("../../utils/http.js");
import commStar from "../../components/commStar/commStar";

export default {
  data() {
    return {
      orderItemInfo: [], //订单列表页参数
      submitCommCount: 0, //已经提交的评论数量
			content:'', //评论内容

    };
  },

  components: {
    commStar
  },
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
    // 获取上页（订单列表）数据
    var orderItemInfo = wx.getStorageSync("orderItemInfo"); // console.log(orderItemInfo);
	orderItemInfo = JSON.parse(orderItemInfo)

    for (var i = 0; i < orderItemInfo.length; i++) {
      orderItemInfo[i].images = [];
      orderItemInfo[i].content = "";
      orderItemInfo[i].score = 5;
      orderItemInfo[i].isAnonymous = 1;
      orderItemInfo[i].evaluate = 0;
    }

    this.setData({
      orderItemInfo: orderItemInfo
    });
    console.log(orderItemInfo);
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
	      title:this.i18n.productEvaluation
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
     * 发表评论
     */
    submitComm: function (e) {
      var orderItemInfo = this.orderItemInfo;
      var allFill = true;

      for (var i = 0; i < orderItemInfo.length; i++) {
        var cont = orderItemInfo[i].content.trim();

        if (cont == "") {
          wx.showToast({
            title: this.i18n.evaluationEmpty,
            icon: "none"
          });
          allFill = false;
          break;
        }
      }

      if (allFill) {
        for (var i = 0; i < orderItemInfo.length; i++) {
          wx.showLoading();
          var pics = '';
          orderItemInfo[i].images.forEach(function (item) {
            pics += item.path + ',';
          });

          if (pics != '') {
            pics = pics.substring(0, pics.length - 1);
          } // 发布评论


          var params = {
            url: "/api/v1/prodComm",
            method: "POST",
            data: {
              content: orderItemInfo[i].content,
              score: orderItemInfo[i].score,
              evaluate: orderItemInfo[i].evaluate,
              isAnonymous: orderItemInfo[i].isAnonymous,
              orderItemId: orderItemInfo[i].orderItemId,
              prodId: orderItemInfo[i].prodId,
              pics: pics
            },
            callBack: res => {
              this.setData({
                submitCommCount: this.submitCommCount + 1
              });

              if (this.submitCommCount == orderItemInfo.length) {
                uni.showModal({
                  title: '',
                  content: this.i18n.evaluationSuccessful,
                  showCancel: false,
                  cancelText: this.i18n.cancel,
                  confirmText: this.i18n.confirm,
                  success:(res) => {
                    // uni.navigateBack();
                    wx.redirectTo({
                      url: '/pages/orderList/orderList?sts=5',
                      success: function (e) {
                        var page = getCurrentPages().pop();  //跳转页面成功之后
                        if (!page) return;
                        console.log(page)
                        page.onLoad(); //如果页面存在，则重新刷新页面
                      }
                    })
                  }

                });
              }

              uni.hideLoading();
            }
          };
          http.request(params);
        }
      }
    },

    /**
     * 上传图片
     */
    getUploadImg: function (e) {
      const idx = e.target.dataset.idx;
      var ths = this;
      wx.chooseImage({
        count: 1,
        // 默认9
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          var tempFilePaths = res.tempFilePaths;
          wx.showLoading({
            mask: true
          });
          var params = {
            url: "/api/v1/file/upload",
            filePath: tempFilePaths[0],
            name: 'file',
            callBack: function (res2) {
              wx.hideLoading();
              var img = {};
              img.path = JSON.parse(res2).filePath;
              img.url = JSON.parse(res2).resourcesUrl + JSON.parse(res2).filePath;
              var orderItemInfo = ths.orderItemInfo;
              orderItemInfo[idx].images.push(img);
              ths.setData({
                orderItemInfo: orderItemInfo
              });
            }
          };
          http.upload(params);
        }
      });
    },

		/**
		 * 评价图片预览
		 */
		comPicPreView(e){
			var index = e.currentTarget.dataset.index
			var idx = e.currentTarget.dataset.idx
			var urls = []
			this.orderItemInfo[index].images.forEach(el => {
				urls.push(el.url)
			})
			uni.previewImage({
				current: urls[idx],
				urls: urls
			})
		},

    /**
     * 删除图片
     */
    removeImage(e) {
      const idx = e.target.dataset.idx;
      const index = e.target.dataset.index;
      var orderItemInfo = this.orderItemInfo;
      orderItemInfo[index].images.splice(idx, 1);
      this.setData({
        orderItemInfo: orderItemInfo
      });
    },

    onContentInput: function (e) {
      const index = e.target.dataset.index;
      var orderItemInfo = this.orderItemInfo;
      orderItemInfo[index].content = e.detail.value;
      this.setData({
        orderItemInfo: orderItemInfo
      });
    },

    /**
    * 匿名评价
    * 每一项的选择事件
    */
    onSelectedItem: function (e) {
      var index = e.target.dataset.index; // 获取data- 传进来的index

      var orderItemInfo = this.orderItemInfo; // 获取评论项

      var isAnonymous = orderItemInfo[index].isAnonymous; // 获取当前评价的选中状态

      if (isAnonymous == 1) {
        isAnonymous = 0;
      } else {
        isAnonymous = 1;
      }

      orderItemInfo[index].isAnonymous = isAnonymous; // 改变状态

      this.setData({
        orderItemInfo: orderItemInfo
      });
    },
    onStarChange: function (e) {
      var index = e.idx;
      var val = e.val;
      var evaluate = 0;
      var orderItemInfo = this.orderItemInfo;

      if (val < 3) {
        evaluate = 2;
      } else if (val == 3) {
        evaluate = 1;
      }

      orderItemInfo[index].score = val;
      orderItemInfo[index].evaluate = evaluate;
      this.setData({
        orderItemInfo: orderItemInfo
      });
    }
  }
};
</script>
<style>
@import "./prodComm.css";
</style>
