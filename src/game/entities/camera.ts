import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math";

export class Camera {
  private camera: ArcRotateCamera;

  constructor(scene: Scene) {
    this.camera = new ArcRotateCamera(
      "camera",
      Math.PI / 2,
      Math.PI / 3,
      8,
      new Vector3(0, 0, 0),
      scene
    );
  }

  getCamera() {
    return this.camera;
  }

  attach(canvas: HTMLCanvasElement) {
    this.camera.attachControl(canvas, true);
  }
}
