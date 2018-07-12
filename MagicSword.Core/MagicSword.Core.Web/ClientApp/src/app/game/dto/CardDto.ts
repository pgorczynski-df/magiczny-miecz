import * as THREE from 'three';
import {Object3DDto as Object3dDto} from "./Object3DDto";

export class CardDto {

  definitionId: number;

  loaded: boolean;

  object3D = new Object3dDto();

}
