**Eventbroadcast** it's a small plugin to improve the functionality of **bind()**/**trigger()**: the method *$.trigger(<event_name>)* (without a selector) triggers the event *\<event\_name\>* on all elements previously registered to the event through *.bind()* and *.one()*.

The main problem with the classic jQuery
*$(<css-selector>).trigger()* method is that must be used on the element that receives the events, leaving the [Publish/Subscribe pattern](http://en.wikipedia.org/wiki/Publish subscribe_pattern) uncomplete: we need to programmatically know the elements to cast the event to.

With the **Publish/Subscribe pattern** it's easy to decouple the code in charge to create the event from the code that receives it: the event emitter doesn't know (and doesn't care), at runtime, who is listening to the event (speaking with the words of academics, it's not aware of the topology of the elements).
 **The more the code is decoupled, the more is maintanable.**

##An example in the real world

Suppose you have a login/logout dialogs in Javascript and several HTML fragments that must be updated based on session changes, for example:

- when the user logs in, we need to update the username box with name of the user and hide the "Login button"
- when the user logs out, we need to update the username box with "anonymous" and show the "Login button"

Below is the pseudo-code for this:

	function doLogin() { 
		$.ajax('/user/login', {
			username: 'my_username', 
			password: 'my_password'
			}, 
			function (result) { 
				if (!result.error)	
					$.trigger('login',result.username); 
				} 
			); 
		}
	function doLogout() { 
		$.getJSON('/user/logout',
			function(result) { 
				if (!result.error) { 
					$.trigger('logout'); 
					} 
				} 
		} // [...]
	$('a.btnLogin')
		.bind('login',function(evt) { 
			// hide the login button
			$(this).hide();
			}) 
		.bind('logout',function(evt) { 
			// hide the login button
			$(this).show(); 
			}); // [...]
	$('div.username')
		.bind('login',function(evt,username) { 
			// update the username box
			$(this).html(username);
			})
		.bind('logout',function(evt,username) { 
			// update the username box
			$(this).html('Anonymous'); 
			});

Here we have two events,**login** and **logout**, triggered at the end of *doLogin()* and *doLogout()* operations. In this way the login/logout ajax operations are completely decoupled from the view: doLogin() and doLogout() don't have to know where to put datas (for example the jQuery CSS selectors of the elements), they just fire events!
If the layout changes and box/buttons move around the page, everything will still work.
