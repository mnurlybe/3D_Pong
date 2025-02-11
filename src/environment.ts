import { Scene, Mesh, MeshBuilder, Vector3, HemisphericLight, ShadowGenerator, PointLight, StandardMaterial, Color3 } from "@babylonjs/core";

export class Environment {
    private _scene: Scene;

    public _plane: Mesh;
    public _table: Mesh;
    public _ground: Mesh;
    public _paddle1: Mesh;
    public _paddle2: Mesh;
    public _ball: Mesh;

    constructor(scene: Scene) {
        this._scene = scene;
    }

    public load() {
        
        /*  ----LIGHTS---- */
        // var light0: HemisphericLight = new HemisphericLight("light1", new Vector3(0, 1, 0), this._scene);

        const light: PointLight = new PointLight("sparklight", new Vector3(0, 5, 0), this._scene);
        light.diffuse = new Color3(1, 1, 1);
        light.intensity = 1;
        light.radius = 5;
        // add shadow generator
        const shadowGenerator: ShadowGenerator = new ShadowGenerator(1024, light);
        shadowGenerator.darkness = 0.4;
        // shadowGenerator.useBlurExponentialShadowMap = true;
        // shadowGenerator.blurKernel = 32;
        
        /*  ----table---- */
        this._table = MeshBuilder.CreateBox("table", { width: 5, depth: 3, height: 0.15 }, this._scene);
        this._table.scaling = new Vector3(1.5, 1.5, 1.5);
        this._table.position = new Vector3(0, 0, 0);
        this._table.receiveShadows = true;
        /*  ----plane---- */
        this._plane = MeshBuilder.CreatePlane("plane", { width: 5, height: 2.80 }, this._scene);
        this._plane.scaling = new Vector3(1.5, 1.5, 1);
        this._plane.rotation = new Vector3(Math.PI/2, 0, 0); // Rotate to lay flat
        this._plane.position = new Vector3(0, 0.12, 0);
        const planeMaterial = new StandardMaterial("planeMaterial", this._scene);
        planeMaterial.diffuseColor = new Color3(0.8, 0.4, 0.5); // pink color plane
        this._plane.receiveShadows = true;

        
        this._plane.material = planeMaterial;
        /*  ----ground---- */
        // this._ground = MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, this._scene);
        
        /*  ----paddles---- */
        const paddleWidth = 0.1;
        const paddleHeight = 0.6;
        const paddleDepth = 0.1;
        this._paddle1 = MeshBuilder.CreateBox("paddle1", { width: paddleWidth, depth: paddleDepth, height: paddleHeight }, this._scene);
        this._paddle1.position = new Vector3(-this._plane.scaling.x * 2.5 + paddleWidth, 0.12 + paddleDepth/2, 0); // X: -(plane width * scale)/2
        this._paddle1.scaling = new Vector3(1.5, 1.5, 1.5);
        this._paddle1.rotation = new Vector3(0, Math.PI/2, Math.PI/2); // Rotate to stand up
        this._paddle1.receiveShadows = true;
        shadowGenerator.addShadowCaster(this._paddle1);

        this._paddle2 = MeshBuilder.CreateBox("paddle2", { width: paddleWidth, depth: paddleDepth, height: paddleHeight }, this._scene);
        this._paddle2.position = new Vector3(this._plane.scaling.x * 2.5 - paddleWidth, 0.12 + paddleDepth/2, 0); // X: (plane width * scale)/2
        this._paddle2.scaling = new Vector3(1.5, 1.5, 1.5);
        this._paddle2.rotation = new Vector3(0, Math.PI/2, Math.PI/2); // Rotate to stand up
        this._paddle2.receiveShadows = true;
        shadowGenerator.addShadowCaster(this._paddle2);

        /*  ----ball---- */
        const ballDiameter = 0.25;
        this._ball = MeshBuilder.CreateSphere("ball", { diameter: ballDiameter }, this._scene);
        this._ball.position = new Vector3(0, 0.12 + ballDiameter / 2, 0); // Center of the plane
        const ballMaterial = new StandardMaterial("ballMaterial", this._scene);
        ballMaterial.diffuseColor = new Color3(0, 0, 1); // Blue color
        ballMaterial.specularColor = new Color3(0, 0, 0); // Matte material
        this._ball.material = ballMaterial;
        this._ball.receiveShadows = true;
        shadowGenerator.addShadowCaster(this._ball);    
    }
}