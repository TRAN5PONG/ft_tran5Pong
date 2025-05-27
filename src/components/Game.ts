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

// Sound
import SoundManager from "../audio/SoundManager";
import { Sound } from "@babylonjs/core";

// import Ammo from 'ammojs-typed' // todo : should be removed

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

  // Socket
  private socket: WebSocket | null = null;

  // Sound
  private audioCtx : AudioContext = new AudioContext();
  private soundManager: SoundManager = new SoundManager("/sounds/background.wav", this.audioCtx);

  constructor() {
    super();

    this.id = "gameCanvasContainer";
    // Create canvas
    this.canvas = document.createElement("canvas");
    this.canvas.id = "gameCanvas";
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
    this.debug.ShowDebuger();

    // Light setup
    this.light = new Light(this.scene);

    // models
    this.paddle = new Paddle(this.scene, this.canvas);
    this.Arena = new Arena(this.scene);
    this.ball = new Ball(this.scene);

    // Test PlayButton
    const PlayButton = document.createElement("button");
    PlayButton.innerText = "Play";
    PlayButton.style.padding = "0px 20px";
    PlayButton.style.height = "50px";
    PlayButton.style.zIndex = "1000";
    PlayButton.style.position = "absolute";
    PlayButton.onclick = () => {
      this.StartGame();
    }
    const ToggleButton = document.createElement("button");
    ToggleButton.innerText = "Toggle Muffle";
    ToggleButton.style.padding = "0px 20px";
    ToggleButton.style.height = "50px";
    ToggleButton.style.zIndex = "1000";
    ToggleButton.style.position = "absolute";
    ToggleButton.style.left = "100px";
    ToggleButton.onclick = () => {
      this.soundManager.toggleMuffle();
      this.soundManager.setVolume(0.4);
    }

    this.appendChild(PlayButton);
    this.appendChild(ToggleButton);
  }

  StartGame() {
    this.soundManager.play();
    

    this.socket = new WebSocket("http://10.13.250.143:3000/ws/game");
    // Send Init Data to server
    const TableBaseMeshData = this.Arena.getPhysicsInfo();
    this.socket.onopen = () => {
      this.socket?.send(JSON.stringify(TableBaseMeshData));
    }

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (this.ball && data?.ball) {
        this.ball.GoTo(
          data.ball.x,
          data.ball.y,
          data.ball.z
        );
      }
    };
  }

  async Init() {
    try {
      await Promise.all([
        this.paddle.load(),
        this.Arena.Load(),
        this.ball.load(),
        
        // SoundManager
        this.soundManager.loadSound(),
      ]);
    } catch (err) {
      console.error("Error Initializing game:", err);
    }
  }

  render() {
    this.Init().then(() => {
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
