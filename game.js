const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [
    { x: 10, y: 10 },
];
let food = { x: 15, y: 15 };
let dx = 0;
let dy = 0;
let gameStarted = false;
let score = 0;
let isPaused = false;
let inputQueue = [];
let gameSpeed = 200; // 默认速度为中等难度

// 难度选择按钮事件监听
document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // 移除其他按钮的激活状态
        document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
        // 激活当前按钮
        btn.classList.add('active');
        // 更新游戏速度
        gameSpeed = parseInt(btn.dataset.speed);
        // 重新设置游戏循环
        clearInterval(gameLoop);
        gameLoop = setInterval(drawGame, gameSpeed);
    });
});

function drawGame() {
    // 处理输入队列
    if (!isPaused && gameStarted && inputQueue.length > 0) {
        const newDir = inputQueue.shift();
        dx = newDir.dx;
        dy = newDir.dy;
    }

    if (!gameStarted) {
        // 绘制初始状态
        ctx.fillStyle = '#ecf0f1';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // 绘制静止的蛇和食物
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize-2, gridSize-2);
        snake.forEach((segment, index) => {
            ctx.fillStyle = index === 0 ? '#2ecc71' : '#27ae60';
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize-2, gridSize-2);
        });
        return;
    }
    if (isPaused) {
        ctx.fillStyle = '#2c3e50';
        ctx.font = '30px Arial';
        ctx.fillText('已暂停', canvas.width/2 - 50, canvas.height/2);
        return;
    }
    
    // 移动蛇身
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    // 检查吃到食物
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        generateFood();
    } else {
        snake.pop();
    }

    // 清空画布
    ctx.fillStyle = '#ecf0f1';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制食物
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize-2, gridSize-2);

    // 绘制蛇身
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#2ecc71' : '#27ae60';
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize-2, gridSize-2);
    });

    // 碰撞检测
    if ((head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        document.getElementById('finalScore').textContent = score;
        document.getElementById('gameOver').style.display = 'block';
        gameStarted = false;
        return;
    }
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    // 确保食物不生成在蛇身上
    if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        generateFood();
    }
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    dx = 0;
    dy = 0;
    score = 0;
    scoreElement.textContent = score;
    generateFood();
    gameStarted = false;
}

// 键盘控制
document.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
    }
    const newDir = getValidDirection(e.key);
    if (newDir) inputQueue.push(newDir);
    if (e.key === 'Enter' && !gameStarted) {
        document.getElementById('gameOver').style.display = 'none';
        resetGame();
    }
});

function getValidDirection(key) {
    switch(key) {
        case 'ArrowUp':
            if (dy !== 1) {
                gameStarted = true;
                return { dx: 0, dy: -1 };
            }
            break;
        case 'ArrowDown':
            if (dy !== -1) {
                gameStarted = true;
                return { dx: 0, dy: 1 };
            }
            break;
        case 'ArrowLeft':
            if (dx !== 1) {
                gameStarted = true;
                return { dx: -1, dy: 0 };
            }
            break;
        case 'ArrowRight':
            if (dx !== -1) {
                gameStarted = true;
                return { dx: 1, dy: 0 };
            }
            break;
        case ' ':
            isPaused = !isPaused;
            return null;
    }
    return null;
}

// 启动游戏循环
let gameLoop = setInterval(drawGame, gameSpeed);