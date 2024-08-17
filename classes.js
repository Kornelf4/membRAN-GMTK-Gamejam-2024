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
class bubble {
    constructor(x, y) {
        this.x = x; 
        this.y = y;
        this.xsize = 20;
        this.ysize = 20;
        this.speed = 5;
        this.hasLayers = false;
        this.type = "bubble";
        this.name = "baseBubble";
        this.scene = game.actualScene;
        this.ui = false;
        this.visible = true;
        this.canCollide = false;
        this.image = {src: "bubble.png", img: game.getSprite("bubble.png", this.xsize, this.ysize), rotation: 0};
        this.update = function() {
            this.y -= this.speed;
            
            if(this.y < 0) {
                game.objects.splice(game.objects.indexOf(this), 1);
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
            {type: "flipbook", name: "Idle", active: true, frames: 3, timing: 50, phase: 0, actualFrameIndex: 0, sine: false, inverse: false, rotation: 0}
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
        this.speed = 5;
        this.layers = [];
        this.visible = false;
        this.canCollide = false;
        this.cellCollide = function(cell, heading) {
            switch(heading) {
                case "left":
                    return game.collide(game.objects, {x: cell.x - 1, y: cell.y + 1, xsize: cell.xsize + 1, ysize: cell.ysize - 1}, "boo", {property: "canCollide", value: true});
                case "right":
                    return game.collide(game.objects, {x: cell.x, y: cell.y + 1, xsize: cell.xsize + 1, ysize: cell.ysize - 1}, "boo", {property: "canCollide", value: true});
                case "up":
                    return game.collide(game.objects, {x: cell.x + 1, y: cell.y - 1, xsize: cell.xsize - 1, ysize: cell.ysize + 1}, "boo", {property: "canCollide", value: true});
                case "down":
                    return game.collide(game.objects, {x: cell.x + 1, y: cell.y, xsize: cell.xsize - 1, ysize: cell.ysize + 1}, "boo", {property: "canCollide", value: true});
            }
        }
        this.cells = [new baseCell(this.x, this.y)];
        this.update = function() {
            let collided = false;
            let camera = game.objects[game.findObjectWithProp(game.objects, "type", "camera")];
            if(game.pressedKeys.w) {
                collided = false;
                for(let i = 0; i < this.cells.length; i++) {
                    if(this.cellCollide(this.cells[i], "up")) {collided = true;}
                }
                if(!collided) {
                    camera.y -= this.speed;
                    this.y -= this.speed;
                    for(let i = 0; i < this.cells.length; i++) {
                        this.cells[i].y -= this.speed;
                    }
                }
            }
            if(game.pressedKeys.s) {
                collided = false;
                for(let i = 0; i < this.cells.length; i++) {
                    if(this.cellCollide(this.cells[i], "down")) {collided = true;}
                }
                if(!collided) {
                    this.y += this.speed;
                    camera.y += this.speed;
                    for(let i = 0; i < this.cells.length; i++) {
                        this.cells[i].y += this.speed;
                    }
                }
            }
            if(game.pressedKeys.a) {
                collided = false;
                for(let i = 0; i < this.cells.length; i++) {
                    if(this.cellCollide(this.cells[i], "left")) {collided = true;}   
                }
                if(!collided) {
                    this.x -= this.speed;
                    camera.x -= this.speed;
                    for(let i = 0; i < this.cells.length; i++) {
                        this.cells[i].x -= this.speed;
                    }
                }
            }
            if(game.pressedKeys.d) {
                collided = false;
                
                for(let i = 0; i < this.cells.length; i++) {
                    if(this.cellCollide(this.cells[i], "right")) {collided = true;}
                }
                if(!collided) {
                    this.x += this.speed;
                    camera.x += this.speed;
                    for(let i = 0; i < this.cells.length; i++) {
                        this.cells[i].x += this.speed;
                    }
                }
            }
            for(let i = 0; i < this.cells.length; i++) {
                game.render(this.cells[i]);
            }
        }
    }
}