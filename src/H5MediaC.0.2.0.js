/*
	H5MediaC 0.2.0  h5多媒体基础操作控件、 支持audio，video
	作者：songyijian 
	发布：2016.12.26
	
	API
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
	  
		FN	.toggle（） 切换暂停 播放方法（可以看成一个事件）
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
			
* */

!function(){
	function H5MediaC(obj, ajson) {
		if(!obj) return;
		this.obj = obj;
		if(arguments.length === 1) ajson={};
		this.data = {
			'attr': { /*"preload":'auto','controls': '','autoplay': '','loop': ''*/},
			'currentTime': 0,
			'elAppend':function(){
				if(!ajson.elAppend ){
					if(typeof ajson.elAppend === 'boolean' && ajson.elAppend === false){
						return false;
					}else{
						return document.body;
					}
				}else{
					return ajson.elAppend
				}
			}(),
			'initFn': ajson.initFn || function(_this) {},
			'playFn': ajson.playFn || function(_this) {},
			'pausedFn': ajson.pausedFn || function(_this) {},
			'toggleFn': ajson.toggleFn || function(_this) {},
			'endFn': ajson.endFn || function(_this) {},
			'setDataFn':ajson.setDataFn || function(_this) {},
			'abortFn':ajson.abortFn||function(_this){},
			'suspendFn':ajson.suspendFn||function(_this){}
		};
		this.mediatype;

		if(ajson.attr && typeof ajson.attr === "object" && Object.prototype.toString.call(ajson.attr).toLowerCase() === "[object object]" && !ajson.attr.length) {
			for(var ii in ajson.attr) {
				this.data.attr[ii] = ajson.attr[ii];
			}
		}
		window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	
		//ATTR
		this.currentTime = 0; 	//播放位置时间
		this.duration;			//视频总时长
		this.state; 			//播放时为true
		this.paused; 			//暂停时为true
		this.fullScreenFlag = false;
	
		this.init();
		return this;
	};
	
	H5MediaC.prototype.init = function() {
		if(typeof this.obj === "string") {
			this.data.attr.src = this.obj;
			if(this.data.attr.src.match(/.mp3$|.mp4$/)) {
				if(this.data.attr.src.match(/.mp3$/)) {
					this.mediatype = "audio";
				}else{
					this.mediatype = "video";
				}
				this.type = "create";
				this.el = document.createElement(this.mediatype);
			} else {
				console.error(" src Not MP3")
				return;
			}
		} else if(this.obj.toString() === "[object HTMLVideoElement]" && (this.obj.nodeName === 'AUDIO' || this.obj.nodeName === 'VIDEO')) {
			this.el = this.obj;
		} else {
			return;
		}
		
		//属性设置
		this.setData(this.data.attr);
		if(this.type && this.type === "create") {
			if(!this.data.elAppend && typeof this.data.elAppend === 'boolean' && this.data.elAppend === false ){
			}else{
				this.data.elAppend.appendChild(this.el);
			}
		}
		this.data.initFn(this);

		//Event
		var _this = this;
		this.el.addEventListener('play', function() {
			_this.paused = _this.el.paused;
			_this.state = !_this.el.paused;
			_this._play()
			_this.data.toggleFn(_this);
		})
		this.el.addEventListener('pause', function() {
			_this.paused = _this.el.paused;
			_this.state = !_this.el.paused;
			_this.data.pausedFn(_this)
			_this.data.toggleFn(_this);
		})
		
		this.el.addEventListener('ended',function(){
			_this.data.endFn(_this)
		})
		
		this.el.addEventListener('abort',function(){
			_this.data.abortFn(_this)
		})
		this.el.addEventListener('suspend',function(){
			_this.data.suspendFn(_this)
		})
		
		
		//当媒介长度改变时运行的脚本
		this.el.ondurationchange=function(){ _this.duration = _this.el.duration; }	//1
		this.el.onloadeddata=function(){}	//2
		
		return this;
	};
	
	H5MediaC.prototype.setData = function(newdata,currentTime,fn) {
		if(newdata && typeof(newdata) === "object" && Object.prototype.toString.call(newdata).toLowerCase() === "[object object]" && !newdata.length) {
			for(var i in newdata) {
				this.data.attr[i] = newdata[i]
			}

			var key = '';
			for(var i in this.data.attr) {
				if(this.data.attr.hasOwnProperty(i)) key = i;
				
				if( typeof this.data.attr[key]==="boolean" && this.data.attr[key]===false){
					if(this.el.getAttribute(key)!==null){
						this.el.removeAttribute(key);
					}
				}else{
					this.el.setAttribute(key, this.data.attr[i]);
				}
			};
			
			//参数重载
			if( arguments.length > 1 ){
				if(arguments.length === 2){
					if(currentTime  &&  typeof currentTime === 'number'){
						this.currentTime = currentTime;
					}else{
						currentTime(this)
					}
					return;
				}
				if(arguments.length === 3){
					if(currentTime  &&  typeof currentTime === 'number'){
						this.currentTime = currentTime;
					}
					fn(this)
				}
			}
		}else{
			console.error("Data arguments error")
		}
		
		this.data.setDataFn(this)
		
		return this;
	}
	
	
	H5MediaC.prototype._play = function() {
		var _this = this;
		var i=0;
		(function getTime() {
			i++
			if(i%2){
				_this.currentTime = _this.el.currentTime;
				_this.data.playFn(_this)
			}
			if(_this.state) { requestAnimationFrame(getTime);}
		})()
	};
	
	
	H5MediaC.prototype.toggle = function() {
		if(this.el.paused) {
			this.el.play();
		} else {
			this.el.pause();
		}
		return this;
	}
	
	H5MediaC.prototype.play = function(newdata) {
		this.el.play()
		return this;
	}
	
	H5MediaC.prototype.pause = function(newdata) {
		this.el.pause()
		return this;
	}
	
	//不完美待处理
	H5MediaC.prototype.fullScreen = function (){
        if(this.fullScreenFlag){
        	this.fullScreenFlag = false;
            this.el.webkitCancelFullScreen();
        }else{
        	this.fullScreenFlag = true;
            this.el.webkitRequestFullscreen();
        }
        return this;
    }
	
	//非常不完美
	H5MediaC.prototype.remov = function() {
		if(this.el) {
			this.data.elAppend.removeChild(this.el);
			this.el=null
		}
		return this;
	}

	window.H5MediaC = H5MediaC;
}()
if (typeof(module) !== 'undefined'){
    module.exports = window.H5MediaC;
}else if (typeof define === 'function' && define.amd) {
    define([], function () {
        'use strict';
        return window.H5MediaC;
    });
}