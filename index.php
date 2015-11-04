<?php
get_header();
?>

<!-- main content -->

<main id="main-content">


<?php
if( have_posts() ) {
  echo "
  <script type=\"text/javascript\">
    if( typeof(Models) === \"undefined\" ) {
      Models = [];
    }\n";
  while( have_posts() ) {
    the_post();
    $meta = get_post_meta($post->ID);
    if( $meta["_igv_obj_file"] && $meta["_igv_mtl_file"] ) {
      echo '
    Models.push({
      obj: "' . $meta["_model_obj_file"][0] . '",
      mtl: "' . $meta["_model_mtl_file"][0] . '",
      x: "' . $meta["_model_pos_x"][0] . '",
      y: "' . $meta["_model_pos_y"][0] . '",
      z: "' . $meta["_model_pos_z"][0] . '",
    });';
    }
  }
  echo '</script>';
}
?>
<!-- end main-content -->

</main>

<?php get_template_part('partials/three-scene'); ?>

<?php
get_footer();
?>
