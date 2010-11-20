<?php

/*
=== Wordpress Commentracker ===
Plugin Name: Wordpress Commentracker
Author: Joan Junyent Tarrida
Author URI: http://www.junyent.org/
Contributors: jjunyent
Donate link: 
Plugin URI: http://www.junyent.org/blog/arxius/2006/09/06/wordpress-commentracker/
Version: 0.1.1
Tags: comments, distributed conversation, asides
Requires at least: 2.0
Tested up to: 2.1
Stable tag: 0.1

Wp_CommenTracker is based on the CommenTracker script created by Sergio Álvarez (xergio)   [[  http://xergio.net/escrito-292/comentarios-cruzados.html  ]]   [[ http://xergio.net ]] This script is licensed under CC (BY-SA)
    

*/



//##############################################################################
//##############################################################################
//##############################################################################

require_once( dirname(__FILE__) . '/wp-config.php');


switch ($_GET["mode"]) {
     case "js":
?>
/*
Inspired from http://slayeroffice.com/tools/modi/v2.0/modi_help.html
Add an <script src="">... tag to the HTML document

javascript:
    ct_url='http://your.blog.url/wp_commentracker.php';
    void(z=document.body.appendChild(document.createElement('script')));
    void(z.type='text/javascript');
    void(z.src=ct_url+'?mode=js');
    void(z.id='Wp_Commentracker');
*/

function cm_init() {
    var cm_title = "";
    var cm_textarea = "";
    var cm_obj = null;
    var cm_url = "";
	
    // getting all tags...
    for (cm_i = 0; cm_i < document.getElementsByTagName("*").length; cm_i++) {
        cm_obj = document.getElementsByTagName("*")[cm_i];
        
        // saving title, as the post tile is usually placed there
        if (cm_obj.tagName.toLowerCase() == "title") {
            cm_title = cm_obj.innerHTML;
        }
    
        // is the current object a textarea?
        if (cm_obj.tagName.toLowerCase() == "textarea") {
            if (cm_obj.value.length > 0) // there's something written on it?
                if (cm_textarea.length == 0) // if not just recursively checking
                    if (confirm("\277Have you written this?\n\n" + cm_obj.value.slice(0, 200) + "..."))
                        cm_textarea = cm_obj.value;
        }
    }
    
	cm_url = location.href;
	cm_blog = cm_title
	cm_blogurl = cm_url
	cm_rss = cm_url + '/feed/'
	cm_check = ""

    if (cm_textarea.length > 0) {
        cm_title = prompt("Post title:", cm_title);
		cm_url = prompt("Post URL:", cm_url);
		cm_blog = prompt("Blog:", cm_blog);
		cm_blogurl = prompt("Blog URL:", cm_blogurl);
        cm_rss = prompt("Feed RSS of the comments:", cm_rss);
		cm_check = prompt("Password:", cm_check);
	
		
        // everything OK? let's save it to our blog.

            cm_ifrm = document.body.appendChild(document.createElement('iframe'));
            cm_ifrm.style.display = 'none';
            cm_ifrm.src = ct_url + '?mode=add&pass=' + encodeURIComponent(cm_check) + '&url=' + encodeURIComponent(cm_url) + "&title=" + encodeURIComponent(cm_title) + "&blog=" + encodeURIComponent(cm_blog) + "&blogurl=" + encodeURIComponent(cm_blogurl) + "&rss=" + encodeURIComponent(cm_rss) + "&text=" + encodeURIComponent(cm_textarea);
            cm_ifrm.id = 'ifrmcommentracker';
//            alert(ct_url + '?mode=add&pass=' + encodeURIComponent(ct_pass) + '\n&url=' + encodeURIComponent(location.href) + "\n&title=" + encodeURIComponent(cm_title) + "\n&text=" + encodeURIComponent(cm_textarea));
        

    }
}

cm_init();

<?
    break;

	require('./wp-content/plugins/wp_ct_plugin.php');
    
	case "add":

		  if ($_GET["pass"] == $access) {
			
			$post_date_gmt = gmdate('Y-m-d H:i:s', time());
			$post_date = date('Y-m-d H:i:s', time());
			$post_slug = sanitize_title($_GET["title"]);
			if ($wpct_draft == 1) {
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
			$wpdb->query("INSERT INTO $wpdb->post2cat SET post_id='$postId', category_id='$wpct_cat'");
			if ($minipost == 1) {
				// to make them minipost
				$wpdb->query("INSERT INTO $wpdb->postmeta SET post_id='$postId', meta_key='_mini_post', meta_value='1'");
				//
			}

			echo "<script type=\"text/javascript\">alert('Saved comment!!');</script>";
        } else {
            echo "<script type=\"text/javascript\">alert('You have no access...');</script>";
        }
        break;
        
    default:
        break;
}
	

//##############################################################################
//##############################################################################
// http://www.peej.co.uk/projects/favatars.html modified

function getFavicon($url) {
    $urlParts = parse_url($url);
    $HTTPRequest = fsockopen($urlParts["host"], 80);
    if ($HTTPRequest) {
        //stream_set_timeout($HTTPRequest, 0.1);
        $hd = "GET " . ((isset($urlParts['path'])) ? $urlParts['path'] : "/").((isset($urlParts['query'])) ? "?".$urlParts['query'] : "") . " HTTP/1.1\n";
        $hd .= "Host: " . $urlParts["host"] . "\n";
        $hd .= "User-Agent: WordPress Commentracker v1\n";
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
                $hd .= "User-Agent: WordPress Commentracker v1\n";
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
