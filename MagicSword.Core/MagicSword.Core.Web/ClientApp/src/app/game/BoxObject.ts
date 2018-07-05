import * as THREE from 'three';

export class BoxObject {

  private _mesh: THREE.Mesh;

  constructor(topTexture: string, width: number, aspect: number, height: number) {

    var geometry = new THREE.BoxBufferGeometry(width, height, width / aspect);

    var mat = new THREE.MeshPhongMaterial({ color: 0x0000ff });

    var tex = new THREE.TextureLoader().load(topTexture); //async
    tex.minFilter = THREE.LinearFilter;

    var face = new THREE.MeshLambertMaterial({
      map: tex,
    });

    var materials = [
      mat,
      mat,
      face,
      mat,
      mat,
      mat
    ];

    this._mesh = new THREE.Mesh(geometry, materials);

  }

  get mesh(): THREE.Mesh { return this._mesh; }
}
