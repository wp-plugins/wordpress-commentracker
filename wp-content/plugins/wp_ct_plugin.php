<?php
/*
=== Wordpress Commentracker ===
Plugin Name: Wordpress Commentracker
Author: Joan Junyent Tarrida
Author URI: http://www.junyent.org/
Contributors: jjunyent
Donate link: 
Plugin URI: http://www.junyent.org/blog/2006/09/06/wordpress-commentracker/
Version: 0.1.1
Tags: comments, distributed conversation, asides
Requires at least: 2.0
Tested up to: 2.1.3
Stable tag: 0.1

[ Notas en castellano en la web ]  [  Notes en català a la web ]

	
*/
/***********************************************************************/ 
/** EDIT VARIABLES BELOW *********************************************/
/***********************************************************************/ 

$access = "pass"; // Set the password you want to use for posting comments
$post_author = 1; // Set the author you want the comments to be assigned. Check the author ID under the "Users" menu 
$wpct_cat = 4; //  Category where you want to save your comments. Check the category numbers under the "Manage" > "Categories" menu
$wpct_draft = 0; // Do you want to save the comments as drafts to review them later? 1: YES, 0: NO
$minipost = 1; // Do you want to make the comments miniposts? REQUIRES MiniPosts plugin [  http://doocy.net/mini-posts/   ]    1: YES, 0: NO

/************************************************************************/ 
/** EDIT LINES  BELOW AT YOUR OWN RISK *******************************/
/************************************************************************/ 

require_once(ABSPATH . 'wp-config.php');

// function wpctblogs returns a list of the most commented blogs


?>