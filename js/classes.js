class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    framesHold = 5,
    framesCurrent = 0,
    framesElapsed = 0,
    offset = {
      x: 0,
      y: 0,
    },
  }) {
    this.position = position;
    this.height = 150;
    this.width = 50;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = framesCurrent;
    this.framesElapsed = framesElapsed;
    this.framesHold = framesHold;
    this.offset = offset;
  }

  draw() {
    ctx.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
  }

  animateFrames() {
    this.framesElapsed++;

    if (this.framesElapsed % this.framesHold !== 0) return;

    if (this.framesCurrent < this.framesMax - 1) {
      this.framesCurrent++;
    } else {
      this.framesCurrent = 0;
    }
  }

  update() {
    this.draw();
    this.animateFrames();
  }
}

class Figher extends Sprite {
  constructor({
    position,
    velocity,
    color,
    offset = { x: 0, y: 0 },
    movimentKeys = [],
    attackKeys = [],
    imageSrc,
    scale = 1,
    framesCurrent = 0,
    framesElapsed = 0,
    framesMax = 1,
    framesHold = 5,
    sprites,
    attackBox = {
      offset: {},
      width: undefined,
      height: undefined,
    },
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      framesHold,
      framesCurrent,
      framesElapsed,
      offset,
    });

    this.velocity = velocity;
    this.color = color;
    this.height = 150;
    this.width = 50;
    this.lastKeyPressed = null;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    };
    this.health = 100;
    this.isAttacking = false;
    this.attackKeys = attackKeys;
    this.movimentKeys = movimentKeys;
    this.sprites = sprites;

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
  }

  update() {
    this.draw();
    this.animateFrames();

    this.attackBox.position.x = this.position.x - this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y - this.attackBox.offset.y;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    const willHitGround =
      this.position.y + this.height + this.velocity.y >= canvas.height - 96;

    if (willHitGround) {
      this.velocity.y = 0;
      this.position.y = canvas.height - 96 - this.height;
      return;
    }

    this.velocity.y += gravity;
  }

  attack() {
    this.switchSprites("attack1");
    this.isAttacking = true;
  }

  switchSprites(sprite) {
    if (
      this.image === this.sprites.attack1.image &&
      this.framesCurrent < this.sprites.attack1.framesMax - 1
    )
      return;
    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.framesMax = this.sprites.run.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.framesMax = this.sprites.jump.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "fall":
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.framesMax = this.sprites.fall.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "attack1":
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.framesMax = this.sprites.attack1.framesMax;
          this.framesCurrent = 0;
        }
        break;
    }
  }
}
