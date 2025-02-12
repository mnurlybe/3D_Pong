import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, ArcRotateCamera, Vector3, Mesh, PointLight } from "@babylonjs/core";
import { Table } from "./inventory/table";
import { Plane } from "./inventory/plane";
import { Light } from "./inventory/light";
import { Paddle } from "./inventory/paddle";
import { Ball } from "./inventory/ball";
import { Score } from "./inventory/score";
import { GameService } from "./gameService";

enum GameState {
    NOT_STARTED,
    PAUSED,
    PLAYING,
    STOPPED
}

class Pong {

    _canvas: HTMLCanvasElement;
    _engine: Engine;
    _scene: Scene;
    _camera: ArcRotateCamera;
    _light: PointLight;
    _table: Mesh;
    _plane: Mesh;
    _leftPaddle: Paddle;
    _rightPaddle: Paddle;
    _ball: Ball;
    _gameState: GameState;
    _keys: { [key: string]: boolean } = {};
    _score: Score;
    _scoreLeft: number = 0;
    _scoreRight: number = 0;
    _gameService: GameService;
    _saveScore: boolean;
    _username: string;

    constructor() {

        this._canvas = this._createCanvas();
        this._engine = new Engine(this._canvas, true);
        this._scene = new Scene(this._engine);

        this._setUpCamera();

        this._setUpScene();

        this._gameState = GameState.NOT_STARTED;
        this._gameService = new GameService();
        this._saveScore = false;
        this._username = "dummy";

        this._setupControls();

        this._main();
    }
    
    private _createCanvas(): HTMLCanvasElement {
        
        document.documentElement.style.overflow = "hidden";
        document.documentElement.style.width = "100%";
        document.documentElement.style.height = "100%";
        document.documentElement.style.margin = "0";
        document.documentElement.style.padding = "0";

        document.body.style.overflow = "hidden";
        document.body.style.width = "100%";
        document.body.style.height = "100%";
        document.body.style.margin = "0";
        document.body.style.padding = "0";

        let canvas = document.getElementById('gameCanvas')as HTMLCanvasElement;
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'gameCanvas';
            document.body.appendChild(canvas);
        }
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.touchAction = "none";

        return canvas;
    }
    
    private _setUpCamera(): void {
        this._camera = new ArcRotateCamera("camera", 0, 0, 10, Vector3.Zero(), this._scene);
        this._camera.setPosition(new Vector3(0, 7, -10));
        this._camera.attachControl(this._canvas, true);
        this._camera.lowerRadiusLimit = -5;
        this._camera.upperRadiusLimit = 20;
    }

    private _setUpScene(): void {

        this._light = new Light(this._scene)._object;

        this._table = new Table(this._scene)._object;

        this._plane = new Plane(this._scene)._object;

        this._leftPaddle = new Paddle(this._scene, "left", this._plane.scaling.x);
        this._rightPaddle = new Paddle(this._scene, "right", this._plane.scaling.x);

        this._ball = new Ball(this._scene, this._leftPaddle, this._rightPaddle);

        this._score = new Score(this._scene);
    }
    
    private _setupControls(): void {
        // Handle both movement and game state in the same listeners
        window.addEventListener("keydown", (event) => {
            this._keys[event.key] = true;
            
            // Game state changes
            if (event.key === "Enter") {
                if (this._gameState === GameState.NOT_STARTED || this._gameState === GameState.STOPPED) {
                    this._gameState = GameState.PLAYING;
                    this._score.resetScore();
                } else if (this._gameState === GameState.PLAYING || this._gameState === GameState.PAUSED) {
                    this._gameState = GameState.STOPPED;
                    this._saveScore = true;
                }
            }
            
            if (event.key === " ") { // Space bar
                if (this._gameState === GameState.PLAYING) {
                    this._gameState = GameState.PAUSED;
                } else if (this._gameState === GameState.PAUSED) {
                    this._gameState = GameState.PLAYING;
                }
            }
        });

        window.addEventListener("keyup", (event) => {
            this._keys[event.key] = false;
        });
    }

    private async _main(): Promise<void> {

        // run the main render loop
        this._engine.runRenderLoop(() => {
            if (this._gameState === GameState.PLAYING) {
                this._leftPaddle.update();
                this._rightPaddle.update();
                this._ball.startBall();
                this._ball.update();
                if (this._ball.isOutLeft()) {
                    this._score.updateScore('right');
                    this._ball.reset();
                    this._ball.startBall();    
                } else if (this._ball.isOutRight()) {
                    this._score.updateScore('left');
                    this._ball.reset();
                    this._ball.startBall();   
                }
                if (this._score.isMaxScore()) {
                    this._gameState = GameState.STOPPED;
                    this._saveScore = true;
                }
            }
            if (this._gameState === GameState.STOPPED) {
                this._leftPaddle.reset();
                this._rightPaddle.reset();
                this._ball.reset();
                if (this._saveScore) {
                    this._gameService.saveGameResult(this._username, this._score.getLeftScore(), this._score.getRightScore());
                    this._saveScore = false;
                }
            }
            this._scene.render();
        });

        // the canvas/window resize event handler
        window.addEventListener('resize', () => {
            this._engine.resize();
        });
    }
}
new Pong();