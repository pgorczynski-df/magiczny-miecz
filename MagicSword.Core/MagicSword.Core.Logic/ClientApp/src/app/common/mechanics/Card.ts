import { CardStack } from "@App/common/mechanics/CardStack";
import { CardDefinition } from "@App/common/mechanics/definitions/CardDefinition";
import { ActorBase } from "@App/common/mechanics/ActorBase";

export class Card extends ActorBase {

    selectable: boolean = true;
    draggable: boolean = true;

    originStack: CardStack;

    isCovered = true;

    constructor(public definition: CardDefinition, resourcePath: string, width: number, height: number, depth: number, delay = false, isPawn = false) {
        super();
        //super(resourcePath + "/" + definition.imageUrl, width, height, depth, delay, isPawn);
    }

    get name() {
        return this.definition ? this.definition.name : "Karta";
    }

    dispose = () => {
        this.originStack.disposeCard(this);
    }

    setCovered(isCovered: boolean) {
        this.isCovered = isCovered;
    }

    toggleCovered() {
        this.setCovered(!this.isCovered);
    }
}
