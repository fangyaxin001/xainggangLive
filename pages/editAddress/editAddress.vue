<template>
	<!--pages/editAddress/editAddress.wxml-->

	<view class="container">
		<u-navbar v-show="!isflag" title="添加地址"></u-navbar>
		<u-navbar v-show="isflag" title="编辑地址">
			<view @click="deletFlag = true"  style="width: 95%;text-align: right;">删除</view>
		</u-navbar>
		<!-- 删除模态框 -->
		<u-modal v-model="deletFlag" content="确认删除地址吗？" @confirm= "confirm" :show-cancel-button="true"></u-modal>
		<!--input列表 -->
		<view class="input-box">
			<view class="lable section">
				<text>標籤</text>
				<view class="lable-list">
					<view :class="index==lableIndex ? 'lable-show' : ''" v-for="(item,index) in lableList" :key="index" @click="lableIndex=index">{{item}}</view>
					<view @click="addLable" class=""> + </view>
				</view>
			</view>
			<view class="lable section">
				<text>收貨人</text>
				<view class="">
					<u-input style="width: 300rpx;" :clearable="false" placeholder="收貨人" v-model="receiver" type="text" :border="false"
					 maxlength="7" />
				</view>
				<view class="">
					<u-radio-group v-model="sexvalue" @change="radioGroupChange">
						<u-radio @change="radioChange" v-for="(item, index) in sexlist" :key="index" :name="item.name" :disabled="item.disabled"
						 active-color="#47D1D1">{{item.name}}</u-radio>
					</u-radio-group>
				</view>
			</view>
			<view class="lable section">
				<text>聯繫電話</text>
				<view class="">
					<u-input style="width:450rpx;" :clearable="false" placeholder="聯繫電話" v-model="mobile" type="number" :border="false"
					 maxlength="11" />
				</view>
				<view class="" @click="phoneFlag=true">
					+86<u-icon style="margin-left: 10rpx;" name="arrow-right" color="#BFBFBF" size="28"></u-icon>
				</view>
			</view>
			<!-- 选择电话区号弹窗 -->
			<u-popup  v-model="phoneFlag" mode="bottom" height="1200rpx" z-index="99999">
				<view class="mod-top">
					<view class=""></view>
					<view class="">請選擇國際區號</view>
					<view class="delca" @click="phoneFlag=false">
						<u-icon name="close" color="#333333" size="20"></u-icon>
					</view>
				</view>
				<view  style="margin-bottom: 30rpx;">
					<view style="padding:10rpx 30rpx">常用区号</view>
					<view class="phone-list">
						<view class="phone-conent">中国大陆+86</view>
						<view class="phone-conent">中国大陆+86</view>
						<view class="phone-conent">中国大陆+86</view>
						<view class="phone-conent">中国大陆+86</view>
					</view>
				</view>
				<u-index-list :scrollTop="scrollTop">
					<view v-for="(item, index) in indexList" :key="index">
						<u-index-anchor :index="item" />
						<view class="list-cell">
							列表1
						</view>
						<view class="list-cell">
							列表2
						</view>
						<view class="list-cell">
							列表3
						</view>
					</view>
				</u-index-list>
			</u-popup>
			<view class="lable section">
				<text>所在地區</text>
				<view style="width:500rpx; color: #D3D6DC; font-size: 28rpx;" @click="cityFlag=true">
					{{cityValue}}
				</view>
				<view class="">
					<u-icon style="margin-left: 10rpx;" name="map-fill" color="#333333" size="38"></u-icon>
				</view>
			</view>
			<u-picker @confirm="selectCity" mode="region" v-model="cityFlag" :area-code='["67", "6701", "670101"]'></u-picker>
			<view class="textarea-box">
				<u-input v-model="detail_city" :clearable="false" placeholder="請填寫詳細地址：如道路、門牌號、小區、樓棟號等" type="textarea" :border="false"
				 maxlength="31" />
			</view>
			<view class="lable section" style="justify-content: space-between;">
				<text>智能填寫</text>

				<view class="">
					<u-icon style="margin-right: 10rpx;" name="arrow-up" color="#000000" size="28"></u-icon>
				</view>
			</view>
			<view class="textarea-box">
				<u-input v-model="paste_city" :clearable="false" placeholder="請複製地址粘貼至此自動識別填寫地址" type="textarea" :border="false"
				 maxlength="31" />
			</view>
			<view class="section" style="display: flex; justify-content: flex-end;">
				<view class="tianxie">填写</view>
			</view>
			<view class="set-static-city">
				<view class="">設為默認地址</view>
				<view class="">
					<u-switch v-model="static_city" active-color="#00C34B" size="40"></u-switch>
				</view>
			</view>
			<!--  <view class="section">
      <text>{{i18n.detailedAddress}}</text>
      <input class="addr" :placeholder="i18n.addressTips" type="text" :value="addr" @input="onAddrInput" maxlength="50"></input>
      <view class="arrow add-icon" @tap="chooseLocation">
        <image src="/static/images/icon/submit-address.png"></image>
      </view>
    </view> -->
		</view>
		<!-- end input列表 -->
		<!-- 功能按钮 -->
		<view class="btn-box">
			<view class="keep btn" @tap="onSaveAddr">
				<text>保存</text>
			</view>

			<view class="clear btn" @tap="onDeleteAddr" v-if="addrId!=0">
				<text>{{i18n.deleteAddress}}</text>
			</view>
		</view>
		<view class="fixed-input" v-show="lableFlag">
			<view style="width: 520rpx; margin-left: 10rpx;">
				<u-input :focus="lableFlag" style="padding-left:20rpx;background-color: #F6F7F9; border-radius: 50rpx; " v-model="lableValue"
				 placeholder="请填写标签名称（最多5个字）" type="text" :border="false" />
			</view>
			<view class="add">添加</view>
		</view>
		<u-mask z-index="1" :show="lableFlag" @click="lableFlag = false"></u-mask>
		<!-- end 功能按钮 -->
	</view>
</template>

<script>
	// pages/editAddress/editAddress.js
	var http = require("../../utils/http.js");
	var util = require("../../utils/util.js");
	var config = require("../../utils/config.js");
	var index = [18, 0, 0];
	var t = 0;
	var show = false;
	var moveY = 200;

	export default {
		data() {
			return {
				deletFlag:false,//控制删除弹框
				isflag:false,//控制编辑地址和删除地址的出现
				cityFlag:false,//控制城市选择弹窗
				scrollTop: 0, //区号弹框内容滚动高度
				indexList: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U",
					"V", "W", "X", "Y", "Z"
				],
				phoneFlag: false, //控制国际区号弹窗
				lableValue: '', //新增标签
				static_city: false, //控制默认地址
				paste_city: '', //粘贴的地址
				detail_city: '', //地址详情
				sexlist: [{
						name: '先生',
						disabled: false
					},
					{
						name: '女士',
						disabled: false
					},
				], //选择性别
				sexvalue: '先生', //默认性别
				lableIndex: 0, //标签索引
				lableList: ["公司", "家", "学校"], //选择标签
				value: [0, 0, 0],
				cityValue: "请选择省市區县、乡镇 ", //所在地址 
				lableFlag: false, //控制添加标签输入框出现 
				provArray: [],
				cityArray: [],
				areaArray: [],
				province: "",
				city: "",
				area: "",
				provinceId: 0,
				cityId: 0,
				areaId: 0,
				receiver: "",
				mobile: "",
				addr: "",
				addrId: 0,
				animation: "",
				show: "",
				region: "",
				lat: '',
				lng: '',
				showPicker: false,
			};
		},

		components: {},
		props: {},
		computed: {
			i18n() {
				return this.$t('index')
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
			
		},
		onLoad: function(options) {
			console.log(options)
			if(options.flag){
				// 编辑地址是通过该变量控制, 为true是编辑页面，为false是添加地址
				this.isflag = true
			}
			if (options.addrId) {
				uni.showLoading();
				var params = {
					url: "/api/v1/address/addrInfo/" + options.addrId,
					method: "GET",
					data: {},
					callBack: res => {
						//console.log(res)
						this.setData({
							province: res.province,
							city: res.city,
							area: res.area,
							provinceId: res.provinceId,
							cityId: res.cityId,
							areaId: res.areaId,
							receiver: res.receiver,
							mobile: res.mobile,
							addr: res.addr,
							addrId: options.addrId,
							lat: res.lat,
							lng: res.lng
						});
						this.initCityData(res.provinceId, res.cityId, res.areaId);
						uni.hideLoading()
					}
				};
				http.request(params);
			} else {
				this.initCityData(this.provinceId, this.cityId, this.areaId);
			}
		},
		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			// 加载导航标题
			// uni.setNavigationBarTitle({
			//     title:this.i18n.editShippingAddress
			// });
		},
		onHide: function() {
			this.showPicker = false
		},
		onReady: function() {
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
		methods: {
			// 删除回调函数
			confirm(){
				console.log("我被删除了")
			},
			// 选择地址的结果
			selectCity(e){
				console.log(e)
				this.cityValue = `${e.province.label}-${e.city.label}-${e.area.label}`
			},
			//添加标签
			addLable() {
				this.lableFlag = true
			},
			// 选中某个单选框时，由radio时触发
			radioChange(e) {
				console.log(e);
			},
			// 选中任一radio时，由radio-group触发
			radioGroupChange(e) {
				console.log(e);
			},
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
						ths.setData({
							provArray: res
						});
						if (provinceId) {
							for (var index in res) {
								if (res[index].areaId == provinceId) {
									ths.setData({
										value: [Number(index), ths.value[1], ths.value[2]]
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
			//滑动事件
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
			//移动按钮点击事件
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
					show: true,
					showPicker: true
				}); // this.animation.translate(arr[0], arr[1]).step();

				this.animationEvents(this, moveY, show);
			},

			//隐藏弹窗浮层
			hiddenFloatView(e) {
				//console.log(e);
				moveY = 200;
				show = true;
				t = 0;
				this.animationEvents(this, moveY, show);
			},

			//动画事件
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
			},

			/**
			 * 根据省份ID获取 城市数据
			 */
			getCityArray: function(provinceId, cityId, areaId) {
				uni.showLoading();
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
										value: [ths.value[0], Number(index), Number(ths.value[2])]
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
										value: [ths.value[0], ths.value[1], Number(_index)]
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
			bindRegionChange: function(e) {
				//console.log('picker发送选择改变，携带值为', e.detail.value)
				this.setData({
					region: e.detail.value
				});
			},

			/**
			 * 保存地址
			 */
			onSaveAddr: function() {
				var ths = this;
				var receiver = ths.receiver;
				var mobile = ths.mobile;
				var addr = ths.addr;
				var lat = ths.lat
				var lng = ths.lng
				console.log('提交的经纬度：', lng, ',', lat)

				if (!receiver) {
					uni.showToast({
						title: ths.i18n.consigneeTips,
						icon: "none"
					});
					return;
				}
				if (!mobile) {
					uni.showToast({
						title: ths.i18n.enterMobileNumber,
						icon: "none"
					});
					return;
				}
				if (!util.checkPhoneNumber(mobile)) {
					uni.showToast({
						title: ths.i18n.enterCorrectPhone,
						icon: "none"
					});
					return;
				}
				if (!addr || addr.length < 5) {
					uni.showToast({
						title: ths.i18n.selectDetailedAddress,
						icon: "none"
					});
					return;
				}

				// if(lat == 0 || lng == 0 || !lat || !lng) {
				//   uni.showToast({
				//     title: '经纬度不能为空',
				//     icon: "none"
				//   });
				//   return;
				// }

				uni.showLoading();
				var url = "/api/v1/address/addAddr";
				var method = "POST";

				if (ths.addrId != 0) {
					url = "/api/v1/address/updateAddr";
					method = "PUT";
				} //添加或修改地址


				var params = {
					url: url,
					method: method,
					data: {
						receiver: ths.receiver,
						mobile: ths.mobile,
						addr: ths.addr,
						province: ths.province,
						provinceId: ths.provinceId,
						city: ths.city,
						cityId: ths.cityId,
						areaId: ths.areaId,
						area: ths.area,
						userType: 0,
						addrId: ths.addrId,
						lat: ths.lat, // 经度
						lng: ths.lng, // 纬度
					},
					callBack: function(res) {
						uni.hideLoading()
						uni.navigateBack({
							delta: 1
						});
					}
				};
				http.request(params);
			},
			onReceiverInput: function(e) {
				this.setData({
					receiver: e.detail.value
				});
			},
			onMobileInput: function(e) {
				this.setData({
					mobile: e.detail.value
				});
			},
			onAddrInput: function(e) {
				this.setData({
					addr: e.detail.value
				});
			},
			//删除配送地址
			onDeleteAddr: function(e) {
				var ths = this;
				uni.showModal({
					title: '',
					content: ths.i18n.deleteAddressTips,
					cancelText: ths.i18n.cancel,
					confirmText: ths.i18n.confirm,
					confirmColor: "#EF103C",

					success(res) {
						if (res.confirm) {
							var addrId = ths.addrId;
							uni.showLoading();
							var params = {
								url: "/api/v1/address/deleteAddr/" + addrId,
								method: "DELETE",
								data: {},
								callBack: function(res) {
									uni.hideLoading()
									uni.navigateBack({
										delta: 1
									});
								}
							};
							http.request(params);
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
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
					fail: function(failMsg) {
						console.log(failMsg)
						// #ifdef MP-WEIXIN
						uni.getSetting({
							success(res) {
								if (!res.authSetting['scope.userLocation']) {
									console.log("f1");
									uni.authorize({
										scope: 'scope.userLocation',
										success() {
											uni.chooseLocation({
												success: function(res) {
													that.setMapData(res);
													console.log(res)
												}
											});
											console.log('success2');
										},
										fail() {
											uni.showToast({
												title: that.i18n.authorityTips,
												icon: 'none'
											});
										}
									});
								}
							}
						});
						// #endif
					}
				});
			},

			setMapData(res) {
				this.lat = res.latitude; // 纬度
				this.lng = res.longitude; // 经度
				this.addr = res.address; // 详细地址
				this.name = res.name; // 详细地址

				console.log('腾讯/高德地图经纬度：', this.lng, '，', this.lat)

				this.qqMapTransBMap(this.lng, this.lat)
			},

			// 将腾讯/高德地图经纬度转换为百度地图经纬度
			qqMapTransBMap: function(lng, lat) {
				let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
				let x = lng;
				let y = lat;
				let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
				let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
				let lngs = z * Math.cos(theta) + 0.0065;
				let lats = z * Math.sin(theta) + 0.006;

				this.lng = lngs
				this.lat = lats

				console.log('百度地图经纬度：', this.lng, '，', this.lat)
				return {
					lng: lngs,
					lat: lats
				}
			},


			// 空方法
			nono() {

			}
		}
	};
</script>
<style>
	@import "./editAddress.css";

	.list-cell {
		display: flex;
		box-sizing: border-box;
		width: 100%;
		padding: 10px 24rpx;
		overflow: hidden;
		color: #323233;
		font-size: 14px;
		line-height: 24px;
		background-color: #fff;
	}

	>>>.u-index-bar__sidebar[data-v-62136660] {
		top: 62%;
	}

	>>>.u-index-bar__index[data-v-62136660] {
		padding: 4rpx 9rpx;
	}
</style>
