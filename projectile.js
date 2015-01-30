/**
 * Projectile project.
 */
/*jslint browser: true, devel: true */

/* mouse position co-ordinate X and Y */
var posX;
var posY;

/* canvas details */
var width = 800;
var height = 600;
var canvas;
var ctx;
var frameRate = 1 / 40; /* seconds */
var frameDelay = frameRate * 1000; /* milli-seconds */
var loopTimer;
var nrClicks = 0; /* controls the number of clicks done by the user on the canvas */

/* projectile details */
var projectile;
var Cd = 0.47; /* drag coefficient (dimensionless) */
var rho = 1.22; /* density of the projectile (kg / m^3) */
var projectileArea;
var hitGround = false; /* to acknowledge if the projectile has stopped */
var velocity;
var angle;

/* creates a projectile */
function initializeProjectile(event) {
    "use strict";
    posX = event.clientX;
    posY = event.clientY;
    velocity = Math.floor(Math.random() * 11); /* random number between 0 and 10 */
    angle = Math.floor(Math.random() * 361); /* random number between 0 and 360 */
    projectile = {
        position: {x: posX, y: posY},
        velocity: {x: Math.cos(angle * (Math.PI / 180)) * velocity, y: -Math.sin(angle * (Math.PI / 180)) * velocity},
        radius: 15,
        mass: 0.7,
        restitution: -0.6
    };
    projectileArea = Math.PI * projectile.radius * projectile.radius / (10000); /* m^2 */
    console.log('projectile initial position: ' + projectile.position.x + ' (x), ' + projectile.position.y + ' (y)');
    console.log('initial angle (counter clockwise): ' + angle + 'º, and initial velocity: ' + velocity);
    console.log('projectile initial velocity: ' + projectile.velocity.x + ' (v_x), ' + projectile.velocity.y + ' (v_y)');
}

/* draws the ball on the canvas */
function drawBall() {
    "use strict";
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.beginPath();
    ctx.arc(projectile.position.x, projectile.position.y, projectile.radius, 0, 2 * Math.PI, false);
    ctx.lineWidth = 1;
    ctx.fillStyle = 'grey';
    ctx.fill();
    ctx.closePath();
    ctx.restore();
}

/* calculates the drag force */
/* http://en.wikipedia.org/wiki/Drag_(physics) */
function calculateDragForce(component) {
    "use strict";
    /*  Drag force: Fd = -1/2 * Cd * A * rho * v * v */
    var drag = -0.5 * Cd * projectileArea * rho * component * component * component / Math.abs(component);
    return (isNaN(drag) ? 0 : drag);
}

var loop = function () {
    "use strict";
    if (!hitGround) {
        /* Calculate acceleration ( F = ma ) */
        var ax = calculateDragForce(projectile.velocity.x) / projectile.mass;

        /* Integrate to get velocity */
        projectile.velocity.x += ax * frameRate;
        projectile.velocity.y += 9.81 * frameRate; /* 9.81 is the gravity acceleration */

        /* testing if the projectile already stopped */
        if (Math.abs(projectile.velocity.x) <= 1.1 && projectile.position.y === canvas.height - projectile.radius && Math.abs(projectile.velocity.y) <= 0.50) {
            console.log('houston, we hit the ground to a full stop!');
            projectile.velocity.x = 0;
            projectile.velocity.y = 0;
            hitGround = true;
        }

        /* Integrate to get position */
        projectile.position.x += projectile.velocity.x * frameRate * 100;
        projectile.position.y += projectile.velocity.y * frameRate * 100;

        /* Handle collisions */
        if (projectile.position.y > height - projectile.radius) {
            projectile.velocity.y *= projectile.restitution;
            projectile.position.y = height - projectile.radius;
        }
        if (projectile.position.x > width - projectile.radius) {
            projectile.velocity.x *= projectile.restitution;
            projectile.position.x = width - projectile.radius;
        }
        if (projectile.position.x < projectile.radius) {
            projectile.velocity.x *= projectile.restitution;
            projectile.position.x = projectile.radius;
        }
        /* draw the ball */
        drawBall();
    }
};

/* initializes the canvas */
function initializeCanvas() {
    "use strict";
    canvas = document.getElementById('projectile');
    ctx = canvas.getContext('2d');
}

/* creates the projectile and enters the loop */
function startProjectile(event) {
    "use strict";
    initializeProjectile(event);
    initializeCanvas();
    loopTimer = setInterval(loop, frameDelay);
}

/* entry point for out projectile project */
function drawProjectile(event) {
    "use strict";
    nrClicks += 1;
    if (nrClicks > 1 && hitGround === false) {
        alert('please wait for the projectile to stop.');
    } else if (hitGround === true) { /* after projectile animation is completed */
        hitGround = false; /* reset the hitGround var */
        clearInterval(loopTimer);
        startProjectile(event);
    } else { /* first projectile animation */
        startProjectile(event);
    }
}