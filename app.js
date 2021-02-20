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
        if (pos.x < 0 || pos.x >= w || pos.y < 0 || pos.y >= h)
            val = 1;
        else
            val = this.grid[pos.x][pos.y];
        if (val == 1) {
            return {
                status: 'failed'
            };
        }
        else {
            this.grid[pos.x][pos.y] = 1;
            this.chain.unshift(pos);
            return {
                status: 'success',
                added: pos
            };
        }
    }
}

function Game(canvas_id, direction_id, button_id) {
    this.canvas = document.getElementById(canvas_id);
    this.directionDOM = document.getElementById(direction_id);
    this.button = document.getElementById(button_id);
    this.ctx = canvas.getContext('2d');
    this.snake_color = {
        stroke: null,
        fill: 'black'
    }
    this.apple_color = {
        stroke: 'red',
        fill: 'pink'
    }
    this.background_fill = 'lightgrey';
    this.sq_size = 10;
    this.weigth = 20;
    this.height = 20;
    this.state = 1;
    this.timer = null;
    this.speed = 200;

    this.reset = function() {
        this.state = 0;
        this.snake = new Snake(this.weigth, this.height);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.directionDOM.textContent = getDirectionName(this.snake.direction);
        this.drawSquare(this.snake.chain[0], this.snake_color);
    };

    this.drawSquare = function(pos, color) {
        let l = this.sq_size;
        if (color.fill !== null)
        {
            this.ctx.fillStyle = color.fill;
            this.ctx.fillRect(pos.x * l, pos.y * l, l, l);
        }
        if (color.stroke !== null)
        {
            this.ctx.strokeStyle = color.stroke;
            this.ctx.strokeRect(pos.x * l, pos.y * l, l, l);
        }
    };

    this.drawSnake = function(color) {
        this.snake.chain.forEach(e => {
            this.drawSquare(e, {fill: 'darkgrey', stroke: null});
        })
    }

    this.next = function() {
        res = this.snake.next();
        if (res.status == "success")
        {
            this.drawSquare(res.added, this.snake_color);
            return (1);
        }
        else if (res.status == "failed")
        {
            return (0);
        }
    };

    this.setDirection = function(newDirection) {
        if (this.snake.direction % 2 == newDirection % 2)
            return ;
        this.snake.direction = newDirection;
        this.directionDOM.textContent = getDirectionName(newDirection);
    };

    this.reset();

    this.run = function() {
        var that = this;
        this.timer = setTimeout(function() 
        {   
            let status = game.next();
            if (status == 1)
            {
                that.run();
            }
            else
            {
                that.setState(3);
            }
        }, that.speed);
    }

    this.pause = function() {
        clearTimeout(this.timer);
    }

    this.setState = function(newState) {
        this.state = newState;
        switch (newState) {
            case 0: // Reset / To be Started
                this.button.textContent = 'Start';
                this.pause();
                this.reset();
                break;
            case 1: // Run
                this.run();
                this.button.textContent = 'Pause';
                break;
            case 2: // Pause
                this.button.textContent = 'Continue';
                this.pause();
                break;
            case 3: // Game Over
                this.drawSnake();
                this.button.textContent = 'Reset';
                this.pause();
                break;
        } 
    }

    this.nextState = function() {
        console.log(this.state);
        switch (this.state) {
            case 0: // Start
                this.setState(1);
                break;
            case 1: // Pause
                this.setState(2);
                break;
            case 2: // Continue
                this.setState(1);
                break;
            case 3: // Reset
                this.setState(0);
                break;
        }
    }
}

var game = new Game('canvas', 'direction', 'button');

document.addEventListener('keydown', e =>
{
    let isArrowKey = true;
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
            isArrowKey = false;
            break;
    }
});


