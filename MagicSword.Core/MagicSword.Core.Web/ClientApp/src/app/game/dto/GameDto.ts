import * as THREE from 'three';

import { WorldDto } from "./WorldDto";

export class GameDto {

  cameraPosition = new THREE.Vector3();

  cameraRotation = new THREE.Euler();

  world: WorldDto;

}
