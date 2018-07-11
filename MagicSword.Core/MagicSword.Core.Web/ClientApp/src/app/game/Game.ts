/**
 * WebGL With Three.js - Lesson 10 - Drag and Drop Objects
 * http://www.script-tutorials.com/webgl-with-three-js-lesson-10/
 */
import { HttpClient } from '@angular/common/http';
import * as THREE from 'three';

import "../../assets/js/EnableThreeExamples";
import "three/examples/js/controls/OrbitControls";

import {Skybox} from "./Skybox";
import {World} from "./logic/World";
import {IActor} from "./logic/IActor";
import {CardDefinition} from "./logic/CardDefinition";


export class Game {

  container: HTMLElement;

  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: THREE.OrbitControls;
  clock: THREE.Clock;
  plane: THREE.Mesh;
  offset: THREE.Vector3;
  raycaster: THREE.Raycaster;
  //stats: any;

  interectionObjects: THREE.Object3D[] = [];
  draggedObject: THREE.Object3D;

  world: World;

  get width(): number { return this.container.clientWidth; }
  get height(): number { return this.container.clientHeight; }

  constructor(vieport: any, private httpClient: HttpClient) {

    this.container = vieport;

    if (!this.container) {
      throw new Error("cannot find viewport");
    }

    //console.log(this.width);
    //console.log(this.height);

    this.offset = new THREE.Vector3();
    this.raycaster = new THREE.Raycaster();

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0xcce0ff, 0.0003);


    // Prepare perspective camera
    var viewAngle = 45, aspect = this.width / this.height, near = 1, far = 1000;
    this.camera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far);
    this.camera.position.set(0, 75, 75);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.scene.add(this.camera);

    // Prepare webgl renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(this.scene.fog.color);

    this.container.appendChild(this.renderer.domElement);

    this.container.addEventListener('mousedown', this.onDocumentMouseDown, false);
    this.container.addEventListener('mousemove', this.onDocumentMouseMove, false);
    this.container.addEventListener('mouseup', this.onDocumentMouseUp, false);

    // Events
    this.threeXWindowResize(this.renderer, this.camera);


    // Prepare Orbit controls
    this.controls = new THREE.OrbitControls(this.camera, this.container);
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

    this.world = new World(this, this.httpClient);

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

  registerActor = (actor: IActor) => {
    this.scene.add(actor.object3D);
    this.interectionObjects.push(actor.mesh);
  }

  updateRaycaster = (event: MouseEvent) => {

    var mouseX = (event.offsetX / this.width) * 2 - 1;
    var mouseY = -(event.offsetY / this.height) * 2 + 1;

    var vector = new THREE.Vector3(mouseX, mouseY, 1);
    vector.unproject(this.camera);

    this.raycaster.set(this.camera.position, vector.sub(this.camera.position).normalize());

    //this.raycaster.setFromCamera({ x: event.clientX,  y: event.clientY }, this.camera);
  }

  onDocumentMouseDown = (event: MouseEvent) => {

    this.updateRaycaster(event);

    var intersects = this.raycaster.intersectObjects(this.interectionObjects);

    if (intersects.length > 0) {

      var hitMesh = intersects[0].object;
      var hitActor = <IActor>hitMesh.userData["parent"];

      if (hitActor.selectable) {
        this.world.selectedActor = hitActor;
      }

      if (hitActor.draggable) {
        this.draggedObject = hitMesh;
        var intersects2 = this.raycaster.intersectObject(this.plane);
        this.offset.copy(intersects2[0].point).sub(this.plane.position);
        this.controls.enabled = false;
      }

    }
  };

  onDocumentMouseMove = (event: MouseEvent) => {
    event.preventDefault();

    this.updateRaycaster(event);

    if (this.draggedObject) {
      var intersects = this.raycaster.intersectObject(this.plane);

      //var parent = <BoxObject> this.draggedObject.userData["parent"];
      //parent.object3D.position.copy(intersects[0].point.sub(this.offset));

      if (event.buttons === 2) {
        this.draggedObject.rotateY((event.movementX) / 300);
      } else {
        this.draggedObject.position.copy(intersects[0].point.sub(this.offset));
      }
    } else {

      var intersects2 = this.raycaster.intersectObjects(this.interectionObjects);
      if (intersects2.length > 0) {
        this.plane.position.copy(intersects2[0].object.position);
        //this.plane.lookAt(this.camera.position);
      }
    }
  };

  onDocumentMouseUp = (event: MouseEvent) => {


    this.draggedObject = null;

    this.controls.enabled = true;
  };

  save = () => {
    console.log(this.scene.toJSON());
  };

  threeXWindowResize = (renderer, camera) => {

    var callback = () => {
      renderer.setSize(this.width, this.height);
      camera.aspect = this.width / this.height;
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
