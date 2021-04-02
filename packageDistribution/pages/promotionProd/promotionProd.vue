<template>
	<view>
		<view class="promotionProd">
			<!-- 搜索框 -->
			<view class="pd-seach">
				<input type="text" :placeholder="i18n.enterProductName" confirm-type="search" @input="onProdNameInput" @confirm="onProdNameSearch"></input>
				<view class="pd-seach-icon">
					<image src="../../static/images/icon/sousuo.png"></image>
				</view>
			</view>

			<!--头部导航tab -->
			<view class="pd-tab">
				<view class="pd-tab-list">
					<!-- <view class="tab-item {{sort==0 && (orderBy==1?'down':'up')}}" bindtap='onTabTouch' data-sort='0'>佣金</view> -->
					<view :class="'tab-item ' + (sort==1 && (orderBy==1?'down':'up'))" @tap="onTabTouch" data-sort="1">{{i18n.newest}}</view>
					<view :class="'tab-item ' + (sort==2 && (orderBy==1?'down':'up'))" @tap="onTabTouch" data-sort="2">{{i18n.sales}}</view>
					<view :class="'tab-item ' + (sort==3 && (orderBy==1?'down':'up'))" @tap="onTabTouch" data-sort="3">{{i18n.price}}</view>
				</view>
			</view>

			<view class="pd-main">
				<!-- 商品项 -->
				<view class="pd-item" v-for="(item, index) in records" :key="index">
					<view class="pd-item-top">
						<view class="pd-item-left">
							<image :src="item.pic"></image>
						</view>
						<view class="pd-item-right">
							<view class="pd-item-tit">{{item.prodName}}</view>
							<view class="pd-item-price">
								<text>￥</text>{{wxs.toPrice(item.price)}}</view>
							<view class="pd-item-info">
								<text class="rate">{{i18n.expectedEarn}} {{item.awardNumber}}{{item.awardProportion==0?'%':i18n.yuan}}</text>
								<view class="pd-item-btm">
									<view class="btn" @tap="onShowShare" :data-prodid="item.prodId" :data-prodname="item.prodName" :data-pic="item.pic">{{i18n.shareIt}}</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 商品项 end -->
			</view>
			<view class="empty" v-if="records.length==0">{{emptyMsg}}</view>
			<view class="loading" v-if="totalPage>1">{{loadingMsg}}</view>
		</view>

		<!-- 分享弹窗 -->
		<view class="promo-share" v-if="shareShow">
			<view class="promo-main">
				<view class="promo-icons-close" @tap="closeEarn">
					<image src="../../../static/images/icon/close.png"></image>
				</view>
				<view class="promo-tit">
					<title>{{i18n.shareFriendsNow}}</title>
				</view>
				<view class="promo-desc">
					<text>{{i18n.shareFriendsTips1}}</text>
				</view>
				<view class="promo-icons">
					<!-- #ifdef H5  -->
					<button class="promo-img1" @tap="onShareWay" open-type="share" v-if="isWechat">
						<image src="../../../static/images/icon/weixin.png"></image>{{i18n.weChat}}
					</button>
					<!-- #endif -->
					<!-- #ifdef MP-WEIXIN  -->
					<button class="promo-img1" open-type="share" v-if="isWechat">
						<image src="../../../static/images/icon/weixin.png"></image>{{i18n.weChat}}
					</button>
					<!-- #endif -->
					<view class="promo-img1" @tap="genWeixinCode">
						<image src="../../../static/images/icon/erweima.png"></image>{{i18n.QRCode}}
					</view>
				</view>
			</view>
		</view>
		<!-- 分享弹窗 end -->

		<!-- 二维码弹窗 -->
		<view class="code-popup" v-if="wxCodeShow">
			<view class="code-main">
				<view class="close-v" @tap.stop="closeCodePopup">
					<image src="../../../static/images/icon/close.png" class="close-png"></image>
				</view>
				<view class="code-v">
					<image :src="shareWxCode" class="wx-code"></image>
				</view>
				<!-- #ifndef H5 -->
				<view class="code-txt" @tap="downloadImg">{{i18n.saveAlbum}}</view>
				<!-- #endif -->
			</view>
		</view>
		<!-- 二维码弹窗 end -->

		<!-- 引导分享蒙版 -->
		<view class="guide-share-mask" v-if="guideShare">
			<view class="mask"></view>
			<view class="guide-content">
				<view class="close" @tap="guideShare=false">
					<image src="../../../static/images/icon/close.png"></image>
				</view>
				<view class="share-img">
					<image src="../../../static/images/icon/shareIcon.png"></image>
				</view>
				<view class="share-word">
					<view class="big-word">{{i18n.shareFriendsNow}}</view>
					<view class="small-word">{{i18n.shareFriendsTips2}}</view>
				</view>
			</view>
		</view>
		<!-- 引导分享蒙版 end -->
	</view>
</template>

<script module="wxs" lang="wxs" src="../../../wxs/number.wxs"></script>

<script>
	var http = require("../../../utils/http.js");
	var config = require("../../../utils/config.js");
	var Qr = require('../../../utils/wxqrcode.js')
	import Wechat from "../../../utils/wechat.js";
	export default {
		data() {
			return {
				isWechat: false, //是否为微信环境
				records: [],
				shareShow: false,
				wxCodeShow: false,
				shareProdId: 0,
				shareProdName: "",
				sharePic: "",
				shareWxCode: "",
				//分享商品微信二维码
				// loadingMsg: "正在加载..",
				loadingMsg: "",
				emptyMsg: "",
				totalPage: 1,
				pageNum: 1,
				prodName: "",
				//搜索的名称
				orderBy: 1,
				//排序(0升序 1降序) 默认1
				sort: 1, //排序(0 佣金排序 1时间排序 2销量排序 3价格排序) 默认1
				path: '', // 链接
				guideShare: false, // 引导蒙版
			};
		},

		components: {},
		props: {},
		
		computed:{
			i18n() {
				return this.$t('index')
			}
		},
		
		onShow: function () {
			  //头部导航标题
			  uni.setNavigationBarTitle({
			      title:this.i18n.promoteGoods
			  });
			  
			  this.loadingMsg = this.i18n.loading;
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			// #ifdef H5
			this.isWechat = Wechat.isWechat()
			// #endif
			// #ifdef APP-PLUS
			this.isWechat = false
			// #endif
			// #ifdef MP-WEIXIN
			this.isWechat = true
			// #endif
			uni.showLoading();
			this.loadPageData(1);
			this.getShareLink()
		},

		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function() {
			uni.showLoading();
			this.loadPageData(1);
		},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {
			if (this.pageNum < this.totalPage) {
				this.loadPageData(this.pageNum + 1);
			}
		},


		methods: {
			//加载分页数据
			loadPageData: function(pageNum) {
				var ths = this;
				http.request({
					url: "/api/v1/distribution/prod/page",
					method: "GET",
					data: {
						// shopId: 1,
						current: pageNum,
						orderBy: this.orderBy,
						prodName: this.prodName,
						size: 20,
						sort: this.sort
					},
					callBack: res => {
						uni.hideLoading()
						var records = [];
						if (res.current == 1) {
							records = res.records;
						} else {
							records = this.records.concat(res.records);
						}
						var loadingMsg = this.loadingMsg;
						if (pageNum == res.pages) {
							loadingMsg = ths.i18n.noMore;
						}
						ths.setData({
							records: records,
							totalPage: res.pages,
							pageNum: pageNum,
							loadingMsg: loadingMsg,
							emptyMsg: ths.i18n.noPromotionProduct
						});
					}
				});
			},

			/**
			 * 点击导航菜单
			 */
			onTabTouch: function(e) {
				var sort = e.currentTarget.dataset.sort;

				if (sort == this.sort) {
					this.setData({
						orderBy: this.orderBy == 0 ? 1 : 0
					});
					uni.showLoading();
					this.loadPageData(1);
				} else {
					this.setData({
						sort: sort,
						orderBy: 1
					});
					uni.showLoading();
					this.loadPageData(1);
				}
			},

			/**
			 * 名称输入
			 */
			onProdNameInput: function(e) {
				this.setData({
					prodName: e.detail.value.trim()
				});
			},

			/**
			 * 搜索
			 */
			onProdNameSearch: function() {
				uni.showLoading();
				// 判断搜索框是否为空
				// if (!this.prodName.trim()) {
				// 	uni.showToast({
				// 		title: this.i18n.inpKeyWords,
				// 		icon: 'none',
				// 	})
				// 	return
				// }
				this.loadPageData(1);
			},


			/**
			 * 生成复制分享链接
			 */
			getShareLink: function() {
				//从缓存获取分销员卡号，如果没有则去接口获取，以备转发时使用
				var cardno = wx.getStorageSync("distCardNo");
				if (!cardno) {
					http.request({
						url: "/api/v1/distribution/user/distributionUserInfo",
						method: "GET",
						callBack: res => {
							wx.setStorageSync("distCardNo", res.cardNo);
						}
					});
				}
				this.path = '/pages/prod/prod?prodid=' + this.shareProdId + '&cardno=' + cardno
			},

			/**
			 * 显示分享弹窗
			 */
			onShowShare: function(e) {
				var prodId = e.currentTarget.dataset.prodid;
				var prodName = e.currentTarget.dataset.prodname;
				var pic = e.currentTarget.dataset.pic;
				this.setData({
					shareShow: true,
					shareProdId: prodId,
					shareProdName: prodName,
					sharePic: pic
				});
				this.getShareLink()
				//从缓存获取分销员卡号，如果没有则去接口获取，以备转发时使用
				var cardno = wx.getStorageSync("distCardNo");
				if (!cardno) {
					http.request({
						url: "/api/v1/distribution/user/distributionUserInfo",
						method: "GET",
						callBack: res => {
							wx.setStorageSync("distCardNo", res.cardNo);
						}
					});
				}
			},

			/**
			 * 关闭分享弹窗
			 */
			closeEarn: function() {
				this.setData({
					shareShow: false
				});
			},


			/**
			 * 用户点击分享到微信小程序
			 * @param {Object} sharedata 支付需要的参数
			 * @param {Object} cb 成功回调
			 * @param {Object} errorCb 失败回调
			 */
			onShareWay() {
				var cardno = wx.getStorageSync("distCardNo");
				var sharedata = {
					title: this.shareProdName, // 分享标题
					imgUrl: this.sharePic, // 分享图标
					link: config.domain.replace('/api','') + '/pages/prod/prod?prodid=' + this.shareProdId + '&cardno=' + cardno, // 分享链接
					// path: '/pages/prod/prod?prodid=' + this.shareProdId + '&cardno=' + cardno,
					desc: this.i18n.shartTips, // 分享描述
					type: '', // 分享类型,music、video或link，不填默认为link
					dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
				};
				Wechat.callWexinShare(sharedata, () => {
					this.shareShow = false
					this.guideShare = true
				}, (failMsg) => {
					console.log('shareFailMsg',failMsg)
				})
			},

			/**
			 * 用户点击转发
			 */
			onShareAppMessage: function(res) {
				if (res.from === 'button') {
					var cardno = uni.getStorageSync("distCardNo");
					return {
						title: this.shareProdName,
						path: '/pages/prod/prod?prodid=' + this.shareProdId + '&cardno=' + cardno + '&type=' + this.shareType,
						imageUrl: this.sharePic,
						success: function(res) {
							// 转发成功
						},
						fail: function(res) {
							// 转发失败
						}
					}
				}
			},



			/**
			 * 生成小程序二维码
			 */
			genWeixinCode() {
				uni.showLoading({
					mask: true
				});
				var cardNo = wx.getStorageSync("distCardNo");
				var content = JSON.stringify({
					shareProdId: this.shareProdId,
					cardNo: cardNo
				});
				http.request({
					url: "/qrcodeTicket/miniQrCode",
					method: "GET",
					responseType: 'arraybuffer',
					data: {
						content: content,
						type: 2
					},
					callBack: res => {
						// 微信小程序

						// #ifdef MP-WEIXIN
						this.setData({
						wxCodeShow: true,
						shareShow: false,
						shareWxCode: "data:image/jpg;base64," + wx.arrayBufferToBase64(res)
						});
						uni.hideLoading();
						// #endif
						
						// #ifdef H5 || APP-PLUS
						cardNo = uni.getStorageSync("distCardNo");
						let code =`${config.domain.replace('\/api','')}/pages/prod/prod?prodid=${this.shareProdId}&cardno=${cardNo}`
						this.shareWxCode = Qr.createQrCodeImg(code, {size: 250});
						console.log(code);
						this.wxCodeShow = true;
						this.shareShow = false
						uni.hideLoading();
						// #endif
					}
				});
			},

			/**
			 * 关闭 弹窗
			 */
			closeCodePopup() {
				this.setData({
					wxCodeShow: false
				});
			},

			/**
			 * 保存图片至相册
			 */
			downloadImg() {
				var ths = this
				uni.showLoading({
					mask: true
				});
				var cardno = wx.getStorageSync("distCardNo");
				wx.downloadFile({
					header: {
						'Authorization': wx.getStorageSync('token')
					},
					url: config.domain + "/api/v1/distribution/qrCode/invitation?page=pages/prod/prod&scene=" + this.shareProdId + ',' +
						cardno,
					success: function(res) {
						uni.hideLoading()
						//图片保存到本地
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: function(data) {
								uni.showToast({
									title: ths.i18n.downloadComplete,
									icon: 'none',
									duration: 2000
								});
							},
							fail: function(err) {
								wx.openSetting({
									success(settingdata) {
										if (settingdata.authSetting['scope.writePhotosAlbum']) {
											uni.showToast({
												title: ths.i18n.failedSave,
												icon: 'success',
												duration: 2000
											});
										} else {
											uni.showToast({
												title: ths.i18n.failedSaveTips,
												icon: 'success',
												duration: 2000
											});
										}
									}

								});
							},

							complete(res) {}

						});
					}
				});
			}

		}
	};
</script>
<style>
	@import "./promotionProd.css";
</style>
