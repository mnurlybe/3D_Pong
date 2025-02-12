import { Scene, Mesh, MeshBuilder, Vector3, Color3, StandardMaterial } from "@babylonjs/core";
import { Paddle } from "./paddle";

const DIAMETER = 0.25;
const B_SPEED = 0.05;
const SPEED_INCREASE = 0.005;
const PLANE_WIDTH = 5 * 1.5;
const PLANE_HEIGHT = 2.80 * 1.5;

interface BallDirection {
    x: number;
    z: number;
}

enum BallState {
    IN_PLAY,
    OUT_OF_PLAY
}

export class Ball {
    _object: Mesh;
    _speed: number;
    _Dir: BallDirection;
    _paddleLeft: Paddle;
    _paddleRight: Paddle;
    _state: BallState;

    constructor(scene: Scene, paddleLeft: Paddle, paddleRight: Paddle) {
        this._object = MeshBuilder.CreateSphere("ball", { diameter: DIAMETER }, scene);
        this._object.position = new Vector3(0, 0.10 + DIAMETER / 2, 0); // Center of the plane
        const ballMaterial = new StandardMaterial("ballMaterial", scene);
        ballMaterial.diffuseColor = new Color3(0, 0, 1); // Blue color
        ballMaterial.specularColor = new Color3(0, 0, 0); // Matte material
        this._object.material = ballMaterial;
        this._object.receiveShadows = true;

        this._object.checkCollisions = true;
        // set start speed
        this._speed = B_SPEED;
        this._Dir = { x: 0, z: 0 };

        this._paddleLeft = paddleLeft;
        this._paddleRight = paddleRight;
        this._state = BallState.OUT_OF_PLAY;
    }

    // starts the ball in a random direction
    startBall() {
        // add random ball direction
        if (this._state === BallState.OUT_OF_PLAY) {
            this._Dir.x = (Math.random() > 0.5 ? 1 : -1) * this._speed;
            this._Dir.z = (Math.random() * 2 - 1) * this._speed;
            this._state = BallState.IN_PLAY;
        }
    }

    reset() {
        this._state = BallState.OUT_OF_PLAY;
        this._object.position.x = 0;
        this._object.position.z = 0;
        this._Dir.x = 0;
        this._Dir.z = 0;
        this._speed = B_SPEED;
    }

    isOutLeft(): boolean {
        return this._object.position.x < -PLANE_WIDTH/2;
     }
     
     isOutRight(): boolean {
        return this._object.position.x > PLANE_WIDTH/2;
     }

    update() {
        if (this._state === BallState.OUT_OF_PLAY) {
            return;
        }
        this._object.position.x += this._Dir.x;
        this._object.position.z += this._Dir.z;
        
        this.handleWallCollisions();
        this.handlePaddleCollisions();
    }

    handleWallCollisions() {
        // Top and bottom wall collisions
        const ballRadius = DIAMETER / 2;
        if (this._object.position.z + ballRadius > PLANE_HEIGHT/2 || 
            this._object.position.z - ballRadius < -PLANE_HEIGHT/2) {
            this._Dir.z *= -1; // Reverse Z direction
        }
    }

    handlePaddleCollisions() {
        const ballRadius = DIAMETER / 2;
        const paddleWidth = 0.1 * 1.5; // Your paddle width * scale
        const paddleHeight = 0.6 * 1.5; // Your paddle height * scale

        // Left paddle collision
        if (this._object.position.x - ballRadius <= this._paddleLeft._object.position.x + paddleWidth/2 &&
            this._object.position.x + ballRadius >= this._paddleLeft._object.position.x - paddleWidth/2 &&
            this._object.position.z - ballRadius <= this._paddleLeft._object.position.z + paddleHeight/2 &&
            this._object.position.z + ballRadius >= this._paddleLeft._object.position.z - paddleHeight/2) {
            if (this._Dir.x < 0) {
                this._Dir.x *= -1;
                this._speed += SPEED_INCREASE;
                this._Dir.x = this._speed * Math.sign(this._Dir.x);
                this._Dir.z = this._speed * Math.sign(this._Dir.z);
            }
        }

        // Right paddle collision
        if (this._object.position.x - ballRadius <= this._paddleRight._object.position.x + paddleWidth/2 &&
            this._object.position.x + ballRadius >= this._paddleRight._object.position.x - paddleWidth/2 &&
            this._object.position.z - ballRadius <= this._paddleRight._object.position.z + paddleHeight/2 &&
            this._object.position.z + ballRadius >= this._paddleRight._object.position.z - paddleHeight/2) {
            if (this._Dir.x > 0) {
                this._Dir.x *= -1;
                this._speed += SPEED_INCREASE;
                this._Dir.x = this._speed * Math.sign(this._Dir.x);
                this._Dir.z = this._speed * Math.sign(this._Dir.z);
            }
        }
    }

}