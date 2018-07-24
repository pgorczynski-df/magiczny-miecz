import * as THREE from "three";
import { Card } from "./Card";
import { CardDefinition } from "./CardDefinition";
import { TextObject } from "../TextObject";
import { World } from "./World";
import { CharacterParameterDefinition } from "./CharacterParameterDefinition";

export class Character extends Card {

  static parameterDefinitions: CharacterParameterDefinition[] = [
    {
      name: CharacterParameterDefinition.Strength,
      position: new THREE.Vector3(-12, 0, -5),
      color: new THREE.Color(0xff0000),
      initialValue: 1,
    },
    {
      name: CharacterParameterDefinition.Power,
      position: new THREE.Vector3(-12, 0, 5),
      color: new THREE.Color(0x0000ff),
      initialValue: 1,
    },
    {
      name: CharacterParameterDefinition.Gold,
      position: new THREE.Vector3(12, 0, -5),
      color: new THREE.Color(0xffff00),
      initialValue: 1,
    },
    {
      name: CharacterParameterDefinition.Life,
      position: new THREE.Vector3(12, 0, 5),
      color: new THREE.Color(0x00ff00),
      initialValue: 4,
    },
  ];

  parameterValues: number[] = new Array(Character.parameterDefinitions.length);
  textObjects: TextObject[] = new Array(Character.parameterDefinitions.length);

  constructor(definition: CardDefinition, resourcePath: string, width: number, height: number, depth: number, delay = false) {
    super(definition, resourcePath, width, height, depth, delay);
    for (var i = 0; i < Character.parameterDefinitions.length; i++) {
      this.parameterValues[i] = 0;
      this.textObjects[i] = null;
    }
  }

  init(): void {

    super.init();

    this.loaded = false;

    for (var definition of Character.parameterDefinitions) {
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

    var definition = Character.parameterDefinitions[index];

    var text = new TextObject(World.font, this.parameterValues[index].toString(), definition.color);
    text.mesh.position.copy(definition.position);
    this.addChild(text.mesh);
  }

  private findIndex(parameterName: string): number {
    return Character.parameterDefinitions.findIndex(p => p.name === parameterName);
  }

}
