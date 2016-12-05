"use strict";

/* Classes and Libraries */

/* Constants */
const CANVAS_WIDTH = 1120;
const CANVAS_HEIGHT = 800;
const IMAGE_SIZE = 64;
const MS_PER_FRAME = 1000/8;

/**
 * @module Enemy
 * A class representing an enemy
 */
module.exports = exports = Enemy;

/**
 * @constructor Enemy
 * Base class for an enemy
 * @param {object} startingPosition, object containing x and y coords
 */
function Enemy(startingPosition, type) {
  this.state = "walking";
  this.position = startingPosition;
  this.gravity = {x: 0, y: .5};
  this.velocity = {x: 0, y: 0};
  this.floor = 16*35;
  // TODO
  this.frame = 0; //Frame on X-axis
  this.frameHeight = 0; //Frame on Y-axis
  this.direction = "left";
  this.time = MS_PER_FRAME;
  this.type = type;
  this.img = new Image();
  this.img.src = "assets/img/Sprite_Sheets/orc_basic.png";
  switch (this.type) {
    case "orc_basic":
      this.img.src = "assets/img/Sprite_Sheets/orc_basic.png";
      if (this.direction == "left") {
        this.frameHeight = 9;
        this.frame = 0; }
      else {
        this.frameHeight = 11;
        this.frame = 0; }
      break;
  }
}

/**
 * @function update
 * Updates the enemy based on the supplied input
 * @param {DOMHighResTimeStamp} elapedTime
 * @param {object} playerPosition, object containing x and y coords
 */
Enemy.prototype.update = function(elapsedTime, playerPosition) {
  switch (this.type) {
    case "orc_basic":
      switch (this.state) {
        case "walking":
          this.time += elapsedTime;
          if (this.direction == "left") {
            if (this.time >= MS_PER_FRAME) { this.frame++; this.time = 0; }
            if (this.frame > 8) this.frame = 0;
            this.velocity.x -= .1;
            if (this.velocity.x <= -1.5) this.velocity.x = -1.5;
          }
          else {
            if (this.time >= MS_PER_FRAME) { this.frame++; this.time = 0; }
            if (this.frame > 8) this.frame = 0;
            this.velocity.x += .1;
            if (this.velocity.x >= 1.5) this.velocity.x = 1.5;
          }
          break;
        case "stabbing":
          this.time += elapsedTime;
          if (this.direction == "left") {
            if (this.time >= MS_PER_FRAME) { this.frame++; this.time = 0; }
            if (this.frame > 7) { this.state = "walking"; this.frame = 0; this.frameHeight = 9; }
            this.velocity.x = 0;
            if (this.position >= playerPosition.y + 100) {
              this.state = "walking";
              this.frame = 0; this.frameHeight = 9; }
          }
          else {
            if (this.time >= MS_PER_FRAME) { this.frame++; this.time = 0; }
            if (this.frame > 7) { this.state = "walking"; this.frame = 0; this.frameHeight = 11; }
            this.velocity.x = 0;
            if (this.position >= playerPosition.y + 100) {
              this.state = "walking";
              this.frame = 0; this.frameHeight = 11; }
          }

          break;
      }
      break;
  }

  // move the player
  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;
  if(this.velocity.y < 14 && this.position.x > 0 && this.position.x < CANVAS_WIDTH)
  {
   this.velocity.x += this.gravity.x;
   this.velocity.y += this.gravity.y;
  }

}

/**
 * @function render
 * Renders the enemy in world coordinates
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
Enemy.prototype.render = function(elapasedTime, ctx) {
  // TODO
  switch (this.type) {
    case "orc_basic":
      ctx.drawImage(this.img, IMAGE_SIZE*this.frame, IMAGE_SIZE*this.frameHeight, IMAGE_SIZE, IMAGE_SIZE, this.position.x, this.position.y, 80, 80);
      break;
  }
  //ctx.drawImage(this.img, IMAGE_SIZE*this.frame, IMAGE_SIZE*this.frameHeight, IMAGE_SIZE, IMAGE_SIZE, this.position.x, this.position.y, 32, 32);
}

// stabs
Enemy.prototype.stab = function() {
  this.state = "stabbing";
  this.frame = 0;
  if (this.direction == "left") this.frameHeight = 5;
  else this.frameHeight = 7;
  this.time = 0;
}
