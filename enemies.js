function rotate(num, virus) {
    if(num == 1) {
        if(virus.heading == 3) {
            virus.heading = 0;
        } else {
            virus.heading++;
        }
    }
    if(num == 0) {
        if(virus.heading == 0) {
            virus.heading = 3;
        } else {
            virus.heading--;
        }
    }
}
class virus{
    constructor(x, y, heading) {
        this.x = x + 10;
        this.y = y + 10;
        this.xsize = game.girdSize - 10;
        this.ysize = game.girdSize - 10;
        this.hasLayers = true;
        this.type = "virus";
        this.collectable = true; //wtf
        this.name = "virus";
        this.scene = game.actualScene;
        this.ui = false;
        this.speed = 4;
        this.angeledCollide = function (cell, heading, player) {
            let camera = game.objects[game.findObjectWithProp(game.objects, "type", "camera")];
            let player2 = game.objects[game.findObjectWithProp(game.objects, "type", "player")];
            let cella = cell;
            switch (heading) {
                case 3:
                    cella.x -= 2;
                    cella.y += 2;
                    cella.xsize += 2;
                    cella.ysize -=2;
                    //ctx.fillRect(camera.getRelativeX(cell.x - 2),camera.getRelativeY(cell.y + 2), cell.xsize + 2, cell.ysize - 2 );
                    //return game.collide(game.objects, {  x: cell.x - 2, y: cell.y + 2, xsize: cell.xsize + 2, ysize: cell.ysize - 2 }, "boo", { property: "canCollide", value: true });
                    if(player == true) {
                        var c = game.collide(player2.cells, cella, "object");
                    } else {
                        var c = game.collide(game.objects, cella, "moving", { property: "canCollide", value: true });
                    }
                    cella.x += 2;
                    cella.y -= 2;
                    cella.xsize -= 2;
                    cella.ysize +=2;
                    return c;

                case 1:
                    cella.x -= 0;
                    cella.y += 2;
                    cella.xsize += 2;
                    cella.ysize -=2;
                    //ctx.fillRect(camera.getRelativeX(cell.x), camera.getRelativeY(cell.y + 2), cell.xsize + 2, cell.ysize - 2)
                    //return game.collide(game.objects, { x: cell.x, y: cell.y + 2, xsize: cell.xsize + 2, ysize: cell.ysize - 2 }, "boo", { property: "canCollide", value: true });
                    if(player == true) {
                        var c = game.collide(player2.cells, cella, "object");
                    } else {
                        var c = game.collide(game.objects, cella, "moving", { property: "canCollide", value: true });
                    }
                    cella.x -= 0;
                    cella.y -= 2;
                    cella.xsize -= 2;
                    cella.ysize +=2;
                    return c;
                case 0:
                    cella.x += 2;
                    cella.y -= 2;
                    cella.xsize -= 2;
                    cella.ysize += 2;
                    //ctx.fillRect(camera.getRelativeX(cell.x + 2), camera.getRelativeY(cell.y - 2), cell.xsize - 2, cell.ysize + 2 )
                    if(player == true) {
                        var c = game.collide(player2.cells, cella, "object");
                    } else {
                        var c = game.collide(game.objects, cella, "moving", { property: "canCollide", value: true });
                    }
                    cella.x -= 2;
                    cella.y += 2;
                    cella.xsize += 2;
                    cella.ysize -= 2;
                    return c;
                case 2:
                    cella.x += 2;
                    cella.y -= 0;
                    cella.xsize -= 2;
                    cella.ysize += 2;
                    //ctx.fillRect(camera.getRelativeX(cell.x + 2),camera.getRelativeY(cell.y), cell.xsize - 2, cell.ysize + 2 )
                    if(player == true) {
                        var c = game.collide(player2.cells, cella, "object");
                    } else {
                        var c = game.collide(game.objects, cella, "moving", { property: "canCollide", value: true });
                    }
                    cella.x -= 2;
                    cella.y += 0;
                    cella.xsize += 2;
                    cella.ysize -= 2;
                    return c;

            }
        }
        this.heading = heading;
        this.rotation = this.heading * 90;
        this.layers = [
            {type: "flipbook", frames: 3, timing: 10, phase: 0, name: "Move", active: true, sine: false, inverse: false, actualFrameIndex: 0, rotation: this.heading * 90}
        ];
        this.start = function() {
            if(game.collide(game.objects, this, "boo")) {
                game.objects.splice(game.objects.indexOf(this), 1);
            }
        }
        this.update = function() {
            this.rotation = this.heading * 90;
            if (game.clicking) {
                if (game.isOverlap(this, { x: game.cursorX, y: game.cursorY, xsize: 2, ysize: 2 })) {
                    console.log(this.heading);
                }
            }
            let num = 0;
            var rotateType = getRndInteger(0,1);
            let a = () => {
                num++;
                let collision = this.angeledCollide(this, this.heading) || this.angeledCollide(this, this.heading, true);
                
                /*for(let i = 0; i < game.objects.length; i++) {
                    game.isOverlap(game.objects[i], this);
                }*/
                if(collision) {
                    if(this.angeledCollide(this, this.heading, true) != false) {
                        this.angeledCollide(this, this.heading, true).hp--;
                        game.objects.splice(game.objects.indexOf(this), 1);
                    }
                    rotate(rotateType, this);
                    let collisionNext = this.angeledCollide(this, this.heading);
                    if(!collisionNext) return;
                    if(num < 10) return;
                    if(collisionNext) a();
                } else {
                    return;
                }
            }
            a();
            
            if(this.heading == 0) {
                this.y -= this.speed;
            } else if(this.heading == 1) {
                this.x += this.speed;
            } else if(this.heading == 2) {
                this.y += this.speed;
            } else if(this.heading == 3) {
                this.x -= this.speed;
            }
        }
        this.visible = true;
        this.canCollide = true;
    }
}