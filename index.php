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
      url: "' . get_permalink($post->ID) . '",
      obj: "' . $meta["_igv_obj_file"][0] . '",
      mtl: "' . $meta["_igv_mtl_file"][0] . '",
      x: "' . $meta["_igv_pos_x"][0] . '",
      y: "' . $meta["_igv_pos_y"][0] . '",
      z: "' . $meta["_igv_pos_z"][0] . '",
    });';
    }
  }
  echo '</script>';
}
?>
<!-- end main-content -->

<?php
  $audioText = IGV_get_option('_igv_home_speak_on_load');
  if (!empty($audioText)) {
    echo '<div class="speak-on-load u-hidden">' . $audioText . '</div>';
  }
?>

</main>

<?php
get_footer();
?>
