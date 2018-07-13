import * as THREE from 'three';

import { CardDefinition } from "./CardDefinition";

export class CardStackDefinition {

  id: number;

  name: string;

  type: string;

  resourcePath: string;

  imageUrl: string;

  cardDefinitionsUrl: string;

  cardDefinitions: CardDefinition[];

  initialPosition: THREE.Vector3 = new THREE.Vector3();

  initialRotation: THREE.Euler = new THREE.Euler();

  isPawnStack = false;
}
