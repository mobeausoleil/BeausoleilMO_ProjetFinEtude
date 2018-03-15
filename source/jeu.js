var jeu;
var playerMap = {};
jeu = new Phaser.Game(640, 400, Phaser.AUTO, document.getElementById('jeu'));

var Jeu = {};

Jeu.init = function(){
    jeu.stage.disableVisibilityChange = true;
}

Jeu.preload = function() {
    /*jeu.load.tilemap('map', '/assets/map/example_map.json', null, Phaser.Tilemap.TILED_JSON);
    jeu.load.spritesheet('tileset', '/assets/map/tilesheet.png',32,32);*/
    jeu.load.spritesheet("fondJeu","/assets/map/sprite-sol.png", 80, 80);
    jeu.load.spritesheet('perso','/assets/sprites/perso.png', 64,62);
}

Jeu.create = function(){
    /*var map = jeu.add.tilemap('map');
    map.addTilesetImage('tilesheet', 'tileset');
    var layer;
    for(var i = 0; i < map.layers.length; i++) {
        layer = map.createLayer(i);
    }
    layer.inputEnabled = true;*/

   var matriceJeu= [0, 0, 1, 2, 2, 2, 0, 1,
        0, 0, 0, 0, 2, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 2,
        2, 2, 0, 0, 1, 0, 0, 0,
        2, 0, 0, 1, 1, 2, 0, 1];

        var caseJeu, posX, posY, typeCase;
        var map = [];

        for (var i = 0; i < 40; i++) {
            posX= (i%8) * 80;
            posY= Math.floor(i/8)* 80;
            typeCase = matriceJeu[i];

            caseJeu = jeu.add.image(posX, posY, "fondJeu", typeCase);
            caseJeu.inputEnabled = true;
            caseJeu.events.onInputUp.add(Jeu.getCoordinates, this);
        };

    Client.demandeNouveauJoueur();
}

Jeu.ajouteNouveauJoueur = function(id,x,y){
    playerMap[id] = jeu.add.sprite(x, y,'perso', 3);
}

Jeu.enleveJoueur = function(id){
    playerMap[id].destroy();
    delete playerMap[id];
};

Jeu.getCoordinates = function(layer,pointer){
    Client.envoieClick(pointer.worldX,pointer.worldY);
};

Jeu.bougeJoueur = function(id,x,y){
    var joueur = playerMap[id];
    var distance = Phaser.Math.distance(joueur.x ,joueur.y, x, y);
    var duration = distance*10;
    var tween = jeu.add.tween(joueur);
    tween.to({x:x,y:y}, duration);
    tween.start();
};

jeu.state.add("Jeu", Jeu);
jeu.state.start("Jeu");