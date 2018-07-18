/**
 * WebGL With Three.js - Lesson 10 - Drag and Drop Objects
 * http://www.script-tutorials.com/webgl-with-three-js-lesson-10/
 */
import * as THREE from 'three';
import * as CANNON from 'cannon';

import "../../assets/js/EnableThreeExamples";
import "three/examples/js/controls/OrbitControls";
import "three/examples/js/loaders/GLTFLoader";

import { Skybox } from "./Skybox";
import { World } from "./logic/World";
import { IActor } from "./logic/IActor";
import { Serializer } from "./dto/Serializer";
import { Dice } from "./Dice";
import { Collections } from "./utils/Collections";
import { Services } from "./Services";

import { Event } from "../game/Event";
import { EventType } from "../game/EventType";

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

  actors: IActor[] = [];

  physicsScene: CANNON.World;

  dice: Dice;

  serializer = new Serializer();

  get width(): number { return this.container.clientWidth; }
  get height(): number { return this.container.clientHeight; }

  constructor(vieport: any, public services: Services) {

    this.container = vieport;

    if (!this.container) {
      throw new Error("cannot find viewport");
    }

    this.services.inboundBus.of().subscribe(e => this.processIncomingEvent(e));

    this.offset = new THREE.Vector3();
    this.raycaster = new THREE.Raycaster();

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0xcce0ff, 0.0003);


    var viewAngle = 45, aspect = this.width / this.height, near = 1, far = 1000;
    this.camera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far);
    this.resetCamera();

    this.scene.add(this.camera);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(this.scene.fog.color);

    this.container.appendChild(this.renderer.domElement);

    this.container.addEventListener('mousedown', this.onDocumentMouseDown, false);
    this.container.addEventListener('mousemove', this.onDocumentMouseMove, false);
    this.container.addEventListener('mouseup', this.onDocumentMouseUp, false);

    this.threeXWindowResize(this.renderer, this.camera);


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

    this.physicsScene = new CANNON.World();
    this.physicsScene.gravity.set(0, -9.82, 0); // m/s²

    var groundShape = new CANNON.Plane();
    var groundBody = new CANNON.Body({
      mass: 0 // mass == 0 makes the body static
    });
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);

    this.physicsScene.addBody(groundBody);


    this.dice = new Dice();
    this.dice.init(this.scene);
    this.physicsScene.addBody(this.dice.body);

    this.world = new World(this);

    //var composer = new THREE.EffectComposer(this.renderer);

    //var renderPass = new THREE.RenderPass(this.scene, this.camera);
    //composer.addPass(renderPass);

    //var outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), this.scene, this.camera);
    //composer.addPass(outlinePass);

    var dt = 1 / 60;

    var animate = () => {
      requestAnimationFrame(animate);

      this.physicsScene.step(dt);
      this.dice.update();

      this.renderer.render(this.scene, this.camera);
      this.controls.update();
    };

    animate();
  }

  private resetCamera = () => {
    this.camera.position.set(0, 75, 75);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
  }

  private processIncomingEvent = (ev: Event) => {

    switch (ev.eventType) {
      case EventType.GameLoadRequest:
        var dto = this.serialize();
        this.services.outboundBus.publish(
          {
            eventType: EventType.GameLoadResponse,
            data: dto,
          } as Event);
      case EventType.GameLoadResponse:
        var dto2 = ev.data;
        this.deserialize(dto2);
      default:
        this.services.logger.warn("Unknown event type: " + ev.eventType);
    }

  }

  addActor = (actor: IActor) => {
    this.actors.push(actor);
    this.scene.add(actor.object3D);
    this.interectionObjects.push(actor.object3D);
  }

  removeActor = (actor: IActor) => {

    var object3D = actor.object3D;
    this.interectionObjects = Collections.remove(this.interectionObjects, object3D);
    //just in case
    if (this.draggedObject === actor.object3D) {
      this.draggedObject = null;
    }

    this.scene.remove(object3D);

    this.actors = Collections.remove(this.actors, object3D);
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

    var intersects = this.raycaster.intersectObjects(this.interectionObjects, true);

    if (intersects.length > 0) {

      var hitMesh = intersects[0].object;
      var hitActor = <IActor>hitMesh.userData["parent"];

      if (hitActor.selectable) {
        this.world.selectActor(hitActor);
      }

      if (hitActor.draggable) {
        this.draggedObject = hitActor.object3D;
        this.controls.enabled = false;
      }

    }
  };

  onDocumentMouseMove = (event: MouseEvent) => {
    event.preventDefault();

    this.updateRaycaster(event);

    if (this.draggedObject) {
      var intersects = this.raycaster.intersectObject(this.plane);

      if (event.buttons === 2) {
        this.draggedObject.rotateY((event.movementX) / 300);
      } else {
        var int = intersects[0].point;
        this.draggedObject.position.x = int.x;
        this.draggedObject.position.z = int.z;
      }
    }
  };

  onDocumentMouseUp = (event: MouseEvent) => {

    this.draggedObject = null;
    this.controls.enabled = true;
  };

  new = () => {
    this.resetCamera();
    this.world.newGame();
  }

  serialize = (): any => {
    return this.serializer.serializeGame(this);
  }

  deserialize = (dto: any): any => {
    this.serializer.deserializeGame(dto, this);
  }

  save = () => {

    var c = this.serialize();
    var ss = JSON.stringify(c);
    localStorage.setItem("mmsave", ss);
  }

  load = () => {
    var ss = localStorage.getItem("mmsave");
    var c = JSON.parse(ss);
    this.deserialize(c);
  }

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
