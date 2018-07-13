import * as THREE from 'three';
import * as CANNON from 'cannon';

export class Dice {

  object3D: THREE.Object3D;
  body: CANNON.Body;

  constructor() {

    // Create a sphere
    this.body = new CANNON.Body(<any>{
      mass: 1, // kg
      position: new CANNON.Vec3(-10, 20, 0), // m
      shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
    });

    this.body.velocity.x = 20;
    this.body.angularVelocity.z = -10;
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
  }

  throw = () => {
    this.body.position.set(-10, 20, 0);
    this.body.velocity.x = 20;
    this.body.angularVelocity.z = -10;
  }

}
