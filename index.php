<?php
get_header();
?>

<!-- main content -->

<main id="main-content">


<?php
if( have_posts() ) {
      echo '<script type="text/javascript">
          if( typeof(Models) === "undefined" ) {
            Models = [];
          }
        </script>';
  while( have_posts() ) {
    the_post();
    $meta = get_post_meta($post->ID);
    if( $meta["_igv_obj_file"] && $meta["_igv_mtl_file"] ) {
      echo '<script type="text/javascript">
          Models.push({
            obj: "' . $meta["_igv_obj_file"][0] . '",
            mtl: "' . $meta["_igv_mtl_file"][0] . '",
          });
        </script>';
    }
  }
}
?>
<!-- end main-content -->

</main>

<?php get_template_part('partials/three-scene'); ?>

<?php
get_footer();
?>
