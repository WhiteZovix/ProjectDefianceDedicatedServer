// Serveur de jeu (gameServer.js)

const express = require('express');
const https = require('https');
const socketIO = require('socket.io');
const fs = require('fs');

const app = express();
const server = https.createServer({
    key: fs.readFileSync('private-key.pem'),
    cert: fs.readFileSync('public-cert.pem')
}, app);
const io = socketIO(server);

const entities = {}; // Stockage des informations sur les joueurs et les ennemis

io.on('connection', (socket) => {
    console.log('Un joueur s\'est connecté');

    socket.on('newPlayer', (data) => {
        console.log(`Nouveau joueur connecté - ID: ${socket.id}, Coordonnées: (${data.x}, ${data.y})`);
        entities[socket.id] = {
            x: data.x,
            y: data.y,
            type: 'player'
        };
        io.emit('updateEntities', entities);
    });

    socket.on('playerMove', (data) => {
        console.log(`Mouvement du joueur - ID: ${socket.id}, Nouvelles coordonnées: (${data.x}, ${data.y})`);
        entities[socket.id] = {
            x: data.x,
            y: data.y,
            type: 'player'
        };
        io.emit('updateEntities', entities);
    });

    socket.on('newEnemy', (data) => {
        console.log(`Nouvel ennemi - ID: ${data.enemyId}, Coordonnées: (${data.x}, ${data.y})`);
        entities[data.enemyId] = {
            x: data.x,
            y: data.y,
            type: 'enemy'
        };
        io.emit('updateEntities', entities);
    });

    socket.on('enemyMove', (data) => {
        console.log(`Mouvement de l'ennemi - ID: ${data.enemyId}, Nouvelles coordonnées: (${data.x}, ${data.y})`);
        entities[data.enemyId] = {
            x: data.x,
            y: data.y,
            type: 'enemy'
        };
        io.emit('updateEntities', entities);
    });

    socket.on('disconnect', () => {
        console.log(`Un joueur s'est déconnecté - ID: ${socket.id}`);
        delete entities[socket.id];
        io.emit('updateEntities', entities);
    });
});

const port = 4000;
const localhost = '192.168.1.22';

server.listen(port, localhost, () => {
    console.log(`Serveur de jeu démarré sur le port ${port}`);
});
