import { Scene, Mesh, MeshBuilder, Vector3 } from "@babylonjs/core";
import * as GUI from "@babylonjs/gui";

const MAX_SCORE = 3;

export class Score {
    private _leftBody: GUI.TextBlock;
    private _rightBody: GUI.TextBlock;
    private _advancedTexture: GUI.AdvancedDynamicTexture;
    private _leftScore: number = 0;
    private _rightScore: number = 0;

    constructor(scene: Scene) {
        // Create fullscreen UI
        this._advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);

        // Create left score
        this._leftBody = new GUI.TextBlock("leftScore");
        this._leftBody.text = this._leftScore.toString();
        this._leftBody.color = "white";
        this._leftBody.fontSize = 48;
        this._leftBody.top = "-300px";
        this._leftBody.left = "-200px";
        this._advancedTexture.addControl(this._leftBody);

        // Create right score
        this._rightBody = new GUI.TextBlock("rightScore");
        this._rightBody.text = this._rightScore.toString();
        this._rightBody.color = "white";
        this._rightBody.fontSize = 48;
        this._rightBody.top = "-300px";
        this._rightBody.left = "200px";
        this._advancedTexture.addControl(this._rightBody);
    }

    private _updateScorebody(): void {
        this._leftBody.text = this._leftScore.toString();
        this._rightBody.text = this._rightScore.toString();
    }

    resetScore(): void {
        this._leftScore = 0;
        this._rightScore = 0;
        this._updateScorebody();
    }

    isMaxScore(): boolean {
        return this._leftScore >= MAX_SCORE || this._rightScore >= MAX_SCORE;
    }

    updateScore(player: 'left' | 'right'): void {
        if (player === 'left') {
            this._leftScore++;
        } else {
            this._rightScore++;
        }
        this._updateScorebody();
    }

    getLeftScore(): number {
        return this._leftScore;
    }

    getRightScore(): number {
        return this._rightScore;
    }
}