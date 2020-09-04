const express = require ('express');

const PingController = require('./controllers/PingPongController')

const routes = express.Router();

routes.get('/v1/ping', PingController.index);

module.exports = routes; 

