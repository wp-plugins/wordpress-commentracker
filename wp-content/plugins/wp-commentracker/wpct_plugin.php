<?php
/*
=== Wordpress Commentracker ===
Plugin Name: Wordpress Commentracker
Author: Joan Junyent Tarrida
Author URI: http://www.junyent.org/
Contributors: jjunyent
Donate link: 
Plugin URI: http://www.junyent.org/blog/2006/09/06/wordpress-commentracker/
Version: 0.2
Tags: comments, distributed conversation, asides
Requires at least: 2.0
Tested up to: 2.1.3
Stable tag: 0.1

[ Notas en castellano en la web ]  [  Notes en català a la web ]

Wp_CommenTracker is based on CommenTracker by Sergio Álvarez (xergio)   [[  http://xergio.net/escrito-292/comentarios-cruzados.html  ]]   [[ http://xergio.net ]]
Licencia CC (BY-SA)
	
*/
/***********************************************************************/ 
/** EDIT VARIABLES BELOW *********************************************/
/***********************************************************************/ 

$access = "pass"; // Set the password you want to use for posting comments
$post_author = 1; // Set the author you want the comments to be assigned. Check the author ID under the "Users" menu 
$wpct_cat = 4; //  Category where you want to save your comments. Check the category numbers under the "Manage" > "Categories" menu
$wpct_status = 0; // Do you want to save the comments as drafts to review them later? 1: YES, 0: NO
$wpct_minipost = 1; // Do you want to make the comments miniposts? REQUIRES MiniPosts plugin [  http://doocy.net/mini-posts/   ]    1: YES, 0: NO

/************************************************************************/ 
/** EDIT LINES  BELOW AT YOUR OWN RISK *******************************/
/************************************************************************/ 



function wpct_comments(){

			$ct_post_title = get_post_meta($post, 'Post Title', true);
			$ct_post_url = get_post_meta($post, 'Post URL', true);
			$ct_blog = get_post_meta($post, 'Blog', true);
			$ct_blog_url = get_post_meta($post, 'Blog URL', true);
			$ct_rss = get_post_meta($post, 'RSS of Comments', true);
			$ct_favicon = get_post_meta($post, 'Blog Favicon', true);


			echo "
				<div class=\"ct_item\">	
					<h3 style=\"background: url(" . $ct_favicon . ") no-repeat center left; padding-left: 20px;\"" . "><a href=\"" . $ct_post_url . "\">" . $ct_post_title . "</a></h3>
					<p><a href=\"" . $ct_blog_url . "\">" . $ct_blog . "</a><br />
					<a href=\"" . $ct_rss . "\">RSS de los comentarios en el post original</a></p>
					</div>
					";

}

// function wpct_blogs returns a list of the most commented blogs

function wpct_blogs($wpct_ranking_num) {
		$wpct_ranking_sql = 'SELECT wp_postmeta.meta_value, wp_postmeta.meta_key, COUNT(*) AS wpctblogs_counted FROM wp_postmeta WHERE wp_postmeta.meta_key = \'Blog\' GROUP BY wp_postmeta.meta_value ORDER BY wpctblogs_counted DESC LIMIT' + $wpct_ranking_num;
		$wpctblogs = $wpdb->query($wpct_ranking_sql);
		
		if ($wpctblogs) {
			echo "<ul>";
			foreach ($wpctblogs as $wpctblog){
				echo "<li id=\"wpct_bloglist\"><a href=\"" . $wpctblogs['meta_value'] . "\">" . $wpctblogs['meta_value'] . " (" . $wpctblogs['wpctblogs_counted'] . ")</a></li>";
				}
			echo "</ul>";	
			}	
		}
?>
