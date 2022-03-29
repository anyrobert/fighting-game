function attackColision(playerAttacking, anotherPlayer, frameDelay = 0) {
  const attackBoxXPosition =
    playerAttacking.attackBox.position.x + playerAttacking.attackBox.width;
  const attackBoxYPosition =
    playerAttacking.attackBox.position.y + playerAttacking.attackBox.height;

  const xAxisColision =
    attackBoxXPosition >= anotherPlayer.position.x &&
    playerAttacking.attackBox.position.x <=
      anotherPlayer.position.x + anotherPlayer.width;

  const yAxisColision =
    attackBoxYPosition >= anotherPlayer.position.y &&
    playerAttacking.attackBox.position.y <=
      anotherPlayer.position.y + anotherPlayer.height;

  const willHit =
    xAxisColision &&
    yAxisColision &&
    playerAttacking.isAttacking &&
    playerAttacking.framesCurrent === frameDelay;

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
