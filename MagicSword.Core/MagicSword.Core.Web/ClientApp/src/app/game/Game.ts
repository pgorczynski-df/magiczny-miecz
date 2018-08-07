/**
 * WebGL With Three.js - Lesson 10 - Drag and Drop Objects
 * http://www.script-tutorials.com/webgl-with-three-js-lesson-10/
 */
import * as THREE from "three";
import * as CANNON from "cannon";

import "app/../assets/js/EnableThreeExamples";
import "three/examples/js/controls/OrbitControls";
import "three/examples/js/loaders/GLTFLoader";

import { Skybox } from "app/game/Skybox";
import { World } from "app/game/logic/World";
import { IActor } from "app/game/logic/IActor";
import { Serializer } from "app/game/dto/Serializer";
import { Dice } from "app/game/Dice";
import { Collections } from "app/game/utils/Collections";
import { Services } from "app/Services";

import { Event } from "app/game/Event";
import { EventType } from "app/game/EventType";
import {ActorDto} from "app/game/dto/ActorDto";
import {Player} from "app/game/Player";

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

  dragInitialPosition = new THREE.Vector3();
  dragInitialRotation = new THREE.Euler();

  id: string;

  world: World;

  actors: IActor[] = [];

  physicsScene: CANNON.World;

  dice: Dice;

  serializer = new Serializer();

  events: Event[] = [];

  players: Player[] = [];

  constructor(vieport: any, public services: Services) {

    this.container = vieport;

    if (!this.container) {
      throw new Error("cannot find viewport");
    }

    //this.publishEvent("asdasd", "asdas");

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

    this.container.addEventListener("mousedown", this.onDocumentMouseDown, false);
    this.container.addEventListener("mousemove", this.onDocumentMouseMove, false);
    this.container.addEventListener("mouseup", this.onDocumentMouseUp, false);

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

    var senderName = "xxx";
    var sender = this.findPlayer(ev.sourcePlayerId);
    if (sender) {
      senderName = sender.name;
    }

    switch (ev.eventType) {
      case EventType.GameLoadRequest:
        var dto = this.serialize();
        this.services.outboundBus.publish(EventType.GameLoadResponse, dto);
        break;

      case EventType.GameLoadResponse:
        var dto2 = ev.data;
        this.deserialize(dto2);
        break;

      case EventType.ActorMove:
      case EventType.ActorRotate:
        var actorDto = ev.data as ActorDto;
        var actor = this.actors.find(a => a.id === actorDto.id);
        if (actor) {
          this.serializer.deserializeActor(actorDto, actor);
          this.services.logger.info(`Gracz ${senderName} przesunął kartę ${actor.name}`);
        } else {
          this.services.logger.warn(`Cannot find actor with id: ${actorDto.id}`);
        }
        break;
      case EventType.PlayerJoined:
        var playerId = ev.data.id;
        var player = this.findPlayer(playerId);
        if (!player) {
          this.players.push(ev.data);
          console.log(this.players);
        }
        this.services.logger.info(`Gracz ${ev.data.name} dołącza do gry`);
        break;
      default:
        this.services.logger.warn("Unknown event type: " + ev.eventType);
    }

  }

  private findPlayer(playerId: string) {
    return this.players.find(p => p.id === playerId);
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
      } else {
        this.world.clearSelectedActor();
      }

      if (hitActor.draggable) {
        this.draggedObject = hitActor.object3D;
        this.dragInitialPosition.copy(this.draggedObject.position);
        this.dragInitialRotation.copy(this.draggedObject.rotation);
        this.controls.enabled = false;
      }
    } else {
      this.world.clearSelectedActor();
    }

  };

  onDocumentMouseMove = (event: MouseEvent) => {
    event.preventDefault();

    this.updateRaycaster(event);

    if (this.draggedObject) {

      if (event.buttons === 2) {
        this.draggedObject.rotateY((event.movementX) / 300);

      } else {
        var intersects = this.raycaster.intersectObject(this.plane);
        var intersect = intersects[0].point;
        this.draggedObject.position.x = intersect.x;
        this.draggedObject.position.z = intersect.z;

      }
    }
  };

  onDocumentMouseUp = (event: MouseEvent) => {

    if (!this.draggedObject) {
      return;
    }

    var finalPosition = this.draggedObject.position;

    if (finalPosition.distanceTo(this.dragInitialPosition) > 0.001) {
      var actor = this.draggedObject.userData["parent"];
      var actorDto = this.serializer.serializeActor(actor);
      this.publishEvent(EventType.ActorMove, actorDto);
    }

    var finalRotation = this.draggedObject.rotation;
    if (finalRotation.toVector3().distanceTo(this.dragInitialRotation.toVector3()) > 0.001) {
      var actor2 = this.draggedObject.userData["parent"];
      var actorDto2 = this.serializer.serializeActor(actor2);
      this.publishEvent(EventType.ActorRotate, actorDto2);
    }

    this.draggedObject = null;
    this.controls.enabled = true;
  };

  publishEvent(eventType: string, data: any = null) {
    this.services.outboundBus.publish(this.id, eventType, data);
    this.events.push({
      gameId: this.id,
      eventType: eventType,
      data: data
    } as Event);
  }

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

    window.addEventListener("resize", callback, false);

    return {
      stop: () => {
        window.removeEventListener("resize", callback);
      }
    };
  }

  get width(): number { return this.container.clientWidth; }
  get height(): number { return this.container.clientHeight; }

}
