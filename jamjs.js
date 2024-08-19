let game = {
    canvas: document.getElementById("canvas"),
    objects: [], //1d
    dataBase: {},
    rawTileMap: [], //2d, set it every scene change
    girdSize: 50, //In pixel. Size of every tile
    mapSizeX: 50, //In girdSize
    mapSizeY: 50, //In girdSize
    canvasX: null,
    canvasY: null,
    clicking: false,
    cursorX: 200,
    cursorY: 200,
    pressedKeys: {},
    //Every tile name have to be listed is database, and need rawSymbol propery to find it from rawTileMap
    scenes: [], //"menu", "playing" (can't be two same)
    actualScene: null, //"menu", "playing" (must be set first)
    findActualSceneI: function (sceneName) {
        for (let i = 0; i < game.scenes.length; i++) {
            if (game.scenes[i] == sceneName) {
                return i;
            }
        }
        console.error(new ReferenceError("Scene not found: " + sceneName + " -> returned with false"));
        return false;
    },
    debugObjects: function() {
        for(let i = 0; i <game.objects.length; i++) {
            if(game.objects[i].scene != game.actualScene || game.objects[i].type == "camera") continue;
            ctx.fillStyle = "black";
            ctx.fillRect(game.objects[i].x, game.objects[i].y, 10, 10);
            ctx.fillRect(game.cursorX, game.cursorY, 5, 5);
        }
    },
    camera: function (x, y) { //add this to the objects. Used in rendering.
        this.x = x;
        this.y = y;
        this.canCollide = false;
        this.xsize = parseInt(game.canvas.width);
        this.ysize = parseInt(game.canvas.height);
        this.layers = [];
        this.type = "camera";
        this.scene = game.actualScene;
        this.rotation = 0;
        this.hasLayers = true;
        this.getRelativeX = (objX) => {
            return objX - this.x;
        }
        this.getRelativeY = (objY) => {
            return objY - this.y;
        }
    },
    tile: function (x, y, name) {
        this.x = x;
        this.y = y;
        this.xsize = game.girdSize;
        this.ysize = game.girdSize;
        this.type = "tile";
        this.hasLayers = false;
        this.scene = game.actualScene;
        this.name = name;
        this.visible = true;
        this.update = function() {
            game.render(this);
        }
        this.scene = game.actualScene;
        if (game.dataBase[name] === undefined) {
            console.error(new ReferenceError("Tile properties not found in dataBase. Tile name: " + name + "   -> Skipped tile generation"));
        } else {
            for (let i in game.dataBase[name]) {
                this[i] = game.dataBase[name][i]; //Tiles must need src property, and can be extended with custom functions and properties
            }
            this.image = { img: null, src: null };
            this.image.src = game.dataBase[name].src;
            this.image.img = game.getSprite(this.image.src, game.girdSize, game.girdSize);
        }
    },
    findTileName: function (symbol) {
        for (let i in game.dataBase) {
            if (game.dataBase[i].rawSymbol == symbol) {
                return i;
            }
        }
        console.error(new ReferenceError("TileSymbolReference not found in database. Be sure the right tile reference heve the property: rawSymbol: " + symbol + "   -> Returning"));
    },
    addTilesToObjects: function () { //call when scene switching
        if (game.rawTileMap.length != game.mapSizeY || game.rawTileMap[0].length != game.mapSizeX) {
            console.error(new ReferenceError("Map y and x size must be same with the rawTileMap's size     -> returning"));
            //return;
        }
        for (let i = 0; i < game.rawTileMap.length; i++) {
            for (let j = 0; j < game.rawTileMap[i].length; j++) {
                let tile = game.rawTileMap[i][j];
                if(tile == "0") continue;
                let tileName = game.findTileName(tile);
                game.objects.unshift(new game.tile(j * game.girdSize, i * game.girdSize, tileName));
            }
        }
    },
    nextScene: function (step) {
        let ind = game.findActualSceneI(game.actualScene);
        if (!ind) return;
        for (let i = 0; i < step; i++) {
            if (ind != game.scenes.length - 1) {
                ind++;
            } else {
                ind = 0;
            }
        }
        game.actualScene = game.scenes[ind];
    },
    background: [], //2d
    isOverlap: function (obj1, obj2) { //must need x, y, xsize, ysize property
        if (obj1.x === undefined || obj1.y === undefined || obj1.xsize === undefined || obj1.ysize === undefined || obj2.x === undefined || obj2.y === undefined || obj2.xsize === undefined || obj2.ysize === undefined) return false;
        return obj1.x < obj2.x + obj2.xsize &&
            obj1.x + obj1.xsize > obj2.x &&
            obj1.y < obj2.y + obj2.ysize &&
            obj1.y + obj1.ysize > obj2.y;
    },
    getSprite: function (src, width, height) { //use this to create img property from src
        let img = new Image(width, height);
        img.src = src;
        return img;
    },
    animation: function (src, isActive = true) { //src is file name
        this.type = "flipbook";
        this.active = isActive;
        this.img = game.getSprite(src)
    },
    drawImage: function (image, x, y, width, height, angle, clipX, clipY, clipWidth, clipHeight) { //in deg
        ctx.save();
        ctx.translate(x + width / 2, y + height / 2);
        ctx.rotate(angle * Math.PI / 180);
        ctx.fillStyle = "black";
        //ctx.fillRect(-width / 2, -height / 2, width, height);
        ctx.drawImage(image, -width / 2, -height / 2, width, height);
        ctx.restore();
    },
    clipImage: function (image, clipX, clipY, clipWidth, clipHeight) {
        /*const canvas = document.createElement('canvas');
        document.getElementById("body").removeChild(document.getElementById("body").lastChild);
        document.getElementById("body").appendChild(canvas);
        canvas.crossorigin="anonymous";
        canvas.crossOrigin="Anonymous";
        canvas.width = clipWidth;
        canvas.height = clipHeight;
        let img = image;
        //img.crossOrigin = "Anonymous";
        const ctx2 = canvas.getContext('2d');
        ctx2.clearRect(0, 0, clipWidth, clipHeight);
        ctx2.drawImage(img, clipX, clipY, clipWidth, clipHeight, 0, 0, clipWidth, clipHeight);
        return canvas.toDataURL();*/
    },
    updateMousePosition: function (e) {
        if (game.canvas.clicked == true) {
            game.clicking = !true;
        } else {
            game.clicking = !false;
        }
        let camera = game.objects[game.findObjectWithProp(game.objects, "type", "camera")];
        if (camera === undefined) {
            //console.error(new ReferenceError("Failed to update mouse position (can't found camera object)   -> returning"));
            return;
        }
        /*let rect = game.canvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        x += camera.x;
        y += camera.y;
        game.cursorX = x.toFixed(0);
        game.cursorY = y.toFixed(0);*/
    },
    drawText: function(x, y, text, fontStyle, fontSize, color) {
        let camera = game.objects[game.findObjectWithProp(game.objects, "type", "camera")];
        ctx.fillStyle = color;
        ctx.font = (fontSize).toString()+"px "+fontStyle;
        ctx.fillText(text, x, y + fontSize);
    },
    render: function (obj) { //Draw an objects layers. Layers can be animaions (flipbook: all the frames in one long image)(of the animation not active, draw the first frame), images. 
        let camera = game.objects[game.findObjectWithProp(game.objects, "type", "camera")];
        if(obj.ui == true) {
            var calculatedX = obj.x;
            var calculatedY = obj.y;
        } else {
            var calculatedX = camera.getRelativeX(obj.x);
            var calculatedY = camera.getRelativeY(obj.y);
        }
        
        if(obj == camera) return;
        if (!game.isOverlap(obj, camera) && obj.ui == false) return; //do not draw when cant see the object
        if (camera === undefined) {
            console.error(new ReferenceError("Camera object can't be found. Be cure you have a canera object or an object with type: camera, x, y property and getRelativeX() and getRelativeY() methodx. -> Returning. Didn't rendered"));
            return;
        }
        if(!obj.visible) return;
        if (obj.hasLayers == true) {
            for (let i = 0; i < obj.layers.length; i++) {
                if(obj.layers[i].relX !== undefined) {
                    calculatedX += obj.layers[i].relX;
                }
                if(obj.layers[i].relY !== undefined) {
                    calculatedY += obj.layers[i].relY;
                }
                if (obj.layers[i].type == "flipbook") { //{type: "flipbook",active: true, img: img, rotation: 0, frames: 3, timing: 10, phase: 0; actualFrameIndex, invert: false, sine: false}
                    let actualLayer = obj.layers[i];
                    if (actualLayer.active == true) {
                        actualLayer.phase++;
                        if (actualLayer.phase == actualLayer.timing && actualLayer.inverse == false) {
                            actualLayer.phase = 0;
                            actualLayer.actualFrameIndex++;
                            if (actualLayer.actualFrameIndex == actualLayer.frames - 1) {
                                if (actualLayer.sine == true) {
                                    actualLayer.inverse = true;
                                } else {
                                    actualLayer.actualFrameIndex = 0;
                                }
                            }
                        }
                        if (actualLayer.phase == actualLayer.timing && actualLayer.inverse == true) {
                            actualLayer.phase = 0;
                            actualLayer.actualFrameIndex--;
                            if (actualLayer.actualFrameIndex == 0) {
                                if (actualLayer.sine == true) {
                                    actualLayer.inverse = false;
                                } else {
                                    actualLayer.actualFrameIndex = actualLayer.frames - 1;
                                }
                            }
                        }
                        //let frameImgSrc = game.clipImage(actualLayer.img, actualLayer.actualFrameIndex * obj.xsize, 0, obj.xsize, obj.ysize);
                        let frameImg = game.getSprite(obj.name + obj.layers[i].name + obj.layers[i].actualFrameIndex + ".png", obj.xsize, obj.ysize);
                        game.drawImage(frameImg, calculatedX, calculatedY, obj.xsize, obj.ysize, obj.rotation);
                    } else {
                        let frameImgSrc = game.clipImage(actualLayer.img, 0, 0, obj.xsize, obj.ysize);
                        let frameImg = new Image(obj.xsize, obj.ysize);
                        frameImg.src = frameImgSrc;
                        game.drawImage(frameImg, calculatedX, calculatedY, obj.xsize, obj.ysize, obj.rotation);
                    }
                } else if (obj.layers[i].type == "image") {
                    game.drawImage(obj.layers[i].img, calculatedX, calculatedY, obj.xsize, obj.ysize, obj.rotation);
                } else if (obj.layers[i].type == "text") {
                    game.drawText(calculatedX, calculatedY, obj.layers[i].text, obj.layers[i].style, obj.layers[i].size, obj.layers[i].color);
                } else if (obj.layers[i].type == "filled") {
                    ctx.fillStyle = obj.layers[i].color;
                    ctx.fillRect(calculatedX, calculatedY, obj.xsize, obj.ysize);
                }
                if(obj.layers[i].relX !== undefined) {
                    calculatedX -= obj.layers[i].relX;
                }
                if(obj.layers[i].relY !== undefined) {
                    calculatedY -= obj.layers[i].relY;
                }
            }
        } else { //image: {img: img, src: image.png, rotation: 0}
            if (obj.image === undefined) {
                console.error(new ReferenceError("Cant render object withuot image or layers. Objects name: " + obj.name + "   -> Returning"));
                return;
            }
            game.drawImage(obj.image.img, camera.getRelativeX(obj.x), camera.getRelativeY(obj.y), obj.xsize, obj.ysize, obj.rotation);
        }
    },
    updateAll() {
        for(let i = 0; i < game.objects.length; i++) {
            if(game.objects[i].update !== undefined && game.objects[i].scene == game.actualScene) {
                game.objects[i].update();
            }
        }
    },
    startAll() {
        for(let i = 0; i < game.objects.length; i++) {
            if(game.objects[i].start !== undefined) {
                game.objects[i].start();
            }
        }
    },
    renderWorld: function () { //Optional. Call it every tick to render all the objects in the actual scene.
        ctx.fillStyle = "lightblue";
        ctx.fillRect(0, 0, parseInt(game.canvas.width), parseInt(game.canvas.height));
        for (let i = 0; i < game.objects.length; i++) {
            if (game.objects[i].scene == game.actualScene && game.objects[i].type != "camera") {
                game.render(game.objects[i]);
            }
        }
    },
    deleteObject: function(filter, type) {
        let removed = 0;
        switch(filter) {
            case "index":
                game.objects.splice(type);
                removed++;
                break;
            case "withProp":
                for(let i = 0; i < game.objects.length; i++) {
                    if(game.objects[i][type.prop] == type.value) {
                        game.objects.splice(i - removed);
                        removed++;
                    }
                }
                break;
            case "firstWithProp":
                for(let i = 0; i < game.objects.length; i++) {
                    if(game.objects[i][type.prop] == type.value) {
                        game.objects.splice(i - removed);
                        removed++;
                        break;
                    }
                }
                break;
        }
    },
    collide: function (array, obj, returntype, filter) { //compare all the object collisions in the given array with the given objects
        let a = false; //detected collision
        let collides = []; //used in multiple collision detection
        for (let i = 0; i < array.length; i++) {
            if (array[i] === obj) continue;
            if(array[i].type == "camera") continue;
            if(array[i].scene != obj.scene && obj.scene !== undefined) {
                /*console.log(obj.constructor.name);
                console.log(typeof array[i])*/
                continue;
            }
            if (array[i].canCollide == false) continue;
            if (game.isOverlap(obj, array[i])) {
                if (returntype == "boo") {
                    if(obj.constructor.name == "virus") {
                        
                    }
                    return true; 
                }; //Is collided with anything?
                if(returntype == "moving" && !array[i].collectable) return true;
                if (returntype == "object") return array[i]; //What is this colliding?
                if((returntype == "objectsorted" &&  array[i][filter.property] == filter.value) && array[i][filter.property] !== undefined) return array[i];
                if (returntype == "multi") collides.unshift(array[i]);  //What is this colliding? (return the array of collided objects)
                if ((returntype == "sorted" && array[i][filter.property] == filter.value) && array[i][filter.property] !== undefined) return true; //The collided object has the filtered property with value?
            } else {
                if (returntype == "boo") //return false;
                if (returntype == "object" || returntype == "sorted") {
                    //console.error(new ReferenceError("Warning! Can not return object from collide when not overlap. Try another return type. Actual return type: " + returntype + " -> returned false"));
                    //return false;
                }
            }
        }
        if(returntype == "multi") {
            return collides;
        }
        return false;
    },
    findObjectWithProp: function (array, property, value) { //get the first with the given property and value, and return with the index
        for (let i = 0; i < array.length; i++) {
            if (array[i][property] == value) return i;
        }
        return -1;
    }
};
let ctx = game.canvas.getContext("2d");
let rect = game.canvas.getBoundingClientRect();
game.canvasX = (game.canvas.getBoundingClientRect().left).toFixed(5);
game.canvasY = (game.canvas.getBoundingClientRect().top).toFixed(5);
game.canvas.onclick = function() {
    game.clicking = !true;
};
window.onmousemove = function(e) {
    let camera = game.objects[game.findObjectWithProp(game.objects, "type", "camera")];
    game.cursorX = (e.clientX - game.canvasX) / (rect.right - game.canvasX) * parseFloat(game.canvas.width); // /1.68
    game.cursorY = (e.clientY - game.canvasY) / (rect.bottom - game.canvasY) * parseFloat(game.canvas.height); // //1.68
}
window.addEventListener("keydown", function (e) {
    game.pressedKeys[e.key.toLowerCase()] = true;
}, false);
window.addEventListener("keyup", function (e) {
    delete game.pressedKeys[e.key.toLowerCase()];
}, false);
game.canvas.addEventListener("mousedown", function (e) {
    game.updateMousePosition(e);
});
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}
/*
Description of all:
Properties:
    canvas: HTML element reference. You need a canvas in HTML with id "canvas"
    objects: an array that contains all the objects in your game (yes, in all the scenes. You heve to set scene property to separate this)
    dataBase: that an object in you can set the defult properties of the game objects. For example the max image path, hp and the size of the player character. You have to set the tile references there
    rawTileMap: 2d array map for the static objects ofthe actual scene. Update this in every scene change, and then call game.addTilesToObjects(). Examle below. (0 is void)
        [
        [#, #, #, #, #, #, #],
        [#, #, 0, 0, 0, #, #],
        [#, _, 0, 0, 0, _, #],
        [#, #, 0, 0, 0, #, #],
        [#, #, #, #, #, #, #]
        ]
        brickWallTile: {rawSymbol: "#"}
        lavaTile: {rawSymbol: "_"}
    girdSize: size of all tile. You have to set this in the start of the game,
    mapSizeX,
    mapSizeY: lengths of rawTile map. You have to set this in every scene set
    clicking: true, if the player clicking on the canvas
    cursorX, cursorY: the cursor's absolute position. Updated when clicking.
    pressedKeys: Contains the pressed keys in the moment with value true
    scenes: an array of the scene names. in order if possible (Set it in the start of the game)
    actualScene: Automatically setted when called nextScene(step), in the start of the game and the step will be the index in scenes. If not null it step in the scenes by the given number. if it reach max it jump to the first
    findActualSceneI: Returns index of the scene from the scenes with the given name
    camera(): instance function to create the default camera. Add this to the objects in the start of the game. (you can extend this with camera.call(this, x, y) in your class function)
    tile(): tile constructor function. Used in tile generation.
    findTileName(): Finds the rigth tile name in dataBase from symbol. Returns the name
    addTilesToObjects(): object generator function. Call it in every scene set
    nextScene(): Sets actualScene. In the start of the game and the step will be the index in scenes. If not null it step in the scenes by the given number. if it reach max it jump to the first
    isOverlap(): checks AABB collision. Use in rectangles, to get overlaping (they need x, y, xsize, ysize, property)
    getSprite(): returns with a drawable image object.
    drawImage(): draws the given image that can be rotated.
    clipImage(): Used in animation process.
    updateMousePosition(): Updates mose position and clicking. Called by event listeners.
    render(): renders the given object.
                        hasLayers?
            false                               true
        Draw a single image                     isFlipbook?
        from the image property     true                            false
                                    clip flipbook and hande            draw a single image from the layers img property
                                    animation
    renderWorld(): Renders all the objects in the actual scene. Call in every tick
    collide(): returns with overlap results. See the function for more
    findObjectWithProp(): finds the object in an array, with the given property with the given valiue. Returns with index. Returns -1 if not found.


Must be called/setted in start():
        rawTileMap (if you want it empty just set it [[]])
        dataBase (with the tiles and objects custom properties)
        add custom objects for example player, enemies. Set scene propery to the actual scene
        girdSize (in pixel)
        set mapSizes based on the rawTileMap
        set scenes
        set actualScene manual or nextScene(sceneIndex)
        addCamera to objects
        addTilesToObjects() if you have rawTileMap
        startAll() call the objects start function if it exist

Must be calle/setted in every tick:
        renderWorld
        updateAll() call the objects update function if it exist

Must be called/setted in every scene set:
        set the new rawTileMap
        set the new map sizes
        canera's and player's scene property
        addTilesToObjects()

ExampleGameObject:
{
x: 50,
y: 50,
xsize: 20,
ysize: 20,
weapon: "sword";
type: "player",
name: "bluePlayer",
hasLayers: true,
start: function() {
    this.hp = game.dataBase[this.name].hp;
},
update: function() {
    if(game.pressedKeys.w) this.y -= 5;
    if(game.pressedKeys.s) this.y += 5;
    if(game.pressedKeys.a) this.x -= 5;
    if(game.pressedKeys.d) this.x += 5;

    this.layers[1].scr = this.weapon + ".png";
    this.layers[1].img = game.getSprite(this.layers[1].scr, this.xsize, this.ysize);
},
layers: [
    {type: "flipbook", src: "idleAnim.png", img: game.getSprite(this.src, this.xsize, this.ysize), timing: 10, frames: 5, phase: 0, inverse: false, sine: false, actualFrameIndex: 0},
    {type: "image", scr: "sword.png", img: game.getSprite(this.src, this.xsize, this.ysize)}
]
}
*/