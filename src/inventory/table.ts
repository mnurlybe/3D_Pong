import { Scene, Mesh, MeshBuilder, Vector3 } from "@babylonjs/core";

export class Table {
    _object: Mesh;

    constructor(scene: Scene) {
        this._object = MeshBuilder.CreateBox("table", { width: 5, depth: 3, height: 0.15 }, scene);
        this._object.scaling = new Vector3(1.5, 1.5, 1.5);
        this._object.position = new Vector3(0, 0, 0);
        this._object.receiveShadows = true;
    }
}