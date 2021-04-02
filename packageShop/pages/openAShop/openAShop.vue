<template>
	<!-- 申请开店 -->
	<!--pages/openAShop/openAShop.wxml-->

	<view class="apple-for-ashop">
		<view v-if="auditRemarks" class="audit-remark">{{i18n.auditFailure}}：{{auditRemarks}}</view>
		<!-- 店铺信息 -->
		<form class="msg-box">
			<view class="msg-tit">
				<view class="shop-icon">
					<image src="/static/images/icon/shop-icon.png"></image>
				</view>
				<view class="shop-msg-tit">{{i18n.storeInformation}}</view>
			</view>
			<!-- 店铺名称 -->
			<view class="msg-cont-box">
				<label class="cont-txt">
					<text class="red">*</text>{{i18n.storeName}}</label>
				<input type="text" class="cont-int" @input="bindShopNameInt" :value="shopNameValue" maxlength="20" :placeholder="i18n.shopNameTips"></input>
			</view>

			<!-- 店铺描述 -->
			<view class="msg-cont-box">
				<label class="cont-txt align-top">
					<text class="red">*</text>{{i18n.shopDescription}}</label>
				<textarea type="text" @input="bindShopDescribeInt" :value="shopDescribeValue" class="cont-int cont-textarea"
				 maxlength="200" :placeholder="i18n.shopDescriptionTips"></textarea>
			</view>
			<!-- logo -->
			<view class="msg-cont-box">
				<label class="cont-txt">
					<text class="red">*</text>{{i18n.shopLogo}}</label>
				<!-- 上传文件 -->
				<view class="upload-files align-top">
					<view class="upload-tips">{{i18n.upShopLogo}}</view>
					<!-- 预览图片 -->
					<view class="preview-img-box preview-logo" v-if="logoImg.url">
						<image class="preview-img" :src="logoImg.url" mode="aspectFill"></image>
						<!-- 删除 -->
						<image @tap="removeImage" class="preview-img-del" data-type="logoImg" src="/static/images/icon/close2.png"></image>
					</view>
					<!-- 上传 -->
					<view class="upload-icon upload-logo" v-if="!logoImg.url" @tap="getUploadImg" data-type="logoImg">+</view>
				</view>
				<!-- 上传文件end -->
			</view>

			<!-- 店铺地址 -->
			<view class="msg-cont-box addr" @tap="translate">
				<label class="cont-txt">
					<text class="red">*</text>{{i18n.area}}</label>
				<!-- 展示 -->
				<view class="pca">{{province}} {{city}} {{area}}</view>
				<!-- <view class="pca">广东省 广州市 番禺区</view> -->
				<view class="arrow">
					<image src="/static/images/icon/more.png"></image>
				</view>
				<!-- 弹框 -->
				<view class="animation-element-wrapper" :animation="animation" :style="'visibility:' + (show ? 'visible':'hidden')"
				 @tap.stop="hiddenFloatView">
					<view class="animation-element" @tap.stop="nono">
						<text class="right-bt" @tap.stop="hiddenFloatView">{{i18n.confirm}}</text>
						<view class="line"></view>
						<picker-view indicator-style="height: 50rpx;" :value="value" @change="bindChange" @tap.stop="nono">
							<!--省-->
							<picker-view-column>
								<view v-for="(item, index) in provArray" :key="index">{{item.areaName}}</view>
							</picker-view-column>
							<!--地级市-->
							<picker-view-column>
								<view v-for="(item, index) in cityArray" :key="index">{{item.areaName}}</view>
							</picker-view-column>
							<!--区县-->
							<picker-view-column>
								<view v-for="(item, index) in areaArray" :key="index">{{item.areaName}}</view>
							</picker-view-column>
						</picker-view>
					</view>
				</view>

			</view>

			<!-- 详细地址 -->
			<view class="msg-cont-box">
				<label class="cont-txt">
					<text class="red">*</text>{{i18n.detailedAddress}}</label>
				<input type="text" @input="bindShopAddrInt" :value="shopAddrValue" class="cont-int" :placeholder="i18n.detailedAddress"></input>
			</view>

			<!-- 经纬度(调用微信地图获取) -->
			<view class="msg-cont-box wx-map clearfix">
				<view class="cont-txt">
					<text class="red">*</text>{{i18n.location}}</view>
				<!-- <view class="show-location" wx:if="{{latitude}}">{{'纬度:' + latitude + ' 经度:' + longitude}}</view> -->
				<view class="show-location" v-if="latitude">
					<view>{{i18n.latitude + latitude}}</view>
					<view>{{i18n.longitude + longitude}}</view>
				</view>
				<view class="map" @tap="chooseLocation">{{i18n.getLocation}}</view>
			</view>

			<!-- 店铺联系电话 -->
			<view class="msg-cont-box">
				<text class="cont-txt" space="emsp"><text class="red">*</text>{{i18n.shopPhone}}</text>
				<input type="number" @input="bindShopOwnerPhoneInt" :value="shopOwnerPhoneValue" class="cont-int" maxlength="11"
				 :placeholder="i18n.shopPhoneTips"></input>
			</view>

			<!-- 店铺营业执照(选填) -->
			<view class="msg-cont-box">
				<label class="cont-txt"><text class="red">*</text>{{i18n.businessLicense}}</label>
				<view class="upload-files">
					<view class="upload-tips">{{i18n.upBusinessLicense}}</view>
					<!-- 预览图片 -->
					<view class="preview-img-box" v-if="bussLicenImg.url">
						<image class="preview-img" :src="bussLicenImg.url" mode="aspectFill"></image>
						<!-- 删除 -->
						<image @tap="removeImage" class="preview-img-del" data-type="bussLicenImg" src="/static/images/icon/close2.png"></image>
					</view>
					<!-- 上传 -->
					<view class="upload-icon" v-if="!bussLicenImg.url" @tap="getUploadImg" data-type="bussLicenImg">+</view>
				</view>
			</view>

			<!-- 申请人身份证正反面 -->
			<view class="msg-cont-box">
				<text class="cont-txt" space="emsp"><text class="red">*</text>{{i18n.ID}}</text>
				<view class="upload-files">
					<view class="upload-tips">{{i18n.upBothIDCard}}</view>
					<!-- 正面预览图片 -->
					<view class="card-upload">
						<view class="preview-img-box" v-if="idcardFrontImg.url">
							<image class="preview-img" :src="idcardFrontImg.url" mode="aspectFill"></image>
							<!-- 删除 -->
							<image @tap="removeImage" class="preview-img-del" data-type="idcardFrontImg" src="/static/images/icon/close2.png"></image>
						</view>
						<!-- 上传 -->
						<view class="upload-icon" v-if="!idcardFrontImg.url" @tap="getUploadImg" data-type="idcardFrontImg">+</view>
						<view class="card-txt">{{i18n.positive}}</view>
					</view>

					<!-- 反面预览图片 -->
					<view class="card-upload">
						<view class="preview-img-box" v-if="idcardBackImg.url">
							<image class="preview-img" :src="idcardBackImg.url" mode="aspectFill"></image>
							<!-- 删除 -->
							<image @tap="removeImage" class="preview-img-del" data-type="idcardBackImg" src="/static/images/icon/close2.png"></image>
						</view>
						<!-- 上传 -->
						<view class="upload-icon" v-if="!idcardBackImg.url" @tap="getUploadImg" data-type="idcardBackImg">+</view>
						<view class="card-txt">{{i18n.Negative}}</view>
					</view>

				</view>
			</view>

		</form>


		<!-- 申请人信息 -->
		<!-- <form class="msg-box">
    <view class="msg-tit">
      <view class="shop-icon"><image src="../../images/icon/user-icon.png"></image></view>
      <view class="shop-msg-tit">店主信息</view>
    </view> -->
		<!-- 申请人姓名 -->
		<!-- <view class="msg-cont-box">
      <text class="cont-txt"space="emsp"><text class="red">*</text>姓  名</text>
      <input type="text" bindinput="bindShopOwnerInt" class="cont-int" placeholder="请填写申请人姓名"></input>
    </view> -->

		<!-- </form> -->



		<!-- 提交申请 -->
		<view class="apply-btn">
			<view class="btn" @tap="submitApply">{{i18n.submitApplication}}</view>
			<view class="foot-tips">
				<text class="red">*</text>{{i18n.submitApplicationTips}}</view>
		</view>

	</view>
</template>

<script>
	// pages/openAShop/openAShop.js
	var http = require("../../../utils/http.js");
	var config = require("../../../utils/config.js");
	var util = require("../../../utils/util.js");
	var index = [18, 0, 0];
	var t = 0;
	var show = false;
	var moveY = 200;

	export default {
		data() {
			return {
				logoImg: {},
				idcardFrontImg: {},
				idcardBackImg: {},
				bussLicenImg: {},
				value: [0, 0, 0],
				provArray: [],
				cityArray: [],
				areaArray: [],
				province: "",
				city: "",
				area: "",
				provinceId: 0,
				cityId: 0,
				areaId: 0,
				latitude: '',
				//经度
				longitude: '',
				//纬度
				mapAddress: '',
				//地图定位详细地址
				mapAddrName: '',
				//地图上的地址名称
				shopNameValue: '',
				//店铺名字
				shopDescribeValue: '',
				//店铺描述
				shopAddrValue: '',
				//详细地址
				shopOwnerValue: '',
				//店主姓名
				shopOwnerPhoneValue: '',
				//店主联系电话
				auditRemarks: "",
				animation: "",
				show: ""
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
		onLoad: function(options) {
			if (options.shopAuditStatus == -1) {
				uni.showModal({
					title: this.i18n.tips,
					content: this.i18n.auditFailureTips,
					cancelText: this.i18n.cancel,
					confirmText: this.i18n.confirm,
					success: (res) => {
						if (res.confirm) {
							uni.showLoading();
							var params = {
								url: "/api/v1/shop",
								method: "GET",
								data: {},
								callBack: (res) => {
									uni.hideLoading()
									this.setData({
										logoImg: {
											url: res.shopLogo,
											path: res.shopLogo.replace(config.picDomain,'')
										},
										idcardFrontImg: {
											url: res.identityCardFront,
											path: res.identityCardFront.replace(config.picDomain,'')
										},
										idcardBackImg: {
											url: res.identityCardLater,
											path: res.identityCardLater.replace(config.picDomain,'')
										},
										bussLicenImg: {
											url: res.businessLicense,
											path: res.businessLicense.replace(config.picDomain,'')
										},
										province: res.province,
										city: res.city,
										area: res.area,
										provinceId: res.provinceId,
										cityId: res.cityId,
										areaId: res.areaId,
										latitude: res.shopLat,
										longitude: res.shopLng,
										shopNameValue: res.shopName, //店铺名字
										shopDescribeValue: res.intro, //店铺描述
										shopAddrValue: res.shopAddress, //详细地址
										shopOwnerPhoneValue: res.tel
									});
									this.initCityData(this.provinceId, this.cityId, this.areaId);
									this.getAuditMsg();
								}
							}
						} else if (res.cancel) {
							console.log('用户点击取消')
							// uni.switchTab({
							// 	url: '/pages/user/user',
							// })
							this.$Router.pushTab('/pages/user/user')
						}
						http.request(params);
					}
				})
			} else {
				this.initCityData(this.provinceId, this.cityId, this.areaId);
			}
		},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {
			// 底部弹框动画
			this.animation = wx.createAnimation({
				transformOrigin: "50% 50%",
				duration: 0,
				timingFunction: "ease",
				delay: 0
			});
			this.animation.translateY(200 + 'vh').step();
			this.setData({
				animation: this.animation.export(),
				show: show
			});
		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			//头部导航标题
			uni.setNavigationBarTitle({
				title: this.i18n.applyOpenShop
			});
		},

		/**
		 * 生命周期函数--监听页面隐藏
		 */
		onHide: function() {},

		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function() {},

		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function() {},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {},

		// 特殊字符


		methods: {
			/**
			 * 请求接口传数据
			 */
			submitApply: function() {
				// 店铺名称不能有特殊字符
				if (this.shopNameValue.trim().length < 2 || this.shopNameValue.trim().length > 20 ||
					/[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/im.test(this.shopNameValue)) {
					uni.showToast({
						title: this.i18n.enterCorrectStore,
						icon: "none"
					});
				} else if (this.shopDescribeValue.trim().length < 10 || this.shopDescribeValue.trim().length > 200) {
					uni.showToast({
						title: this.i18n.shopDescriptionTips2,
						icon: "none"
					});
				} else if (!this.logoImg.path) {
					uni.showToast({
						title: this.i18n.upShopLogoTips,
						icon: "none"
					});
				} else if (this.shopAddrValue.trim().length < 5) {
					uni.showToast({
						title: this.i18n.enterCorrectAddress,
						icon: "none"
					});
				} else if (this.latitude == '') {
					uni.showToast({
						title: this.i18n.locationTips,
						icon: "none"
					});
					// 电话号码验证
				} else if (!util.checkPhoneNumber(this.shopOwnerPhoneValue)) {
					uni.showToast({
						title: this.i18n.enterCorrectPhone,
						icon: "none"
					});
				} else if (!this.bussLicenImg.path) {
					uni.showToast({
						title: this.i18n.upBusinessLicenseTips,
						icon: "none"
					});
				} else if (!this.idcardFrontImg.path || !this.idcardBackImg.path) {
					uni.showToast({
						title: this.i18n.upBothIDCardTips,
						icon: "none"
					});
				} else {
					uni.showLoading();
					var params = {
						url: "/api/v1/shop/apply",
						method: "POST",
						data: {
							"area": this.area,
							"areaId": this.areaId,
							"businessLicense": this.bussLicenImg.path,
							"city": this.city,
							"cityId": this.cityId,
							"identityCardFront": this.idcardFrontImg.path,
							"identityCardLater": this.idcardBackImg.path,
							"intro": this.shopDescribeValue.trim(),
							"province": this.province,
							"provinceId": this.provinceId,
							"shopAddress": this.shopAddrValue,
							"shopLogo": this.logoImg.path,
							"shopName": this.shopNameValue.trim(),
							"shopPhotos": "",
							"tel": this.shopOwnerPhoneValue.trim(),
							"shopLat": this.latitude,
							"shopLng": this.longitude
						},
						callBack: (res) => {
							uni.hideLoading()
							uni.showModal({
								title: this.i18n.submittedSuccessfully,
								content: '',
								showCancel: false,
								cancelText: this.i18n.cancel,
								confirmText: this.i18n.confirm,
								success: () => {
									// uni.switchTab({
									// 	url: '/pages/user/user'
									// });
									this.$Router.pushTab('/pages/user/user')
								}
							});
						}
					};
					http.request(params);
				}
			},

			getAuditMsg() {
				http.request({
					url: "/api/v1/shop/shopAudit",
					method: "GET",
					data: {},
					callBack: res => {
						this.setData({
							auditRemarks: res.remarks
						});
					}
				});
			},

			
			/**
			 * 获取经纬度
			 */
			chooseLocation: function(e) {
				var that = this;
				uni.chooseLocation({
					success: function(res) {
						console.log('succes1');
						console.log(res);
						that.setMapData(res);
					},
					fail: function() {
						wx.getSetting({
							success(res) {
								if (!res.authSetting['scope.userLocation']) {
									console.log("f1");
									wx.authorize({
										scope: 'scope.userLocation',

										success() {
											uni.chooseLocation({
												success: function(res) {
													that.setMapData(res);
												}
											});
											console.log('success2');
										},
										fail() {
											uni.showToast({
												title: this.i18n.authorityTips,
												icon: 'none'
											});
										}

									});
								}
							}

						});
					}
				});
			},

			setMapData(res) {
				var latitude = res.latitude;
				var longitude = res.longitude;
				var address = res.address;
				var name = res.name;
				this.setData({
					latitude: latitude,
					longitude: longitude,
					mapAddress: address,
					mapAddrName: name
				});
			},

			/**
			 * 获取input数据
			 */
			bindShopNameInt: function(e) {
				this.setData({
					shopNameValue: e.detail.value
				});
			},
			bindShopDescribeInt: function(e) {
				this.setData({
					shopDescribeValue: e.detail.value
				});
			},
			bindShopAddrInt: function(e) {
				this.setData({
					shopAddrValue: e.detail.value
				});
			},
			bindShopOwnerInt: function(e) {
				this.setData({
					shopOwnerValue: e.detail.value
				});
			},
			bindShopOwnerPhoneInt: function(e) {
				this.setData({
					shopOwnerPhoneValue: e.detail.value
				});
			},

			/**
			 * 上传图片
			 */
			getUploadImg: function(e) {
				const type = e.target.dataset.type;
				console.log(type);
				var ths = this;
				wx.chooseImage({
					count: 1, // 默认9
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: function(res) {
						// 图片的本地临时文件路径列表
						var tempFilePaths = res.tempFilePaths;
						uni.showLoading({
							mask: true
						});
						var params = {
							url: "/api/v1/file/upload",
							filePath: tempFilePaths[0],
							name: 'file',
							callBack: function(res2) {
								uni.hideLoading()
								var img = {};
								img.path = JSON.parse(res2).filePath;
								img.url = JSON.parse(res2).resourcesUrl + JSON.parse(res2).filePath;

								if (type == 'bussLicenImg') {
									ths.setData({
										bussLicenImg: img
									});
								} else if (type == 'logoImg') {
									ths.setData({
										logoImg: img
									});
								} else if (type == 'idcardFrontImg') {
									ths.setData({
										idcardFrontImg: img
									});
								} else if (type == 'idcardBackImg') {
									ths.setData({
										idcardBackImg: img
									});
								}
							}
						};
						http.upload(params);
					}
				});
			},

			// 获取用户绑定手机好

			/**
			 * 删除图片
			 */
			removeImage: function(e) {
				const type = e.target.dataset.type;

				if (type == 'logoImg') {
					this.setData({
						logoImg: {}
					});
				} else if (type == 'idcardFrontImg') {
					this.setData({
						idcardFrontImg: {}
					});
				} else if (type == 'idcardBackImg') {
					this.setData({
						idcardBackImg: {}
					});
				} else if (type == 'bussLicenImg') {
					this.setData({
						bussLicenImg: {}
					});
				}
			},

			/**
			 * 获取省市区
			 */
			initCityData: function(provinceId, cityId, areaId) {
				var ths = this;
				uni.showLoading();
				var params = {
					url: "/api/v1/area/listByPid",
					method: "GET",
					data: {
						pid: 0
					},
					callBack: function(res) {
						//console.log(res)
						ths.setData({
							provArray: res
						});

						if (provinceId) {
							for (var index in res) {
								if (res[index].areaId == provinceId) {
									ths.setData({
										value: [index, ths.value[1], ths.value[2]]
									});
								}
							}
						}

						ths.getCityArray(provinceId ? provinceId : res[0].areaId, cityId, areaId);
						uni.hideLoading()
					}
				};
				http.request(params);
			},

			/**
			 * 滑动事件
			 */
			bindChange: function(e) {
				var ths = this;
				var val = e.detail.value; //判断滑动的是第几个column
				//若省份column做了滑动则定位到地级市和区县第一位

				if (index[0] != val[0]) {
					val[1] = 0;
					val[2] = 0; //更新数据

					ths.getCityArray(this.provArray[val[0]].areaId); //获取地级市数据
				} else {
					//若省份column未做滑动，地级市做了滑动则定位区县第一位
					if (index[1] != val[1]) {
						val[2] = 0; //更新数据

						ths.getAreaArray(this.cityArray[val[1]].areaId); //获取区县数据
					} else {}
				}

				index = val;
				this.setData({
					value: [val[0], val[1], val[2]]
				});
				ths.setData({
					province: ths.provArray[ths.value[0]].areaName,
					city: ths.cityArray[ths.value[1]].areaName,
					area: ths.areaArray[ths.value[2]].areaName,
					provinceId: ths.provArray[ths.value[0]].areaId,
					cityId: ths.cityArray[ths.value[1]].areaId,
					areaId: ths.areaArray[ths.value[2]].areaId
				});
			},

			/**
			 * 根据省份ID获取 城市数据
			 */
			getCityArray: function(provinceId, cityId, areaId) {
				var ths = this;
				var params = {
					url: "/api/v1/area/listByPid",
					method: "GET",
					data: {
						pid: provinceId
					},
					callBack: function(res) {
						//console.log(res)
						ths.setData({
							cityArray: res
						});

						if (cityId) {
							for (var index in res) {
								if (res[index].areaId == cityId) {
									ths.setData({
										value: [ths.value[0], index, ths.value[2]]
									});
								}
							}
						}

						ths.getAreaArray(cityId ? cityId : res[0].areaId, areaId);
						uni.hideLoading()
					}
				};
				http.request(params);
			},

			/**
			 * 根据城市ID获取 区数据
			 */
			
			getAreaArray: function(cityId, areaId) {
				var ths = this;
				var params = {
					url: "/api/v1/area/listByPid",
					method: "GET",
					data: {
						pid: cityId
					},
					callBack: function(res) {
						//console.log(res)
						ths.setData({
							areaArray: res
						});

						if (areaId) {
							for (var _index in res) {
								if (res[_index].areaId == areaId) {
									ths.setData({
										value: [ths.value[0], ths.value[1], _index]
									});
								}
							}

							index = ths.value;
							ths.setData({
								province: ths.province,
								city: ths.city,
								area: ths.area,
								provinceId: ths.provinceId,
								cityId: ths.cityId,
								areaId: ths.areaId
							});
						} else {
							ths.setData({
								province: ths.provArray[ths.value[0]].areaName,
								city: ths.cityArray[ths.value[1]].areaName,
								area: ths.areaArray[ths.value[2]].areaName,
								provinceId: ths.provArray[ths.value[0]].areaId,
								cityId: ths.cityArray[ths.value[1]].areaId,
								areaId: ths.areaArray[ths.value[2]].areaId
							});
						}

						uni.hideLoading()
					}
				};
				http.request(params);
			},

			/**
			 * 移动按钮点击事件
			 */
			translate: function(e) {
				if (t == 0) {
					moveY = 0;
					show = false;
					t = 1;
				} else {
					moveY = 200;
					show = true;
					t = 0;
				}

				this.setData({
					show: true
				}); // this.animation.translate(arr[0], arr[1]).step();

				this.animationEvents(this, moveY, show);
			},

			/**
			 * 隐藏弹窗浮层
			 */
			hiddenFloatView(e) {
				//console.log(e);
				moveY = 200;
				show = true;
				t = 0;
				this.animationEvents(this, moveY, show);
			},

			/**
			 * 动画事件
			 */
			animationEvents: function(that, moveY, show) {
				//console.log("moveY:" + moveY + "\nshow:" + show);
				that.animation = wx.createAnimation({
					transformOrigin: "50% 50%",
					duration: 400,
					timingFunction: "ease",
					delay: 0
				});
				that.animation.translateY(moveY + 'vh').step();
				that.setData({
					animation: that.animation.export()
				});
			}
		}
	};
</script>
<style>
	@import "./openAShop.css";
</style>
