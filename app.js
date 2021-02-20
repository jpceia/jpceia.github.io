// Utilities

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomPoint(w, h) {
    return {
        x: getRandomInt(0, w),
        y: getRandomInt(0, h)
    }
}

function emptyGrid(w, h)
{
    let grid = []
    for (let i = 0; i < h; i++)
    {
        let grid_line = []
        for (let j = 0; j < w; j++)
            grid_line.push(0);
        grid.push(grid_line);
    }
    return grid;
}

function getNextPosition(pos, direction) {
    // 0 - right
    // 1 - up
    // 2 - left
    // 3 - down
    if (direction % 4 == 0)
        return {x: pos.x, y: pos.y - 1};
    if (direction % 4 == 1)
        return {x: pos.x + 1, y: pos.y};
    if (direction % 4 == 2)
        return {x: pos.x, y: pos.y + 1};
    if (direction % 4 == 3)
        return {x: pos.x - 1, y: pos.y};
    throw 'Invalid direction';
}

function getDirectionName(direction) {
    if (direction % 4 == 0)
        return "Up";
    if (direction % 4 == 1)
        return "Right";
    if (direction % 4 == 2)
        return "Down";
    if (direction % 4 == 3)
        return "Left";
    throw 'Invalid direction';
}


// State

function Snake(w, h) {
    this.grid = emptyGrid(w, h);
    this.chain = [getRandomPoint(w, h)];
    this.direction = getRandomInt(0, 4);
    this.next = function() {
        let pos = getNextPosition(this.chain[0], this.direction);
        this.grid[pos.x, pos.y] = 1;
        this.chain.unshift(pos);
        return {
            status: 'success',
            added: pos
        };
    }
}

function drawSquare(ctx, pos, color)
{

}

function Game(canvas_id, direction_id) {
    this.canvas = document.getElementById(canvas_id);
    this.directionDOM = document.getElementById(direction_id);
    this.ctx = canvas.getContext('2d');
    this.snake_color = 'black';
    this.apple_color = 'red';
    this.background_color = 'lightgrey';
    this.sq_size = 10;
    this.weigth = 20;
    this.height = 20;

    this.reset = function() {
        this.snake = new Snake(this.weigth, this.height);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.directionDOM.textContent = getDirectionName(this.snake.direction);
        this.fillSquare(this.snake.chain[0], this.snake_color);
    };

    this.fillSquare = function(pos, color) {
        let l = this.sq_size;
        this.ctx.fillStyle = color;
        this.ctx.fillRect(pos.x * l, pos.y * l, l, l);
    };

    this.next = function() {
        res = this.snake.next();
        if (res.status == "success")
        {
            this.fillSquare(res.added, this.snake_color);
        }
        else
        {

        }
    };

    this.setDirection = function(newDirection) {
        this.snake.direction = newDirection;
        this.directionDOM.textContent = getDirectionName(newDirection);
    };
    
    this.reset();
}

game = new Game('canvas', 'direction');



document.addEventListener('keydown', e =>
{
    console.log(e.key);
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
            game.setDirection(0);
            break;
        case 'ArrowRight':
        case 'd':
            game.setDirection(1);
            break;
        case 'ArrowDown':
        case 's':
            game.setDirection(2);
            break;
        case 'ArrowLeft':
        case 'a':
            game.setDirection(3);
            break;
        default:
            break;
    }
});