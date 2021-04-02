<template>
	<view>
		<u-navbar title="我要反饋" title-width="300">
			<view class="nav-right" @click="goHostoryFeeback">反饋記錄</view>
		</u-navbar>
		<view class="feedback">
			<!-- 反馈类型 -->
			<view class="feedback-type">
				<view class="feedback-type-title">反馈类型</view>
				<view class="feedback-type-box">
					<view class="feedback-type-box-conent" :class="conentIndex==index?'conent-style':''" v-for="(item,index) in typeList"
					 :key="index" @click="conentIndex=index">{{item}}</view>
				</view>
			</view>
			<!-- 反馈描述 -->
			<u-gap height="20" bg-color="#F8F8F8"></u-gap>
			<view class="feedback-type" >
				<view class="feedback-type-title">反饋描述</view>
				<view style="margin-top: 20rpx;">
					<u-input v-model="feedValue" height="100" type="textarea" maxlength="120" />
				</view>
				<!-- 上传图片 -->
				<view class="up-img">
					<u-upload upload-text="" :action="action" max-count="6" :file-list="fileList"></u-upload>
				</view>
				<view class="feedback-type-hint">請上傳截圖，最多上傳6張</view>
			</view>
			<!-- 联系方式 -->
			<u-gap height="20" bg-color="#F8F8F8"></u-gap>
			<view class="feedback-type" >
				<view class="feedback-type-title">請留下您的聯繫方式</view> 
				<view class="feedback-type-contact">
					<u-input  v-model="contact_way" type="number" placeholder="手機號/郵箱/QQ" />
				</view>
			</view>
			<view class="submit">提交</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				typeList: ["下載/加載問題", "會員付費問題", "章節/圖片", "APP體驗問題", "卡頓/不流暢", "其他", ],
				feedValue: '',
				conentIndex: 0,//点击类型的索引
				contact_way:'',//联系方式
				// 演示地址，请勿直接使用
				action: 'http://www.example.com/upload',
				fileList: [],
				
			};
		},
		methods:{
			// 跳转至反馈记录
			goHostoryFeeback(){
				uni.navigateTo({
					url:"/pages/setting/feedback/history-feedback/history-feedback"
				})
			}
		}
	}
</script>

<style lang="scss">
	.nav-right {
		width: 100%;
		padding: 0 30rpx;
		text-align: right;
		color: #47D1D1;
	}

	.feedback {
		&-type {
			padding: 30rpx;
			background-color: #FFFFFF;

			&-title {
				font-size: 32rpx;
				color: #1A1A1A;
				font-weight: Medium;
				font-family: PingFang SC;
			}

			&-box {
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;

				&-conent {
					width: 206rpx;
					border: 1rpx solid #EEEEEE;
					text-align: center;
					height: 64rpx;
					line-height: 64rpx;
					font-size: 28rpx;
					margin-top: 30rpx;
					color: #999999;
					background-color: #FFFFFF;
					border-radius: 10rpx;
				}

				.conent-style {
					background-color: #47D1D1;
					color: #FFFFFF;
				}
			}

			&-hint {
				color: #BFBFBF;
				font-size: 24rpx;
				margin-top: 20rpx;
			}
			&-contact{
				margin-top: 20rpx;
				height: 100rpx;
				border-bottom: 1rpx solid #EEEEEE;
			}
		}
	}
   .submit{
	   width: 90%;
	   margin:  auto;
	   text-align: center;
	   color: #FFFFFF;
	   height: 100rpx;
	   line-height: 100rpx;
	   border-radius: 60rpx;
	   background-color: #47D1D1;
	   margin-top: 20rpx;
	   font-size: 32rpx;
   }
	/deep/.u-list-item[data-v-0d33af60] {
		background-color: #F7F7F7;
	}

	/deep/.u-icon__icon[data-v-6e20bb40] {
		font-size: 50rpx !important;
		color: #BFBFBF;
	}
</style>
