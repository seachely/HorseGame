const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const horseImg = new Image();
horseImg.src = 'Horse.png';

const horse = {
    x: 50,
    y: canvas.height / 2 - 40, // Adjusted to center the larger horse vertically
    width: 120,  // Increased from 50
    height: 120, // Increased from 50
    speed: 5,
    lives: 3  // Add this line
};

let barrels = [];
let score = 0;

function drawHorse() {
    ctx.drawImage(horseImg, horse.x, horse.y, horse.width, horse.height);
}

function drawBarrels() {
    ctx.fillStyle = 'red';
    barrels.forEach(barrel => {
        ctx.fillRect(barrel.x, barrel.y, barrel.width, barrel.height);
    });
}

function moveHorse(e) {
    switch(e.key) {
        case 'ArrowUp':
            if (horse.y > 0) horse.y -= horse.speed;
            break;
        case 'ArrowDown':
            if (horse.y < canvas.height - horse.height) horse.y += horse.speed;
            break;
    }
}

function spawnBarrel() {
    const barrel = {
        x: canvas.width,
        y: Math.random() * (canvas.height - 40),
        width: 40,
        height: 40,
        speed: 2 + Math.random() * 3
    };
    barrels.push(barrel);
}

function moveBarrels() {
    barrels.forEach(barrel => {
        barrel.x -= barrel.speed;
    });
    barrels = barrels.filter(barrel => barrel.x + barrel.width > 0);
}

function checkCollision() {
    return barrels.some(barrel => 
        horse.x < barrel.x + barrel.width &&
        horse.x + horse.width > barrel.x &&
        horse.y < barrel.y + barrel.height &&
        horse.y + horse.height > barrel.y
    );
}

function drawHearts() {
    const heartSize = 20;
    const spacing = 5;
    const startX = canvas.width - (heartSize + spacing) * horse.lives;
    
    ctx.fillStyle = 'red';
    for (let i = 0; i < horse.lives; i++) {
        const x = startX + (heartSize + spacing) * i;
        ctx.beginPath();
        ctx.moveTo(x + heartSize / 2, 15);
        ctx.bezierCurveTo(x + heartSize / 2, 12, x, 5, x + heartSize / 4, 5);
        ctx.bezierCurveTo(x + heartSize / 2, 5, x + heartSize / 2, 12, x + heartSize / 2, 12);
        ctx.bezierCurveTo(x + heartSize / 2, 12, x + heartSize, 5, x + heartSize * 3 / 4, 5);
        ctx.bezierCurveTo(x + heartSize, 5, x + heartSize, 12, x + heartSize / 2, 15);
        ctx.fill();
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawHorse();
    drawBarrels();
    moveBarrels();
    drawHearts();  // Add this line to draw hearts
    
    if (Math.random() < 0.02) spawnBarrel();
    
    if (checkCollision()) {
        horse.lives--;  // Decrease lives on collision
        if (horse.lives <= 0) {
            alert(`Game Over! Your score: ${score}`);
            resetGame();
        } else {
            // Reset horse position and clear barrels
            horse.x = 50;
            horse.y = canvas.height / 2;
            barrels = [];
        }
    } else {
        score++;
    }
    
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
    
    requestAnimationFrame(gameLoop);
}

function resetGame() {
    horse.lives = 3;
    barrels = [];
    score = 0;
    horse.x = 50;
    horse.y = canvas.height / 2;
}

// Modify this function to start the game immediately
function startGame() {
    if (horseImg.complete) {
        gameLoop();
    } else {
        horseImg.onload = gameLoop;
    }
}

document.addEventListener('keydown', moveHorse);
startGame();