/**
 * WebGL With Three.js - Lesson 10 - Drag and Drop Objects
 * http://www.script-tutorials.com/webgl-with-three-js-lesson-10/
 */

import * as THREE from 'three';

import { Skybox } from "./Skybox";
import { BoxObject } from "./BoxObject"; 


(window as any)._THREE = THREE; //create a global reference to the namespace
import '../../assets/js/OrbitControls.js'; //run the actual code in the file

export class Game {

  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  container: any;
  controls: THREE.OrbitControls;
  clock: THREE.Clock;
  //stats: any;
  plane: THREE.Mesh;
  selection: THREE.Object3D;
  offset: THREE.Vector3;
  objects: THREE.Object3D[] = [];
  raycaster: THREE.Raycaster;

  mmBoard: BoxObject;

  constructor() {

    this.offset = new THREE.Vector3();
    this.raycaster = new THREE.Raycaster();

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0xcce0ff, 0.0003);

    var screenWidth = window.innerWidth, screenHeight = window.innerHeight;

    // Prepare perspective camera
    var viewAngle = 45, aspect = screenWidth / screenHeight, near = 1, far = 1000;
    this.camera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far);
    this.camera.position.set(50, 50, 0);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.scene.add(this.camera);

    // Prepare webgl renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(screenWidth, screenHeight);
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

    this.scene.add(new Skybox().mesh);

    // Plane, that helps to determinate an intersection position
    this.plane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(500, 500, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x00ffff, visible: false, side: THREE.DoubleSide }));
    this.plane.lookAt(new THREE.Vector3(0, 1, 0));

    this.scene.add(this.plane);

    //this.scene.add(new THREE.GridHelper(100, 10));

    this.mmBoard = new BoxObject("/assets/img/World.png", 100, 1.383238405207486, 1);
    this.mmBoard.register(this.scene);

    //var objGeometry = new THREE.SphereGeometry(1, 24, 24);

    for (var i = 0; i < 10; i++) {

      //var material = new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff });
      //material.transparent = true;
      //var object = new THREE.Mesh(objGeometry.clone(), material);
      //this.objects.push(object);

      //var radius = Math.random() * 4 + 2;
      //object.scale.x = radius;
      //object.scale.y = radius;
      //object.scale.z = radius;

      //object.position.x = Math.random() * 50 - 25;
      //object.position.y = 0; // Math.random() * 50 - 25;
      //object.position.z = Math.random() * 50 - 25;

      //this.scene.add(object);

      var card = new BoxObject("/assets/img/Characters/Barbarzynca.png", 10, 1.241772151898734, 2);
      card.register(this.scene);

      var object = card.mesh;
      object.position.x = Math.random() * 50 - 25;
      object.position.y = 0; // Math.random() * 50 - 25;
      object.position.z = Math.random() * 50 - 25;

      this.objects.push(card.mesh);
    }

    //var composer = new THREE.EffectComposer(this.renderer);

    //var renderPass = new THREE.RenderPass(this.scene, this.camera);
    //composer.addPass(renderPass);

    //var outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), this.scene, this.camera);
    //composer.addPass(outlinePass);

    var animate = () => {
      requestAnimationFrame(animate);

      this.renderer.render(this.scene, this.camera);
      this.controls.update();
    };

    animate();
  }

  updateRaycaster = (event) => {
    var mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    var mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    var vector = new THREE.Vector3(mouseX, mouseY, 1);
    vector.unproject(this.camera);

    this.raycaster.set(this.camera.position, vector.sub(this.camera.position).normalize());

    //this.raycaster.setFromCamera({ x: event.clientX,  y: event.clientY }, this.camera);
  }

  onDocumentMouseDown = (event) => {

    this.updateRaycaster(event);

    var intersects = this.raycaster.intersectObjects(this.objects);

    console.log(this.objects);
    console.log(intersects);

    if (intersects.length > 0) {
      this.controls.enabled = false;

      this.selection = intersects[0].object;

      var intersects2 = this.raycaster.intersectObject(this.plane);
      this.offset.copy(intersects2[0].point).sub(this.plane.position);

    }
  };

  onDocumentMouseMove = (event) => {
    event.preventDefault();

    this.updateRaycaster(event);

    if (this.selection) {
      var intersects = this.raycaster.intersectObject(this.plane);
      this.selection.position.copy(intersects[0].point.sub(this.offset));

    } else {

      var intersects2 = this.raycaster.intersectObjects(this.objects);
      if (intersects2.length > 0) {
        this.plane.position.copy(intersects2[0].object.position);
        //this.plane.lookAt(this.camera.position);
      }
    }
  };

  onDocumentMouseUp = (event) => {
    this.controls.enabled = true;
    this.selection = null;
  };

  threeXWindowResize = (renderer, camera) => {

    var callback = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    }

    window.addEventListener('resize', callback, false);

    return {
      stop: () => {
        window.removeEventListener('resize', callback);
      }
    };
  }

}
