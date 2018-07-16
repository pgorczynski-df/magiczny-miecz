import * as THREE from "three";
import * as CANNON from "cannon";

export class Dice {

  object3D: THREE.Object3D;
  body: CANNON.Body;

  previousResult = 0;
  result = 0;

  private throwing = false;

  constructor() {

    this.body = new CANNON.Body(<any>{
      mass: 1,
      position: new CANNON.Vec3(-20, 3, 0),
      shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
    });

  }

  init = (scene: THREE.Scene) => {
    var loader = new THREE["GLTFLoader"](); //missing Typing for GLTFLoader
    loader.load(
      '/assets/3d/dice/scene.gltf',
      gltf => {
        this.object3D = <THREE.Object3D>gltf.scene;
        this.object3D.scale.set(0.01, 0.01, 0.01);
        scene.add(this.object3D);
      }
    );
  }

  update = () => {
    if (this.object3D) {
      this.object3D.position.copy(<any>this.body.position);
      this.object3D.quaternion.copy(<any>this.body.quaternion);
    }

    if (this.throwing) {
      if (this.body.angularVelocity.almostZero(0.001)) {
        this.result = this.readResult();
        this.throwing = false;
      }
    }
  }

  throw = () => {

    this.throwing = true;

    this.previousResult = this.result;
    this.result = 0;

    this.body.position.set(-10, 20, 0);
    this.body.velocity.x = 20;
    this.body.angularVelocity.z = -10;
    this.body.angularVelocity.x = -10;
  }

  private readResult = (): number =>  {
    //var pi = Math.PI;
    //var x = this.object3D.rotation.x;
    //var y = this.object3D.rotation.y;
    //var z = this.object3D.rotation.z;

    //var delta = pi / 6;
    

    //if (Math.abs(x) < delta /*&& Math.abs(y) < delta*/ && Math.abs(z) < delta) {
    //  return 2;
    //}

    //if (Math.abs(x - pi) < delta && Math.abs(y) < delta && Math.abs(z) < delta) {
    //  return 4;
    //}

    //if (Math.abs(x) < delta && /*Math.abs(y) < delta &&*/ Math.abs(z - pi) < delta) {
    //  return 6;
    //}

    //if (Math.abs(x - pi) < delta /*&& Math.abs(y) < delta*/ && Math.abs(z) < delta) {
    //  return 2;
    //}


    return this.getRndInteger(1, 6);
  }

  getRndInteger = (min, max) => Math.floor(Math.random() * (max - min)) + min;
}
