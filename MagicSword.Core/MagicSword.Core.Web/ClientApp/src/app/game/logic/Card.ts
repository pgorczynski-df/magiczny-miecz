import { BoxObject } from "../BoxObject";
import {CardStack} from "./CardStack";
import { CardDefinition } from "@App/common/mechanics/definitions/CardDefinition";
import {IActor} from "./IActor";

export class Card extends BoxObject implements IActor {

  selectable: boolean = true;
  draggable: boolean = true;

  originStack: CardStack;

  isCovered = true;

  constructor(public definition: CardDefinition, resourcePath: string, width: number, height: number, depth: number, delay = false, isPawn = false) {
    super(resourcePath + "/" + definition.imageUrl, width, height, depth, delay, isPawn);
  }

  get name() {
    return this.definition ? this.definition.name : "Karta";
  }

  dispose = () => {
    this.originStack.disposeCard(this);
  }

  init(): void {
     super.init();
  }

  get faceUrl(): string {
    return this.isCovered ? this.originStack.faceUrl : this.topTexture;
  }

  get contentUrl() {
    return this.topTexture;
  }

  setCovered(isCovered: boolean) {
    this.isCovered = isCovered;
    this.changeTex(this.faceUrl);
  }

  toggleCovered() {
    this.setCovered(!this.isCovered);
  }
}
