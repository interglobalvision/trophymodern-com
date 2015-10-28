<?php
// Menu icons for Custom Post Types
// https://developer.wordpress.org/resource/dashicons/
function add_menu_icons_styles(){
?>

<style>
#menu-posts-exhibition .dashicons-admin-post:before {
    content: '\f319';
}
</style>

<?php
}
add_action( 'admin_head', 'add_menu_icons_styles' );


//Register Custom Post Types

add_action( 'init', 'register_cpt_exhibition' );

function register_cpt_exhibition() {

    $labels = array(
        'name' => _x( 'Exhibitions', 'exhibition' ),
        'singular_name' => _x( 'Exhibition', 'exhibition' ),
        'add_new' => _x( 'Add New', 'exhibition' ),
        'add_new_item' => _x( 'Add New Exhibition', 'exhibition' ),
        'edit_item' => _x( 'Edit Exhibition', 'exhibition' ),
        'new_item' => _x( 'New Exhibition', 'exhibition' ),
        'view_item' => _x( 'View Exhibition', 'exhibition' ),
        'search_items' => _x( 'Search Exhibitions', 'exhibition' ),
        'not_found' => _x( 'No exhibitions found', 'exhibition' ),
        'not_found_in_trash' => _x( 'No exhibitions found in Trash', 'exhibition' ),
        'parent_item_colon' => _x( 'Parent Exhibition:', 'exhibition' ),
        'menu_name' => _x( 'Exhibitions', 'exhibition' ),
    );

    $args = array(
        'labels' => $labels,
        'hierarchical' => false,

        'supports' => array( 'title', 'editor', 'thumbnail' ),

        'public' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'menu_position' => 5,

        'show_in_nav_menus' => true,
        'publicly_queryable' => true,
        'exclude_from_search' => false,
        'has_archive' => true,
        'query_var' => true,
        'can_export' => true,
        'rewrite' => true,
        'capability_type' => 'post'
    );

    register_post_type( 'exhibition', $args );
}

