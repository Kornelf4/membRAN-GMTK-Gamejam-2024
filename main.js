function addBubbles(num) {
    if (game.actualScene == "menu") return;
    for (let i = 0; i < num; i++) {
        game.objects.unshift(new bubble(getRndInteger(0, maps[game.actualScene][0].length * game.girdSize), getRndInteger(0, maps[game.actualScene].length * game.girdSize)));
    }
}
game.matterAdding = 0;
function addMatter() {
    if (game.actualScene == "menu") return;
    game.matterAdding++
    if (game.matterAdding == 50) {
        game.matterAdding = 0;
        game.objects.push(new organicMatter(getRndInteger(0, maps[game.actualScene][0].length * game.girdSize), getRndInteger(0, maps[game.actualScene].length * game.girdSize), getRndInteger(10, 40)));
        game.objects[game.objects.length - 1].start();
    }
}
function gameOver() {
    game.actualScene = "gameOver";
    game.objects = [new game.camera(0, 0)];
    game.objects.unshift(new updatedText(200, 200, 60, "red", function() {this.layers[0].text = "YOU EXTRICTED"}))
    game.objects.unshift(new updatedText(200, 280, 50, "red", function() {this.layers[0].text = "reload the page to play agin"}))
    console.log(game.objects);
}
function spawnViruses() {
    if (game.actualScene == "menu") return;
    if (getRndInteger(0, 50) > 5) return;
    game.objects.push(new virus(getRndInteger(0, maps[game.actualScene][0].length) * game.girdSize, getRndInteger(0, maps[game.actualScene].length) * game.girdSize, getRndInteger(0, 4)));
    game.objects[game.objects.length - 1].start();
}
function tick() {
    game.renderWorld();
    if (game.actualScene != "gameOver") {
        addBubbles(2);
        spawnViruses();
        addMatter();
    }
    for (let i = 0; i < game.objects.length; i++) {
        if (game.objects[i].type == "food") {
            game.objects[i].update();
        }
    }
    game.updateAll();
}

function start() {
    game.girdSize = 75;
    game.scenes = ["menu", "game1", "game2", "gameOver"
    ];
    game.actualScene = "menu";

    game.dataBase["dirt"] = {
        rawSymbol: "#",
        src: "dirt.png",
        canColide: true
    };
    game.dataBase["deathMatter"] = {
        rawSymbol: "D",
        src: "deathMatter.png",
        canColide: true
    };
    game.objects.unshift(new game.camera(0, 0));
    game.objects.unshift(new button(500, 400, 100, 50, "red", "PLAY", function () {
        game.actualScene = "game1";
        game.rawTileMap = maps["game1"];
        let camera = game.objects[game.findObjectWithProp(game.objects, "type", "camera")];
        camera.scene = "game1";
        game.mapSizeY = maps["game1"].length;
        game.mapSizeX = maps["game1"][0].length;
        game.mapSizeY = 4;
        game.addTilesToObjects();
        game.showBuildArea = false;
        game.objects.unshift(new player(4 * game.girdSize, 4 * game.girdSize));
        game.objects.unshift(new bubble(300, 350));
        game.objects.push(new button(20, 20, 120, 30, "lightgreen", "BUILD CELL", function () { game.showBuildArea = !game.showBuildArea }));
        game.objects.push(new sideBar(200));
        game.objects[game.objects.length - 1].start();
        game.objects.push(new updatedText(10, 400, 50, "black", function () {
            let player = game.objects[game.findObjectWithProp(game.objects, "type", "player")];
            this.layers[0].text = player.energy.toFixed(2);
            game.render(this);
        }));

    }));
    game.startAll();
    setInterval("tick()", 20);
}
start();