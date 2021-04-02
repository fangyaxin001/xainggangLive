# 开发环境启动

请使用 uniapp官方推荐的开发工具 HBuilderX 导入项目进行开发

编辑 utils/config.js 里的接口域名配置

点击工具栏的运行 -> 运行到内置浏览器 即可开发调试~

# 
# uniapp发布H5到服务器的过程


### 一、修改接口域名配置
在项目下utils/config.js 里修改配置，换成自己的接口域名
```
var domain = "http://h5.gz-yami.com/api"; //统一接口域名，正式环境 
var wsDomain = "ws://h5.gz-yami.com/api"; //统一接口域名，正式环境 
var picDomain = "http://img-test.gz-yami.com/"; //图片域名
 ```


### 二、打包编译
点击工具栏的【发行】 -> 【网站-H5手机版】
等待控制台输出
```
项目 'mall4uni-bbc' 编译成功。
```
编译成功后，项目下会多出一个unpackage文件夹

然后将 unpackage/dist/build/h5 文件夹复制到服务器上，如 /usr/share/nginx/h5


### 三、在服务器上配置nginx
```
server { 
        listen       80;
		server_name h5.gz-yami.com;


		location /api/ {
			rewrite  ^/api/(.*)$ /$1 break;
			proxy_pass   http://127.0.0.1:8112;
			proxy_set_header Host $host;
			proxy_set_header X-Real-IP $remote_addr;
			proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
			
			proxy_http_version 1.1; 
			proxy_set_header Upgrade $http_upgrade;  
			proxy_set_header Connection "Upgrade"; 
        }
		
        location / {
			try_files $uri $uri/ /;	
			root /usr/share/nginx/b2b2c-h5;
			index index.html;
			
			#### kill cache
			add_header Last-Modified $date_gmt;
			add_header Cache-Control 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0';
			if_modified_since off;
			expires off;
			etag off;
        }
		
		location /im {
			rewrite  ^/im/(.*)$ /$1 break;
			proxy_pass   http://127.0.0.1:8115;
			proxy_read_timeout 259200;
			proxy_set_header Host $host;
			proxy_set_header X-Real-IP $remote_addr;
			proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
			
			proxy_http_version 1.1; 
			proxy_set_header Upgrade $http_upgrade;  
			proxy_set_header Connection "Upgrade"; 
        }
		
		location ~* ^.+\.(jpg|jpeg|gif|png|ico|css|js)$ {
			root   /usr/share/nginx/b2b2c-h5;
			access_log off;
			expires 1d;
		}
		

        error_page 404 /404.html;
            location = /404-light.html {
        }

        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }
    }
```
最后重启nginx即可





