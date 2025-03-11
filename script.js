// 获取画布和上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 游戏配置
const gridSize = 20;
const tileCount = canvas.width / gridSize;
let speed = 7;

// 蛇的初始位置和速度
let snake = [
    { x: 10, y: 10 }
];
let dx = 0;
let dy = 0;

// 食物位置
let food = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
};

// 游戏状态
let score = 0;
let gameStarted = false;
let gameOver = false;

// 获取DOM元素
const scoreElement = document.getElementById('score');
const startBtn = document.getElementById('startBtn');

// 事件监听
startBtn.addEventListener('click', startGame);
document.addEventListener('keydown', handleKeyPress);

// 开始游戏
function startGame() {
    if (gameOver || !gameStarted) {
        snake = [{ x: 10, y: 10 }];
        dx = 0;
        dy = 0;
        score = 0;
        scoreElement.textContent = score;
        gameStarted = true;
        gameOver = false;
        generateFood();
        startBtn.textContent = '重新开始';
        gameLoop();
    }
}

// 游戏主循环
function gameLoop() {
    if (gameOver || !gameStarted) return;
    
    setTimeout(() => {
        clearCanvas();
        moveSnake();
        drawFood();
        drawSnake();
        checkCollision();
        if (!gameOver) {
            gameLoop();
        }
    }, 1000 / speed);
}

// 清空画布
function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// 绘制蛇
function drawSnake() {
    ctx.fillStyle = '#4CAF50';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });
}

// 绘制食物
function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

// 移动蛇
function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        generateFood();
        speed = Math.min(15, 7 + Math.floor(score / 50)); // 随分数提高速度，最大15
    } else {
        snake.pop();
    }
}

// 生成食物
function generateFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    // 确保食物不会生成在蛇身上
    while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    }
}

// 检查碰撞
function checkCollision() {
    const head = snake[0];
    
    // 检查是否撞墙
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver = true;
    }
    
    // 检查是否撞到自己
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver = true;
            break;
        }
    }
    
    if (gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('游戏结束!', canvas.width / 2, canvas.height / 2);
    }
}

// 处理键盘输入
function handleKeyPress(event) {
    if (!gameStarted) return;
    
    switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            if (dy !== 1) { // 防止直接反向移动
                dx = 0;
                dy = -1;
            }
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (dy !== -1) {
                dx = 0;
                dy = 1;
            }
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (dx !== 1) {
                dx = -1;
                dy = 0;
            }
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (dx !== -1) {
                dx = 1;
                dy = 0;
            }
            break;
    }
} 