/* jshint browser: true, devel: true, indent: 2, curly: true, eqeqeq: true, futurehostile: true, latedef: true, undef: true, unused: true */
/* global $, document, Modernizr */

function l(data) {
  'use strict';
  console.log(data);
}

var TrophyModern = {
  init: function() {
    $(document).ready(function () {
      var mySwiper = new Swiper('.swiper-container', {
        keyboardControl: true,
        centeredSlides: true,
        spaceBetween: 60,
        slidesPerView: 'auto',
        hashnav: true,
        nextButton: '.cycle-next',
        prevButton: '.cycle-prev',
      })
      .on('onInit', function(swiper) {
//         debugger;
      });
    });
  },
};

TrophyModern.init();

var Layout = {
  windowWidth: $(window).width(),
  windowHeight: $(window).height(),
  setWindowValues: function() {
    this.windowWidth = $(window).width();
    this.windowHeight = $(window).height();
  },

  init: function() {
    var _this = this;

    _this.logic();

    $(window).resize(function() {
      _this.setWindowValues();
      _this.logic();
    });
  },

  logic: function() {
    $('#page-copy').css('min-height', this.windowHeight + 'px');
  },
};

$(document).ready(function () {
  'use strict';

  Layout.init();

});