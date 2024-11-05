const express = require('express');
const app = express();
const port = 8080;
const swaggerUi = require('swagger-ui-express');
const yamljs = require('yamljs');
const swaggerDocument = yamljs.load('./docs/swagger.yaml');
const cors = require('cors');

app.use(express.json());
app.use(cors());

let games = [
    { id: 1, name: "Witcher 3", price: 29.99 },
    { id: 2, name: "Cyberpunk 2077", price: 59.99 },
    { id: 3, name: "Minecraft", price: 26.99 },
    { id: 4, name: "Roblox", price: 0 },
    { id: 5, name: "Starcraft", price: 0 },
    { id: 6, name: "Identity V", price: 29.99 },
    { id: 7, name: "Drivers", price: 0 },
    { id: 8, name: "Puzzle", price: 59.99 }
];


app.get('/games', (req, res) => {
    res.send(games);
});


app.get('/games/:id', (req, res) => {
    const game = games.find(g => g.id === parseInt(req.params.id));
    if (!game) {
        return res.status(404).send({ error: 'Game not found' });
    }
    res.send(game);
});


app.post('/games', (req, res) => {
    const newId = games.length ? Math.max(...games.map(g => g.id)) + 1 : 1;
    const game = {
        id: newId,
        name: req.body.name,
        price: req.body.price
    };
    games.push(game);
    res.status(201)
        .location(`${getBaseUrl(req)}/games/${game.id}`)
        .send(game);
});


app.put('/games/:id', (req, res) => {
    const gameId = parseInt(req.params.id);
    const gameIndex = games.findIndex(g => g.id === gameId);
    
    if (gameIndex === -1) {
        return res.status(404).send({ error: 'Game not found' });
    }

    
    games[gameIndex] = { ...games[gameIndex], ...req.body };
    res.send(games[gameIndex]);
});


app.delete('/games/:id', (req, res) => {
    const gameId = parseInt(req.params.id);
    const gameIndex = games.findIndex(g => g.id === gameId);
    
    if (gameIndex === -1) {
        return res.status(404).send({ error: 'Game not found' });
    }
    
    games.splice(gameIndex, 1);
    res.status(204).send("No Content");
});


function getBaseUrl(req) {
    return (req.connection && req.connection.encrypted ? 'https' : 'http') + '://' + req.headers.host;
}


app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
    console.log(`API up at: http://localhost:${port}`);
});
