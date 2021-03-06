import { Bullet } from "./bullet";
import { CONST } from "../const/const";
import { IGraphicsConstructor } from "../interfaces/graphics.interface";

export class Ship extends Phaser.GameObjects.Graphics {
  body: Phaser.Physics.Arcade.Body;

  private velocity: Phaser.Math.Vector2;
  private cursors: any;
  private bullets: Bullet[];
  private shootKey: Phaser.Input.Keyboard.Key;
  private isShooting: boolean;
  private effectShipMove: Phaser.GameObjects.Particles.ParticleEmitter;

  public getBullets(): Bullet[] {
    return this.bullets;
  }

  public getBody(): any {
    return this.body;
  }

  constructor(aParams: IGraphicsConstructor) {
    super(aParams.scene, aParams.options);

    // variables
    this.bullets = [];
    this.isShooting = false;

    // init ship
    this.initShip();

    // input
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.shootKey = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );

    // physics
    this.scene.physics.world.enable(this);
    this.body.allowGravity = false;
    this.body.setSize(CONST.SHIP_SIZE * 2, CONST.SHIP_SIZE * 2);
    this.body.setOffset(-CONST.SHIP_SIZE, -CONST.SHIP_SIZE);

    this.scene.add.existing(this);
    this.effectShipMove = this.scene.add.particles("spark").createEmitter({
      x: this.x,
      y: this.y,
      blendMode: "ADD",

      lifespan: 300,
      scale: { start: 0.2, end: 0 },
      quantity: 10,
    });
  }

  private initShip(): void {
    // define ship properties
    this.x = this.scene.sys.canvas.width / 2;
    this.y = this.scene.sys.canvas.height / 2;
    this.velocity = new Phaser.Math.Vector2(0, 0);

    // define ship graphics and draw it
    this.lineStyle(1, 0xffffff);

    this.strokeTriangle(
      -CONST.SHIP_SIZE,
      CONST.SHIP_SIZE,
      CONST.SHIP_SIZE,
      CONST.SHIP_SIZE,
      0,
      -CONST.SHIP_SIZE,
    );
  }

  update(): void {
    if (this.active) {
      this.handleInput();
    } else {
    }
    this.updatEffectMove();
    this.applyForces();
    this.checkIfOffScreen();
    this.updateBullets();
  }

  private handleInput(): void {
    if (this.cursors.up.isDown) {
      this.boost();
    }

    if (this.cursors.right.isDown) {
      this.rotation += 0.05;
    } else if (this.cursors.left.isDown) {
      this.rotation -= 0.05;
    }

    if (this.shootKey.isDown && !this.isShooting) {
      this.shoot();
      this.recoil();
      this.isShooting = true;
    }

    if (this.shootKey.isUp) {
      this.isShooting = false;
    }
  }

  private boost(): void {
    // create the force in the correct direction
    let force = new Phaser.Math.Vector2(
      Math.cos(this.rotation - Math.PI / 2),
      Math.sin(this.rotation - Math.PI / 2),
    );

    // reduce the force and apply it to the velocity
    force.scale(0.12);
    this.velocity.add(force);
  }
  private applyForces(): void {
    // apple velocity to position
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    // reduce the velocity
    this.velocity.scale(0.98);
  }

  private checkIfOffScreen(): void {
    // horizontal check
    if (this.x > this.scene.sys.canvas.width + CONST.SHIP_SIZE) {
      this.x = -CONST.SHIP_SIZE;
    } else if (this.x < -CONST.SHIP_SIZE) {
      this.x = this.scene.sys.canvas.width + CONST.SHIP_SIZE;
    }

    // vertical check
    if (this.y > this.scene.sys.canvas.height + CONST.SHIP_SIZE) {
      this.y = -CONST.SHIP_SIZE;
    } else if (this.y < -CONST.SHIP_SIZE) {
      this.y = this.scene.sys.canvas.height + CONST.SHIP_SIZE;
    }
  }

  private shoot(): void {
    this.bullets.push(
      new Bullet({
        scene: this.scene,
        rotation: this.rotation,
        options: {
          x: this.x,
          y: this.y,
        },
      }),
    );
  }

  private recoil(): void {
    // create the force in the correct direction
    let force = new Phaser.Math.Vector2(
      -Math.cos(this.rotation - Math.PI / 2),
      -Math.sin(this.rotation - Math.PI / 2),
    );

    // reduce the force and apply it to the velocity
    force.scale(0.2);
    this.velocity.add(force);
  }

  private updateBullets(): void {
    for (let i = 0; i < this.bullets.length; i++) {
      if (this.bullets[i].active) {
        this.bullets[i].update();
      } else {
        this.bullets[i].destroy();
        this.bullets.splice(i, 1);
      }
    }
  }
  private updatEffectMove(): void {
    this.effectShipMove.setPosition(
      this.x - 30 * Math.sin(this.rotation),
      this.y + 30 * Math.cos(this.rotation),
    );
  }
}
