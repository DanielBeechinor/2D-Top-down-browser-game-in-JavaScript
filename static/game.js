let canvas;
let context;

let fpsInterval = 1000 / 30;
let now;
let then = Date.now();

let message_element = document.querySelector('#message');
let round_element = document.querySelector('#round');
let totalZombies_element = document.querySelector('#totalZombies');
let revives_element = document.querySelector('#revives');
let bulletDamage_element = document.querySelector('#bulletDamage');
let health_element = document.querySelector('#health');

let moveDown = false;
let moveUp = false;
let moveLeft = false;
let moveRight = false;

let revive = 0;
let item = 0;
let bulletDamage = 25;
let baseSpeed = 12;
let immunityFrames = 0;
let yPosition = [48, 592]; 
let totalZombies = 3;
let message = '';

let p = {
  x : 520,
  y : 312,
  height : 32,
  width : 32,
  frameX : 0,
  frameY : 0,
  health : 100,
  playerSpeed : baseSpeed
};

let request_id;

let round = 1;

let enemies = [];
let bullets = [];

let playerImage = new Image();
let zombieImage = new Image();
let bulletImage = new Image();
let shotAudio = new Audio();
let zombieDeathAudio = new Audio();
let reviveAudio = new Audio();
let zombieDamageAudio = new Audio();
let playerHitAudio = new Audio();


let background = [
    [126, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128],
    [90, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 92],
    [90, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 92],
    [90, 91, 91,  0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 91, 91, 92],
    [90, 91, 91, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 91, 91, 92],
    [90, 91, 91, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 91, 91, 92],
    [90, 91, 91, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 91, 91, 92],
    [90, 91, 91, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 91, 91, 92],
    [90, 91, 91, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 91, 91, 92],
    [90, 91, 91, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 91, 91, 92],
    [90, 91, 91, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 91, 91, 92],
    [90, 91, 91, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 91, 91, 92],
    [90, 91, 91, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 91, 91, 92],
    [90, 91, 91, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 91, 91, 92],
    [90, 91, 91, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 91, 91, 92],
    [90, 91, 91, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 91, 91, 92],
    [90, 91, 91, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 91, 91, 92],
    [90, 91, 91, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 91, 91, 92],
    [90, 91, 91, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 91, 91, 92],
    [90, 91, 91, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 91, 91, 92],
    [90, 91, 91, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 91, 91, 92],
    [90, 91, 91, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 91, 91, 92],
    [90, 91, 91, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 91, 91, 92],
    [90, 91, 91, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 91, 91, 92],
    [90, 91, 91, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 91, 91, 92],
    [90, 91, 91, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 91, 91, 92],
    [90, 91, 91, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 91, 91, 92],
    [90, 91, 91, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 91, 91, 92],
    [90, 91, 91, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 91, 91, 92],
    [90, 91, 91, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 91, 91, 92],
    [90, 91, 91, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 91, 91, 92],
    [90, 91, 91, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 91, 91, 92],
    [90, 91, 91, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 91, 91, 92],
    [90, 91, 91, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 91, 91, 92],
    [90, 91, 91, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 91, 91, 92],
    [90, 91, 91, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 91, 91, 92],
    [90, 91, 91, 36, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 38, 91, 91, 92],
    [90, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 92],
    [90, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 92],
    [108, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 112],
        
]

let backgroundImage = new Image();
let tilesPerRow = 18;
let tileSize = 16;

document.addEventListener('DOMContentLoaded', init, false);

function init() {
    canvas = document.querySelector('canvas');
    context = canvas.getContext('2d');

    window.addEventListener('keydown', activate, false);
    window.addEventListener('keyup', deactivate, false);
    
    load_assets([
        {'var' : playerImage, 'url': 'static/player.png'},
        {'var' : zombieImage, 'url': 'static/zombie.png'},
        {'var' : bulletImage, 'url': 'static/bullet.png'},
        {'var' : backgroundImage, 'url': 'static/background.png'},
        {'var' : zombieDamageAudio, 'url': 'static/zombiehit.wav'},
        {'var' : shotAudio, 'url': 'static/shot.wav'},
        {'var' : reviveAudio, 'url': 'static/revive.wav'},
        {'var' : playerHitAudio, 'url': 'static/playerhit.wav'},
        {'var' : zombieDeathAudio, 'url': 'static/damage.wav'}
    ], draw);

    round_element.innerHTML = 'Round: ' + String(round);
    totalZombies_element.innerHTML = 'Total Zombies: ' + String(totalZombies);
    revives_element.innerHTML = 'Revives: ' + String(revive);
    bulletDamage_element.innerHTML = 'Bullet Damage: ' + String(bulletDamage);
    health_element.innerHTML = 'Health: ' + String(p.health);
}

function draw() {
    request_id = window.requestAnimationFrame(draw);
    let now = Date.now();
    let elapsed = now - then;
    if (elapsed <= fpsInterval) {
        return;
    }
    then = now - (elapsed % fpsInterval);

    immunityFrames = immunityFrames - 1

    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background on canvas
    context.fillStyle = '#87cefa'; 
    context.fillRect(0, 0, canvas.width, canvas.height)
    
    for (let r = 0; r < 40; r += 1) {
        for (let c = 0; c < 64; c += 1){
            let tile = background[r][c];
            if (tile >= 0) {
                let tileRow = Math.floor(tile / tilesPerRow);
                let tileCol = Math.floor(tile % tilesPerRow);
                context.drawImage(backgroundImage,
                    tileCol * tileSize, tileRow * tileSize, tileSize, tileSize,
                    c * tileSize, r * tileSize, tileSize, tileSize);
            }
        }
    }

    // Enemy

    // Spawn enemies
    while (totalZombies > 0 && enemies.length <= 20){
        totalZombies = totalZombies - 1
        spawnEnemies(round)
    }

    // Enemy Movement / Pathfinding
    for(let e of enemies) {
        if (p.x > e.x - 32 && p.x < e.x + 32) {
            e.xChange = randint(-5, 5);
            e.frameX = (e.frameX + 1) % 8;
        } else if (p.x >= e.x) {
            e.xChange = (baseSpeed * 0.5);
            e.frameY = 2;
            e.frameX = (e.frameX + 1) % 8;
        } else if (p.x < e.x) {
            e.xChange = -(baseSpeed * 0.5);
            e.frameY = 3;
            e.frameX = (e.frameX + 1) % 8;
        }

        if (p.y > e.y - 32 && p.y < e.y + 32) {
            e.yChange = randint(-5, 5);
            e.frameX = (e.frameX + 1) % 8;
        } else if (p.y >= e.y) {
            e.yChange = (baseSpeed * 0.5);
            e.frameY = 0;
        } else if (p.y < e.y) {
            e.yChange = -(baseSpeed * 0.5);
            e.frameY = 1;
            e.frameX = (e.frameX + 1) % 8;
        }
        
        e.x = e.x + e.xChange;
        e.y = e.y + e.yChange;

        // Handle Enemies Reaching Edge of Screen 

        if (e.x <= 48) {
            e.x = 48;
            }
        if (e.x >= canvas.width - e.height - 48) {
            e.x = canvas.width - e.height - 48;
            }
        if (e.y >= canvas.height - e.height - 48) {
            e.y = canvas.height - e.height - 48;
            }
        if (e.y <= 48) {
            e.y = 48
            }
        
        // Draw Enemy
        
        context.drawImage(zombieImage,
            e.frameX * e.width, e.frameY * e.height, e.width, e.height,
            e.x, e.y, e.width, e.height);
        
    }
    
    // Player

    // Draw the Player
    context.drawImage(playerImage,
        p.frameX * p.width, p.frameY * p.height, p.width, p.height,
        p.x, p.y, p.width, p.height);
    
    if ((moveLeft || moveRight || moveUp || moveDown) && 
    ! (moveLeft && moveRight) && ! (moveUp && moveDown)) {
        p.frameX = (p.frameX + 1) % 4;
    }
    
    // Player Movement
    if (moveLeft) {
        p.x = p.x - p.playerSpeed;
        p.frameY = 3;
    } 
    if (moveRight) {
        p.x = p.x + p.playerSpeed;
        p.frameY = 2;
    } 
    if (moveUp) {
        p.y = p.y - p.playerSpeed;
        p.frameY = 1;
    } 
    if (moveDown) {
        p.y = p.y + p.playerSpeed;
        p.frameY = 0;
    }
    
    // Handle going off of the screen
    
    if (p.x <= 48) {
        p.x = 48;
        }
    if (p.x >= canvas.width - p.height - 48) {
        p.x = canvas.width - p.height - 48;
        }
    if (p.y >= canvas.height - p.height - 48) {
        p.y = canvas.height - p.height - 48;         
        }
    if (p.y <= 48) {
        p.y = 48;
        }
    
    // Player health regen
        if (p.health < 100 && immunityFrames % 30 === 0) {
            p.health = p.health + 5
            health_element.innerHTML = 'Health: ' + String(p.health);
        }

    // Projectiles
    
    // Draw Bullets
    
    for (let b = 0; b < bullets.length; b++ ) {
        context.drawImage(bulletImage,
            bullets[b].width, bullets[b].height, bullets[b].width, bullets[b].height,
            bullets[b].x, bullets[b].y, bullets[b].width, bullets[b].height);
        
        bullets[b].x = bullets[b].x + bullets[b].xChange;
        bullets[b].y = bullets[b].y + bullets[b].yChange;

        if (bullets[b].x >= canvas.width  ||
            bullets[b].x <= 0 ||
            bullets[b].y >= canvas.height ||
            bullets[b].y <= 0) {
                bullets.splice(b, 1);
            }
        }

    // Collisions

    for (let e = 0; e < enemies.length; e++) {
        
        // Player collides with enemy

        if (collision(p, enemies[e])) {
            // Stop enemies from walking on top of the player
            enemies[e].x = enemies[e].x - enemies[e].xChange;
            enemies[e].y = enemies[e].y - enemies[e].xChange;

            // Handle player damage and iFrames
            if (immunityFrames <= 0) {
                playerHitAudio.play();
                immunityFrames = 10;
                p.health = p.health - 25 
                health_element.innerHTML = 'Health: ' + String(p.health);
            }

            // End the game when player health is 0
            if (p.health <= 0 && revive === 0) {

                stop();
            } else if (p.health <= 0) {
                reviveAudio.play()
                revive = revive - 1;
                p.health = 100;
                immunityFrames = 60;
                revives_element.innerHTML = revive;
            } 
        }
        
        // Bullet collides with enemy

        for (let b = 0; b < bullets.length; b++){
            if (collision(bullets[b], enemies[e])) {
                bullets.splice(b, 1);
                enemies[e].health = enemies[e].health - bulletDamage;
                zombieDamageAudio.play();
                if (enemies[e].health <= 0) {
                    zombieDeathAudio.play();
                    enemies.splice(e, 1);
                }
            }
        }

        // Enemy collides with enemy

        for (let e2 = 0; e2 < enemies.length; e2++){
            if (e != e2 && e > e2 && collision(enemies[e], enemies[e2])) {
                enemies[e2].x = enemies[e2].x - (enemies[e2].xChange / 2);
                enemies[e2].y = enemies[e2].y - (enemies[e2].yChange / 2);
            } 
        }
    }

    // Handle Rounds and how many enemies are to be spawned in and items

    if (enemies.length === 0) {
        round = round + 1;
        totalZombies = (3 + (round * 3))
        
        pickItem();

        round_element.innerHTML = 'Round: ' + String(round);
        totalZombies_element.innerHTML = 'Total Zombies: ' + String(totalZombies);
        revives_element.innerHTML = 'Revives: ' + String(revive);
        bulletDamage_element.innerHTML = 'Bullet Damage: ' + String(bulletDamage);
        health_element.innerHTML = 'Health: ' + String(p.health);
    }

}

function randint(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

function activate(event) {
    let key = event.key;
    if (key === 'a') {
        moveLeft = true;
    } else if (key === 'd') {
        moveRight = true;
    } else if (key === 'w') {
        moveUp = true;
    } else if (key === 's') {
        moveDown = true;
    } 

    if (key === 'ArrowRight') {
        spawn_bullet(10, 0,)
    } else if (key === 'ArrowLeft') {
        spawn_bullet(-10, 0)
    } else if (key === 'ArrowUp') {
        spawn_bullet(0, -10)
    } else if (key === 'ArrowDown') {
        spawn_bullet(0, 10)
    }
    
}

function deactivate(event) {
    let key = event.key;
    if (key === 'a') {
        moveLeft = false;
    } else if (key === 'd') {
        moveRight = false;
    } else if (key === 'w') {
        moveUp = false;
    } else if (key === 's') {
        moveDown = false;
    }
}

function load_assets(assets, callback) {
    let num_assets = assets.length;
    let loaded = function() {
        console.log('loaded');
        num_assets = num_assets - 1;
        if (num_assets === 0) {
            callback();
        }
    };
    for (let asset of assets) {
        let element = asset.var;
        if (element instanceof HTMLImageElement) {
            console.log('img');
            element.addEventListener('load', loaded, false);
        } else if (element instanceof HTMLAudioElement) {
            console.log('audio')
            element.addEventListener('canplaythrough', loaded, false);
        }
        element.src = asset.url;
    }
}

function collision(p, e) {
    try {
        if (p.x + p.height < e.x || 
            e.x + e.height < p.x ||
            p.y > e.y + e.height ||
            e.y > p.y + p.height) {
                return false;
        } else {
            return true;
        }
    }
    catch(TypeError) {
        return false; 
    }
}

function spawn_bullet(xDirection, yDirection) {
    let b = {
        x : p.x,
        y : p.y,
        height : 32,
        width : 32,
        xChange : xDirection,
        yChange : yDirection
    }
    bullets.push(b);
    shotAudio.play();
}

function spawnEnemies(round) {
        let enemy = {
          x : randint(48, canvas.width - 74),
          y : yPosition[randint(0, 1)],
          height : 32,
          width : 32,
          frameX : 0,
          frameY : 0,
          xChange : 0,
          yChange : 0,
          health : 100 + (round * 20)
        };
        enemies.push(enemy);
}

function stop() {
    window.removeEventListener('keydown', activate, false);
    window.removeEventListener('keyup', deactivate, false);
    window.cancelAnimationFrame(request_id);
    console.log(round)
}

function pickItem() {
    item = randint(0, 4)

    if (item === 0) {
        p.health = 200; // temporary health boost
        message = 'Temporary health increase'
    } else if (item === 1){
        bulletDamage = bulletDamage + (25 * 1.75); // increase bullet damage
        message = 'Bullet damage has been increased'
    } else if (item === 2){
        revive = revive + 1; // give character a revive
        message = 'You got a revive' 
    } else if (item === 3){
        totalZombies = Math.floor(totalZombies / 2); // halves number of zombies in the round
        message = 'Total zombies this round halved'  
    } else if (item === 4){
        message = 'You did not get an item'; // get nothing for the round
    } 
    message_element.innerHTML = message;
}