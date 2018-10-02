import { CardStack } from "@Common/mechanics/CardStack";
import { CardDefinition } from "@Common/mechanics/definitions/CardDefinition";
import { ActorBase } from "@Common/mechanics/ActorBase";

export class Card extends ActorBase {

    originStack: CardStack;

    isCovered = true;

    attributes: { [name: string]: number } = {};

    constructor(public definition: CardDefinition) {
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
