import { Card } from "./Card";
import { CardDefinition } from "@App/common/mechanics/definitions/CardDefinition";
import { TextObject } from "../TextObject";
import { CharacterParameterDefinition } from "@App/common/mechanics/definitions/CharacterParameterDefinition";
import { ResourceManager } from "@App/game/ResourceManager";

export class Character extends Card {

    parameterValues: number[] = new Array(CharacterParameterDefinition.parameterDefinitions.length);
    textObjects: TextObject[] = new Array(CharacterParameterDefinition.parameterDefinitions.length);

    constructor(definition: CardDefinition, resourcePath: string, width: number, height: number, depth: number, delay = false) {
        super(definition, resourcePath, width, height, depth, delay);

        for (var i = 0; i < CharacterParameterDefinition.parameterDefinitions.length; i++) {
            this.parameterValues[i] = 0;
            this.textObjects[i] = null;
        }
    }

    init(): void {

        super.init();

        this.loaded = false;

        for (var definition of CharacterParameterDefinition.parameterDefinitions) {
            this.increase(definition.name, definition.initialValue);
        }

        this.loaded = true;
    }


    increase(parameterName: string, amount = 1) {

        var index = this.findIndex(parameterName);

        this.parameterValues[index] += amount;

        if (this.textObjects[index]) {
            this.removeChild(this.textObjects[index].mesh);
        }

        var definition = CharacterParameterDefinition.parameterDefinitions[index];

        var text = new TextObject(ResourceManager.font, this.parameterValues[index].toString(), definition.color);
        text.mesh.position.copy(definition.position);
        this.addChild(text.mesh);
    }

    private findIndex(parameterName: string): number {
        return CharacterParameterDefinition.parameterDefinitions.findIndex(p => p.name === parameterName);
    }

}
