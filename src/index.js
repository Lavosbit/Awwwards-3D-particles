import * as THREE from 'three'
// import { LogLuvEncoding } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Model from './model';
import gsap from 'gsap'

/*------------------------------
Renderer
------------------------------*/
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


/*------------------------------
Scene & Camera
------------------------------*/
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 
  50, 
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 5;
camera.position.y = 1;


/*------------------------------
Mesh
------------------------------*/
// const geometry = new THREE.BoxGeometry(2, 2, 2);
// const material = new THREE.MeshBasicMaterial( { 
//   color: 0x00ff00,
// } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );


/*------------------------------
OrbitControls
------------------------------*/
const controls = new OrbitControls( camera, renderer.domElement );
controls.enabled = false

/*------------------------------
Helpers
------------------------------*/
// const gridHelper = new THREE.GridHelper( 10, 10 );
// scene.add( gridHelper );
// const axesHelper = new THREE.AxesHelper( 5 );
// scene.add( axesHelper );

/*------------------------------
Models
------------------------------*/
const logo = new Model ({
  name: 'logo',
  file: './models/logo.glb',
  scene: scene,
  color1: '#0FC2ED',
  color2: '#47A86e',
  background: '#102A30',
  placeOnLoad: true,
})
const horse = new Model ({
  name: 'horse',
  file: './models/horse.glb',
  scene: scene,
  color1: 'blue',
  color2: 'pink',
  background: '#110047',
  placeOnLoad: false,
})

// const rocket = new Model ({
//   name: 'rocket',
//   file: './models/rocket.glb',
//   scene: scene,
//   color1: 'blue',
//   color2: 'pink',
//   background: '#110047',
//   placeOnLoad: false,
// })

/*------------------------------
Controllers
------------------------------*/
const buttons = document.querySelectorAll('.button')

buttons[0].addEventListener('click', () => {
  logo.add()
  horse.remove()
})
buttons[1].addEventListener('click', () => {
  logo.remove()
  horse.add()
})


/*------------------------------
Clock
------------------------------*/
const clock = new THREE.Clock()


/*------------------------------
Loop
------------------------------*/
const animate = function () {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );

  if(logo.isActive) {
    logo.particlesMaterial.uniforms.uTime.value = clock.getElapsedTime()
  }
  if (horse.isActive) {
    horse.particlesMaterial.uniforms.uTime.value = clock.getElapsedTime()
  }
};
animate();


/*------------------------------
Resize
------------------------------*/
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
window.addEventListener( 'resize', onWindowResize, false );

/*------------------------------
MouseMove
------------------------------*/
function onMouseMove(e) {
  const x = e.clientX * 2.15
  const y = e.clientY * 2.15

  gsap.to(scene.rotation, {
    y: gsap.utils.mapRange(0, window.innerWidth, .2, -.2, x),
    x: gsap.utils.mapRange(0, window.innerHeight, .2, -.2, y),
    duration: .8,
    ease: 'power3.out'
  })
}
window.addEventListener('mousemove', onMouseMove)