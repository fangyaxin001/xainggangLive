<template>
<view>
<!-- 积分兑换商品详情 -->
<!--pages/integralProdDet/integralProdDet.wxml-->
<view class="container">
<u-navbar  title="商品詳情"></u-navbar>
  <!-- 轮播图 -->
  <view class="swiper-con">
<!--    <view class="video-container" v-if="video && isPlaying">
      <video enable-progress-gesture="false" objectFit="fill" id="myVideo" @ended="playEnd" :src="video" controls></video>
    </view>
    <view class="play-btn" v-if="video" @tap="videoOper">
      <image class="play-icon" v-if="!isPlaying" src="/static/images/icon/play-red.png"></image>
      <text :class="'play-text' + isPlaying ? 'video-stop':'video-play'">{{isPlaying?this.i18n.quitPlaying: ''}}</text>
    </view> -->
    <swiper :indicator-dots="false" :autoplay="autoplay" :interval="interval" :duration="duration" >
      <block v-for="(item, index) in 3" :key="index">
        <swiper-item>
          <image src="../../static/images/icon/integralActBg2.png"></image>
        </swiper-item>
      </block>
    </swiper>
	<view class="icon-right">1/5</view>
  </view>
  <!-- 轮播图end -->

  <!-- 商品信息 -->
  <view class="prod-info">
    <view class="tit-wrap">
      <view class="prod-tit">{{prodName}}asdasd </view>
      <view class="prod-tit">
		  <view class="">
		    <image style="width: 30rpx; height: 30rpx;" src="../../../static/images/proneler/shoucang.png" mode=""></image>
		  </view>
		  <view class="">收藏</view>
	  </view>
    </view>
    <view class="sales-p">明目調理 </view>
	<view class="price">
	  <image style="width: 20rpx;height: 24rpx;" src="../../../static/images/proneler/jifen-img.png" class="icon"></image>
	  <text class="red-word">1積分+HK$<text style="font-size: 30rpx;"> 1999.00</text></text>
	</view>

    <!-- 积分商品价格 -->
    <view class="integral-prod-price" v-if="defaultSku">
      <text v-if="price">￥{{wxs.parsePrice(defaultSku.price)[0]}}.{{wxs.parsePrice(defaultSku.price)[1]}} +</text>{{defaultSku.skuScore}} {{i18n.integral}}</view>
  </view>
  <!-- 商品信息end -->

<u-gap height="20" bg-color="#F6F7F9"></u-gap>
  <!-- 已选规格 -->
  <view class="sku" @tap="showSku">
    <view class="sku-tit">配送</view> 
    <view class="more">快遞配送</view>
  </view>
  <view class="sku" @tap="showSku">
    <view class="sku-tit">运费</view> 
    <view class="more">全店免郵/到店自取/HK$9.99</view>
  </view>
  <view class="sku" @tap="showSku">
    <view class="sku-tit">已選</view>
		<view class="sku-con">
		<!-- 	<block v-for="(skuItem,index) in selectedProp" :key="index">
				<text decode="true">{{index < selectedProp.length-1 ? skuItem +'，' : skuItem+'&nbsp; &nbsp;'}}</text>
			</block> -->
			<view style="color: #333333;margin-top: 10rpx;margin-right: 10rpx;">{{prodNum}}件</view>
			 <view  style="color: #000000; font-size: 40rpx; margin-bottom: 10rpx;">...</view>
		</view>
   
  </view>
  <!-- 已选规格end -->


  <!-- 商品详情 -->
  <view class="prod-detail">
    <view>
      <rich-text :nodes="content"></rich-text>
    </view>
  </view>
  <!-- 商品详情end -->
  

  <!-- 规格弹窗 -->
  <view class="pup-sku" v-show="flag" >
    <view class="pup-sku-main">
      <view class="pup-sku-header">
        <!-- <image class="pup-sku-img" :src="defaultSku.pic?defaultSku.pic:pic"></image> -->
        <image class="pup-sku-img" src="../../static/images/icon/zhuanpan@2x.png"></image>
        <view class="prod-title">{{prodName}}sada</view>
        <!-- 积分商品价格 -->
        <view class="pup-sku-price">
			<text class="pup-sku-price-int">￥22</text>
			<text >+</text>66{{i18n.integral}}</view>
          <!-- <text class="pup-sku-price-int" v-if="defaultSku.price">￥{{wxs.parsePrice(defaultSku.price)[0]}}.{{wxs.parsePrice(defaultSku.price)[1]}}</text>  -->
          <!-- <text v-if="defaultSku.price && scorePrice">+</text>{{defaultSku.skuScore}} {{i18n.integral}}</view> -->
        <view class="pup-sku-price" >{{i18n.outOfStock}}</view>
        <!-- <view class="pup-sku-price" v-if="!findSku">{{i18n.outOfStock}}</view> -->
				<view class="pup-sku-prop">
					<text>{{i18n.selected + ' '}}</text>
					<text decode="true">
						<!-- <block v-for="(skuItem,index) in selectedProp" :key="index">
							&nbsp;{{index < selectedProp.length-1 ? '&nbsp;' + skuItem + '，' : '&nbsp;' + skuItem +'&nbsp;&nbsp;'}}
						</block>{{prodNum}}{{i18n.piece}} -->
						
						<!-- <text decode="true" style="padding-left: 20px;">{{i18n.inventory}}&nbsp;{{findSku?defaultSku.stocks:0}}{{'&nbsp;' + i18n.piece}}</text> -->
						<text decode="true" style="padding-left: 20px;">22</text>
					</text>
				</view>
        <!-- <view class="close" @tap="closePopup"></view> -->
        <view class="close" @tap="flag = false"></view>
      </view>
      <view class="pup-sku-body">
        <view class="pup-sku-area">
					
				<!-- 	<view class="sku-box" v-if="skuList.length">
						<view class="items sku-text" v-for="(skuLine, key) in skuGroup" :key="key">
							<text class="sku-kind">{{key}}</text>
							<view class="con">
								<text class="sku-choose-item" @click="toChooseItem(skuLineItem, key)" :class="[selectedProp.indexOf(skuLineItem) !== -1?'active':'',  isSkuLineItemNotOptional(allProperties,selectedPropObj,key,skuLineItem,propKeys)? 'dashed' : '']"
								 v-for="skuLineItem in skuLine" :key="skuLineItem">{{skuLineItem}}</text>
							</view>
						</view>
					</view> -->
					
        </view>
		<view class="v-con">
			<view class="v-con-color">颜色</view>
			<view class="v-con-conent">
				<view class=""> 深蓝色</view>
				<view class=""> 藏青色</view>
				<view class="weiIcon" > 米白色</view>
			</view>
		</view>
		<view class="v-con">
			<view class="v-con-color">尺码</view>
			<view class="v-con-conent">
				<view class=""> S码</view>
				<view class=""> M码</view>
				<view class="weiIcon" > L码</view>
			</view>
		</view>
        <view class="pup-sku-count">
          <view class="num-wrap">
            <view class="minus" @tap="onCountMinus">
              <text class="row"></text>
            </view>
            <view class="text-wrap">
              <input type="number" @input="prodNumInp" :value="prodNum" @blur="inpBlur"></input>
            </view>
            <view class="plus" @tap="onCountPlus">
              <text class="row"></text>
              <text class="col"></text>
            </view>
          </view>
          <view class="count-name">{{i18n.quantity}}</view>
        </view>
      </view>
      <!-- 积分 底部按钮 -->
      <view class="ex-integral-foot">
        <view class="ex-integral-btn">{{i18n.redeemNow}}</view>
      </view>
    </view>
  </view>
  <!-- 规格弹窗 end --> 
</view>

<!-- 积分 底部按钮 -->
<!-- <view class="foot-btn-box"> -->
  <view class="ex-integral-foot">
    <view class="ex-integral-btn" @tap="redeemNow">立即兌換</view>
    <!-- <view class="ex-integral-btn" @tap="flag= true">立即兌換</view> -->
  </view>
<!-- </view> -->



<!-- <login-popup bind:onGotUserInfo="onGotUserInfo" isAuthInfo="{{isAuthInfo}}"></login-popup> -->
</view>
</template>

<script module="wxs" lang="wxs" src="../../../wxs/number.wxs"></script>

<script>
// pages/prod/prod.js
const app = getApp().globalData;
var http = require("../../../utils/http.js");
var config = require("../../../utils/config.js");
var util = require("../../../utils/util.js");
import coupon from "../../../components/coupon/coupon";
import commStar from "../../../components/commStar/commStar";
import loginPopup from "../../../components/loginPopup/loginPopup";

export default {
  data() {
    return {
	  flag:false, //暂时控制规格窗口出现，
      shopId: 1,
      shopName: '',
      picDomain: config.picDomain,
      indicatorDots: true,
      indicatorColor: '#f2f2f2',
      indicatorActiveColor: '#EF103C',
      isAuthInfo: true,
      autoplay: true,
      interval: 3000,
      duration: 1000,
      prodNum: 1,
      totalCartNum: 0,
      groupActivityId: 0,
      pic: "",
      imgs: '',
      prodName: '',
      price: 0,
      actPrice: 0,
      content: '',
      prodId: 0,
      brief: '',
      skuId: 0,
      popupShow: false,
      skuShow: false,
      skuGroupShow: false,
      commentShow: false,
      skuList: null,
      skuGroup: {},
      findSku: true,
      defaultSku: undefined,
      detaultGroupSku: undefined,
      selectedProp: [],
      selectedPropObj: {},
      selectedProperties: "",
      propKeys: [],
      allProperties: [],
      isCollection: false,
      skuShowType: 0,
      // sku的显示类型 0普通sku 1拼团sku
      totalStocks: 0,
      // 活动剩余库存
      hasMaxNum: false,
      // 是否限购
      maxNum: 0,
      // 限购数量
      totalStocks: 0 //库存量
      ,
      scorePrice: "",

      videoContext: '', // 视频组件
      isPlaying: false, // 视频是否播放中
      currentSwiper: 0, // 当前轮播index
      touchS: [0, 0], // 滑动屏幕开始坐标
      touchE: [0, 0], // 滑动屏幕结束坐标
      showDiscountPopup: false, //促销弹窗显隐
      video: "",
      videoDuration: "",
    };
  },

  components: {
    coupon,
    commStar,
    loginPopup
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
    this.setData({
      prodId: options.prodId
    }); // 加载商品信息

    this.getProdInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext('myVideo');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
			skuShow: false
    }); 
		uni.setNavigationBarTitle({
			title:this.i18n.commodityDetails
		});
		// 查看用户是否关注
    this.getCollection();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  methods: {
		/**
		 * 数量输入失焦
		 */
		inpBlur() {
			if (this.prodNum < 1) {
				uni.showToast({
					title: this.i18n.leastTips,
					icon: 'none'
				})
				return
			}
			if (this.totalStocks <= 0 || this.prodNum > this.defaultSku.stocks) {
			  uni.showToast({
			    title: this.i18n.insufficientProductInventory,
			    icon: 'none',
			    duration: 2000
			  });
			  return;
			}
		},
		/**
		 * 输入商品数量
		 */
		prodNumInp(e) {
			let num = Number(e.detail.value.replace(/[^\d]/g,''))
			this.prodNum = num
		},
    /**
     * 获取是否关注信息
     */
    getCollection() {
      uni.showLoading();
      var params = {
        url: "/api/v1/user/collection/isCollection",
        method: "GET",
        data: {
          prodId: this.prodId,
        },
        callBack: res => {
          this.setData({
            isCollection: res
          });
          uni.hideLoading()        }
      };
      http.request(params);
    },

    // 获取商品信息
    getProdInfo() {
      uni.showLoading();
	  console.log(this.prodId)
      var params = {
        url: "/score/prod/prodInfo",
        method: "GET",
        data: {
          prodId: this.prodId // userType: 0

        },
        callBack: res => {
			
		  this.prodInfo = res
          var imgStrs = res.imgs;
          var imgs = imgStrs.split(",");
          var content = util.formatHtml(res.content);
          this.setData({
            imgs: imgs,
            content: content,
            price: res.price,
            prodName: res.prodName,
            groupActivityId: res.groupActivityId,
            prodId: res.prodId,
            brief: res.brief,
            totalStocks: res.totalStocks,
            // skuId: res.skuId
            skuList: res.skuList,
            totalStocks: res.totalStocks,
            //库存量
            pic: res.pic,
            shopId: res.shopId,
            video: res.video ? res.video : '',
            scorePrice: res.scorePrice //积分价格

          }); 
          // 初始化视频
          if (res.video) {
            this.$nextTick(() => {
              this.videoContext = uni.createVideoContext('myVideo', this)
            })
          }
          // 团购活动
          if (res.groupActivityId) {
            this.getJoinGroupList();
          } // 组装sku


          this.groupSkuProp(res.skuList,res.price); // this.getShopInfo();

          uni.hideLoading()        }
      };
      http.request(params);
	  uni.hideLoading()
    },

    /**
     * 组装SKU
     */
    groupSkuProp: function(skuList, defaultPrice) {
    	if (skuList.length == 1 && skuList[0].properties == "") {
    		this.defaultSku = skuList[0]
    		return;
    	}
    	var skuGroup = {};
    	var allProperties = [];
    	var propKeys = [];
    	var selectedPropObj = {}
    	var defaultSku = null;
    	for (var i = 0; i < skuList.length; i++) {
    		var isDefault = false;
    		if (!defaultSku && skuList[i].price == defaultPrice) { //找到和商品价格一样的那个SKU，作为默认选中的SKU
    			defaultSku = skuList[i];
    			isDefault = true;
    		}
    		var properties = skuList[i].properties; //版本:公开版;颜色:金色;内存:64GB
    		allProperties.push(properties);
    		var propList = properties.split(";"); // ["版本:公开版","颜色:金色","内存:64GB"]
    
    		for (var j = 0; j < propList.length; j++) {
    
    			var propval = propList[j].split(":"); //["版本","公开版"]
    			var props = skuGroup[propval[0]]; //先取出 版本对应的值数组
    
    			//如果当前是默认选中的sku，把对应的属性值 组装到selectedProp
    			if (isDefault) {
    				propKeys.push(propval[0]);
    				selectedPropObj[propval[0]] = propval[1];
    			}
    
    			if (props == undefined) {
    				props = []; //假设还没有版本，新建个新的空数组
    				props.push(propval[1]); //把 "公开版" 放进空数组
    			} else {
    				if (props.indexOf(propval[1]) === -1) { //如果数组里面没有"公开版"
    					props.push(propval[1]); //把 "公开版" 放进数组
    				}
    			}
    			skuGroup[propval[0]] = props; //最后把数据 放回版本对应的值
    		}
    	}
    	this.defaultSku = defaultSku
    	this.propKeys = propKeys
    	this.selectedPropObj = selectedPropObj
    	this.parseSelectedObjToVals(skuList);
    	this.skuGroup = skuGroup
    	this.allProperties = allProperties
    },
    
    /**
     * 将已选的 {key:val,key2:val2}转换成 [val,val2]
     */
    parseSelectedObjToVals: function(skuList) {
    	var selectedPropObj = this.selectedPropObj
    	var selectedProperties = "";
    	var selectedProp = [];
    	for (var key in selectedPropObj) {
    		selectedProp.push(selectedPropObj[key]);
    		selectedProperties += key + ":" + selectedPropObj[key] + ";";
    	}
    	selectedProperties = selectedProperties.substring(0, selectedProperties.length - 1);
    	this.selectedProp = selectedProp
    	this.selectedProperties = selectedProperties
    	this.selectedPropObj = selectedPropObj
    
    	var findSku = false;
    	for (var i = 0; i < skuList.length; i++) {
    		if (skuList[i].properties == selectedProperties) {
    			findSku = true;
    			this.defaultSku = skuList[i]
    			break;
    		}
    	}
    	this.findSku = findSku
    },
    
    /**
     * 判断当前的规格值 是否可以选
     */
    isSkuLineItemNotOptional(allProperties, selectedPropObj, key, item, propKeys) {
    	var selectedPropObj = Object.assign({}, selectedPropObj)
    	var properties = "";
    	selectedPropObj[key] = item;
    	for (var j = 0; j < propKeys.length; j++) {
    		properties += propKeys[j] + ":" + selectedPropObj[propKeys[j]] + ";";
    	}
    	properties = properties.substring(0, properties.length - 1);
    	for (var i = 0; i < allProperties.length; i++) {
    		if (properties == allProperties[i]) {
    			return false;
    		}
    	}
    	for (var i = 0; i < allProperties.length; i++) {
    		if (allProperties[i].indexOf(item) >= 0) {
    			return true;
    		}
    	}
    	return false;
    },
    
    /**
     * 规格点击事件
     */
    toChooseItem(skuLineItem, key, event) {
    	this.selectedPropObj[key] = skuLineItem;
    	this.parseSelectedObjToVals(this.skuList);
    },
    
    //判断数组是否包含某对象
    array_contain: function(array, obj) {
    	for (var i = 0; i < array.length; i++) {
    		if (array[i] == obj) //如果要求数据类型也一致，这里可使用恒等号===
    			return true;
    	}
    	return false;
    },

    /**
     * 立即兑换
     */
    redeemNow: function () {
		if(this.flag){
			this.flag = false
			uni.navigateTo({
			  url: '/packageMemberIntegral/pages/integralSubmitOrder/integralSubmitOrder?orderEntry=1'
			});
		}else{
			this.flag = true
		}
		 
			// this.stopPlay()
   //    if (!this.flag) {
   //      return;
   //    }
			// if(!this.skuShow){
			// 	this.skuShow = true
			// 	return
			// }
			// if (this.prodNum < 1) {
			// 	uni.showToast({
			// 		title: this.i18n.leastTips,
			// 		icon: 'none'
			// 	})
			// 	this.prodNum = 1
			// 	return
			// }
   //    if (this.totalStocks <= 0 || this.prodNum > this.defaultSku.stocks) {
   //      uni.showToast({
   //        title: this.i18n.insufficientProductInventory,
   //        icon: 'none',
   //        duration: 2000
   //      });
   //      return;
   //    }
			// util.checkAuthInfo(()=>{
			// 	uni.setStorageSync("orderItem", JSON.stringify({
			// 	  prodId: this.prodId,
			// 	  skuId: this.defaultSku.skuId,
			// 	  prodCount: this.prodNum,
			// 	  shopId: this.shopId,
			// 	  distributionCardNo: this.distributionCardNo
			// 	}));
			// 	uni.navigateTo({
			// 	  url: '/packageMemberIntegral/pages/integralSubmitOrder/integralSubmitOrder?orderEntry=1'
			// 	});
			// });
    },

   
    /**
     * 减数量
     */
    onCountMinus: function () {
      var prodNum = this.prodNum;

      if (prodNum > 1) {
        this.setData({
          prodNum: prodNum - 1
        });
      }
    },

    /**
     * 加数量
     */
    onCountPlus: function () {
      var prodNum = this.prodNum; // 判断库存
			if (prodNum < this.defaultSku.stocks) {
				this.setData({
					prodNum: prodNum + 1
				});
			} else {
				uni.showToast({
					title: this.i18n.insufficientStock,
					icon: 'none',
					duration: 1000,
					mask: true
				})
			}
    },
    // sku弹框
    showSku: function (e) {
			this.stopPlay()
      if (e.currentTarget.dataset.alonebuy == 1) {
        this.setData({
          skuShow: true,
          skuShowType: 0
        });
      } else {
        if (this.groupActivityId) {
          this.setData({
            skuShow: true,
            skuShowType: 1
          });
        } else {
          this.setData({
            skuShow: true,
            skuShowType: 0
          });
        }
      }
    },
    // 关闭规格弹窗
    closePopup: function () {
      this.setData({
        popupShow: false,
        skuShow: false,
        commentShow: false
      });
    },

    /**
     * 获取用户信息
     */
    onGotUserInfo: function (e) {
      if (e.detail.errMsg != "getUserInfo:fail auth deny") {
        this.setData({
          isAuthInfo: true
        });
        http.updateUserInfo();
      }
    },
    groupConfirmOrder: function (e) {
      if (!this.findSku) {
        return;
      }

      var ths = this;
      uni.showLoading({
        mask: true
      }); // 查看是否授权

      util.checkAuthInfo(ths.groupConfirmDataFun);
    },

    groupConfirmDataFun() {
      wx.setStorageSync("groupOrderItem", JSON.stringify({
        groupSkuId: ths.detaultGroupSku.groupSkuId,
        // this.data.groupSkuId,
        prodCount: ths.prodNum,
        // this.data.prodNum,
        groupTeamId: e.currentTarget.dataset.teamid // this.data.groupTeamId

      }));
      uni.navigateTo({
        url: '/pages/groupConfirmOrder/groupConfirmOrder'
      });
    },

    /**
     * 视频信息
     */
    getVideoInfo() {
      wx.showLoading();
      wx.request({
        url: this.video + '?avinfo',
        success: res => {
          wx.hideLoading();
          let time = Number(res.data.format.duration).toFixed(0);
          this.setData({
            videoDuration: time < 60 ? '00′' + time + '″' : parseInt(time / 60) + '′' + time % 60 + '″'
          });
        }
      });
    },
    /**
     * 视频播放/停止按钮
     */
    videoOper() {
      util.tapLog()
      if (this.isPlaying) {
        this.stopPlay()
      } else {
        this.startPlay()
      }
    },
    playEnd() {
      this.stopPlay()
    },

    startPlay() {
      this.setData({
        isPlaying: true,
      })
      setTimeout(() => {
        this.videoContext.seek(0)
        this.videoContext.play()
      }, 200)
    },
    stopPlay() {
      this.setData({
        isPlaying: false
      })
      setTimeout(() => {
        this.videoContext.seek(0)
        this.videoContext.stop()
      }, 200)
    },

  }
};
</script>
<style>
@import "./convertProdDet.css";
</style>