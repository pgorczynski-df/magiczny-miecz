import * as THREE from "three";

export class TextObject {

  mesh:  THREE.Mesh;

  constructor(font: THREE.Font, text: string, color: THREE.Color) {

    var geometry = new THREE.TextGeometry(text, {
      font: font,
      size: 80,
      height: 5,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 5,
      bevelSize: 8,
      bevelSegments: 5
    });

    var materials = [
      new THREE.MeshPhongMaterial({ color: color, flatShading: true }), // front
      new THREE.MeshPhongMaterial({ color: color }) // side
    ];

    this.mesh = new THREE.Mesh(geometry, materials);
    this.mesh.rotateX(-Math.PI / 2);
    this.mesh.scale.set(0.05, 0.05, 0.05);

  }

}
