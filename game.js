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
let score = 0;
let isPaused = false;

function drawGame() {
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
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount || 
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        alert('游戏结束！得分：' + score);
        resetGame();
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
}

// 键盘控制
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowUp':
            e.preventDefault();
            if (dy !== 1) { dx = 0; dy = -1; }
            break;
        case 'ArrowDown':
            e.preventDefault();
            if (dy !== -1) { dx = 0; dy = 1; }
            break;
        case 'ArrowLeft':
            e.preventDefault();
            if (dx !== 1) { dx = -1; dy = 0; }
            break;
        case 'ArrowRight':
            e.preventDefault();
            if (dx !== -1) { dx = 1; dy = 0; }
            break;
        case ' ':
            e.preventDefault();
            isPaused = !isPaused;
            break;
    }
});

// 启动游戏循环
setInterval(drawGame, 100);