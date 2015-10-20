/* jshint browser: true, devel: true, indent: 2, curly: true, eqeqeq: true, futurehostile: true, latedef: true, undef: true, unused: true */
/* global $, document, Modernizr, THREE, WP */

function l(data) {
  'use strict';
  console.log(data);
}

var ThreeScene = {
  init: function() {
    var _this = this;

    _this.scene = new THREE.Scene();

    _this.camera = new THREE.PerspectiveCamera(75, (window.innerWidth / window.innerHeight), 0.1, 8000);

    _this.renderer = new THREE.WebGLRenderer({antialias: true});
    _this.renderer.setSize(window.innerWidth, window.innerHeight);
    _this.renderer.setPixelRatio(window.devicePixelRatio);
    _this.renderer.setClearColor(0xffffff);

    _this.controls = new THREE.OrbitControls(_this.camera, _this.renderer.domElement);
    _this.controls.enableDamping = true;
    _this.controls.dampingFactor = 0.95;
    _this.controls.enableZoom = false;

    document.getElementById('three-scene').appendChild(_this.renderer.domElement);

    var ambient = new THREE.AmbientLight(0x444444);
    var directionalLight = new THREE.DirectionalLight(0xffeedd);

    directionalLight.position.set(0, 0, 1).normalize();

    _this.scene.add( ambient );
    _this.scene.add( directionalLight );

    _this.camera.position.z = 5;

    _this.testContent();
    _this.addSkybox();

    _this.render();
    window.addEventListener('resize', _this.resize.bind(_this), false);

  },

  resize: function() {
    var _this = this;

    _this.camera.aspect = window.innerWidth / window.innerHeight;
    _this.camera.updateProjectionMatrix();

    _this.renderer.setSize( window.innerWidth, window.innerHeight );

  },

  testContent: function() {
    var _this = this;

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial( {color: 0x00ff00,} );

    _this.cube = new THREE.Mesh(geometry, material);

    _this.scene.add(_this.cube);

  },

  addSkybox: function() {
    var _this = this;

    var dirPath = WP.themeUrl + '/img/three/skybox/';
    var skybox = _this.makeSkybox([
      dirPath + 'back.jpg', // 
      dirPath + 'front.jpg', // 
      dirPath + 'top.jpg', // top
      dirPath + 'bottom.jpg', // bottom
      dirPath + 'right.jpg', // 
      dirPath + 'left.jpg',  // 
    ], 2048 );

    _this.scene.add(skybox);
  },

  makeSkybox: function(urls, size) {
    var skyboxCubemap = THREE.ImageUtils.loadTextureCube( urls );

    skyboxCubemap.format = THREE.RGBFormat;

    var skyboxShader = THREE.ShaderLib['cube'];

    skyboxShader.uniforms['tCube'].value = skyboxCubemap;

    return new THREE.Mesh(
      new THREE.BoxGeometry(size, size, size),
      new THREE.ShaderMaterial({
        fragmentShader : skyboxShader.fragmentShader, vertexShader : skyboxShader.vertexShader,
        uniforms : skyboxShader.uniforms, depthWrite : false, side : THREE.BackSide,
      })
    );
  },

  render: function() {
    var _this = this;

    requestAnimationFrame(_this.render.bind(_this));

    _this.cube.rotation.x += 0.001;
    _this.cube.rotation.y += 0.0011;

    _this.controls.update();
    _this.renderer.render(_this.scene, _this.camera);
  },
};

var TrophyModern = {
  init: function() {
    $(document).ready(function () {
      var mySwiper = new Swiper('.swiper-container', {
        keyboardControl: true,
        centeredSlides: true,
        spaceBetween: 60,
        slidesPerView: 'auto',
        hashnav: true,
        nextButton: '.swiper-next',
        prevButton: '.swiper-prev',
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

  ThreeScene.init();

});
