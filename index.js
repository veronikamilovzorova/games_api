const express = require('express');
const app = express(); 
const port = 8080;
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.listen(port, () => {
    console.log(`API up at: http://localhost:${port}`);
});f
