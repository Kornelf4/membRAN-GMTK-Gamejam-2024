
class button {
    constructor(x, y, xsize, ysize, color, text, call) {
        this.x = x;
        this.y = y;
        this.xsize = xsize;
        this.ysize = ysize;
        this.hasLayers = true;
        this.type = "button";
        this.name = "playButton";
        this.scene = game.actualScene;
        this.ready = true;
        this.ui = true;
        this.visible = true;
        this.canCollide = false;
        this.call = call;
        this.color = color;
        this.layers = [
            { type: "filled", color: this.color },
            { type: "text", text: text, color: "black", style: "serif", size: this.ysize / 1.5, relX: 3, relY: 3 }
        ]
        this.update = () => {
            if (game.clicking) {
                if (game.isOverlap(this, { x: game.cursorX, y: game.cursorY, xsize: 2, ysize: 2 }) && this.ready) {
                    console.log("b");
                    this.call();
                    this.ready = false;
                }
            }
            if (!game.clicking) {
                this.ready = true;
            }
            game.render(this);
        }
    }
}
class updatedText {
    constructor(x, y, size, color, updateTo) {
        this.x = x;
        this.y = y;
        this.xsize = 10;
        this.ysize = size;
        this.hasLayers = true;
        this.type = "text";
        this.name = "updatedText";
        this.scene = game.actualScene;
        this.ui = true;
        this.visible = true;
        this.update = updateTo;
        this.canCollide = false;
        this.color = color;
        this.rotation = 0;
        this.layers = [{
            type: "text",
            size: size,
            text: "",
            style: "serif",
            color: this.color
        }];
    }
}
class imageButton {
    constructor(x, y, xsize, ysize, color, call, src, mod) {
        this.x = x;
        this.y = y;
        this.xsize = xsize;
        this.ysize = ysize;
        this.hasLayers = true;
        this.type = "button";
        this.name = "imageButton";
        this.scene = game.actualScene;
        this.ready = true;
        this.ui = true;
        this.visible = true;
        this.canCollide = false;
        this.call = call;
        this.color = color;
        this.rotation = 0;
        this.src = src;
        this.layers = [
            { type: "filled", color: this.color },
            { type: "image", src: src + mod, img: game.getSprite(src + mod, xsize, ysize), rotation: 0 }
        ];
        this.update = () => {
            if (game.clicking) {
                if (game.isOverlap(this, { x: game.cursorX, y: game.cursorY, xsize: 2, ysize: 2 })) {

                    this.call();
                    this.ready = false;
                }
            }
            if (!game.clicking) {
                this.ready = true;
            }
            game.render(this);
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
        this.image = { src: "bubble.png", img: game.getSprite("bubble.png", this.xsize, this.ysize), rotation: 0 };
        this.update = function () {
            this.y -= this.speed;

            if (this.y < 0) {
                game.objects.splice(game.objects.indexOf(this), 1);
            }
        }
    }
}
class textBox {
    constructor(x, y, text, size, color) {
        this.x = x;
        this.y = y;
        this.xsize = 10;
        this.ysize = size;
        this.hasLayers = true;
        this.type = "text";
        this.name = "powerText";
        this.scene = game.actualScene;
        this.ui = true;
        this.visible = true;
        this.canCollide = false;
        this.color = color;
        this.rotation = 0;
        this.layers = [{
            type: "text",
            size: size,
            text: text,
            style: "serif",
            color: color
        }];
    }
}
class toDrawImage {
    constructor(x, y, xsize, ysize, src) {
        this.x = x;
        this.y = y;
        this.xsize = xsize;
        this.ysize = ysize;
        this.hasLayers = true;
        this.type = "image";
        this.name = "image";
        this.scene = game.actualScene;
        this.ui = true;
        this.visible = true;
        this.canCollide = false;
        this.rotation = 0;
        this.layers = [{type: "image", src: src, img: game.getSprite(src, xsize, ysize)}];
    }
}
function sideBar(xsize) {
    this.ui = true;
    this.x = parseInt(game.canvas.width) - xsize;
    this.y = 0;
    this.xsize = xsize;
    this.ysize = parseInt(game.canvas.height);
    this.visible = true;
    this.hasLayers = true;
    this.canCollide = false;
    this.type = "bar";
    this.content = [];
    this.buttonSize = 40;
    this.space = 10;
    this.scene = game.actualScene;
    this.color = "#70d48b";
    this.layers = [
        { type: "filled", color: this.color }
    ];
    this.start = function () {
        let i2 = 0;
        for (let i in cellTypes) {
            let actual = cellTypes[i];
            this.content.unshift(new imageButton(this.x + 50, (this.buttonSize + this.space) * i2 + this.space, this.buttonSize, this.buttonSize, "yellow", function () {
                let player = game.objects[game.findObjectWithProp(game.objects, "type", "player")];
                console.log("a");
                player.buildType = this.src;
            }, i, "Idle0.png"));
            this.content.unshift(new textBox(this.x + 110, (this.buttonSize + this.space) * i2 + this.space, new cellTypes[i](0, 0).energyCost, this.buttonSize, "black"));
            i2++;
        }
    }
    this.update = function () {
        this.visible = game.showBuildArea;
        game.render(this);
        for (let i = 0; i < this.content.length; i++) {
            //console.log(this.content[i]);
            this.content[i].visible = game.showBuildArea;
            if (this.content[i].update !== undefined) {
                this.content[i].update()
            }
            game.render(this.content[i]);
        }
    }
}
let cellTypes = {
    baseCell: function (x, y) {
        this.x = x;
        this.y = y;
        this.energyCost = 3;
        this.xsize = game.girdSize;
        this.hp = 2;
        this.ysize = game.girdSize;
        this.hasLayers = true;
        this.type = "cell";
        this.spawnCell = false;
        this.name = "baseCell";
        this.scene = game.actualScene;
        this.ui = false;
        this.visible = true;
        this.action = function (parent) {
            if (game.deleteMode) {
                if (parent.energy >= 1) {
                    parent.cells.splice(parent.cells.indexOf(this), 1);
                }
            }
        }
        this.canCollide = true;
        this.getAllNear = function () {
            let a = [];
            //Up
            a.unshift({
                x: this.x, y: this.y - this.ysize, xsize: game.girdSize, ysize: game.girdSize, active: false
            });
            //Down
            a.unshift({
                x: this.x, y: this.y + this.ysize, xsize: game.girdSize, ysize: game.girdSize, active: false,
            })
            //Left
            a.unshift({
                x: this.x - this.xsize, y: this.y, xsize: game.girdSize, ysize: game.girdSize, active: false,
            })
            //Right
            a.unshift({
                x: this.x + this.xsize, y: this.y, xsize: game.girdSize, ysize: game.girdSize, active: false,
            });
            return a;
        }
        this.layers = [
            { type: "flipbook", name: "Idle", active: true, frames: 3, timing: 50, phase: 0, actualFrameIndex: 0, sine: false, inverse: false, rotation: 0 }
        ];
    },
    armoredCell: function (x, y) {
        this.x = x;
        this.y = y;
        this.energyCost = 4;
        this.xsize = game.girdSize;
        this.hp = 4;
        this.ysize = game.girdSize;
        this.hasLayers = true;
        this.type = "cell";
        this.spawnCell = false;
        this.name = "armoredCell";
        this.scene = game.actualScene;
        this.ui = false;
        this.visible = true;
        this.action = function (parent) {
            if (game.deleteMode) {
                if (parent.energy >= 1) {
                    parent.cells.splice(parent.cells.indexOf(this), 1);
                }
            }
        }
        this.canCollide = true;
        this.getAllNear = function () {
            let a = [];
            //Up
            a.unshift({
                x: this.x, y: this.y - this.ysize, xsize: game.girdSize, ysize: game.girdSize, active: false
            });
            //Down
            a.unshift({
                x: this.x, y: this.y + this.ysize, xsize: game.girdSize, ysize: game.girdSize, active: false,
            })
            //Left
            a.unshift({
                x: this.x - this.xsize, y: this.y, xsize: game.girdSize, ysize: game.girdSize, active: false,
            })
            //Right
            a.unshift({
                x: this.x + this.xsize, y: this.y, xsize: game.girdSize, ysize: game.girdSize, active: false,
            });
            return a;
        }
        this.layers = [
            { type: "flipbook", name: "Idle", active: true, frames: 3, timing: 50, phase: 0, actualFrameIndex: 0, sine: false, inverse: false, rotation: 0 }
        ];
    },
    photoCell: function (x, y) {
        this.x = x;
        this.y = y;
        this.xsize = game.girdSize;
        this.hp = 1;
        this.ysize = game.girdSize;
        this.hasLayers = true;
        this.heat = 0;
        this.type = "cell";
        this.update = function (parent) {
            this.heat++;
            if (this.heat == 100) {
                this.heat = 0;
                parent.energy += 0.1;
            }
        }
        this.spawnCell = false;
        this.energyCost = 6;
        this.action = function (parent) {
            if (game.deleteMode) {
                if (parent.energy >= 1) {
                    parent.cells.splice(parent.cells.indexOf(this), 1);
                }
            }
        }
        this.name = "photoCell";
        this.scene = game.actualScene;
        this.ui = false;
        this.visible = true;
        this.canCollide = true;
        this.getAllNear = function () {
            let a = [];
            //Up
            a.unshift({
                x: this.x, y: this.y - this.ysize, xsize: game.girdSize, ysize: game.girdSize, active: false
            });
            //Down
            a.unshift({
                x: this.x, y: this.y + this.ysize, xsize: game.girdSize, ysize: game.girdSize, active: false,
            })
            //Left
            a.unshift({
                x: this.x - this.xsize, y: this.y, xsize: game.girdSize, ysize: game.girdSize, active: false,
            })
            //Right
            a.unshift({
                x: this.x + this.xsize, y: this.y, xsize: game.girdSize, ysize: game.girdSize, active: false,
            });
            return a;
        }
        this.layers = [
            { type: "flipbook", name: "Idle", active: true, frames: 3, timing: 50, phase: 0, actualFrameIndex: 0, sine: false, inverse: false, rotation: 0 }
        ];
    },
    acidicMiner: function (x, y) {
        this.x = x;
        this.y = y;
        this.hp = 3;
        this.xsize = game.girdSize;
        this.ysize = game.girdSize;
        this.hasLayers = true;
        this.readyToReady = false;
        this.ready = false;
        this.tick = 0;
        this.type = "cell";
        this.update = function (parent) {
            this.tick++;
        }
        this.start = function () {
            this.ready = true;
        }
        this.action = function (parent) {
            if (game.deleteMode) {
                if (parent.energy >= 1) {
                    parent.cells.splice(parent.cells.indexOf(this), 1);
                }
            }
            let nears = this.getAllNear();
            let toDelete = [];
            if (this.tick < 10) return;
            if (!this.ready) return;
            if (parent.energy < 2.5) return;
            for (let i = 0; i < nears.length; i++) {
                toDelete.unshift(...game.collide(game.objects, nears[i], "multi"))
            }
            for (let i = 0; i < toDelete.length; i++) {
                let removed = 0;
                if (toDelete[i - removed].type == "tile" || toDelete[i - removed].collectable == true) {
                    if (toDelete[i - removed].hp !== undefined) {
                        toDelete[i - removed].hp -= 2;
                    } else {
                        game.objects.splice(game.objects.indexOf(toDelete[i]), 1);
                    }
                }
            }
            parent.energy -= 2.5;
            this.ready = false;
            console.log(toDelete);
        }
        this.spawnCell = false;
        this.energyCost = 7;
        this.name = "acidicMiner";
        this.scene = game.actualScene;
        this.ui = false;
        this.visible = true;
        this.canCollide = true;
        this.getAllNear = function () {
            let a = [];
            //Up
            a.unshift({
                x: this.x, y: this.y - this.ysize, xsize: game.girdSize, ysize: game.girdSize, active: false
            });
            //Down
            a.unshift({
                x: this.x, y: this.y + this.ysize, xsize: game.girdSize, ysize: game.girdSize, active: false,
            })
            //Left
            a.unshift({
                x: this.x - this.xsize, y: this.y, xsize: game.girdSize, ysize: game.girdSize, active: false,
            })
            //Right
            a.unshift({
                x: this.x + this.xsize, y: this.y, xsize: game.girdSize, ysize: game.girdSize, active: false,
            });
            return a;
        }
        this.layers = [
            { type: "flipbook", name: "Idle", active: true, frames: 3, timing: 50, phase: 0, actualFrameIndex: 0, sine: false, inverse: false, rotation: 0 }
        ];
    }

}
class organicMatter {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.xsize = size;
        this.ysize = size;
        this.collectable = true;
        this.hasLayers = true;
        this.type = "food";
        this.name = "organicMatter";
        this.scene = game.actualScene;
        this.ui = false;
        this.visible = true;
        this.canCollide = true;
        this.start = function () {
            if (game.collide(game.objects, this, "boo")) {
                game.objects.splice(game.objects.indexOf(this), 1);
            }
        }
        this.update = function () {
            let player = game.objects[game.findObjectWithProp(game.objects, "type", "player")];
            if (game.collide(player.cells, this, "boo")) {
                if (game.collide(player.cells, this, "object").name == "baseCell") {
                    player.energy += this.xsize / 10;
                }
                game.objects.splice(game.objects.indexOf(this), 1);
            }
        }
        this.layers = [
            { type: "image", src: "organicMatter.png", img: game.getSprite("organicMatter.png", this.xsize, this.ysize), rotation: 0 }
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
        this.groupDebug = null;
        this.energy = 50;
        this.name = "player";
        this.scene = game.actualScene;
        this.ui = false;
        this.collectable = true;
        this.buildType = "baseCell";
        this.speed = 5;
        this.render = () => {
            let camera = game.objects[game.findObjectWithProp(game.objects, "type", "camera")];

            if (game.deleteMode) {
                let camera = game.objects[game.findObjectWithProp(game.objects, "type", "camera")];
                for (let i = 0; i < this.cells.length; i++) {
                    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
                    ctx.fillRect(camera.getRelativeX(this.cells[i].x), camera.getRelativeY(this.cells[i].y), game.girdSize, game.girdSize)
                }
            }
            if (game.showBuildArea) {
                let camera = game.objects[game.findObjectWithProp(game.objects, "type", "camera")];
                ctx.fillStyle = "green";
                for (let i = 0; i < this.buildPlaces.length; i++) {
                    if (this.buildPlaces[i].active == false) continue;
                    ctx.fillRect(camera.getRelativeX(this.buildPlaces[i].x), camera.getRelativeY(this.buildPlaces[i].y), game.girdSize, game.girdSize);
                }
            }
            for (let i = 0; i < this.cells.length; i++) {
                if (this.cells[i].action !== undefined) {
                    if (game.clicking) {
                        if (game.isOverlap(this.cells[i], { x: game.cursorX + camera.x, y: game.cursorY + camera.y, xsize: 2, ysize: 2 }) && this.cells[i].ready) {
                            this.cells[i].action(this);
                        }
                    } else {
                        this.cells[i].ready = true;
                    }
                }
                game.render(this.cells[i]);
                game.drawText(camera.getRelativeX(this.cells[i].x), camera.getRelativeY(this.cells[i].y), this.cells[i].hp, "serif", this.cells[i].ysize, "red");
            }
        }
        this.layers = [];
        this.buildPlaces = [];
        this.sensorContain = function (array, element) {
            for (let i = 0; i < array.length; i++) {
                if (array[i].x == element.x && array[i].y == element.y) {
                    return true;
                }
            }
            return false;
        }
        this.visible = false;
        this.canCollide = false;
        this.cellCollide = function (cell, heading) {
            switch (heading) {
                case "left":
                    return game.collide(game.objects, { x: cell.x - 1, y: cell.y + 1, xsize: cell.xsize + 1, ysize: cell.ysize - 1 }, "moving", { property: "canCollide", value: true });
                case "right":
                    return game.collide(game.objects, { x: cell.x, y: cell.y + 1, xsize: cell.xsize + 1, ysize: cell.ysize - 1 }, "moving", { property: "canCollide", value: true });
                case "up":
                    return game.collide(game.objects, { x: cell.x + 1, y: cell.y - 1, xsize: cell.xsize - 1, ysize: cell.ysize + 1 }, "moving", { property: "canCollide", value: true });
                case "down":
                    return game.collide(game.objects, { x: cell.x + 1, y: cell.y, xsize: cell.xsize - 1, ysize: cell.ysize + 1 }, "moving", { property: "canCollide", value: true });
            }
        }
        this.cells = [new cellTypes.baseCell(this.x, this.y)];
        this.update = () => {
            this.buildPlaces = [];
            let collided = false;
            let camera = game.objects[game.findObjectWithProp(game.objects, "type", "camera")];
            if (game.pressedKeys.w) {
                collided = false;
                for (let i = 0; i < this.cells.length; i++) {
                    if (this.cellCollide(this.cells[i], "up")) { collided = true; }
                }
                if (!collided) {
                    camera.y -= this.speed;
                    this.y -= this.speed;
                    for (let i = 0; i < this.cells.length; i++) {
                        this.cells[i].y -= this.speed;
                    }
                }
            }
            if (game.pressedKeys.s) {
                collided = false;
                for (let i = 0; i < this.cells.length; i++) {
                    if (this.cellCollide(this.cells[i], "down")) { collided = true; }
                }
                if (!collided) {
                    this.y += this.speed;
                    camera.y += this.speed;
                    for (let i = 0; i < this.cells.length; i++) {
                        this.cells[i].y += this.speed;
                    }
                }
            }
            if (game.pressedKeys.a) {
                collided = false;
                for (let i = 0; i < this.cells.length; i++) {
                    if (this.cellCollide(this.cells[i], "left")) { collided = true; }
                }
                if (!collided) {
                    this.x -= this.speed;
                    camera.x -= this.speed;
                    for (let i = 0; i < this.cells.length; i++) {
                        this.cells[i].x -= this.speed;
                    }
                }
            }
            if (game.pressedKeys.d) {
                collided = false;
                for (let i = 0; i < this.cells.length; i++) {
                    if (this.cellCollide(this.cells[i], "right")) { collided = true; }
                }
                if (!collided) {
                    this.x += this.speed;
                    camera.x += this.speed;
                    for (let i = 0; i < this.cells.length; i++) {
                        this.cells[i].x += this.speed;
                    }
                }
            }
            if (this.cells.length == 0) {
                gameOver();
                console.log("a")
            }
            if (game.actualScene == "gameOver") return;
            let removede = 0;
            let startingLocX = null;
            let longMap = [];
            let removedCell = null;
            let sensored = [];
            let removedNears = null;
            let startingLocY = 0;
            for (let i = 0; i < this.cells.length; i++) {
                this.buildPlaces.unshift(...this.cells[i - removede].getAllNear());
                if (this.cells[i - removede].hp == 0) {
                    startingLocX = this.cells[i].x;
                    startingLocY = this.cells[i].y;
                    removedCell = this.cells[i];
                    this.cells.splice(i - removede, 1);
                    removede++;
                };
            }
            if (removedCell != null) {
                var cellGroups = [];
                removedNears = removedCell.getAllNear();
                for (let i = 0; i < removedNears.length; i++) {
                    if (game.collide(this.cells, removedNears[i], "boo")) {
                        cellGroups.unshift([game.collide(this.cells, removedNears[i], "object")]);
                    }
                }
                let numu = 0;
                let a = (root, cell) => {
                    let anears = cell.getAllNear();
                    for (let i = 0; i < anears.length; i++) {
                        if (game.collide(this.cells, anears[i], "boo") && !this.sensorContain(sensored, game.collide(this.cells, anears[i], "object")) && !this.sensorContain(root, game.collide(this.cells, anears[i], "object"))) {
                            root.unshift(game.collide(this.cells, anears[i], "object"));
                            sensored.unshift(game.collide(this.cells, anears[i], "object"));
                            a(root, game.collide(this.cells, anears[i], "object"));
                        }
                    }
                }
                for (let i = 0; i < cellGroups.length; i++) {
                    a(cellGroups[i], cellGroups[i][0]);
                }
                console.log(sensored);
                console.log(cellGroups);
                for (let i = 0; i < cellGroups.length; i++) {
                    longMap.push(cellGroups[i].length)
                }
                let still = cellGroups[longMap.indexOf(Math.max(...longMap))];
                let removeded = 0;
                for (let i = 0; i < cellGroups.length; i++) {
                    if (cellGroups[i - removeded] != still) {
                        cellGroups.splice(i - removeded, 1);
                        removeded++;
                    }
                }
                console.log(cellGroups);
                console.log(longMap);
                this.cells = cellGroups[0];
                this.groupDebug = cellGroups;
            }
            this.buildPlaces = this.buildPlaces.filter((obj1, i, arr) =>
                arr.findIndex(obj2 =>
                    JSON.stringify(obj2) === JSON.stringify(obj1)
                ) === i
            );

            let removed = 0;
            for (let i = 0; i < this.buildPlaces.length; i++) {
                if (game.collide(game.objects, this.buildPlaces[i - removed], "boo") || game.collide(this.cells, this.buildPlaces[i - removed], "boo")) {
                    this.buildPlaces[i].active = false;
                } else {
                    this.buildPlaces[i].active = true;
                }
            }
            if (this.cells.length == 0) {
                gameOver();
                console.log("a");
            }
            if (game.actualScene == "gameOver") return;
            

            for (let i = 0; i < this.buildPlaces.length; i++) {
                if (game.clicking) {
                    if (game.isOverlap(this.buildPlaces[i], { x: game.cursorX + camera.x, y: game.cursorY + camera.y, xsize: 2, ysize: 2 }) && this.buildPlaces[i].active) {
                        console.log(this.buildType);
                        if (new cellTypes[this.buildType](this.buildPlaces[i].x, this.buildPlaces[i].y).energyCost <= this.energy && game.showBuildArea) {
                            this.energy -= new cellTypes[this.buildType](this.buildPlaces[i].x, this.buildPlaces[i].y).energyCost;
                            this.cells.unshift(new cellTypes[this.buildType](this.buildPlaces[i].x, this.buildPlaces[i].y));
                            this.cells[0].scene = game.actualScene;
                            if (this.cells[0].start !== undefined) this.cells[0].start();
                            this.buildPlaces.splice(i, 1);
                        }
                    }
                }
            }

            for (let i = 0; i < this.cells.length; i++) {
                if (this.cells[i].update !== undefined) {
                    this.cells[i].update(this);
                }
            }
        }
    }
}
class portalFragment {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.xsize = game.girdSize;
        this.ysize = game.girdSize;
        this.scene = game.actualScene;
        this.active = false;
        this.ui = false;
        this.hasLayers = false;
        this.image = { img: null, src: null };
        this.image.src = "portalFragment.png"
        this.image.img = game.getSprite(this.image.src, game.girdSize, game.girdSize);
        this.visible = true;
        this.rotation = 0;
        this.update = () => {
            game.render(this);
            let player2 = game.objects[game.findObjectWithProp(game.objects, "type", "player")];
            let a = false;
            for (let i = 0; i < player2.cells.length; i++) {
                if (player2.cells[i].x.toFixed(0) == this.x && player2.cells[i].y.toFixed(0) == this.y) a = true;
            }
            this.active = a;
            game.render(this);
        }
        this.collectable = true;
        this.hasLayers = true;
        this.layers = [
            { src: "portalFragment.png", img: game.getSprite("portalFragment.png", this.xsize, this.ysize), type: "image" }
        ];
    }
}
class winPortal {
    constructor(x, y) {
        this.x = x;
        this.scene = game.actualScene;
        this.ui = false;
        this.y = y;
        this.ui = false;
        this.xsize = 0;
        this.ysize = 0;
        this.type = "winportal";
        this.visible = false;
        this.update = () => {
            let a = true;;
            for (let i = 0; i < this.segments.length; i++) {
                this.segments[i].update();
                game.render(this.segments[i]);
                if (!this.segments[i].active) a = false;
            }
            if (a) gameWin();
        }
        this.start = () => {
            game.objects.unshift(...this.segments);
        }
        this.name = "winportal";
        this.segments = [new portalFragment(this.x, this.y), new portalFragment(this.x + game.girdSize, this.y), new portalFragment(this.x + game.girdSize * 2, this.y) /*first*/,
        new portalFragment(this.x, this.y + game.girdSize), new portalFragment(this.x + game.girdSize, this.y + game.girdSize), new portalFragment(this.x + game.girdSize * 2, this.y + game.girdSize),//second
        new portalFragment(this.x, this.y + game.girdSize * 2), new portalFragment(this.x + game.girdSize, this.y + game.girdSize * 2), new portalFragment(this.x + game.girdSize * 2, this.y + game.girdSize * 2)
        ]

    }
}