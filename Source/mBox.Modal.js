/*
---
description: With mBox.Modal you can easily set up modal dialog windows.

authors: Stephan Wagner

license: MIT-style

requires:
 - mBox
 - core/1.4.5: '*'
 - more/Element.Measure

provides: [mBox.Modal]

documentation: http://htmltweaks.com/mBox/Documentation/Modal
...
*/
 
mBox.Modal = new Class({
	
	Extends: mBox,
	
	options: {
		event: 'click',
		
		target: $(window),
		
		position: {
			x: ['center', 'inside'],
			y: ['center', 'inside']
		},
		
		fixed: true,
		draggable: true,
		
		overlay: true,
		overlayStyles: {
			color: 'white',
			opacity: 0.001
		},
		
		closeInTitle: true,
		
		buttons: null					// you can add buttons into the footer by defining them as following:
										// buttons: [{value: 'Cancel', addClass: 'button_cancel'},
										//			 {value: 'Submit', addClass: 'button_submit', setStyles: {'margin-left': 10}, event: function() { alert('form submitted'); }, id: 'submit_button'}]
	},
	
	// initialize parent
	initialize: function(options) {
		this.defaultInOut = 'inside';
		this.defaultTheme = 'Modal';
		
		// add buttons once constructed
		if(options.buttons) {
			options.onSystemBoxReady = function() {
				this.addButtons(options.buttons);
			}
		}
		
		// set options
		this.parent(options);
	},
	
	// add buttons into footer
	addButtons: function(buttons) {
		if(typeof buttons != 'object') return false;
		
		this.setFooter('');
		
		this.buttonContainer = new Element('div', {'class': 'mBoxButtonContainer'}).inject(this.footerContainer, 'top');
		
		buttons.each(function(button, index) {
			new Element('button', {
				id: (button.id || ''),
				html: '<label>' + (button.value || button.title) + '</label>',
				'class': 'mBoxButton ' + (button.addClass || '') + ' ' + (index == 0 ? 'mBoxButtonFirst' : (index == (buttons.length - 1) ? 'mBoxButtonLast' : '')),
				styles: (button.setStyles || {}),
				events: {
					'mouseup': (button.event || this.close).bind(this)
				}
			}).inject(this.buttonContainer);
		}.bind(this));
		
		new Element('div', {styles: {clear: 'both'}}).inject(this.footerContainer, 'bottom');
		
		return this;
	}
	
});