<?php

/* Get post objects for select field options */
function get_post_objects( $query_args ) {
$args = wp_parse_args( $query_args, array(
    'post_type' => 'post',
) );
$posts = get_posts( $args );
$post_options = array();
if ( $posts ) {
    foreach ( $posts as $post ) {
        $post_options [ $post->ID ] = $post->post_title;
    }
}
return $post_options;
}


/**
 * Add text_number input type
 */
// render numbers
add_action( 'cmb2_render_text_number', 'sm_cmb_render_text_number', 10, 5 );
function sm_cmb_render_text_number( $field, $escaped_value, $object_id, $object_type, $field_type_object ) {
  echo $field_type_object->input( array( 'class' => 'cmb2-text-small', 'type' => 'number' ) );
}

/**
 * Include and setup custom metaboxes and fields.
 *
 * @category YourThemeOrPlugin
 * @package  Metaboxes
 * @license  http://www.opensource.org/licenses/gpl-license.php GPL v2.0 (or later)
 * @link     https://github.com/WebDevStudios/CMB2
 */

/**
 * Hook in and add metaboxes. Can only happen on the 'cmb2_init' hook.
 */
add_action( 'cmb2_init', 'igv_cmb_metaboxes' );
function igv_cmb_metaboxes() {

	// Start with an underscore to hide fields from custom fields list
	$prefix = '_igv_';

	/**
	 * Metaboxes declarations here
   * Reference: https://github.com/WebDevStudios/CMB2/blob/master/example-functions.php
	 */

	 	$post_metabox = new_cmb2_box( array(
  		'id'            => $prefix . 'post_metabox',
  		'title'         => __( 'Post Metabox', 'cmb2' ),
  		'object_types'  => array( 'post', ), // Post type
  	) );

  	$post_metabox->add_field( array(
  		'name'       => __( 'Gallery', 'cmb2' ),
  		'desc'       => __( '...', 'cmb2' ),
  		'id'         => $prefix . 'gallery',
  		'type'       => 'wysiwyg',
  	) );

  	$post_metabox->add_field( array(
  		'name'       => __( 'Audio Text', 'cmb2' ),
  		'desc'       => __( 'Text to speak on load', 'cmb2' ),
  		'id'         => $prefix . 'speak_on_load',
  		'type'       => 'wysiwyg',
  	) );

  	$post_metabox->add_field( array(
  		'name'       => __( '3D Object File', 'cmb2' ),
  		'desc'       => __( '(.obj)', 'cmb2' ),
  		'id'         => $prefix . 'obj_file',
  		'type'       => 'file',
  	) );

  	$post_metabox->add_field( array(
  		'name'       => __( 'Material Library File', 'cmb2' ),
  		'desc'       => __( '(.mtl)', 'cmb2' ),
  		'id'         => $prefix . 'mtl_file',
  		'type'       => 'file',
  	) );

  	$post_metabox->add_field( array(
  		'name'       => __( 'Position X', 'cmb2' ),
  		'desc'       => 'Suggested values in range of -/+ 200',
  		'id'         => $prefix . 'pos_x',
  		'type'       => 'text_number',
  		'default'    => '0',
  	) );

  	$post_metabox->add_field( array(
  		'name'       => __( 'Position Y', 'cmb2' ),
  		'desc'       => 'Suggested values in range of -/+ 200',
  		'id'         => $prefix . 'pos_y',
  		'type'       => 'text_number',
  		'default'    => '0',
  	) );

  	$post_metabox->add_field( array(
  		'name'       => __( 'Position Z', 'cmb2' ),
  		'desc'       => 'Suggested values in range of -/+ 200',
  		'id'         => $prefix . 'pos_z',
  		'type'       => 'text_number',
  		'default'    => '0',
  	) );

    // pages

	 	$page_metabox = new_cmb2_box( array(
  		'id'            => $prefix . 'page_metabox',
  		'title'         => __( 'Page Metabox', 'cmb2' ),
  		'object_types'  => array( 'page', ), // Post type
  	) );

  	$page_metabox->add_field( array(
  		'name'       => __( 'Background color', 'cmb2' ),
  		'id'         => $prefix . 'color',
      'type'             => 'select',
          'show_option_none' => false,
          'default'          => 'Red',
          'options'          => array(
              'red' => __( 'Red', 'cmb' ),
              'gray'   => __( 'Gray', 'cmb' ),
          ),
  	) );

  	$page_metabox->add_field( array(
  		'name'       => __( 'Page footer', 'cmb2' ),
  		'desc'       => __( 'optional centered text at bottom of page', 'cmb2' ),
  		'id'         => $prefix . 'page_footer',
  		'type'       => 'wysiwyg',
  	) );

}
?>
