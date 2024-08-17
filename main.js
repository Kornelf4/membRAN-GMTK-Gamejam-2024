function tick() {
    game.renderWorld();
    game.updateAll();
    game.debugObjects();
    console.log(game.objects);
}

function start() {
    game.girdSize = 100;
    game.scenes = ["menu", "game1", "game2"];
    game.actualScene = "menu";
    
    game.dataBase["dirt"] = {
        rawSymbol: "#",
        src: "dirt.png",
    };
    game.objects.unshift(new game.camera(0, 0));
    game.objects.unshift(new button(500, 400, 100, 50, "red", "PLAY", function() {
        game.actualScene = "game1";
        game.rawTileMap = maps["game1"];
        let camera = game.objects[game.findObjectWithProp(game.objects, "type", "camera")];
        camera.scene = "game1";
        game.mapSizeY = maps["game1"].length;
        console.log()
        game.mapSizeX = maps["game1"][0].length;
        game.mapSizeY = 4;
        game.addTilesToObjects();
        game.objects.unshift(new player(50, 50));
    }));
    game.startAll();
    setInterval("tick()", 20);
}
start();