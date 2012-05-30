/*
---
description: With mBox.Modal.Confirm you can attach confirm dialogs to links or other DOM elements.

authors: Stephan Wagner

license: MIT-style

requires:
 - mBox
 - mBox.Modal
 - core/1.4.5: '*'
 - more/Element.Measure

provides: [mBox.Modal.Confirm]

documentation: http://htmltweaks.com/mBox/Documentation/Modal
...
*/
 
mBox.Modal.Confirm = new Class({
	
	Extends: mBox.Modal,
	
	options: {
		
		addClass: {
			wrapper: 'Confirm'
		},
		
		buttons: [
			{ addClass: 'mBoxConfirmButtonCancel' },
			{ addClass: 'button_green mBoxConfirmButtonSubmit', event: function(ev) { this.confirm(); } }
		],
		
		confirmAction: function() {}, 			// action to perform when no data-confirm-action and no href given
		
		preventDefault: true,
		
		constructOnInit: true
	},
	
	// initialize and add confirm class
	initialize: function(options) {
		this.defaultSubmitButton = 'Yes';		// default value for submit button
		this.defaultCancelButton = 'No';		// default value for cancel button
		
		// destroy mBox when finished closing
		options.onSystemCloseComplete = function() {
			this.destroy();
		};
		
		// add buttons once constructed
		options.onSystemBoxReady = function() {
			this.addButtons(this.options.buttons);
		}
		
		// set options
		this.parent(options);
	},
	
	// submit the confirm and close box
	confirm: function() {
		eval(this.options.confirmAction);
		this.close();
	}
});

// add confirm-events to all elements with attribute 'data-confirm'
mBox.addConfirmEvents = function() {
	$$('*[data-confirm]').each(function(el) {
		if(!el.retrieve('hasConfirm')) {
			var attr = el.getAttribute('data-confirm').split('|'),
				action = el.getAttribute('data-confirm-action') || (el.get('href') ? 'window.location.href = "' + el.get('href') + '";' : 'function() {}');
			
			el.addEvent('click', function(ev) {
				ev.preventDefault();
				if(confirm_box) {
					confirm_box.close(true);
				}
				var confirm_box = new mBox.Modal.Confirm({
					content: attr[0],
					confirmAction: action,
					onOpen: function() {
						if(!this.footerContainer) { return;
							this.setFooter(null);
						}
						this.footerContainer.getElement('.mBoxConfirmButtonSubmit').set('html', '<label>' + (attr[1] || this.defaultSubmitButton) + '</label>');
						this.footerContainer.getElement('.mBoxConfirmButtonCancel').set('html', '<label>' + (attr[2] || this.defaultCancelButton) + '</label>');
					}
				}).open();
			});
			el.store('hasConfirm', true);
		}
	});
}
window.addEvent('domready', function() { mBox.addConfirmEvents(); });
