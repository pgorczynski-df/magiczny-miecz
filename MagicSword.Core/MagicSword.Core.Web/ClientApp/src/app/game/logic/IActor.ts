import * as THREE from 'three';

export interface IActor {

  selectable: boolean;

  draggable: boolean;

  isCardStack: boolean;

  name: string;

  faceUrl: string;

}
