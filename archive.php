<?php
get_header();
?>

<!-- main content -->

<main id="main-content">

  <section id="exhibitions" class="font-color-white">

<?php
if( have_posts() ) {
  while( have_posts() ) {
    the_post();
    $meta = get_post_meta($post->ID);
?>

    <article <?php post_class(); ?>>
      <header class="exhibition-header u-cf">
        <div class="percent-col into-2 pcol-padding-right">
          <h4><?php the_time('F Y'); ?></h4>
        </div>
        <div class="percent-col into-2">
          <h4 class="exhibition-title"><?php the_title(); ?></h4>
        </div>
      </header>

      <?php
        if (has_post_thumbnail()) {
      ?>
        <div class="row">
          <div class="percent-col into-2 pcol-padding-right">
            <?php the_post_thumbnail('exhibition-single'); ?>
          </div>
          <div class="percent-col into-2">
            <?php the_content(); ?>
          </div>
        </div>
      <?php
        } else {
      ?>
          <?php the_content(); ?>
      <?php
        }
      ?>

    </article>

<?php
  }
} else {
?>
    <article class="exhibition"><?php _e('Sorry, no posts found :('); ?></article>
<?php
} ?>

  </section>

<!-- end main-content -->

</main>

<?php
get_footer();
?>