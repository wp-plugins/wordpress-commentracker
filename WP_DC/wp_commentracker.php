<?php

/* Wp_CommenTracker */


require_once( dirname(__FILE__) . '/wp-config.php');


switch ($_GET["mode"]) {
    // Texto a  mostrar en modo Javascript. El comentario es la dirección para el
    // bookmark, javascript:void(...
    case "js":
?>
/*
Inspirado en from http://slayeroffice.com/tools/modi/v2.0/modi_help.html
Añade un TAG <script src="">... al documento HTML

javascript:
    ct_url='http://www.junyent.org/blog/wp_commentracker.php';
    void(z=document.body.appendChild(document.createElement('script')));
    void(z.type='text/javascript');
    void(z.src=ct_url+'?mode=js');
    void(z.id='commentracker');
*/



 


var wpct_baseurl='http://www.junyent.org/blog/wp_commentracker.php';
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



  
    // si lo encontró no pregunta por el título
if (wpct_textarea.length > 0) {
       var form = 'Is this?'+
                '<div class="field"><label for="edittitle">Title</label><input type="text" id="edittitle" name="edittitle" value="'+ wpct_title +'" /></div>'+
                '<div class="field"><label for="editurl">URL</label><input type="text" id="editurl" name="editurl" value="'+ wpct_url +'" /></div>'+
                '<div class="field"><label for="editblog">Blog</label><input type="text" id="editblog" name="editblog" value="'+ wpct_blog +'" /></div>'+
                '<div class="field"><label for="editblogurl">Blog URL</label><input type="text" id="editblogurl" name="editblogurl" value="'+ wpct_blogurl +'" /></div>'+
                '<div class="field"><label for="editrss">RSS URL</label><input type="text" id="editrss" name="editrss" value="'+ wpct_rss +'" /></div>'+
                '<div class="field"><label for="editcomment">Text</label><textarea id="edittext" name="edittext" value="'+ wpct_textarea +'" /></div>'+
                '<div class="field"><label for="edittags">Tags</label><input type="text" id="edittags" name="edittags" value="'+ wpct_tags +'" /></div>'+
                '<div class="field"><label for="edituser">User</label><input type="text" id="edituser" name="edituser" value="'+ wpct_user +'" /></div>'+
                '<div class="field"><label for="editpass">Password</label><input type="text" id="editpass" name="editpass" value="'+ wpct_pass +'" /></div>';

        $('.jqiwarning .jqi').css({ 'background-color': '#b0be96' }); 
        $('.jqifade').css({'position': 'absolute', 'paddingBottom': '10px', 'borderBottom': '1px #ccc solid', 'paddingLeft': '25px' });
        $('div.jqi').css({ 'position': 'absolute', 'background-color': '#333' });
        $('div.jqi .jqiclose').css({ 'float': 'right', 'margin': '-35px -10px 0 0', 'cursor': 'pointer' });
        $('div.jqi .jqicontainer').css({ 'background-color': '#e0eEc6', 'padding': '5px', 'color': '#ffffff', 'font-weight': 'bold' });
        $('div.jqi .jqimessage').css({ 'background-color': '#c0cEa6', 'padding': '10px' });
        $('div.jqi .jqibuttons').css({ 'text-align': 'center', 'padding': '5px 0 0 0' });
        $('div.jqi button').css({ 'padding': '3px 10px 3px 10px', 'margin': '0 10px' });

       $.prompt(form,{ 
                buttons:{OK:true, Cancel:false},
                callback: function(v,m){
                    var t = m.find('#edittitle').val();
                    var u = m.find('#editurl').val();
                    var b = m.find('#editblog').val();
                    var bu = m.find('#editblogurl').val();
                    var r = m.find('#editrss').val();
                    var text = m.find('#edittext').val();
                    var t = m.find('#edittags').val();
                    var us = m.find('#edituser').val();
                    var p = m.find('#editpass').val();

                    if(v){
                            wpct_title = t;
                            wpct_url = u;
                            wpct_blog = b;
                            wpct_blogurl = bu;
                            wpct_rss = r;
                            wpct_textarea = text;
                            wpct_tags = t;
                            wpct_user = us;                               
                            wpct_pass = p;
                            
                            
                            var wpct_ifrm = document.body.appendChild(document.createElement('iframe'));
                            wpct_ifrm.style.display = 'none';
                            wpct_ifrm.src = wpct_baseurl + '?mode=add&pass=' + encodeURIComponent(wpct_pass) + '&url=' + encodeURIComponent(wpct_url) + "&title=" + encodeURIComponent(wpct_title) + "&blog=" + encodeURIComponent(wpct_blog) + "&blogurl=" + encodeURIComponent(wpct_blogurl) + "&rss=" + encodeURIComponent(wpct_rss) + "&text=" + encodeURIComponent(wpct_textarea);
                            wpct_ifrm.id = 'ifrmcommentracker';
                            $.prompt('yuhoo!');
                                                           
                    }else{ $.prompt('An Error Occured'); }							
                }
    });

	// Comprobación antes de guardar
    // todo OK? pues a guardarlo en nuestro DC

//            alert(ct_url + '?mode=add&pass=' + encodeURIComponent(ct_pass) + '\n&url=' + encodeURIComponent(location.href) + "\n&title=" + encodeURIComponent(cm_title) + "\n&text=" + encodeURIComponent(cm_textarea));
        

}




<?
    break;

	require('./wp-content/plugins/wpct_plugin.php');
    
	case "add":

		  if ($_GET["pass"] == $access) {
			
			$post_date_gmt = gmdate('Y-m-d H:i:s', time());
			$post_date = date('Y-m-d H:i:s', time());
			$post_slug = sanitize_title(utf8_decode($_GET["title"]));
			if ($ct_draft == 1) {
				$post_status = 'draft';
			} else {
				$post_status = 'publish';
			}
			$wpdb->query("INSERT INTO wp_posts (ID, post_title, post_content, post_date, post_date_gmt, post_author, post_name, post_modified, post_modified_gmt, post_status ) VALUES ('postId', '" . $_GET["title"] . "', '" . $_GET["text"] . "', '$post_date', '$post_date_gmt', '$post_author', '$post_slug', '$post_date', '$post_date_gmt', '$post_status')");
           	$postId = $wpdb->insert_id;
			$wpdb->query("INSERT INTO $wpdb->postmeta SET post_id='$postId', meta_key='Post Title', meta_value='" . $_GET["title"] . "'");
			$wpdb->query("INSERT INTO $wpdb->postmeta SET post_id='$postId', meta_key='Post URL', meta_value='" . $_GET["url"] . "'");
			$wpdb->query("INSERT INTO $wpdb->postmeta SET post_id='$postId', meta_key='Blog', meta_value='" . $_GET["blog"] . "'");
			$wpdb->query("INSERT INTO $wpdb->postmeta SET post_id='$postId', meta_key='Blog URL', meta_value='" . $_GET["blogurl"] . "'");
			$wpdb->query("INSERT INTO $wpdb->postmeta SET post_id='$postId', meta_key='RSS of Comments', meta_value='" . $_GET["rss"] . "'");
			$wpdb->query("INSERT INTO $wpdb->postmeta SET post_id='$postId', meta_key='Blog Favicon', meta_value=''" . getFavicon($_GET["url"]) . "''");
			$wpdb->query("INSERT INTO $wpdb->post2cat SET post_id='$postId', category_id='$ct_cat'");
			if ($minipost == 1) {
				// HACK per fer-los minipost
				$wpdb->query("INSERT INTO $wpdb->postmeta SET post_id='$postId', meta_key='_mini_post', meta_value='1'");
				// end HACK
			}

			echo "<script type=\"text/javascript\">$.prompt('Comment saved');</script>";
        } else {
            echo "<script type=\"text/javascript\">$.prompt('An Error Occured while editing this user');</script>";
        }
        break;
        
    default:
        break;
}
	

//##############################################################################
//##############################################################################
// http://www.peej.co.uk/projects/favatars.html modificado

function getFavicon($url) {
    $urlParts = parse_url($url);
    $HTTPRequest = fsockopen($urlParts["host"], 80);
    if ($HTTPRequest) {
        //stream_set_timeout($HTTPRequest, 0.1);
        $hd = "GET " . ((isset($urlParts['path'])) ? $urlParts['path'] : "/").((isset($urlParts['query'])) ? "?".$urlParts['query'] : "") . " HTTP/1.1\n";
        $hd .= "Host: " . $urlParts["host"] . "\n";
        $hd .= "User-Agent: xergioNET - Commentrack System v1\n";
        $hd .= "Connection: Close\n\n";
        fwrite($HTTPRequest, $hd);
        $html = fread($HTTPRequest, 4096);
        $HTTPRequestData = stream_get_meta_data($HTTPRequest);
        fclose($HTTPRequest);

        if (!$HTTPRequestData['timed_out']) {
            if (preg_match('/<link[^>]+rel="(?:shortcut )?icon"[^>]+?href="([^"]+?)"/si', $html, $matches)) {
                $linkUrl = html_entity_decode($matches[1]);
                
                if (substr($linkUrl, 0, 1) == '/') {
                    $faviconURL = $urlParts['scheme'].'://'.$urlParts['host'].$linkUrl;
                    
                } elseif (substr($linkUrl, 0, 7) == 'http://') {
                    $faviconURL = $linkUrl;

                } elseif (substr($url, -1, 1) == '/') {
                    $faviconURL = $url.$linkUrl;

                } else {
                    $faviconURL = $url.'/'.$linkUrl;
                }
                
            } else {
                $faviconURL = $urlParts['scheme'].'://'.$urlParts['host'].'/favicon.ico';
            }
            
            $fiUrlParts = parse_url($faviconURL);
            $HTTPRequest = fsockopen($fiUrlParts["host"], 80);
            if ($HTTPRequest) {
                //stream_set_timeout($HTTPRequest, 0.1);
                $hd = "GET " . ((isset($fiUrlParts['path'])) ? $fiUrlParts['path'] : "/").((isset($fiUrlParts['query'])) ? "?".$fiUrlParts['query'] : "") . " HTTP/1.1\n";
                $hd .= "Host: " . $fiUrlParts["host"] . "\n";
                $hd .= "User-Agent: xergioNET - Commentrack System v1\n";
                $hd .= "Connection: Close\n\n";
                fwrite($HTTPRequest, $hd);
                $favicon = fread($HTTPRequest, 4096);

                if (!preg_match("/^.* 404 Not Found/si", $favicon)) {
                    $HTTPRequestData = stream_get_meta_data($HTTPRequest);
                    fclose($HTTPRequest);
                    
                    if (!$HTTPRequestData['timed_out'] && strlen($favicon) < 4096) {
                        return $faviconURL;
                    }
                }
            }
        }
    }

    return false;
}

?>