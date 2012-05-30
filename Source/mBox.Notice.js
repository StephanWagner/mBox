/*
---
description: With mBox.Notice you can show little notices to your visitors.

authors: Stephan Wagner

license: MIT-style

requires:
 - mBox
 - core/1.4.5: '*'
 - more/Element.Measure

provides: [mBox.Notice]

documentation: http://htmltweaks.com/mBox/Documentation/Notice
...
*/
 
mBox.Notice = new Class({
	
	Extends: mBox,
	
	options: {
		
		type: 'Default',			// the type of the notice (defaults to 'default'), possible types are: 'ok', 'error', 'info', 'notice'
		
		position: {					// to use the move tween (see below), position.y has to be 'bottom' or 'top' and both positions need to be 'inside'
			x: ['left', 'inside'],
			y: ['bottom', 'inside']
		},
												
		offset: {
			x: 30,
			y: 30
		},
		
		fixed: true,
		
		move: true,					// true will move the notice box from a window edge to its position instead of fading it (when opening)
		moveDuration: 500,			// duration of the move-tween
		
		delayClose: 4000,			// duration the notice will be visible
		
		fade: true,
		
		fadeDuration: {
			open: 250,
			close: 400
		},
		
		target: $(window),
		
		zIndex: 1000000,
		
		closeOnEsc: false,
		closeOnBoxClick: true,
		closeOnBodyClick: false,
		
		openOnInit: true
	},
	
	// initialize parent
	initialize: function(options) {
		this.defaultInOut = 'inside';
		this.defaultTheme = 'Notice';
		
		// add move events / options when initializing parent
		options.onSystemBoxReady = function() {
			this.container.addClass('mBoxNotice' + (this.options.type.capitalize() || 'Default'));
				
			if(this.options.move && (this.position.x[1] == 'inside' || this.position.x[0] == 'center') && this.position.y[1] == 'inside' && (this.position.y[0] == 'top' || this.position.y[0] == 'bottom')) {
				
				var wrapper_dimensions = this.wrapper.getDimensions({computeSize: true});
				
				this.container.setStyle('position', 'absolute');
				this.container.setStyle((this.position.y[0] == 'top' ? 'bottom' : 'top'), 0);
				
				this.wrapper.setStyles({
					height: 0,
					width: wrapper_dimensions.totalWidth,
					overflowY: 'hidden'
				});
				
				this.options.transition = {
					open: {
						transition: 'linear',
						property: 'height',
						duration: this.options.moveDuration,
						start: 0,
						end: wrapper_dimensions.totalHeight + this.options.offset.y
					}
				};
				
				this.options.offset.y = 0;
				
				this.options.delayClose += this.options.moveDuration;
			}
		};
		
		// close stored notice and save new one in window
		options.onSystemOpen = function() {
			if($(window).retrieve('mBoxNotice')) {
				$(window).retrieve('mBoxNotice').ignoreDelay = true;
				$(window).retrieve('mBoxNotice').close();
			}
			$(window).store('mBoxNotice', this);
		};
		
		// close notice automatically
		options.onSystemOpenComplete = function() {
			this.close();
		};
		
		// destroy notice when close is complete
		options.onSystemCloseComplete = function() {
			this.destroy();
		};
		
		// init parent
		this.parent(options);
	}
	
});