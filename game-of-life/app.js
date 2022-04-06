// Utilities

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

function gridCopy(grid)
{
    let cpy = [];

    for (let i = 0; i < grid.length; i++)
        cpy[i] = grid[i].slice();
    return cpy
}

function mod(n, m) {
    return ((n % m) + m) % m;
}

function getLivingNeighbours(grid, i, j)
{
    let n = 0;
    let w = grid[0].length;
    let h = grid.length;
    let i_d = mod(i-1, h);
    let i_u = mod(i+1, h);
    let j_l = mod(j-1, w);
    let j_r = mod(j+1, w);

    n += grid[i_d][j]
    n += grid[i_u][j]
    n += grid[i_d][j_l]
    n += grid[i_d][j_r]
    n += grid[i][j_l]
    n += grid[i][j_r]
    n += grid[i_u][j_l]
    n += grid[i_u][j_r]
    return n
}

// State

function GameOfLifeKernel(w, h) {
    this.width = w;
    this.height = h;
    this.grid = emptyGrid(w, h);

    this.next = function() {
        let grid_copy = gridCopy(this.grid);
        let living_neighbours;
        for (let i = 0; i < this.height; i++)
            for (let j = 0; j < this.width; j++)
            {
                living_neighbours = getLivingNeighbours(grid_copy, i, j);
                r = 0;
                if ((living_neighbours == 3) || (this.grid[i][j] > 0 && living_neighbours == 2))
                    r = 1;
                this.grid[i][j] = r;
            }
    };
}

function GameOfLife(canvas_id, button_id) {

    this.width = 120;
    this.height = 70;
    this.sq_size = 8;

    this.canvas = document.getElementById(canvas_id);
    this.canvas.width = this.sq_size * this.width;
    this.canvas.height = this.sq_size * this.height;

    this.button = document.getElementById(button_id);
    this.ctx = canvas.getContext('2d');

    this.timer = null;
    this.speed = 50;
    this.state = 'paused'

    this.changeState = function() {
        if (this.state == 'paused')
        {
            this.state = 'running';
            this.button.textContent = 'Pause';
            this.run();
        }
        else
        {
            this.state = 'paused';
            this.button.textContent = 'Continue';
            this.pause();
        }
        console.log("Current state is:", this.state)
    }

    this.drawSquare = function(i, j, fill, stroke) {
        let l = this.sq_size;
        let b = 0
        if (fill !== null)
        {
            this.ctx.fillStyle = fill;
            this.ctx.fillRect(i * l + b, j * l + b, l - 2 * b, l - 2 * b);
        }
        if (stroke !== null)
        {
            this.ctx.strokeStyle = stroke;
            this.ctx.strokeRect(i * l + b, j * l + b, l - 2 * b, l - 2 * b);
        }
    };

    this.drawGrid = function() {
        grid = this.kernel.grid
        for (let i = 0; i < this.height; i++)
            for (let j = 0; j < this.width; j++)
                this.drawSquare(j, i, grid[i][j] > 0 ?
                    'blue': 'lightgrey', null);
    };

    this.reset = function() {
        this.kernel = new GameOfLifeKernel(this.width, this.height);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid(this.kernel);
    }

    this.next = function() {
        this.kernel.next();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid(this.kernel);
    }

    this.reset();

    this.run = function() {
        var that = this;
        this.timer = setTimeout(function() {
            game.next();
            that.run();
        }, that.speed);
    }

    this.pause = function() {
        clearTimeout(this.timer);
    }
};

var game = new GameOfLife('canvas', 'button');

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

document.addEventListener('click', e =>
{
    if (game.state == 'paused')
    {
        pos = getMousePos(game.canvas, e);
        i = parseInt(pos.y / game.sq_size);
        j = parseInt(pos.x / game.sq_size);
        if (i >= 0 && i < game.height && j >= 0 && j < game.width)
        {
            game.kernel.grid[i][j] = 1 - game.kernel.grid[i][j];
            game.drawGrid()
        }
    }
});
