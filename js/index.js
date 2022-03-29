const canvas = document.getElementById("game");
const timer = document.getElementById("timer");
const result = document.getElementById("result");
const playerHealthBar = document.getElementById("playerHealth");
const enemyHealthBar = document.getElementById("enemyHealth");
const ctx = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.7;
const playersVelocity = 5;

const background = new Sprite({
  position: { x: 0, y: 0 },
  imageSrc: "../assets/background.png",
});
const shop = new Sprite({
  position: { x: 600, y: 128 },
  imageSrc: "../assets/shop.png",
  scale: 2.75,
  framesMax: 6,
});

const playerMovimentKeys = ["a", "d", "w"];
const playerAttackKeys = [" "];
const player = new Figher({
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 10 },
  movimentKeys: playerMovimentKeys,
  attackKeys: playerAttackKeys,
  framesMax: 8,
  imageSrc: "../assets/samuraiMack/Idle.png",
  scale: 2.5,
  offset: { x: 215, y: 157 },
  sprites: {
    idle: {
      imageSrc: "../assets/samuraiMack/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "../assets/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "../assets/samuraiMack/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "../assets/samuraiMack/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "../assets/samuraiMack/Attack1.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "../assets/samuraiMack/Take Hit - white silhouette.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "../assets/samuraiMack/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: -90,
      y: -65,
    },
    width: 170,
    height: 50,
  },
});
const playerMappedKeys = [...player.movimentKeys, ...player.attackKeys];

const enemyAttackKeys = ["Enter"];
const enemyMovimentKeys = ["ArrowLeft", "ArrowRight", "ArrowUp"];
const enemy = new Figher({
  position: { x: 250, y: 100 },
  velocity: { x: 0, y: 0 },
  offset: { x: 50, y: 0 },
  movimentKeys: enemyMovimentKeys,
  attackKeys: enemyAttackKeys,
  framesMax: 4,
  imageSrc: "../assets/kenji/Idle.png",
  scale: 2.5,
  offset: { x: 215, y: 167 },
  sprites: {
    idle: {
      imageSrc: "../assets/kenji/Idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "../assets/kenji/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "../assets/kenji/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "../assets/kenji/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "../assets/kenji/Attack1.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "../assets/kenji/Take hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "../assets/kenji/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: 175,
      y: -65,
    },
    width: 175,
    height: 50,
  },
});
const enemyMappedKeys = [...enemy.movimentKeys, ...enemy.attackKeys];
const players = [player, enemy];

const mappedKeys = [...enemyMappedKeys, ...playerMappedKeys];
const keysPressed = mappedKeys.reduce((acc, key) => {
  acc[key] = false;
  return acc;
}, {});

function startGame() {
  window.requestAnimationFrame(startGame);

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  background.update();
  shop.update();

  for (const p of players) {
    p.update();
    p.velocity.x = 0;
  }

  const shouldMovePlayerLeft = keysPressed.a && player.lastKeyPressed === "a";
  const shouldMovePlayerRight = keysPressed.d && player.lastKeyPressed === "d";
  const shouldMovePlayerUp = keysPressed.w;

  if (shouldMovePlayerLeft) {
    player.velocity.x = -playersVelocity;
    player.switchSprites("run");
  } else if (shouldMovePlayerRight) {
    player.velocity.x = playersVelocity;
    player.switchSprites("run");
  } else if (shouldMovePlayerUp) {
    player.velocity.y = -10;
  } else {
    player.switchSprites("idle");
  }

  if (player.velocity.y < 0) {
    player.switchSprites("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprites("fall");
  }

  const shouldMoveEnemyLeft =
    keysPressed.ArrowLeft && enemy.lastKeyPressed === "ArrowLeft";
  const shouldMoveEnemyRight =
    keysPressed.ArrowRight && enemy.lastKeyPressed === "ArrowRight";
  const shouldMoveEnemyUp = keysPressed.ArrowUp;

  if (shouldMoveEnemyLeft) {
    enemy.velocity.x = -playersVelocity;
    enemy.switchSprites("run");
  } else if (shouldMoveEnemyRight) {
    enemy.velocity.x = playersVelocity;
    enemy.switchSprites("run");
  } else if (shouldMoveEnemyUp) {
    enemy.velocity.y = -10;
  } else {
    enemy.switchSprites("idle");
  }

  if (enemy.velocity.y < 0) {
    enemy.switchSprites("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprites("fall");
  }

  if (attackColision(player, enemy, 4)) {
    enemy.takeHit();
    player.isAttacking = false;
    enemyHealthBar.style.width = `${enemy.health}%`;
  }
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }

  if (attackColision(enemy, player, 2)) {
    player.takeHit();
    enemy.isAttacking = false;
    playerHealthBar.style.width = `${player.health}%`;
  }
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false;
  }

  if (player.health <= 0 || enemy.health <= 0) {
    checkWinner(player, enemy, timerId);
  }
}

startGame();
handleTimer();

function checkWinner(player, enemy, timerId) {
  clearTimeout(timerId);
  result.style.display = "flex";

  if (player.health === enemy.health) {
    result.innerHTML = "TIE";
    return;
  }
  if (player.health > enemy.health) {
    result.innerHTML = "PLAYER 1 WINS";
    return;
  }
  result.innerHTML = "PLAYER 2 WINS";
  return;
}

const handleKeyDown = ({ key }) => {
  keysPressed[key] = true;
  for (const p of players) {
    if (p.movimentKeys.includes(key)) {
      p.lastKeyPressed = key;
    } else if (p.attackKeys.includes(key)) {
      p.attack();
    }
  }
};

const handleKeyUp = ({ key }) => {
  keysPressed[key] = false;
};

window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);
