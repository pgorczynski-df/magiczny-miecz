import * as THREE from "three";

import { WorldDto } from "./WorldDto";
import {Object3DDto as Object3dDto} from "./Object3DDto";

export class GameDto {

  camera = new Object3dDto();

  world: WorldDto;

}
