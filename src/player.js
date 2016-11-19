"use strict";

/* Classes and Libraries */

/* Constants */
const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 480;
const IMAGE_SIZE = 64;
const MS_PER_FRAME = 1000/8;
/**
 * @module Player
 * A class representing a player's helicopter
 */
module.exports = exports = Player;

/**
 * @constructor Player
 * Creates a player
 * @param {BulletPool} bullets the bullet pool
 */
function Player() {
  this.state = "idle";
  this.position = {x: 0, y: CANVAS_HEIGHT-32};
  this.velocity = {x: 0, y: 0};
  this.img = new Image();
  this.img.src = 'assets/img/Sprite_Sheets/animations.png';
  this.frame = 1;
  this.frameHeight = 0;
  this.direction = "right";
  this.time = 0;

}

/**
 * @function update
 * Updates the player based on the supplied input
 * @param {DOMHighResTimeStamp} elapedTime
 * @param {Input} input object defining input, must have
 * boolean properties: up, left, right, down
 */
Player.prototype.update = function(elapsedTime, input) {
  //if (this.position.y >= CANVAS_HEIGHT-32) { this.state = "idle";}
  // if not on the ground, fall downward
  if (this.position.y >= CANVAS_HEIGHT-32) { }
  else { this.velocity.y += .1; }

  // handles movement states
  switch (this.state) {
    case "idle":
      this.velocity = {x: 0, y: 0}
      if (this.direction == "right") this.frame = 1;
      else this.frame = 0;
      // set the velocity
      if(input.left) {
        this.time = 0; this.state = "moving"; this.direction = "left"; }
      if(input.right) {
        this.time = 0; this.state = "moving"; this.direction = "right"; }
      break;
    case "moving":
      this.velocity.x = 0;
      this.time += elapsedTime;
      if (this.direction == "right") {
        if (this.time >= MS_PER_FRAME && this.time < 2*MS_PER_FRAME) { this.frame = 0;}
        if (this.time >= 2*MS_PER_FRAME) { this.frame = 1; }
        this.velocity.x += 2; this.frameHeight = 2; }
      else {
        if (this.time >= MS_PER_FRAME && this.time < 2*MS_PER_FRAME) { this.frame = 0;}
        if (this.time >= 2*MS_PER_FRAME) { this.frame = 1; }
        this.frameHeight = 1; this.velocity.x -= 2; }
      if (!input.right && !input.left) {
        this.time = 0; this.state = "idle"; }
      break;
    case "jump":
      console.log(this.velocity.y);
      if (this.position.y < CANVAS_HEIGHT-30) this.position.y += .5;
      this.frameHeight = 3;
      if (this.time >= MS_PER_FRAME) {
        this.time = 0;
        this.frame++;
        if (this.frame > 3) this.frame = 4;
      }
      if (this.position.y >= CANVAS_HEIGHT-32) { this.time = 0; this.state = "idle"; }
      break;
    case "fall":

      break;
  }

  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;

  // keep player on screen
  if(this.position.x < 0) this.position.x = 0;
  if(this.position.x > CANVAS_WIDTH-32) this.position.x = CANVAS_WIDTH-32;
  if(this.position.y < 0) this.position.y = 0;
  if(this.position.y > CANVAS_HEIGHT-30) this.position.y = CANVAS_HEIGHT-30;
}

/**
 * @function render
 * Renders the player helicopter in world coordinates
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
Player.prototype.render = function(elapasedTime, ctx) {
  ctx.drawImage(this.img, IMAGE_SIZE*this.frame, IMAGE_SIZE*this.frameHeight, IMAGE_SIZE, IMAGE_SIZE, this.position.x, this.position.y, 32, 32);


}

Player.prototype.jump = function() {
  if (this.position.y >= CANVAS_HEIGHT-32) {
    this.time = 0;
    this.state = "jump";
    this.velocity.y -= 12;
  }
}
