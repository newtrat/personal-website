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
  const CANVAS_WIDTH = 1000;
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

  const BRICK_CORNERS = [
    [50, 50],
    [50, 75],
    [50, 100],
    [50, 125],
    [50, 150],
    [50, 175],
    [50, 200],
    [50, 225],
    [50, 250],
    [100, 50],
    [100, 75],
    [150, 75],
    [150, 100],
    [200, 100],
    [200, 125],
    [200, 150],
    [250, 150],
    [250, 175],
    [250, 200],
    [300, 200],
    [300, 225],
    [350, 225],
    [350, 250],
    [400, 250],
    [400, 225],
    [400, 200],
    [400, 175],
    [400, 150],
    [400, 125],
    [400, 100],
    [400, 75],
    [400, 50],

    [500, 50],
    [500, 75],
    [550, 75],
    [550, 100],
    [600, 100],
    [600, 125],
    [600, 150],
    [600, 175],
    [600, 200],
    [600, 225],
    [600, 250],
    [650, 100],
    [650, 75],
    [700, 75],
    [700, 50]

  ];
  const BRICK_WIDTH = 50;
  const BRICK_HEIGHT = 25;
  const bricks = BRICK_CORNERS.map(orderedPair =>
    new myGlobals.Brick(
      new myGlobals.Point(...orderedPair),
      BRICK_WIDTH,
      BRICK_HEIGHT
    )
  );

  let ballVX = 2;
  let ballVY = 2;
  let leftArrowDown = false;
  let rightArrowDown = false;
  const ball = new myGlobals.Rectangle(
    new myGlobals.Point(500, 300),
    BALL_RADIUS * 2,
    BALL_RADIUS * 2
  );
  const paddle = new myGlobals.Rectangle(
    new myGlobals.Point((CANVAS_WIDTH - PADDLE_WIDTH) / 2, PADDLE_Y),
    PADDLE_WIDTH,
    PADDLE_HEIGHT
  )
  const specialRectangles = CANVAS_SIDES.concat(bricks).concat([paddle]);

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
    specialRectangles.forEach(rect => {
      const overlapSide = rect.overlapSideWith(ball);
      switch (overlapSide) {
      case myGlobals.Sides.BOTTOM:
        ballVY = Math.abs(ballVY);
        ball.move(0, 2 * ballVY);
        break;
      case myGlobals.Sides.TOP:
        ballVY = -Math.abs(ballVY);
        ball.move(0, 2 * ballVY);
        break;
      case myGlobals.Sides.RIGHT:
        ballVX = Math.abs(ballVX);
        ball.move(2 * ballVX, 0);
        break;
      case myGlobals.Sides.LEFT:
        ballVX = -Math.abs(ballVX);
        ball.move(2 * ballVX, 0);
        break;
      }
      if (overlapSide !== myGlobals.Sides.NONE &&
          rect.constructor === myGlobals.Brick) {
        rect.deactivate();
      }
    });
  }

  function tick() {
    c.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    movePaddle();
    moveBall();
    ball.draw(c);
    paddle.draw(c);
    bricks.forEach(brick => brick.draw(c));
  }

  setInterval(tick, 1);

  const body = document.getElementsByTagName('body')[0];
  body.addEventListener('keydown', registerKeydown);
  body.addEventListener('keyup', registerKeyup);
})();
