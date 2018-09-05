import { CardStack } from "@App/common/mechanics/CardStack";
import { CardDefinition } from "@App/common/mechanics/definitions/CardDefinition";
import { ActorBase } from "@App/common/mechanics/ActorBase";

export class Card extends ActorBase {

    selectable: boolean = true;
    draggable: boolean = true;

    originStack: CardStack;

    isCovered = true;

    attributes: { [name: string]: number } = {};

    constructor(public definition: CardDefinition, resourcePath: string, width: number, height: number, depth: number, delay = false, isPawn = false) {
        super();
    }

    getAttribute(name: string) {
        return this.attributes[name];
    }

    setAttribute(name: string, value: number) {
        this.attributes[name] = value;
    }

    clearAttribute(name: string) {
        this.setAttribute(name, null);
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
