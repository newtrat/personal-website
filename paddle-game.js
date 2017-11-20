"use strict";

(function() {
  const CANVAS_WIDTH = 1500;
  const PADDLE_Y = 550;
  const PADDLE_WIDTH = 100;
  const PADDLE_HEIGHT = 25;
  const ORANGE = 'rgb(255, 174, 0)';

  const canvas = document.getElementById('paddle-game');
  const c = canvas.getContext('2d');

  let paddleX = 700;
  let leftArrowDown = false;
  let rightArrowDown = false;

  c.fillStyle = ORANGE;
  c.fillRect(paddleX, PADDLE_Y, PADDLE_WIDTH, PADDLE_HEIGHT);
  
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

  function tick() {
    c.clearRect(...paddleRect());
    if (leftArrowDown) {
      paddleX = Math.max(0, paddleX - 1);
    } else if (rightArrowDown) {
      paddleX = Math.min(CANVAS_WIDTH - PADDLE_WIDTH, paddleX + 1);
    }
    c.fillRect(...paddleRect());
  }

  const mainLoopInterval = setInterval(tick, 1);

  const body = document.getElementsByTagName('body')[0];
  body.addEventListener('keydown', registerKeydown);
  body.addEventListener('keyup', registerKeyup);
})();