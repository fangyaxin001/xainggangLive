<script>
//app.js
var http = require("./utils/http.js");
var util = require('./utils/util.js')
import { AppType } from './utils/constant.js'
export default {
  onLaunch: function (options) {
    // APP模式下保持竖屏
    // #ifdef APP-PLUS
    plus.screen.lockOrientation('portrait-primary')
    // #endif
		// #ifdef H5
		uni.getSystemInfo({
			success: function (res) {
				//客户端平台，值域为：ios、android
				if (res.platform == 'ios') {
					uni.setStorageSync('iosUrl', window.location.href.split('#')[0])
				}
			}
		});
		// #endif

  },
  onShow: function () {
    // #ifdef H5
    // 判断浏览器环境
    var ua = navigator.userAgent.toLowerCase();
    if (ua.search(/MicroMessenger/i) > -1 && !uni.getStorageSync('appType')) {
      // 微信环境
      uni.setStorageSync('appType', 2)
      http.mpAuthLogin()
    }
    if (ua.search(/Alipay/i) > -1 && !uni.getStorageSync('appType')) {
      // 支付宝环境
      uni.setStorageSync('appType', 7)
    }
    const state = util.getUrlKey('state')
    const code = util.getUrlKey('code')
    if ((state == 'needCode' || state == 'unNeedCode') && code) {
      let path = window.location.href
      if (path.indexOf('code=') > 0 && path.indexOf('&state=unNeedCode') > -1) {
        http.mpLogin(null, code)
        path = path.substring(0, path.indexOf('code=') - 1)
        history.replaceState({}, '', path)
      }
      http.getCartCount()
    }
    // #endif
    // #ifdef APP-PLUS
    uni.getSystemInfo({
      success: (sysInfo) => {
        if (sysInfo.platform == 'android') {
          uni.setStorageSync('appType', AppType.ANDROID)
        } else {
          uni.setStorageSync('appType', AppType.IOS)
        }
      }
    })
    // #endif
    // #ifdef MP-WEIXIN
    wx.setStorageSync('appType', AppType.MINI)
    // #endif

    // #ifdef MP-ALIPAY
    wx.setStorageSync('appType', AppType.ALI)
    // #endif
  },
  globalData: {
    // 定义全局请求队列
    requestQueue: [],
    // 是否正在进行登陆
    isLanding: false,
    // 购物车商品数量
    totalCartCount: 0
  },
  methods: {

  }
};
</script>
<style lang="scss">
	 @import "./uview-ui/index.scss";
	 @import "./static/iconfont.css";
@import "./app.css";

/* 隐藏头部 */
uni-page-head {
  display: none;
}

/* 轮播图指示点 */
uni-swiper .uni-swiper-dots-horizontal {
  bottom: 20px !important;
}

/* 新增底部tab挡住左侧分类tab点击 */
.uni-tabbar-bottom{
    bottom:0 !important;
}
</style>
