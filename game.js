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
let playerSpeed = 5, jumpSpeed = 15, gravity = 0.5, velocityY = 0;
let isJumping = false, isOnGround = false;

// Platforms
let platforms = [
    { x: 0, y: canvas.height - 50, width: canvas.width, height: 50 },
    { x: 200, y: canvas.height - 200, width: 200, height: 20 },
    { x: 400, y: canvas.height - 200, width: 150, height: 20 }, // Step 3
    { x: 550, y: canvas.height - 250, width: 150, height: 20 }, // Step 4
    { x: 700, y: canvas.height - 300, width: 150, height: 20 }, // Step 5
    { x: 850, y: canvas.height - 350, width: 150, height: 20 }, // Step 6
    { x: 1000, y: canvas.height - 400, width: 150, height: 20 }, // Step 7
    { x: 1150, y: canvas.height - 450, width: 150, height: 20 }, // Step 8
    { x: 1300, y: canvas.height - 500, width: 150, height: 20 }, // Step 9
    { x: 1450, y: canvas.height - 550, width: 150, height: 20 }, // Step 10
];

// Entrance (End point)
let entrance = {
    x: canvas.width / 2 - 50,  // Center the entrance on the screen horizontally
    y: 150,                    // Set the Y position high up
    width: 100,                // Set the width of the entrance
    height: 50,                // Set the height of the entrance
};

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

    // Check vertical collisions first (falling and landing)
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

    // Check horizontal collisions (left/right)
    for (let platform of platforms) {
        if (
            playerX + playerWidth > platform.x &&
            playerX < platform.x + platform.width &&
            playerY + playerHeight > platform.y &&
            playerY < platform.y + platform.height
        ) {
            // If moving right, stop the player from moving past the platform
            if (rightPressed) playerX = platform.x - playerWidth;
            // If moving left, stop the player from moving past the platform
            if (leftPressed) playerX = platform.x + platform.width;
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

// Draw Entrance (End Point)
function drawEntrance() {
    ctx.fillStyle = "#FFD700"; // Yellow color for the entrance
    ctx.fillRect(entrance.x, entrance.y, entrance.width, entrance.height);
}

// Check if the player reaches the entrance
function checkEntrance() {
    if (
        playerX + playerWidth > entrance.x &&
        playerX < entrance.x + entrance.width &&
        playerY + playerHeight > entrance.y &&
        playerY < entrance.y + entrance.height
    ) {
        // Player has reached the entrance
        alert("You have reached the entrance! Level Complete!");
        resetGame(); // Reset the game or advance to the next level
    }
}

// Reset Game (after reaching the entrance or on level reset)
function resetGame() {
    // Reset player position
    playerX = 50;
    playerY = canvas.height - 150;
    velocityY = 0;
    isJumping = false;
    isOnGround = false;

    // Optionally reset platform positions or other game states here
    // For now, just reset the entrance (if you want to move it for a new level)
    entrance.y = 150; // You can adjust this for different levels
}

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

    // Draw the entrance (end point)
    drawEntrance();

    // Check if the player has reached the entrance
    checkEntrance();

    // Game loop
    requestAnimationFrame(update);
}

// Start the game
update();
