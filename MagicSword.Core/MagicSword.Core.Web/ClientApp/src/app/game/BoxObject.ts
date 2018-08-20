import * as THREE from "three";
import { Guid } from "@App/common/utils/Guid";

export class BoxObject {

    public id: string;

    private geometry: THREE.BoxGeometry;

    private _face: THREE.MeshLambertMaterial;

    private _mesh: THREE.Mesh;
    private _box: THREE.BoxHelper;
    private _group: THREE.Group;

    private static _textureCache: { [id: string]: THREE.Texture; } = {};

    public loaded = false;
    private _selected = false;

    get isSelected(): boolean {
        return this._selected;
    }
    set isSelected(value: boolean) {
        this._selected = value;
        this._box.visible = value;
    }

    constructor(public topTexture: string, public width: number, public height: number, public depth: number, delay = false, private isBillboard = false) {
        this.id = Guid.uuidv4();
        if (!delay) {
            this.init();
        }
    }

    changeTex(newTexture: string) {
        var tex = BoxObject._textureCache[newTexture];
        if (!tex) {
            tex = new THREE.TextureLoader().load(newTexture); //async
            tex.minFilter = THREE.LinearFilter;
            BoxObject._textureCache[newTexture] = tex;
        }
        this._face.map = tex;
    }

    init() {

        this._group = new THREE.Group();
        this._group.userData["parent"] = this;

        this.geometry = new THREE.BoxGeometry(this.width, this.depth, this.height);

        var mat = new THREE.MeshPhongMaterial({
            color: 0x7c858e,
        });

        this._face = new THREE.MeshLambertMaterial();
        this.changeTex(this.topTexture);

        var materials = [
            mat,
            mat,
            this.isBillboard ? mat : this._face,
            mat,
            this.isBillboard ? this._face : mat,
            this.isBillboard ? this._face : mat
        ];

        this._mesh = new THREE.Mesh(this.geometry, materials);
        this.addChild(this._mesh);

        this._box = new THREE.BoxHelper(this._mesh, new THREE.Color(0xd9ea23));
        this._box.visible = false;
        this.addChild(this._box);

        this.loaded = true;
    }

    addChild(mesh: THREE.Object3D) {
        mesh.userData["parent"] = this;
        this.object3D.add(mesh);
    }

    removeChild(mesh: THREE.Object3D) {
        this.object3D.remove(mesh);
    }

    unload = () => {

        if (!this.loaded) {
            return;
        }

        //TODO?

        this.loaded = false;
    }

    get object3D(): THREE.Object3D { return this._group; }

    get mesh(): THREE.Mesh { return this._mesh; }

    get faceUrl(): string { return this.topTexture; }

}
