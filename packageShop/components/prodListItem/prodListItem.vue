<template>
<!--components/prodListItem/prodListItem.wxml-->
<view class="prod-items" @tap="toProdPage" :data-prodid="prod.prodId">
  <view class="hot-imagecont">
    <image :src="prod.pic" class="hotsaleimg"></image>
  </view>
  <view class="hot-text">
    <view class="hotprod-text">{{prod.prodName}}</view>
    <view class="prod-text-info">
      <view class="price">
        <text class="symbol">HK$</text>
        <text class="big-num">{{prod.price}}</text>
      </view>
	  <view class="" style="font-size: 20rpx;">
	  	 已售9392件
	  </view>
     
    </view>
  </view>
</view>
</template>

<script>

export default {
  data() {
    return {};
  },

  components: {},
  props: {
    prod: Object
  },
  
  computed:{
  	i18n() {
  		return this.$t('index')
  	}
  },
  
  methods: {
    toProdPage: function (e) {
      var prodid = e.currentTarget.dataset.prodid;
      this.$Router.push({ path: '/pages/prod/prod', query: { prodid: prodid }})
    }
  }
};
</script>
<style>
@import "./prodListItem.css";
</style>