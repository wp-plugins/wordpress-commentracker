 if (!self.cocomment)
 var cocomment = {}; 
 cocomment.url = "http://www.cocomment.com/";
 cocomment.windowcolors = ['f0f4f5']; 
 cocomment.loginURL = cocomment.url + "LoginServlet"; 
 cocomment.server = cocomment.url + "SubmitServlet"; 
 cocomment.fetchlet = document.getElementById('cocomment-fetchlet');
 if (cocomment.fetchlet) { 
	cocomment.switchOff = cocomment.fetchlet.getAttribute('switchOff') ? true : false;
	cocomment.suppressLogin = cocomment.fetchlet.getAttribute('suppressLogin') ? true : false;
	cocomment.trackAllComments = cocomment.fetchlet.getAttribute('trackAllComments') ? true : false;
	cocomment.ignoreSelectedText = cocomment.fetchlet.getAttribute('ignoreSelectedText') ? true : false;
	cocomment.ignoreGenericPages = cocomment.fetchlet.getAttribute('ignoreGenericPages') ? true : false;
	cocomment.ignoreGenericForms = cocomment.fetchlet.getAttribute('ignoreGenericForms') ? true : false; 
}
var cocomment_force;
var cocomment_debugging;
 var cocomment_logging;
 cocomment.skipping = false;
 cocomment.webs = new Object();
 var blogTool;
 var commentFormID;
 var commentFormName;
 var commentFormNumber;
 var commentButtonName;
 var commentTextFieldName;
 var commentAuthor;
 var commentAuthorFieldName;
 var blogTitle;
 var blogURL;
 var postTitle;
 var postURL;
 var commentAuthorLoggedIn;
  
 cocomment.startup = function() {
	if(parent != self) return;
	cocomment.disable(true);
	if(cocomment.switchOff) {
		if (cocomment.trackAllComments) cocomment.skipping = true;
		else return; 
		}
	cocomment.suppressLogin = (cocomment_force == false && !cocomment.trackAllComments) ? true : cocomment.suppressLogin;
	cocomment.debugging = cocomment_debugging;
	cocomment.logging = cocomment_logging;
	cocomment.logMessages = new Array();
	cocomment.enabled = false;
	cocomment.off = false;
	cocomment.blog = cocomment.webs['generic'];
	cocomment.noQuickTags = false;
	cocomment.submitting = false;
	cocomment.dataCollected = false;
	cocomment.urlLength = 2000;
	cocomment.sendToCoCommentOnly = false;
	cocomment.pngfix = /MSIE ((5\.5)|[6789])/.test(navigator.userAgent) && navigator.platform == "Win32";
	cocomment.addLogging(); cocomment.addStyleSheet(null, "cocomment");
	cocomment.someone = 'Not&nbsp;logged&nbsp;in';
	cocomment.blog = cocomment.detectBlog();
	if(cocomment.blog.noform && !cocomment.extractSelection()) cocomment.unsupported("nothing to capture or enable", "unknown");
	else if(cocomment.ignoreGenericForms && cocomment.blog.name != "unknown" && !cocomment.checkCompletion()) cocomment.unsupported("detected blog but form is generic", "unknown");
	else { 
		cocomment.log("detected blog " + cocomment.blog.name, "info");
		cocomment.login();
		if (cocomment.extractSelection()) cocomment.showCompletion(); 
		}
};

cocomment.toggle = function() {
	if(cocomment.off) cocomment.unsupported("repeatedly not found matching blog", "unknown");
	if (cocomment.skipping) cocomment.skipping = false;
	if(cocomment.enabled) {
		if(cocomment.trackAllComments) cocomment.skipping = true;
		cocomment.disable(); 
		}
	else cocomment.enable();
	if (cocomment.extractSelection(true)) {
		if(!cocomment.enabled) cocomment.enable();
		cocomment.showCompletion(); 
		}
};
cocomment.enable = function() {
	if(cocomment.off) return;
	if(cocomment.enabled) {
		cocomment.log("cocomment already enabled", "warning"); return;
		}
	if(!cocomment.blog) {
		cocomment.unsupported("no matching blog found when enabling", "unknown"); return;
		}
	var form = cocomment.getForm();
	if(!form) {
		cocomment.log("form not found", "error");
		return;
		}
	cocomment.enabled = true;
	if(!cocomment.nickName) cocomment.login();
	var current = cocomment.getFormButton(form);
	if(current) {
		cocomment.log("adding logo to page", "info");
		var box = document.getElementById('cocomment-minibar');
		if (box) box.parentNode.removeChild(box);
			box = document.createElement("table");
			box.className = "cocomment-minibar";
			box.id = "cocomment-minibar";
		var body = document.createElement("tbody");
		var row = document.createElement("tr");
		row.id = 'cocomment-optionsButtonRow';
		var cell = document.createElement("td");
		cell.id = "cocomment-user";
		var buttonStatus = cocomment.checkCompletion() ? 'y' : 'n';
		if (buttonStatus == 'n') cocomment.fetch(cocomment.server, {unsupported : document.URL, blog : cocomment.blog.name, message : 'Extraction failed.' });
		if (cocomment.skipping || (cocomment.trackAllComments && cocomment.nickName == cocomment.someone)) buttonStatus = 'e';
		cell.style.backgroundImage = "url(" + cocomment.url + "images/float/b"+ buttonStatus +".png)";
		if (cocomment.pngfix) {
			cell.style.backgroundImage = "";
			cell.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + cocomment.url + "images/float/b"+ buttonStatus +".png')"; 
			}
		if (cocomment.noQuickTags) cell.style.width = '140px';
		if (!(cocomment.skipping || (cocomment.trackAllComments && cocomment.nickName == cocomment.someone))) cell.innerHTML = cocomment.nickName == undefined ? cocomment.someone : cocomment.nickName;
		cell.onclick = function() {
			cocomment.toggleOptions()};
			var tagsCell = document.createElement("td");
			tagsCell.id = "cocomment-tags";
			tagsCell.style.backgroundImage = "url(" + cocomment.url + "images/float/bt.png)";
			if (cocomment.pngfix) {
				tagsCell.style.backgroundImage = "";
				tagsCell.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + cocomment.url + "images/float/bt.png')"; 
				}
			tagsCell.innerHTML = '<input type="text" ' +'id="cocomment_tags" ' +'title="Keywords to be associated with your comment" ' +'onkeyup="cocomment.checkTags(this);" />';
			row.appendChild(cell);
			var quickTagsRow = document.createElement("tr");
			quickTagsRow.id = 'cocomment-quickTagsRow';
			quickTagsRow.appendChild(tagsCell);
			body.appendChild(row);
			if (cocomment.noQuickTags || cocomment.skipping || (cocomment.trackAllComments && cocomment.nickName == cocomment.someone)) quickTagsRow.style.visibility = 'hidden';
			body.appendChild(quickTagsRow);
			box.appendChild(body);
			current.parentNode.insertBefore(box, current.nextSibling);
			current._onclick = current.onclick;
			current.onclick = function() {
				cocomment.submitting = true;
				if(this._onclick) this._onclick() 
				}; 
		} 
		else cocomment.log("could not find submit button", "error");
		if(form.submit.style) { 
			var field = form.submit;
			var sibling = field.nextSibling;
			var parent = field.parentNode;
			field = parent.removeChild(field);
			form._submit = form.submit;
			form.submit = cocomment.submit;
			parent.insertBefore(field, sibling);
			} 
		else { form._submit = form.submit; form.submit = cocomment.submit; }
		form._onsubmit = form.onsubmit; 
		form.onsubmit = cocomment.onsubmit; 
		cocomment.log("enabled cocomment", "info"); 
};

 cocomment.updateButtonStatus = function() {
	if(document.getElementById('cocomment-user')) {
		var cell = document.getElementById('cocomment-user');
		var buttonStatus = cocomment.checkCompletion() ? 'y' : 'n';
		if (buttonStatus == 'n') cocomment.fetch(cocomment.server, {unsupported : document.URL, blog : cocomment.blog.name, message : 'Extraction failed.' });
		if (cocomment.skipping || (cocomment.trackAllComments && cocomment.nickName == cocomment.someone)) buttonStatus = 'e';
		cell.style.backgroundImage = "url(" + cocomment.url + "images/float/b"+ buttonStatus +".png)";
		if (cocomment.pngfix) { cell.style.backgroundImage = "";
			cell.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + cocomment.url + "images/float/b"+ buttonStatus +".png')";
			}
		var quickTagsRow = document.getElementById('cocomment-quickTagsRow');
		if (cocomment.noQuickTags || cocomment.skipping || (cocomment.trackAllComments && cocomment.nickName == cocomment.someone)) quickTagsRow.style.visibility = 'hidden';
		else quickTagsRow.style.visibility = 'visible';
		}
};

cocomment.unsupported = function(inMessage, inBlog) {
	cocomment.off = true;
	cocomment.disable(); 
	};

cocomment.disable = function(startup) { 
	cocomment.enabled = false;
	cocomment.submitting = null;
	cocomment.dataCollected = null;
	cocomment.nickName = null;
	var cocobox = document.getElementById('cocomment-minibar');
	if(cocobox) cocobox.parentNode.removeChild(cocobox);
	if (cocomment.blog) { var form = cocomment.getForm();
	if (form) { 
		if(form.submit.style) {
			var field = form.submit;
			var sibling = field.nextSibling;
			var parent = field.parentNode;
			field = parent.removeChild(field);
			form.submit = form._submit;
			parent.insertBefore(field, sibling); 
			}
		else { form.submit = form._submit; } 
		form.onsubmit = form._onsubmit;
		var current = cocomment.getFormButton(form);
		if (current) { current.onclick = current._onclick; } 
		} 
	} 
	cocomment.log("cocomment disabled", "info");
	if(cocomment.aboutWindow) { cocomment.aboutWindow.parentNode.removeChild(cocomment.aboutWindow); cocomment.aboutWindow = null; } 
	if(cocomment.loginWindow) { cocomment.loginWindow.parentNode.removeChild(cocomment.loginWindow); cocomment.loginWindow = null; } 
	if(cocomment.confirmationWindow) { cocomment.confirmationWindow.parentNode.removeChild(cocomment.confirmationWindow); cocomment.confirmationWindow = null; }
	if(cocomment.completionWindow) { cocomment.completionWindow.parentNode.removeChild(cocomment.completionWindow); cocomment.completionWindow = null; } 
	if(cocomment.optionsWindow) { cocomment.optionsWindow.parentNode.removeChild(cocomment.optionsWindow); cocomment.optionsWindow = null; } 
	if(cocomment.skipping && !startup) cocomment.startup(); 
};

cocomment.showAbout = function() {
	if(!cocomment.aboutWindow) {
	cocomment.aboutWindow = cocomment.addWindow( "cocomment-about", "cocomment-about", "<nobr>Clear conversation<br /> in the blogosphere</nobr>", '<div class="cocomment-about-teaser">' +'<p>Turn your comments into conversations,<br />' +'no blog needed, just participate!</p>' +'<p><a target="_blank" ' +'href="http:\/\/www.cocomment.com/learnmore">' +'Learn more &raquo;</a></p>' +'</div>' +'<div class="cocomment-about-credits">' +'<a href="http:\/\/cocomment.com/" ' +'target="_blank">coComment</a> ' +'Version 0.4c<br />\n' +'<div/>', cocomment.closeAbout);
	if (cocomment.pngfix) {
		if (document.documentElement && document.documentElement.scrollTop) document.getElementById("cocomment-about").style.top = document.documentElement.scrollTop + 200 +'px';
		else if (document.body) document.getElementById("cocomment-about").style.top = document.body.scrollTop + 200 + 'px'; 
		}
	document.getElementById("cocomment-about").style.left = '100px'; 
	}
	cocomment.aboutWindow.style.visibility = "visible"; 
};

cocomment.toggleAbout = function() {
	if(!cocomment.aboutWindow) cocomment.showAbout();
	else { 
		if(cocomment.aboutWindow.style.visibility == "visible") cocomment.aboutWindow.style.visibility = "hidden";
		else cocomment.aboutWindow.style.visibility = "visible"; 
		} 
};

cocomment.closeAbout = function() { return true; };

cocomment.showCompletion = function() {
	if(!cocomment.completionWindow) {
		var selectedText = cocomment.extractSelection(true);
		var textRow = (selectedText) ? '<tr><td align="right" nowrap="nowrap" valign="top" ' +'class="cocomment-comment">' +'Comment:</td><td colspan="2"><textarea id="text">' + selectedText +'</textarea></td></tr>' : '';
		if (selectedText) cocomment.sendToCoCommentOnly = true;
		var values = cocomment.extractAllData();
		var makeRow = function(rowName,rowId,helpText,optional) { 
			helpText = helpText ? ' title="'+ helpText +'"' : '';
			var rowClass = optional ? ' class="cocomment-optional"' : ' class="cocomment-required"';
			var rowValue = (document.getElementById('cocomment_'+ rowId) && document.getElementById('cocomment_'+ rowId).value) ? document.getElementById('cocomment_'+ rowId).value : (document.getElementById('cocomment_options') && document.getElementById('cocomment_options')[rowId]) ? document.getElementById('cocomment_options')[rowId].value : ( values[rowId] && values[rowId] != '(undefined)') ? values[rowId].toString().replace(/\x022/g,'&quot;') : '';
			if ((rowValue.toString().indexOf('http:\/\/') && rowValue.toString().indexOf('https:\/\/')) && (rowId == 'posturl' || rowId == 'blogurl')) rowValue = 'http:\/\/'+ rowValue;
			return '<tr><td align="right"'+ rowClass + helpText +' nowrap="nowrap">' + rowName +':</td><td'+ helpText +'>' +'<input type="text" id="'+ rowId +'" ' + ( rowId=='tags' ? ' onkeyup=\"cocomment.checkTags(this);\" ' : ' no ') +'value="'+ rowValue +'" /></td><td class="cocomment-fieldaddition"'+helpText+'>' +'<img height"11" width="11" border="0" src="' + cocomment.url +'images/float/help11x11.gif"></td></tr>';
			};
		cocomment.completionWindow = cocomment.addWindow( "cocomment-completion", "cocomment-completion", "Capturing...", '<form id="cocomment_completion" onsubmit="cocomment.submit()">' +'<table border="0">' +'<tr><td colspan="3">' +'<div class="cocomment-window-text">' +'Before this comment can be added to coComment, ' +'please complete and verify the fields below:<br /><br /></div>' +'</td></tr>' + textRow + makeRow('Blog name','blogtitle','Name of this blog') + makeRow('Blog URL','blogurl','Main URL of this blog') + makeRow('Title','posttitle','Title of the article that is being commented') + makeRow('Permalink','posturl','URL of the article that is being commented') +'<tr><td>' +'<div class="cocomment-optional-heading">' +'Optional:' +'</div>' +'</td><td colspan="2"></td></tr>' + makeRow('User alias','poster','Your name on the current page (might differ from coComment nickname)','optional') + makeRow('Tags','tags','Keywords to be associated with your comment','optional') +'<tr><td></td><td colspan="2">' +'<div class="cocomment-button"><img src="' + cocomment.url +'images/float/add.png" width="151" ' +'height="44" border="0" onclick="cocomment.submit()" />' +'</div></td></tr>' +'<tr><td colspan="3" nowrap="nowrap">' +'<div class="cocomment-window-userlinks">' +'Logged in as: <b id="cocomment-completion-user">' + cocomment.nickName +'</b>' +' | <a title="Help" href="'+ cocomment.url +'help" target="_blank">Help</a>' +' | <a title="About" href="javascript:' +'cocomment.showAbout()">About</a>' +' | <a title="Skip including this comment in coComment" href="javascript:' +'cocomment.toggle()">Skip</a>' +' | <a title="Sign out" href="' + cocomment.url +'procLogout">Sign out</a>' +'</div>' +'</td></tr>' +'</table>' +'<form/>', cocomment.closeCompletion);
		if (cocomment.pngfix) {
			if (document.documentElement && document.documentElement.scrollTop) document.getElementById("cocomment-completion").style.top = document.documentElement.scrollTop + 150 +'px';
			else if (document.body) document.getElementById("cocomment-completion").style.top = document.body.scrollTop + 150 + 'px';
			} 
		} 
	if (cocomment.loginWindow && cocomment.loginWindow.style.visibility != "hidden") cocomment.completionWindow.style.visibility = "hidden";
	else cocomment.completionWindow.style.visibility = "visible"; 
}; 

cocomment.toggleCompletion = function() { 
	if(!cocomment.completionWindow) cocomment.showCompletion();
	else { 
		if(cocomment.completionWindow.style.visibility == "visible") cocomment.completionWindow.style.visibility = "hidden";
		else cocomment.completionWindow.style.visibility = "visible"; }
		}; 
	cocomment.closeCompletion = function() { return true; };
	cocomment.showOptions = function() { if(!cocomment.optionsWindow) {
		if (cocomment.nickName == cocomment.someone) { cocomment.showLogin(true); return; }
		var values = (cocomment.blog.name == "unknown") ? {} : cocomment.extractAllData();
		var makeRow = function(rowName,rowId,helpText,optional) { helpText = helpText ? ' title="'+ helpText +'"' : '';
			var rowClass = optional ? ' class="cocomment-optional"' : ' class="cocomment-required"';
			var rowValue = (document.getElementById('cocomment_'+ rowId) && document.getElementById('cocomment_'+ rowId).value) ? document.getElementById('cocomment_'+ rowId).value : ( values[rowId] && values[rowId] != '(undefined)') ? values[rowId].toString().replace(/\x022/g,'&quot;') : '';
			if ((rowValue.toString().indexOf('http:\/\/') && rowValue.toString().indexOf('https:\/\/')) && (rowId == 'posturl' || rowId == 'blogurl')) rowValue = 'http:\/\/'+ rowValue;
			return '<tr><td align="right"'+ rowClass + helpText +' nowrap="nowrap">' + rowName + ':</td><td'+ helpText +'>' +'<input type="text" id="'+ rowId +'" ' + ( rowId=='tags' ? ' onkeyup="cocomment.checkTags(this);" ' : ' no ') +'value="'+ rowValue +'" /></td><td class="cocomment-fieldaddition"'+helpText+'>' +'<img height"11" width="11" border="0" src="' + cocomment.url +'images/float/help11x11.gif"></td></tr>';
			}; 
		cocomment.optionsWindow = cocomment.addWindow( "cocomment-options", "cocomment-options", "Options...", '<form id="cocomment_options" ' +'onsubmit="cocomment.toggleOptions();false;">' +'<table border="0">' +'<tr><td colspan="3">' +'<div class="cocomment-window-text">' +'Before your comment is added to coComment, ' +'you may complete and verify the fields below:<br /><br /></div>' +'</td></tr>' + makeRow('Blog name','blogtitle','Name of this blog') + makeRow('Blog URL','blogurl','Main URL of this blog') + makeRow('Title','posttitle','Title of the article that is being commented') + makeRow('Permalink','posturl','URL of the article that is being commented') +'<tr><td>' +'<div class="cocomment-optional-heading">' +'Optional:' +'</div>' +'</td><td colspan="2"></td></tr>' + makeRow('User alias','poster','Your name on the current page (might differ from coComment nickname)','optional') + makeRow('Tags','tags','Keywords to be associated with your comment','optional') +'<tr><td class="cocomment-checkbox">' +'<input type="checkbox" ' + (cocomment.noQuickTags ? '' : 'checked="checked"') +' id="quickTags" />' +'</td><td colspan="2">' +'<label for="quickTags">Show tags textfield in page</label>' +'</td></tr>' +'<tr><td></td><td colspan="2">' +'<div class="cocomment-button"><img src="' + cocomment.url +'images/float/ok.png" width="151" ' +'height="44" border="0" onclick="cocomment.toggleOptions()" />' +'</div></td></tr>' +'<tr><td colspan="3" nowrap="nowrap">' +'<div class="cocomment-window-userlinks">' +'Logged in as: <b id="cocomment-options-user">' + cocomment.nickName +'</b>' +' | <a title="Help" href="' + cocomment.url +'help" target="_blank">Help</a>' +' | <a title="About" href="javascript:' +'cocomment.showAbout()">About</a>' +' | <a title="Skip including this comment in coComment" href="javascript:' +'cocomment.toggle()">Skip</a>' +' | <a title="Sign out" href="' + cocomment.url +'procLogout">Sign out</a>' +'</div>' +'</td></tr>' +'</table>' +'<form/>', cocomment.closeOptions);
		if (cocomment.pngfix) { 
			if (document.documentElement && document.documentElement.scrollTop) document.getElementById("cocomment-options").style.top = document.documentElement.scrollTop + 150 +'px';
			else if (document.body) document.getElementById("cocomment-options").style.top = document.body.scrollTop + 150 + 'px'; }
			} 
		cocomment.optionsWindow.style.visibility = "visible"; 
		}; 
	cocomment.toggleOptions = function() {
		if (cocomment.skipping) {
			cocomment.skipping = false;
			cocomment.switchOff = false;
			cocomment.startup(); return; 
			} 
		cocomment.updateButtonStatus();
		if(!cocomment.optionsWindow) cocomment.showOptions();
		else { 
			if(cocomment.optionsWindow.style.visibility == "visible" && cocomment.closeOptions()) cocomment.optionsWindow.style.visibility = "hidden";
			else cocomment.optionsWindow.style.visibility = "visible"; 
			}
		}; 
	cocomment.closeOptions = function() {
		if ((cocomment.noQuickTags && document.getElementById('quickTags').checked) || (!cocomment.noQuickTags && !document.getElementById('quickTags').checked)) {
			cocomment.noQuickTags = cocomment.noQuickTags ? false : true;
			var quickTagsRow = document.getElementById('cocomment-quickTagsRow');
			if (!cocomment.noQuickTags && quickTagsRow.style.visibility == 'hidden') quickTagsRow.style.visibility = 'visible';
			else if (quickTagsRow.style.visibility != 'hidden') quickTagsRow.style.visibility = 'hidden';
			cocomment.fetch(cocomment.server, { action : 'preferences', flag : 'noQuickTags', value : cocomment.noQuickTags }); 
			} 
		return true; 
		}; 
	cocomment.showConfirmationWindow = function(inTop, inLeft) {
		if(!cocomment.confirmationWindow) { 
			cocomment.confirmationWindow = cocomment.addWindow( "cocomment-confirmation", "cocomment-confirmation", "Done...", 'Your comment has been sent to ' + cocomment.url.replace('http:\/\/','').replace('www.','').replace('/','')); }; cocomment.confirmationWindow.style.visibility = "hidden"; }; cocomment.submit = function() { var values = {}; if (cocomment.blog.name != "unknown") { values = cocomment.extractAllData(); cocomment.dataCollected = cocomment.checkCompletion(); } else { values = { blog : 'unknown', text : document.getElementsByTagName('textarea')[0].value }; } values = cocomment.manualOverride(values); if (!cocomment.dataCollected) { if (cocomment.completionWindow && cocomment.completionWindow.style.visibility == "visible") { var shakeme = document.getElementById("cocomment-completion"); var shakepos = document.getElementById("cocomment-completion").offsetLeft; var shakeit = function(shakeitto,delay) { window.setTimeout("document.getElementById('cocomment-completion')" +".style.left = "+shakeitto+" +'px'",delay); }; shakeit(shakepos + 20,10); shakeit(shakepos - 15,100); shakeit(shakepos + 10,180); shakeit(shakepos - 7,250); shakeit(shakepos + 4,310); shakeit(shakepos - 2,360); shakeit(shakepos,400); } cocomment.showCompletion(); return false; } else { var submittingSelectedText = (document.getElementById('cocomment_completion') && document.getElementById('cocomment_completion')['text'] && document.getElementById('cocomment_completion')['text'].value) ? true : false; if((!cocomment.submitting || cocomment.submitting == false) && !submittingSelectedText) { cocomment.getForm()._submit(); return true; } else cocomment.submitting = false; cocomment.log("submitting form to cocomment", "info"); if (values) { var autovalues = cocomment.extractAllData(); var manualflags = new Array(); for (var item in values) { if (!autovalues[item] || autovalues[item] != values[item]) manualflags.push(item); } if (manualflags.length) { values.manual = manualflags.join('|'); } if(cocomment.debugging) { var message = "verified values:\n\n"; for(var i in values) message += " " + i + ": " + values[i] + "\n"; alert(message); } if (cocomment.skipping) values.skip = true; cocomment.fetch(cocomment.server, values); } if (cocomment.completionWindow) cocomment.completionWindow.style.visibility = "hidden"; if (cocomment.optionsWindow) cocomment.optionsWindow.style.visibility = "hidden"; if (cocomment.aboutWindow) cocomment.aboutWindow.style.visibility = "hidden"; if ((!cocomment.suppressLogin || cocomment.nickName != cocomment.someone) && !cocomment.skipping) { cocomment.showConfirmationWindow(); cocomment.confirmationWindow.style.visibility = "visible"; var task = 'cocomment.confirmationWindow.style.visibility = "hidden";'; window.setTimeout(task,5000); } return false; } }; cocomment.onsubmit = function(inEvent) { cocomment.log("event for submitting form called", "info"); var form = cocomment.getForm(); if(form._onsubmit) { try { if(form._onsubmit() == false) return false; } catch(e) { if(cocomment.debugging) alert("coComment (Debugging Error Only)\n" + "Onsubmit error on original blog page ignored: " + e); } } try { return cocomment.submit(); } catch(e) { alert("coComment\nProblem with submission: " + e); return false; } }; cocomment.doSubmit = function() { if(cocomment.debugging) return false; if (cocomment.sendToCoCommentOnly) return false; var form = cocomment.getForm(); var button = cocomment.getFormButton(form); button.onclick = function() { }; form.onsubmit = function() { }; if(cocomment.blog.submit && cocomment.blog.submit == "button") button.click(); else form.submit(); return true; }; cocomment.login = function() { if(cocomment.nickName) return; cocomment.fetch(cocomment.loginURL,{random:Math.random().toString()}); }; cocomment.showLogin = function(loginRequested) { if(!loginRequested) { if(cocomment.trackAllComments && !cocomment.nickName) { cocomment.nickName = cocomment.someone; cocomment.doneLogin(); return; } if(cocomment.suppressLogin && !cocomment.nickName) return; } var showRegister = (cocomment.trackAllComments) ? true : false; if(cocomment.loginWindow) cocomment.loginWindow.style.visibility = "visible"; else { var loginPart = '<td valign="top">' +'<form name="cocomment-login" class="cocomment-login" ' +'onsubmit="return false;">' +(showRegister ? '<div class="cocomment-login-subbox">' : '') +'<div id="cocomment-error" class="cocomment-error"></div>' +'<table>' +'<tr>' +'<td colspan="2">' +(showRegister ? '<div class="cocomment-login-subtitle">Login</div>' : '') +'If you have already signed up for' +'<br />coComment, please login below:<br /><br /></td>' +'</tr>' +'<tr>' +'<td class="cocomment-label" nowrap="nowrap">Nick / E-Mail:</td>' +'<td class="cocomment-field">' +'<input tabindex="15010" class="field" type="text" size="15" ' +'name="email" id="cocomment-email" ' +'onkeydown="cocomment.submitIfFilled(event, ' +'forms[\'cocomment-login\'], this, cocomment.doLogin);"/>' +'</td>' +'</tr>' +'<tr>' +'<td class="cocomment-label">Password:</td>' +'<td class="cocomment-field">' +'<input tabindex="15011" class="field" type="password" ' +'size="15" name="password" id="cocomment-password" ' +'onkeydown="cocomment.submitIfFilled(event, ' +'forms[\'cocomment-login\'], this, cocomment.doLogin)"/>' +'</td>' +'</tr>' +'<tr>' +'<td></td>' +'<td class="cocomment-button"><br />' +'<input tabindex="15012" onclick="cocomment.doLogin()" ' +'value="Login" type="image" src="' + cocomment.url +'images/float/login.png" ' +'onkeydown="cocomment.submitIfFilled(event, ' +'forms[\'cocomment-login\'],this,cocomment.doLogin)"/></td>' +'</tr>' +'</table>' +(showRegister ? '</div>' : '') +'</form>' +'</td>'; var registerPart = '<td id="cocomment-register-cell" valign="top">' +'<form name="cocomment-register" class="cocomment-register" ' +'onsubmit="return false;">' +'<div id="cocomment-register-error" class="cocomment-error"></div>' +'<table>' +'<tr>' +'<td class="cocomment-label" nowrap="nowrap">First name:</td>' +'<td class="cocomment-field">' +'<input tabindex="15000" class="field" type="text" size="15" ' +'name="firstname" id="cocomment-register-firstname" ' +'onkeydown="cocomment.submitIfFilled(event, ' +'forms[\'cocomment-register\'], this, cocomment.doRegister);"/>' +'</td>' +'</tr>' +'<tr>' +'<td class="cocomment-label" nowrap="nowrap">Last name:</td>' +'<td class="cocomment-field">' +'<input tabindex="15001" class="field" type="text" size="15" ' +'name="lastname" id="cocomment-register-lastname" ' +'onkeydown="cocomment.submitIfFilled(event, ' +'forms[\'cocomment-register\'], this, cocomment.doRegister);"/>' +'</td>' +'</tr>' +'<tr>' +'<td class="cocomment-label" nowrap="nowrap">Nickname:</td>' +'<td class="cocomment-field">' +'<input tabindex="15002" class="field" type="text" size="15" ' +'name="nickname" id="cocomment-register-nickname" ' +'onkeydown="cocomment.submitIfFilled(event, ' +'forms[\'cocomment-register\'], this, cocomment.doRegister);"/>' +'</td>' +'</tr>' +'<tr>' +'<td class="cocomment-label" nowrap="nowrap">E-Mail:</td>' +'<td class="cocomment-field">' +'<input tabindex="15003" class="field" type="text" size="15" ' +'name="email" id="cocomment-register-email" ' +'onkeydown="cocomment.submitIfFilled(event, ' +'forms[\'cocomment-register\'], this, cocomment.doRegister);"/>' +'</td>' +'</tr>' +'<tr>' +'<td class="cocomment-label">Password:</td>' +'<td class="cocomment-field">' +'<input tabindex="15004" class="field" type="password" ' +'size="15" name="password" id="cocomment-register-password" ' +'onkeydown="cocomment.submitIfFilled(event, ' +'forms[\'cocomment-register\'], this, cocomment.doRegister)"/>' +'</td>' +'</tr>' +'<tr>' +'<td class="cocomment-label">Password (again):</td>' +'<td class="cocomment-field">' +'<input tabindex="15005" class="field" type="password" ' +'size="15" name="passwordagain" id="cocomment-register-passwordagain" ' +'onkeydown="cocomment.submitIfFilled(event, ' +'forms[\'cocomment-register\'], this, cocomment.doRegister)"/>' +'</td>' +'</tr>' +'<tr>' +'<td class="cocomment-terms" colspan="2">' +'<input class="cocomment-checkbox" type="checkbox" id="cocomment-register-terms" />' +'<label for="terms">I have read and accept the ' +'<a target="_blank" href="http://cocomment.com/terms">' +'terms of service</a></label><br \><br \>' +'</td>' +'</tr>' +'<tr>' +'<td></td>' +'<td class="cocomment-button">' +'<input tabindex="15007" onclick="cocomment.doRegister()" ' +'value="Register" type="image" src="' + cocomment.url +'images/float/signmeup.gif" ' +'onkeydown="cocomment.submitIfFilled(event, ' +'forms[\'cocomment-register\'],this,cocomment.doLogin)"/></td>' +'</tr>' +'</table>' +'</form>' +'</td><td>&nbsp;</td>'; var windowContent = '<table><tr>' + ((showRegister) ? registerPart : '') + loginPart +'</tr></table>' +'<table width="100%">' +'<tr><td colspan="2" nowrap="nowrap">' +'<div class="cocomment-window-userlinks">' +'<a href="' + cocomment.url +'forgotPassword?l" ' +'target="_blank">Forgot password?</a>' +((!showRegister) ? ' | <a title="Help" href="' + cocomment.url +'register" target="_blank">Register</a>' : '') +' | <a title="Help" href="' + cocomment.url +'help" target="_blank">Help</a>' +' | <a title="About" href="javascript:' +'cocomment.showAbout()">About</a>' +'</div>' +'</td></tr>' +'</table>'; cocomment.loginWindow = cocomment.addWindow ("cocomment-login", "cocomment-login", ((showRegister) ? "Free Registration" : 'Login'), windowContent, cocomment.closeLogin); if (cocomment.pngfix) { if (document.documentElement && document.documentElement.scrollTop) document.getElementById("cocomment-login").style.top = document.documentElement.scrollTop + 80 +'px'; else if (document.body) document.getElementById("cocomment-login").style.top = document.body.scrollTop + 80 + 'px'; } document.getElementById("cocomment-login").style.left = '130px'; document.getElementById('cocomment-email').focus(); if(cocomment.completionWindow && cocomment.completionWindow.style.visibility == "visible") cocomment.completionWindow.style.visibility = "hidden"; if(cocomment.optionsWindow && cocomment.optionsWindow.style.visibility == "visible") cocomment.optionsWindow.style.visibility = "hidden"; } }; cocomment.doneLogin = function() { cocomment.enable(); if(cocomment.loginWindow) cocomment.loginWindow.style.visibility = 'hidden'; if (cocomment.nickName && cocomment.nickName != cocomment.someone) { cocomment.nickName = cocomment.nickName.replace(/&/g,'&amp;'); cocomment.nickName = cocomment.nickName.replace(/</g,'&lt;'); cocomment.nickName = cocomment.nickName.replace(/>/g,'&gt;'); cocomment.nickName = cocomment.nickName.replace(/&amp;nbsp;/g,'&nbsp;'); } if (document.getElementById("cocomment-user")) if (!(cocomment.skipping || (cocomment.trackAllComments && cocomment.nickName == cocomment.someone))) document.getElementById("cocomment-user").innerHTML = cocomment.nickName; if (document.getElementById("cocomment-completion-user")) document.getElementById("cocomment-completion-user").innerHTML = cocomment.nickName; if (document.getElementById("cocomment-options-user")) document.getElementById("cocomment-options-user").innerHTML = cocomment.nickName; cocomment.updateButtonStatus(); if(cocomment.completionWindow) cocomment.completionWindow.style.visibility = "visible"; }; cocomment.doLogin = function() { var values = { email : document.getElementById('cocomment-email').value, password : document.getElementById('cocomment-password').value }; cocomment.fetch(cocomment.loginURL, values); }; cocomment.closeLogin = function() { if(!cocomment.trackAllComments) cocomment.disable(); return true; }; cocomment.doRegister = function() { var registerFields = ['firstname','lastname','nickname','email','password']; for (var nextField in registerFields) { var thisField = registerFields[nextField]; var thisValue = document.getElementById('cocomment-register-'+ thisField).value; if(!thisValue ||(thisField == 'email' && (thisValue.match(/((@.*@)|(\.\.)|(@\.)|(\.@)|(^\.)|,)/) || !thisValue.match(/^[\S]+\@[a-zA-Z0-9\-\.]+\.([a-zA-Z][a-zA-Z]|com|net|org|edu|gov|int|mil|aero|coop|museum|name|info|biz|pro)$/) )) ||(thisField == 'nickname' && !thisValue.match(/^[a-zA-Z0-9????????????_\$\#\.\-]{2,}$/)) ||(thisField == 'password' && !thisValue.match(/^[a-zA-Z0-9????????????_\$\@\#\%\&\?\.\-]{4,}$/)) ) { document.getElementById('cocomment-register-error').innerHTML = 'The '+ thisField +' is invalid!'; return; } } if (document.getElementById('cocomment-register-passwordagain').value != document.getElementById('cocomment-register-password').value) { document.getElementById('cocomment-register-error').innerHTML = 'The entered passwords do not match!'; return; } var values = { action : 'register', firstName : document.getElementById('cocomment-register-firstname').value, lastName : document.getElementById('cocomment-register-lastname').value, email : document.getElementById('cocomment-register-email').value, nickName : document.getElementById('cocomment-register-nickname').value, password : document.getElementById('cocomment-register-password').value, terms : document.getElementById('cocomment-register-terms').value }; cocomment.fetch(cocomment.server, values); }; cocomment.fetch = function(inURL, inKeyValues, inToken) { var url = inURL; if(inURL.indexOf("http:\/\/") != 0) url = cocomment.url + "/" + url; var values = ""; if(inKeyValues) { values = "?"; if(!inToken) { for(var i in inKeyValues) { if(i == 'text') continue; cocomment.log("sending " + i + " with '" + inKeyValues[i] + "'", "info"); if(values != '?') values += '&'; values += i + "=" + encodeURIComponent(inKeyValues[i]); } var rest = cocomment.urlLength - url.length - values.length; cocomment.splitValues = { url: inURL, values: {} }; for(var i in inKeyValues) { if(i != 'text') continue; var encoded = encodeURIComponent(inKeyValues[i]); if(rest > 0) if(rest > encoded.length + i.toString().length) { values += "&" + i + "=" + encoded; rest -= (encoded.length + i + 2); } else { var pos = cocomment.findBreakPos(encoded, rest - i.toString().length - 1); values += "&split=&" + i + "=" + encoded.substring(0, pos); rest = 0; cocomment.splitValues.values[i] = encoded.substring(pos); } else cocomment.splitValues.values[i] = encoded; } } if(inToken) { var rest = cocomment.urlLength - url.length; values += "continue=" + inToken; for(var i in inKeyValues) { if(!inKeyValues[i] || !inKeyValues[i].length) continue; values += "&"; if(rest > inKeyValues[i].length + i.toString().length) { values += i + "=" + inKeyValues[i]; rest -= inKeyValues[i].length + i.toString().length; inKeyValues[i] = ""; } else { var pos = cocomment.findBreakPos(inKeyValues[i], rest - i.toString().length - 1); values += "&split=&" + i + "=" + inKeyValues[i].substring(0, pos); inKeyValues[i] = inKeyValues[i].substring(pos); break; } } } } var script = document.createElement('script'); script.setAttribute('language','javascript'); script.setAttribute('src', url + values); cocomment.log("sending js-style to " + url + values, "important"); document.getElementsByTagName('head')[0].appendChild(script); return ""; }; cocomment.fetch_continue = function(inToken) { cocomment.fetch(cocomment.splitValues.url, cocomment.splitValues.values, inToken); }; cocomment.storedPreferences = function(result) { return; }; cocomment.findBreakPos = function(inText, inPosition) { if(inText.substr(inPosition - 1, 1) == '%') return inPosition - 2; if(inText.substr(inPosition - 2, 1) == '%') return inPosition - 3; return inPosition; }; cocomment.redirect = function(inPattern, inForm) { inPattern = inPattern.replace("@", cocomment.baseURL()); inPattern = inPattern.replace("#", cocomment.baseURL(false)); inPattern = inPattern.replace(/<(\w+)>/g, function(inFull, inName) { return inForm.elements[inName].value; }); return inPattern; }; cocomment.baseURL = function(inBase) { if(inBase == undefined) inBase = true; var url = document.URL; if(inBase && document.getElementsByTagName("base")[0] && document.getElementsByTagName("base")[0].href) url = document.getElementsByTagName("base")[0].href; else { var pos = url.indexOf("?"); if(pos >= 0) url = url.substring(0, pos); pos = url.lastIndexOf("/"); if(pos >= 0) url = url.substring(0, pos); } return url; }; cocomment.domain = function(inDomain) { if(inDomain) return inDomain.replace(/.*?(?=\w+\.\w+$)/, "").toLowerCase(); return ""; }; cocomment.detectBlog = function() { if(blogTool && blogURL && postURL) return cocomment.webs["standard-js"]; var domain = cocomment.domain(document.domain); if(cocomment.webs[domain] && cocomment.checkBlog(cocomment.webs[domain])) return cocomment.webs[domain]; else { for(name in cocomment.webs) if(cocomment.checkBlog(cocomment.webs[name])) return cocomment.webs[name]; } if (!cocomment.ignoreGenericForms && document.getElementsByTagName('textarea')[0]) return cocomment.webs['generic']; return cocomment.webs['formless']; }; cocomment.checkBlog = function(inBlog) { if(blogTool && blogURL && postURL) return true; if(inBlog.check) if(!cocomment.extractData(null, inBlog.check)) return false; if(inBlog.checknot) if(cocomment.extractData(null, inBlog.checknot)) return false; if(inBlog.form) { var forms = inBlog.form.split(/\|/); for(var i in forms) if(document.forms[forms[i]]) return true; } else if(inBlog.id) { var ids = inBlog.id.split(/\|/); for(var i in ids) if(document.getElementById(ids[i])) return true; } else { if(inBlog.number != undefined && inBlog.text) for(var j = inBlog.number; j < document.forms.length; j++) { var form = document.forms[j]; var text = inBlog.text[1]; if(form) for(var i = 0; i < form.elements.length; i++) if(form.elements[i].name && form.elements[i].name == text) return true; } } return false }; cocomment.getForm = function() { try { if(cocomment.blog.form) { var forms = cocomment.blog.form.split(/\|/); for(var i in forms) if(document.forms[forms[i]]) return document.forms[forms[i]]; } if(cocomment.blog.id) { var ids = cocomment.blog.id.split(/\|/); for(var i in ids) if(document.getElementById(ids[i])) return document.getElementById(ids[i]); } if(cocomment.blog.number >= 0 && document.forms) for(var j = cocomment.blog.number; j < document.forms.length; j++) { var form = document.forms[j]; var text = cocomment.blog.text[1]; if(form) for(var i = 0; i < form.elements.length; i++) if(form.elements[i].name && form.elements[i].name == text) return form; } if (cocomment.blog.name == "unknown") return document.getElementsByTagName('textarea')[0].form; } catch(e) { } cocomment.log("could not find form", "error"); return null; }; cocomment.extractAllData = function() { var form = cocomment.getForm(); var values = {}; values.blog = cocomment.blog.name; if(cocomment.blog.postURL) values.posturl = cocomment.extractData(form, cocomment.blog.postURL); if(cocomment.blog.blogURL) values.blogurl = cocomment.extractData(form, cocomment.blog.blogURL); if(cocomment.blog.text) { values.text = cocomment.extractData(form, cocomment.blog.text); } if(cocomment.blog.blogTitle) values.blogtitle = cocomment.extractData(form, cocomment.blog.blogTitle); if(cocomment.blog.postTitle) values.posttitle = cocomment.extractData(form, cocomment.blog.postTitle); if(cocomment.blog.poster) values.poster = cocomment.extractData(form, cocomment.blog.poster); if(cocomment.blog.email) values.email = cocomment.extractData(form, cocomment.blog.email); if(cocomment.blog.anonymous) values.anonymous = cocomment.extractData(form, cocomment.blog.anonymous); if(cocomment.debugging) { var message = "extracted values:\n\n"; for(var i in values) message += " " + i + ": " + values[i] + "\n"; } return values; }; cocomment.extractData = function(inForm, inPattern) { try { var pattern = new Array(); for (var i in inPattern) pattern[i] = inPattern[i]; var result = cocomment.extractDataImpl(inForm, pattern)[0]; } catch(e) { var result = ''; } return result; }; cocomment.extractDataImpl = function(inForm, ioData) { if(ioData.length == 0) return ioData; var action = ioData.shift(); cocomment.extraction = action + ": " + ioData; switch(action) { case "form": var name = ioData.shift(); var result = null; for(var i = 0; i < inForm.elements.length; i++) if(inForm.elements[i].name && inForm.elements[i].name == name) { result = cocomment.getFormValue(inForm.elements[i]); break; } ioData.unshift(result); break; case "cookie": ioData.unshift(cocomment.getCookie(ioData.shift())); break; case "range": var start = ioData.shift(); var end = ioData.shift(); ioData = cocomment.extractDataImpl(inForm, ioData); var found = ioData.shift().match(start + "(.*?)" + end); if(found) ioData.unshift(found[1]); else ioData.unshift(null); break; case "pattern": var pattern = ioData.shift(); ioData = cocomment.extractDataImpl(inForm, ioData); found = ioData.shift().match(pattern); if(found) ioData.unshift(found[1]); else ioData.unshift(null); break; case "add": result = ""; while(ioData.length > 0) result += cocomment.extractDataImpl(inForm, ioData).shift(); ioData.unshift(result); break; case "const": break; case "id": ioData.unshift(document.getElementById(ioData.shift())); break; case "tag": var tag = ioData.shift(); var number = -1; if(ioData.length > 0) { number = Number(ioData[0]) - 1; if(number >= 0) ioData.shift(); else number = 0; } else number = 0; ioData = cocomment.extractDataImpl(inForm, ioData); var root; if(ioData.length > 0) root = ioData.shift(); else root = document; if(root) { var elements = root.getElementsByTagName(tag); if(elements && elements.length > number) ioData.unshift(root.getElementsByTagName(tag)[number]); else ioData.unshift(null); } else ioData.unshift(null); break; case "contents": pattern = ioData.shift(); tag = cocomment.extractDataImpl(inForm, ioData).shift(); if(tag.innerHTML.match(pattern)) ioData.unshift(tag); else ioData.unshift(null); break; case "text": var data = cocomment.extractDataImpl(inForm, ioData).shift(); if(data && data.innerHTML) ioData.unshift(data.innerHTML); else if (cocomment.blog.name == "unknown") ioData.unshift(document.getElementsByTagName('textarea')[0].value); else ioData.unshift(null); break; case "class": tag = ioData.shift(); var css = ioData.shift(); ioData = cocomment.extractDataImpl(inForm, ioData); if(ioData.length > 0) root = ioData.shift(); else root = document; var elements; if(root) elements = root.getElementsByTagName(tag); result = null; for(i = 0; elements && i < elements.length; i++) { var element; if(elements[i].hasAttribute) element = elements[i].getAttribute("class"); else element = elements[i].getAttribute("className"); if(element && element.match && element.match("\\b" + css + "\\b")) { result = elements[i]; break; } } ioData.unshift(result); break; case "attribute": var attribute = ioData.shift(); var element = cocomment.extractDataImpl(inForm, ioData).shift(); if(element) ioData.unshift(element.getAttribute(attribute)); else ioData.unshift(null); break; case "tagattr": tag = ioData.shift(); name = ioData.shift(); var value = ioData.shift(); ioData = cocomment.extractDataImpl(inForm, ioData); if(ioData.length > 0) root = ioData.shift(); else root = document; var elements; if(root) elements = root.getElementsByTagName(tag); result = null; for(i = 0; elements && i < elements.length; i++) { var element = elements[i].getAttribute(name); if(element && element.match && element.match("(^|\\b)" + value + "(\\b|$)")) { result = elements[i]; break; } } ioData.unshift(result); break; case "domain": ioData.unshift(cocomment.domain(document.domain)); break; case "server": ioData.unshift(document.domain); break; case "url": ioData.unshift(document.URL); break; case "title": ioData.unshift(document.getElementsByTagName("title")[0].innerHTML); break; case "choice": for(data = cocomment.extractDataImpl(inForm, ioData).shift(); ioData.length > 0 && (!data || data == ""); data = cocomment.extractDataImpl(inForm, ioData).shift()) ; ioData = new Array(); if(data) ioData.unshift(data); else ioData.unshift("(undefined)"); break; case "exists": var exists = cocomment.extractDataImpl(inForm, ioData).shift(); if(exists && exists != "") ioData.unshift(true); else ioData.unshift(false); break; case "not": var negate = cocomment.extractDataImpl(inForm, ioData).shift(); if(negate == true) ioData.unshift(false); else if(negate == false) ioData.unshift(true); else ioData.unshift(null); break; case "limit": number = Number(ioData.shift()); if(number < 0) number = 0; ioData.unshift(cocomment.extractDataImpl(inForm, ioData).shift() .substring(0, number)); break; case "document": ioData.unshift(document); break; case "var": name = ioData.shift(); try { ioData.unshift(eval(name)); } catch(e) { ioData.unshift(null); } break; case "intersect": var first = cocomment.extractDataImpl(inForm, ioData).shift(); var second = cocomment.extractDataImpl(inForm, ioData).shift(); var i; for(i = 0; i < first.length && i < second.length; i++) if(first.charAt(i) != second.charAt(i)) break; ioData.unshift(first.substring(0, i)); break; case "split": pattern = ioData.shift(); number = Number(ioData.shift()); value = cocomment.extractDataImpl(inForm, ioData).shift(); if(number < 0) number = 0; result = value.split(new RegExp(pattern))[number]; if(result) result = result.replace(/^\s+/, "").replace(/\s+$/, ""); ioData.unshift(result); break; default: cocomment.log("undefined extraction type '" + action + "' encountered", "error"); } return ioData; }; cocomment.checkCompletion = function() { var values = cocomment.extractAllData(); values = cocomment.manualOverride(values); if( values.blogtitle && (values.blogurl && values.blogurl != 'http:\/\/') && values.posttitle && (values.posturl && values.posturl != 'http:\/\/')) return true; else return false; }; cocomment.manualOverride = function(values) { var override = {}; var optionsWindow = document.getElementById('cocomment_options'); if (optionsWindow) { override.blogtitle = optionsWindow.blogtitle.value; override.blogurl = optionsWindow.blogurl.value; override.posttitle = optionsWindow.posttitle.value; override.posturl = optionsWindow.posturl.value; override.tags = optionsWindow.tags.value; override.poster = optionsWindow.poster.value; } var tagsField = document.getElementById('cocomment_tags'); if (tagsField && tagsField.value) { override.tags = tagsField.value; } var completionWindow = document.getElementById('cocomment_completion'); if (completionWindow) { if (completionWindow['text'] && completionWindow['text'].value) override['text'] = completionWindow['text'].value; if (completionWindow['blogtitle'].value) override['blogtitle'] = completionWindow['blogtitle'].value; if (completionWindow['blogurl'].value) override['blogurl'] = completionWindow['blogurl'].value; if (completionWindow['posttitle'].value) override['posttitle'] = completionWindow['posttitle'].value; if (completionWindow['blogtitle'].value) override['posturl'] = completionWindow['posturl'].value; if (completionWindow['tags'].value) override['tags'] = completionWindow['tags'].value; if (completionWindow['posturl'].value) override['poster'] = completionWindow['poster'].value; } if ( override.blogtitle && override.blogurl && override.posttitle && override.posturl ) cocomment.dataCollected = true; for (var i in override) values[i] = override[i]; if (values.tags) values.tags = values.tags.toString().toLowerCase(); return values; }; cocomment.extractSelection = function(force) { if (cocomment.ignoreSelectedText && !force) return ''; var selectedText = ''; if (window.getSelection) selectedText = window.getSelection(); else if (document.getSelection) selectedText = document.getSelection(); else if (document.selection) selectedText = document.selection.createRange().text; return (selectedText != '') ? selectedText : ''; }; cocomment.addStyleSheet = function(inWindow, inName) { var css; if(inWindow && inWindow != null) css = inWindow.document.createElement('link'); else css = document.createElement('link'); css.setAttribute("rel", "STYLESHEET"); css.setAttribute("type", "text/css"); css.setAttribute("href", cocomment.url + 'css/' + inName + '.css?0.4c');
	 
 if(inWindow && inWindow != null) inWindow.document.getElementsByTagName("head")[0].appendChild(css);
 else document.getElementsByTagName("head")[0].appendChild(css); cocomment.log("adding stylesheet css/" + inName + ".css?0.4c", "info"); };

 cocomment.getFormButton = function(inForm) {
	var domain = cocomment.domain(document.domain);
	if(cocomment.blog.button) if(inForm.elements[cocomment.blog.button]) return inForm.elements[cocomment.blog.button];
	else { 
		cocomment.log("could not find button " + cocomment.blog.button, "error");
		if(cocomment.debugging) alert("coComment:\nCould not find submit button!");
		return null; 
	}
	for(var i = 0; i < inForm.elements.length; i++) if((!inForm.elements[i].name || inForm.elements[i].name.indexOf("cocomment-") != 0) && inForm.elements[i].type == "submit") return inForm.elements[i];
	for(i = 0; i < inForm.elements.length; i++) if((!inForm.elements[i].name || inForm.elements[i].name.indexOf("cocomment-") != 0) && inForm.elements[i].type == "button") return inForm.elements[i]; 
	return null; 
}; 
 
 cocomment.getFormValue = function(inField) {
	if(inField.name.indexOf("cocomment-") == 0) return "";
	if(!inField.name) return "";
	switch(inField.type) {
		case "radio": if(inField.checked) return inField.value;
			break;
		case "checkbox": return inField.checked; 
			break;
		case "select-one": case "select-multiple": inField.selectedIndex;
			break;
		case "text": case "textarea": case "password": case "hidden": return inField.value;
			break;
		case "button": case "submit": 
			break; 
		default: alert("coComment\nInput type " + inField.type + " not supported"); 
		} 
	return ""; 
}; 
 
 cocomment.getCookie = function(inName) {
	var cookies = document.cookie.split(/\s*;\s+/); 
	 for(var i = 0; i < cookies.length; i++) {
		var pos = cookies[i].indexOf("=");
		if(cookies[i].substr(0, pos) == inName)
		return cookies[i].substr(pos + 1); 
		}
	return ""; 
};

 cocomment.setCookie = function(inName, inValue) { cocomment.log("setting cookie " + inName, "info"); document.cookie = inName + "=" + escape(inValue); }; 
 
 
 cocomment.deleteCookie = function(inName) { cocomment.log("removing cookie " + inName, "info"); document.cookie = inName + "= ; expires=Thu, 01-Jan-70 00:00:01 GMT"; };

 cocomment.addWindow = function(inID, inClass, inTitle, inSource, inClose) {
	cocomment.log("adding window " + inID + " to the page", "info");
	cocomment.windowcolor = cocomment.windowcolors[0];
	var element = document.createElement("div");
	element.id = inID;
	element.className = inClass + " cocomment-window";
	element.cocomment_close = inClose;
	var title = document.createElement("div");
	title.className = inClass + "-title cocomment-window-title";
	title.innerHTML = inTitle;
	var body = document.createElement("div");
	body.className = inClass + "-body cocomment-window-body";
	body.innerHTML = inSource;
	element.innerHTML = '<table id="cocomment-'+inClass+'-panel" ' +'border="0" cellpadding="0" cellspacing="0">' +'<tr><td height="29">' +'<table width="100%" border="0" cellpadding="0" cellspacing="0" ' +'id="cocomment-'+inClass+'-panelbar"><tr>' +'<td id="cocomment-'+inClass+'-lt" width="111" height="29">' +'<img src="'+ cocomment.url + 'images/spacer.gif" ' +'height="5" width="111"></td>' +'<td id="cocomment-'+inClass+'-t" height="29">' +'<img src="'+ cocomment.url + 'images/spacer.gif" ' +'height="5"></td>' +'<td id="cocomment-'+inClass+'-rt" width="34" height="29">' +'<img src="'+ cocomment.url + 'images/spacer.gif" ' +'height="5" width="34"></td>' +'</tr></table>' +'</td></tr>' +'<tr><td>' +'<table width="100%" border="0" cellpadding="0" cellspacing="0">' +'<tr class="cocomment-window-contentrow">' +'<td id="cocomment-'+inClass+'-l" width="12">' +'<img src="'+ cocomment.url + 'images/spacer.gif" width="12"></td>' +'<td id="cocomment-'+inClass+'-c" bgcolor="#' + cocomment.windowcolor +'" class="cocomment-window-content">'+'</td>' +'<td id="cocomment-'+inClass+'-r" width="15">' +'<img src="'+ cocomment.url + 'images/spacer.gif" width="15"></td>' +'</tr></table>' +'</td></tr>' +'<tr><td height="19">' +'<table width="100%" border="0" cellpadding="0" cellspacing="0"><tr>' +'<td id="cocomment-'+inClass+'-lb" width="111" height="19">' +'<img src="'+ cocomment.url + 'images/spacer.gif" ' +'height="5" width="111"></td>' +'<td id="cocomment-'+inClass+'-b" height="19">' +'<img src="'+ cocomment.url + 'images/spacer.gif" ' +'height="5"></td>' +'<td id="cocomment-'+inClass+'-rb" width="34" height="19">' +'<img src="'+ cocomment.url + 'images/spacer.gif" ' +'height="5" width="34"></td>' +'</tr></table>' +'</td></tr>' +'</table>';
	document.body.appendChild(element);
	if(document.getElementById('cocomment-'+inClass+'-c')) {
		var contentcell = document.getElementById('cocomment-'+inClass+'-c');
		if (inTitle) contentcell.appendChild(title);
		contentcell.appendChild(body);
		document.getElementById('cocomment-'+inClass+'-panelbar').onmousedown = cocomment.windowEngage;
		var close = document.getElementById('cocomment-'+inClass+'-rt');
		close.onmousedown = cocomment.windowEngage;
		close.alt = "close";
		close.className = "cocomment-window-close";
		close.title = "Close the window";
		close.onclick = cocomment.windowClose; 
		}
		var fixPng = function(objId) {
			var obj = document.getElementById('cocomment-'+inClass+'-'+objId); 
			if (cocomment.pngfix) obj.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + cocomment.url + "images/float/"+ objId +"-stretch.png', sizingMethod='scale')";
			else obj.style.backgroundImage = "url("+ cocomment.url + "images/float/"+objId+".png)"; 
			}; 
		fixPng('lt'); 
		fixPng('t'); 
		fixPng('rt'); 
		fixPng('l'); 
		fixPng('r'); 
		fixPng('lb'); 
		fixPng('b'); 
		fixPng('rb'); 
		return element; }; 

cocomment.windowEngage = function(inEvent) { if(!inEvent) inEvent = window.event; var mouseX; var mouseY; if(inEvent.pageX) { mouseX = inEvent.pageX; mouseY = inEvent.pageY; } else if(inEvent.clientX) { mouseX = inEvent.clientX + document.body.scrollLeft; mouseY = inEvent.clientY + document.body.scrollTop; } this.parentNode.parentNode.parentNode.parentNode.parentNode.cocomment_diffX = mouseX - this.parentNode.parentNode.parentNode.parentNode.parentNode.offsetLeft; this.parentNode.parentNode.parentNode.parentNode.parentNode.cocomment_diffY = mouseY - this.parentNode.parentNode.parentNode.parentNode.parentNode.offsetTop; this.parentNode.parentNode.parentNode.parentNode.parentNode.onmousemove = cocomment.windowDrag; this.parentNode.parentNode.parentNode.parentNode.parentNode.onmouseup = cocomment.windowRelease; document.body.onmousemove = cocomment.windowDrag; document.body.onmouseup = cocomment.windowRelease; document.body.cocomment_window = this.parentNode.parentNode.parentNode.parentNode.parentNode; return false; }; cocomment.windowDrag = function(inEvent) { if(!inEvent) inEvent = window.event; var element = this; if(element == document.body) element = document.body.cocomment_window; var mouseX; var mouseY; if(inEvent.pageX) { mouseX = inEvent.pageX; mouseY = inEvent.pageY; } else if(inEvent.clientX) { mouseX = inEvent.clientX + document.body.scrollLeft; mouseY = inEvent.clientY + document.body.scrollTop; } var left = (mouseX - element.cocomment_diffX); var top = (mouseY - element.cocomment_diffY); if(left < 0) left = 0; if(top < 0) top = 0; element.style.left = left + "px"; element.style.top = top + "px"; return false; }; cocomment.windowRelease = function(inEvent) { var element = this; if(element == document.body) element = document.body.cocomment_window; element.onmousemove = null; element.onmouseup = null; document.body.onmousemove = null; document.body.onmouseup = null; return false; }; cocomment.windowClose = function(inEvent) { cocomment.updateButtonStatus(); var window = this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode; if(window.cocomment_close) if(!window.cocomment_close()) return false; window.style.visibility = "hidden"; return false; }; cocomment.submitIfFilled = function(inEvent, inForm, inField, inFunction) { if(!inEvent) inEvent = event; var code = inEvent.charCode ? inEvent.charCode : (inEvent.which ? inEvent.which : inEvent.keyCode); if(code != 13 && code != 3) return true; if(inField.value == "") return false; for(var i = 0; i < inForm.elements.length; i++) if(inForm.elements[i].value == "") { inForm.elements[i].focus(); return false; } inFunction(); return false; }; cocomment.filterHTML = function(inText) { inText = inText.replace(/<script>[\w\W]*?<\/script>/ig, ""); inText = inText.replace(/<.*?>/g,""); inText = inText.replace(/<!--[\w\W]*?-->/g, ""); inText = inText.replace(/\n\s*\n/g, "\n"); return inText; }; cocomment.checkTags = function( tagsInputField ) { var tags = tagsInputField.value; var tagsClean; tagsClean = tags.replace( /[;,\|]/, " "); tagsClean = tagsClean.replace( /( ){2,}/, " "); tagsClean = tagsClean.replace( /[\<\>\+\&\/\\\%\@]/, ""); if ( tagsClean != tags ) { tagsInputField.value = tagsClean; } if (document.getElementById('cocomment_tags') && tagsInputField != document.getElementById('cocomment_tags')) document.getElementById('cocomment_tags').value = tagsClean; if (document.getElementById('cocomment_options') && document.getElementById('cocomment_options').tags && tagsInputField != document.getElementById('cocomment_options').tags) document.getElementById('cocomment_options').tags.value = tagsClean; return true; }; cocomment.addLogging = function() { if(!cocomment.logging) return; cocomment.logWindow = window.open("", "cocomment.log", "dependent=yes,height=400,width=400,menubar=no," + "resizable=yes,status=no,scrollbars=yes,toolbar=no"); if(!cocomment.logWindow) { alert("coComment\nCould not open logging window, logging is disabled"); cocomment.logging = false; return; } cocomment.addStyleSheet(cocomment.logWindow, "log"); cocomment.logWindow.document.title = "Cocomment - Log Window (" + document.domain + ")"; cocomment.logEntries = cocomment.logWindow.document.getElementById("log-entries"); if(!cocomment.logEntries) { cocomment.logWindow.document.body.innerHTML = '<strong>Cocomment - Log Window (' + document.domain + ')</strong><br />' + '<a class="clear-log" ' + 'onclick="document.getElementById(\'log-entries\').innerHTML=\'\';">' + 'Clear Log</a><p /><div id="log-entries" />'; cocomment.logEntries = cocomment.logWindow.document.getElementById("log-entries"); } }; cocomment.log = function(inMessage, inLevel) { if(cocomment.logging) { if(cocomment.logEntries) { var entry = cocomment.logWindow.document.createElement("div"); entry.className = "log entry " + inLevel; entry.innerHTML = inMessage; cocomment.logEntries.appendChild(entry); } status = inMessage; } }; cocomment.enableLog = function() { cocomment.logging = true; }; cocomment.disableLog = function() { cocomment.logging = false; }; cocomment.enableDebug = function() { cocomment.debugging = true; }; cocomment.disableDebug = function() { cocomment.debugging = false; }; cocomment.guru = function() { alert("guru guru"); return false; }; var cocomment_showLogin = cocomment.showLogin; var cocomment_toggle = cocomment.toggle; var cocomment_doneLogin = cocomment.doneLogin; var cocomment_send_js_continue = cocomment.fetch_continue; var cocomment_doSubmit = cocomment.doSubmit; var cocomment_nickName; var cocomment_detectblog = cocomment.detectblog; var cocomment_webs = cocomment.webs; if(!cocomment.fetchlet && cocomment_force == false) { window._onload = window.onload; window.onload = function() { if(window._onload) window._onload(); cocomment.startup(); }; } else { setTimeout('cocomment.startup()', 0); } 