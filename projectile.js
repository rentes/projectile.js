/**
 * Created by miguel on 27/01/15.
 */
var posX; /* mouse position co-ordinate X */
var posY; /* mouse position co-ordinate Y */

/* canvas details */
var width = 800;
var height = 600;
var canvas;
var ctx;

/* projectile detail */
var projectile;

function initializeProjectile(event) {
    posX = event.clientX;
    posY = event.clientY;
    projectile = {
        position: {x: posX, y: posY},
        velocity: {x: 10, y: 0},
        mass: 0.1,
        radius: 15
    };
    console.log('projectile position: '+ projectile.position.x + ', ' + projectile.position.y);
}

function drawBall() {
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.beginPath();
    ctx.arc(projectile.position.x, projectile.position.y, 10, 0, 2 * Math.PI, false);
    ctx.lineWidth = 1;
    ctx.fillStyle = 'grey';
    ctx.fill();
    ctx.closePath();
    ctx.restore();
}

function initializeCanvas() {
    canvas = document.getElementById('projectile');
    ctx = canvas.getContext('2d');
    drawBall();
}

function drawProjectile(event) {
    initializeProjectile(event);
    initializeCanvas();
}