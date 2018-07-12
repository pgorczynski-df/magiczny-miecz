import { BoxObject } from "../BoxObject";
import {IActor} from "./IActor";

export class GameBoard extends BoxObject implements IActor  {

  selectable: boolean = false;
  draggable: boolean = false;
  isCard: boolean = false;
  isCardStack: boolean = false;

  name = "Plansza";

  constructor(topTexture: string, width: number, aspect: number, height: number) {
    super(topTexture, width, aspect, height);
  }

}
