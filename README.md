# H5MediaC 0.2.0  h5audio、video基础控件

这个组件现阶段（0.2.0）功能还比较弱，只是根据现在的一些基本业务做了处理，比如：快速创建一个媒体MP4||MP3，精确获取视频播放位置，各种媒体状态回调，拓展了一个toggle（）方法，这在控制背景音乐上有这很好的表现。

这个组件有很广阔的空间，有很多有意思的功能待去扩展，希望有兴趣的朋友参与进来。

## 函数 API

```
	obj	//* string || dom   如果是 .MP3||.MP4 的路径（src）将自动创建媒体元素 （插入位置 见下面配置）  

new H5MediaC(obj,{
	'attr': {"preload":'auto','controls':'','autoplay':'','loop':''},// json 属性设置 value ===falsh视为删除该属性； 注意默认有preload ；
	'elAppend':document.body , 		//dom 创建的媒体对象插入位置 ，  默认document.body  如果为false不插入
	'initFn': function(_this){},	//init回调
	'pausedFn':function(_this){},	//暂停回调
	'toggleFn':function(_this){},	//toggle 方法（事件）回调
	'playFn': function(_this){},	//播放回调 ，可以在这里实时获得播放信息  _this.currentTime
	'endFn': function(_this){}		//播放完成
  	})
	  
	FN	.toggle（） 切换暂停 播放方法
		.play（）
		.pause（）
		.setData（｛xx：x｝）只针对元素属性信息，包括 src设置 ，如果value ===falsh 视为删除该属性
		.remov() 干掉创建的元素
		
	Attr
		data 配置权重最高
		
		this.currentTime;	 播放进度
		this.duration;		视频总时长(这个值当元素加载到页面上才会获取)
		this.state; 		播放状态 （播放时为true）
		this.paused; 		暂停状态 （暂停时为true） 【是不是觉得有点脑残，为了照顾原生api习惯 多多益善】
		
		
		保留待扩展
		this.volume	音量  myVid.volume=0.2 是 20%   event = onvolumechange
		
		waiting 事件在视频由于需要缓冲下一帧而停止时触发。
```

