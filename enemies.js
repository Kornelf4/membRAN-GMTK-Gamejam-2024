class virus{
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.xsize = game.girdSize;
        this.ysize = game.girdSize;
        this.hasLayers = true;
        this.type = "virus";
        this.energy = 50;
        this.name = "virus";
        this.scene = game.actualScene;
        this.ui = false;
        this.speed = 4;
        this.angeledCollide = function (cell, heading) {
            switch (heading) {
                case 3:
                    return game.collide(game.objects, {  x: cell.x - 1, y: cell.y + 1, xsize: cell.xsize + 1, ysize: cell.ysize - 1 }, "moving", { property: "canCollide", value: true });
                case 1:
                    return game.collide(game.objects, { x: cell.x, y: cell.y + 1, xsize: cell.xsize + 1, ysize: cell.ysize - 1 }, "moving", { property: "canCollide", value: true });
                case 0:
                    return game.collide(game.objects, { x: cell.x + 1, y: cell.y - 1, xsize: cell.xsize - 1, ysize: cell.ysize + 1 }, "moving", { property: "canCollide", value: true });
                case 2:
                    return game.collide(game.objects, { x: cell.x + 1, y: cell.y, xsize: cell.xsize - 1, ysize: cell.ysize + 1 }, "moving", { property: "canCollide", value: true });
            }
        }
        this.heading = getRndInteger(0, 3);
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
            switch(this.heading) {
                case 0:

            }
        }
        this.visible = true;
        this.canCollide = true;
    }
}