import { Scene, Mesh, MeshBuilder, Vector3 } from "@babylonjs/core";


const WIDTH = 0.1;
const DEPTH = 0.1;
const HEIGHT = 0.6;
const P_SPEED = 0.1;

export class Paddle {
    _object: Mesh;
    _side: string;
    _plane_x: number;
    private _keys: { [key: string]: boolean } = {};

    constructor(scene: Scene, side: string, plane_x: number) {

        this._side = side;
        this._plane_x = plane_x;
        this._object = MeshBuilder.CreateBox("leftpaddle", { width: WIDTH, depth: DEPTH, height: HEIGHT }, scene);
        this._object.scaling = new Vector3(1.5, 1.5, 1.5);
        this._object.rotation = new Vector3(0, Math.PI/2, Math.PI/2); // Rotate to stand up
        this._object.receiveShadows = true;

        if (this._side === "left") {
            this._object.position = new Vector3(-this._plane_x * 2.5 + WIDTH, 0.12 + DEPTH/2, 0); // X: -(plane width * scale)/2
        }
        if (this._side === "right") {
            this._object.position = new Vector3(this._plane_x * 2.5 - WIDTH, 0.12 + DEPTH/2, 0); // X: -(plane width * scale)/2
        }

        this.setupControls();
        this._object.checkCollisions = true;
    }

    setupControls() {
        window.addEventListener("keydown", (event) => {
            this._keys[event.key] = true;
        });

        window.addEventListener("keyup", (event) => {
            this._keys[event.key] = false;
        });
    }

    update() {
        const planeDepth = 2.80 * 1.5; // Your plane depth * scaling
        const paddleHeight = HEIGHT * 1.5; // Paddle height * scaling
        const maxZ = (planeDepth/2) - (paddleHeight/2); // Maximum Z position
        
        if (this._side === "left") {
            if (this._keys["w"]) {
                this._object.position.z += P_SPEED;
            }
            if (this._keys["s"]) {
                this._object.position.z -= P_SPEED;
            }
        }
        if (this._side === "right") {
            if (this._keys["p"]) {
                this._object.position.z += P_SPEED;
            }
            if (this._keys["l"]) {
                this._object.position.z -= P_SPEED;
            }
        }

        // Clamp position between boundaries
        this._object.position.z = Math.max(-maxZ, Math.min(maxZ, this._object.position.z));
    }

    reset() {
        if (this._side === "left") {
            this._object.position = new Vector3(-this._plane_x * 2.5 + WIDTH, 0.12 + DEPTH/2, 0); // X: -(plane width * scale)/2
        }
        if (this._side === "right") {
            this._object.position = new Vector3(this._plane_x * 2.5 - WIDTH, 0.12 + DEPTH/2, 0); // X: -(plane width * scale)/2
        }
    }

}