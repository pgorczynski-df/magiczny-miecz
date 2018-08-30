import { CardDefinition } from "@App/common/mechanics/definitions/CardDefinition";
import { CharacterParameterDefinition } from "@App/common/mechanics/definitions/CharacterParameterDefinition";
import { TextObject } from "App/game/TextObject";
import { ResourceManager } from "@App/game/ResourceManager";
import { Card } from "@App/game/logic/Card";

export class Character extends Card {

    parameterValues: number[];
    textObjects: TextObject[];

    constructor(definition: CardDefinition, resourcePath: string, width: number, height: number, depth: number, delay = false) {
        super(definition, resourcePath, width, height, depth, delay);
    }

    init(): void {

        super.init();

        this.loaded = false;

        this.parameterValues = new Array(CharacterParameterDefinition.parameterDefinitions.length);
        this.textObjects = new Array(CharacterParameterDefinition.parameterDefinitions.length);

        for (var i = 0; i < CharacterParameterDefinition.parameterDefinitions.length; i++) {
            this.parameterValues[i] = 0;
            this.textObjects[i] = null;
        }

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
