<template>
<!-- 退款详情 -->
<!--pages/DetailsOfRefund/DetailsOfRefund.wxml--> 
<view class="page">
	<!-- 申请状态 -->
	<view class="">
		
	</view>
  <!-- 头部状态 -->
  <view class="describe-box">
    <!-- 申请行进流程 -->
    <view class="process">
		<!-- 退货详情待审核，待寄回，待退款，已完成  -->
		<view class="top-box" v-if="false">
			<view class="top-box-title">
				<view class="">提交申請</view>
				<view class="">商家審核</view>
				<view class="">寄回商品</view>
				<view class="">退款完成</view>
			</view>
				<view class="top-box-xian">
					<view class="x1"> <u-icon name="checkbox-mark" color="#FA2033" size="28"></u-icon></view>
					<view class="x2"> </view>
					<view class="x3"> <u-icon v-show="false" name="checkbox-mark" color="#FA2033" size="28"></u-icon></view>
					<view class="x2"> </view>
					<view class="x3"><u-icon v-show="false" name="checkbox-mark" color="#FA2033" size="28"></u-icon> </view>
					<view class="x2"> </view>
					<view class="x3"><u-icon v-show="false" name="checkbox-mark" color="#FA2033" size="28"></u-icon> </view>
				</view>
		</view>
		<!-- 退货详情 已关闭 -->
		<view class="top-box" v-if="false">
			<view class="closed">
				<view class="shou-closed">售后关闭</view>
				<view class="closed-time">撤銷時間  2020-09-28  21:12:12</view>
			</view>
		</view>
		<!-- 售后关闭之后的展示 -->
		<view class="top-box" >
			<view class="top-box-title">
				<view class="">提交申請</view>
				<view class="">商家審核</view> 
				<view class="">退款完成</view>
			</view>
				<view class="top-box-xian">
					<view class="x1"> <u-icon name="checkbox-mark" color="#FA2033" size="28"></u-icon></view>
					<view class="x2" style="width: 230rpx;"> </view>
					<view class="x1"><u-icon v-show="false" name="checkbox-mark" color="#FA2033" size="28"></u-icon> </view>
					<view class="x2" style="width: 250rpx;"> </view>
					<view class="x3"> <u-icon v-show="false" name="checkbox-mark" color="#FA2033" size="28"></u-icon></view>
					
				</view>
		</view>
      <!-- 提交申请 -->
      <view class="merchant"  v-if="returnMoneySts == 1">
      	<view class="current-process" v-if="returnMoneySts == 1">{{i18n.refundDetails11}}</view>
      	<view class="acount-for-process" v-if="returnMoneySts == 1">{{i18n.refundDetails12}}</view>
      	<!-- <view class="acount-for-process taonce" v-if="returnMoneySts == 1">{{updateTime}}asdad </view> -->
      </view>
	 
      <!-- 商家拒绝 -->
     <view class="merchant"  v-if="returnMoneySts == 7">
     	<view class="current-process" v-if="returnMoneySts == 7">{{i18n.refundDetails71}}</view>
     	<view class="acount-for-process" v-if="returnMoneySts == 7">{{i18n.refundDetails72}}</view>
     	<!-- <view class="acount-for-process taonce" v-if="returnMoneySts == 7">{{updateTime}}</view> -->
     </view>
      <!-- 商家同意退款 -->
    <view class="merchant"  v-if="returnMoneySts == 2">
    	<view class="current-process" v-if="returnMoneySts == 2">{{i18n.refundDetails2}}</view>
    	<view class="acount-for-process" v-if="returnMoneySts == 2 && applyType == 1">{{i18n.refundDetails21}}</view>
    	<view class="acount-for-process" v-if="returnMoneySts == 2 && applyType == 2">{{i18n.refundDetails22}}</view>
    	<!-- <view class="acount-for-process taonce" v-if="returnMoneySts == 2">{{updateTime}}</view> -->
    </view>
      <!-- 寄出商品（退货退款情况下） -->
    <view class="merchant"  v-if="returnMoneySts == 3">
    	<view class="current-process" v-if="returnMoneySts == 3">{{i18n.refundDetails31}}</view>
    	<view class="acount-for-process" v-if="returnMoneySts == 3">{{i18n.refundDetails32}}</view>
    	<!-- <view class="acount-for-process taonce" v-if="returnMoneySts == 3">{{updateTime}}</view> -->
    </view>
      <!-- 商家确认收货 -->
     <view class="merchant" v-if="returnMoneySts == 4">
     	<view class="current-process" >{{i18n.refundDetails41}}</view>
     	<view class="acount-for-process" v-if="returnMoneySts == 4">{{i18n.refundDetails42}}</view>
     	<!-- <view class="acount-for-process " v-if="returnMoneySts == 4">{{updateTime}}</view> -->
     </view>
	
      <!-- 退款成功 -->
     <view class="merchant" v-if="returnMoneySts == 5">
     	<view class="current-process" >{{i18n.refundDetails51}}</view>
     	<view class="acount-for-process">{{refundTime}}</view>
     
     </view>
	
      <!-- 退款申请关闭 -->
     
        <!-- 由于你超时未处理，系统已关闭本次退款申请 -->
     <view class="merchant" v-if="returnMoneySts == -1">
     	<view class="current-process" >{{i18n.refundDetails_1}}</view>
     	<view class="acount-for-process" >{{rejectMessage?rejectMessage:''}}</view>
      <!-- <view class="acount-for-process" v-if="returnMoneySts == -1">{{updateTime}}</view> -->
     </view>
      <!-- 买家撤回申请 -->
	  <view class="merchant"  v-if="returnMoneySts == 6">
	  	<view class="current-process">{{i18n.refundDetails61}}</view>
	  	<view class="acount-for-process" >{{i18n.refundDetails62}}</view>
	  	<!-- <view class="acount-for-process" v-if="returnMoneySts == 6">{{updateTime}}</view> -->
	  </view>  
                
      <!-- 隐藏内容（仅退款） -->
      <view class="more-content" v-show="false">
        <view class="cont">{{i18n.refundDetails13}}</view>
        <view class="cont">{{i18n.refundDetails01}}</view>
        <!-- <view class="cont">如果商家逾期未处理，退款申请将自动达成并退款给你</view> -->
      </view>
      <!-- 隐藏内容（退货退款申请商品未寄出） -->
      <view :class="showView?'display':'more-content'" v-if="returnMoneySts == 2">
        <view class="cont">{{i18n.refundDetails23}}</view>
        <view class="cont">{{i18n.refundDetails01}}</view>
        <!-- <view class="cont">如果商家逾期未处理，请按照系统给出的退货地址退货</view> -->
      </view>
      <!-- 隐藏内容（退货退款并已寄出货物） -->
      <view :class="showView?'display':'more-content'" v-if="returnMoneySts == 3">
        <view class="cont">{{i18n.refundDetails33}}</view>
        <view class="cont">{{i18n.refundDetails02}}</view>
        <!-- <view class="cont">如果商家逾期未处理，系统将自动确认收货并退款给你</view> -->
      </view>

    </view>
    <!-- 申请行进流程end -->

       <!-- 更多说明 -->
       <view :class="showView?'more-instructions':'display'" @tap="onChangeShowState" v-if="returnMoneySts < 4 && returnMoneySts !== -1 && applyType == 2">
         <text class="more-txt">{{i18n.moreExplanation}}</text>
         <view class="down-arrow-icon">
           <image src="/static/images/icon/down-arrow.png"></image>
         </view>
       </view>
       <!-- 收起 -->
       <view :class="showView?'display':'more-instructions'" @tap="onChangeShowState" v-if="returnMoneySts < 4 && returnMoneySts !== -1 && applyType == 2">
         <text class="more-txt">{{i18n.putAway}}</text>
         <view class="down-arrow-icon">
           <image src="/static/images/icon/up-arrow.png"></image>
         </view>
       </view>

  </view>
  <!-- 头部状态end -->

  <!-- 【退款申请被拒绝时显示】拒绝理由 -->
  <view class="refuse-reason" v-if="returnMoneySts == 7">{{i18n.refundDetails73}}：{{rejectMessage}}</view>
	<view class="refuse-reason" v-if="sellerMsg">{{i18n.sellerRemarks}}：{{ sellerMsg }}</view>

  <!-- 【退货退款状态下，买家同意后】退货地址 -->
  <view class="return-address" v-if="returnMoneySts == 2 && applyType == 2">
    <view class="addr-tit">{{i18n.returnAddress}}</view>
    <view class="address">
      <view class="recipient">
        <text class="addr-cont">{{i18n.recipient}}：{{refundDelivery.receiverName}}</text>
        <text class="mobile">{{refundDelivery.receiverMobile}}</text>
      </view>
      <view class="addr">{{i18n.detailedAddress}}：{{refundDelivery.receiverAddr}}</view>
    </view>
  </view>
<!-- 寄回地址  订单为寄回状态时出现   暂时先隐藏  退款详情为售后关闭 寄回地址模块隐藏--> 
<view class="mail-address" v-show="false">
	 <view class="refund-txt"> <text class="color-shi"></text><view>寄回地址</view></view>
	 <view class="refund-cont"><text class="one-text">服務類型</text><text>退款</text></view>
	 <view class="refund-cont"><text class="one-text">退款原因</text><text>不想要了</text></view>
	 <view class="refund-cont" style="display: flex;"><view class="one-text">退款原因</view><view style="line-height: 35rpx;width: 500rpx;">河南省郑州市二七区大学路222号大学路号大学路222号大学路222号 <text class="fuzhi">复制</text></view></view>
</view>
  <!-- 退款信息 -->
  <view class="refund-message">
    <view class="refund-txt"><text class="color-shi"></text><view>退款信息</view></view>
    <view class="goods-msg-box">
      <!-- 图片 -->
      <view class="img-box" >
        <image src="../../packageMemberIntegral/static/images/icon/zhuanpan@2x.png"></image>
      </view>
      <!-- 信息 -->
      <view class="goods-text" >
        <view class="goods-title">名字</view>
        <view class="goods-quantity">{{i18n.quantity}}规格{{i18n.piece}}</view>
		<view class="" style="display: flex; justify-content: space-between;margin-top: 30rpx;">
			<view style="color: #FA2033;">
				<text style="font-size: 20rpx; ">HK$</text><text>1999.00</text>
			</view>
			<view style="font-size: 24rpx; color: #999999;">x1</view>
		</view>
      </view>

      <block v-if="orderItems.length>1">
        <view class="refund-goods-item" v-for="(item, index) in orderItems" :key="index">
          <!-- 图片 -->
          <view class="img-box">
            <image :src="item.pic"></image>
          </view>
          <!-- 信息 -->
          <view class="goods-text">
            <view class="goods-title">{{item.prodName}}</view>
            <view class="goods-quantity">{{i18n.quantity}}：{{item.prodCount}}{{i18n.piece}}</view>
          </view>
        </view>
      </block>
    </view>
    <!-- 具体信息 -->
    <view class="refund-cont"><text class="one-text">服務類型</text><text>退款</text></view>
    <view class="refund-cont"><text class="one-text">退款原因</text><text>不想要了</text></view>
    <view class="refund-cont"><text class="one-text">申請時間</text><text>2020-09-28  21:12:12 </text></view>
    <view class="refund-cont"><text class="one-text">退款編號</text><text>2020121609463456</text><text class="fuzhi">复制</text></view>
    <view class="refund-cont" style="display: flex;">
		<text class="one-text">退款憑證照片</text>
		<view class="">
		<image style="width: 160rpx; height: 160rpx;" src="../../packageActivities/static/images/icon/coupon-received.png" mode=""></image>	
		</view>
	</view>
    <!-- <view class="refund-cont" v-if="buyerReason!=7">{{i18n.refundReason}}：{{refundProdReasonArray[buyerReason]}}</view>
    <view class="refund-cont">{{i18n.refundInstructions}}：{{buyerDesc}}</view>
    <view class="refund-cont">{{i18n.refundAmount}}：
      <text class="red" v-if="refundAmount > 0">￥{{refundAmount.toFixed(2)}}</text>
      <text class="red" v-if="refundAmount > 0 && refundScore > 0">+</text>
      <text class="red" v-if="refundScore > 0">{{refundScore}}{{i18n.integral}}</text>
    </view>
    <view class="refund-cont">{{i18n.refundNumber}}：{{refundSn}}</view>
    <view class="refund-cont">{{i18n.applicationTime}}：{{applyTime}}</view> -->
    <!-- 【退货申请显示】 -->
    <!-- <view class="refund-cont" v-if="goodsNum>0">{{i18n.quantityReturned}}：{{goodsNum}}</view> -->
    <!-- 联系商家 -->
    <!-- <view class="contact-merchant">联系商家</view> -->
    <!-- <button class="contact-merchant" open-type="contact">联系客服</button> -->
  </view>


  <!-- 脚部撤销申请 -->
  <!-- applyType: 1,  //申请类型:1,仅退款,2退款退货 -->
  <!-- returnMoneySts： 处理退款状态:(1.买家申请 2.卖家接受 3.买家发货 4.卖家收货 5.退款成功 6.买家撤回申请 7.商家拒绝 -1.退款关闭) -->
  <view class="foot-box">
    <view class="footer">
      <!-- 【申请后-申请完成前】 -->
	  <view  style="display: flex;" >
	  	<view ><image style="width: 32rpx; height: 32rpx;" src="../../static/images/proneler/phoneImg-order.png" mode=""></image> </view>
	  	<view  style="margin-left: 10rpx; font-size: 24rpx;">聯繫平台</view>
	  </view> 
	<view class="">
		<!-- 根据状态打开下列按钮 -->
		<view class="withdraw-the-claim" v-show="false">撤销申请</view> 
		<view class="amend-application" v-show="false">修改申请</view> 
		<view class="amend-application" v-show="false" @click="SendInformation">寄回信息</view> 
		<view class="amend-application" @click="SendInformation">查看物流</view> 
	</view> 
      <!-- 【商家拒绝时显示】 -->
      <!-- <text class="undo-apply apply-current" bindtap="toAlterRefundApply" wx:if="{{returnMoneySts ==1 || returnMoneySts == 7}}" data-refundsn="{{refundSn}}">修改申请</text> -->
      <!-- 【商家同意后-货物寄出前】 -->
     
    </view>
  </view>

</view>
</template>

<script>
// pages/DetailsOfRefund/DetailsOfRefund.js
var http = require("../../utils/http.js");

export default {
  data() {
    return {
      showView: true,
      //隐藏是展示
      applyTime: '',
      //申请时间
      applyType: 1,
      //申请类型:1,仅退款,2退款退货
      goodsNum: '',
      //退货数量
      handelTime: '',
      //卖家处理时间
      orderAmount: '',
      //订单总金额
      orderItems: {},
      //订单项
      refundAmount: '',
      //退款金额
      refundDelivery: [],
      //收货地址对象
      refundId: '',
      //记录ID
      refundTime: '',
      //退款时间
      returnMoneySts: 0,
      //处理退款状态:(1.买家申请 2.卖家接受 3.买家发货 4.卖家收货 5.退款成功 6.买家撤回申请 7.商家拒绝 -1.退款关闭)
      updateTime: '',
      //更新时间
      refundSn: '',
      //退款编号
      rejectMessage: '',
      //拒绝理由
      buyerReason: '',
      //退款原因
      buyerDesc: '', // 退款说明
      shopName: '', //店铺名称
      refundScore: '', // 积分
			refundProdReasonArray: [], // 退款原因
			sellerMsg: '',// 卖家备注
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
    // [拍错/多拍/不喜欢','协商一致退款','商品破损/少件','商品与描述不符','卖家发错货','质量问题','其他']
		this.refundProdReasonArray.push(this.i18n.wrongShot, this.i18n.refundConsensus, this.i18n.damagedGoods,
    this.i18n.productNot, this.i18n.sellerSendsWrong, this.i18n.qualityProblem, this.i18n.other)
    this.setData({
      refundSn: options.refundSn
    }); //获取退款申请详情

    this.getRefundDetail();
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
  	      title:this.i18n.refundDetails
  	  });},

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
	  // 跳转至填写寄回信息
	  SendInformation(){
		uni.navigateTo({
			url:"/pages/DetailsOfRefund/send-infor/send-infor"
		})  
	  },
    /**
     * 更多说明&收起
     */
    onChangeShowState: function () {
      var that = this;
      that.setData({
        showView: !that.showView
      });
    },

    /**
     * 获取退款申请详情
     */
    getRefundDetail: function (e) {
      var ths = this; // wx.showLoading({})

      var params = {
        url: "/api/v1/orderRefund/info",
        method: "GET",
        data: {
          refundSn: this.refundSn //退款编号
        },
        callBack: function (res) {
          ths.setData({
            applyTime: res.applyTime,
            //申请时间
            applyType: res.applyType,
            //申请类型:1,仅退款,2退款退货
            goodsNum: res.goodsNum,
            //退货数量
            handelTime: res.handelTime,
            //卖家处理时间
            orderAmount: res.orderAmount,
            //订单总金额
            orderItems: res.orderItems,
            //订单项
            refundSn: res.refundSn,
            //退款编号
            refundAmount: res.refundAmount,
            //退款金额
            refundDelivery: res.refundDelivery,
            //收货地址对象
            refundId: res.refundId,
            //记录ID
            refundTime: res.refundTime,
            //退款时间
            returnMoneySts: res.returnMoneySts,
            //处理退款状态:(1.买家申请 2.卖家接受 3.买家发货 4.卖家收货 5.退款成功 6.买家撤回申请 7.商家拒绝 -1.退款关闭)
            updateTime: res.updateTime,
            //更新时间
            rejectMessage: res.rejectMessage,
            //拒绝理由
            buyerReason: res.buyerReason,
            //退款原因
            buyerDesc: res.buyerDesc, // 退款说明
            shopName: res.shopName,
            //积分数量
            refundScore: res.refundScore,
						sellerMsg: res.sellerMsg, // 卖家备注
          });
          uni.hideLoading();
        }
      };
      http.request(params);
    },

    /**
     * 撤销退货退款申请
     */
    cancelApplication: function (e) {
      uni.showModal({
        title: this.i18n.revoke,
        content: this.i18n.revokeTips,
		cancelText: this.i18n.cancel,
		confirmText: this.i18n.confirm,
        success: res => {
          if (res.confirm) {
            uni.showLoading({});
            var params = {
              url: "/api/v1/orderRefund/cancel",
              method: "PUT",
              data: this.refundSn,
              //退款订单编号
              callBack: function (res) {
                uni.hideLoading()
                uni.redirectTo({
                  url: '/pages/afterSales/afterSales'
                });
              }
            };
            http.request(params);
          } else {
          }
        }
      });
    },

    /**
     * 跳转修改退款申请
     */
    // toAlterRefundApply: function (e) {
    //   var refundSn = e.currentTarget.dataset.refundsn;
    //   console.log(e.currentTarget.dataset.refundsn)
    //   uni.navigateTo({
    //     url: '/pages/applyRefund/applyRefund?refundSn=' + refundSn,
    //   })
    // },

    /**
     * 填写物流信息
     */
    toLogisticsPage: function (e) {
      var refundSn = e.currentTarget.dataset.refundsn;
      console.log(e.currentTarget.dataset.refundsn);
      uni.navigateTo({
        url: '/pages/writeReturnLogistics/writeReturnLogistics?refundSn=' + refundSn
      });
    }
  }
};
</script>
<style>
@import "./DetailsOfRefund.css";
</style>
