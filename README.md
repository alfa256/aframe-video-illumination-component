## aframe-video-illumination-component

[![Version](http://img.shields.io/npm/v/aframe-video-illumination-component.svg?style=flat-square)](https://npmjs.org/package/aframe-video-illumination-component)
[![License](http://img.shields.io/npm/l/aframe-video-illumination-component.svg?style=flat-square)](https://npmjs.org/package/aframe-video-illumination-component)

Simulates light coming out of a-video.

Creates one light per quadrant and tries to simulate the emissive light from a screen or movie projection.
Has an acceptable performance impact and low flicker, the result is quite realistic most of the time.

If you require another license to use this component in your closed source project please get in touch.

[DEMO](https://alfa256.github.io/aframe-video-illumination-component/examples/basic/index.html)

![effect](/examples/basic/demo.gif)

The ready player one trailer is used for demonstration purposes only and belongs to Warner Bros. Entertainment Inc.

For [A-Frame](https://aframe.io).

### API

| Property | Description       | Default Value |
| -------- | ----------------- | ------------- |
| intensity| lights intensity  | 0.2           |
| distance | falloff distance  | 10            |
| frametime| ms between updates| 41            |



### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.8.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-video-illumination-component/dist/aframe-video-illumination-component.min.js"></script>
</head>

<body>
  <a-scene>
  <a-assets>
    <video src="foo.mp4" id="somevideo" autoplay="true"></video>
  </a-assets>
    <a-video width="6" height="4" src="#somevideo" video-illumination="foo: bar"></a-video>
  </a-scene>
</body>
```

<!-- If component is accepted to the Registry, uncomment this. -->
<!--
Or with [angle](https://npmjs.com/package/angle/), you can install the proper
version of the component straight into your HTML file, respective to your
version of A-Frame:

```sh
angle install aframe-video-illumination-component
```
-->

#### npm

Install via npm:

```bash
npm install aframe-video-illumination-component
```

Then require and use.

```js
require('aframe');
require('aframe-video-illumination-component');
```
