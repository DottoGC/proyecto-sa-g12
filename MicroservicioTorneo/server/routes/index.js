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
var axios = require('axios');
var bodyParser = require('body-parser');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var jwt = require('jsonwebtoken');

var http = require('http');
var _ = require('lodash');
var logger = fs.createWriteStream('./server/log.txt', {
    flags: 'a' // 'a' means appending (old data will be preserved)
});
function addLog(newlog) {
    logger.write(newlog + "\n");
}

var auth = require('../authToken');
var http = require('http');
var _ = require('lodash');

var jugadores = new Array();
//TODO ESTO ES PARA DESENCRIPTAR TOKENS QUE SOLICITAN CONSUMIR TUS SERVICIOS DE TU MICROSERVICIO
var publicKey = fs.readFileSync('./server/routes/public.key', 'utf8');
var verifyOptions = {
    algorithms: ["RS256"],
    maxAge: "60s"
};
// ------------ listas--------------
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
router.post('/listaUsers', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var llave;
    return __generator(this, function (_a) {

        llave = req.body.llave1;

        console.log("llave: " + llave);
        axios.post('http://34.69.29.183:80/listajugadores', {
            llave: llave
        })
            .then(function (response) {
            console.log("funcion then");
            console.log("response: " + response.data.rows);
            for (var i = 0; i < response.data.rows.length; i++) {
                //console.log("for: "+i);
                jugadores.push(Number(response.data.rows[i].id));
            }
            console.log("jugadores: " + jugadores.length);
            res.send(res.json(response.data));
        })["catch"](function (e) {
            res.send(e.message);
        });
        return [2 /*return*/];
    });
}); });
router.get('/listaJuegos', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {

    var results, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, db.allJuegos()];
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
//---------------- put partidas--------------------
router.put('/partidas2/:id', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {

    return __generator(this, function (_a) {
        axios.get('http://34.69.29.183:80/jugadores')
            .then(function (response) {
            res.send(res.json(response.data));
        })["catch"](function (e) {
            res.send(e.message);
        });
        return [2 /*return*/];
    });
}); });
//---------------- put partidas--------------------
router.put('/partidas/:id', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {

    var idpartida, punteo;
    return __generator(this, function (_a) {
        try {
            idpartida = req.params.id;

            punteo = req.body.marcador;


            if (punteo[0] > punteo[1]) {
                console.log("jugador 1 ganador");
                db.setPunteo(idpartida, punteo[0], punteo[1]);
                db.getGanador(idpartida, "1");

            }
            else if (punteo[0] < punteo[1]) {
                console.log("jugador 2 ganador");
                db.setPunteo(idpartida, punteo[0], punteo[1]);
                db.getGanador(idpartida, "2");

            }
            res.json({
                201: "partida lista",
                "partida": idpartida
            });
        }
        catch (e) {
            console.log(e);
            res.sendStatus(500);
        }
        return [2 /*return*/];
    });
}); });

router.put('/partidas/:id', verifytoken, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        jwt.verify(req.jwt, publicKey, verifyOptions, function (err) {

router.put('/partidas2/:id', verifytoken, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        jwt.verify(req.token, publicKey, verifyOptions, function (err) {

            if (err) {
                //res.sendStatus(403);
                res.send("error 403");
            }
            else {

                var decoded = jwt.decode(req.jwt, { complete: true });
                var exist = validateScope(decoded.payload.scopes, 'torneos.partida.put');
                console.log(exist);
                if (exist) {
                    try {
                        var idpartida = req.params.id;
                        var punteo = req.body.marcador;
                        if (punteo[0] > punteo[1]) {
                            console.log("jugador 1 ganador");
                            db.setPunteo(idpartida, punteo[0], punteo[1]);
                            db.getGanador(idpartida, "1");
                            addLog("Partida terminada:" + idpartida + " ganador: jugador 1 (local).\n");
                        }
                        else if (punteo[0] < punteo[1]) {
                            console.log("jugador 2 ganador");
                            db.setPunteo(idpartida, punteo[0], punteo[1]);
                            db.getGanador(idpartida, "2");
                            addLog("Partida terminada:" + idpartida + " ganador: jugador 2 (visitante).\n");
                        }
                        res.json({
                            201: "partida lista",
                            "partida": idpartida
                        });
                    }
                    catch (e) {
                        console.log(e);
                        res.sendStatus(500);
                    }
                    //res.send(respuesta);
                    res.json({
                        header: decoded.header,
                        payload: decoded.payload,
                        mensaje: "post fue recibido"
                    });
                }
                else {
                    res.sendStatus(403);
                }

                var decoded = jwt.decode(req.token, { complete: true });
                try {
                    var idpartida = req.params.id;
                    var punteo = req.body.punteo;
                    if (punteo[0] > punteo[1]) {
                        console.log("jugador 1 ganador");
                        db.setPunteo(idpartida, punteo[0], punteo[1]);
                        db.getGanador(idpartida, "1");
                    }
                    else if (punteo[0] < punteo[1]) {
                        console.log("jugador 2 ganador");
                        db.setPunteo(idpartida, punteo[0], punteo[1]);
                        db.getGanador(idpartida, "2");
                    }
                    res.json({
                        201: "partida lista",
                        "partida": idpartida
                    });
                }
                catch (e) {
                    console.log(e);
                    res.sendStatus(500);
                }
                //res.send(respuesta);
                res.json({
                    header: decoded.header,
                    payload: decoded.payload,
                    mensaje: "post fue recibido"
                });

            }
        });
        return [2 /*return*/];
    });
}); });
router.get('/getTorneo', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {

    var results, e_3;

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

                e_3 = _a.sent();
                console.log(e_3);

                e_2 = _a.sent();
                console.log(e_2);

                res.sendStatus(500);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
//------------------delete torneo, users, juegos-------------------
router.post('/deleteUser', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {

        /*axios.delete('http://34.69.29.183:80/jugadores/'+req.body.id1)
        .then(function(response:AxiosResponse){
            res.send(res.json(response.data));
        }).catch(function(e:AxiosError){
            res.send(e.message);
        });*/
        funcionBorrar(req, res, function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/];
                });
            });
        }.bind(this));
      axios["delete"]('http://34.69.29.183:80/jugadores/' + req.body.id1)
            .then(function (response) {
            res.send(res.json(response.data));
        })["catch"](function (e) {
            res.send(e.message);
        });

        return [2 /*return*/];
    });
}); });
router.post('/deleteJuego', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {

    var results, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, db.borrarJuego(req.params.id)];
            case 1:
                results = _a.sent();
                res.json(results);
                return [3 /*break*/, 3];
            case 2:
                e_4 = _a.sent();
                console.log(e_4);
                res.sendStatus(500);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router["delete"]('/:id', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var results, e_5;

    return __generator(this, function (_a) {
        axios["delete"]('http://34.69.29.183:80/jugadores/' + req.body.id)
            .then(function (response) {
            res.send(res.json(response.data));
        })["catch"](function (e) {
            res.send(e.message);
        });
        return [2 /*return*/];
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

                e_5 = _a.sent();
                console.log(e_5);

                e_3 = _a.sent();
                console.log(e_3);

                res.sendStatus(500);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
//-------------------------inserts torneo, users, juego-----------------
router.post('/insertUser', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {

            nombres: req.body.nombres1,
            apellidos: req.body.apellidos1,
            correo: req.body.correo1,
            password: req.body.password1,
            administrador: req.body.administrador1
        })

        .then(function(response:AxiosResponse){
            res.send(res.json(response.data));
        }).catch(function(e:AxiosError){
            res.send(e.message);
        });*/
        funcionInsertar(req, res, function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/];
                });
            });
        }.bind(this));

            .then(function (response) {
            res.send(res.json(response.data));
        })["catch"](function (e) {
            res.send(e.message);
        });

        return [2 /*return*/];
    });
}); });
router.post('/insertJuego', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {

    var results, e_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("insert juego " + req.body.nombre);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, db.insertarJuego(req.body.nombre, req.body.url)];
            case 2:
                results = _a.sent();
                res.json(results);
                addLog("juego insertardo:" + req.body.nombre + " url: " + req.body.url + "\n");
                return [3 /*break*/, 4];
            case 3:
                e_6 = _a.sent();
                console.log(e_6);
                res.sendStatus(500);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }

    return __generator(this, function (_a) {
        axios.post('http://34.69.29.183:80/jugadores', {
            nombres: req.body.nombres,
            apellidos: req.body.apellidos,
            correo: req.body.correo,
            password: req.body.password,
            administrador: req.body.administrador1
        })
            .then(function (response) {
            res.send(res.json(response.data));
        })["catch"](function (e) {
            res.send(e.message);
        });
        return [2 /*return*/];

    });
}); });
router.post('/insertarTorneo', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {

        funcionLista(req, res, function () {
            return __awaiter(this, void 0, void 0, function () {
                var matriz, json, llave, cantidadj, idtorneo, arreglopartidas, a, b, partidas, i, idpartida, llave, i, idpartida, llave, i, x, j, e_7;

        funcionLista(function () {
            return __awaiter(this, void 0, void 0, function () {
                var matriz, json, llave, cantidadj, idtorneo, arreglopartidas, a, b, partidas, i, idpartida, llave, i, idpartida, llave, i, x, j, e_4;

                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            matriz = new Array();
                            json = { 406: "error con comunicación a bd" };
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 15, , 16]);
                            llave = req.body.llave1;
                            console.log("llave: " + llave);
                            cantidadj = jugadores.length;

                            if (!(cantidadj % 2 == 0)) return [3 /*break*/, 14];
                            //console.log("entro al if");

                            console.log("talegueo");
                            if (!(cantidadj % 2 == 0)) return [3 /*break*/, 14];
                            console.log("entro al if");

                            console.log("cantidad jugadores: " + cantidadj);
                            return [4 /*yield*/, db.insertar(req.body.nombre, req.body.llave1, req.body.url, req.body.idjuego)];
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

                            return [4 /*yield*/, db.insertarPartida(idtorneo)];
                        case 10:
                            idpartida = _a.sent();
                            return [4 /*yield*/, db.insertarLlave(0, 0, idpartida)];
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

                            fs.appendFile('./proyectosa/log.txt', "Torneo Creado:" + idtorneo + " Partidas:" + matriz.length + ".\n", function () { });
                            addLog("torneo insertardo:" + idtorneo + " partidas: " + matriz.length + "\n");
                            return [3 /*break*/, 16];
                        case 15:
                            e_7 = _a.sent();
                            console.log(e_7);

                            return [3 /*break*/, 16];
                        case 15:
                            e_4 = _a.sent();
                            console.log(e_4);

                            res.sendStatus(500);
                            return [3 /*break*/, 16];
                        case 16: return [2 /*return*/];
                    }
                });
            });
        }.bind(this));
        return [2 /*return*/];
    });
}); });
//-------------------update------------------
router.post('/updateUser', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {

        /*console.log("id: "+req.body.id1);
        axios.put('http://34.69.29.183:80/jugadores/'+req.body.id1,{

        console.log("id: " + req.body.id1);
        axios.put('http://34.69.29.183:80/jugadores/' + req.body.id1, {

            nombres: req.body.nombres1,
            apellidos: req.body.apellidos1,
            correo: req.body.correo1,
            password: req.body.password1,
            administrador: req.body.administrador1
        })

        .then(function(response:AxiosResponse){
            res.send(res.json(response.data));
        }).catch(function(e:AxiosError){
            res.send(e.message);
        });*/
        funcionUpdate(req, res, function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/];
                });
            });
        }.bind(this));

            .then(function (response) {
            res.send(res.json(response.data));
        })["catch"](function (e) {
            res.send(e.message);
        });

        return [2 /*return*/];
    });
}); });
router.post('/updateJuego', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {

    var results, e_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, db.updateJuego(req.params.id)];
            case 1:
                results = _a.sent();
                res.json(results);
                return [3 /*break*/, 3];
            case 2:
                e_8 = _a.sent();
                console.log(e_8);
                res.sendStatus(500);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
//------------------------login--------------------
router.post('/login', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        /*var correo = req.body.correo;
        var password = req.body.password;
        var a = await axios.get('http://34.69.29.183:80/login',{
            
            correo: req.body.correo1,
            password: req.body.password1,
            
        })
        .then(function(response:AxiosResponse){
            res.send(res.json(response.data));
        }).catch(function(e:AxiosError){
            res.send(e.message);
        });*/
        funcionLogin(req, res, function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/];
                });
            });
        }.bind(this));
        return [2 /*return*/];
    });
}); });

    return __generator(this, function (_a) {
        axios.put('http://34.69.29.183:80/jugadores/:' + req.body.id1, {
            nombres: req.body.nombres1,
            apellidos: req.body.apellidos1,
            correo: req.body.correo1,
            password: req.body.password1,
            administrador: req.body.administrador1
        })
            .then(function (response) {
            res.send(res.json(response.data));
        })["catch"](function (e) {
            res.send(e.message);
        });
        return [2 /*return*/];
    });
}); });
//------------------------login--------------------
router.post('/login', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var correo, password, a;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                correo = req.body.correo;
                password = req.body.password;
                return [4 /*yield*/, axios.get('http://34.69.29.183:80/login', {
                        correo: req.body.correo1,
                        password: req.body.password1
                    })
                        .then(function (response) {
                        res.send(res.json(response.data));
                    })["catch"](function (e) {
                        res.send(e.message);
                    })];
            case 1:
                a = _a.sent();
                return [2 /*return*/];
        }
    });
}); });

//--------------------pedir token---------------
/*(function() {
    var token:String = 'Basic bWljcm8tanVlZ29zOnNlY3JldC1qdWVnb3MtbWljcm8=';
    if (token) {
        axios.defaults.headers.common['Authorization'] = token;
    } else {
        axios.defaults.headers.common['Authorization'] = null;
        
    }
    console.log("token "+token);
})();*/
//var token = 'bWljcm8tanVlZ29zOnNlY3JldC1qdWVnb3MtbWljcm8=';
router.post('/token', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        /*axios.post('http://35.232.54.106/token')
        .then(function(response:AxiosResponse){
            res.send(res.json(response.data.token));
        }).catch(function(e:AxiosError){
            res.send(e.message);
        });*/
        axios.post('http://35.232.54.106/token', {}, {
            headers: {
                'Authorization': "Basic bWljcm8tanVlZ29zOnNlY3JldC1qdWVnb3MtbWljcm8="
            }
        })
            .then(function (response) {
            res.send(res.json(response.data));
        })["catch"](function (e) {
            res.send(e.message);
        });
        return [2 /*return*/];
    });
}); });
// Authorization: Bearer <token>

router.post("/generar", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        axios.post('http://35.223.103.13:3000/generar', {
            id: req.body.id,
            jugadores: req.body.jugadores
        }).then(function (response) {
            res.send(JSON.stringify(response.data));
        })["catch"](function (error) {
            res.send(error.message);
        });
        return [2 /*return*/];
    });
}); });
router.post("/simular", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        axios.post('http://35.223.103.13:3000/simular', {
            id: req.body.id,
            jugadores: req.body.jugadores
        }).then(function (response) {
            res.send(JSON.stringify(response.data));
        })["catch"](function (error) {
            res.send(error.message);
        });
        return [2 /*return*/];
    });
}); });
function validateScope(scopes, idruta) {
    var result = false;
    /*scopes.forEach(
        
        element => (element==idruta)? true: false
    
    );*/
    scopes.forEach(function (word) {
        console.log(word);
        console.log(idruta);
        if (word === idruta) {
            console.log(true);
            result = true;
        }
    });
    return result;
}

function verifytoken(req, res, next) {
    var bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        var bearerToken = bearerHeader.split(" ")[1];

        req.jwt = bearerToken;

        next();
    }
    else {
        res.sendStatus(403); //ruta o acceso prohibido
    }
}

function funcionLista(req, res, callback) {
    listarUsuarios(req, res, function () {
        return callback();
    }.bind(this));
}
function funcionInsertar(req, res, callback) {
    insertarUsuario(req, res, function () {
        return callback();
    }.bind(this));
}
function funcionUpdate(req, res, callback) {
    updateUsuario(req, res, function () {
        return callback();
    }.bind(this));
}
function funcionBorrar(req, res, callback) {
    deleteUsuario(req, res, function () {
        return callback();
    }.bind(this));
}
function funcionLogin(req, res, callback) {
    loginUsuario(req, res, function () {
        return callback();
    }.bind(this));
}
function insertarUsuario(req, res, callback) {
    console.log("verificar auth...");
    llamarServicioAuth(function (bearerToken) {
        var _this = this;
        //console.log(bearerToken);
        jwt.verify(bearerToken, publicKey, verifyOptions, function (err) {
            if (err) {
                console.log("error auth...");
                return callback();
            }
            else {
                //Logica para tirar dados......!
                console.log("llamando servicio insertar...");
                llamarServicioInsertar(req, res, bearerToken, function () {
                    return callback();
                }.bind(_this));
            }
        });
    }.bind(this));
}
function updateUsuario(req, res, callback) {
    console.log("verificar auth...");
    llamarServicioAuth(function (bearerToken) {
        var _this = this;
        //console.log(bearerToken);
        jwt.verify(bearerToken, publicKey, verifyOptions, function (err) {
            if (err) {
                console.log("error auth...");
                return callback();
            }
            else {
                //Logica para tirar dados......!
                console.log("llamando servicio update...");
                llamarServicioUpdate(req, res, bearerToken, function () {
                    return callback();
                }.bind(_this));
            }
        });
    }.bind(this));
}
function deleteUsuario(req, res, callback) {
    console.log("verificar auth...");
    llamarServicioAuth(function (bearerToken) {
        var _this = this;
        //console.log(bearerToken);
        jwt.verify(bearerToken, publicKey, verifyOptions, function (err) {
            if (err) {
                console.log("error auth...");
                return callback();
            }
            else {
                //Logica para tirar dados......!
                console.log("llamando servicio delete...");
                llamarServicioDelete(req, res, bearerToken, function () {
                    return callback();
                }.bind(_this));
            }
        });
    }.bind(this));
}
function loginUsuario(req, res, callback) {
    console.log("verificar auth...");
    llamarServicioAuth(function (bearerToken) {
        var _this = this;
        //console.log(bearerToken);
        jwt.verify(bearerToken, publicKey, verifyOptions, function (err) {
            if (err) {
                console.log("error auth...");
                return callback();
            }
            else {
                //Logica para tirar dados......!
                console.log("llamando servicio login...");
                llamarServicioLogin(req, res, bearerToken, function () {
                    return callback();
                }.bind(_this));
            }
        });
    }.bind(this));
}
function listarUsuarios(req, res, callback) {

function funcionLista(callback) {
    listarUsuarios(function () {
        return callback();
    }.bind(this));
}
function listarUsuarios(callback) {

    console.log("verificar auth...");
    llamarServicioAuth(function (bearerToken) {
        var _this = this;
        //console.log(bearerToken);
        jwt.verify(bearerToken, publicKey, verifyOptions, function (err) {
            if (err) {
                console.log("error auth...");
                return callback();
            }
            else {
                //Logica para tirar dados......!
                console.log("llamando servicio listar...");

                llamarServicioListar(req, res, bearerToken, function () {

                    return callback();
                }.bind(_this));
            }
        });
    }.bind(this));
}
function llamarServicioAuth(callback) {
    var objAuth = { 'Authorization': 'Basic bWljcm8tanVlZ29zOnNlY3JldC1qdWVnb3MtbWljcm8=' };
    var optionsAuth = {
        host: '35.232.54.106',
        path: '/token',
        method: 'POST',
        headers: objAuth
    };
    var bearerToken = "";
    console.log("->>>>>>  Consumiendo servicio de jugadores -> POST -> 35.232.54.106/Token");
    var reqAuth = http.request(optionsAuth, function (res) {
        console.log("statusCode: ", res.statusCode);
        res.on('data', function (d) {
            //console.info('POST result:'+d+'\n');
            //process.stdout.write(d+'\n');
            var data = JSON.parse(d);

            bearerToken = data.jwt;
            console.log("token: " + bearerToken);
            addLog("autenticación de token" + bearerToken + "\n");

            return callback(bearerToken);
        });
    }.bind(this));
    reqAuth.end();
}

function llamarServicioListar(req, res, bearerToken, callback) {
    var j = axios.post('http://34.69.29.183:80/listajugadores', {
        llave: req.body.llave1
    }, {
        headers: {
            'Authorization': "Bearer " + bearerToken
        }
    })
        .then(function (response) {
        console.log("->>>>>>  Consumiendo servicio de jugadores -> POST -> http://34.69.29.183:80/jugadores");

function llamarServicioListar(bearerToken, callback) {
    var objAuth = { 'Authorization': 'Bearer ' + bearerToken };
    var llave = { 'llave': '2' };
    var optionsdados = {
        host: '34.69.29.183',
        path: ':80/listajugadores',
        method: 'POST',
        headers: objAuth,
        body: llave
    };
    var j = axios.post('http://34.69.29.183:80/listajugadores', {
        llave: 2
    }, {
        headers: {
            'Authorization': "Basic " + bearerToken
        }
    })
        .then(function (response) {
        console.log("->>>>>>  Consumiendo servicio de jugadores -> POST -> http://34.69.29.183:80/listajugadores");

        for (var i = 0; i < response.data.rows.length; i++) {
            console.log("id: " + response.data.rows[i].id);
            jugadores.push(Number(response.data.rows[i].id));
        }

        //res.send(res.json(response.data));
        console.log("jugadores: " + jugadores.length);
        addLog("llamada servicio jugadores\n");
        return callback(jugadores);
    })["catch"](function (e) {
        res.send(e.message);
    });
}
function llamarServicioInsertar(req, res, bearerToken, callback) {
    console.log("llamar servicio insertar");
    axios.post('http://34.69.29.183:80/jugadores', {
        nombres: req.body.nombres1,
        apellidos: req.body.apellidos1,
        correo: req.body.correo1,
        password: req.body.password1,
        administrador: req.body.administrador1
    }, {
        headers: {
            'Authorization': "Bearer " + bearerToken
        }
    })
        .then(function (response) {
        res.send(res.json(response.data));
        console.log("si inserto");
        addLog("llamada a servicio insertar http://34.69.29.183:80/jugadores " + res.json(response.data) + "\n");
        return callback();
    })["catch"](function (e) {
        res.send(e.message);
    });
}
function llamarServicioUpdate(req, res, bearerToken, callback) {
    console.log("llamar servicio update");
    axios.put('http://34.69.29.183:80/jugadores/' + req.body.id1, {
        nombres: req.body.nombres1,
        apellidos: req.body.apellidos1,
        correo: req.body.correo1,
        password: req.body.password1,
        administrador: req.body.administrador1
    }, {
        headers: {
            'Authorization': "Bearer " + bearerToken
        }
    })
        .then(function (response) {
        res.send(res.json(response.data));
        console.log("si update");
        addLog("llamada a servicio update http://34.69.29.183:80/jugadores/id " + res.json(response.data) + "\n");
        return callback();
    })["catch"](function (e) {
        res.send(e.message);
    });
}
function llamarServicioDelete(req, res, bearerToken, callback) {
    console.log("llamar servicio delete");
    axios["delete"]('http://34.69.29.183:80/jugadores/' + req.body.id1, {
        headers: {
            'Authorization': "Bearer " + bearerToken
        }
    })
        .then(function (response) {
        res.send(res.json(response.data));
        console.log("si delete");
        addLog("llamada a servicio borrar http://34.69.29.183:80/jugadores/id" + res.json(response.data) + "\n");
        return callback();
    })["catch"](function (e) {
        res.send(e.message);
    });
}
function llamarServicioLogin(req, res, bearerToken, callback) {
    console.log("llamar servicio login");
    axios.post('http://34.69.29.183:80/login', {
        correo: req.body.correo1,
        password: req.body.password1
    }, {
        headers: {
            'Authorization': "Bearer " + bearerToken
        }
    })
        .then(function (response) {
        res.send(res.json(response.data));
        console.log("si login");
        addLog("llamada a servicio login http://34.69.29.183:80/login " + res.json(response.data) + "\n");
        return callback();
    })["catch"](function (e) {
        res.send(e.message);
    });

        console.log("jugadores: " + jugadores.length);
        return callback(jugadores);
        //res.send(res.json(response.data));
    })["catch"](function (e) {
        //res.send(e.message);
    });
    /*console.log("->>>>>>  Consumiendo servicio de jugadores -> POST -> http://34.69.29.183:80/listajugadores")
    var reqDados = http.request(optionsdados, function(res) {
        console.log("statusCode: ", res.statusCode);
        res.on('data', function(d) {
            //console.info('POST result:'+d+'\n');
            //process.stdout.write(d+'\n');
            var dresponse = JSON.parse(d);

            console.log (">>>>>>>>>>>>>>>>>>>>>>jugadores!")
            console.log(dresponse);
            
        });
    }.bind(this));
    reqDados.end();
    reqDados.on('error', function(e) {
       
        console.error(e);
    }.bind(this));*/

}
module.exports = router;
