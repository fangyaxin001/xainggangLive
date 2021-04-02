<template>
<!-- 积分商品列表组件 -->
<!--components/IntegralGoodsList/IntegralGoodsList.wxml-->
<!-- <view class="con-box"> -->
  <view class="integral-item" @tap="toScoreProdDet" :data-scoreprodid="prod.prodId">
    <view class="img">
      <!-- <image :src="prod.pic"></image> -->
    </view>
    <!-- <view class="name">{{prod.prodName}}</view> -->
    <view class="name">22</view>
    <view class="price">
      <image src="../../../static/images/proneler/jifen-img.png" class="icon"></image>
      <text class="red-word">1積分+HK$<text style="font-size: 30rpx;"> 1999.00</text></text>
    </view>
    <view class="old-price">{{i18n.marketValue}}￥{{prod.oriPrice}}</view>
  </view>
<!-- </view> -->
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
	  /**
	   * 跳转积分商品详情
	   */
	  toScoreProdDet:function(e) {
	    // const prodId = e.currentTarget.dataset.scoreprodid;
	    const prodId = 10;
	    uni.navigateTo({
	      url: '/packageMemberIntegral/pages/convertProdDet/convertProdDet?prodId=' + prodId
	    });
	  },
  }
};
</script>
<style>
@import "./IntegralGoodsList.css";

</style>