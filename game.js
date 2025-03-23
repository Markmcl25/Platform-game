const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Function to resize the canvas to fit the window
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Resize canvas on window resize
window.addEventListener('resize', resizeCanvas);

// Initial resize call
resizeCanvas();

// Game variables
let playerX = 50, playerY = canvas.height - 150, playerWidth = 50, playerHeight = 50;
let playerSpeed = 5, jumpSpeed = 10, gravity = 0.5, velocityY = 0;
let isJumping = false, isOnGround = false;

// Platforms
let platforms = [
    { x: 0, y: canvas.height - 50, width: canvas.width, height: 50 },
    { x: 200, y: canvas.height - 200, width: 200, height: 20 },
    { x: 500, y: canvas.height - 300, width: 200, height: 20 }
];

// Player movement and gravity
function movePlayer() {
    // Gravity
    if (!isOnGround) {
        velocityY += gravity;
    } else {
        velocityY = 0;
    }

    // Apply gravity to player position
    playerY += velocityY;

    // Move left and right
    if (rightPressed) playerX += playerSpeed;
    if (leftPressed) playerX -= playerSpeed;

    // Prevent going off screen
    if (playerX < 0) playerX = 0;
    if (playerX + playerWidth > canvas.width) playerX = canvas.width - playerWidth;
}

// Detect collision with platforms
function checkCollisions() {
    isOnGround = false;

    for (let platform of platforms) {
        if (
            playerX + playerWidth > platform.x &&
            playerX < platform.x + platform.width &&
            playerY + playerHeight <= platform.y &&
            playerY + playerHeight + velocityY >= platform.y
        ) {
            isOnGround = true;
            playerY = platform.y - playerHeight; // Place player on top of the platform
            isJumping = false; // Allow the player to jump again after landing
            break;
        }
    }
}

// Jumping logic
function jump() {
    if (!isJumping && isOnGround) {
        isJumping = true;
        velocityY = -jumpSpeed; // Jump upwards
    }
}

// Handle key press events
let rightPressed = false, leftPressed = false, spacePressed = false;

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "d") rightPressed = true;
    if (e.key === "ArrowLeft" || e.key === "a") leftPressed = true;
    if (e.key === " " || e.key === "ArrowUp") spacePressed = true;
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowRight" || e.key === "d") rightPressed = false;
    if (e.key === "ArrowLeft" || e.key === "a") leftPressed = false;
    if (e.key === " " || e.key === "ArrowUp") spacePressed = false;
});

// Update game
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move the player
    movePlayer();

    // Handle jumping
    if (spacePressed) jump();

    // Check for collisions
    checkCollisions();

    // Draw player
    ctx.fillStyle = "#FF5733";
    ctx.fillRect(playerX, playerY, playerWidth, playerHeight);

    // Draw platforms
    ctx.fillStyle = "#2C3E50";
    for (let platform of platforms) {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    }

    // Game loop
    requestAnimationFrame(update);
}

// Start the game
update();
