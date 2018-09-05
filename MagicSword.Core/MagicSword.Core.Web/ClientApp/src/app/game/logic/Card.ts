import { BoxObject } from "@App/game/BoxObject";
import { TextObject } from "@App/game/TextObject";
import { CardStack } from "@App/game/logic/CardStack";
import { CardDefinition } from "@App/common/mechanics/definitions/CardDefinition";
import { IActor } from "@App/game/logic/IActor";
import { AttributeDefinition } from "@App/common/mechanics/definitions/AttributeDefinition";
import { ResourceManager } from "@App/game/ResourceManager";

export class Card extends BoxObject implements IActor {

    selectable: boolean = true;
    draggable: boolean = true;

    isCard: boolean = true;
    isCardStack: boolean = false;

    originStack: CardStack;

    isCovered = true;

    attributes: { [name: string]: number } = {};

    private attributeTexts: { [name: string]: TextObject } = {};

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

    getType() {
        return this.constructor.name;
    }

    syncAttributeTexts() {
        for (var definition of AttributeDefinition.attributeDefinitions) {
            this.syncText(definition.name, this.attributes[definition.name]);
        }
    }

    getAttribute(name: string) {
        return this.attributes[name];
    }

    setAttribute(name: string, value: number) {
        this.attributes[name] = value;
        this.syncText(name, value);
    }

    clearAttribute(name: string) {
        this.setAttribute(name, null);
    }

    private syncText(attrName: string, value: number) {

        var textObject = this.attributeTexts[attrName];
        if (textObject) {
            this.removeChild(textObject.mesh);
            this.attributeTexts[attrName] = null;
        }

        if (value) {
            var definition = AttributeDefinition.find(attrName);
            textObject = new TextObject(ResourceManager.font, value.toString(), definition.color);
            textObject.mesh.position.copy(definition.position);
            textObject.mesh.userData["aa"] = attrName;
            this.attributeTexts[attrName] = textObject;
            this.addChild(textObject.mesh);
        }
    }

}
