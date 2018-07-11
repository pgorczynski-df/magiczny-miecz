import * as THREE from 'three';

export interface IActor {

  object3D: THREE.Object3D;

  mesh: THREE.Mesh;

  selectable: boolean;

  draggable: boolean;

  isCardStack: boolean;

  name: string;

  faceUrl: string;

}
