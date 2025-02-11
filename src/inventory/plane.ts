import { Scene, Mesh, MeshBuilder, Vector3, StandardMaterial, Color3 } from "@babylonjs/core";

const PLANE_WIDTH = 5;
const PLANE_HEIGHT = 2.80;

export class Plane {
    _object: Mesh;

    constructor(scene: Scene) {
        this._object = MeshBuilder.CreatePlane("plane", { width: PLANE_WIDTH, height: PLANE_HEIGHT }, scene);
        this._object.scaling = new Vector3(1.5, 1.5, 1);
        this._object.rotation = new Vector3(Math.PI/2, 0, 0); // Rotate to lay flat
        this._object.position = new Vector3(0, 0.12, 0);
        const planeMaterial = new StandardMaterial("planeMaterial", scene);
        this._object.material = planeMaterial;
        planeMaterial.diffuseColor = new Color3(0.8, 0.4, 0.5); // pink color plane
        this._object.receiveShadows = true;

        this._object.checkCollisions = true;
    }
}

