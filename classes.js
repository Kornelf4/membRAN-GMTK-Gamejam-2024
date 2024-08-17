class button{
    constructor(x, y, xsize, ysize, color, text, call) {
        this.x = x; 
        this.y = y;
        this.xsize = xsize;
        this.ysize = ysize;
        this.hasLayers = true;
        this.type = "button";
        this.name = "playButton";
        this.scene = game.actualScene;
        this.ui = true;
        this.visible = true;
        this.canCollide = false;
        this.call = call;
        this.color = color;
        this.layers = [
            {type: "filled", color: this.color},
            {type: "text", text: text, color: "black", style: "serif", size: this.ysize / 1.5, relX: 3, relY: 3}
        ]
        this.update = () => {
            if(game.clicking) {
                if(game.isOverlap(this, {x: game.cursorX, y: game.cursorY, xsize: 2, ysize: 2})) {
                    this.call();
                }
            }
        }
    }
}
class baseCell {
    constructor(x, y) {
        this.x = x; 
        this.y = y;
        this.xsize = game.girdSize;
        this.ysize = game.girdSize;
        this.hasLayers = true;
        this.type = "cell";
        this.name = "baseCell";
        this.scene = game.actualScene;
        this.ui = false;
        this.visible = true; 
        this.canCollide = true;
        this.layers = [
            {type: "flipbook", name: "Idle", active: true, frames: 3, timing: 20, phase: 0, actualFrameIndex: 0, sine: false, inverse: false, rotation: 0}
        ];
    }
}
class player {
    constructor(x, y) {
        this.x = x; 
        this.y = y;
        this.xsize = game.girdSize;
        this.ysize = game.girdSize;
        this.hasLayers = true;
        this.type = "player";
        this.name = "player";
        this.scene = game.actualScene;
        this.ui = false;
        this.speed = 1;
        this.layers = [];
        this.visible = false;
        this.canCollide = false;
        this.cellCollide = function(cell, heading) {
            switch(heading) {
                case "left":
                    return game.collide(game.objects, {x: cell.x - 1, y: cell.y - 1, xsize: cell.xsize + 1, ysize: cell.ysize - 1}, "sorted", {property: "canCollide", value: true});
                case "right":
                    return game.collide(game.objects, {x: cell.x, y: cell.y - 1, xsize: cell.xsize + 1, ysize: cell.ysize - 1}, "sorted", {property: "canCollide", value: true});
                case "up":
                    return game.collide(game.objects, {x: cell.x - 1, y: cell.y - 1, xsize: cell.xsize - 1, ysize: cell.ysize + 1}, "sorted", {property: "canCollide", value: true});
                case "down":
                    return game.collide(game.objects, {x: cell.x - 1, y: cell.y, xsize: cell.xsize - 1, ysize: cell.ysize + 1}, "sorted", {property: "canCollide", value: true});
            }
        }
        this.cells = [new baseCell(this.x, this.y), new baseCell(this.x + game.girdSize, this.y)];
        this.update = function() {
            if(game.pressedKeys.w) {
                for(let i = 0; i < this.cells.length; i++) {
                    
                    this.cells[i].y -= this.speed;
                }
                this.y -= this.speed;
            }
            if(game.pressedKeys.s) {
                for(let i = 0; i < this.cells.length; i++) {
                    this.cells[i].y += this.speed;
                }
                this.y += this.speed;
            }
            if(game.pressedKeys.a) {
                for(let i = 0; i < this.cells.length; i++) {
                    this.cells[i].x -= this.speed;
                }
                this.x -= this.speed;
            }
            if(game.pressedKeys.d) {
                for(let i = 0; i < this.cells.length; i++) {
                    this.cells[i].x += this.speed;
                }
                this.x += this.speed;
            }
            for(let i = 0; i < this.cells.length; i++) {
                game.render(this.cells[i]);
            }
        }
    }
}