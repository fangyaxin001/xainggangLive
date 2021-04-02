<template>
	<!-- 引导分享蒙版 -->
	<view class="guide-share-mask">
		<view class="mask"></view>
		<view class="guide-share-close" @tap="close">
			<image src="../../static/images/icon/close.png" mode=""></image>
		</view>
		<!-- H5: 微信浏览器，引导用户右上角分享 -->
		<view class="guide-content" v-if="isWechat">
			<view class="share-img">
				<image src="../../static/images/icon/shareIcon.png"></image>
			</view>
			<view class="share-word">
				<view class="big-word">{{i18n.shareFriendsNow}}</view>
				<view class="small-word">{{i18n.shareFriendsTips2}}</view>
			</view>
		</view>
		<!-- 普通浏览器，生成链接二维码 -->
		<view class="guide-qrcode" v-else>
			<view class="guide-main">
				<image :src="qrSrc" mode=""></image>
				<view class="guide-copy-btn" @tap="copyLink">
					<text>{{i18n.copyLink}}</text>
				</view>
			</view>
		</view>
		
	</view>
	<!-- 引导分享蒙版 end -->
</template>

<script>
	import uniCopy from '@/js_sdk/copy/uni-copy.js'
	var Qr = require('../../utils/wxqrcode')
	export default {
		data() {
			return {
				qrSrc: '', // 生成的二维码路径
			};
		},
		props: {
			isWechat: Boolean,
			qrLink: String,
		},
		computed: {
			i18n() {
				return this.$t('index')
			}
		},
		created() {
			if (!this.isWechat && this.qrLink) {
				this.drawQrCode()
			}
		},
		methods: {
			/**
			 * 关闭
			 */
			close () {
				this.$emit('hideGuideShare', false)
			},
			/**
			 * 绘制二维码
			 */
			drawQrCode() {
				this.qrSrc = Qr.createQrCodeImg(this.qrLink, {size: 175})
			},
			/**
			 * 复制链接
			 */
			copyLink() {
				uniCopy({
					content: this.qrLink,
					success: (res) => {
						uni.showToast({
							title: res,
							icon: 'none'
						})
					},
					error: (e) => {
						uni.showToast({
							title: e,
							icon: 'none',
							duration: 3000,
						})
					}
				})
			}
		}
	}
</script>

<style>
@import url("./guideShare.css");
</style>
