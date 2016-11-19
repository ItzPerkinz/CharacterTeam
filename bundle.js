(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/* Classes and Libraries */
const Player = require('./player');
const Game = require('./game');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var player = new Player();

var input = {
  up: false,
  down: false,
  left: false,
  right: false
}
/**
 * @function onkeydown
 * Handles keydown events
 */
window.onkeydown = function(event) {
  switch(event.key) {
    case "ArrowUp":
    case "w":
      input.up = true;
      event.preventDefault();
      break;
    case "ArrowDown":
    case "s":
      input.down = true;
      event.preventDefault();
      break;
    case "ArrowLeft":
    case "a":
      input.left = true;
      event.preventDefault();
      break;
    case "ArrowRight":
    case "d":
      input.right = true;
      event.preventDefault();
      break;
  }
}

/**
 * @function onkeyup
 * Handles keydown events
 */
window.onkeyup = function(event) {
  switch(event.key) {
    case "ArrowUp":
    case "w":
      input.up = false;
      event.preventDefault();
      break;
    case "ArrowDown":
    case "s":
      input.down = false;
      event.preventDefault();
      break;
    case "ArrowLeft":
    case "a":
      input.left = false;
      event.preventDefault();
      break;
    case "ArrowRight":
    case "d":
      input.right = false;
      event.preventDefault();
      break;
  }
}

window.onkeypress = function(event) {
  event.preventDefault();
  if (event.keyCode == 32 || event.keyCode == 31) {
    player.jump();
  }
}

var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());

/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
  // update the player
  player.update(elapsedTime, input);

}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  ctx.fillStyle = "black";
  ctx.fillRect(0,0,canvas.width, canvas.height);
  // render the player
  player.render(elapsedTime, ctx);
}

},{"./game":2,"./player":3}],2:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

},{}],3:[function(require,module,exports){
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

},{}]},{},[1]);
