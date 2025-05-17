import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { TransformNode } from "@babylonjs/core";
import { Scene } from "@babylonjs/core/scene";
import { LoadAssetContainerAsync } from "@babylonjs/core";

export class Arena {
  private Mesh: TransformNode | null = null;
  private scene: Scene;

  constructor(scene: Scene) {
	this.scene = scene;
  }

  async Load()
  {
	const Container = await LoadAssetContainerAsync(
		"/Models/scene.glb",
		this.scene	
	)
	Container.addAllToScene();

	const ObjGroup = new TransformNode("ArenaGroup", this.scene);

	Container.meshes.forEach((mesh) => {
		if (mesh.name !== "__root__") mesh.parent = ObjGroup;
	})
	this.Mesh = ObjGroup;
  }
}
