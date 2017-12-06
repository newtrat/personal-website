"use strict";

(function main() {
  const GLOBAL_NAMES = ['Point', 'Rectangle', 'Sides'];
  // Wait for globals to be ready, since I still can't use modules without
  // Webpack et al.
  if (!window.myGlobals ||
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

  // Rectangles representing the sides of the canvas, so we can use collision
  // detection to bounce the ball off the sides of the canvas.
  const CANVAS_SIDES = [
    new myGlobals.Rectangle(
      new myGlobals.Point(-10, 0),
      10,
      CANVAS_HEIGHT
    ),
    new myGlobals.Rectangle(
      new myGlobals.Point(CANVAS_WIDTH, 0),
      10,
      CANVAS_HEIGHT
    ),
    new myGlobals.Rectangle(
      new myGlobals.Point(0, -10),
      CANVAS_WIDTH,
      10
    ),
    new myGlobals.Rectangle(
      new myGlobals.Point(0, CANVAS_HEIGHT),
      CANVAS_WIDTH,
      10
    )
  ];

  let ballVX = 2;
  let ballVY = 2;
  let leftArrowDown = false;
  let rightArrowDown = false;
  const ball = new myGlobals.Rectangle(
    new myGlobals.Point(0, 0),
    BALL_RADIUS * 2,
    BALL_RADIUS * 2
  );
  const paddle = new myGlobals.Rectangle(
    new myGlobals.Point((CANVAS_WIDTH - PADDLE_WIDTH) / 2, PADDLE_Y),
    PADDLE_WIDTH,
    PADDLE_HEIGHT
  )
  const nonBallRectangles = CANVAS_SIDES.concat([paddle]);

  const canvas = document.getElementById('paddle-game');
  const c = canvas.getContext('2d');
  c.fillStyle = ORANGE;

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
      paddle.move(-PADDLE_VEL, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    } else if (rightArrowDown) {
      paddle.move(PADDLE_VEL, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
  }

  function moveBall() {
    ball.move(ballVX, ballVY);
    nonBallRectangles.forEach(rect => {
      switch (ball.overlapSideWith(rect)) {
      case myGlobals.Sides.TOP:
        ballVY = Math.abs(ballVY);
        ball.move(0, 2 * ballVY);
        break;
      case myGlobals.Sides.BOTTOM:
        ballVY = -Math.abs(ballVY);
        ball.move(0, 2 * ballVY);
        break;
      case myGlobals.Sides.LEFT:
        ballVX = Math.abs(ballVX);
        ball.move(2 * ballVX, 0);
        break;
      case myGlobals.Sides.RIGHT:
        ballVX = -Math.abs(ballVX);
        ball.move(2 * ballVX, 0);
        break;
      }
    });
  }

  function tick() {
    c.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    movePaddle();
    moveBall();
    ball.draw(c);
    paddle.draw(c);
  }

  const mainLoopInterval = setInterval(tick, 1);

  const body = document.getElementsByTagName('body')[0];
  body.addEventListener('keydown', registerKeydown);
  body.addEventListener('keyup', registerKeyup);
})();
