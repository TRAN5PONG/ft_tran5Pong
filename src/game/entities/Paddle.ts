import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { TransformNode } from "@babylonjs/core";
import { Scene } from "@babylonjs/core/scene";
import { LoadAssetContainerAsync } from "@babylonjs/core";

export class Paddle {
  private Mesh: TransformNode | null = null;
  private scene: Scene;

  private Boundaries = {
    x: { min: 1.8, max: -1.8 },
    y: { min: 1, max: 1.8 },
    z: { min: 3, max: 2 },
  };

  constructor(scene: Scene) {
    this.scene = scene;
  }

  async Load() {
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
  }

  Setup() {
    if (this.Mesh) {
      this.Mesh.position.x = 0;
      this.Mesh.position.y = this.Boundaries.y.max;
      this.Mesh.position.z = this.Boundaries.z.max;
      this.Mesh.rotation.x = -Math.PI / 2;
    }
  }
}

// Boundaries
// paddle (Player)
// X : -1.8 TO 1.8 (left right)
// Y : 3 TO 2 (forward backward)
// Z : (-1.8 TO 1.8) (up down)
