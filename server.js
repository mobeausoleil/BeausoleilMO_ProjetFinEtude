const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);

app.use('/lib',express.static(__dirname + '/lib'));
app.use('/css',express.static(__dirname + '/css'));
app.use('/source',express.static(__dirname + '/source'));
app.use('/assets',express.static(__dirname + '/assets'));
app.use('/assets',express.static(__dirname + '/views'));

app.get('/',function(req,res){
    res.render(__dirname+'/views/accueil.ejs');
});

app.get('/jeu',function(req,res){
    res.sendFile(__dirname+'/index.htm');
});

server.listen(8081,function(){
    console.log('Écoute sur le port '+server.address().port);
});

//////////////

server.dernierJoueurID = 0;

io.on('connection',function(socket){
    socket.on('nouveaujoueur',function(){
        socket.joueur = {
            id: server.dernierJoueurID++,
            x: randomInt(100,400),
            y: randomInt(100,400)
        };
        socket.emit('tousJoueurs',getTousLesJoueurs());
        socket.broadcast.emit('nouveaujoueur',socket.joueur);

        socket.on('click',function(data){
            console.log('click sur '+data.x+', '+data.y);
            socket.joueur.x = data.x;
            socket.joueur.y = data.y;
            io.emit('bouge',socket.joueur);
        });

        socket.on('disconnect',function(){
            io.emit('enleve',socket.joueur.id);
        });
    });
});

function getTousLesJoueurs(){
    var joueurs = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var joueur = io.sockets.connected[socketID].joueur;
        if(joueur) joueurs.push(joueur);
    });
    return joueurs;
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}