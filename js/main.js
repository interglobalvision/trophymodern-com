/* jshint browser: true, devel: true, indent: 2, curly: true, eqeqeq: true, futurehostile: true, latedef: true, undef: true, unused: true */
/* global $, document, Modernizr */

function l(data) {
  'use strict';
  console.log(data);
}

$(document).ready(function () {
  'use strict';
  l('Hola Globie');
});

var TrophyModern = {
  init: function() {
    $(document).ready(function () {
      var mySwiper = new Swiper ('.swiper-container', {
        // Optional parameters
        keyboardControl: true,
        centeredSlides: true,
        spaceBetween: 60,
        slidesPerView: 'auto',
        hashnav: true,

        // Navigation arrows
        nextButton: '.cycle-next',
        prevButton: '.cycle-prev',

      })
      .on('onInit', function(swiper) {
        debugger;
      }); 
    });
  },
};

TrophyModern.init();
