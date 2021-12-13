import { IImageConstructor } from "../interfaces/image.interface";

export class Player extends Phaser.GameObjects.Image {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private walkingSpeed: number;
  private particleEmitterPlayer: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor(aParams: IImageConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture);

    this.initVariables();
    this.initImage();
    this.initInput();
    this.initParticleEmitter();

    this.scene.add.existing(this);
  }

  private initVariables(): void {
    this.walkingSpeed = 5;
  }

  private initImage(): void {
    this.setOrigin(0.5, 0.5);
  }
  private initParticleEmitter(): void {
    this.particleEmitterPlayer = this.scene.add
      .particles(this.texture)
      .createEmitter({
        alpha: { start: 0.5, end: 0 },
        lifespan: 100,
      });
    this.particleEmitterPlayer.startFollow(this);
  }

  private initInput(): void {
    this.cursors = this.scene.input.keyboard.createCursorKeys();
  }

  update(): void {
    this.handleInput();
  }

  private handleInput(): void {
    if (this.cursors.right.isDown) {
      this.x += this.walkingSpeed;
      this.setFlipX(false);
    } else if (this.cursors.left.isDown) {
      this.x -= this.walkingSpeed;
      this.setFlipX(true);
    } else if (this.cursors.up.isDown) {
      this.y -= this.walkingSpeed;
    } else if (this.cursors.down.isDown) {
      this.y += this.walkingSpeed;
    }
  }
}
