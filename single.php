<?php
get_header();
?>

<!-- main content -->

<main id="main-content">

  <!-- main posts loop -->
  <section id="single">

<?php
if( have_posts() ) {
  while( have_posts() ) {
    the_post();
      $meta = get_post_meta($post->ID);
?>

    <article <?php post_class(); ?> id="post-<?php the_ID(); ?>">

      <h2 id="single-title" class="u-align-center"><?php the_title(); ?></h2>

      <?php the_content(); ?>

      <?php if (!empty($meta['_igv_speak_on_load'][0])) {
        echo '<div class="speak-on-load u-hidden">' . $meta['_igv_speak_on_load'][0] . '</div>';
      } ?>

    </article>

<?php
  }
} else {
?>
    <article class="u-alert"><?php _e('Sorry, no posts matched your criteria :{'); ?></article>
<?php
} ?>

  <!-- end posts -->
  </section>

<!-- end main-content -->

</main>

<?php
get_footer();
?>
