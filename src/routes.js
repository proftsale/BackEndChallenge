const express = require("express");

const PingController = require("./controllers/PingPongController");
const NumeroNarcisista = require("./controllers/NumeroNarcisistaController");
const QualAMusicaController = require("./controllers/QualAMusicaController");
const ReestruturandoDadosController = require("./controllers/ReestruturandoDadosController")

const routes = express.Router();

routes.get("/v1/ping", PingController.index);

routes.get("/v1/narcisista/:numero", NumeroNarcisista.index);

routes.get("/v1/musica/:localizacao", QualAMusicaController.index);

routes.get("/v1/vendas/", ReestruturandoDadosController.index);

module.exports = routes;
