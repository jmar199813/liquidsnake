// Get canvas context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game settings
const gridSize = 20; // The size of each block
const canvasSize = 400; // Canvas width and height
let score = 0;

// Snake properties
let snake = [
  { x: 160, y: 200 },
  { x: 140, y: 200 },
  { x: 120, y: 200 },
];

// Initial direction
let direction = 'RIGHT';
let changingDirection = false;

// Food properties
let food = { x: 0, y: 0 };

// Game speed (frames per second)
let gameSpeed = 100;
let gameInterval = null;

// Load the eat sound
const eatSound = new Audio('sounds/eat.mp3');

// Generate a random food position
function generateFood() {
  food.x = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
  food.y = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
}

// Draw the snake and the food
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw the snake
  snake.forEach((segment, index) => {
    // If the segment is the head, color it bright green
    if (index === 0) {
      ctx.fillStyle = '#00FF00'; // Head is bright green
    }
    // If the segment is the tail (last segment), color it darker green than the body
    else if (index === snake.length - 1) {
      ctx.fillStyle = '#004d00'; // Tail is a very dark green
    } 
    // Otherwise, it's a body segment, color it dark green
    else {
      ctx.fillStyle = '#008000'; // Body is dark green
    }
    
    ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
  });

  // Draw the food
  ctx.fillStyle = '#FF0000'; // Red food
  ctx.fillRect(food.x, food.y, gridSize, gridSize);

  // Draw the score
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + score, 10, 30);
}

// Move the snake
function moveSnake() {
  // Create a new head based on the current direction
  let head = { ...snake[0] };

  if (direction === 'RIGHT') head.x += gridSize;
  if (direction === 'LEFT') head.x -= gridSize;
  if (direction === 'UP') head.y -= gridSize;
  if (direction === 'DOWN') head.y += gridSize;

  // Add the new head to the front of the snake
  snake.unshift(head);

  // Check for collision with food
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    generateFood(); // Generate a new food
    eatSound.play(); // Play the eating sound
  } else {
    snake.pop(); // Remove the tail
  }
}

// Change direction based on user input
function changeDirection(event) {
  if (changingDirection) return; // Prevent the snake from turning too quickly

  changingDirection = true;

  const keyPressed = event.key;

  if (keyPressed === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
  if (keyPressed === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
  if (keyPressed === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
  if (keyPressed === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
}

// Detect collisions
function checkCollisions() {
  const head = snake[0];

  // Check if the snake hits the walls
  if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
    return true;
  }

  // Check if the snake runs into itself
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }

  return false;
}

// Display the Game Over screen
function gameOver() {
  // Stop the game loop
  clearInterval(gameInterval);

  // Show the Game Over screen
  document.getElementById('gameOverScreen').style.display = 'block';
  document.getElementById('finalScore').textContent = score;
  document.getElementById('gameCanvas').style.display = 'none';

  // Remove the keydown event listener when the game is over
  document.removeEventListener('keydown', changeDirection);
}

// Game loop
function gameLoop() {
  if (checkCollisions()) {
    gameOver(); // Show Game Over screen if collision detected
    return;
  }

  changingDirection = false;
  moveSnake();
  draw();
}

// Set up the game
function startGame() {
  generateFood(); // Generate initial food
  score = 0; // Reset score
  snake = [
    { x: 160, y: 200 },
    { x: 140, y: 200 },
    { x: 120, y: 200 },
  ]; // Reset snake
  direction = 'RIGHT'; // Reset direction
  gameInterval = setInterval(gameLoop, gameSpeed); // Start the game loop

  // Add the keydown event listener for controlling the snake
  document.addEventListener('keydown', changeDirection);
}

// Show the start screen
function showStartScreen() {
  document.getElementById('startScreen').style.display = 'block';
  document.getElementById('gameCanvas').style.display = 'none';
  document.getElementById('gameOverScreen').style.display = 'none';
}

// Hide the start screen and start the game
function startNewGame() {
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('gameCanvas').style.display = 'block';
  document.getElementById('gameOverScreen').style.display = 'none';
  startGame(); // Start the game when spacebar is pressed
}

// Listen for the Spacebar key press to start/restart the game
document.addEventListener('keydown', function(event) {
  if (event.code === 'Space') { // Spacebar key
    if (document.getElementById('gameOverScreen').style.display === 'block') {
      // If the game is over, restart the game
      startNewGame();
    } else {
      // If the game isn't over, start the game
      startNewGame();
    }
  }
});

// Show the start screen when the page loads
window.onload = showStartScreen;
