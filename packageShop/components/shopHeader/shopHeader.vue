<template>
  <view>
    <!-- 店铺信息 -->
    <view class="shop">
      <view class="shopInfo" :data-shopid="shopId">
        <view class="sl">
          <view class="shopLogo">
            <image style="width: 100rpx; height: 100rpx;" :src="shopInfo.shopLogo" alt="shopLogo"></image>
          </view>
          <view class="shopTitle">
            <view class="shopname">{{shopInfo.shopName}}</view>
            <view class="shopIntro">
              <!-- <view class="self-operate" v-if="shopId==1">{{i18n.selfShop}}</view> -->
			  <view class="urate">
			  	<u-rate size="22" gutter="5" :count="count" v-model="value"></u-rate>
			  </view>
              <view class="fol" style="margin-left: 10rpx;" v-if="shopInfo.shopStatus == 1">1萬人已Followed</view>
            </view>  
          </view>
        </view>
        <view :class="['follow-btn',isFollowed?'followed':'']" @tap="collectShop">
          <view class="fol">
            <image class="col-icon" :src="isFollowed?'/packageShop/static/images/icon/collected.png':'/packageShop/static/images/icon/not-collected.png'"></image>
            <view>Follow</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
var http = require("../../../utils/http.js");
var util = require("../../../utils/util.js");
var big = require("../../../utils/big.min.js");
export default {
  data() {
    return {
      isFollowed: false,
      shopInfo: {}, // 店铺信息
      fansCountStr: '',
	  count: 5,
	  value: 2
    }
  },
  props: {
    shopId: Number / String,
  },
  computed: {
    i18n() {
      return this.$t('index')
    }
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  mounted: function () {
    this.getShopInfo() // 获取店铺信息
    this.queryShopCollection() // 查询店铺是否已收藏
  },

  methods: {
    // 获取店铺信息
    getShopInfo() {
      var params = {
        url: "/shop/headInfo",
        method: "GET",
        data: {
          shopId: this.shopId
        },
        callBack: (res) => {
          this.setData({
            shopInfo: res
          });
          wx.setStorageSync("shopInfo", res);
        }
      };
      http.request(params);
    },

    // 查询店铺是否已收藏
    queryShopCollection() {
      var shopId = this.shopId; //加载轮播图
      var params = {
        url: `/api/v1/shop/collection/isCollection`,
        method: "GET",
        data: {
          shopId: shopId
        },
				dontTrunLogin: true,
        callBack: res => {
          uni.hideLoading()
          if (res == true) {
            this.isFollowed = true
          } else {
            this.isFollowed = false
          }
        }
      };
      http.request(params);
    },

    // 添加/取消店铺
    collectShop() {
      var shopId = this.shopId; //加载轮播图
      util.checkAuthInfo(() => {
        var params = {
          url: `/api/v1/shop/collection/addOrCancel`,
          method: "POST",
          data: shopId,
          callBack: res => {
            uni.hideLoading()
            if (res == true) {
              this.isFollowed = true
            } else {
              this.isFollowed = false
            }
            console.log('添加/取消收藏操作后isFollowed：', this.isFollowed)
            this.getShopInfo()
            // this.$emit('queryShoInfo')
          }
        };
        http.request(params);
      })
    },
  }
}
</script>

<style scoped>
@import "./shopHeader.css";
</style>