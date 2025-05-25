import {
  PointerEventTypes,
  TransformNode,
  Matrix,
  Vector3,
  BoundingInfo,
  Plane,
  Space,
} from "@babylonjs/core";
import { Scene } from "@babylonjs/core/scene";
import { LoadAssetContainerAsync } from "@babylonjs/core";

export class Paddle {
  private Mesh: TransformNode | null = null;
  private scene: Scene;
  private canvas: HTMLCanvasElement;
  private floorMesh: TransformNode | null = null;
  private Boundaries = {
    x: { min: -2, max: 2 },
    z: { min: 1.5, max: 3 },
  };
  private meshOffset: Vector3 | null = null; // Offset to align top center

  constructor(scene: Scene, canvas: HTMLCanvasElement) {
    this.scene = scene;
    this.canvas = canvas;
  }

  async load(): Promise<void> {
    try {
      const Container = await LoadAssetContainerAsync(
        "/Models/paddle.glb",
        this.scene
      );
      Container.addAllToScene();

      const ObjGroup = new TransformNode("PaddleGroup", this.scene);

      Container.meshes.forEach((mesh) => {
        if (mesh.name !== "__root__") mesh.parent = ObjGroup;
      });
      this.Mesh = ObjGroup;
    } catch (error) {
      console.error("Error loading paddle model:", error);
    }

    this.floorMesh = this.scene.getMeshByName("Plane_primitive0");
    this.setupInitialPosition();
  }

  setupInitialPosition(): void {
    if (this.Mesh) {
      this.Mesh.position.x = 0;
      this.Mesh.position.y = 1.8;
      this.Mesh.position.z = this.Boundaries.z.max;

      // Enable Euler angles
      this.Mesh.rotationQuaternion = null;

      // Keep original X-rotation to align paddle flat on the table
      this.Mesh.rotation.x = -Math.PI / 2;
      this.Mesh.rotation.y = 0;
      this.Mesh.rotation.z = 0;

      this.Mesh.rotate(Vector3.Forward(), Math.PI / 2, Space.WORLD);
    }
  }

  setupPointerControls(): void {
  
  }
}
