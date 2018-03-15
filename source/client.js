var Client = {};
Client.socket = io.connect();

Client.demandeNouveauJoueur = function(){
    Client.socket.emit('nouveaujoueur');
};

Client.envoieClick = function(x,y){
  Client.socket.emit('click',{x:x,y:y});
};

Client.socket.on('nouveaujoueur',function(data){
    Jeu.ajouteNouveauJoueur(data.id,data.x,data.y);
});

Client.socket.on('tousJoueurs', function(data){
    console.log(data);
    for(var i = 0; i < data.length; i++){
        Jeu.ajouteNouveauJoueur(data[i].id,data[i].x,data[i].y);
    }
});

Client.socket.on('enleve',function(id){
    Jeu.enleveJoueur(id);
});

Client.socket.on('bouge',function(data){
    Jeu.bougeJoueur(data.id,data.x,data.y);
});