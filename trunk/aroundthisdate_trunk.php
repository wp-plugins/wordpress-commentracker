<?php
/*
Plugin Name: Around this date in the past...
Plugin URI: http://junyent.org/blog/my-code/
Description: It shows entries/posts around this date in the past (if they exist)
Author: Joan Junyent Tarrida
Version: 0.6.1
Author URI: http://www.junyent.org/

[ Notas en castellano en la web ]  [  Notes en catala a la web ]

Parameters

	$before = Code will show before links. Defaults to ‘This week last year…: ‘
	$after = Code will show after links. Defaults to ‘’
	$daysbefore = Days’ posts that will show before one year ago. By default ‘3' (3 days before)
	$daysafter = Days’ posts that will show after one year ago. By default ‘3' (3 days after)
	$mode = Select the mode that you want the widget to work. By default ‘1' (X years ago)
		Mode 1: get posts around this date from X years ago.
		Mode 2: get posts around this date for the last X years.
		Mode 3: get posts around this date since year X.
	$yearsago = It shows “X” years ago posts. By default ‘1' (1 year). ONLY IF MODE 1 IS SELECTED.
	$lastxyears = It shows posts por the last "X" years. By default ‘1' (1 year). ONLY IF MODE 2 IS SELECTED.
	$sinceyear = It shows posts since the year "X". By default ‘2005' (since year 2005). ONLY IF MODE 3 IS SELECTED.
	$limit = Number of posts to retrieve. By default ‘4'. 

Use

	You can call to function with default parameters:

		<?php around_this_date(); ?>

	Or configure it:

		<?php around_this_date ($before = 'One year ago... ', $after = '<br />‘, $daysbefore = '3', $daysafter = '3', $mode='1', $yearsago = ‘1′,  $limit = ‘5′); ?>
		or
		<?php around_this_date ($before = 'One year ago... ', $after = '<br />‘, $daysbefore = '3', $daysafter = '3', $mode='2', $lastxyears = ‘2′,  $limit = ‘5′); ?>
		or
		<?php around_this_date ($before = 'One year ago... ', $after = '<br />‘, $daysbefore = '3', $daysafter = '3', $mode='3', $sinceyear = ‘2004′,  $limit = ‘5′); ?>

Changelog
	

	
*/


function around_this_date ($before = 'This week las year...:', $after = '', $daysbefore = '3', $daysafter = '3', $mode = '1', $yearsago = '1', $lastxyears= '1', $sinceyear='2005', $limit = '4') {
		global $wpdb;
		
		if ($mode == '1') {  // "classic" mode
		
			$start_ago = (365*$yearsago)+$daysbefore;
			$end_ago = (365*$yearsago)-$daysafter;
			
			$entries = $wpdb->get_results ("SELECT " .
						      "ID, post_title " .
						      "FROM $wpdb->posts " .
						      "WHERE post_status = 'publish' && (( TO_DAYS( NOW() ) - TO_DAYS( post_date ) ) BETWEEN " . $end_ago . " AND " . $start_ago . ")".
							  "ORDER by 'asc'" .
							  "LIMIT $limit"
						            );
									
			if ($entries) {
				echo "$before";
				echo "<ul>";
				$output = ''; // empty the 'output' string
				foreach ($entries as $entry) {
						$title = str_replace('"', '',$entry->post_title);
						// modification by Luis Pérez aka cinefilo
						$output .= '<li><a href="'.get_permalink($entry->ID).'" rel="bookmark" title="Permanent link to '.$title.'">'.$entry->post_title.'</a></li>';
				}
				echo "$output";
				echo "</ul>";
				echo "$after";
			}
		}
		
		elseif ($mode == '2') { // last x years mode
		
			for($year = 1; $year <= $lastxyears; $year++) {
			
				$start_ago = (365*$year)+$daysbefore;
				$end_ago = (365*$year)-$daysafter;
				
				$entries = $wpdb->get_results ("SELECT " .
							      "ID, post_title " .
							      "FROM $wpdb->posts " .
							      "WHERE post_status = 'publish' && (( TO_DAYS( NOW() ) - TO_DAYS( post_date ) ) BETWEEN " . $end_ago . " AND " . $start_ago . ")".
								  "ORDER by 'asc'" .
								  "LIMIT $limit"
							            );
				
				if ($entries) {
					echo "$before";
					// echo $year." years ago";
					echo "<ul>";
					$output = ''; // empty the 'output' string
					foreach ($entries as $entry) {
							$title = str_replace('"', '',$entry->post_title);
						// modification by Luis Pérez aka cinefilo
						$output .= '<li><a href="'.get_permalink($entry->ID).'" rel="bookmark" title="Permanent link to '.$title.'">'.$entry->post_title.'</a></li>';
					}
					echo "$output";
					echo "</ul>";
					echo "$after";
				}
			}
		}
		
		elseif ($mode == '3') { // since year x mode
		
			for($year = 1; $year <= (date("Y")-$sinceyear); $year++) {

				$start_ago = (365*$year)+$daysbefore;
				$end_ago = (365*$year)-$daysafter;
				
				$entries = $wpdb->get_results ("SELECT " .
							      "ID, post_title " .
							      "FROM $wpdb->posts " .
							      "WHERE post_status = 'publish' && (( TO_DAYS( NOW() ) - TO_DAYS( post_date ) ) BETWEEN " . $end_ago . " AND " . $start_ago . ")".
								  "ORDER by 'asc'" .
								  "LIMIT $limit"
							            );
										
				if ($entries) {
					echo "$before";
					// echo $year." years ago";
					echo "<ul>";
					$output = ''; // empty the 'output' string
					foreach ($entries as $entry) {
							$title = str_replace('"', '',$entry->post_title);
						// modification by Luis Pérez aka cinefilo
						$output .= '<li><a href="'.get_permalink($entry->ID).'" rel="bookmark" title="Permanent link to '.$title.'">'.$entry->post_title.'</a></li>';
					}
					echo "$output";
					echo "</ul>";
					echo "$after";
				}
			}
		}
	}
?>
