import * as THREE from 'three';
import {Object3dDto} from "./Object3dDto";

export class CardDto {

  definitionId: number;

  loaded: boolean;

  object3D = new Object3dDto();

}
