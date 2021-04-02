import Vue from 'vue'
import Router, {
	RouterMount
} from '../js_sdk/hhyang-uni-simple-router/index.js';
import http from '../utils/http.js';
import util from '../utils/util.js';
Vue.use(Router);


var systemType = ''
// #ifdef H5
systemType = 2
// #endif
// #ifdef MP-WEIXIN
systemType = 3
// #endif
// #ifdef APP-PLUS
systemType = uni.getSystemInfoSync().platform=='android'? 4 : 5
// #endif
uni.setStorageSync('systemType', systemType)
const routesConfig = {
	h5: {
		paramsToQuery: true,
		loading: true,
		vueRouterDev: false,
		useUniConfig: true,
		resetStyle: () => {
			return {
				style: `
				#router-loadding .loadding {
					background-color: #f00 !important;
					box-shadow: 0 0 15px #f00 !important;
				}
				`
			}
		}
	},
	APP: {
		holdTabbar: false,
		rewriteFun: false,
		loddingPageStyle: () => JSON.parse('{"backgroundColor":"#96DBF3"}'),
		loddingPageHook: (view) => {
			view.drawBitmap('/static/wait.gif', {}, {
				top: 'auto',
				left: 'auto',
				width: '200px',
				height: '200px'
			})
		},
		holdTabbarStyle: () => JSON.parse('{"backgroundColor":"#FF0000","opacity":0.2}')
	},
	encodeURI: false,
	debugger: true,
	// routerBeforeEach: () => {
	// 	console.log('routerBeforeEach')
	// },
	// routerAfterEach: () => {
	// 	console.log('routerAfterEach')
	// },
	routes: ROUTES
}
// if (routesConfig.h5.vueRouterDev) {
// 	routesConfig.routes = vueDevRoutes;
// }

const router = new Router(routesConfig);


router.beforeEach((to, from, next) => {
		// 初始化log数据
		if (!uni.getStorageSync('initLog')) {
			uni.setStorageSync('initLog','initLog')
			uni.setStorageSync('uuid',util.getUuid())
			uni.setStorageSync('uuidSession',util.getUuid())
			uni.setStorageSync('step',0)
			uni.setStorageSync('sessionTimeStamp',new Date().getTime())
			uni.setStorageSync('systemType', systemType)
		}
		// 操作间隔时间大于30分钟则更新 uuidSession(会话uuid),重置 step
		if ((new Date().getTime() - uni.getStorageSync('sessionTimeStamp')) / 1000 / 60 > 30) {
			uni.setStorageSync('uuidSession', util.getUuid())
			uni.setStorageSync('step', 0)
			uni.removeStorageSync('flowAnalysisLogDto')
		}
		var step = uni.getStorageSync('step') * 1
		// 获取页面信息
		var pageInfo = util.getPageInfo(to)
		var flowAnalysisLogDto = {
			pageId: pageInfo.pageId,
			bizData: pageInfo.bizData,
			bizType: pageInfo.bizType,
			step: step,
			systemType: uni.getStorageSync('systemType'),
			uuid: uni.getStorageSync('uuid'),
			uuidSession: uni.getStorageSync('uuidSession'),
			visitType: 1,
			userId: uni.getStorageSync('loginResult').userId
		}
		uni.setStorageSync('flowAnalysisLogDto', flowAnalysisLogDto)
		if (pageInfo.pageId && to.path != from.path) {
			step += 1
			flowAnalysisLogDto.step = step
			uni.setStorageSync('step', step)
			uni.setStorageSync('flowAnalysisLogDto', flowAnalysisLogDto)
			uni.setStorageSync('sessionTimeStamp',new Date().getTime()) // 更新会话时间
			if (to.path!='/pages/pay-result/pay-result') {
				http.saveLog(flowAnalysisLogDto, 1)
			}
		}
	next();
})
router.afterEach((to, from) => {
	
})

// setTimeout(() => {
// 	router.push({name:'router5'})
// }, 5000);

export default RouterMount;
