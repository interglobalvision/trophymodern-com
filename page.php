<?php
get_header();
?>

<!-- main content -->

<main id="main-content">

<?php
if( have_posts() ) {
  while( have_posts() ) {
    the_post();
    $meta = get_post_meta($post->ID);
?>

  <section id="page"
<?php
  if (!empty($meta['_igv_color'][0])) {
    echo 'class="background-' . $meta['_igv_color'][0] . '"';
  };
?>
    >

    <article <?php post_class(); ?> id="page-copy">

      <?php the_content(); ?>

      <?php get_template_part('partials/email-form'); ?>

      <?php
        if (!empty($meta['_igv_page_footer'][0])) {
          echo '<div id="page-footer" class="u-align-center font-tracking-wider">' . wpautop($meta['_igv_page_footer'][0]) . '</div>';
        };
      ?>

      <?php if (!empty($meta['_igv_speak_on_load'][0])) {
        echo '<div class="speak-on-load u-hidden">' . $meta['_igv_speak_on_load'][0] . '</div>';
      } ?>

    </article>

  </section>

<?php
  }
} else {
?>
    <article class="u-alert"><?php _e('Sorry, no posts matched your criteria :{'); ?></article>
<?php
} ?>

<!-- end main-content -->

</main>

<?php
get_footer();
?>