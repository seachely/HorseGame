const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const horseImg = new Image();
horseImg.src = 'Horse.png';

const horse = {
    x: 50,
    y: canvas.height / 2,
    width: 80,  // Adjust based on your image size
    height: 60,  // Adjust based on your image size
    speed: 5,
    lives: 3
};

let barrels = [];
let score = 0;

function drawHorse() {
    if (horseImg.complete) {
        ctx.drawImage(horseImg, horse.x, horse.y, horse.width, horse.height);
    } else {
        ctx.fillStyle = 'brown';
        ctx.fillRect(horse.x, horse.y, horse.width, horse.height);
    }
}

function drawBarrels() {
    ctx.fillStyle = 'red';
    barrels.forEach(barrel => {
        ctx.fillRect(barrel.x, barrel.y, barrel.width, barrel.height);
    });
}

function drawHearts() {
    ctx.fillStyle = 'red';
    ctx.font = '30px Arial';
    for (let i = 0; i < horse.lives; i++) {
        ctx.fillText('❤️', canvas.width - 40 - i * 35, 30);
    }
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

// Add this function to ensure the image is loaded before starting the game
function startGame() {
    if (horseImg.complete) {
        gameLoop();
    } else {
        horseImg.onload = gameLoop;
    }
}

document.addEventListener('keydown', moveHorse);
startGame();