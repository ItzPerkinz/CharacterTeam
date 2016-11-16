"use strict";

/* Classes and Libraries */

/* Constants */
const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 480;
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
  this.state = "idle-right";
  this.position = {x: 0, y: CANVAS_HEIGHT-32};
  this.velocity = {x: 0, y: 3};
  // TODO
  this.img = new Image()
  this.img.src = 'assets/img/Individual_Img/idle_right.png';
}

/**
 * @function update
 * Updates the player based on the supplied input
 * @param {DOMHighResTimeStamp} elapedTime
 * @param {Input} input object defining input, must have
 * boolean properties: up, left, right, down
 */
Player.prototype.update = function(elapsedTime, input) {

  if (this.position.y >= CANVAS_HEIGHT-32) { this.state = "idle-right";}
  if (this.velocity.y < 3) this.velocity.y += .1;
  switch (this.state) {
    case "idle-right":
      // set the velocity
      this.velocity.x = 0;
      if(input.left) { this.velocity.x -= 2; }
      if(input.right) this.velocity.x += 2;
      break;
    case "jump":

      break;
  }


  //this.velocity.y = 0;
  //if(input.up) this.velocity.y -= 5 / 2;
  //if(input.down) this.velocity.y += 5 / 2;

  // move the player
  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;

  // keep player on screen
  if(this.position.x < 0) this.position.x = 0;
  if(this.position.x > CANVAS_WIDTH-32) this.position.x = CANVAS_WIDTH-32;
  if(this.position.y < 0) this.position.y = 0;
  if(this.position.y > CANVAS_HEIGHT-32) this.position.y = CANVAS_HEIGHT-32;
}

/**
 * @function render
 * Renders the player helicopter in world coordinates
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
Player.prototype.render = function(elapasedTime, ctx) {
  ctx.drawImage(this.img, this.position.x, this.position.y, 32, 32);


}

Player.prototype.jump = function() {
  if (this.position.y >= CANVAS_HEIGHT-32) {
    this.state = "jump";
    this.velocity.y -= 7;
    console.log(this.velocity.y);
  }
}
