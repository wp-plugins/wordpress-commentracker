<?php

/* Wp_CommenTracker */



require_once('../../../wp-config.php');
// require('wpct_plugin.php');


class wpct_post {
    var $post_title;
    var $post_content;
    var $post_status;
    var $post_author;    /* author user id (optional) */
    var $post_type;      /* 'page' or 'post' (optional, defaults to 'post') */
    var $comment_status; /* open or closed for commenting (optional) */
}
    


// if ($_GET["pass"] == $access) {
			


// Insert post
// initialize post object
            $wpct_mypost = new wpct_post();

            // fill object
            $wpct_mypost->post_title = $_GET["title"];
            $wpct_mypost->post_content = htmlspecialchars_decode($_GET["text"]);
            $wpct_mypost->post_author = $post_author;
            $wpct_mypost->post_type = 'post'; 
            $wpct_mypost->post_category = $wpct_cat; 
            $wpct_mypost->tags_input = utf8_uri_encode($_GET["tags"]); 
                        switch ($wpct_status) {
                            case 0:
                                    $post_status = 'publish';
                                    break;
                            case 1:
                                    $post_status = 'draft';
                                    break;
                            case 2:
                                    $post_status = 'private';
                                    break;
                            case 3:
                                    $post_status = 'pending';
                                    break;
                            case 4:
                                    $post_status = 'future';
                                    break;                        
                        }
            $wpct_mypost->post_status = $post_status;


            // feed object to wp_insert_post
            $post_ID = wp_insert_post($wpct_mypost);
            // Insert metadata
            add_post_meta($post_ID, 'Post Title', $_GET["title"], $unique = true);
            add_post_meta($post_ID, 'Post URL', $_GET["url"], $unique = true);
            add_post_meta($post_ID, 'Blog', $_GET["blog"], $unique = true);
            add_post_meta($post_ID, 'Blog URL', $_GET["blogurl"], $unique = true);
            add_post_meta($post_ID, 'RSS of Comments', $_GET["rss"], $unique = true);
            // add_post_meta($post_ID, 'Blog Favicon', getFavicon($_GET["url"]), $unique = true);
            // Make miniposts
			if ($minipost == 1) { add_post_meta($postID, _mini_post, '1', $unique = true); }

			//$.prompt('Comment saved');
// } else {
//          $.prompt('An Error Occured while editing this user');
//}


	


?>