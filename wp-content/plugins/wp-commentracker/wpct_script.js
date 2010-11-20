function wpct_bookmarklet() {
  console.log('Testing whether jQuery is loaded (' + !!(typeof jQuery == 'function') + ')');

  if (waitingForScript('http://code.jquery.com/jquery-latest.pack.js', 'jQuery')) return;
  console.log('Do some action with jQuery');
  
  if (waitingForScript('http://trentrichardson.com/Impromptu/scripts/jquery-impromptu.1.4.js', 'Impromptu')) return;
  console.log('Do some action with jQuery Impromptu');
  
}

/**
* Only returns true when the external script has been loaded
* in to the DOM.  It uses arguments.callee.caller to work out
* which function is the callback.
*
* @param url {String} URL of external script
* @param obj {String} The name of a function or variable within
* the external script to test for.
* @license: Creative Commons License - 
*   ShareAlike http://creativecommons.org/licenses/by-sa/3.0/
* @author Remy Sharp / leftlogic.com
*/
function waitingForScript(url, obj) {
  function lateLoader(u,id,test,fn){            
	var d = document;
	if (!d.getElementById(id)) {
	  var s = d.createElement('script');
	  s.src = u;
	  s.id = id;
	  d.body.appendChild(s);
	}

	var timer = setInterval(function (){
	  var ok = false;
	  try {
		ok = test.call();
	  } catch(e) {}

	  if (ok) {
		clearInterval(timer);
		fn.call();
	  }
	}, 10);
  }

  var callback = arguments.callee.caller;

  if ((typeof window[obj] == 'undefined') && !window['loading' + obj]) {
	window['loading' + obj] = true;
	lateLoader(url, '_' + obj, function () {
	  return (typeof window[obj] != 'undefined');
	}, callback);
	return true;
  } else if (typeof window[obj] == 'undefined') {
	return true;
  } else {
	return false;
  }
}

// http://noteslog.com/post/how-to-download-scripts-and-stylesheets/

function load_stylesheet(uri) { 
	if (document.createElement) { 
		var e = document.createElement("link"); 
		e.rel = "stylesheet"; 
		e.type = "text/css"; 
		e.href = uri; 
		document.getElementsByTagName("head")[0].appendChild(e); 
	} 
}; 

wpct_bookmarklet();

load_stylesheet('http://junyent.org/blog/wp-content/plugins/wp-commentracker/wpct_styles.css');
console.log('CSS loaded');


var wpct_title = document.title;
var wpct_textarea = "";
var wpct_obj = null;
var wpct_url = location.href;
var wpct_blog = document.title;
var wpct_blogurl = wpct_url;
var wpct_rss = wpct_url + '/feed/';
var wpct_tags = "";
var wpct_user = "";
var wpct_pass = "";

wpct_obj = document.getElementsByTagName('textarea')[0];
	if (wpct_obj.value.length > 0) {  
		wpct_textarea = wpct_obj.value;            
	}

if (wpct_textarea.length > 0) {
	   var form = 'Is this?'+
				'<div class="field"><label for="edittitle">Title</label><input type="text" id="edittitle" name="edittitle" value="'+ wpct_title +'" /></div>'+
				'<div class="field"><label for="editurl">URL</label><input type="text" id="editurl" name="editurl" value="'+ wpct_url +'" /></div>'+
				'<div class="field"><label for="editblog">Blog</label><input type="text" id="editblog" name="editblog" value="'+ wpct_blog +'" /></div>'+
				'<div class="field"><label for="editblogurl">Blog URL</label><input type="text" id="editblogurl" name="editblogurl" value="'+ wpct_blogurl +'" /></div>'+
				'<div class="field"><label for="editrss">RSS URL</label><input type="text" id="editrss" name="editrss" value="'+ wpct_rss +'" /></div>'+
				'<div class="field"><label for="editcomment">Text</label><textarea id="edittext" name="edittext" cols="40" rows="4">'+ wpct_textarea +'</textarea></div>'+
				'<div class="field"><label for="edittags">Tags</label><input type="text" id="edittags" name="edittags" value="'+ wpct_tags +'" /></div>'+
				'<div class="field"><label for="edituser">User</label><input type="text" id="edituser" name="edituser" value="'+ wpct_user +'" /></div>'+
				'<div class="field"><label for="editpass">Password</label><input type="text" id="editpass" name="editpass" value="'+ wpct_pass +'" /></div>';

	   $.prompt(form, 
	   				{
						buttons:{OK:true, Cancel:false},
						callback: function(v,m){
							var title = m.find('#edittitle').val();
							var url = m.find('#editurl').val();
							var blog = m.find('#editblog').val();
							var blogurl = m.find('#editblogurl').val();
							var rss = m.find('#editrss').val();
							var text = m.find('#edittext').val();
							var tags = m.find('#edittags').val();
							var user = m.find('#edituser').val();
							var pass = m.find('#editpass').val();
   
							if(v){
									wpct_title = title;
									wpct_url = url;
									wpct_blog = blog;
									wpct_blogurl = blogurl;
									wpct_rss = rss;
									wpct_textarea = text;
									wpct_tags = tags;
									wpct_user = user;                               
									wpct_pass = pass;
   									
									data='user='+ encodeURIComponent(user) +'&pass='+ encodeURIComponent(pass) +'&title='+ encodeURIComponent(title) +'&url='+ encodeURIComponent(url) +'&blog='+ encodeURIComponent(blog) +'&blogurl='+ encodeURIComponent(blogurl) +'&rss='+ encodeURIComponent(rss) +'&text='+ encodeURIComponent(text) +'&tags='+ encodeURIComponent(tags);
									wpct_trackerurl = 	wpct_baseurl + '/wp-content/plugins/wp-commentracker/wpct_tracker.php';
									
									$.get(wpct_trackerurl, data, function(data) {$.prompt('yuhoo!');});
									
   
						}else{ $.prompt('An Error Occured'); }							
					}
	});
}	