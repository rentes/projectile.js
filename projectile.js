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
var frameRate = 1/40; /* seconds */
var frameDelay = frameRate * 1000; /* milli-seconds */
var loopTimer;

/* projectile detail */
var projectile;
var mouse;
var gravity_acceleration = 9.81; /* m / s^2 */
var Cd = 0.47; /* dimensionless */
var rho = 1.22; /* kg / m^3 */
var projectileArea;
var hitGround = false;

function initializeProjectile(event) {
    posX = event.clientX;
    posY = event.clientY;
    projectile = {
        position: {x: posX, y: posY},
        velocity: {x: -10, y: -5},
        radius: 15,
        mass: 0.2,
        restitution: -0.6
    };
    projectileArea = Math.PI * projectile.radius * projectile.radius / (10000); /* m^2 */
    mouse = {
        x: 0,
        y: 0,
        isDown: false
    };
    console.log('projectile initial position: '+ projectile.position.x + ', ' + projectile.position.y);
}

var loop = function() {
    /* Do the physics */
    if (!hitGround) {
        /*  Drag force: Fd = -1/2 * Cd * A * rho * v * v */
        var Fx = -0.5 * Cd * projectileArea * rho * projectile.velocity.x * projectile.velocity.x * projectile.velocity.x / Math.abs(projectile.velocity.x);
        var Fy = -0.5 * Cd * projectileArea * rho * projectile.velocity.y * projectile.velocity.y * projectile.velocity.y / Math.abs(projectile.velocity.y);

        Fx = (isNaN(Fx) ? 0 : Fx);
        Fy = (isNaN(Fy) ? 0 : Fy);

        /* Calculate acceleration ( F = ma ) */
        var ax = Fx / projectile.mass;
        var ay = gravity_acceleration + (Fy / projectile.mass);

        /* Integrate to get velocity */
        projectile.velocity.x += ax * frameRate;
        projectile.velocity.y += ay * frameRate;

        /* testing if the projectile already stopped*/
        if (Math.abs(projectile.velocity.x) <= 0.20 &&
            projectile.position.y == canvas.height - projectile.radius &&
            Math.abs(projectile.velocity.y) <= 0.2) {
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
    else {
        ctx.clearRect(0, 0, width, height);
        clearInterval(loopTimer);
        hitGround = false;
    }
};

function drawBall() {
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

function initializeCanvas() {
    canvas = document.getElementById('projectile');
    ctx = canvas.getContext('2d');
}

function drawProjectile(event) {
    if (!hitGround) {
        initializeProjectile(event);
        initializeCanvas();
        loopTimer = setInterval(loop, frameDelay);
    }
}