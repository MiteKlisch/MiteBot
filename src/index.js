const express = require('express');
const bodyParser = require('body-parser');
const verifyWebhook = require('./verify-webhook');
const messageWebhook = require('./message-webhook');
const request = require('request');


const app = express();

const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World!'));



app.get('/webhook', verifyWebhook);
app.post('/webhook', messageWebhook);


app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})