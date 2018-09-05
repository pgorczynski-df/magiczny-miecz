import { CardDefinition } from "@App/common/mechanics/definitions/CardDefinition";
import { AttributeDefinition } from "@App/common/mechanics/definitions/AttributeDefinition";
import { Card } from "@App/common/mechanics/Card";

export class Character extends Card {

    parameterValues: number[] = new Array(AttributeDefinition.parameterDefinitions.length);
    //textObjects: TextObject[] = new Array(AttributeDefinition.parameterDefinitions.length);

    constructor(definition: CardDefinition, resourcePath: string, width: number, height: number, depth: number, delay = false) {
        super(definition, resourcePath, width, height, depth, delay);
        for (var i = 0; i < AttributeDefinition.parameterDefinitions.length; i++) {
            this.parameterValues[i] = 0;
            //this.textObjects[i] = null;
        }
    }

    init(): void {

        //super.init();

        //this.loaded = false;

        for (var definition of AttributeDefinition.parameterDefinitions) {
            this.increase(definition.name, definition.initialValue);
        }

        //this.loaded = true;
    }


    increase(parameterName: string, amount = 1) {

        var index = this.findIndex(parameterName);
        this.parameterValues[index] += amount;

        //if (this.textObjects[index]) {
        //    this.removeChild(this.textObjects[index].mesh);
        //}

        var definition = AttributeDefinition.parameterDefinitions[index];

        //var text = new TextObject(World.font, this.parameterValues[index].toString(), definition.color);
        //text.mesh.position.copy(definition.position);
        //this.addChild(text.mesh);
    }

    private findIndex(parameterName: string): number {
        return AttributeDefinition.parameterDefinitions.findIndex(p => p.name === parameterName);
    }

}
