"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var express = require('express');
var db = require('../db/index');
var bodyParser = require('body-parser');
var router = express.Router();
router.get('/listaTorneos', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var results, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, db.all()];
            case 1:
                results = _a.sent();
                res.json(results);
                return [3 /*break*/, 3];
            case 2:
                e_1 = _a.sent();
                console.log(e_1);
                res.sendStatus(500);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/getTorneo', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var results, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log("esto trae el body get torneo " + req.body.idtorneo);
                return [4 /*yield*/, db.one(req.body.idtorneo)];
            case 1:
                results = _a.sent();
                res.json(results);
                return [3 /*break*/, 3];
            case 2:
                e_2 = _a.sent();
                console.log(e_2);
                res.sendStatus(500);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router["delete"]('/:id', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var results, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, db.borrar(req.params.id)];
            case 1:
                results = _a.sent();
                res.json(results);
                return [3 /*break*/, 3];
            case 2:
                e_3 = _a.sent();
                console.log(e_3);
                res.sendStatus(500);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/insertarTorneo', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var jugadores, matriz, cantidadj, json, idtorneo, arreglopartidas, a, b, partidas, i, idpartida, llave, i, idpartida, llave, i, x, j, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                jugadores = req.body.jugadores;
                matriz = new Array();
                cantidadj = jugadores.length;
                json = { 406: "error con comunicación a bd" };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 15, , 16]);
                if (!(cantidadj % 2 == 0)) return [3 /*break*/, 14];
                return [4 /*yield*/, db.insertar(req.body.nombre, req.body.llaves, req.body.url, req.body.idjuego)];
            case 2:
                idtorneo = _a.sent();
                arreglopartidas = new Array();
                jugadores.sort(function (a, b) {
                    return (Math.random() - 0.5);
                });
                a = -2, b = -1;
                partidas = cantidadj / 2;
                i = 0;
                _a.label = 3;
            case 3:
                if (!(i < partidas)) return [3 /*break*/, 7];
                a = a + 2;
                b = b + 2;
                console.log("------------torneo:" + idtorneo);
                return [4 /*yield*/, db.insertarPartida(idtorneo)];
            case 4:
                idpartida = _a.sent();
                console.log("------------partida :" + idpartida);
                return [4 /*yield*/, db.insertarLlave(jugadores[a], jugadores[b], idpartida)];
            case 5:
                llave = _a.sent();
                arreglopartidas.push(Number(idpartida));
                _a.label = 6;
            case 6:
                i++;
                return [3 /*break*/, 3];
            case 7:
                partidas = partidas / 2;
                matriz.push(arreglopartidas);
                _a.label = 8;
            case 8:
                if (!(partidas >= 1)) return [3 /*break*/, 14];
                arreglopartidas = new Array();
                i = 0;
                _a.label = 9;
            case 9:
                if (!(i < partidas)) return [3 /*break*/, 13];
                console.log("while idpartida:" + idpartida);
                return [4 /*yield*/, db.insertarPartida(idtorneo)];
            case 10:
                idpartida = _a.sent();
                return [4 /*yield*/, db.insertarLlave(6, 6, idpartida)];
            case 11:
                llave = _a.sent();
                arreglopartidas.push(Number(idpartida));
                _a.label = 12;
            case 12:
                i++;
                return [3 /*break*/, 9];
            case 13:
                partidas = partidas / 2;
                matriz.push(arreglopartidas);
                return [3 /*break*/, 8];
            case 14:
                for (i = 1; i < matriz.length; i++) {
                    x = 0;
                    for (j = 0; j < matriz[i].length; j++) {
                        console.log("esto tiene la matriz" + matriz);
                        db.controlTorneo(matriz[i][j], matriz[i - 1][x], matriz[i - 1][x + 1]);
                        x += 2;
                    }
                }
                json = { "estado": 201, "torneo": idtorneo, "partidas": matriz };
                res.json(json);
                return [3 /*break*/, 16];
            case 15:
                e_4 = _a.sent();
                console.log(e_4);
                res.sendStatus(500);
                return [3 /*break*/, 16];
            case 16: return [2 /*return*/];
        }
    });
}); });
module.exports = router;
