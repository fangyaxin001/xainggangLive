var http = require('./http.js')
var Constant = require('./constant.js')
import Wechat from './wechat.js'

import i18n from '../main.js'

export default {

	/**
	 * 订单支付
	 * @param {Number} payType 支付类型;见util/constant.js
	 * @param {Strint} orderNumbers 订单编号
	 * @param {Boolean} isPurePoints 是否纯积分订单(积分+钱订单与普通订单一致)
	 * @param {Boolean} dvyType // 配送类型 1:快递 2:自提 3：无需快递 4:同城配送
	 * @param {Number/String} vipId 要购买的会员等级id
	 * @param {Number/String} balanceId 余额充值id
	 * @param {Number/String} orderType 订单类型 1团购 2秒杀
	 */
	toOrderPay (payType, orderNumbers, isPurePoints, dvyType, vipId, balanceId, orderType) {
		// console.log(payType, orderNumbers, isPurePoints, dvyType, vipId)
		console.log('(pay.js)balanceId：', balanceId)
		uni.showLoading({
			mask: true
		});
		// #ifdef H5
		var {
			protocol,
			host
		} = window.location
		if (balanceId) {
			var redirectUrl = `${protocol}//${host}` + '/pages/myWallet/myWallet'
		} else {
			var redirectUrl = `${protocol}//${host}` + '/pages/orderList/orderList?sts=0'
		}
		var commonOrderData = { // 常规订单请求参数
			payType: payType,
			orderNumbers: orderNumbers,
			returnUrl: redirectUrl
		}
		var buyVipOrderData = { // 购买vip订单请求参数
			id: vipId,
			scene: '',
			payType: payType
		}
		var rechargeBalanceData = { // 充值余额
			payType: payType,
			returnUrl: redirectUrl,
			id: balanceId,
			scene: ''
		}
		var params = {
			url: vipId ? "/api/v1/level/payLevel" : balanceId ? '/api/v1/balance/pay' : "/api/v1/order/pay",
			method: "POST",
			data: vipId ? buyVipOrderData : balanceId ? rechargeBalanceData : commonOrderData,
			callBack: function (res) {
				uni.hideLoading()
				// 积分订单: 纯积分 isPurePoints=1 或者 纯积分支付
				if (isPurePoints == 1 || payType == 0) {
					uni.redirectTo({
						url: '/pages/pay-result/pay-result?sts=1&orderNumbers=' + orderNumbers + '&orderType=' + orderType
					});
				} else {
					// 微信h5支付
					if (Constant.PayType.WECHATPAY_H5 == payType) {
						var url = encodeURIComponent(redirectUrl)
						window.location.href = res + "&redirect_url=" + url
						return;
					}
					// 微信公众号支付
					else if (Constant.PayType.WECHATPAY_MP == payType) {
						Wechat.callWexinPay(res, () => { //支付成功
							if (vipId || balanceId) {
								var url = '/pages/myWallet/myWallet';
								this.JumpOfDifferentOrders(vipId, balanceId, url)
								return
							}
							if (dvyType == 2) { // 自提
								uni.redirectTo({
									url: '/pages/paySuccess/paySuccess?sts=1&orderNumbers=' + orderNumbers + '&dvyType=' + dvyType,
								})
							} else {
								uni.redirectTo({
									url: '/pages/pay-result/pay-result?sts=1&orderNumbers=' + orderNumbers + '&payType=' + payType + '&orderType=' + orderType,
								})
							}
						}, () => { // 支付失败
							if (vipId) {
								uni.redirectTo({
									url: '/packageMemberIntegral/pages/buyVip/buyVip'
								})
								return
							}
							if (balanceId) {
								uni.redirectTo({
									url: '/pages/rechargeBalance/rechargeBalance'
								})
								return
							}
							uni.redirectTo({
								url: '/pages/pay-result/pay-result?sts=0&orderNumbers=' + orderNumbers + '&payType=' + payType + '&orderType=' + orderType,
							})
						})
					}
					//支付宝支付
					else if (Constant.PayType.ALIPAY_H5 == payType) {
						document.write(res)
						this.$nextTick(() => {
							document.forms[0].submit()
						})
					}
					// 余额支付
					else if (Constant.PayType.BALANCEPAY == payType && !vipId) {
						// type 1支付成功 2用户信息异常 3余额不足
						if (res.type == 1) {
							if (dvyType == 2) { // 自提
								uni.redirectTo({
									url: '/pages/paySuccess/paySuccess?sts=1&orderNumbers=' + orderNumbers + '&payType=' + payType + "&orderType=" + orderType,
								})
								return
							}
							uni.redirectTo({
								url: `/pages/pay-result/pay-result?sts=1&orderNumbers=${orderNumbers}&orderType=${orderType}`,
							})
						} else {
							uni.showToast({
								title: res.message,
								icon: 'none',
								duration: 1500
							})
						}
					}
					// 余额购买会员
					else if (Constant.PayType.BALANCEPAY == payType && vipId) {
						// type 1支付成功 2用户信息异常 3余额不足
						if (res.type == 1) {
							uni.showToast({
								title: i18n.t('index.purchaseSuccessful'),
								icon: 'none',
								duration: 1000
							})
							setTimeout(() => {
								uni.redirectTo({
									url: '/packageMemberIntegral/pages/buyVip/buyVip'
								})
							}, 1000)
						} else {
							uni.showToast({
								title: res.message,
								icon: 'none',
								duration: 1500
							})
						}
					}

				}
			},
			errCallBack: err => {
				uni.showModal({
					title: i18n.t('index.tips'),
					content: err.data,
					confirmText: i18n.t('index.confirm'),
					showCancel: false,
					success: errModSucc => {
						if (errModSucc.confirm) {
							uni.navigateTo({
								url: '/pages/orderList/orderList?sts=0'
							})
						}
					}
				})
			}
		};
		http.request(params);
		// #endif

		// #ifdef APP-PLUS
		var commonOrderData = { // 常规订单请求参数
			payType: payType,
			orderNumbers: orderNumbers,
		}
		var buyVipOrderData = { // 购买vip订单请求参数
			id: vipId,
			scene: '',
			payType: payType
		}
		var rechargeBalanceData = { // 充值余额
			payType: payType,
			returnUrl: '/pages/myWallet/myWallet',
			id: balanceId,
			scene: ''
		}
		var params = {
			url: vipId ? "/api/v1/level/payLevel" : balanceId ? '/api/v1/balance/pay' : "/api/v1/order/pay",
			method: "POST",
			data: vipId ? buyVipOrderData : balanceId ? rechargeBalanceData : commonOrderData,
			callBack: res => {
				uni.hideLoading()
				// 积分订单: 纯积分 isPurePoints=1 或者 纯积分支付
				if (isPurePoints == 1 || payType == 0) {
					uni.redirectTo({
						url: '/pages/pay-result/pay-result?sts=1&orderNumbers=' + orderNumbers + "&orderType=" + orderType
					})
				}// 余额支付
				else if (Constant.PayType.BALANCEPAY == payType && !vipId) {
					if (res.type == 1) {
						if (dvyType == 2) { // 自提
							uni.redirectTo({
								url: '/pages/paySuccess/paySuccess?sts=1&orderNumbers=' + orderNumbers + '&payType=' + payType + "&orderType=" + orderType,
							})
							return
						}
						uni.redirectTo({
							url: `/pages/pay-result/pay-result?sts=1&orderNumbers=${orderNumbers}&orderType=${orderType}`,
						})
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none',
							duration: 1500
						})
					}
					return
				}
				// 余额购买会员
				else if (Constant.PayType.BALANCEPAY == payType && vipId) {
					if (res.type == 1) {
						uni.showToast({
							title: i18n.t('index.purchaseSuccessful'),
							icon: 'none',
							duration: 1000
						})
						setTimeout(() => {
							uni.redirectTo({
								url: '/packageMemberIntegral/pages/buyVip/buyVip'
							})
						}, 1000)
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none',
							duration: 1500
						})
					}
				} else {
					var wxAppPayInfo = {}
					if (payType == Constant.PayType.WECHATPAY_APP) {
						wxAppPayInfo = {
							"sign": res.sign,
							"prepayid": res.prepayId,
							"partnerid": res.partnerId,
							"appid": res.appId,
							"timestamp": res.timeStamp,
							"noncestr": res.nonceStr,
							"package": res.packageValue
						}
					}
					uni.getProvider({
						service: 'payment',
						success: res1 => {
							console.log('payment')
							uni.requestPayment({
								provider: payType == Constant.PayType.WECHATPAY_APP ? 'wxpay' : 'alipay',
								orderInfo: payType == Constant.PayType.WECHATPAY_APP ? wxAppPayInfo : res,
								success: payMentSuss => {
									if (vipId || balanceId) {
										var url = '/pages/myWallet/myWallet';
										this.JumpOfDifferentOrders(vipId, balanceId, url)
									} else if (dvyType == 2) { // 自提
										uni.redirectTo({
											url: '/pages/paySuccess/paySuccess?sts=1&orderNumbers=' + orderNumbers + '&payType=' + payType + "&orderType=" + orderType,
										})
									} else {
										uni.redirectTo({
											url: '/pages/pay-result/pay-result?sts=1&orderNumbers=' + orderNumbers + '&payType=' + payType + "&orderType=" + orderType,
										})
									}
								},
								fail: (paymentFail) => {
									console.log(paymentFail)
									if (vipId) {
										uni.redirectTo({
											url: '/packageMemberIntegral/pages/buyVip/buyVip'
										})
										return
									}
									if (balanceId) {
										uni.redirectTo({
											url: '/pages/rechargeBalance/rechargeBalance'
										})
										return
									}
									uni.redirectTo({
										url: '/pages/pay-result/pay-result?sts=0&orderNumbers=' + orderNumbers + "&orderType=" + orderType,
									})
								}
							})
						},
						fail: (failRes) => {
							console.log('fail')
						}
					})
				}
			},
			errCallBack: err => {
				uni.showModal({
					title: i18n.t('index.tips'),
					content: err.data,
					confirmText: i18n.t('index.confirm'),
					showCancel: false,
					success: errModSucc => {
						if (errModSucc.confirm) {
							uni.navigateTo({
								url: '/pages/orderList/orderList?sts=0'
							})
						}
					}
				})
			}
		};
		http.request(params);
		// #endif

		// #ifdef MP-WEIXIN
		var commonOrderData = { // 常规订单请求参数
			payType: payType, //支付方式 (1:微信小程序支付)
			orderNumbers: orderNumbers,
		}
		var buyVipOrderData = { // 购买vip订单请求参数
			id: vipId,
			scene: '',
			payType: payType
		}
		var rechargeBalanceData = { // 充值余额
			payType: payType,
			returnUrl: '/pages/myWallet/myWallet',
			id: balanceId,
			scene: ''
		}
		var params = {
			url: vipId ? '/api/v1/level/payLevel' : balanceId ? '/api/v1/balance/pay' : '/api/v1/order/pay',
			method: "POST",
			data: vipId ? buyVipOrderData : balanceId ? rechargeBalanceData : commonOrderData,
			callBack: (res) => {
				uni.hideLoading();
				// 积分订单: 纯积分 isPurePoints=1 或者 纯积分支付
				if (isPurePoints == 1 || payType == 0) {
					uni.redirectTo({
						url: `/pages/pay-result/pay-result?sts=1&orderNumbers=${orderNumbers}&orderType=${orderType}`,
					})
					return
				}
				// 余额支付
				if (Constant.PayType.BALANCEPAY == payType && !vipId) {
					if (res.type == 1) {
						if (dvyType == 2) { // 自提
							uni.redirectTo({
								url: '/pages/paySuccess/paySuccess?sts=1&orderNumbers=' + orderNumbers + '&payType=' + payType + "&orderType=" + orderType,
							})
							return
						}
						uni.redirectTo({
							url: `/pages/pay-result/pay-result?sts=1&orderNumbers=${orderNumbers}&orderType=${orderType}`,
						})
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none',
							duration: 1500
						})
					}
					return
				}
				// 余额购买会员
				if (Constant.PayType.BALANCEPAY == payType && vipId) {
					if (res.type == 1) {
						uni.showToast({
							title: i18n.t('index.purchaseSuccessful'),
							icon: 'none',
							duration: 1000
						})
						setTimeout(() => {
							uni.redirectTo({
								url: '/packageMemberIntegral/pages/buyVip/buyVip'
							})
						}, 1000)
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none',
							duration: 1500
						})
					}
					return
				}
				wx.requestPayment({
					timeStamp: res.timeStamp,
					nonceStr: res.nonceStr,
					package: res.packageValue,
					signType: res.signType,
					paySign: res.paySign,
					success: e => {
						if (vipId || balanceId) {
							var url = '/pages/myWallet/myWallet';
							this.JumpOfDifferentOrders(vipId, balanceId, url)
						} else if (dvyType == 2) { // 自提
							uni.redirectTo({
								url: '/pages/paySuccess/paySuccess?sts=1&orderNumbers=' + orderNumbers + '&dvyType=' + dvyType,
							})
							return
						} else {
							wx.redirectTo({
								url: `/pages/pay-result/pay-result?sts=1&orderNumbers=${orderNumbers}&orderType=${orderType}`,
							})
						}

					},
					fail: err => {
						if (vipId) {
							uni.redirectTo({
								url: '/packageMemberIntegral/pages/buyVip/buyVip'
							})
							return
						}
						if (balanceId) {
							uni.redirectTo({
								url: '/pages/rechargeBalance/rechargeBalance'
							})
							return
						}
						wx.redirectTo({
							url: `/pages/pay-result/pay-result?sts=0&orderNumbers=${orderNumbers}&orderType=${orderType}`,
						})
					}
				})
			},
			errCallBack: err => {
				uni.showModal({
					title: i18n.t('index.tips'),
					content: err.data,
					confirmText: i18n.t('index.confirm'),
					showCancel: false,
					success: errModSucc => {
						if (errModSucc.confirm) {
							uni.navigateTo({
								url: '/pages/orderList/orderList?sts=0'
							})
						}
					}
				})
			}
		};
		http.request(params);
		// #endif
	},

	JumpOfDifferentOrders: function (vipId, balanceId, url) {
		if (vipId) {
			// 购买会员
			uni.redirectTo({
				url: '/packageMemberIntegral/pages/buyVip/buyVip',
			})
			return
		}
		if (balanceId) {
			uni.redirectTo({
				url: url,
			})
			return
		}
	},

	/**
	 * 唤起支付
	 * @param {Object} paydata 支付需要的参数
	 * @param {Object} cb 成功回调
	 * @param {Object} errorCb 失败回调
	 */
	toPay ({
		payType,
		redirectPage,
		paydata,
		cb,
		errorCb
	}) {
		if (Constant.PayType.WECHATPAY_H5 == payType) {
			var redirectUrl = ''
			if (!redirectPage) {
				redirectUrl = window.location.href
			} else {
				var {
					protocol,
					host
				} = window.location
				redirectUrl = `${protocol}//${host}` + redirectPage
			}

			var url = encodeURIComponent(redirectUrl)
			window.location.href = paydata + "&redirect_url=" + url
		}
		// 微信公众号支付
		else if (Constant.PayType.WECHATPAY_MP == payType) {
			Wechat.callWexinPay(paydata, cb, errorCb)
		}
	},
}
