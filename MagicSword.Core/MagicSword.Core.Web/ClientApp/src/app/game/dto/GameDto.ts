import * as THREE from 'three';

import { WorldDto } from "./WorldDto";
import {Object3dDto} from "./Object3dDto";

export class GameDto {

  camera = new Object3dDto();

  world: WorldDto;

}
