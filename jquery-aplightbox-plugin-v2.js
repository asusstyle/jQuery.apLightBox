;(function($){

var AP = window.AP || {};
AP.vars = {elm:'', aLink:'', aTarget:'', aTitle:'', lilWin:'', container:'', wrapperHeight:'', docWidth:'', divWidth:'', docHeight:'', divHeight:'', aLeft:'', aTop:'', tempTop:'', tempLeft:''};
AP.defaults = {
	height:'60%',			// Height of the lightbox window can be in px, % or em etc...
	width:'60%',			// Width of the lightbox window can be in px, % or em etc...
	animation:false,		// DEFAULT = false, OPTION = true & false
		direction:'top',		// IF ANIMATION = true, DEFAULT = top, OTHER OPTIONS = top, bottom, left & right
		time:700,				// IF ANIMATION = true, DEFAULT = 700, YOU CAN SET TIME IN MILISECONDS
	display:'show',			// DEFAULT = show, OPTION = fade & show
		duration:500,			// IF DISPLAY = fade, YOU CAN SET DURATION IN MILISECONDS, DEFAULT = 500
	top:'',					// DEFAULT = center, OPTION = postion from top in pixel
	left:'',				// DEFAULT = center, OPTION = postion from left in pixel
	title:false,			// DEFAULT = false, OPTION = true & false
		titlePos:'bottom',		// IF TITLE = true, YOU CAN SET POSITION OF TITLE, DEFAULT = bottom, OPTIONS = top & bottom
	customClass:'',			// DEFAULT = blank, YOU CAN SET ONE OR MORE CLASS FOR SPECIFIC CSS
	apLightBoxLoaded: function(){}
};

AP.css = "<style id='alightbox-css'>.noOverflow{overflow:hidden;}#alightbox-wrapper{display:none;position:absolute;top:0;left:0;width:100%;min-height:100%;background-color:#6A6A6A;opacity:0.9;z-index:1000;}.alightbox-container{position:absolute;margin:0 auto;background-color:#FFF;z-index:1001;padding:20px;border-radius:15px;box-shadow:5px 5px 2px #666;}.alightbox-container .video,.alightbox-container .external,.alightbox-container .external-div{overflow-y:auto;height:100%;width:100%;}.alightbox-container .btnclose{display:block;position:absolute;top:-7px;right:-7px;border-radius:15px;background-color:#930;color:#FFF;font-weight:bold;font-family:sans-serif;width:19px;text-align:center;cursor:pointer;box-shadow:2px 2px 2px #000;}.alightbox-container .atitle{position:absolute;display:inline-block;padding:5px 10px;background-color:#333;border:2px solid #FFF;color:#FFF;border-radius:10px;font-size:80%;}</style>";

AP.functions = {
	init : function(selector, settings){
		// Add CSS related to LightBox window
		if($("#alightbox-css").length <= 0) $("head").prepend(AP.css);
		
		// Add click event on element
		$(selector).click(function(e){
			e.preventDefault();				// Prevent Default Click Event
			AP.vars.elm = $(this);
			AP.vars.aLink = AP.vars.elm.attr("href");
			AP.vars.aTarget = AP.vars.elm.data("target");
			AP.vars.aTitle = AP.vars.elm.attr("title");
			
			AP.functions.displayError(settings)	? alert(settings.display + " is not proper display property.")
												: AP.functions.loadWrapper(settings);

			// Close Lightbox window
			$("#alightbox-wrapper, .alightbox-container .btnclose").click(function(){
				AP.functions.closeLightBox(settings);
			});
			AP.functions.closeWithEcsKey(settings);
		});
	},
	displayError : function(settings){
		if(settings.display != 'show' && settings.display != 'fade'){
			return true;
		} else {
			return false;
		}
	},
	loadWrapper : function(settings){
		$("body").append("<div id='alightbox-wrapper' />");
		AP.vars.wrapperHeight = $(document).height();
		$("#alightbox-wrapper").css("height",AP.vars.wrapperHeight);
		$("body").append("<div class='alightbox-container' />");
		$(".alightbox-container").addClass(settings.customClass).append("<span class='btnclose'>X</span>");

		// Get Top & Left Value for Lightbox
		AP.vars.container	= $(".alightbox-container");

		AP.vars.container.css({		// Set Custom Height & width
			"height":settings.height,
			"width"	:settings.width
		});

		AP.vars.docWidth	= $(document).width();
		AP.vars.divWidth	= AP.vars.container.innerWidth();
		AP.vars.docHeight	= $(window).height();
		AP.vars.divHeight	= AP.vars.container.innerHeight();
		AP.vars.aLeft		= (AP.vars.docWidth/2 - AP.vars.divWidth/2) + window.pageXOffset;
		AP.vars.aTop		= (AP.vars.docHeight/2 - AP.vars.divHeight/2) + window.pageYOffset;
		AP.vars.tempTop		= AP.vars.aTop + AP.vars.docHeight;
		AP.vars.tempLeft	= AP.vars.aLeft + AP.vars.divWidth;
		
		AP.functions.showContainer(settings);
	},
	showContainer : function(settings){
		$("body").addClass("noOverflow");
		AP.vars.container.css({		// Set custom position
			"top"	:(settings.top	!= '' ? settings.top	: AP.vars.aTop)+"px",
			"left"	:(settings.left	!= '' ? settings.left	: AP.vars.aLeft)+"px"
		});
		if(settings.animation){
			switch(settings.direction){
				case 'bottom' :
					AP.vars.container.css({"top": AP.vars.tempTop +"px", opacity:0});
					AP.vars.container.animate({
						top:"-="+ AP.vars.docHeight +"px",
						opacity:1
					}, settings.time);
					break;
				case 'left' :
					AP.vars.container.css({"left":"-"+ AP.vars.divWidth +"px", opacity:0});
					AP.vars.container.animate({
						left:"+="+ AP.vars.tempLeft +"px",
						opacity:1
					}, settings.time);
					break;
				case 'right' :
					AP.vars.container.css({"left": AP.vars.tempLeft +"px", opacity:0});
					AP.vars.container.animate({
						left:"-="+ AP.vars.divWidth +"px",
						opacity:1
					}, settings.time);
					break;
				default :
					AP.vars.container.css({"top":"-"+ AP.vars.docHeight +"px", opacity:0});
					AP.vars.container.animate({
						top:"+="+ AP.vars.tempTop +"px",
						opacity:1
					}, settings.time);
					break;
			}
		}
		if(settings.display == 'show'){
			$("#alightbox-wrapper, .alightbox-container").show();
		} else{
			$("#alightbox-wrapper, .alightbox-container").fadeIn(settings.duration);
		}
		
		AP.functions.loadContent(settings);
	},
	loadContent : function(settings){
		switch(AP.vars.aTarget){
			case 'internal' :
				AP.vars.container.append($(AP.vars.aLink).html());
				break;
			case 'external' :
				AP.vars.container.append("<div class='external' />");
				$(".external").load(AP.vars.aLink, function(response, status, xhr) {
					if (status == "error"){
						var msg = "Sorry, there's an error: ";
						$(".external").html(msg + xhr.status + " " + xhr.statusText);
					}
				});
				break;
			case 'external-div' :
				var aUrl = AP.vars.aLink.split("#");

				AP.vars.container.append("<div class='external-div' />");
				$(".external-div").load(aUrl[0] +" #"+ aUrl[1], function(response, status, xhr) {
					if (status == "error"){
						var msg = "Sorry, there's an error: ";
						$(".external-div").html(msg + xhr.status + " " + xhr.statusText);
					}
				});
				break;
			case 'video' :
				AP.vars.container.append("<div class='video' />");
				$(".video").append("<iframe src='"+ AP.vars.aLink +"' width='99.5%' height='98%' scrolling='no' marginheight='0' marginwidth='0' frameborder='0'>Your browser does not support iFrame, to see content please get an iFrame supported browser.</iframe>");
				break;
			default :
				alert("You have forget to add 'data-target' attribut in link.");
				AP.functions.closeLightBox(settings);
		}
		
		settings.title ? AP.functions.showTitle(settings.titlePos) : '';
	},
	showTitle : function(titlePos){
		AP.vars.container.append("<div class='atitle' />");
		$(".atitle").text(AP.vars.aTitle);
		var tLeft = $(".atitle").width(),
			winWidth = AP.vars.container.width(),
			titleLeft = winWidth/2 - tLeft/2;
		
		// check if the position is 'top' or 'bottom'
		titlePos == "bottom"	? $(".atitle").css({"bottom":"-35px", "left":titleLeft +"px"})
								: $(".atitle").css({"top":"-35px", "left":titleLeft +"px"});
	},
	closeWithEcsKey : function(settings){
		$(document).keyup(function(e){
			if(e.keyCode == 27) AP.functions.closeLightBox(settings);
		});
		$(document).keypress(function(e){
			if(e.keyCode == 27) AP.functions.closeLightBox(settings);
		});
	},
	closeLightBox : function(settings){
		if(settings.animation){
			switch(settings.direction){
				case 'bottom' :
					AP.vars.container.animate({
						top:'+='+ AP.vars.docHeight +"px",
						opacity:0
					}, settings.time, function(){
						AP.functions.clearLightBox();
					});
					break;
				case 'left' :
					AP.vars.container.animate({
						left:'-='+ AP.vars.tempLeft +"px",
						opacity:0
					}, settings.time, function(){
						AP.functions.clearLightBox();
					});
					break;
				case 'right' :
					AP.vars.container.animate({
						left:'+='+ AP.vars.divWidth +"px",
						opacity:0
					}, settings.time, function(){
						AP.functions.clearLightBox();
					});
					break;
				default :
					AP.vars.container.animate({
						top:'-='+ AP.vars.tempTop +"px",
						opacity:0
					}, settings.time, function(){
						AP.functions.clearLightBox();
					});
			}
		}else{
			if(settings.display == 'show'){
				$("#alightbox-wrapper, .alightbox-container").hide();
				AP.functions.clearLightBox();
			}else{
				$("#alightbox-wrapper, .alightbox-container").fadeOut(settings.duration, function(){
					AP.functions.clearLightBox();
				});
			}
		}
	},
	clearLightBox : function(){
		$("#alightbox-wrapper, .alightbox-container").remove();
		$("body").removeClass("noOverflow");
	}
};

$.fn.apLightBox = function(options){
	var settings = $.extend({}, AP.defaults, options);
	
	return this.each(function(){
		var _this	= $(this),
			lilWin = $(_this.attr("href")).hide();
			
		AP.functions.init(_this, settings);
	});
};

})(jQuery);