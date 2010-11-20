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
/* Main variables */ 

$wpct_key = get_option('wpct_key');
$wpct_author = get_option('wpct_author');  
$wpct_category = get_option('wpct_category'); 
$wpct_draft = get_option('wpct_draft'); 
$wpct_minipost = get_option('wpct_minipost');

/** EDIT LINES  BELOW AT YOUR OWN RISK *******************************/

// function wpct_comments returns metadata information for the current post
function wpct_comments(){

			$wpct_post_title = get_post_meta($post, 'Post Title'), true);
			$wpct_post_url = get_post_meta($post, 'Post URL', true);
			$wpct_blog = get_post_meta($post, 'Blog', true);
			$wpct_blog_url = get_post_meta($post, 'Blog URL', true);
			$wpct_rss = get_post_meta($post, 'RSS of Comments', true);
			$wpct_favicon = get_post_meta($post, 'Blog Favicon', true);


			echo "
				<div class=\"wpct_item\">	
					<h3 style=\"background: url(" . $wpct_favicon . ") no-repeat center left; padding-left: 20px;\"" . "><a href=\"" . $wpct_post_url . "\">" . $wpct_post_title . "</a></h3>
					<p><a href=\"" . $wpct_blog_url . "\">" . $wpct_blog . "</a><br />
					<a href=\"" . $wpct_rss . "\">" . __('original comment\'s RSS feed') . "</a></p>
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

// Defining options admin page

function wpct_plugin_options() {
		  echo '<div class="wrap">';
		  echo '<h2>' . __('WordPress CommenTracker') . '</h2>';
		  echo '<form method="post" action="options.php">';
		  wp_nonce_field('update-options');
		  echo '<table class="form-table">';
		  echo '<tr valign="top">';
		  echo '<th scope="row">'. __('Author') .'</th>';
		  echo '<td>';		  
		  echo '<select name="wpct_author">';
				global $current_user;
				get_currentuserinfo();
				$authors = get_editable_authors( $current_user->id );
				foreach ($authors as $o) :
					$o = get_userdata( $o->ID );
					 if ( get_option('wpct_author') == $o->ID ) $selected = 'selected="selected">';
					 else $selected = '>';
					echo '<option value="'; 
										echo $o->ID .  '"';
										echo $selected; 
										echo $o->display_name . '</option>';
				endforeach;
		  echo '</select>';
		  echo ' <span class="description"> ' . __('The author you want your Distributed Comments to be assigned.') . '</span>';
		  echo '</td>';
		  echo '</tr>';
		  echo '<tr valign="top">';
		  echo '<th scope="row">'. __('Secret Key') .'</th>';
		  echo '<td><input type="password" name="wpct_key" value="'. get_option('wpct_key') .'" /><span class="description"> ' . __('Set the password you want to use for posting your Distributed Comments.') . '</span></td>';
		  echo '</tr>';
		  echo '<tr valign="top">';
		  echo '<th scope="row">'. __('Default category') .'</th>';
		  echo '<td>';
		  wp_dropdown_categories(array('hide_empty' => 0, 'name' => 'wpct_category', 'orderby' => 'name', 'selected' => get_option('wpct_category'), 'hierarchical' => true));
		  echo '<span class="description"> ' . __('Category where you want to save your Distributed Comments.') . '</span>';
		  echo '</td>';
		  echo '</tr>';
		  echo '<tr valign="top">';
		  echo '<th scope="row">'. __('Draft') .'</th>';
		  echo '<td><input type="checkbox" name="wpct_draft" value="1" '; 
		  if ( get_option('wpct_minipost') == '1' ) echo ' checked="checked" ';
		  echo '" /><span class="description"> ' . __('Do you want to save the comments as drafts to review them later?') . '</span></td>';
		  echo '</tr>'; 
		  echo '<tr valign="top">';
		  echo '<th scope="row">'. __('Minipost') .'</th>';
		  echo '<td><input type="checkbox" name="wpct_minipost" value="1" '; 
		  if ( get_option('wpct_minipost') == '1' ) echo ' checked="checked" ';
		  echo '" /><span class="description"> ' . __('Do you want to make the comments miniposts? REQUIRES <a href="http://doocy.net/mini-posts/">MiniPosts plugin</a>') . '</span></td>';
		  echo '</tr>';
		  echo '</table>';
		  echo '<input type="hidden" name="action" value="update" />';
		  echo '<input type="hidden" name="page_options" value="wpct_author,wpct_key,wpct_category,wpct_draft,wpct_minipost" />';
		  echo '<p class="submit">';
		  echo '<input type="submit" class="button-primary" value="'. __('Save Changes') .'" />';
		  echo '</p>';
		  echo '</form>';
		  echo '</div>';

		  echo '<h2>' . __('WordPress CommenTracker Bookmarklet') . '</h2>';
		  echo '<textarea>';
		  echo '</textarea>';

}


// Adding an options menu page

function wpct_adminmenu() {
  add_options_page('Commentracker', 'Wordpress Commentracker', 8, __FILE__, 'wpct_plugin_options');
}
add_action('admin_menu', 'wpct_adminmenu');
?>