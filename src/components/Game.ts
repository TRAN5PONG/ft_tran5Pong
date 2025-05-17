// GameCanvas.ts
import "@babylonjs/loaders/glTF";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";

// Entities
import { Camera } from "../game/entities/camera";
import { Debug } from "../game/entities/Debug";
import { Light } from "../game/entities/light";
import { Paddle } from "../game/entities/Paddle";
import { Arena } from "../game/entities/arena";
import { Ball } from "../game/entities/Ball";

export class GameCanvas extends HTMLElement {
  private canvas: HTMLCanvasElement;
  private engine: Engine;
  private scene: Scene;

  // Entities
  private camera: Camera;
  private light: Light;
  private debug: Debug;

  private paddle: Paddle;
  private Arena: Arena;
  private ball: Ball;

  constructor() {
    super();

    // Style the container
    this.style.width = "1000px";
    this.style.height = "90%";
    this.style.backgroundColor = "lightblue";
    this.style.padding = "10px";

    // Create canvas
    this.canvas = document.createElement("canvas");
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.style.border = "1px solid black";
    this.canvas.style.backgroundColor = "grey";
    this.appendChild(this.canvas);

    // Babylon engine & scene
    this.engine = new Engine(this.canvas, true, { adaptToDeviceRatio: true });
    this.scene = new Scene(this.engine);

    // Camera setup
    this.camera = new Camera(this.scene);
    this.camera.attach(this.canvas);

    // Debug setup
    this.debug = new Debug(this.scene, this.engine);
    this.debug.ShowGroundGrid();
    this.debug.ShowAxisLines();
    // debug.ShowDebuger();

    // Light setup
    this.light = new Light(this.scene);

    // models
    this.paddle = new Paddle(this.scene);
    this.Arena = new Arena(this.scene);
    this.ball = new Ball(this.scene);
  }

  async loadModels() {
    try {
      await Promise.all([
        this.paddle.Load(),
        this.Arena.Load(),
        this.ball.Load(),
      ]);
    } catch (err) {
      console.error("Error loading models:", err);
    }
  }

  setupGame() {
    this.paddle.Setup();
  }

  render() {
    this.loadModels().then(() => {
      this.setupGame();

      // const TableBaseMesh = this.models["scene"]
      //   .getChildMeshes()
      //   .find((el) => el.name === "TableBase");

      // const TableBaseMinX =
      //   TableBaseMesh?.getBoundingInfo().boundingBox.minimumWorld.x;
      // const TableBaseMaxX =
      //   TableBaseMesh?.getBoundingInfo().boundingBox.maximumWorld.x;
      // const TableBaseMinZ =
      //   TableBaseMesh?.getBoundingInfo().boundingBox.minimumWorld.z;
      // const TableBaseMaxZ =
      //   TableBaseMesh?.getBoundingInfo().boundingBox.maximumWorld.z;
      // const TableBaseMinY =
      //   TableBaseMesh?.getBoundingInfo().boundingBox.minimumWorld.y;
      // const TableBaseMaxY =
      //   TableBaseMesh?.getBoundingInfo().boundingBox.maximumWorld.y;

      // console.log("TableBaseMinX", TableBaseMinX);
      // console.log("TableBaseMaxX", TableBaseMaxX);
      // console.log("TableBaseMinZ", TableBaseMinZ);
      // console.log("TableBaseMaxZ", TableBaseMaxZ);
      // console.log("TableBaseMinY", TableBaseMinY);
      // console.log("TableBaseMaxY", TableBaseMaxY);
    });

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }
}
