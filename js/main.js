/* jshint browser: true, devel: true, indent: 2, curly: true, eqeqeq: true, futurehostile: true, latedef: true, undef: true, unused: true */
/* global $, document, THREE, WP, Models, Swiper, speechSynthesis, SpeechSynthesisUtterance */

var animationSpeed = 700;

var ThreeScene = {
  models: [],
  filesLength: undefined,
  filesLoaded: 0,
  percentLoaded: 0,
  init: function() {
    var _this = this;

    if (ThreeScene.percentLoaded === 0 && $('body.home').length) {
      $('#loading').show();
    }

    _this.$container = $('#three-scene');

    _this.scene = new THREE.Scene();
    _this.camera = new THREE.PerspectiveCamera(75, (window.innerWidth / window.innerHeight), 0.1, 8000);
    _this.raycaster = new THREE.Raycaster();
    _this.directionVector = new THREE.Vector3();

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

    _this.scene.add(ambient);
    _this.scene.add(directionalLight);

    _this.camera.position.z = 5;

    _this.addSkybox();

    if (WP.isAdmin == true) {
     var axes = new THREE.AxisHelper(5);

     axes.name = 'axes';
     axes.scale.x = 0.5;
     axes.scale.y = 0.5;
     axes.scale.z = 0.5;

     _this.scene.add(axes);
    }

    _this.render();

    _this.$container.click(function(event) {
      _this.mousePosition.clicked = true;
    });

    _this.$container.mousemove(function(event) {
      _this.mousePosition.x = event.clientX;
      _this.mousePosition.y = event.clientY;
    });

    window.addEventListener('resize', _this.resize.bind(_this), false);

  },

  resize: function() {
    var _this = this;

    _this.camera.aspect = window.innerWidth / window.innerHeight;
    _this.camera.updateProjectionMatrix();

    _this.renderer.setSize(window.innerWidth, window.innerHeight);

  },

  reset: function() {
    var _this = this;

    if (_this.percentLoaded === 0) {
      $('#loading').show();
      _this.addModels();
    }

  },

  testContent: function() {
    var _this = this;

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({color: 0x00ff00,});

    _this.cube = new THREE.Mesh(geometry, material);

    _this.scene.add(_this.cube);

  },

  addModels: function() {
    var _this = this;

    _this.filesLength = Models.length * 2;

    // Models is declared inside the loop on index.php. It contains an array of objects.
    for (var i = 0; i < Models.length; i++) {
      _this.addModel(Models[i], function() {

        _this.filesLoaded++;

        _this.percentLoaded = (_this.filesLoaded / _this.filesLength) * 100;

        console.log('Files percent loaded', _this.percentLoaded);

        if (_this.percentLoaded === 100) {
          $('#loading').addClass('loaded');
        } else {
          $('#loading-overlay').css('width', (100 - Math.round(_this.percentLoaded, 2)) + '%');
        }

      });
    }

  },

  addModel: function(model, callback) {
    var _this = this;

    THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());

    var loader = new THREE.OBJMTLLoader();

    loader.load(model.obj, model.mtl, function (object) {

      // Set the object post url
      object.url = model.url;

      // Set object position and rotation
      object.position.x = model.position.x;
      object.position.y = model.position.y;
      object.position.z = model.position.z;
      object.rotation.y = model.rotation.y;

      //_this.models.push( object );
      _this.scene.add(object);

    }, function(xhr) {

      _this.onProgress(xhr, callback);

    }, _this.onError);
  },

  onProgress: function(xhr, callback) {
    var _this = this;

    if (xhr.lengthComputable) {
      var percentComplete = xhr.loaded / xhr.total * 100;

      if (percentComplete === 100) {
        callback();
      } else {
        console.log('file ' + xhr.currentTarget.responseURL + ': ' + Math.round(percentComplete, 2) + '% downloaded');
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
    ], 2048);

    skybox.name = 'skybox';

    _this.scene.add(skybox);
  },

  makeSkybox: function(urls, size) {
    var skyboxCubemap = THREE.ImageUtils.loadTextureCube(urls);

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

    // The following will translate the mouse coordinates into a number
    // ranging from -1 to 1, where
    // x == -1 && y == -1 means top-left, and
    // x ==  1 && y ==  1 means bottom right
    var x = ( _this.mousePosition.x / window.innerWidth ) * 2 - 1;
    var y = -( _this.mousePosition.y / window.innerHeight ) * 2 + 1;

    // Set our direction vector to those initial values
    _this.directionVector.set(x, y, 1);

    // Unpropject the vector
    _this.directionVector.unproject(_this.camera);

    // Substract the vector representing the camera position
    _this.directionVector.sub(_this.camera.position);

    // Normalize the vector, to avoid large numbers from the
    // projection and substraction
    _this.directionVector.normalize();

    _this.raycaster.set(_this.camera.position, _this.directionVector);

    // Ask the raycaster for intersects with all objects in the scene:
    // (The second arguments means "recursive")
    var intersects = _this.raycaster.intersectObjects(_this.scene.children, true);

    if (intersects.length) {

      // intersections are, by default, ordered by distance,
      // so we only care for the first one. The intersection
      // object holds the intersection point, the face that's
      // been "hit" by the ray, and the object to which that
      // face belongs. We only care for the object itself.
      var target = intersects[0].object;

      // If hovering something that is not the skybox
      if (target.name !== 'skybox' && target.name !== 'axes') {

        $('body').addClass('u-pointer');

        // Rotate hovered object
        target.parent.rotation.x += Math.sin(new Date().getTime() * 0.001 ) * 0.0001 + 0.005;
        target.parent.rotation.y += Math.cos(new Date().getTime() * 0.001 ) * 0.0002 + 0.005;
        target.parent.rotation.z += Math.sin(new Date().getTime() * 0.002 ) * 0.0001 - 0.005;

        // Change hovered object opacity thruout all branches of the paternt object
        if (target.parent !== _this.lastHovered) {
          target.parent.traverse( function(node) {
            if (node.material) {
              node.material.opacity = 0.5;
              node.material.transparent = true;
            }
          });

          _this.lastHovered = target.parent;
        }

        // If clicked
        if (_this.mousePosition.clicked) {
          console.log('Going to: ', target.parent.url);
          TrophyModern.Ajaxy.ajaxLoad( target.parent.url );
        }

      } else {
        // If we are hovering the skybox AKA nothing

        $('body').removeClass('u-pointer');

        if (_this.lastHovered) {
          // Reset everything's opacity
          target.parent.traverse(function(node) {
            if (node.material) {
              node.material.opacity = 1;
              node.material.transparent = true;
            }
          });

          _this.lastHovered = false;
        }
      }

      _this.mousePosition.clicked = false;

    }

    if (_this.is404) {
      if (_this.scene.children[3]) {
        _this.scene.children[3].rotation.x += 0.005;
        _this.scene.children[3].rotation.y += 0.001;
        _this.scene.children[3].rotation.z += 0.003;
      }
    }

    _this.controls.update();
    _this.renderer.render(_this.scene, _this.camera);

  },

  fourohfour: function() {
    _this = this;

    var model = {
      name: '404',
      obj: WP.themeUrl + '/img/404.obj',
      mtl: WP.themeUrl + '/img/404.mtl',
      x: 0,
      y: 0,
      z: 0,
    };

    _this.addModel(model);
    _this.is404 = true;
  },
};

var TrophyModern = {
  init: function() {
      var mySwiper = new Swiper('.swiper-container', {
        keyboardControl: true,
        centeredSlides: true,
        spaceBetween: 60,
        slidesPerView: 'auto',
        nextButton: '.swiper-next',
        prevButton: '.swiper-prev',
      });
  },

};

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
    _this.setWindowValues();

    $(window).resize(function() {
      _this.setWindowValues();
      _this.logic();
    });
  },

  logic: function() {
    $('#page-copy').css('min-height', this.windowHeight + 'px');
  },

  reset: function() {
    var _this = this;

    $(window).off('resize');
    _this.init();
  },

};

TrophyModern.Email = {
  $emailForm: null,
  init: function() {
    var _this = this;

    _this. $emailForm = $('#form-inquiries');

    var url = _this.$emailForm.attr('action');

    _this.$emailForm.on('submit', function(e) {
      e.preventDefault();
      _this.onSubmit();

      $.ajax({
        type: 'POST',
        url: url,
        data: _this.$emailForm.serialize(),
        success: function(data) {
          if (data.code === 1) {
            _this.onSuccess();
          } else {
            _this.onEmailError(data.code);
          }
        },

        error: function(jqXHR, textStatus, errorThrown) {
          _this.onAjaxError(jqXHR, textStatus, errorThrown);
        },
      });

    });

  },

  onSubmit: function() {
    var _this = this;

    _this.$emailForm.css('background-color', 'gray');
    $('#form-inquiries-submit').attr('disabled', true).html('Sending...');
  },

  onSuccess: function() {
    var _this = this;

    $('#form-inquiries-inputs').hide();
    $('#form-inquiries-output').show();
  },

  onEmailError: function(code) {
    var _this = this;

    console.log(code);
  },

  onAjaxError: function(jqXHR, textStatus, errorThrown) {
    var _this = this;

    console.log(textStatus);
    console.log(errorThrown);
    console.log(jqXHR);
  },

  reset: function() {
    var _this = this;

    _this.$emailForm.off();
    _this.init();
  },

};

TrophyModern.Speech = {
  mute: false,
  speakContent: undefined,
  speakOnLoad: undefined,
  init: function() {
    var _this = this;

    $('.nav-mute-toggle').on({
      click: function() {
        _this.muteToggle();
      },
    });

    _this.afterPageload();

  },

  afterPageload: function() {
    var _this = this;

    _this.speakOnLoad = $('.speak-on-load').first();

    if (!_this.mute && _this.speakOnLoad.length) {
      _this.loadElement(_this.speakOnLoad);
    }
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

  loadElement: function($element) {
    var _this = this;

    speechSynthesis.cancel();

    _this.speakContent = undefined;
    _this.speakContent = new SpeechSynthesisUtterance();
    _this.speakContent.text = $element.text();
    _this.speakContent.lang = 'en-US';
    _this.speakContent.rate = 1;

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

// AJAX
TrophyModern.Ajaxy = {
  init: function() {
    var _this = this;

    _this.$ajaxyLinks = $('a.ajax-link');
    _this.$elementsToHide = $('.nav, #main-container, #three-scene');

    // Find all ajaxy links and bind ajax event
    _this.$ajaxyLinks.click(function(event) {
      event.preventDefault();

      var url = event.currentTarget.href;

      _this.ajaxLoad(url);

    });

    // For back button
    window.onpopstate = function() {
      _this.ajaxLoad(document.location.origin + document.location.pathname);
    };
  },

  reset: function() {
    var _this = this;

    // Unbind click from all ajax links
    _this.$ajaxyLinks.unbind('click');

    // Re initiate
    _this.init();
  },

  ajaxLoad: function(url) {
    var _this = this;

    $.ajax(url, {
      beforeSend: function() {
        _this.ajaxBefore();
      },

      dataType: 'html',
      error: function(jqXHR, textStatus) {
        _this.ajaxErrorHandler(jqXHR, textStatus);
      },

      success: function(data) {
        _this.ajaxSuccess(data, url);
      },

      complete: function() {
        _this.ajaxAfter();
      },
    });
  },

  ajaxBefore: function() {
    var _this = this;

    _this.$elementsToHide.addClass('loading');
  },

  ajaxAfter: function() {
    var _this = this;

    if (ThreeScene.percentLoaded === 0 && $('body.home').length) {
      $('#loading').show();
    }

    _this.$elementsToHide.removeClass('loading');

    _this.reset();

    // Resets from other parts of the website
    TrophyModern.init();
    Layout.reset();
    TrophyModern.Email.reset();
    TrophyModern.Speech.afterPageload();
    ThreeScene.reset();

    if ($('.error404').length) {
      ThreeScene.fourohfour();
    }
  },

  ajaxErrorHandler: function(jqXHR, textStatus) {
    alert(textStatus);
    console.log(jqXHR);
  },

  ajaxSuccess: function(data,url) {

    // Convert data into proper html to be able to fully parse thru jQuery
    var respHtml = document.createElement('html');

    respHtml.innerHTML = data;

    // Get changes: body classes, page title, main content, header
    var $bodyClasses = $('body', respHtml).attr('class');
    var $content = $('#main-container', respHtml);
    var $title = $('title', respHtml).text();

    // Push new history state and update title
    history.pushState(null, $title, url);
    document.title = $title;

    // Update with new content and classes
    $('#main-container').html($content.html());
    $('body').removeAttr('class').addClass($bodyClasses);

  },
};

$(document).ready(function () {
  'use strict';

  TrophyModern.init();
  TrophyModern.Ajaxy.init();
  TrophyModern.Email.init();
  TrophyModern.Speech.init();

  Layout.init();

  ThreeScene.init();

  if (typeof Models !== 'undefined') {
    ThreeScene.addModels();
  }

  if ($('.error404').length) {
    ThreeScene.fourohfour();
  }

});
