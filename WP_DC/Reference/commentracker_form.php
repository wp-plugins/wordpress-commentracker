<head>
<style>
.help {
text-align:right;
font-size:small;
}
.ct_logged {
font-family:Verdana, Arial, Helvetica, sans-serif;
font-size:small;
} 

.ct_text {
margin:10px;
text-align:center;
font-family:Verdana, Arial, Helvetica, sans-serif;
font-weight:bold;
color:#036;
}

.ct_label {
font-size:0.8em;
}
.ct_inputbox {
	width: 30em;

}

.submit input, .submit input:focus, .button {

	margin: 10px;
	border: 3px double #999;
	border-left-color: #ccc;
	border-top-color: #ccc;
	color: #333;
	width:10em;
	padding: 0.25em;
}

.submit input:active, .button:active {
	background: #f4f4f4;
	border: 3px double #ccc;
	border-left-color: #999;
	border-top-color: #999;
}


.ct_meta {
	font-size:small;
	font-style:italic;
}

</style>
</head>
<body>
<div id="ct_form">

	<div class="help">
		<a title="Help" href="" target="_blank">Help</a> | <a title="About" href="">About</a>
	</div>
	
	<div id="ct_content">	
	
	<div class="ct_logged">You appear to be logged as USER. If you are not USER, please log out.</div>  
	
	<div class="ct_text">Before tracking your comment, please check everything is correct:</div>	
	
	<form id="ct_check" onsubmit="cocomment.toggleOptions();false;">
			
			<label class="ct_label" title="Name of this blog" >Blog name:</label><br /> 
			<input id="blogtitle" class="ct_inputbox" value="" type="text"><br />
			<label class="ct_label" title="Main URL of this blog" >Blog URL:</label><br />
			<input id="blogurl" class="ct_inputbox" value="<?php utf8_decode($_GET["url"]) ?>" type="text"><br />
			<label class="ct_label" title="Title of the article that is being commented" >Post Title:</label><br />
			<input id="posttitle" class="ct_inputbox" value="" type="text"><br />
			<label class="ct_label" title="URL of the article that is being commented" >Permalink:</label><br />
			<input id="posturl" class="ct_inputbox" value="" type="text"><br />
		
		<h4>Optional:</h4>

			<label class="ct_label" title="RSS feed for tracking comment replies" >RSS feed for comments:</label><br />
			<input id="rssurl" class="ct_inputbox" value="" type="text"><br />
			<label class="ct_label" title="Keywords to be associated with your comment" >Tags: (a coma-separeted list)</label><br />
			<input id="tags" class="ct_inputbox" value="" type="text">

			<div class="submit"><input type="button" id="submit" title="Submit data to WordPress Commentracker" value="OK" ><input class="submit" type="button" id="submit" title="Back to the comment" value="Back to comment" >
			</div>
		</form>
  </div>
<div class="ct_meta">Comment tracked by <a href="" title="WordPress Commentracker">WordPress Commentracker</a>.</div>   
</div>
</body>	
