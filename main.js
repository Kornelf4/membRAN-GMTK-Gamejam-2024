function addBubbles(num) {
    if (game.actualScene == "menu" || game.actualScene == "gameWin") return;
    for (let i = 0; i < num; i++) {
        game.objects.unshift(new bubble(getRndInteger(0, maps[game.actualScene][0].length * game.girdSize), getRndInteger(0, maps[game.actualScene].length * game.girdSize)));
    }
}
game.matterAdding = 0;
function addMatter() {
    if (game.actualScene == "menu" || game.actualScene == "gameWin") return;
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
function gameWin() {
    game.actualScene = "gameWin";
    game.objects = [new game.camera(0, 0)];
    game.objects.unshift(new updatedText(200, 200, 60, "red", function() {this.layers[0].text = "YOU WIN"}))
    game.objects.unshift(new updatedText(200, 400, 20, "red", function() {this.layers[0].text = "*the current phase of the game"}))
}
function spawnViruses() {
    if (game.actualScene == "menu" || game.actualScene == "gameWin") return;
    if (getRndInteger(0, 500) > 5) return;
    game.objects.push(new virus(getRndInteger(0, maps[game.actualScene][0].length) * game.girdSize, getRndInteger(0, maps[game.actualScene].length) * game.girdSize, getRndInteger(0, 4)));
    game.objects[game.objects.length - 1].start();
}
function tick() {
    let player2 = game.objects[game.findObjectWithProp(game.objects, "type", "player")];
    if(game.actualScene == "game1") {
        if(player2.cells=== undefined) gameOver();
    }
    game.renderWorld();
    if (game.actualScene != "gameOver" && game.actualScene != "gameWin") {
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
    if(game.actualScene == "game1") {
        player2.render();
    }
}

function start() {
    game.girdSize = 75;
    game.scenes = ["menu", "game1", "game2", "gameOver", "gameWin"
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
    game.objects.unshift(new toDrawImage(0, 0, 900, 800, "bakt.png"));
    game.objects.unshift(new game.camera(0, 0));
    game.objects.unshift(new button(600, 400, 120, 50, "red", "PLAY", function () {
        game.actualScene = "game1";
        game.rawTileMap = maps["game1"];
        let camera = game.objects[game.findObjectWithProp(game.objects, "type", "camera")];
        camera.scene = "game1";
        game.mapSizeY = maps["game1"].length;
        game.mapSizeX = maps["game1"][0].length;
        game.mapSizeY = 4;
        game.addTilesToObjects();
        game.deleteMode = false;
        game.showBuildArea = false;
        
        game.objects.unshift(new bubble(300, 350));
        game.objects.unshift(new worldBorder(-1,-1, 1, maps[game.actualScene].length * game.girdSize));
        game.objects.unshift(new worldBorder(-1,-1, maps[game.actualScene][0].length * game.girdSize, 1));
        game.objects.unshift(new worldBorder(-1,maps[game.actualScene].length * game.girdSize, maps[game.actualScene][0].length * game.girdSize, 1));
        game.objects.unshift(new worldBorder(maps[game.actualScene][0].length * game.girdSize,-1, 1, maps[game.actualScene].length * game.girdSize));
        game.objects.push(new button(20, 20, 120, 30, "lightgreen", "BUILD CELL", function () { game.showBuildArea = !game.showBuildArea }));
        game.objects.push(new button(20, 70, 150, 30, "red", "DELETE CELL", function () { game.deleteMode = !game.deleteMode }));
        game.objects.push(new sideBar(350));
        game.objects[game.objects.length - 1].start();
        game.objects.unshift(new winPortal(16 * game.girdSize, 26 * game.girdSize));
        game.objects.push(new player(4 * game.girdSize, 4 * game.girdSize));
        game.objects[0].start();
        console.log(game.objects[game.objects.length - 1]);
        game.objects.push(new updatedText(10, 400, 50, "black", function () {
            let player = game.objects[game.findObjectWithProp(game.objects, "type", "player")];
            this.layers[0].text = player.energy.toFixed(2);
            game.render(this);
        }));
    }));
    game.objects.unshift(new button(600, 450, 200, 50, "green", "how to play", function() {
        window.open("read.pdf");
    }))
    game.objects.push(new textBox(40, 40, "membRUN", 100, "green"));
    game.startAll();
    setInterval("tick()", 20);
}
window.addEventListener("click", event => {
    const audio = document.querySelector("audio");
    audio.volume = 0.06;
    //if(game.actualScene == "game1") {
        audio.play();
    //}
    
});
start();