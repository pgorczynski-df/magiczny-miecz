import * as THREE from 'three';

export class CardDto {

  definitionId: number;

  loaded: boolean;

  position: THREE.Vector3 = new THREE.Vector3();

  rotation: THREE.Euler = new THREE.Euler();

}
