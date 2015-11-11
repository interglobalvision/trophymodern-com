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
      $photos = get_post_meta($post->ID, '_igv_photos');
      $drawings = get_post_meta($post->ID, '_igv_drawings');
?>

    <article <?php post_class(); ?> id="post-<?php the_ID(); ?>">

      <h2 id="single-title" class="u-align-center"><?php the_title(); ?></h2>

      <?php // the_content(); ?>

      <div class='gallery swiper-container'>
        <div class='swiper-wrapper'>
        <?php  if (! empty($photos[0])) { pr($photos[0]);
                foreach ($photos[0] as $photo) {  ?>
          <div class='swiper-slide u-pointer' data-hash='<?php echo $photo['image_id']; ?>'>
            <img src='<?php echo $photo['image']; ?>'>
          </div>
        <?php   } 
              }
              if (! empty($drawings[0])) { pr($drawings[0]);
                foreach ($drawings[0] as $drawing) {  ?>
          <div class='swiper-slide u-pointer drawing' data-hash='<?php echo $drawing['image_id']; ?>'>
            <img src='<?php echo $drawing['image']; ?>'>
          </div>
        <?php   } 
              }
        ?>
        </div>
      </div>

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
