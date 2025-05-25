import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { AbstractMesh, TransformNode } from "@babylonjs/core";
import { Scene } from "@babylonjs/core/scene";
import { LoadAssetContainerAsync } from "@babylonjs/core";

export class Arena {
  private Mesh: TransformNode | null = null;
  private scene: Scene;
  private TableBaseMesh: AbstractMesh | null = null;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  async Load() {
    const Container = await LoadAssetContainerAsync(
      "/Models/scene.glb",
      this.scene
    );
    Container.addAllToScene();

    const ObjGroup = new TransformNode("ArenaGroup", this.scene);

    Container.meshes.forEach((mesh) => {
      if (mesh.name !== "__root__") {
        mesh.parent = ObjGroup;
      }
      if (mesh.name === "TableBase") {
        this.TableBaseMesh = mesh as AbstractMesh;
      }
    });
    this.Mesh = ObjGroup;
  }

  // TableBase
  getPhysicsInfo(): {
    position: { x: number; y: number; z: number };
    size: { x: number; y: number; z: number };
  } | null {
    if (!this.TableBaseMesh) return null;

    const pos = this.TableBaseMesh.getAbsolutePosition();
    const boundingInfo = this.TableBaseMesh.getBoundingInfo();
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
}
