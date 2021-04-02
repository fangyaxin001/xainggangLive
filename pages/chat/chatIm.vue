<template>
	<view class="chat-container">
			<u-navbar title="客服名稱"></u-navbar>
		<view class="content">
		
			<scroll-view class="msg-list" scroll-y="true" :style="{height: screenHeight+'px'}" :scroll-with-animation="scrollAnimation"
			 :scroll-top="chatScrollTop">
				<view class="row" v-for="(row, index) in msgItems" :key="index">
					<!-- 用户消息 -->
					<block>
						<!-- 自己发出的消息 -->
						<view style="text-align: center;margin-bottom: 10rpx;"><text style="display: inline-block;padding: 10rpx 20rpx;background-color: #D0D0D0; color: #FFFFFF;border-radius: 10rpx;">今天20:55</text></view>
						<view class="my" v-if="row.source == 0">
							<!-- 左-消息 -->
							<view class="left">
								<view class="username"> 
									
								</view>
								<!-- 文字消息 -->
								<view v-if="row.type == 0" class="bubble">
									<rich-text :nodes="row.content"></rich-text>
								</view>
								<!-- 图片消息 -->
								<view v-if="row.type == 1" class="bubble" @tap="showPic(row.content)">
									<image :src="row.content" class="longimage" mode="widthFix"></image>
								</view>
								<view class="username" style="justify-content: flex-end;">
									<view class="time" style="color: #47D1D1;" >未读</view>
									<view class="time" v-show="false" >已读</view>
								</view>
							</view>
							
							<!-- 右-头像 -->
							<view class="right">
								<image src="../../packageDistribution/static/images/icon/menu-03.png"></image>
							</view>
						</view>
						<!-- 别人发出的消息 -->
						<view class="other" v-if="(row.source == 1 || row.source == 2) && row.forwardCode != 1">
							<!-- 左-头像 -->
							<view class="left">
								<image :src="shopInfo && shopInfo.shopLogo ? shopInfo.shopLogo: '../../static/images/icon/head01.png'"></image>
							</view>
							<!-- 右-用户名称-时间-消息 -->
							<view class="right">
								<view class="username">
									<view class="name">{{ row.shopName }}</view>
									<view class="time">{{ row.timeStr }}</view>
								</view>
								<!-- 文字消息 -->
								<view v-if="row.type == 0" class="bubble">
									<rich-text :nodes="row.content"></rich-text>
								</view>
								<!-- 图片消息 -->
								<view v-if="row.type == 1" class="bubble" @tap="showPic(row.content)">
									<image :src="row.content" class="longimage" mode="widthFix"></image>
								</view>
							</view>
						</view>
						<!-- 系统提示: 客服接入/转接、客户离线、用户状态异常-->
						<view class="sys-tips" v-if="(row.source == -1 && row.tipsType) || row.type == 2">
							<text class="tips-content" v-if="row.type == 2">{{row.content}}</text>
							<text class="tips-content" v-else>{{row.tipsType==1?i18n.customerOffline:row.tipsType==2?i18n.loginOtherSide:i18n.reLogin}}</text>
						</view>
					</block>
				</view>
			</scroll-view>
		</view>
		<!-- 抽屉栏 -->
		<view class="popup-layer" :class="popupLayerClass" @touchmove.stop.prevent="discard">
			<!-- 更多功能 相册-拍照-红包 -->
			<view class="more-layer" :class="{ hidden: hideMore }">
				<view class="list">
					<view class="box" @tap="chooseImage">
						<view class="icon tupian2"></view>
					</view>
					<view class="box" @tap="camera">
						<view class="icon paizhao"></view>
					</view>
					<!-- <view class="box" @tap="callShop" v-if="shopId!=0">
						<view class="icon">
							<image class="phone-icon" src="/static/images/icon/dianhua.png" mode=""></image>
						</view>
					</view> -->
				</view>
			</view>
		</view>
		<!-- 底部输入栏 -->
		<view class="input-box" :class="popupLayerClass" @touchmove.stop.prevent="discard">
			<view class="textbox">
				<view class="text-mode" @tap="chatFocus">
					<view class="box">
						<!-- <textarea :show-confirm-bar="scrollAnimation" auto-height="true" v-model="textMsg" @focus="textareaFocus" @keyup.enter="sendText" /> -->
						<input type="text" cursor-spacing="10"	 v-model="textMsg" @focus="textareaFocus" @keyup.enter="sendText" adjust-position="true" style="width:100%"/>
					</view>
				</view>
			</view>
			<view class="more" @tap="showMore">
				<view class="icon add"></view>
			</view>
			<view class="send" @tap="sendText()">
				<view class="btn">{{i18n.send}}</view>
			</view>
		</view>
	</view>
</template>
<script module="wxs" lang="wxs" src="../../wxs/number.wxs"></script>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import http from "../../utils/http.js";
	import config from "../../utils/config.js";
	import util from "../../utils/util.js";
	export default {
		data() {
			return {
				shopId: null,
				//文字消息
				textMsg: '',
				scrollAnimation: false,
				myuid: 0,

				// 抽屉参数
				popupLayerClass: '',
				// more参数
				hideMore: true,
				user: uni.getStorageSync('user'),
				msgItems: [],
				imSocketTask: null,
				userInfo: null,
				shopInfo: null,
				chatScrollTop: 0,
				screenHeight: 712, // 消息内容盒子默认高度
				actualHeight: 712, // 手机屏幕实际高度
				sendType: 1, // 发送消息类型(客服类型)  1平台  2商家  默认平台
			};
		},
		computed: {
			i18n() {
				return this.$t('index')
			}
		},
		onLoad(option) {
			this.getSysInfo()
			this.shopId = option.shopid;
			this.getMsgItems(); 
			this.openWs();
			this.getUserInfo();
			if (option.shopid != 0) {
				console.log('店铺客服消息')
				// 店铺客服消息
				this.getShopInfo()
				this.sendType = 2
			} else {
				// uni.setNavigationBarTitle({
				// 	title: this.i18n.PCS
				// })
			}
		},
		onShow() {

		},	
		onUnload() {
			this.closeWs();
		},
		methods: {
			// 兼容小程序
			...mapState(['baseUrl']),
			/**
			 * 获取屏幕高度
			 */
			getSysInfo() {
				uni.getSystemInfo({
					success: (sysInfo) => {
						// #ifdef H5
						this.screenHeight = sysInfo.screenHeight - 100
						this.actualHeight = sysInfo.screenHeight - 100
						// #endif
						// #ifdef MP-WEIXIN || APP-PLUS
						this.screenHeight = sysInfo.screenHeight - 100 - sysInfo.statusBarHeight
						this.actualHeight = sysInfo.screenHeight - 100 - sysInfo.statusBarHeight
						// #endif
					}
				})
			},
			/**
			 * 点击外面盒子获取焦点
			 */
			chatFocus(){
				this.textareaFocus()
			},
			
			/**
			 * 打电话给商家
			 */
			callShop() {
				uni.makePhoneCall({
					phoneNumber: this.shopInfo.tel
				})
			},
			/**
			 * 返回上一页
			 */
			backToPre() {
				uni.navigateBack({
					delta: 1
				})
			},
			/**
			 * 获取店铺信息
			 */
			getShopInfo() {
				var params = {
					url: "/shop/headInfo",
					method: "GET",
					data: {
						shopId: this.shopId
					},
					callBack: (res) => {
						this.setData({
							shopInfo: res
						})
						uni.setNavigationBarTitle({
							title: res.shopName
						})
					}
				};
				http.request(params);
			},
			/**
			 * 获取聊天记录
			 */
			getMsgItems() {
				var params = {
					domain: config.imDomain,
					url: (this.shopId != 0 ? "/api/v1/user/msgItems/" : "/api/v1/user/msgItemsPlatform/") + this.shopId,
					method: "GET",
					callBack: res => {
						if (res && res.length) {
							for (var i = 0; i < res.length; i++) {
								if (res[i].type === 1) {
									res[i].content = config.picDomain + res[i].content
								}
							}
						}
						this.msgItems = res
						this.$nextTick(function() {
							setTimeout(()=>{
								this.chatScrollTop = this.chatScrollTop + 1200 * res.length
							}, 99)
						})
					}
				};
				http.request(params);
			},
			/**
			 * 获取用户信息
			 */
			getUserInfo() {
				wx.showLoading();
				var params = {
					url: "/api/v1/user/userInfo",
					method: "GET",
					data: {},
					dontTrunLogin: true,
					callBack: (res) => {
						this.userInfo = res
						wx.hideLoading();
					}
				};
				http.request(params);
			},
			/**
			 * 创建ws
			 */
			openWs() {
				this.imSocketTask = uni.connectSocket({
					url: config.imWsDomain + '/im/websocket/user/' + uni.getStorageSync('token').substring(6), //仅为示例，并非真实接口地址。
					complete: () => {}
				});
				this.imSocketTask.onOpen((openRes) => {
					// console.log(this.imSocketTask)
					heartCheck.reset().start(); // 成功建立连接后，重置心跳检测
				})
				this.imSocketTask.onMessage((res) => {
					let result = JSON.parse(res.data)
					// console.log('onMessage:' + res.data)
					heartCheck.reset().start(); // 如果获取到消息，说明连接是正常的，重置心跳检测
					if (result.code == 10 || result.code == 11 || result.code == 12) {
						// source: -1  系统提示;    tipsType: 1客服不在线    2用户在别处登陆    3无法获取用户信息
						var tipsItem = {
							source: -1,
							tipsType: result.code == 12 ? 1 : result.code == 11 ? 2 : 3
						}
						let flag = false
						let delIndex = 0
						this.msgItems.forEach((item, index) => {
							if (item.tipsType == tipsItem.tipsType) {
								flag = true
								delIndex = index
							}
						})
						if (flag) {
							this.msgItems.splice(delIndex, 1)
						}
						this.msgItems.push(tipsItem)
						this.setData({
							msgItems: this.msgItems,
						})
						return
					}
					if (!result.obj) {
						return
					}
					let msgItem = result.obj
					if (msgItem.type == 1) {
						msgItem.content = config.picDomain + msgItem.content
					}
					this.msgItems.push(msgItem)
					this.setData({
						msgItems: this.msgItems,
						shopId: msgItem.shopId
					})
					this.$nextTick(function() {
						this.chatScrollTop = this.chatScrollTop + 1000 * this.msgItems.length
					})
				})
				var ths = this
				// 心跳检测, 每隔一段时间检测连接状态，如果处于连接中，就向server端主动发送消息，来重置server端与客户端的最大连接时间，如果已经断开了，发起重连。
				var heartCheck = {
					timeout: 50000, // 50s发一次心跳，比server端设置的连接时间稍微小一点，在接近断开的情况下以通信的方式去重置连接时间。
					serverTimeoutObj: null,
					reset: function() {
						clearTimeout(this.timeoutObj);
						clearTimeout(this.serverTimeoutObj);
						return this;
					},
					start: function() {
						var self = this;
						this.serverTimeoutObj = setInterval(function() {
							if (ths.imSocketTask._webSocket.readyState == 1) {
								console.log("连接状态，发送消息保持连接");
								ths.imSocketTask.send("ping");
								heartCheck.reset().start(); // 如果获取到消息，说明连接是正常的，重置心跳检测
							} else {
								console.log("断开状态，尝试重连");
								ths.openWs();
							}
						}, this.timeout)
					}
				}
			},
			/**
			 * ws关闭
			 */
			closeWs() {
				this.imSocketTask.close()
			},
			/**
			 * 发送信息
			 */
			sendText() {
				if (this.textMsg == '') {
					return;
				}

				let messageInfo = {
					toId: this.shopId,
					content: this.textMsg,
					msgType: 0,
					sendType: this.sendType // 1发给平台   2发给商家
				};
				this.addMessage(messageInfo);
				this.textMsg = ''
			},
			/**
			 * @param {Object} messageInfo
			 * 将新发送的消息添加至页面
			 */
			addMessage(messageInfo) {
				this.imSocketTask.send({
					data: JSON.stringify(messageInfo)
				})
				if (messageInfo.msgType === 1) {
					messageInfo.content = config.picDomain + messageInfo.content
				}
				let userInfo = this.userInfo
				let msgItem = {
					userName: userInfo.nickName,
					userHeadUrl: /((http[s]{0,1}):\/\/)/.test(userInfo.pic) ? userInfo.pic : config.picDomain + userInfo.pic,
					type: messageInfo.msgType,
					source: 0,
					content: messageInfo.content
				}
				msgItem.timeStr = util.tsToDate(new Date().getTime(), 'Y/M/D h:m')
				this.msgItems.push(msgItem)
				this.setData({
					msgItems: this.msgItems
				})
				this.$nextTick(function() {
					this.chatScrollTop = this.chatScrollTop + 1000 * this.msgItems.length
				})
			},
			/**
			 * 更多功能(点击+弹出)
			 */
			showMore() {
				if (this.hideMore) {
					this.hideMore = false;
					this.openDrawer();
				} else {
					this.hideDrawer();
				}
			},
			/**
			 * 打开抽屉
			 */
			openDrawer() {
				this.popupLayerClass = 'showLayer';
				this.screenHeight -= this.actualHeight*0.23
				this.$nextTick(function(){
					this.chatScrollTop += 1
				})
			},
			/**
			 * 隐藏抽屉
			 */
			hideDrawer() {
				this.popupLayerClass = '';
				this.screenHeight += this.actualHeight*0.23
				setTimeout(() => {
					this.hideMore = true;
				}, 150);
				this.$nextTick(function(){
					this.chatScrollTop += 1
				})
			},
			/**
			 * 选择图片发送
			 */
			chooseImage() {
				this.getImage('album');
			},
			/**
			 * 拍照发送
			 */
			camera() {
				this.getImage('camera');
			},
			/**
			 * @param {Object} path
			 * 上传图片
			 */
			uploadImg(path) {
				uni.showLoading({
					mask: true
				});
				var params = {
					url: "/api/v1/file/uploadImFile",
					filePath: path,
					name: 'file',
					callBack: (res) => {
						uni.hideLoading()
						let messageInfo = {
							toId: this.shopId,
							content: JSON.parse(res).filePath,
							msgType: 1
						};
						this.addMessage(messageInfo);
					}
				};
				http.upload(params);
			},
			/**
			 * @param {Object} type
			 * 选照片 or 拍照
			 */
			getImage(type) {
				this.hideDrawer();
				uni.chooseImage({
					sourceType: [type],
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					success: res => {
						for (let i = 0; i < res.tempFilePaths.length; i++) {
							uni.getImageInfo({
								src: res.tempFilePaths[i],
								success: image => {
									this.uploadImg(res.tempFilePaths[i]);
								}
							});
						}
					}
				});
			},
			/**
			 * 获取焦点，如果不是选表情ing,则关闭抽屉
			 */
			textareaFocus() {
				if (this.popupLayerClass == 'showLayer' && this.hideMore == false) {
					this.hideDrawer();
				}
			},
			/**
			 * @param {Object} msg
			 * 预览图片
			 */
			showPic(msg) {
				var list = [];
				list.push(msg);
				uni.previewImage({
					indicator: 'none',
					current: 0,
					urls: list
				});
			},
			/**
			 * 用于阻止滚动的空方法
			 */
			discard() {}
		}
	};
</script>

<style>
	page {
		background-color: #e5e5e5;
		max-height: 100%;
		overflow: hidden;
	}

	@font-face {
		font-family: "HMfont-home";
		src: url("data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAn8AAsAAAAAE1wAAAmvAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCFDAqWYJI9ATYCJANACyIABCAFhFUHgV8bThBRlFFWNdkXBXbDsSFQq221McNWrxUbYqGhiTju98MTeXqNh/9fo90388cEMe0bwSOJRIjavZIgESqnE5J5JqQVDZH/XdNfoHSAjqKqRsA+Tf/Ruya33E/bkdHsJtycY2XWAGbM5oenzf173A3lHrEilsmMbu74Y5VmYtxpgza9DMxkWL0gfjGbGRE54AL2f2ut3h2u8Q7RaZRCjDPLIv8cfAUR30MtEUWbSReVJkk0RB4lWWkNg7WVA1sBKmIUdr0uzibQOmxA4vrWwQXkJUweKHPfdwXkA+FSik2o1aVizyTegEKdvWINwGv59bEGY9GeTJFjW95pswIrzz3LYi//0O4JEaDrY3DZjxwXgUR8V3IfIeXARaloVRXT3mK/tsi3LubcJfese8l96Xbd1l1ve2z7eJp5lv3zB7URSdJNYd3Dfm7UUxxkGu0sLFcbVEa5pP3D6/QmokQw3OGzfJp/2kBkLJYQDYuziJbFJUSweIkoWXQRNYuEGFi0BLzFOhAjS4+InKUPRGI5I2a+kg7VSWUGoXoos2BNmGIWexwFroD8IUD6C1A9lYp8F3ClwsFgcgPdNpN08v1czkEOJ4aeieaC3QyVfb9PX2kbn9/0CwTeNAm79H1Kc2x3i9C7LcEZtMSLfE6T4aM+YWOm06dZ5cm9I+xoYw+rqGlScKKlHytu9h6Dw0E5nXK7nbTZknT1jFldR9cuzNMz9Srf7FydqpYW5mRr6Dq1OC9HqzYzoiw1cjohV2tX1Ji1K9bSdVkEbaxS1xQwpmpVpUFheyyzPyGdbXKHexkByib+vtgeK1X75xKqWl+grUNIbRZDXT31tBMiPZAyF0KmniCQhSgACkh5+gIxtvTS/si+VjbAuY6SMdCzbqInzwkjk5ENzMCkNv+ghQQ0qSSAUGmAMQoBozoAIrUe6qpzM+tma1T1jDgvVzdBWcIcLT170njGQU3cCpnUTSdkHH3ltwPHpKotTIP6HH12Lvd4czCWgbJYhY1U5ddlTCICSs1is0in8tXExk7VVRuMQhIQGgOtFcolPmMkIqDVduTGEOn1jI4gFERmSUsv3rGmoKUEQLITLUyzqpFukq8T6U+omVQsT8XHxsnipPEyBAlKNmkNMlMJgOT5Tpsoo2RGP3lOTQyk5GRBgJKw2WQsarWzSa1aLF/+UBk2PkA3wEkBM/RwOLJ0ORWiVCR3YYAAFyIlAdaNqEnmh0sTqOsAq97R85Jt+HGHrNKWgDHmxOPxumKmRGzudayPtogu9D2Zx688C3D6XJSgpgF6MJbomdtyOYBgcXOGSgMAPXqy+F11pMYHlFLCkkKM0S1T+U5SN0Ynh39SxcxmTPNHrTFIuieyxYgZXSDUAPpLLT2ZciVvihOh05k+JIAjoL7HtNsVFc5Rl+1hgAAIlNqGX3GEK0llMm0nZUdmhQzymg3Q9j6yO4FQsmqtQbXmZ+z+sOynUrt3nmbeXu3MYW9f8y38128LpWAVeyLMz4cTORbEDPYKHU19Oyx0OF12GIhfEx+/RRIm2RzPeIPE2yYRM7HBWBx+GvANWXAlMYcmWriz1/Tt2bk+jq7CdOzMu5zsn3zZXwg2Gu14YCBuh3NggN0DI8BbJpCXZb2I4xh+kdAmbU0IA6HYquya81nqYSk87Xgi35ur4HnxZWEvnoLrzbOEjHmJiY2JjV6I8c4ynSEsJTKcHxuWYPRFFleV2Sbi0Dsk4XmDSToXTMnUnW/PW9J9W4UCgP+h0rTi9tiJd6qQgk2lPI/KKeybAPx+c7vZHdimbruzyCP9iZvd0VuBuIniuXirHQ8oG2IThFIUI8QOhjfNMg86GH4Bv4ixLlr4BDi2wDDwXTYYTgfnBJur1nAw2yGngw96JhQo+48cMWVE8kWwcA55ZuzwkSP/mpp9D6wFm2e1Bc8cPVraL2Ng7y6KfSNHqQfTYByYMmbT73WNmwZs6m8sBR54XCndTHwvu6v+8N+Jze9/jeGd8bpoHePtMv0/9U6e78bTtf+aly55P40cNtJ3PH3U6xQ9DkRNos+Chp2TpNwX4lZOwkTa4nOLPxpMLc8Sm0srSwD6Y1KW7ftPZ68x3DWS8d4cJbAKE6QJEfRrhAafMLV0RoCRLhKdBaJzNtzPD7dxLIgZ7Al4006exyHEYXMewjqApFokPRIu9FvLiPf96uWlpuZmRZKiH1i0OCNj1ar7zSDqYiRbCQsMrKUXZswxBkQEbCmv2RJgKK82+UcGbpk+0woVSxekQrYCzp4Hk30E3oHhAh+4fLcOPCfzOVu3cvKkHAWzNAVyjAyOQsrJix47n0OZpbTUDKdJp8CZs+BkAKfMnDkF+kJmmrcN4OSZs8CRuwZ+N76gampCxtj83XWO5X1GYc7hIypq+N32eTe6Wr/GfXW5GukBLnvJ1gEPhlmsuUHzg3Osp/vJCZ4flGsFf27fjV18spjdTfQUuVANcgldRA3hKhSUutCGgGhDaMo0tXMHwiUq3gG5entO2xmnECa3H53AjRpKFFYIK7qrHjMJ75sEC91BPlGc0TlZY9qlsdcuZaXy0D3hfz4cmLd2WzbK3Xhhdw7c2VLCxtxsFCMEo8bArEww9ruOrc5joK9g1xp85MghQ4wyuPV71+/tMVxAMmzA1lSt+WmbjFkwL/lV6az7APzZ5qvVmmy7b1bJGrTDhmRfMBYbWMZmNOu3bJdPlLL/5WOR2XZCTJpmU4mx8lv9Fg76T8NagO4vUacJ+n/Sr0b/LYb8+1z5QCb935a0m6WWYXzwh4DO2Sa9g2jEnJ6tYwTU5jp7N2RmaHkn/gjEb/fXpmpXbkpAGaAv7pnKAfdc6bg4GZx1L3QuQ8lVC3BvXbC8f2eHQEqkBuc9aO6h9849M3oPucrgAyQY/HEv7PYJJQy23Ft3/R+xczqmsHWDgrDCyzfcl1o5ehKxnUOr5Bm6NhTGR4u1rtDEvlZ8dGgklLeNCk3ZbeKaO0bkcMfoKt+6ng/DUPPI6AAlDXlE0dzwsKPadkjqKjDXGEgg4b2CK7vx65M0xSlPmNsOA58/g1xWSDDKeq/KV5AR89+zc6OGjKSKtxUqR4NtF47VuMZemcTBDQxGqzqqrXIMCnm2xkXq1QJIIkO8EpmROcOkIyevYmhUqurWBmgCe4U5WJFHiiLKqKKOJtrooo8hxphihl6g5bGv3MAXkfBvPaFbVq6ga4Uq+wWdEfo6NVTmr1oVkYoye2NvfCWLmYQx0sjozFSxszhZ4Ctjb7QtavLQDNa0L5HRZQYJYxrNLbJR4QhZvOV46Fm/lqB428nsrJSx/OwbEgYA") format("woff2");
	}

	.icon {
		font-family: "HMfont-home" !important;
		font-size: 56upx;
		font-style: normal;
		color: #333;
	}

	.icon.biaoqing:before {
		content: "";
	}

	.icon.jianpan:before {
		content: "";
	}

	.icon.yuyin:before {
		content: "";
	}

	.icon.tupian:before {
		content: "";
	}

	.icon.chehui:before {
		content: "";
	}

	.icon.luyin:before {
		content: "";
	}

	.icon.luyin2:before {
		content: "";
	}

	.icon.hongbao:before {
		content: "";
	}

	.icon.tupian2:before {
		content: "";
	}

	.icon.paizhao:before {
		content: "";
	}

	.icon.add:before {
		content: "";
	}

	.icon.close:before {
		content: "";
	}

	.icon.to:before {
		content: "";
	}

	.hidden {
		display: none !important;
	}

	.popup-layer {
		transition: all 0.15s linear;
		width: 96%;
		height: 42vw;
		padding: 20upx 2%;
		background-color: #f3f3f3;
		border-top: solid 1upx #ddd;
		position: fixed;
		z-index: 20;
		top: 100%;
	}

	.popup-layer.showLayer {
		transform: translate3d(0, -42vw, 0);
	}

	.popup-layer .more-layer {
		width: 100%;
		height: 42vw;
	}

	.popup-layer .more-layer .list {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
	}

	.popup-layer .more-layer .list .box {
		width: 18vw;
		height: 18vw;
		border-radius: 20upx;
		background-color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0 3vw 2vw 3vw;
	}

	.popup-layer .more-layer .list .box .icon {
		font-size: 70upx;
	}

	.input-box {
		width: 98%;
		min-height: 100upx;
		padding: 0 1%;
		background-color: #f2f2f2;
		display: flex;
		position: fixed;
		z-index: 20;
		bottom: -2upx;
		transition: all 0.15s linear;
		border-bottom: solid 1upx #ddd;
	}
	.input-box.showLayer {
		transform: translate3d(0, -42vw, 0);
	}

	.input-box .more {
		flex-shrink: 0;
		width: 90upx;
		height: 100upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.input-box .send {
		/* #ifdef H5 */
		margin-left: 20upx;
		/* #endif */
		flex-shrink: 0;
		width: 100upx;
		height: 100upx;
		display: flex;
		align-items: center;
	}

	.input-box .send .btn {
		width: 90upx;
		height: 56upx;
		display: flex;
		justify-content: center;
		align-items: center;
		background: linear-gradient(to right, #f09b37, #eb632c);
		color: #fff;
		border-radius: 6upx;
		font-size: 24upx;
	}

	.input-box .textbox {
		width: 100%;
		min-height: 70upx;
		margin-top: 15upx;
	}

	.input-box .textbox .text-mode {
		width: 100%;
		min-height: 70upx;
		display: flex;
		background-color: #fff;
		border-radius: 40upx;
	}

	.input-box .textbox .text-mode .box {
		width: 100%;
		padding-left: 30upx;
		padding-right: 30upx;
		min-height: 70upx;
		display: flex;
		align-items: center;
	}

	.input-box .textbox .text-mode .box textarea {
		width: 100%;
	}

	.input-box .textbox .text-mode .em {
		flex-shrink: 0;
		width: 80upx;
		padding-left: 10upx;
		height: 70upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.record {
		width: 40vw;
		height: 40vw;
		position: fixed;
		top: 55%;
		left: 30%;
		background-color: rgba(0, 0, 0, 0.6);
		border-radius: 20upx;
	}

	.record .ing {
		width: 100%;
		height: 30vw;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	@keyframes volatility {
		0% {
			background-position: 0% 130%;
		}

		20% {
			background-position: 0% 150%;
		}

		30% {
			background-position: 0% 155%;
		}

		40% {
			background-position: 0% 150%;
		}

		50% {
			background-position: 0% 145%;
		}

		70% {
			background-position: 0% 150%;
		}

		80% {
			background-position: 0% 155%;
		}

		90% {
			background-position: 0% 140%;
		}

		100% {
			background-position: 0% 135%;
		}
	}

	.record .ing .icon {
		background-image: linear-gradient(to bottom, #f09b37, #fff 50%);
		background-size: 100% 200%;
		animation: volatility 1.5s ease-in-out -1.5s infinite alternate;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		font-size: 150upx;
		color: #f09b37;
	}

	.record .cancel {
		width: 100%;
		height: 30vw;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.record .cancel .icon {
		color: #fff;
		font-size: 150upx;
	}

	.record .tis {
		width: 100%;
		height: 10vw;
		display: flex;
		justify-content: center;
		font-size: 28upx;
		color: #fff;
	}

	.record .tis.change {
		color: #f09b37;
	}

	.content {
		width: 100%;
		padding-top: 100rpx;
		margin-bottom: 100rpx;
		box-sizing: border-box;
	}

	/* #ifdef MP-WEIXIN || APP-PLUS */
	.content {
		padding: 0 0 100rpx 0;
	}

	/* #endif */
	.content .msg-list {
		width: 100%;
	}

	.content .msg-list .loading {
		display: flex;
		justify-content: center;
	}

	@keyframes stretchdelay {

		0%,
		40%,
		100% {
			transform: scaleY(0.6);
		}

		20% {
			transform: scaleY(1);
		}
	}

	.content .msg-list .loading .spinner {
		margin: 20upx 0;
		width: 60upx;
		height: 100upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.content .msg-list .loading .spinner view {
		background-color: #1aad19;
		height: 50upx;
		width: 6upx;
		border-radius: 6upx;
		animation: stretchdelay 1.2s infinite ease-in-out;
	}

	.content .msg-list .loading .spinner .rect2 {
		animation-delay: -1.1s;
	}

	.content .msg-list .loading .spinner .rect3 {
		animation-delay: -1s;
	}

	.content .msg-list .loading .spinner .rect4 {
		animation-delay: -0.9s;
	}

	.content .msg-list .loading .spinner .rect5 {
		animation-delay: -0.8s;
	}

	.content .msg-list .row {
		padding: 20upx;
	}

	.content .msg-list .row .system {
		display: flex;
		justify-content: center;
	}

	.content .msg-list .row .system view {
		padding: 0 30upx;
		height: 50upx;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #c9c9c9;
		color: #fff;
		font-size: 24upx;
		border-radius: 40upx;
	}

	.content .msg-list .row .system .red-envelope image {
		margin-right: 5upx;
		width: 30upx;
		height: 30upx;
	}

	.content .msg-list .row:first-child {
		margin-top: 20upx;
	}

	.content .msg-list .row .my .left,
	.content .msg-list .row .other .right {
		width: 100%;
		display: flex;
	}

	.content .msg-list .row .my .left .bubble,
	.content .msg-list .row .other .right .bubble {
		max-width: 70%;
		min-height: 50upx;
		border-radius: 10upx;
		padding: 15upx 20upx;
		display: flex;
		align-items: center;
		font-size: 32upx;
		word-break: break-word;
	}

	.content .msg-list .row .my .left .bubble .longimage,
	.content .msg-list .row .other .right .bubble .longimage {
		width: 300rpx;
		height: auto;
	}

	.content .msg-list .row .my .left .bubble .squareimage,
	.content .msg-list .row .other .right .bubble .squareimage {
		width: 300rpx;
		height: 300rpx;
	}

	.content .msg-list .row .my .left .bubble.red-envelope,
	.content .msg-list .row .other .right .bubble.red-envelope {
		background-color: transparent;
		padding: 0;
		overflow: hidden;
		position: relative;
		justify-content: center;
		align-items: flex-start;
	}

	.content .msg-list .row .my .left .bubble.red-envelope image,
	.content .msg-list .row .other .right .bubble.red-envelope image {
		width: 250upx;
		height: 313upx;
	}

	.content .msg-list .row .my .left .bubble.red-envelope .tis,
	.content .msg-list .row .other .right .bubble.red-envelope .tis {
		position: absolute;
		top: 6%;
		font-size: 26upx;
		color: #9c1712;
	}

	.content .msg-list .row .my .left .bubble.red-envelope .blessing,
	.content .msg-list .row .other .right .bubble.red-envelope .blessing {
		position: absolute;
		bottom: 14%;
		color: #e9b874;
		width: 80%;
		text-align: center;
		overflow: hidden;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.content .msg-list .row .my .right,
	.content .msg-list .row .other .left {
		flex-shrink: 0;
		width: 80upx;
		height: 80upx;
	}

	.content .msg-list .row .my .right image,
	.content .msg-list .row .other .left image {
		width: 80upx;
		height: 80upx;
		border-radius: 10upx;
	}

	.content .msg-list .row .my {
		width: 100%;
		display: flex;
		justify-content: flex-end;
	}

	.content .msg-list .row .my .left {
		min-height: 80upx;
		justify-content: flex-end;
		flex-wrap: wrap;
	}

	.content .msg-list .row .my .left .bubble {
		background-color: #1aad19;
		color: #fff;
	}

	.content .msg-list .row .my .left .no-bg {
		background-color: none;
	}

	@keyframes my-play {
		0% {
			transform: translateX(80%);
		}

		100% {
			transform: translateX(0%);
		}
	}

	.content .msg-list .row .my .left .bubble.play .icon:after {
		border-left: solid 10upx rgba(240, 108, 122, 0.5);
		animation: my-play 1s linear infinite;
	}

	.phone-icon {
		width: 60rpx;
		height: 60rpx;
	}

	.content .msg-list .row .my .right {
		margin-left: 15upx;
	}

	.content .msg-list .row .other {
		width: 100%;
		display: flex;
	}

	.content .msg-list .row .other .left {
		margin-right: 15upx;
	}

	.content .msg-list .row .other .right {
		flex-wrap: wrap;
	}

	.content .msg-list .row .other .right .username,
	.content .msg-list .row .my .left .username {
		width: 100%;
		height: 45upx;
		font-size: 24upx;
		color: #999;
		display: flex;
		align-items: center;justify-content: center;
		text-align: center;
		margin: auto;
	}

	.content .msg-list .row .my .left .username {
		
	}
	
	.content .msg-list .row .my .left .username .name{
		width: auto;
		max-width: 250rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.content .msg-list .row .my .left .username .time {
		text-align: center;
		margin-left: 40rpx;
	}

	.content .msg-list .row .other .right .username .name {
		margin-right: 50rpx;
		max-width: 250rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.content .msg-list .row .other .right .bubble {
		background-color: #fff;
		color: #333;
	}

	@keyframes other-play {
		0% {
			transform: translateX(-80%);
		}

		100% {
			transform: translateX(0%);
		}
	}

	.content .msg-list .row .other .right .bubble.play .icon:after {
		border-right: solid 10upx rgba(255, 255, 255, 0.8);
		animation: other-play 1s linear infinite;
	}

	.windows .mask {
		position: fixed;
		top: 100%;
		width: 100%;
		height: 100%;
		z-index: 1000;
		background-color: rgba(0, 0, 0, 0.6);
		opacity: 0;
		transition: opacity 0.2s ease-out;
	}

	.windows .layer {
		position: fixed;
		width: 80%;
		height: 70%;
		left: 10%;
		z-index: 1001;
		border-radius: 20upx;
		overflow: hidden;
		top: 100%;
		transform: scale3d(0.5, 0.5, 1);
		transition: all 0.2s ease-out;
	}

	.windows.show {
		display: block;
	}

	.windows.show .mask {
		top: 0;
		opacity: 1;
	}

	.windows.show .layer {
		transform: translate3d(0, -85vh, 0) scale3d(1, 1, 1);
	}

	.windows.hide {
		display: block;
	}

	.windows.hide .mask {
		top: 0;
		opacity: 0;
	}

	.open-redenvelope {
		width: 100%;
		height: 70vh;
		background-color: #cf3c35;
		position: relative;
	}

	.open-redenvelope .top {
		width: 100%;
		background-color: #fe5454;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		border-radius: 0 0 100% 100%;
		box-shadow: inset 0 -20upx 0 #9c1712;
		margin-bottom: 65upx;
	}

	.open-redenvelope .top .close-btn {
		width: 100%;
		height: 80upx;
		display: flex;
		justify-content: flex-end;
		margin-bottom: 30upx;
	}

	.open-redenvelope .top .close-btn .icon {
		color: #9c1712;
		margin-top: 10upx;
		margin-right: 10upx;
	}

	.open-redenvelope .top image {
		width: 130upx;
		height: 130upx;
		border: solid 12upx #cf3c35;
		border-radius: 100%;
		margin-bottom: -65upx;
	}

	.open-redenvelope .from,
	.open-redenvelope .blessing,
	.open-redenvelope .money,
	.open-redenvelope .showDetails {
		width: 90%;
		padding: 5upx 5%;
		display: flex;
		justify-content: center;
		font-size: 32upx;
		color: #fff;
	}

	.open-redenvelope .money {
		font-size: 100upx;
		color: #f8d757;
		display: flex;
		padding-top: 20upx;
	}

	.open-redenvelope .showDetails {
		position: absolute;
		bottom: 20upx;
		align-items: center;
		font-size: 28upx;
		color: #f8d757;
	}

	.open-redenvelope .showDetails .icon {
		font-size: 26upx;
		color: #f8d757;
	}

	/* 店铺信息 */
	.shop-info {
		width: 100%;
		height: 100rpx;
		position: fixed;
		top: 0;
		background-color: #FFFFFF;
		line-height: 100rpx;
		text-align: center;
		z-index: 999;
		display: flex;
		align-items: center;
		font-size: 32rpx;
		box-shadow: 2rpx 4rpx 8rpx 0rpx #ddd;
	}

	.flex-wrap {
		flex: auto;
	}

	/* 返回图标 */
	.back-icon {
		position: absolute;
		left: 0;
		top: 36rpx;
		width: 50rpx;
		height: 30rpx;
		transform: rotate(90deg);
	}

	.shop-tit {
		text-align: center;
		max-width: 80%;
		margin: 0 auto;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	
	/* 系统提示 */
	.sys-tips {
		display: flex;
		justify-content: center;
	}
	
	.tips-content {
		color: #999999;
		font-size: 28rpx;
	}
</style>
