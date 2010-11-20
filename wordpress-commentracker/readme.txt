=== Wordpress Commentracker ===
Plugin Name: Wordpress Commentracker
Author: Joan Junyent Tarrida
Author URI: http://junyent.org/
Contributors: jjunyent
Donate link: http://junyent.org/blog/my-code 
Plugin URI: http://junyent.org/blog/my-code
Version: 0.1
Tags: comments, distributed conversation, asides
Requires at least: 2.0
Tested up to: 2.5
Stable tag: 0.1

Wordpress Commentracker helps you tracking your comments across the blogosphere and storing them on your own blog.

== Description ==

[ Notas en castellano en la web ]  [  Notes en catala a la web ]

This plugin is based on CommenTracker script by Sergio Alvarez (xergio)
[ http://xergio.net/ ]

Commentracker is a script for managing your Distributed Conversations across the blogosphere. It means it is a way to save a local copy of all the comments you post on other blogs.

Wordpress Commentracker integrates CommenTracker into WordPress and saves your comments into a category of your choice, taking advantatge of the advanced capabilities of WordPress as Blogging Platform (archives, themes, search engine, plugins...)  
	
== Installation ==

1. Download the files and extract them.
2. Create a category where you want to place the comments.
3. Edit the variables you will find on wp_ct_plugin.php.
4. Change the category-x.php template to the corresponding category number (eg. category-21.php). If you do not use the default theme you will may have to adapt or create a new template.
5. Upload it through FTP to the server where your Wordpress blog is hosted.
	- wp_commentracker.php should go to the root of your wordpress installation. In the same dir of /wp-config.php
	- category-x.php should go to your theme folder eg. /themes/default/
6. Activate it through the plugin management screen.
7. Create a bookmarklet in your Firefox (if you do not use Firefox just look how your browser works) with the following location:
    
    		javascript:ct_url='http://your.wordpress.root.url/wp_commentracker.php'; void(z=document.body.appendChild(document.createElement('script'))); void(z.type='text/javascript'); void(z.src=ct_url+'?mode=js'); void(z.id='Wp_Commentracker');
    
		Just point ct_url to your wp_commentracker.php (you should have placed it in the root of your WordPress installation)

8. Now it's ready to be used.

== Frequently Asked Questions ==

None yet

== Screenshots ==

1. This screenshot shows the capture dialog.
2. This screenshot shows my customized template for the distributed comments category.
3. This screenshots shows how a single comment entry looks like on my customized template. 

== Usage ==

Once the plugin is installed and the bookmarklet is saved on your web browser toolbar you just have to write a comment in any blog and before pressing the send button press the bookmarklet, fill the information required and your comment will be saved in your WordPress blog.

If you forgot to press the bookmarklet, don't panic! Just add your comment trought the WorPress administration panel, write the comment, add the custom fields and post it!
	
If you do not wat the comments to apear in the front page you should consider use the MiniPosts plugin [  http://doocy.net/mini-posts/   ]
	
This plugin saves information as custom fields so if you want to make them searchable for the WordPress search engine you should consider use Search Everything Plugin [  http://dancameron.org/wordpress/wordpress-plugins/search-everything-wordpress-plugin/  ] 
In case that you use also the MiniPosts plugin, you should use this modification of the Search Everything plugin [  http://www.junyent.org/blog/index.php?p=468&lp_lang_view=en  ]


== Configuration parameters ==

	$access: the password you want to use for posting comments
	$post_author: the author ID of the author that you want the comments to be assigned. Check the author ID under the "Users" menu 
	$wpct_cat: the category  ID of the category where you want to save your comments. Check the category numbers under the "Manage" > "Categories" menu
	$wpct_draft: Do you want to save the comments as drafts to review them later? It allows two values [ 1 , 0 ] 1: YES, 0: NO
	$minipost: Do you want to make the comments miniposts?  It allows two values [ 1 , 0 ]   1: YES, 0: NO   
	
NOTE: Enabling the MiniPost option REQUIRES MiniPosts plugin [[  http://doocy.net/mini-posts/   ]] 


== License ==
	
This plugin is released under the GPL license. See license.txt for details.
The CommenTracker script is licensed under a Creative Commons by-sa license.

== Changelog ==

v0.1 = Initial release.

== Credits and Acknowledgments ==

Thanks to Sergio Alvarez (xergio) for writing the CommenTracker script.

== ToDo ==

1. Create a new bookmarklet.
2. Create an options page.
3. Support for adding tags (UTW) and/or multiple categories.
4. Support for multiple authors.
5. Integrate the plugin with the wordpress authentification system.
6. Retrieve comments on the original blog through RSS and WP 2.1 pseudo-cron.
7. New option saving the data inside the post not as custom fields.
8. Support for catching favicons. 

