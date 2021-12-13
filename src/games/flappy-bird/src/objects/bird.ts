import { IImageConstructor } from "../interfaces/image.interface";

export class Bird extends Phaser.GameObjects.Image {
  body: Phaser.Physics.Arcade.Body;

  private jumpKey: Phaser.Input.Keyboard.Key;
  private isDead: boolean;
  private isFlapping: boolean;
  private blurOfBird: Phaser.GameObjects.Particles.ParticleEmitter;

  public getDead(): boolean {
    return this.isDead;
  }

  public setDead(dead: boolean): void {
    this.isDead = dead;
  }

  constructor(aParams: IImageConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);

    // image
    this.setScale(3);
    this.setOrigin(0, 0);

    // variables
    this.isDead = false;
    this.isFlapping = false;

    // physics
    this.scene.physics.world.enable(this);
    this.body.setGravityY(1000);
    this.body.setSize(17, 12);

    // input
    this.jumpKey = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );

    this.initParticleEmitter();

    this.scene.add.existing(this);
  }
  private initParticleEmitter(): void {
    this.blurOfBird = this.scene.add.particles(this.texture).createEmitter({
      alpha: { start: 0.5, end: 0 },
      lifespan: 100,
      scale: 3,
      rotate:{
        onEmit:
      }
    });
    // this.blurOfBird.startFollow(this);
  }

  update(): void {
    // handle angle change
    if (this.angle < 30) {
      this.angle += 2;
    }

    // handle input
    if (this.jumpKey.isDown && !this.isFlapping) {
      this.isFlapping = true;
      this.body.setVelocityY(-350);
      this.scene.tweens.add({
        targets: this,
        props: { angle: -20 },
        duration: 150,
        ease: "Power0",
        yoyo: true,
      });
    } else if (this.jumpKey.isUp && this.isFlapping) {
      this.isFlapping = false;
    }

    // check if off the screen
    if (this.y + this.height > this.scene.sys.canvas.height) {
      this.isDead = true;
    }
  }
}
