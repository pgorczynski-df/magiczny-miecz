import * as THREE from "three";

export class Skybox {

  private _mesh : THREE.Mesh;

  constructor() {

    const sbVertexShader = [
      "varying vec3 vWorldPosition;",
      "void main() {",
      "  vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",
      "  vWorldPosition = worldPosition.xyz;",
      "  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
      "}"
    ].join("\n");

    const sbFragmentShader = [
      "uniform vec3 topColor;",
      "uniform vec3 bottomColor;",
      "uniform float offset;",
      "uniform float exponent;",
      "varying vec3 vWorldPosition;",
      "void main() {",
      "  float h = normalize( vWorldPosition + offset ).y;",
      "  gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( h, exponent ), 0.0 ) ), 1.0 );",
      "}"
    ].join("\n");

    var iSBrsize = 500;
    var uniforms = {
      topColor: { type: "c", value: new THREE.Color(0x0077ff) }, bottomColor: { type: "c", value: new THREE.Color(0xffffff) },
      offset: { type: "f", value: iSBrsize }, exponent: { type: "f", value: 1.5 }
    };

    var skyGeo = new THREE.SphereGeometry(iSBrsize, 32, 32);
    var skyMat = new THREE.ShaderMaterial({ vertexShader: sbVertexShader, fragmentShader: sbFragmentShader, uniforms: uniforms, side: THREE.DoubleSide, fog: false });
    this._mesh = new THREE.Mesh(skyGeo, skyMat);
  }

  get mesh(): THREE.Mesh { return this._mesh; }

}
