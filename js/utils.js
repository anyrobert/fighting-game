function attackColision(a, b) {
  const attackBoxXPosition = a.attackBox.position.x + a.attackBox.width;
  const attackBoxYPosition = a.attackBox.position.y + a.attackBox.height;

  const xAxisColision =
    attackBoxXPosition >= b.position.x &&
    a.attackBox.position.x <= b.position.x + b.width;

  const yAxisColision =
    attackBoxYPosition >= b.position.y &&
    a.attackBox.position.y <= b.position.y + b.height;

  const willHit = xAxisColision && yAxisColision && a.isAttacking;
  return willHit;
}

let gameTime = 60;
let timerId;
function handleTimer() {
  if (gameTime > 0) {
    timerId = setTimeout(handleTimer, 1000);
    gameTime--;
    timer.innerHTML = gameTime;
    return;
  }
  checkWinner(player, enemy, timerId);
}
