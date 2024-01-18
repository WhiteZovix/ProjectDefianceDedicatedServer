const axios = require('axios');
const https = require('https');

// Récupérez le nom de la salle, le nombre de joueurs et le mode de jeu à partir des arguments de ligne de commande
const roomName = process.argv[2] || 'DefaultRoom';
const maxPlayers = parseInt(process.argv[3]) || 100; // Limite par défaut à 100 joueurs
const gameMode = process.argv[4] || 'PVP'; // Mode de jeu par défaut à PVP
const backendUrl = 'https://192.168.1.33:3000'; // Remplacez par l'adresse IP de votre backend

// Configuration pour prendre en charge HTTPS
const agent = new https.Agent({
    rejectUnauthorized: false // Ignorer les erreurs de certificat (à des fins de test uniquement)
});

let roomCreated = false;

// Fonction pour créer une salle avec HTTPS
function createRoom() {
    if (!roomCreated) {
        axios.post(`${backendUrl}/createRoom`, { roomName, maxPlayers, gameMode }, { httpsAgent: agent })
            .then(response => {
                console.log(`Room created \x1b[32msuccessfully:\x1b[0m ${roomName}, Max Players: ${maxPlayers}, Game Mode: ${gameMode}`);
                console.log(`SERVER CONNECTED \x1b[32m${roomName}\x1b[0m , Max Players: ${maxPlayers}, Game Mode: ${gameMode}`);
                console.log('Waiting Connection Players ...')
                roomCreated = true;
            })
            .catch(error => {
                console.error('Error creating room:', error.message);
            });
    }

    // Appeler la fonction récursivement après un délai (ici, 1 seconde)
    setTimeout(createRoom, 1000);
}


// Fonction pour fermer la salle
function closeRoom() {
    axios.post(`${backendUrl}/closeRoom`, { roomName }, { httpsAgent: agent })
        .then(response => {
            console.log(`Room closed successfully: ${roomName}`);
            // Ajoutez d'autres actions nécessaires après la fermeture de la salle, si nécessaire
            process.exit(); // Fermer proprement l'application après avoir fermé la salle
        })
        .catch(error => {
            console.error('Error closing room:', error.message);
            process.exit(1); // Fermer l'application avec un code d'erreur en cas d'échec
        });
}

// Écoute de l'événement SIGINT (Ctrl+C)
process.on('SIGINT', () => {
    console.log('Received SIGINT. Closing the room...');
    closeRoom();
});


// Appel initial de la fonction
createRoom();
