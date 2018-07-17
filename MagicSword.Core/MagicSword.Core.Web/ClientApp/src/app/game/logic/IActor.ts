import * as THREE from 'three';

export interface IActor {

  id: string;

  object3D: THREE.Object3D;

  mesh: THREE.Mesh;

  selectable: boolean;

  isSelected: boolean;

  draggable: boolean;

  isCard: boolean;

  isCardStack: boolean;

  name: string;

  faceUrl: string;


}
