const express = require ('express');

const PingController = require('./controllers/PingPongController');
const NumeroNarcisista = require('./controllers/NumeroNarcisistaController');

const routes = express.Router();

routes.get('/v1/ping', PingController.index);

routes.get('/v1/narcisista/:numero', NumeroNarcisista.index);

module.exports = routes; 

