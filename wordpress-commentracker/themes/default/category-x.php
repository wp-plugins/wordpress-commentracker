<?php get_header(); ?>

	<div id="content" class="narrowcolumn">

	<h2>WordPress CommenTracker</h2>
	<p>
	<strong>Here you will find my Distributed Conversations across the blogosphere. Powered by <a href="http://junyent.org/blog/">WordPress CommenTracker</a></strong>
	</p>

    <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
		<div class="post" id="post-<?php the_ID(); ?>">
						<h2><a href="<?php the_permalink() ?>" rel="bookmark" title="Permanent Link to <?php the_title(); ?>"><?php the_title(); ?></a></h2>
						<small><?php the_time('F jS, Y') ?> <!-- by <?php the_author() ?> --></small>
						
						<div class="entry">
							<?php the_content('Read the rest of this entry &raquo;'); ?>
						</div>
				
						<p class="postmetadata">
						<?php if (get_post_meta($post->ID, 'Blog Favicon', true)) { ?>
								<img src="<?php echo get_post_meta($post->ID, 'Blog Favicon', true); ?>" title="Blog Favicon" style="float:left;" alt=""/>
								<?php }
								else {
									echo "";
								}?>
						<?php 	if (get_post_meta($post->ID, 'Post Title', true)) { ?>
									Post: <a href="<?php echo get_post_meta($post->ID, 'Post URL', true); ?>"><?php echo get_post_meta($post->ID, 'Post Title', true); ?></a><br />
								<?php } 
								else {
									echo "";
								}?>
						<?php 	if (get_post_meta($post->ID, 'Blog', true)) { ?>
									Blog: <a href="<?php echo get_post_meta($post->ID, 'Blog URL', true); ?>"><?php echo get_post_meta($post->ID, 'Blog', true); ?></a><br />  
								<?php } 
								else {
									echo "";
								}?>
						<?php 	if (get_post_meta($post->ID, 'RSS of Comments', true)) { ?>
									<a href="<?php echo get_post_meta($post->ID, 'RSS of Comments', true); ?>" title="RSS - Follow the comments on the original blog!">RSS - Follow the comments on the original blog!</a><br /> 
								<?php } 
								else {
									echo "";
								}?>
						Posted in <?php the_category(', ') ?> <br /> <?php edit_post_link('Edit', '', '<br />'); ?>  <?php comments_popup_link('No Comments &#187;', '1 Comment &#187;', '% Comments &#187;'); ?></p>
					</div>
	  <?php endwhile; endif; ?>

	</div>



<?php get_sidebar(); ?>

<?php get_footer(); ?>