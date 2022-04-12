const canvas = document.querySelector('canvas'); /** @type {HTMLCanvasElement}*/
let ctx = canvas.getContext('2d'); /** @type {HTMLCanvas2dRendefing} */ //! check context type 

const WIDTH = canvas.width; /** @type {number} */
const HEIGHT = canvas.height; /** @type {number} */
const CELL_SIZE = 50; /** @type {number} */

class Field {
    constructor(totalLiveCells = 10, cellColor = 'white', type = 'square') {
        this.lives = totalLiveCells;
        this.cells = [];
        this.color = cellColor;
        this.generate();
        this.id;
        this.type = type;
    }

    generate() {
        ctx.fillStyle = this.color;
        for (let i = 0; i < WIDTH / CELL_SIZE; ++i) { // total rows
            this.cells.push([]);
            for (let j = 0; j < HEIGHT / CELL_SIZE; ++j) { // total columns
                this.cells[i].push(0);
            }
        }
        
        let rest = []; /** @type {Array of Objects {x: number, y: number}} */
        while(this.lives --){
            let x = Math.floor(Math.random() * WIDTH / CELL_SIZE),
            y = Math.floor(Math.random() * HEIGHT / CELL_SIZE);
            
            while(!this.#checkCell(rest, {x, y})){
                x = Math.floor(Math.random() * WIDTH / CELL_SIZE),
                y = Math.floor(Math.random() * HEIGHT / CELL_SIZE);
            }
            rest.push({
                x, y
            })
            this.cells[x][y] = 1;
        }

        this.renderLifes();
    }
    
    #checkCell(rest, pos){
        for(let r of rest){
            if(r.x === pos.x && r.y === pos.y){
                return false
            }
        }
        return true;
    }
    
    checkLife(){
        clearInterval(this.id);
        let copy = [...this.cells].map(e => [...e]);
        for(let i = 0; i < this.cells.length; ++i){
            for(let j = 0; j < this.cells[i].length; ++j){
                let total = 0;
                 if(copy[i][j - 1] === 1) total++;
                 if(copy[i][j + 1] === 1)total++;
                 if(copy[i - 1]){
                    if(copy[i - 1][j] === 1)total++;
                    if(copy[i - 1][j - 1] === 1)total++;
                    if(copy[i - 1][j + 1] === 1)total++;
                 }
                 if(copy[i + 1]){
                    if(copy[i + 1][j] === 1)total++;
                    if(copy[i + 1][j - 1] === 1)total++;
                    if(copy[i + 1][j + 1] === 1)total++;
                 }

                 if(copy[i][j] === 1){
                     if(total < 2){
                         this.cells[i][j] = 0
                     }else if(total > 3){
                         this.cells[i][j] = 0;
                     }
                 }else{
                     if(total === 3){
                         this.cells[i][j] = 1;
                     }
                 }
            }
        }
        this.renderLifes();
        // requestAnimationFrame(this.checkLife.bind(this));
        this.id = setInterval(() => this.checkLife(), 100);
    }

    renderLifes(){
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        for(let i = 0; i < this.cells.length; ++i){
            for(let j = 0 ;j < this.cells[i].length; ++j){
                if(this.cells[i][j] === 1){
                    if(this.type === 'square'){
                        ctx.fillRect(CELL_SIZE * i, CELL_SIZE * j, CELL_SIZE, CELL_SIZE);
                    }else if(this.type === 'circle'){
                        ctx.beginPath();
                        ctx.arc(CELL_SIZE * i, CELL_SIZE * j, CELL_SIZE / 2, 0, 2 * Math.PI);
                        ctx.fill();
                        ctx.closePath();
                    }
                }
            }
        }
    }

}

// class Cell {

// }

const field = new Field(300, '#dd1dad', 'circle');
setTimeout(() =>{
    field.checkLife();
}, 200)
