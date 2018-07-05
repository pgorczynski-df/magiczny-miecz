/**
 * WebGL With Three.js - Lesson 10 - Drag and Drop Objects
 * http://www.script-tutorials.com/webgl-with-three-js-lesson-10/
 */

import * as THREE from 'three';

import { Skybox } from "./Skybox";

(window as any)._THREE = THREE; //create a global reference to the namespace
import '../../assets/js/OrbitControls.js'; //run the actual code in the file

export class World {

  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  container: any;
  controls: THREE.OrbitControls;
  clock: THREE.Clock;
  stats: any;
  plane: THREE.Mesh;
  selection: any;
  offset: THREE.Vector3;
  objects: any = [];
  raycaster: THREE.Raycaster;

  constructor() {

    this.offset = new THREE.Vector3();
    this.raycaster = new THREE.Raycaster();

    // Create main scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0xcce0ff, 0.0003);

    var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;

    // Prepare perspective camera
    var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 1, FAR = 1000;
    this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    this.camera.position.set(50, 50, 0);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.scene.add(this.camera);

    // Prepare webgl renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    this.renderer.setClearColor(this.scene.fog.color);

    // Prepare container
    this.container = document.createElement('div');
    document.body.appendChild(this.container);
    this.container.appendChild(this.renderer.domElement);

    // Events
    this.threeXWindowResize(this.renderer, this.camera);

    document.addEventListener('mousedown', this.onDocumentMouseDown, false);
    document.addEventListener('mousemove', this.onDocumentMouseMove, false);
    document.addEventListener('mouseup', this.onDocumentMouseUp, false);

    // Prepare Orbit controls
    this.controls = new THREE.OrbitControls(this.camera);
    this.controls.target = new THREE.Vector3(0, 0, 0);
    this.controls.maxDistance = 150;

    // Prepare clock
    this.clock = new THREE.Clock();

    // Prepare stats
    //this.stats = new Stats();
    //this.stats.domElement.style.position = 'absolute';
    //this.stats.domElement.style.left = '50px';
    //this.stats.domElement.style.bottom = '50px';
    //this.stats.domElement.style.zIndex = 1;
    //this.container.appendChild(this.stats.domElement);

    // Add lights
    this.scene.add(new THREE.AmbientLight(0x444444));

    var dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(200, 200, 1000).normalize();
    this.camera.add(dirLight);
    this.camera.add(dirLight.target);

    // Display skybox
    this.scene.add(new Skybox().mesh);

    // Plane, that helps to determinate an intersection position
    this.plane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(500, 500, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x00ffff, visible: false, side: THREE.DoubleSide }));
    this.plane.lookAt(new THREE.Vector3(0, 1, 0));
    this.scene.add(this.plane);

    //this.scene.add(new THREE.GridHelper(100, 10));

    var aspect = 1.383238405207486;

    var geometry = new THREE.BoxBufferGeometry(100, 1, 100 / aspect);

    var mat = new THREE.MeshPhongMaterial({ color: 0x0000ff });

    var tex = new THREE.TextureLoader().load('/assets/img/World.png');
    tex.minFilter = THREE.LinearFilter;

    var face = new THREE.MeshLambertMaterial({
      map: tex,
    });

    var materials = [
      mat,
      mat,
      face,
      mat,
      mat,
      mat
    ];

    var mesh = new THREE.Mesh(geometry, materials);
    this.scene.add(mesh);


    // Add 100 random objects (spheres)
    var object, material, radius;
    var objGeometry = new THREE.SphereGeometry(1, 24, 24);
    for (var i = 0; i < 10; i++) {
      material = new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff });
      material.transparent = true;
      object = new THREE.Mesh(objGeometry.clone(), material);
      this.objects.push(object);

      radius = Math.random() * 4 + 2;
      object.scale.x = radius;
      object.scale.y = radius;
      object.scale.z = radius;

      object.position.x = Math.random() * 50 - 25;
      object.position.y = 0; // Math.random() * 50 - 25;
      object.position.z = Math.random() * 50 - 25;

      this.scene.add(object);

    }

    var animate = () => {
      requestAnimationFrame(animate);

      this.renderer.render(this.scene, this.camera);
      this.controls.update();
    };

    animate();
  }

  onDocumentMouseDown = (event) => {
    // Get mouse position
    var mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    var mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    // Get 3D vector from 3D mouse position using 'unproject' function
    var vector = new THREE.Vector3(mouseX, mouseY, 1);
    vector.unproject(this.camera);

    // Set the raycaster position
    this.raycaster.set(this.camera.position, vector.sub(this.camera.position).normalize());

    // Find all intersected objects
    var intersects = this.raycaster.intersectObjects(this.objects);

    if (intersects.length > 0) {
      // Disable the controls
      this.controls.enabled = false;

      // Set the selection - first intersected object
      this.selection = intersects[0].object;

      // Calculate the offset
      var intersects2 = this.raycaster.intersectObject(this.plane);

      this.offset.copy(intersects2[0].point).sub(this.plane.position);
    }
  };

  onDocumentMouseMove = (event) => {
    event.preventDefault();

    // Get mouse position
    var mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    var mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    // Get 3D vector from 3D mouse position using 'unproject' function
    var vector = new THREE.Vector3(mouseX, mouseY, 1);
    vector.unproject(this.camera);

    // Set the raycaster position
    this.raycaster.set(this.camera.position, vector.sub(this.camera.position).normalize());

    if (this.selection) {
      // Check the position where the plane is intersected
      var intersects = this.raycaster.intersectObject(this.plane);
      // Reposition the object based on the intersection point with the plane
      this.selection.position.copy(intersects[0].point.sub(this.offset));
    } else {
      // Update position of the plane if need
      var intersects2 = this.raycaster.intersectObjects(this.objects);
      if (intersects2.length > 0) {
        this.plane.position.copy(intersects2[0].object.position);
        //this.plane.lookAt(this.camera.position);
      }
    }
  };

  onDocumentMouseUp = (event) => {
    // Enable the controls
    this.controls.enabled = true;
    this.selection = null;
  };

  threeXWindowResize(renderer, camera) {
    var callback = function () {
      // notify the renderer of the size change
      renderer.setSize(window.innerWidth, window.innerHeight);
      // update the camera
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    }
    // bind the resize event
    window.addEventListener('resize', callback, false);
    // return .stop() the function to stop watching window resize
    return {
      /**
       * Stop watching window resize
      */
      stop: function () {
        window.removeEventListener('resize', callback);
      }
    };
  }

}
