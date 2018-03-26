/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

	/* global AFRAME */

	if (typeof AFRAME === 'undefined') {
	  throw new Error('Component attempted to register before AFRAME was available.');
	}

	/**
	 * Video Illumination component for A-Frame by Alfredo Consebola 2018.
	 */
	AFRAME.registerComponent('video-illumination', {
	  schema: {

	      intensity : { type:'number', default: 0.5},

	      distance : { type:'number', default: 10 },

	      // milliseconds per update, for 24fps use 41, for 30fps use 33, for 60fps use 16
	      frametime: { type: 'number', default: 41}

	  },

	  multiple: false,

	  init: function () { 

	      let wid = this.el.object3DMap.mesh.el.getAttribute("width") / 2;
	      let hei = this.el.object3DMap.mesh.el.getAttribute("height") / 2;
	      
	      wid *= 0.7;
	      hei *= 0.7;
	      
	      let lightA = document.createElement('a-light');
	      let lightB = document.createElement('a-light');
	      let lightC = document.createElement('a-light');
	      let lightD = document.createElement('a-light');
	      
	      this.lights = [];
	      let intensity = this.data.intensity;
	      let distance =  this.data.distance;
	      //one light per quadrant
	      lightA.setAttribute('position', new THREE.Vector3(2,1.5,1));
	      lightA.setAttribute('light', { intensity: intensity, type: 'point', distance: distance});
	      this.el.appendChild(lightA);
	      this.lights.push(lightA);
	      
	      lightB.setAttribute('position', new THREE.Vector3(-2,1.5,1));
	      lightB.setAttribute('light', { intensity: intensity, type: 'point', distance: distance});
	      this.el.appendChild(lightB);
	      this.lights.push(lightB);
	      
	      lightC.setAttribute('position', new THREE.Vector3(2,-1.5,1));
	      lightC.setAttribute('light', { intensity: intensity, type: 'point', distance: distance});
	      this.el.appendChild(lightC);
	      this.lights.push(lightC);
	      
	      lightD.setAttribute('position', new THREE.Vector3(-2,-1.5,1));
	      lightD.setAttribute('light', { intensity: intensity, type: 'point', distance: distance});
	      this.el.appendChild(lightD);
	      this.lights.push(lightD);

	      this.res = 4;
	      this.video = document.querySelector(this.el.getAttribute('src'));
	      this.acanvas = document.createElement('canvas');
	      this.acanvas.setAttribute("width",this.res);
	      this.acanvas.setAttribute("height",this.res);
	      
	      this.ctx = this.acanvas.getContext('2d');

	      this.img = document.createElement('img');
	      this.img.setAttribute("width",this.res);
	      this.img.setAttribute("height",this.res);
	      
	      this.wait = 0; // throttle counter
	      
	      /*
	      
	            The idea is that we'll downscale the frame to 4x4 pixels, then sample the brightest pixel
	            and use that for the corresponding quadrant light.
	            

	            Bytes in the image data R G B A we'll use to sample:
	            
	            q0                          q1
	            0 1 2 3, 4 5 6 7         ;  8 9 10 11, 12 13 14 15,
	            16 17 18 19, 20 21 22 23 ;  24 25 26 27,  28 29 30 31,

	            q2                          q3 
	            32 33 34 35, 36 37 38 39 ;  40 41 42 43, 44 45 46 47,
	            48 49 50 51, 52 53 54 55 ;  56 57 58 59, 60 61 62 63
	            
	            So pixel [0] is bytes r : 0 + 0, g : 0 + 1, b: 0 + 2, a : 0 + 3

	      */
	      
	      this.quadrants = [
	          [0,4,16,20],
	          [8,12,24,28],
	          [32,36,48,52],
	          [40,44,56,60]
	      ];

	  },

	  remove: function () { 

	      for(let i=0; i<4; i++){
	        this.el.removeChild(this.lights[i]);
	      }
	      
	  },

	  tick: function(t,dt){
	            
	      if(this.wait >= this.data.frametime/1000){ 
	      
	          this.wait = 0;
	          
	          this.ctx.drawImage(this.video, 0, 0, this.res, this.res);
	        
	          let c = []; // brightest color of each quadrant
	          let frame = this.ctx.getImageData(0, 0, this.res, this.res);
	          
	          // for each quadrant
	          for(let j=0; j<4; j++){

	              let q = this.quadrants[j];
	              let p = [];
	              for(let i=0; i<4; i++){

	                      p[i] = [];
	                      p[i][0] = frame.data[q[i] + 0];
	                      p[i][1] = frame.data[q[i] + 1];
	                      p[i][2] = frame.data[q[i] + 2];
	                
	                      // To calculate relative luminance under sRGB and RGB colorspaces that use Rec. 709:
	                      let color = new THREE.Color(p[i][0], p[i][1], p[i][2]);
	                      p[i][3] = 0.2126*color.r + 0.7152*color.g + 0.0722*color.b;

	              }
	            
	              // find brightest
	              p.sort(function (a, b) {
	                  return a[3] < b[3];
	              });
	              c.push(p[0]);

	          }
	          
	          if(this.lights[0].object3DMap.light){
	            
	              this.lights[0].object3DMap.light.color.setRGB(c[0][0]/255 ,c[0][1]/255 ,c[0][2]/255);
	              this.lights[1].object3DMap.light.color.setRGB(c[1][0]/255 ,c[1][1]/255 ,c[1][2]/255);
	              this.lights[2].object3DMap.light.color.setRGB(c[2][0]/255 ,c[2][1]/255 ,c[2][2]/255);
	              this.lights[3].object3DMap.light.color.setRGB(c[3][0]/255 ,c[3][1]/255 ,c[3][2]/255);
	            
	          }

	      }
	      this.wait+=dt/1000;
	    }
	});


/***/ })
/******/ ]);