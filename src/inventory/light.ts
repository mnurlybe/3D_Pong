
import { Scene, PointLight, Color3, Vector3 } from "@babylonjs/core";

export class Light {
    _object: PointLight;

    constructor(scene: Scene) {
        this._object = new PointLight("sparklight", new Vector3(0, 5, 0), scene);
        this._object.diffuse = new Color3(1, 1, 1);
        this._object.intensity = 1;
        this._object.radius = 5;
    }
}