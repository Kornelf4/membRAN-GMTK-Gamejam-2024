function addBubbles(num) {
    if(game.actualScene == "menu") return;
    for(let i = 0; i < num; i++) {
        game.objects.unshift(new bubble(getRndInteger(0, maps[game.actualScene][0].length * game.girdSize), getRndInteger(0, maps[game.actualScene].length * game.girdSize)));
    }
}
function tick() {
    game.renderWorld();
    addBubbles(2);
    game.updateAll();
}

function start() {
    game.girdSize = 100;
    game.scenes = ["menu", "game1", "game2"];
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
    game.objects.unshift(new button(500, 400, 100, 50, "red", "PLAY", function() {
        game.actualScene = "game1";
        game.rawTileMap = maps["game1"];
        let camera = game.objects[game.findObjectWithProp(game.objects, "type", "camera")];
        camera.scene = "game1";
        game.mapSizeY = maps["game1"].length;
        game.mapSizeX = maps["game1"][0].length;
        game.mapSizeY = 4;
        game.addTilesToObjects();
        game.objects.unshift(new player(300, 350));
        game.objects.unshift(new bubble(300, 350));
    }));
    game.startAll();
    setInterval("tick()", 20);
}
start();