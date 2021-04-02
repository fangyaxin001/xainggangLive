import Vue from 'vue';
import App from './App';
import wechat from './utils/wechat.js';
import RouterMount from './router/index.js'
// 国际化模块
import VueI18n from 'vue-i18n'
import uView from "uview-ui";

Vue.use(VueI18n)
Vue.use(uView);
// #ifdef H5
if (wechat.isWechat()) {
	Vue.prototype.$wechat = wechat;
}
// #endif
Vue.config.productionTip = false;

Vue.mixin({
	methods: {
		setData: function (obj, callback) {
			let that = this;
			let keys = [];
			let val, data;
			Object.keys(obj).forEach(function (key) {
				keys = key.split('.');
				val = obj[key];
				data = that.$data;
				keys.forEach(function (key2, index) {
					if (index + 1 == keys.length) {
						that.$set(data, key2, val);
					} else {
						if (!data[key2]) {
							that.$set(data, key2, {});
						}
					}
					data = data[key2];
				})
			});
			callback && callback();
		}
	}
});

if (!uni.getStorageSync('lang')) {
	// 设置默认语言
	uni.getSystemInfo({
		success: (res) => {
			uni.setStorageSync('lang', (res.language.indexOf('zh') != -1) ? 'zh_CN' : 'en')
		}
	})
}

const i18n = new VueI18n({
	locale: uni.getStorageSync('lang') || 'zh_CN', // 默认使用中文
	messages: {
		'en': require('utils/lang/en.js'), // 英文语言包
		'zh_CN': require('utils/lang/zh.js')  // 中文简体语言包
	}
})

// 导出国际化
export default i18n

Vue.prototype._i18n = i18n

Vue.prototype.$i18nMsg = function () {
	return i18n.messages[i18n.locale]
}
Vue.use(uView);
App.mpType = 'app';

const app = new Vue({
	i18n,  // 国际化
	...App
});

//v1.3.5起 H5端 你应该去除原有的app.$mount();使用路由自带的渲染方式
// #ifdef H5
RouterMount(app, '#app');
// #endif

// #ifndef H5
app.$mount(); //为了兼容小程序及app端必须这样写才有效果
// #endif
