"use strict";

myGlobals = myGlobals || {}

myGlobals.Point = class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

myGlobals.Sides = {
  NONE: 0,
  TOP: 1,
  BOTTOM: 2,
  LEFT: 3,
  RIGHT: 4
}

/**
 * Class representing an _axis-aligned_ rectangle.
 */
myGlobals.Rectangle = class Rectangle {
  /**
   * @param {Point} corner
   * @param {number} width
   * @param {number} height
   */
  constructor(corner, width, height) {
    this.topLeftCorner = corner;
    this.width = width;
    this.height = height;
  }

  /**
   * @return {number} x-coordinate of the left side of this rectangle
   */
  leftX() {
    return this.topLeftCorner.x;
  }

  /**
   * @return {number} x-coordinate of the right side of this rectangle
   */
  rightX() {
    return this.topLeftCorner.x + this.width;
  }

  /**
   * @return {number} y-coordinate of the top side of this rectangle
   */
  topY() {
    return this.topLeftCorner.y;
  }

  /**
   * @return {number} y-coordinate of the bottom side of this rectangle
   *                  We assume that we're using canvas-style coordinates,
   *                  so the y-axis points down.
   */
  bottomY() {
    return this.topLeftCorner.y + this.height;
  }

  /**
   * Attempt to move this rectangle in the directions indicated by dx and dy
   * (e.g., if dx is 1 and dy is -2, move this rectangle 1 unit right and 2
   * units up). However, if canvasWidth and canvasHeight are provided, then
   * we're restricted to staying inside a canvas of the given dimensions, so
   * we only move as far as we can within the canvas.
   * @param {number} dx
   * @param {number} dy
   * @param {number=} canvasWidth
   * @param {number=} canvasHeight
   */
  move(dx, dy, canvasWidth, canvasHeight) {
    const currentX = this.topLeftCorner.x;
    const currentY = this.topLeftCorner.y;
    let highestX = Number.MAX_SAFE_INTEGER;
    let highestY = Number.MAX_SAFE_INTEGER;
    if (canvasWidth && canvasHeight) {
      highestX = canvasWidth - this.width;
      highestY = canvasHeight - this.height;
    }

    this.topLeftCorner = new Point(
      Math.min(highestX, Math.max(0, currentX + dx)),
      Math.min(highestY, Math.max(0, currentY + dy))
    );
  }

  /**
   * Return whether or not this rectangle overlaps with the other rectangle.
   * @param {Rectangle} other
   * @return {boolean}
   */
  overlaps(other) {
    return this.leftX() < other.rightX() &&
           other.leftX() < this.rightX() &&
           this.topY() < other.bottomY() &&
           other.topY() < this.bottomY();
  }


  /**
   * Return the side of this rectangle which overlaps "most" with the other
   * given rectangle.
   * @param {Rectangle} other
   * @return {Side}
   */
  overlapSideWith(other) {
    const Sides = myGlobals.Sides;
    if (!this.overlaps(other)) {
      return Sides.NONE;
    }

    const topScore = this.topY() - other.topY();
    const bottomScore = other.bottomY() - this.bottomY();
    const leftScore = this.leftX() - other.leftX();
    const rightScore = other.rightX() - this.rightX();

    switch (Math.max(topScore, bottomScore, leftScore, rightScore)) {
    case topScore:
      return Sides.TOP;
    case bottomScore:
      return Sides.BOTTOM;
    case leftScore:
      return Sides.LEFT;
    case rightScore:
      return Sides.RIGHT;
    }
  }
}