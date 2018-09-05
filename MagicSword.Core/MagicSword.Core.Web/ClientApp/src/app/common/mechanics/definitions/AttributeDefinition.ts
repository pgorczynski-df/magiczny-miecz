import * as THREE from "three";

export class AttributeDefinition {

    static readonly Strength = "Strength";
    static readonly Power = "Power";
    static readonly Gold = "Gold";
    static readonly Life = "Life";

    name: string;
    color: THREE.Color;
    position: THREE.Vector3;
    initialValue: number;

    static find(name: string): AttributeDefinition {
        return AttributeDefinition.attributeDefinitions.find(p => p.name === name);
    }

    static attributeDefinitions: AttributeDefinition[] = [
        {
            name: AttributeDefinition.Strength,
            position: new THREE.Vector3(-12, 0, -5),
            color: new THREE.Color(0xff0000),
            initialValue: 1,
        },
        {
            name: AttributeDefinition.Power,
            position: new THREE.Vector3(-12, 0, 5),
            color: new THREE.Color(0x0000ff),
            initialValue: 1,
        },
        {
            name: AttributeDefinition.Gold,
            position: new THREE.Vector3(12, 0, -5),
            color: new THREE.Color(0xffff00),
            initialValue: 1,
        },
        {
            name: AttributeDefinition.Life,
            position: new THREE.Vector3(12, 0, 5),
            color: new THREE.Color(0x00ff00),
            initialValue: 4,
        },
    ];
}
