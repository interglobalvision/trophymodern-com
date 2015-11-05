/* jshint browser: true, devel: true, indent: 2, curly: true, eqeqeq: true, futurehostile: true, latedef: true, undef: true, unused: true */
/* global $, document, THREE, WP, Models, Swiper, speechSynthesis, SpeechSynthesisUtterance */

var ThreeScene = {
  models: [],
  init: function() {
    var _this = this;

    _this.$container = $('#three-scene');

    _this.scene = new THREE.Scene();
    _this.camera = new THREE.PerspectiveCamera(75, (window.innerWidth / window.innerHeight), 0.1, 8000);
    _this.raycaster = new THREE.Raycaster();
    _this. directionVector = new THREE.Vector3();

    _this.mousePosition = {
      x: 0,
      y: 0,
      clicked: false,
    };

    _this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    _this.renderer.setSize(window.innerWidth, window.innerHeight);
    _this.renderer.setPixelRatio(window.devicePixelRatio);
    _this.renderer.setClearColor(0xffffff);

    _this.controls = new THREE.OrbitControls(_this.camera, _this.renderer.domElement);
    _this.controls.enableDamping = true;
    _this.controls.dampingFactor = 0.95;
    _this.controls.enableZoom = false;

    _this.$container.append(_this.renderer.domElement);

    var ambient = new THREE.AmbientLight(0x444444);
    var directionalLight = new THREE.DirectionalLight(0xffeedd);

    directionalLight.position.set(0, 0, 1).normalize();

    _this.scene.add( ambient );
    _this.scene.add( directionalLight );

    _this.camera.position.z = 5;

    _this.addSkybox();

    _this.render();
    
    _this.$container.click( function(event) {
      _this.mousePosition.x = event.clientX;
      _this.mousePosition.y = event.clientY;
      _this.mousePosition.clicked = true;
    });

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

  addModels: function() {
    var _this = this;

    // Models is declared inside the loop on index.php. It contains an array of objects.
    for(var i = 0; i < Models.length; i++) {
      _this.addModel( Models[i] );
    }
  },

  addModel: function(model) {
    var _this = this;

    THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

    var loader = new THREE.OBJMTLLoader();

    loader.load( model.obj, model.mtl, function ( object ) {

      // Set the object post url
      object.url = model.url;

      // Set object position
      object.position.x = model.x;
      object.position.y = model.y;
      object.position.z = model.z;

      //_this.models.push( object );
      _this.scene.add( object );

    }, _this.onProgress, _this.onError );
  },

  onProgress: function(xhr) {
    var _this = this;

    if ( xhr.lengthComputable ) {
      var percentComplete = xhr.loaded / xhr.total * 100;

      if (percentComplete === 100) {
        console.log('Model loaded');
      } else {
        console.log( Math.round(percentComplete, 2) + '% downloaded' );
      }
    }
  },

  onError: function(xhr) {
    var _this = this;

    console.log('some error');
    console.log('xhr:', xhr);
  },

  addSkybox: function() {
    var _this = this;

    var dirPath = WP.themeUrl + '/img/three/skybox/';
    var skybox = _this.makeSkybox([
      dirPath + 'back.jpg',
      dirPath + 'front.jpg',
      dirPath + 'top.jpg',
      dirPath + 'bottom.jpg',
      dirPath + 'right.jpg',
      dirPath + 'left.jpg',
    ], 2048 );

    skybox.name = 'skybox';

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

/*
    _this.cube.rotation.x += 0.001;
    _this.cube.rotation.y += 0.0011;
*/

    if (_this.mousePosition.clicked) {
      _this.mousePosition.clicked = false;

      // The following will translate the mouse coordinates into a number
      //     // ranging from -1 to 1, where
      //         //      x == -1 && y == -1 means top-left, and
      //             //      x ==  1 && y ==  1 means bottom right
      var x = ( _this.mousePosition.x / window.innerWidth ) * 2 - 1;
      var y = -( _this.mousePosition.y / window.innerHeight ) * 2 + 1;

      // Set our direction vector to those initial values
      _this.directionVector.set(x, y, 1);

      // Unpropject the vector
      _this.directionVector.unproject( _this.camera );

      // Substract the vector representing the camera position
      _this.directionVector.sub(_this.camera.position);

      // Normalize the vector, to avoid large numbers from the
      // projection and substraction
      _this.directionVector.normalize();

      _this.raycaster.set(_this.camera.position, _this.directionVector);

      // Ask the raycaster for intersects with all objects in the scene:
      // (The second arguments means "recursive")
      var intersects = _this.raycaster.intersectObjects(_this.scene.children, true);

      if( intersects.length ) {

        // intersections are, by default, ordered by distance,
        // so we only care for the first one. The intersection
        // object holds the intersection point, the face that's
        // been "hit" by the ray, and the object to which that
        // face belongs. We only care for the object itself.
        var target = intersects[0].object;

        // make sure we are not clicking the skybox 
        if( target.name !== 'skybox' ) {
          console.log(target.parent.url);
        
          // TODO: send url to router
        }
      }
    }

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

TrophyModern.Email = {
  emailForm: $('#form-inquiries'),
  init: function() {
    _this = this;

    var url = _this.emailForm.attr('action');

    _this.emailForm.submit(function(e) {
      e.preventDefault();
      _this.onSubmit();

      $.ajax({
        type: 'POST',
        url: url,
        data: _this.emailForm.serialize(),
        success: function(data) {
          if (data.code === 1) {
            _this.onSuccess();
          } else {
            _this.onEmailError(data.code);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
          _this.onAjaxError(jqXHR, textStatus, errorThrown)
        },
      });

    });

  },

  onSubmit: function() {
    _this = this;

    _this.emailForm.css('background-color', 'gray');
    $('#form-inquiries-submit').attr('disabled', true).html('Sending...');
  },

  onSuccess: function() {
    _this = this;

    $('#form-inquiries-inputs').hide();
    $('#form-inquiries-output').show();
  },

  onEmailError: function(code) {
    console.log(code);
  },

  onAjaxError: function(jqXHR, textStatus, errorThrown) {
    console.log(textStatus);
    console.log(errorThrown);
    console.log(jqXHR);
  }

};

TrophyModern.Speech = {
  mute: false,
  speakContent: undefined,
  init: function() {
    var _this = this;
    var speakOnLoad = $('.speak-on-load').first();

    speechSynthesis.cancel();

    if (!_this.mute && speakOnLoad.length) {
      _this.speakContent = new SpeechSynthesisUtterance();
      _this.speakContent.text = speakOnLoad.text();
      _this.speakContent.lang = 'en-US';
      _this.speakContent.rate = 1;
      _this.speakContent.onend = function() {
        _this.speakContent = undefined;
        speechSynthesis.cancel();
      };

      _this.speak();
    }

    $('.nav-mute-toggle').on({
      click: function() {
        _this.muteToggle();
      },
    });

  },

  muteToggle: function() {
    var _this = this;

    $('.nav-mute-toggle').toggle();

    if (_this.mute) {
      _this.resume();
      _this.mute = false;
    } else {
      _this.pause();
      _this.mute = true;
    }
  },

  loadElement: function(selector) {
    var _this = this;

    speechSynthesis.cancel();

    _this.speakContent = new SpeechSynthesisUtterance();
    _this.speakContent.text = $(selector).text();
    _this.speakContent.lang = 'en-US';
    _this.speakContent.rate = 1;
    _this.speakContent.onend = function() {
      _this.speakContent = undefined;
      speechSynthesis.cancel();
    };

    if (!_this.mute) {
      _this.speak();
    }

  },

  speak: function() {
    speechSynthesis.speak(this.speakContent);
  },

  pause: function() {
    speechSynthesis.pause(this.speakContent);

  },

  resume: function() {
    speechSynthesis.resume(this.speakContent);

  },

};

$(document).ready(function () {
  'use strict';

  TrophyModern.Email.init();

  Layout.init();

  TrophyModern.Speech.init();

  ThreeScene.init();

  if (typeof Models !== 'undefined') {
    ThreeScene.addModels();
  }

});
