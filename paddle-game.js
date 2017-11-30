"use strict";

(function main() {
  const GLOBAL_NAMES = ['Point', 'Rectangle', 'Sides'];
  // Wait for globals to be ready, since I still can't use modules without
  // Webpack et al.
  if (!myGlobals ||
      GLOBAL_NAMES.filter(prop => !myGlobals[prop]).length > 0) {
    setTimeout(main, 100);
    return;
  }

  const BALL_RADIUS = 10;
  const CANVAS_WIDTH = 1500;
  const CANVAS_HEIGHT = 600;
  const PADDLE_Y = 550;
  const PADDLE_VEL = 3;
  const PADDLE_WIDTH = 100;
  const PADDLE_HEIGHT = 25;
  const ORANGE = 'rgb(255, 174, 0)';

  let ballX = BALL_RADIUS;
  let ballY = BALL_RADIUS;
  let ballVX = 2;
  let ballVY = 2;
  let paddleX = 700;
  let leftArrowDown = false;
  let rightArrowDown = false;

  const canvas = document.getElementById('paddle-game');
  const c = canvas.getContext('2d');

  function ballRect() {
    return [ballX - BALL_RADIUS, ballY - BALL_RADIUS, BALL_RADIUS * 2, BALL_RADIUS * 2];
  }

  function paddleRect() {
    return [paddleX, PADDLE_Y, PADDLE_WIDTH, PADDLE_HEIGHT];
  }

  function registerKeydown(event) {
    switch (event.key) {
    case 'ArrowLeft':
      leftArrowDown = true;
      rightArrowDown = false;
      break;
    case 'ArrowRight':
      rightArrowDown = true;
      leftArrowDown = false;
      break;
    }
  }

  function registerKeyup(event) {
    switch(event.key) {
    case 'ArrowLeft':
      leftArrowDown = false;
      break;
    case 'ArrowRight':
      rightArrowDown = false;
      break;
    }
  }

  function movePaddle() {
    if (leftArrowDown) {
      paddleX = Math.max(0, paddleX - PADDLE_VEL);
    } else if (rightArrowDown) {
      paddleX = Math.min(CANVAS_WIDTH - PADDLE_WIDTH, paddleX + PADDLE_VEL);
    }
  }

  function moveBall() {
    let newX = ballX + ballVX;
    let newY = ballY + ballVY;
    if (newX < BALL_RADIUS) {
      newX = 2 * BALL_RADIUS - newX;
      ballVX *= -1;
    } else if (newX > CANVAS_WIDTH - BALL_RADIUS) {
      newX = 2 * (CANVAS_WIDTH - BALL_RADIUS) - newX;
      ballVX *= -1;
    }
    if (newY < BALL_RADIUS) {
      newY = 2 * BALL_RADIUS - newY;
      ballVY *= -1;
    } else if (newY > CANVAS_HEIGHT - BALL_RADIUS) {
      newY = 2 * (CANVAS_HEIGHT - BALL_RADIUS) - newY;
      ballVY *= -1;
    }
    ballX = newX;
    ballY = newY;
  }

  function tick() {
    c.clearRect(...ballRect());
    c.clearRect(...paddleRect());
    movePaddle();
    moveBall();
    c.fillRect(...ballRect());
    c.fillRect(...paddleRect());
  }

  c.fillStyle = ORANGE;
  c.fillRect(...ballRect());
  c.fillRect(...paddleRect());

  const mainLoopInterval = setInterval(tick, 1);

  const body = document.getElementsByTagName('body')[0];
  body.addEventListener('keydown', registerKeydown);
  body.addEventListener('keyup', registerKeyup);
})();
