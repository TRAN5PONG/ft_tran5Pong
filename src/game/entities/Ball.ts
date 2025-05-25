import { Scene } from "@babylonjs/core/scene";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { LoadAssetContainerAsync } from "@babylonjs/core/Loading/sceneLoader";
import { AbstractMesh } from "@babylonjs/core";

export class Ball {
  private meshGroup: TransformNode | null = null;
  private readonly scene: Scene;
  private mesh: AbstractMesh | null = null; // Store the actual mesh

  constructor(scene: Scene) {
    this.scene = scene;
  }

  async load(): Promise<void> {
    const container = await LoadAssetContainerAsync(
      "/Models/ball.glb",
      this.scene
    );
    container.addAllToScene();

    const group = new TransformNode("BallGroup", this.scene);

    container.meshes.forEach((mesh) => {
      if (mesh.name !== "__root__") {
        mesh.parent = group;
        this.mesh = mesh;
      }
    });

    this.meshGroup = group;
  }


  // TableBase
  getPhysicsInfo(): {
    position: { x: number; y: number; z: number };
    size: { x: number; y: number; z: number };
  } | null {
    if (!this.mesh) return null;

    const pos = this.mesh.getAbsolutePosition();
    const boundingInfo = this.mesh.getBoundingInfo();
    const size = boundingInfo.boundingBox.extendSize.scale(2); // full size

    return {
      position: {
        x: pos.x,
        y: pos.y,
        z: pos.z,
      },
      size: {
        x: size.x,
        y: size.y,
        z: size.z,
      },
    };
  }

  GoTo(x: number, y: number, z: number): void {
    if (this.meshGroup) {
      this.meshGroup.position.set(x, y, z);
    }
  }
}
