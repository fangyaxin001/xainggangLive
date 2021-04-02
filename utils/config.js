//配置文件
// #ifndef MP
var domain = "https://h5.gz-yami.com/api"; //统一接口域名，正式环境
var wsDomain = "wss://h5.gz-yami.com/api"; //统一接口域名，正式环境
var imDomain = "https://h5.gz-yami.com/im"; //统一接口域名，正式环境
var imWsDomain = "wss://h5.gz-yami.com/im"; //统一接口域名，正式环境
// #endif

// #ifdef MP  
// var domain = "http://api.server.gmall11.com"; //统一接口域名，正式环境
var domain = "http://manage.shanyipingtaiapp.com/zhongkang-api"; //统一接口域名，正式环境
var wsDomain = "wss://manage.shanyipingtaiapp.com"; //统一接口域名，正式环境
// var imDomain = "http://api.server.gmall11.com"; //统一接口域名，正式环境
var imDomain = "http://manage.shanyipingtaiapp.com/zhongkang-api/im"; //统一接口域名，正式环境
var imWsDomain = "wss://manage.shanyipingtaiapp.com/im"; //统一接口域名，正式环境
// #endif

// 微信公众号的appId;  小程序appId配置在 manifest.json ->  mp-weixin -> appid
var mpAppId = 'wx42bbe857570c5b40'

// 本地运行环境 ->  地址修改为本机IP; 端口与 manifest.json 中 h5 -> devServer -> port 一致; 
// 运行后浏览器使用 "http://192.168.1.99:8181" 访问
// var domain = "http://api.server.gmall11.com"; //统一接口域名，测试环境
var domain = "http://manage.shanyipingtaiapp.com/zhongkang-api"; //统一接口域名，测试环境
var wsDomain = "ws://manage.shanyipingtaiapp.com/api"; //统一接口域名，测试环境
// var imDomain = "http://api.server.gmall11.com"; //统一接口域名，测试环境
var imDomain = "http://manage.shanyipingtaiapp.com/zhongkang-api"; //统一接口域名，测试环境
var imWsDomain = "ws://manage.shanyipingtaiapp.com/im"; //统一接口域名，测试环境

var picDomain = " https://youxuegou.oss-cn-beijing.aliyuncs.com/"; //图片域名

exports.domain = domain;
exports.picDomain = picDomain;
exports.wsDomain = wsDomain;
exports.mpAppId = mpAppId;
exports.imDomain = imDomain;
exports.imWsDomain = imWsDomain;
