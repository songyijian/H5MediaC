# H5MediaC（0.4.0）  H5 audio、video基础控件
gitHub : https://github.com/songyijian/H5MediaC

更新内容：修改0.3.0的bug
		增加 .remov()、.append() 方法
		支持微信端的媒体自动播放



### 主要业务场景：
	* 1.快速构建H5的媒体文件,媒体文件对象化持续操作
	* 2.实时检测文件播放进度，播放状态
	* 3.媒体播放暂停简易方法的再封装


## API

```
		obj	//* string||dom 
			.MP3||.MP4 结尾的路径string将自动创建媒体元素，被设置为src属性（插入位置 见下面配置）
			dom 媒体对象，将被检测
	new H5MediaC(obj,{
		'attr': {"preload":'auto','controls':'','autoplay':'','loop':''},//json 属性设置value：falsh视为删除该属性； 默认有preload
		'elAppend':document.body , 		//dom 创建的媒体对象插入位置， false不插入
		'initFn': function(_this){},	//init回调
		'pausedFn':function(_this){},	//暂停回调
		'toggleFn':function(_this){},	//toggle 暂停播放都会被监听到  初始化后紧跟会被执行一次用来判断当前的状态
		'playFn': function(_this){},	//播放回调 ，实时获得播放信息  _this.currentTime，一秒钟30次
		'endFn': function(_this){}		//播放完成
  	})
```	

### FN
```	
	.toggle（） 切换 暂停播放
	.play（）
	.pause（）
	.fullScreen() 全屏（不完美）
	.setData（｛xx：x｝）只针对元素属性信息，包括 src设置 ，value：falsh视为删除该属性
	.remov() 	暂停播放从dom中删除该元素
	.append()	将媒体重新插入dom中
```

### Attr
```
		data 配置权重最高
		
		this.currentTime;	 播放进度
		this.duration;		视频总时长(这个值当元素加载到页面上才会获取)
		this.state; 		播放状态 （播放时为true）
		this.paused; 		暂停状态 （暂停时为true） 【是不是觉得有点脑残，为了照顾原生api习惯 多多益善】

```


保留待扩展
this.volume	音量  myVid.volume=0.2 是 20%   event = onvolumechange
waiting 事件在视频由于需要缓冲下一帧而停止时触发。
