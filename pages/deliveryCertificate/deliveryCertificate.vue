<!-- 提货码详情 -->
<template>
  <view class="container">
    <view class="delivery-certificate">
      <view class="address-box item">
        <view class="name">{{stationCont.stationName}}<text class="self-icon">{{i18n.pickup}}</text></view>
        <view class="a-item">
          <view class="img"><image src="/static/images/icon/submit-address.png"></image></view>
          <view class="text">{{stationCont.stationAddress}}</view>
        </view>
        <view class="a-item">
          <view class="img"><image src="/static/images/icon/station-phone.png"></image></view>
          <view class="text">{{stationCont.stationPhone}}</view>
        </view>
        <view class="a-item">
          <view class="img"><image src="/static/images/icon/time.png"></image></view>
          <view class="text">{{stationCont.stationTime}}</view>
        </view>
      </view>
      <view class="code-det item">
        <view class="bar-code">
          <!-- <image src="/static/images/icon/status-bg.png"></image> -->
          <tki-barcode
                ref="barcode"
                onval
                :val="stationCode"
                :load-make="true"
                :opations="barOpations"/>
        </view>
        <view class="code-number">{{i18n.pickingCode}}：{{stationCode}}</view>
        <view class="code">
          <image :src="stationQrCode"></image>
          <!-- <canvas class="qrcode-img" canvas-id="orderQrcode"></canvas> -->
        </view>
      </view>
      <view class="btn-box">
        <view class="btn" @tap="backOrderDetail">{{i18n.returnOrderDetails}}</view>
      </view>
    </view>
  </view>
</template>

<style>
@import "deliveryCertificate.css";
</style>

<script>
import tkiBarcode from '@/components/tki-barcode/tki-barcode'
var Qr = require('../../utils/wxqrcode.js')
	export default {
    components: {
      tkiBarcode
    },
		data() {
			return {
        orderNumber: '', // 订单编号
        stationCode: '', //12345678
        stationQrCode: '', // 提货码二维码
        stationCont: {}, // 自提点信息
        barOpations: {
          height: 150,
          displayValue: false
        }
			};
    },
	
	computed:{
		i18n() {
			return this.$t('index')
		}
	},
	
	onShow: function () {
		  //头部导航标题
		  uni.setNavigationBarTitle({
		      title:this.i18n.deliveryVoucher
		  });
	},
	
    onLoad(option){
      this.stationCont = wx.getStorageSync('stationCont')
      this.stationCode = this.stationCont.stationCode
      this.orderNumber = this.stationCont.orderNumber
      this.getQrcode(this.stationCode)
    },
    methods: {
      /**
       * 生成二维码
       */
      getQrcode: function(stationCode) {
        this.stationQrCode = Qr.createQrCodeImg(stationCode)
      },

      // 返回详情
      backOrderDetail() {
        // uni.redirectTo({
        //   url: '/pages/order-detail/order-detail?orderNum=' + this.orderNumber
        // })
        //返回
        uni.navigateBack({
          delta: 1
        });
      },
    }
  };
</script>

<style scoped>
.barcode .image {
  margin: 0 auto;
}
</style>
