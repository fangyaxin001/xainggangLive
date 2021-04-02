<template>
	<view class="recharge-container">
		<u-navbar title="我的錢包" :background="{background:'#191129'}" title-color="#ffffff" :border-bottom="false"
		 back-icon-color="#ffffff"></u-navbar>
		<view class="">
			<!-- swiper -->
			<swiper class="swiper" :current="currentSwiper" :indicator-dots="indicatorDots" :autoplay="autoplay" circular="true"
			 :vertical="vertical" @change="swiperChange" :interval="interval" :duration="duration">
				<block v-for="(item,index) in rechargeList" :key="index">
					<swiper-item class="banner-item">
						<view class="img-box">
							<!-- <image src="/static/images/icon/label.png" class="label"></image> -->
							<image style="height: 367.83rpx;" src="../../static/images/proneler/vip-img.png" class="banner" />
							<view class="item-content">
								<view class="lt">
									<view class="amount">11港幣</view>
									<view class="w-num">
										<view class="">
											<image style="width: 24rpx;height: 22rpx;" src="../../static/images/proneler/vv.png" mode=""></image>
										</view>
										<view style="margin-left: 10rpx; color: #FFFFFF;">
											充值100元 送100積分
										</view>
									</view>
									<view style="color: #FFFFFF;margin-top: 30rpx; font-size: 23rpx;">
										1張優惠劵
									</view>
								</view>
							</view>
						</view> 
		<!-- </view> -->
		</swiper-item>
		</block>
		</swiper>
		<!--  实现点击选中样式  -->
		<view class="dots "> 
				<view v-for="(item,idx) in rechargeList" :key="idx" class="dot-item" :data-current="idx" @tap="swichNav">
					<view class="dot-txt">{{item.rechargeAmount +"港幣"}}</view>
					<view :class="['dot', idx == currentSwiper ? ' active' : '']"></view>
				</view> 
		</view>
	</view>
	<!-- end swiper -->

	<!-- <view class="pay">
      <view class="payment-txt">支付方式</view>
      <view class="payment-sel">
        <radio-group for="">
          <view class="select-item">
            <view class="payment">
              <image src="/static/images/icon/weixin.png"></image>
              <text>微信支付</text>
            </view>
            <label for="">
              <radio></radio>
            </label>
          </view>
          <view class="select-item">
            <view class="payment">
              <image src="/static/images/icon/alipay.png"></image>
              <text>支付宝支付</text>
            </view>
            <label for="">
              <radio></radio>
            </label>
          </view>
        </radio-group>
      </view>
    </view> -->

	<view class="ways">
		<view class="payment-txt">支付方式</view>
		<radio-group @change="handlePayTypeChange">
			<!-- #ifdef H5 -->
			<label>
				<!-- ALIPAY_H5: 6, 支付宝H5支付 -->
				<view class="item" @tap="payType = PayTypeConstant.ALIPAY_H5" v-if="!isWechat">
					<view class="pay-name">
						<view class="img">
							<image src="../../static/images/proneler/credit-cart.png" mode=""></image>
						</view>
						<view class="name">信用卡</view>
					</view>
					<view class="check">
						<radio :checked="payType==PayTypeConstant.ALIPAY_H5"></radio>
					</view>
				</view>
			</label>
			<label>
				<!-- ALIPAY_H5: 6, 支付宝H5支付 -->
				<view class="item" @tap="payType = PayTypeConstant.ALIPAY_H5" v-if="!isWechat">
					<view class="pay-name">
						<view class="img">
							<image src="../../static/images/icon/alipay.png" mode=""></image>
						</view>
						<view class="name">Alipay</view>
					</view>
					<view class="check">
						<radio :checked="payType==PayTypeConstant.ALIPAY_H5"></radio>
					</view>
				</view>
			</label>
			<label>
				<!-- WECHATPAY_H5: 4, 微信H5支付 -->
				<view class="item" @tap="payType = PayTypeConstant.WECHATPAY_H5" v-if="!isWechat && !isAli">
					<view class="pay-name">
						<view class="img">
							<image src="../../static/images/proneler/shu-cart.png" mode=""></image>
						</view>
						<view class="name">數轉快</view>
					</view>
					<view class="check">
						<radio :checked="payType==PayTypeConstant.WECHATPAY_H5"></radio>
					</view>
				</view>
			</label>
			<label>
				<!-- WECHATPAY_MP: 5, 微信公众号支付 -->
				<view class="item" @tap="payType = PayTypeConstant.WECHATPAY_MP" v-if="isWechat && !isAli">
					<view class="pay-name">
						<view class="img">
							<image src="../../static/images/icon/wxpay.png" mode=""></image>
						</view>
						<view class="name">{{i18n.payWithWeChat}}</view>
					</view>
					<view class="check">
						<radio :checked="payType==PayTypeConstant.WECHATPAY_MP"></radio>
					</view>
				</view>
			</label>
			<!-- <view class="item" >
					<view class="pay-name">
						<view class="img"><image src="../../static/images/icon/unionpay.png" mode=""></image></view>
						<view class="name">银行卡快捷支付</view>
					</view>
					<view class="check">
						<radio></radio>
					</view>
				</view> -->
			<!-- #endif -->

			<!-- #ifdef APP-PLUS -->
			<label>
				<!-- ALIPAY_APP: 7, 支付宝APP支付 -->
				<view class="item" @tap="payType = PayTypeConstant.ALIPAY_APP">
					<view class="pay-name">
						<view class="img">
							<image src="../../static/images/icon/alipay.png" mode=""></image>
						</view>
						<view class="name">{{i18n.PayWithAli}}</view>
					</view>
					<view class="check">
						<radio :checked="payType==PayTypeConstant.ALIPAY_APP"></radio>
					</view>
				</view>
			</label>

			<label>
				<!-- WECHATPAY_APP: 8, 微信APP支付 -->
				<view class="item" @tap="payType = PayTypeConstant.WECHATPAY_APP">
					<view class="pay-name">
						<view class="img">
							<image src="../../static/images/icon/wxpay.png" mode=""></image>
						</view>
						<view class="name">{{i18n.payWithWeChat}}</view>
					</view>
					<view class="check">
						<radio :checked="payType==PayTypeConstant.WECHATPAY_APP"></radio>
					</view>
				</view>
			</label>
			<!-- #endif -->

			<!-- #ifdef MP-WEIXIN -->
			<label>
				<!-- WECHATPAY: 1, 小程序支付 -->
				<view class="item" @tap="payType = PayTypeConstant.WECHATPAY">
					<view class="pay-name">
						<view class="img">
							<image src="../../static/images/icon/wxpay.png" mode=""></image>
						</view>
						<view class="name">{{i18n.payWithWeChat}}</view>
					</view>
					<view class="check">
						<radio :checked="payType==PayTypeConstant.WECHATPAY"></radio>
					</view>
				</view>
			</label>
			<!-- #endif -->
		</radio-group>
	</view>

	<view class="btn-box">
		<view class="btn" @tap="toPay">{{"需要支付" + amount + i18n.yuan}}</view>
	</view>

	</view>
</template>

<script>
	var http = require("../../utils/http.js");
	import {
		PayType,
		AppType
	} from "../../utils/constant.js";
	import config from "../../utils/config.js";
	import Wechat from "../../utils/wechat.js";
	import Pay from "../../utils/pay.js";
	import util from "../../utils/util.js";
	export default {
		data() {
			return {
				isWechat: false, //是否为微信环境
				payType: PayType.ALIPAY_H5, //支付类型，默认支付宝
				PayTypeConstant: PayType, //支付类型常量
				indicatorDots: false, //  是否显示面板指示点
				autoplay: false, // 是否自动切换
				circular: true, // 是否采用衔接滑动
				vertical: false, // 是否垂直衔接滑动
				interval: 4000, // 自动切换时间间隔
				duration: 200, // 滑动动画时长
				previousMargin: 20,
				nextMargin: 20,
				displayMultipleItems: 3,
				currentSwiper: 0,

				rechargeList: [], //充值数据列表
				picDomain: config.picDomain, //图片前缀
				amount: 0, // 选中金额
				isAli: false, // 是否支付宝H5环境内
			}
		},
		computed: {
			i18n() {
				return this.$t('index')
			}
		},

		onLoad: function() {
			// #ifdef H5
			this.isWechat = Wechat.isWechat()
			// #endif
			// #ifdef APP-PLUS
			this.isWechat = false
			this.payType = PayType.ALIPAY_APP
			// #endif
			// #ifdef MP-WEIXIN
			this.isWechat = false
			this.payType = PayType.WECHATPAY
			// #endif
			if (this.isWechat) {
				// 如果是微信环境打开h5,使用公众号支付
				this.payType = PayType.WECHATPAY_MP
			}

			this.isAli = uni.getStorageSync('appType') == AppType.ALI; // 是否支付宝内环境

			this.queryRechargeDataList() //获取充值数据列表
		},

		methods: {
			swiperChange: function(e) {
				this.currentSwiper = e.detail.current
				this.amount = this.rechargeList[this.currentSwiper].rechargeAmount // 改变轮播图选中金额
				this.balanceId = this.rechargeList[this.currentSwiper].balanceId // 改变轮播图选中充值id
			},
			/**
			 * 点击tab切换
			 */
			swichNav: function(e) {
				if (this.currentSwiper === e.currentTarget.dataset.current) {
					return false;
				} else {
					this.currentSwiper = e.currentTarget.dataset.current
				}
			},

			/**
			 * 获取充值数据列表
			 */
			queryRechargeDataList: function() {
				var params = {
					url: '/api/v1/userBalance/getList',
					method: 'GET',
					data: {},
					callBack: res => {
						this.rechargeList = res
						this.amount = this.rechargeList[0].rechargeAmount // 初始选中金额
						this.balanceId = this.rechargeList[0].balanceId // 初始选中充值id
					}
				};
				http.request(params)
			},


			/**
			 * 修改支付类型
			 */
			handlePayTypeChange(e) {
				console.log(this.PayTypeConstant.ALIPAY_H5)
			},

			// 去支付
			toPay: function() {
				console.log('payType:', this.payType, '；', 'balanceId:', this.balanceId)
				Pay.toOrderPay(this.payType, '', '', '', '', this.balanceId)
			}

		}
	}
</script>

<style scoped>
	@import "./rechargeBalance.css";
</style>
