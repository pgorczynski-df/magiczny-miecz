import { CardDefinition } from "@App/common/mechanics/definitions/CardDefinition";
import { AttributeDefinition } from "@App/common/mechanics/definitions/AttributeDefinition";
import { TextObject } from "App/game/TextObject";
import { ResourceManager } from "@App/game/ResourceManager";
import { Card } from "@App/game/logic/Card";

export class Character extends Card {

    public static readonly parameter = "game_parameter";

    parameterValues: number[];
    textObjects: TextObject[];

    constructor(definition: CardDefinition, resourcePath: string, width: number, height: number, depth: number, delay = false) {
        super(definition, resourcePath, width, height, depth, delay);
    }

    init(): void {

        super.init();

        this.loaded = false;

        this.parameterValues = new Array(AttributeDefinition.attributeDefinitions.length);
        this.textObjects = new Array(AttributeDefinition.attributeDefinitions.length);

        for (var i = 0; i < AttributeDefinition.attributeDefinitions.length; i++) {
            this.parameterValues[i] = 0;
            this.textObjects[i] = null;
        }

        for (var definition of AttributeDefinition.attributeDefinitions) {
            this.increase(definition.name, definition.initialValue);
        }

        this.loaded = true;
    }


    increase(parameterName: string, amount = 1) {

        var index = AttributeDefinition.nameToIndex(parameterName);

        this.parameterValues[index] += amount;

        if (this.textObjects[index]) {
            this.removeChild(this.textObjects[index].mesh);
        }

        var definition = AttributeDefinition.attributeDefinitions[index];

        var text = new TextObject(ResourceManager.font, this.parameterValues[index].toString(), definition.color);
        text.mesh.position.copy(definition.position);
        text.mesh.userData[Character.parameter] = parameterName;
        this.textObjects[index] = text;
        this.addChild(text.mesh);
    }


}
