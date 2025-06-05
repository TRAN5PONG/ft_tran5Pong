import {
  PointerEventTypes,
  TransformNode,
  Matrix,
  Vector3,
  BoundingInfo,
  Plane,
  Space,
  Camera,
  AbstractMesh,
} from "@babylonjs/core";
import { Scene } from "@babylonjs/core/scene";
import { LoadAssetContainerAsync } from "@babylonjs/core";

export class Paddle {
  private Mesh: TransformNode | null = null;
  private MainMesh: AbstractMesh | null = null;
  private floorMesh: TransformNode | null = null;

  private scene: Scene;
  private canvas: HTMLCanvasElement;
  private camera: Camera;
  private socket: WebSocket | null = null;

  private Boundaries = {
    x: { min: -2, max: 2 },
    z: { min: 1.5, max: 3 },
  };
  private paddlePlane: Plane | null = null; // Plane for mouse intersection

  constructor(scene: Scene, canvas: HTMLCanvasElement, camera: Camera) {
    this.scene = scene;
    this.canvas = canvas;
    this.camera = camera;
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
        if (mesh.name === "Paddle_primitive0")
          this.MainMesh = mesh as AbstractMesh;
      });

      this.Mesh = ObjGroup;
    } catch (error) {
      console.error("Error loading paddle model:", error);
    }

    this.floorMesh = this.scene.getMeshByName("Plane_primitive0");
    this.setupInitialPosition();
    this.setupPaddlePlane();
    this.setupPointerControls();
    this.setupMouseRotation();
  }

  private setupPaddlePlane(): void {
    if (this.Mesh) {
      const planePosition = new Vector3(0, this.Mesh.position.y, 0);
      const planeNormal = new Vector3(0, 1, 0); // Pointing upward
      this.paddlePlane = Plane.FromPositionAndNormal(
        planePosition,
        planeNormal
      );
    }
  }

  setupInitialPosition(): void {
    if (this.Mesh) {
      this.Mesh.position.x = 0;
      this.Mesh.position.y = 1.8;
      this.Mesh.position.z = this.Boundaries.z.max;

      // Enable Euler angles
      this.Mesh.rotationQuaternion = null;

      // Reset rotations first
      this.Mesh.rotation.x = 0;
      this.Mesh.rotation.y = 0;
      this.Mesh.rotation.z = 0;
    }
  }

  setupPointerControls(): void {
    this.scene.onPointerObservable.add((pointerInfo) => {
      if (pointerInfo.type === PointerEventTypes.POINTERMOVE) {
        const event = pointerInfo.event as PointerEvent;

        if (!this.Mesh || !this.paddlePlane) return;

        try {
          const ray = this.scene.createPickingRay(
            event.clientX,
            event.clientY,
            Matrix.Identity(),
            this.camera
          );

          const distance = ray.intersectsPlane(this.paddlePlane);

          if (distance !== null) {
            const intersectionPoint = ray.origin.add(
              ray.direction.scale(distance)
            );

            const clampedX = Math.max(
              this.Boundaries.x.min,
              Math.min(this.Boundaries.x.max, intersectionPoint.x)
            );
            const clampedZ = Math.max(
              this.Boundaries.z.min,
              Math.min(this.Boundaries.z.max, intersectionPoint.z)
            );

            this.Mesh.position.x = clampedX;
            this.Mesh.position.z = clampedZ;

            this.setupMouseRotation();

            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
              this.socket.send(
                JSON.stringify({
                  type: "paddleUpdate",
                  position: {
                    x: this.MainMesh!.getBoundingInfo().boundingBox.centerWorld._x,
                    y: this.MainMesh!.getBoundingInfo().boundingBox.centerWorld._y,
                    z: this.MainMesh!.getBoundingInfo().boundingBox.centerWorld._z,
                  },
                })
              );
            } else {
              console.warn("WebSocket is not open. Cannot send paddle update.");
            }
          }
        } catch (error) {
          console.error("Error in pointer controls:", error);
        }
      }
    });
  }

  setupMouseRotation(): void {
    if (!this.Mesh) return;

    const currPaddleX = this.Mesh.position.x;
    const MaxRotation = Math.PI / 2;
    const gapPercent = 0.1; // 10% gap on each side

    // First get your normal 0-1 percentage
    let rotationPercentage =
      (this.Boundaries.x.max - currPaddleX) /
      (this.Boundaries.x.max - this.Boundaries.x.min);

    // Remap from [0,1] to [gapPercent, 1-gapPercent] then back to [0,1]
    const effectZone = 1 - 2 * gapPercent; // 0.8 (80% of range used)
    rotationPercentage = (rotationPercentage - gapPercent) / effectZone;

    // Clamp to 0-1 range
    rotationPercentage = Math.max(0, Math.min(1, rotationPercentage));

    this.Mesh.rotation.z =
      -MaxRotation + rotationPercentage * (2 * MaxRotation);
  }

  setSocket(socket: WebSocket): void {
    this.socket = socket;
  }

  getPhysicsInfo(): {
    position: { x: number; y: number; z: number };
    size: { x: number; y: number; z: number };
  } | null {
    if (!this.MainMesh) return null;

    const pos = this.MainMesh.getAbsolutePosition();
    const boundingInfo = this.MainMesh.getBoundingInfo();
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
