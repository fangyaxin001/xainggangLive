<template>
  <!-- 申请退款 -->
  <!--pages/applyRefund/applyRefund.wxml--> 
  <view class="page"> 
    <!-- 头部商品信息 -->
    <view class="top-box">
	 <view class="list-item">
	 	<view class="list-item-img">
	 		<image style="width: 200rpx; height: 200rpx;" src="../../static/images/proneler/shangpin-img.png" mode=""></image>
	 	</view>
	 	<view class="list-item-right">
	 		<view class="list-item-right-title">Innisfree/悦诗风吟红石榴水乳护肤套装女提亮修护</view>
	 		<view class="list-item-right-introduce">提亮，抗初老</view>
	 		<view class="list-item-flex">
	 			<view class="list-item-price"><text style="font-size: 24rpx;">HK$</text><text>1999.00</text></view>
	 			<view class="list-item-num">x1</view>
	 		</view>
	 	</view>
	 </view>
	 <view class="list-item">
	 	<view class="list-item-img">
	 		<image style="width: 200rpx; height: 200rpx;" src="../../static/images/proneler/shangpin-img.png" mode=""></image>
	 	</view>
	 	<view class="list-item-right">
	 		<view class="list-item-right-title">Innisfree/悦诗风吟红石榴水乳护肤套装女提亮修护</view>
	 		<view class="list-item-right-introduce">提亮，抗初老</view>
	 		<view class="list-item-flex">
	 			<view class="list-item-price"><text style="font-size: 24rpx;">HK$</text><text>1999.00</text></view>
	 			<view class="list-item-num">x1</view>
	 		</view>
	 	</view>
	 </view>
    </view>
  
    <!-- 货物状态【已发货状态下且用户选择仅退款】 -->
    <!-- 订单状态 1:待付款 2:待发货 3:待收货 4:待评价 5:成功 6:失败 -->
    <!-- :for-idx="idx" -->
  
    <!-- isReceiver: 0, //货物状态(1:已收到货 0:未收到货) -->
 
    <!-- 退款原因（未发货 && 未收到货）|| (已发货 && 未收货) -->
    
   <view class="select-show  ">
        <text class="select-text">退款原因 </text>
        <view style="display: flex;align-items: center;" @click="clearFlag=true">
        	<text class="select-results ">请选择退款原因</text>
        	<view class="right-arrow">
        	  <image src="/static/images/icon/more.png"></image>
        	</view>
        </view>
      </view>
   

    <!-- 退款金额 -->
    <view class="refund-sum-box">
      <view class="refund-sum">
        <label class="refund-sum-tit">退款金额：</label>
        <!-- 如果是(使用了平台分摊的优惠金额)或(有积分的情况)或整单退，则不允许修改退款金额（输入框不可输入） -->
        <text class="refund-sum-num"><text style="font-size: 20rpx;">HK$</text> 1999.00</text>
     
      </view>
     
    </view>

    <!-- 退货信息 -->
    <view class="refund-message">
    
      <!-- 说明 -->
      <view class="item-num">
        <view class="item-num-tit">退款说明</view>
       <view class="" style="margin-top: 20rpx; width: 100%;">
       <u-input style="background-color: #F8F8F8;padding: 0 10rpx;"
		 v-model="explain" type="textarea" maxlength="800"  height="250"
		  placeholder = "申請退款，請確認已經和商家聯繫。請在此描述申請售後服務的原因" />
       </view>
      </view>

      <!-- 上传照片 -->
    <view class="upload-img">
    	<view class="upload-img-box">
    		<view class="">
    			 <u-icon name="camera-fill" color="#D6D6D6" size="55"></u-icon>
    		</view>
    		<view class="addImg">添加照片</view>
    	</view>
    </view>
    </view>
    <!-- 退货信息end -->

    <!-- 提交btn -->
    <view class="submit-btn"@tap="applyRefund">提交</view>
	<!-- 退款原因 -->
<u-popup v-model="clearFlag" mode="bottom" border-radius="20">
					<view class="popup-box">
						<view class="popup-clear-order">取消订单</view>
						<view class="chear-cause">请选择取消订单原因</view>
						<view class="">
							<u-radio-group v-model="value" @change="radioGroupChange" style="width: 100%;padding: 0 30rpx;">
								<view class="logistics-company">
									<view class="">不想买了</view>
									<view class="">
										<u-radio @change="radioChange" active-color="#47D1D1" name="不想买了"></u-radio>
									</view>
								</view>
								<view class="logistics-company">
									<view class="">信息填写错误，重新拍</view>
									<view class="">
										<u-radio @change="radioChange" active-color="#47D1D1"></u-radio>
									</view>
								</view>
								<view class="logistics-company">
									<view class="">卖家缺货</view>
									<view class="">
										<u-radio @change="radioChange" active-color="#47D1D1"></u-radio>
									</view>
								</view>
							<view class="logistics-company">
								<view class="">其他原因</view>
								<view class="">
									<u-radio @change="radioChange" active-color="#47D1D1"></u-radio>
								</view>
							</view>
							</u-radio-group>
						</view>
						<view class="popup-bot-flex">
							<view style="background-color: #F6F6F6;" @click="clearFlag=false">取消</view>
							<view style="background-color: #47D1D1;color: #FFFFFF;">确定</view>
						</view>
					</view>
				</u-popup>
  </view>
</template>

<script module="wxs" lang="wxs" src="../../wxs/number.wxs"></script>

<script>
// pages/applyRefund/applyRefund.js
var http = require("../../utils/http.js");
var big = require("../../utils/big.min.js");

export default {
  data() {
    return {
		explain:'',
		clearFlag:false,//退款原因弹出层
      refundType: 2,  // 退款类型 1整单  2单个物品
      goodsStateArray: [], // 货物状态
      isReceiver: 0, //货物状态(1:已收到货 0:未收到货)
      refundProdReasonArray: [], // 退款原因（已收到货）
      refundPriReasonArray: [], // 退款原因（未收到货）
      buyerReason: 0, //退款原因
      refundItem: {}, //订单项数据
      orderItemId: '', //订单项ID（单个物品退款时使用）
      orderNumber: '',//订单编号
      applyType: 1, //退款方式(1:仅退款 2退款退货)
      goodsNum: 1, //退货数量（0或不传值则为全部数量）
      refundAmount: 0, //实际退款金额
      buyerMobile: '', //手机号码（默认当前订单手机号码）
      buyerDesc: '', //退款说明
      photoFiles: [], //凭证图片列表
      orderItemDtos: "",
      actualTotal: 0,  //总额
      isLastProd: false,  //是否最后一个订单项
      prodPrice: 0,  // 商品单价
      isOnlyProd: false, //是否仅一件商品
      orderScore: 0, // 积分
      tipShowStr: '', // 最多可退提示
      intShowStr: '', // 输入框金额展示
      totalPrice: 0, // 用于判断的总额
    };
  },

  components: {},
  props: {},
  computed: {
    i18n() {
      return this.$t('index')
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // data数据引入
    this.goodsStateArray.push(this.i18n.goodsNotReceived, this.i18n.goodsReceived) // ['未收到货','已收到货']
    // ['拍错/多拍/不喜欢','协商一致退款','商品破损/少件','商品与描述不符','卖家发错货','质量问题','其他']
    this.refundProdReasonArray.push(this.i18n.wrongShot, this.i18n.refundConsensus, this.i18n.damagedGoods, this.i18n.productNot, this.i18n.sellerSendsWrong, this.i18n.qualityProblem, this.i18n.other)
    // ['拍错/多拍/不喜欢','协商一致退款','其他'],
    this.refundPriReasonArray.push(this.i18n.wrongShot, this.i18n.refundConsensus, this.i18n.other)
    // 拿到上一页的参数type（判断退款方式）
    if (options.type) {
      this.setData({
        applyType: options.type  // 1仅退款 2退货退款
      })
    }
    if (this.applyType == 2) {
      this.isReceiver = 1 // 已收到货
    }
    this.setData({
      refundType: options.refundType  // 退款类型 1整单  2单个物品
    })

    this.getRefundProdInfo()  //获取退款商品信息
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
      title: "申請售後"
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
  methods: {
    /**
     * 货物状态picker选择
     * isReceiver: 货物状态(1:已收到货 0:未收到货)
     */
    goodsStateArrayFun: function (e) {
      this.isReceiver = e.detail.value
      this.buyerReason = 0
    },

    /**
     * 退款原因picker选择
     */
    refundReasonChange: function (e) {
      this.buyerReason = e.detail.value
    },

    /**
     * 获取退款商品信息
     */
    getRefundProdInfo: function () {
      let refundType = this.refundType  // 退款类型 1整单  2单个物品
      //拿到缓存里的订单项数据
      var refundItem = wx.getStorageSync("refundItem");
      this.setData({
        refundItem: refundItem,
        orderNumber: refundItem.orderNumber,
        goodsNum: refundItem.prodCount, //商品总数
        actualTotal: refundItem.actualTotal,  //总额
        isLastProd: refundItem.isLastProd,  //是否最后一样商品
        isOnlyProd: refundItem.isOnlyProd, //只有一件商品可以退运费
        orderScore: refundItem.useScore // 单个退积分
      })
      if (refundType == 1) {  //整单退款
        this.setData({
          orderItemDtos: refundItem.orderItemDtos, //商品列表
          orderScore: refundItem.orderScore,  //整单积分
        });
      }
      let actualTotal = this.actualTotal  //总额
      let prodCount = refundItem.prodCount  //商品总数
      // if (refundType == 2) {  //单个退
      //   //计算商品单价
      //   if(prodCount > 0) {
      //     var x = new big(actualTotal)
      //     var y = new big(prodCount)
      //     // 保留两位小数
      //     big.DP = 2
      //     // 向下取整
      //     big.RM = 1
      //     let prodPrice = x.div(y).valueOf()  //商品单价
      //     this.setData({
      //       prodPrice
      //     })
      //   }
      // }

      this.getRefundAmount() //退款金额计算
    },

    /**
     * 退款金额计算
     */
    getRefundAmount: function () {
      big.DP = 2
      big.RM = 0
      let actualTotal = new big(this.actualTotal) // 商品总额（不含运费）
      let refundItem = this.refundItem // 订单项item
      let refundType = this.refundType  // 退款类型 1整单  2单个物品
      let transfee = new big(refundItem.transfee) // 运费
      if (refundItem.status == 2) { //待发货状态
        if (refundType == 2) {  //单个退,
          if (refundItem.isLastProd || this.isOnlyProd) {  //如果是“最后一个”或“只有一个商品”，可退运费（actualTotal不包含运费）
            this.setData({
              refundAmount: actualTotal.plus(transfee).valueOf(), // refundAmount
              totalPrice: actualTotal.plus(transfee).valueOf(), // totalPrice
            });
          } else { //否则不退
            this.setData({
              refundAmount: this.actualTotal,
              totalPrice: this.actualTotal,
            });
          }
        } else if (refundType == 1) {  //整单退，退实际总（actualTotal总额包含运费）
          this.setData({
            refundAmount: this.actualTotal,
            totalPrice: this.actualTotal,
          });
        }
      } else if (refundItem.status != 2) { // 已发货订单（都不退运费）
        if (refundType == 1) { // 整单（总额含运费）
          this.setData({
            refundAmount: actualTotal.minus(transfee).valueOf(),
            totalPrice: actualTotal.minus(transfee).valueOf(),
          });
        } else { // 单个（金额不含运费）
          this.setData({
            refundAmount: this.actualTotal,
            totalPrice: this.actualTotal,
          });
        }
      }
      this.showNumber() // 退款金额展示
    },

    /**
     * 改变商品数量重新计算价格（数量加减）
     */
    changePordNum(changeNum) {
      let actualTotal = this.actualTotal  //商品总额（不含运费）
      var prodCount = this.refundItem.prodCount  //商品总数
      var goodsNum = this.goodsNum + changeNum //展示的商品总数
      if (goodsNum < 1) {
        wx.showToast({
          title: this.i18n.returnQuantityTips1,
          icon: 'none',
        })
        return
      }
      if (goodsNum > prodCount) {
        wx.showToast({
          title: this.i18n.returnQuantityTips2,
          icon: 'none',
        })
        return
      }
      big.DP = 2
      big.RM = 0
      this.goodsNum = goodsNum
      this.refundAmount = new big(actualTotal).times(goodsNum).div(prodCount).valueOf()
      this.showNumber() // 退款金额展示
    },

    /**
     * 金额展示
     */
    showNumber: function () {
      big.DP = 2
      big.RM = 0
      var refundItem = this.refundItem // 订单(项)item
      var refundAmount = new big(this.refundAmount).valueOf() // 实际退款金额
      var refundType = this.refundType // 退款单类型（1:整单退款,2:单个退款）
      var actualTotal = new big(this.actualTotal).valueOf() // 总额
      var orderScore = this.orderScore // 积分
      var isLastProd = this.isLastProd // 是否最后一个订单项item
      var transfee = new big(refundItem.transfee).valueOf() // 运费
      var tipShow = [] // 最多可退提示——格式：单件退（金额+运费+积分） 整单退（金额(含运费) + 积分）
      var intShow = [] // 输入框——格式： 金额（含运费）+ 积分

      // 金额
      if (actualTotal && actualTotal > 0) {
        var refAmo = this.i18n.currencySymbol + refundAmount
        tipShow.push(refAmo)
        intShow.push(refAmo)
      }

      // 运费
      if (refundItem.status == 2 && //待发货
        transfee && transfee > 0 && // 有运费
        ((refundType == 2 && // 单个退
          (isLastProd || this.isOnlyProd)) || // 最后一件或仅有一件商品
          refundType == 1) // 或整单退
      ) {
        tipShow = []
        var refAmo = this.i18n.currencySymbol + refundAmount
        var transfees = this.i18n.shipping + this.i18n.currencySymbol + transfee
        if (refundType == 1) { // 整单
          var transfee2 = refAmo + '（' + this.i18n.includingFreight + transfee + '）'
          tipShow.push(transfee2)
        } else if (refundType == 2) { // 单个
          if (actualTotal && actualTotal > 0) { // 商品实付金额（除运费外）大于0
            var act = this.i18n.currencySymbol + actualTotal
            tipShow.push(act)
          } else {
            intShow.push(refAmo)
          }
          tipShow.push(transfees)
        }
      }

      // 已发货 && 金额为0
      if (refundItem.status != 2 && refundAmount == 0) {
        tipShow = []
        intShow = []
      }

      // 积分
      if (orderScore && orderScore > 0) {
        var score = orderScore + this.i18n.integral
        tipShow.push(score)
        intShow.push(score)
      }


      this.tipShowStr = tipShow.join('+') // 最多可退
      this.intShowStr = intShow.join('+') // 输入框
    },


    /**
     * 上传图片
     */
    getUploadImg: function (e) {
      var idx = e.target.dataset.idx;
      var ths = this;
      wx.chooseImage({
        count: 1,
        // 默认9
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          // 图片的本地临时文件路径列表
          var tempFilePaths = res.tempFilePaths;
          uni.showLoading({
            mask: true
          });
          var params = {
            url: "/api/v1/file/upload",
            filePath: tempFilePaths[0],
            name: 'file',
            callBack: function (res2) {
              uni.hideLoading()
              var img = {};
              img.path = JSON.parse(res2).filePath;
              img.url = JSON.parse(res2).resourcesUrl + JSON.parse(res2).filePath;
              var photoFiles = ths.photoFiles;
              photoFiles.push(img);
              ths.setData({
                photoFiles: photoFiles
              });
            }
          };
          http.upload(params);
        }
      });
    },

    /**
     * 申请退款图片点击预览
     */
    refundPicPreView(e) {
      var current = e.currentTarget.dataset.cur
      var urls = []
      this.photoFiles.forEach(el => {
        urls.push(el.url)
      })
      uni.previewImage({
        current: current,
        urls: urls
      })
    },

    /**
     * 删除图片
     */
    removeImage: function (e) {
      var idx = e.currentTarget.dataset.idx;
      var photoFiles = this.photoFiles;
      photoFiles.splice(idx, 1);
      this.setData({
        photoFiles: photoFiles
      });
    },

    /**
     * 申请退款
     */
    applyRefund: function () {
      var myreg = /^1(3|4|5|6|7|8|9)\d{9}$/;
      var pics = '';
      this.photoFiles.forEach(function (item) {
        pics += item.path + ',';
      });
      if (pics != '') {
        pics = pics.substring(0, pics.length - 1)
      }
      // 检查数据完整性
      if (!this.orderScore && this.refundAmount < 0.01) {
        uni.showToast({
          icon: 'none',
          title: this.i18n.fillCorrectAmount,
          duration: 2500
        })
        return
      }
      // 输入框金额大于订单最多可退总额（金额+运费）
      if (Number(this.refundAmount) > Number(this.totalPrice)) {
        uni.showToast({
          icon: 'none',
          title: this.i18n.refundAmountTips,
          duration: 2000
        })
        return
      }
      if (this.buyerMobile.length == 0) {
        uni.showToast({
          icon: 'none',
          title: this.i18n.enterMobileNumber,
        })
        return
      }
      if (this.buyerMobile.length !== 11 || !myreg.test(this.buyerMobile)) {
        uni.showToast({
          icon: 'none',
          title: this.i18n.enterCorrectPhone,
        })
        return
      }
      if (this.buyerDesc.length == 0) {
        uni.showToast({
          icon: 'none',
          title: this.i18n.fillRefundDescription,
        })
        return
      }
      if (this.buyerDesc.length > 50) {
        uni.showToast({
          icon: 'none',
          title: this.i18n.fillRefundDescriptionTips,
        })
        return
      }

      var refundReasonArray = []
      var buyerReason = this.buyerReason
      if (this.isReceiver == 0) { // 未收货
        refundReasonArray = this.refundPriReasonArray
        // 未收到货需要转换一下原因
        buyerReason == 2 ? buyerReason = 6 : 0
      }
      else if (this.isReceiver == 1) { // 已收货
        refundReasonArray = this.refundProdReasonArray
      }
      if (this.refundItem.status == 2 && this.isLastProd) {  //待发货并且是最后一件
        uni.showModal({
          title: this.i18n.prompt,
          content: this.i18n.promptTips,
          cancelText: this.i18n.cancel,
          confirmText: this.i18n.confirm,
          success: res => {
            if (res.confirm) {
              uni.showLoading();
              var params = {
                url: "/api/v1/orderRefund/apply",
                method: "POST",
                data: {
                  orderNumber: this.orderNumber, //订单编号
                  applyType: this.applyType, //退款方式(1:仅退款 2退款退货)
                  isReceiver: Number(this.isReceiver), //货物状态(1:已收到货 0:未收到货)
                  buyerReason: buyerReason, //退款原因
                  goodsNum: this.goodsNum, //退款数量（0或不传值则为全部数量）
                  refundAmount: this.refundAmount, //退款金额
                  buyerMobile: this.buyerMobile, //手机号码（默认当前订单手机号码）
                  buyerDesc: this.buyerDesc, //备注说明
                  photoFiles: pics, //凭证图片列表
                  refundType: this.refundType, //退款单类型（1:整单退款,2:单个物品退款）
                  orderItemId: this.refundItem.orderItemId
                },
                callBack: (res) => {
                  uni.hideLoading();
                  // 去到我的退款订单页面
                  uni.redirectTo({
                    url: '/pages/afterSales/afterSales',
                  })
                }
              };
              http.request(params);
            } else if (res.cancel) {
            }
          }
        })
      } else {
        uni.showLoading();
        var params = {
          url: "/api/v1/orderRefund/apply",
          method: "POST",
          data: {
            orderNumber: this.orderNumber, //订单编号
            applyType: this.applyType, //退款方式(1:仅退款 2退款退货)
            isReceiver: Number(this.isReceiver), //货物状态(1:已收到货 0:未收到货)
            buyerReason: buyerReason, //退款原因
            goodsNum: this.goodsNum, //退款数量（0或不传值则为全部数量）
            refundAmount: this.refundAmount, //退款金额
            buyerMobile: this.buyerMobile, //手机号码（默认当前订单手机号码）
            buyerDesc: this.buyerDesc, //备注说明
            photoFiles: pics, //凭证图片列表
            refundType: this.refundType, //退款单类型（1:整单退款,2:单个物品退款）
            orderItemId: this.refundItem.orderItemId
          },
          callBack: (res) => {
            uni.hideLoading()
            // 去到我的退款订单页面
            uni.redirectTo({
              url: '/pages/afterSales/afterSales',
            })
          }
        };
        http.request(params);
      }
    },

    /**
     * 将获取到的input内容放进数据里
     */
    onDescInput: function (e) {
      this.setData({
        buyerDesc: e.detail.value
      });
    },
    onRefInput: function (e) {
      this.setData({
        refundAmount: e.detail.value
      });
    },
    onMobileInput: function (e) {
      this.setData({
        buyerMobile: e.detail.value
      });
    }
  }
};
</script>
<style lang="scss">
@import "./applyRefund.css";
.upload-img{
		height: 300rpx;
		border-top: 2rpx solid #EEEEEE;
		padding-top: 30rpx;
		margin-left: 30rpx;
		&-box{
			width:160rpx;
			height: 160rpx; 
			background-color: #F8F8F8;
			display: flex;
           flex-direction: column;
		   align-items: center;
		   justify-content: center;
		   border-radius: 15rpx;
		}
		.addImg{
			margin-top: 10rpx;
			color: #BFBFBF;
			font-size: 24rpx;
		}
	}
</style>
