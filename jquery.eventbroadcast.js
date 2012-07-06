/*
* EventBroadcast - Enable Pub/Sub pattern in jQuery, event broadcasting
* v. 1.2 
*
* Created by Guido Bellomo (http://javascript-jedi.com)
* Licensed under the GPL (http://www.opensource.org/licenses/gpl-license.php).
*
* Author: Guido Bellomo (guido.bellomo@gmail.com)
*
* Example: 
* 
* Example
* $('#imageList')
*	.bind('hideImageList',function(evt) {
*		console.log(evt.data);
*		jQuery(this).hide();
*		})
*
* $.trigger('hideImageList');
*
* Cast the "hideImageList" message to all objects listening
* It's possible to include optional arguments the the message, will be available
* in the "data" property of event object.
*
*/
(function($) {

	var _bind = jQuery.fn.bind;
	var _on = jQuery.fn.on;
	var _unbind = jQuery.fn.unbind;
	var _one = jQuery.fn.one;
	var listeners = {};	
	
	// cleanup
	/*jQuery(function() {
		jQuery(window).bind('unload',function() {
			//delete listeners;		
			});
		});*/
	
	
	// Find a object inside a collection
	function findListener(strEvent,obj) {
		var result = -1;
		var i = 0;		
		if (listeners[strEvent] != null)
			for (i = 0; i < listeners[strEvent].length; i++) {
				if (listeners[strEvent][i] == obj) result = i; 
				}
		return result;
		}
	
	// Register a node to an event
	function registerListener(strEvent,obj) {	
		// Check if the array exists
		if (listeners[strEvent] == null) 
			listeners[strEvent] = [];
		// If not exists then append
		if (findListener(strEvent,obj) == -1) {
			listeners[strEvent].push(obj);
			}
		}
	
	function unregisterListener(strEvent,obj) {
		var idx =  findListener(strEvent,obj);
		// Remove element if exists
		if (idx != -1) {
			listeners[strEvent] = listeners[strEvent].slice(0,idx-1).concat(listeners[strEvent].slice(idx+1));
			}
		}
	
	
	function _broadcast(strEvent,params) {		
		//if (params === undefined) params = null;
		// If listeners are present
		if (listeners[strEvent] != null) {			
			// Trigger on each
			jQuery(listeners[strEvent]).each(function() {									
				jQuery(this).trigger(strEvent,params);
				});
			}		
		}
	
	
	jQuery.extend({
		
		broadcast: function(strEvent,params) {
			_broadcast(strEvent,params);
			},
		trigger: function(strEvent,params) {
			_broadcast(strEvent,params);
			},
		listeners: function(strEvent) {
			console.log('Listeners for '+strEvent);
			console.log(listeners[strEvent]);
			}
		
		});
	
	
	jQuery.fn.extend({
		
		unbind: function(strEvent,callback) {
			unregisterListener(strEvent,this);	
			_unbind.apply(this,arguments);
			return this;
			},
		
		one: function(strEvent,data,callBack) {
			// Register the listener
			jQuery(this).each(function() {
				// Register the listener
				registerListener(strEvent,this);
				});
			_one.apply(this,arguments);	
			return this;
			},

		
		bind:function(strEvent,data,callback) {
			// Register the listener
			jQuery(this).each(function() {
				// Register the listener
				registerListener(strEvent,this);			
				});
		
			_bind.apply(this,arguments);
		
			return this;
			},
		
		on:function(strEvent,data,callback) {
			// Register the listener
			jQuery(this).each(function() {
				// Register the listener
				registerListener(strEvent,this);			
				});
		
			_on.apply(this,arguments);
		
			return this;
			}
		
		});
	
})(jQuery);