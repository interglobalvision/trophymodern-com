/* jshint browser: true, devel: true, indent: 2, curly: true, eqeqeq: true, futurehostile: true, latedef: true, undef: true, unused: true */
/* global $, jQuery, document, Modernizr */

function l(data) {
  'use strict';
  console.log(data);
}

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

jQuery(document).ready(function () {
  'use strict';

  Layout.init();

});