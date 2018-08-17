import * as THREE from "three";

export class CharacterParameterDefinition {

    static Strength = "Miecz";
    static Power = "Magia";
    static Gold = "Złoto";
    static Life = "Życie";

    name: string;
    color: THREE.Color;
    position: THREE.Vector3;
    initialValue: number;

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
}
