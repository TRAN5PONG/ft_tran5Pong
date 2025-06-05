// GameCanvas.ts
import "@babylonjs/loaders/glTF";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";

// Entities
import { Camera } from "../../game/entities/camera";
import { Debug } from "../../game/entities/Debug";
import { Light } from "../../game/entities/light";
import { Paddle } from "../../game/entities/Paddle";
import { Arena } from "../../game/entities/arena";
import { Ball } from "../../game/entities/Ball";

// Sound
import SoundManager from "../../audio/SoundManager";

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
  private audioCtx: AudioContext = new AudioContext();
  private soundManager: SoundManager = new SoundManager(
    "/sounds/background.wav",
    this.audioCtx
  );

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
    // this.debug.ShowDebuger();

    // Light setup
    this.light = new Light(this.scene);

    // models
    this.paddle = new Paddle(this.scene, this.canvas, this.camera.getCamera());
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
    };
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
    };

    this.appendChild(PlayButton);
    this.appendChild(ToggleButton);


    // onClick on canvas
    this.canvas.onclick = () => {
      console.log("Canvas clicked, sending Serve command to server.");
      this.socket?.send(JSON.stringify({ type: "Serve" }));
    };
  }

  StartGame() {
    // this.soundManager.play();

    this.socket = new WebSocket("http://10.13.3.8:3000/ws/game");
    this.paddle.setSocket(this.socket);
    // Send Init Data to server
    const BallMeshData = this.ball.getPhysicsInfo();
    const ChabkaMeshData = this.Arena.getPhysicsInfo();
    const PaddleMainMeshData = this.paddle.getPhysicsInfo();

    this.socket.onopen = () => {
      console.log("WebSocket connection established.");
      this.socket?.send(
        JSON.stringify({
          Ball: BallMeshData,
          Chabka: ChabkaMeshData,
          paddle: PaddleMainMeshData
        })
      );
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.socket.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (this.ball && data?.ball) {
        this.ball.GoTo(data.ball.position.x, data.ball.position.y, data.ball.position.z);
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
    this.Init().then(() => {});

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }
}
