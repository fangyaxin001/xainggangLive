<template>
	<view>
		<!-- 拼团详情 -->
		<!-- pages/SpellGroupDetails/spellGroupDetails.wxml -->
		<view class="top-box" :style="isEn? 'height: unset' : ''" v-if="groupTempInfo.groupTeam">
			<view class="top-bg"></view>
			<!-- <view class="top-bg1"></view> -->
			<!-- 商品内容盒子 -->
			<view class="goods-content">
				<view class="goods-img-box">
					<image :src="groupTempInfo.groupProd.prodPic" class="goods-img"></image>
				</view>
				<!-- 商品信息信息 -->
				<view class="goods-msg" v-if="groupTempInfo.groupProd.prodName">
					<text class="goods-title">{{groupTempInfo.groupProd.prodName}}</text>
					<!-- 商品规格 -->
					<!-- <view class="goods-sku">{{groupTempInfo.groupProd.skuName}}</view> -->
					<!-- 价格 -->
					<view class="goods-price">
						<text class="spell-group-price">￥{{groupTempInfo.groupProd.actPrice}}</text>
						<text class="original-price">￥{{groupTempInfo.groupProd.price}}</text>
					</view>
				</view>
			</view>
			<!-- 商品内容盒子 end -->
			<!-- 规则 -->
			<view class="tips-text clearfix">
				<image src="/static/images/icon/thumb.png" class="thumb-icon"></image>
				<text class="tips-text-cnt">{{i18n.groupJoiningRules1}} {{joinNum}} {{i18n.groupJoiningRules2}}</text>
			</view>
		</view>
		<!-- 下 -->
		<view class="condition" v-if="groupTempInfo.groupTeam">
			<!-- 剩余时间 -->
			<view class="time-remaining">
				<text class="line-left"></text>
				<text v-if="groupTempInfo.groupTeam.status == 1 && !isEnd" class="time-text">{{i18n.groupJoinTime}}</text>
				<text v-if="groupTempInfo.groupTeam.status == 2" class="time-text">{{i18n.groupJoiningSuccess}}</text>
				<text v-if="groupTempInfo.groupTeam.status == 3 && isEnd" class="time-text">{{i18n.groupJoiningFailure}}</text>
				<text class="line-right"></text>
			</view>
			<view v-if="groupTempInfo.groupTeam.status == 1 && !isEnd" class="countdown">
				<text class="time-number">{{countDownObj.hou}}</text>：<text class="time-number">{{countDownObj.min}}</text>：<text
				 class="time-number">{{countDownObj.sec}}</text>
			</view>

			<!-- 人员 -->
			<view class="member" :style="'padding-left:' + (groupUserList.length>5? '40px;' : ((groupUserList.length-2) * 10) + 'px')">
				<block v-for="(groupUser, index) in groupUserList" :key="index">
					<view v-if="groupUser.identityType == 1" class="captain">
						<image class="captain-img" :src="groupUser.pic?groupUser.pic:'../../../static/images/icon/head04.png'"></image>
						<text class="status">{{i18n.teamLeader}}</text>
					</view>
					<view v-else-if="groupUser.identityType == 0 && index<5"class="group-member" :style="'z-index:' + ((-index+99)) + '; left:' + (-index*10) + 'px'">
						<image class="group-member-img" :src="groupUser.pic?groupUser.pic:'../../../static/images/icon/head04.png'"></image>
					</view>
					<view v-else-if="index<5" class="group-member" :style="'z-index:' + ((-index+99)) + '; left:' + (-index*10) + 'px'">
						<image class="group-member-img" src="../../../static/images/icon/head04.png"></image>
					</view>
				</block>
			</view>
			<view class="more-ellipsis" v-if="groupTempInfo.groupTeam.groupNumber> 5">
				<text decode="true">·&nbsp;·&nbsp;·</text>
			</view>

			<!-- 查看全部团员btn -->
			<view class="view-all display">{{i18n.viewAllMembers}}</view>
			<view v-if="groupTempInfo.groupTeam.status == 1 && !isEnd" class="invite-text">{{i18n.onlyLeft}}<text>{{groupTempInfo.groupTeam.groupNumber - groupTempInfo.groupTeam.joinNum}}</text>{{i18n.peopleJoinGroup}}</view>
			<view class="invite-text  display">{{i18n.lack}}<text>{{groupTempInfo.groupTeam.groupNumber - groupTempInfo.groupTeam.joinNum}}</text>{{i18n.peopleGroupSuccess}}</view>
			<!-- 邀请好友参团 -->
			<!-- #ifdef H5 -->
			<view class="join-now" @tap="h5Share" v-if="groupTempInfo.groupTeam.status == 1 && !isEnd">{{i18n.inviteFriendsJoin}}</view>
			<!-- #endif -->
			<!-- #ifdef MP -->
			<button class="join-now" open-type="share" v-if="groupTempInfo.groupTeam.status == 1 && !isEnd">{{i18n.inviteFriendsJoin}}</button>
			<!-- #endif -->
			<!-- 立即参团btn   wx:if="{{groupTempInfo.groupTeam.status == 1 && groupTempInfo.orderNumber}}"-->
			<view class="join-now" v-if="!groupTempInfo.orderNumber && groupTempInfo.groupTeam.status == 1  && !isEnd" @tap="showSku">{{i18n.JoinGroupNow}}</view>
			<!-- 查看团队 -->
			<view class="join-now" @tap="toGroupTempInfoPage" :data-groupteamid="groupTempInfo.groupTeam.groupTeamId">{{i18n.viewTeam}}</view>
			<!-- 查看详情btn -->
			<view v-if="groupTempInfo.orderNumber" @tap="toOrderDetailPage" :data-ordernum="groupTempInfo.orderNumber" class="check-order">{{i18n.viewOrderDetails}}</view>
		</view>

		<!-- 规格弹窗 -->
		<view class="pup-sku" v-if="skuShow">
			<view class="pup-sku-main">
				<view class="pup-sku-header">
					<image class="pup-sku-img" :src="defaultSku.pic?defaultSku.pic:groupTempInfo.groupProd.prodPic"></image>
					<view class="pup-sku-price" v-if="findSku">￥<text class="pup-sku-price-int">{{wxs.parsePrice(defaultSku.actPrice)[0]}}</text>.{{wxs.parsePrice(defaultSku.actPrice)[1]}}</view>
					<view class="pup-sku-price" v-if="!findSku">{{i18n.outOfStock}}</view>
					<view class="pup-sku-prop">
						<!-- <text>{{i18n.selected}}</text>{{selectedProp.length>0?selectedProp+'，':selectedProp}}{{prodNum}}{{i18n.piece}} -->
						<view>
							<text>{{i18n.selected}}</text>
							<text decode="true">
								<block v-for="(skuItem,index) in selectedProp" :key="index">
									&nbsp;{{index < selectedProp.length-1 ? '&nbsp;' + skuItem + '，' : '&nbsp;' + skuItem +'&nbsp;&nbsp;'}}
								</block>{{prodNum}}&nbsp;{{i18n.piece}}
							</text>
						</view>
					</view>
					<view class="close" @tap="closePopup"></view>
				</view>
				<view class="pup-sku-body">
					<view class="pup-sku-area">
						<block v-for="(skuLine, key) in skuGroup" :key="key">
							<text class="sku-kind">{{key}}</text>
							<view class="sku-choose">
								<block v-for="skuLineItem in skuLine" :key="skuLineItem">
									<text class="sku-choose-item" @click="toChooseItem(skuLineItem, key)" :class="[selectedProp.indexOf(skuLineItem) !== -1?'active':'',  isSkuLineItemNotOptional(allProperties,selectedPropObj,key,skuLineItem,propKeys)? 'dashed' : '']">{{skuLineItem}}</text>
								</block>
							</view>
						</block>
					</view>
					<view class="pup-sku-count">
						<view class="num-wrap">
							<view class="minus" @tap="onCountMinus">
								<text class="row"></text>
							</view>
							<view class="text-wrap">
								<input type="number" @input="prodNumInp" :value="prodNum"></input>
							</view>
							<view class="plus" @tap="onCountPlus">
								<text class="row"></text>
								<text class="col"></text>
							</view>
						</view>
						<view class="count-name">{{i18n.quantity}}</view>
					</view>
				</view>
				<view class="pup-sku-footer">
					<!-- <view class="btn buy" bindtap='spellIn' wx:if="{{groupTempInfo.groupTeam.status == 1 }}">立即参团</view> -->
					<view :class="'btn buy ' + (findSku?'':'gray')" @tap="groupConfirmOrder" :data-teamid="groupTeamId">{{i18n.JoinGroupNow}}</view>
				</view>
			</view>
		</view>
		<!-- 规格弹窗 end -->
		<!-- 引导分享蒙版 -->
			<guide-share v-if="showGuideShare" @hideGuideShare="hideGuideShare" :isWechat="isWechat" :qrLink="qrLink" />
		<!-- 引导分享蒙版 end -->
	</view>
</template>

<script module="wxs" lang="wxs" src="../../../wxs/number.wxs"></script>

<script>
// pages/spellGroupDetails/spellGroupDetails.js
const app = getApp().globalData;
var http = require("../../../utils/http.js");
var config = require("../../../utils/config.js");
var util = require("../../../utils/util.js");
import Wechat from "../../../utils/wechat.js";
import guideShare from '../../../components/guideShare/guideShare';
export default {
  data() {
    return {
      reqComplete: false,
      hideModal: true,
      groupTempInfo: {
        groupProd: {},
        groupTeam: {}
      },
      groupUserList: [],
      countDownObj: {},
      nowTime: new Date().getTime(),
      skuShow: false,
      prodNum: 1,
      skuList: [],
      skuGroup: {},
      findSku: true,
      defaultSku: undefined,
      detaultGroupSku: undefined,
      selectedProp: [],
      selectedPropObj: {},
      selectedProperties: "",
      propKeys: [],
      allProperties: [],
      groupTeamId: '',
      groupSkuId: 0,
      orderNumber: 0,
      isAuthInfo: true,
      countDownObjTimer: '',
      joinNum: "",

      isEnd: false, // 当前拼团是否已经结束
      isEn: uni.getStorageSync('lang') == 'en' ? true : false, // 是否为英文
      showGuideShare: false, // 分享引导显隐
      isWechat: false, // 是否微信环境
      showQr: false, // H5 二维码显隐
      qrLink: '', // H5二维码地址
    };
  },

  components: {
    guideShare,
  },

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
    // #ifdef H5
    this.isWechat = Wechat.isWechat()
    // #endif
    console.log('this.$Route.query:', this.$Route.query)
    let groupTeamId = this.$Route.query.groupTeamId || '';
    let orderNumber = this.$Route.query.orderNumber || '';
    this.getGroupTeamInfo(groupTeamId, orderNumber);
    this.setData({
      orderNumber: orderNumber,
      groupTeamId: groupTeamId
    });
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
      title: this.i18n.groupDetails
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.closePopup()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearTimeout(this.countDownObjTimer);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },

  /**
   * 小程序: 邀请好友参团
   */
  onShareAppMessage: function (res) {
    return {
      title: this.groupTempInfo.groupProd.prodName,
      path: '/packageActivities/pages/spellGroupDetails/spellGroupDetails?groupTeamId=' + this.groupTeamId,
      imageUrl: this.groupTempInfo.groupProd.prodPic
    };
  },
  methods: {
    /**
     * 输入商品数量
     */
    prodNumInp(e) {
      let num = Number(e.detail.value.replace(/[^\d]/g,''))
			this.prodNum = num
    },
    /**
     * H5: 邀请好友参团
     */
    h5Share() {
      if (this.isWechat) {
        // 微信内部浏览器
        var sharedata = {
          title: this.groupTempInfo.groupProd.prodName, // 分享标题
          imgUrl: this.groupTempInfo.groupProd.prodPic, // 分享图标
          link: config.domain.replace('/api', '') + '/packageActivities/pages/spellGroupDetails/spellGroupDetails?groupTeamId=' + this.groupTeamId,
          desc: this.i18n.shartTips, // 分享描述
          type: '', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        };
        Wechat.callWexinShare(sharedata, () => {
          this.showGuideShare = true
        }, (failMsg) => {
          console.log(failMsg)
        })
      } else {
        // 普通H5浏览器: 显示生成的二维码
        this.qrLink = config.domain.replace('/api', '') + '/packageActivities/pages/spellGroupDetails/spellGroupDetails?groupTeamId=' + this.groupTeamId
        this.showGuideShare = true
      }
    },
    /**
     * 关闭分享引导
     */
    hideGuideShare(e) {
      this.showGuideShare = e
    },
    /**
     * 组装SKU
     */
    groupSkuProp: function (skuList) {
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
        if (!defaultSku && skuList[i].actPrice == this.groupTempInfo.groupProd.actPrice) { //找到和商品价格一样的那个SKU，作为默认选中的SKU
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
    parseSelectedObjToVals: function (skuList) {
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
    array_contain: function (array, obj) {
      for (var i = 0; i < array.length; i++) {
        if (array[i] == obj) //如果要求数据类型也一致，这里可使用恒等号===
          return true;
      }
      return false;
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
      var prodNum = this.prodNum;
      this.setData({
        prodNum: prodNum + 1
      });
      // TODO : 判断限购、库存（需后台返回相关团购信息）
      // if (prodNum < this.defaultSku.stocks) {

      // }
    },

			/**
			 * 参团
			 */
			groupConfirmOrder: function() {
				if (!this.findSku) {
					return;
				}
				if (this.prodNum < 1) {
					uni.showToast({
						title: this.i18n.leastTips,
						icon: 'none'
					})
					this.prodNum = 1
					return
				}
				wx.setStorageSync("groupOrderItem", JSON.stringify({
					groupSkuId: this.defaultSku.groupSkuId,
					groupTeamId: this.groupTeamId,
					prodCount: this.prodNum
				}));
				uni.navigateTo({
					url: '/packageActivities/pages/groupConfirmOrder/groupConfirmOrder'
				});
			},
			showSku: function() {
				var ths = this; // 查看是否授权

      util.checkAuthInfo(ths.showSkuFun);
    },
    showSkuFun: function () {
      this.setData({
        skuShow: true,
        isLock: true
      });
    },
    closePopup: function () {
      this.setData({
        skuShow: false,
        isLock: false
      });
    },

    /**
     * 加载拼团团队详情
     */
    getGroupTeamInfo: function (groupTempId, orderNumber) {
      let _this = this;

      http.request({
        url: "/api/v1/groupTeam/info",
        method: "GET",
        data: {
          groupTeamId: groupTempId,
          orderNumber: orderNumber
        },
        callBack: res => {
          _this.setData({
            skuList: res.groupSkuList,
            groupTempInfo: res,
            groupUserList: res.apiGroupUserList,
            nowTime: util.dateToTimestamp(res.groupTeam.nowTime),
            joinNum: res.groupTeam.groupNumber - 1,
            groupTeamId: res.groupTeam.groupTeamId
          });

          let groupUserCount = _this.groupUserList.length > 5 ? 5 : _this.groupUserList.length;
          let groupNumber = _this.groupTempInfo.groupTeam.groupNumber > 5 ? 5 : _this.groupTempInfo.groupTeam.groupNumber;
          let unGroupNumber = groupNumber - groupUserCount;
          let groupUserList = _this.groupUserList;
          if (unGroupNumber > 0) {
            for (let i = 0; i < unGroupNumber; i++) {
              groupUserList = groupUserList.concat({});
            }
          }

          _this.setData({
            groupUserList: groupUserList
          });
          if (res.groupTeam.status == 2) {
            // 拼团已经结束
            return
          }

          _this.countdown();

          _this.groupSkuProp(res.groupSkuList);
        },
        errCallBack: errRes => {
          uni.showModal({
            title: this.i18n.tips,
            content: errRes.data,
            showCancel: false,
            confirmText: this.i18n.confirm,
            success: (res1) => {
              if (res1.confirm) {
                uni.navigateBack({
                  delta: 1
                })
              }
            }
          })
        }
      });
    },

    // 倒计时
    countdown() {
      // 获取当前时间，同时得到活动结束时间数组
      let nowTime = this.nowTime;
      let endTime = util.dateToTimestamp(this.groupTempInfo.groupTeam.endTime);
      let countDownObj = {}; // 对结束时间进行处理渲染到页

      if (endTime - nowTime > 0) {
        // 如果活动未结束，对时间进行处理
        let time = (endTime - nowTime) / 1000; // 获取天、时、分、秒

        let day = parseInt(time / (60 * 60 * 24));
        let hou = parseInt(time % (60 * 60 * 24) / 3600);
        let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
        let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
        countDownObj = {
          day: `${this.timeFormat(day)}`,
          hou: `${this.timeFormat(hou)}`,
          min: `${this.timeFormat(min)}`,
          sec: `${this.timeFormat(sec)}`
        };
      } else {
        countDownObj = {
          day: '00',
          hou: '00',
          min: '00',
          sec: '00'
        };
        this.isEnd = true
      } // 渲染，然后每隔一秒执行一次倒计时函数


      this.setData({
        nowTime: nowTime + 1000,
        countDownObj: countDownObj,
        countDownObjTimer: setTimeout(this.countdown, 1000)
      });
    },

    // 小于10的格式化函数
    timeFormat(times) {
      return times < 10 ? '0' + times : times;
    },

    /**
     * 查看订单详情
     */
    toOrderDetailPage: function (e) {
      // uni.navigateTo({
      // 	url: '/pages/order-detail/order-detail?orderNum=' + e.currentTarget.dataset.ordernum
      // });
      this.$Router.push({
        path: '/pages/order-detail/order-detail', query: { orderNum: e.currentTarget.dataset.ordernum }
      })
    },

    /**
     * 查看拼团团队
     */
    toGroupTempInfoPage: function (e) {
      this.setData({
        groupTeamId: e.currentTarget.dataset.groupteamid
      });
      util.checkAuthInfo(() => {
        uni.navigateTo({
          url: '/packageActivities/pages/spellMembersDetails/spellMembersDetails?groupTeamId=' + this.groupTeamId
        });
      });
    },
  }
};
</script>
<style>
@import "./spellGroupDetails.css";
</style>
