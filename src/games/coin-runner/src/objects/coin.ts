import { IImageConstructor } from "../interfaces/image.interface";

export class Coin extends Phaser.GameObjects.Image {
  private centerOfScreen: number;
  private changePositionTimer: Phaser.Time.TimerEvent;
  private lastPosition: string;

  constructor(aParams: IImageConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture);

    this.initVariables();
    this.initImage();
    this.initEvents();

    this.scene.add.existing(this);
  }

  private initVariables(): void {
    this.centerOfScreen = this.scene.sys.canvas.width / 2;
    this.changePositionTimer = null;
    this.setFieldSide();
  }
  private enLargeCoin(): void {
    this.scene.add.tween({
      targets: this,
      scale: 1,
      duration: 1000,
      ease: "linear",
    });
  }
  // private contractedCoin(): void {
  //   this.scene.add.tween({
  //     targets: this,
  //     scale: 0,
  //     duration: 1000,
  //     ease: "linear",
  //   });
  // }
  private initImage(): void {
    this.setOrigin(0.5, 0.5);
    this.setScale(0);
    this.enLargeCoin();
  }

  private initEvents(): void {
    this.changePositionTimer = this.scene.time.addEvent({
      delay: 2000,
      callback: this.changePosition,
      callbackScope: this,
      loop: true,
    });
  }

  update(): void {}

  public changePosition(): void {
    this.setNewPosition();
    this.setFieldSide();
    this.setScale(0);
    this.enLargeCoin();
    this.changePositionTimer.reset({
      delay: 2000,
      callback: this.changePosition,
      callbackScope: this,
      loop: true,
    });
  }

  private setNewPosition(): void {
    if (this.lastPosition == "right") {
      this.x = Phaser.Math.RND.integerInRange(100, this.centerOfScreen);
    } else {
      this.x = Phaser.Math.RND.integerInRange(385, 700);
    }
    this.y = Phaser.Math.RND.integerInRange(100, 500);
  }

  private setFieldSide(): void {
    if (this.x <= this.centerOfScreen) {
      this.lastPosition = "left";
    } else {
      this.lastPosition = "right";
    }
  }
}
