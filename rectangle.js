"use strict";

window.myGlobals = window.myGlobals || {}

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
   * @param {CanvasRenderingContext2D} context
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
   * Remove this rectangle from the canvas.
   * @param {CanvasRenderingContext2D} c
   */
  clear(c) {
    c.clearRect(this.topLeftCorner.x, this.topLeftCorner.y,
                this.width, this.height);
  }

  /**
   * Draw this rectangle on the canvas.
   * @param {CanvasRenderingContext2D} c
   */
  draw(c) {
    c.fillRect(this.topLeftCorner.x, this.topLeftCorner.y,
               this.width, this.height);
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
    if (!canvasWidth || !canvasHeight) {
      this.topLeftCorner = new myGlobals.Point(
        currentX + dx,
        currentY + dy
      );
      return;
    }
  
    const highestX = canvasWidth - this.width;
    const highestY = canvasHeight - this.height;

    this.topLeftCorner = new myGlobals.Point(
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
    if (!this.overlaps(other)) {
      return myGlobals.Sides.NONE;
    }

    if (this.topY() <= other.topY() &&
        other.topY() <= this.bottomY() &&
        this.bottomY() <= other.bottomY()) {
      return myGlobals.Sides.BOTTOM;
    } else if (other.topY() <= this.topY() &&
               this.topY() <= other.bottomY() &&
               other.bottomY() <= this.bottomY()) {
      return myGlobals.Sides.TOP;
    } else if (other.leftX() <= this.leftX() &&
               this.leftX() <= other.rightX() &&
               other.rightX() <= this.rightX()) {
      return myGlobals.Sides.LEFT;
    } else if (this.leftX() <= other.leftX() &&
               other.leftX() <= this.rightX() &&
               this.rightX() <= other.rightX()) {
      return myGlobals.Sides.RIGHT;
    }
    // The two rectangles overlap, but one is entirely contained within the
    // other, so we just pretend that they don't
    return myGlobals.Sides.NONE;
  }
}

/**
 * Bricks are rectangles which can be destroyed. They start out in an 'active'
 * state, but switch to being 'inactive' (essentially nonexistent) once they
 * are destroyed.
 */
myGlobals.Brick = class Brick extends myGlobals.Rectangle {
  constructor(corner, width, height) {
    super(corner, width, height);
    this.active = true;
  }

  /**
   * "Destroy" this brick by preventing it from overlapping with
   * anything.
   */
  deactivate() {
    this.active = false;
  }

  /** @override */
  draw(c) {
    if (this.active) {
      super.draw(c);
    }
  }

  /** @override */
  overlaps(other) {
    return this.active ? super.overlaps(other) : false;
  }

  /** @override */
  overlapSideWith(other) {
    return this.active ? super.overlapSideWith(other) : myGlobals.Sides.NONE;
  }
}