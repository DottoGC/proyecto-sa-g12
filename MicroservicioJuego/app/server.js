const http = require('http');
const _ = require('lodash');
//SERVER CONTANTS............................................................
const hostname = '0.0.0.0';
const port = 9000;

//IMPORTS....................................................................
var express = require('express');
const { Console } = require('console');
const { randomInt } = require('crypto');
var app = express();

//Variables
var juego = [];
var jugadores = [];
var maximacasilla = 0;

var casilla = {
    numero: 0,
    tipo: "", //Tipo A:Tesoro, B:Trampa, C:Vacía
    tipo_valor:0
}

var jugador={
    nombre:"SAPROYECTO",
    punteo:0,
    casilla:0
}

var tiro = {
    dadoa: 0,
    dadob: 0
}

//SERVER START...............................................................
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  init_new_game()
});

//API.................................................................
app.get('/', (req, res) =>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.send("Server GAMES is running SA proyecto 1 del 2020...");
    res.end();
});

app.get('/generate', (req, res) =>{
    console.log("Start new game...");
    const body = req.body;
    
    //initialize game
    init_new_game();
    
    //get players
    var players = ["PlayerA","PlayerB","PlayerC","PlayerD"];//body.players
    for(p in players){
        jugador.nombre = players[p];
        var nuevoJugador = Object.assign({}, jugador);
        jugadores.push(nuevoJugador);
    }
    //start game
    gameSimulation();

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.send("Server simulation is done!");
    res.end();
});

app.post('/simulate', (req, res) =>{
    console.log("Start simulation...");
    const body = req.body;
    
    //initialize game
    init_new_game();
    
    //get players
    var players = ["PlayerA","PlayerB","PlayerC","PlayerD"];//body.players
    for(p in players){
        jugador.nombre = players[p];
        var nuevoJugador = Object.assign({}, jugador);
        jugadores.push(nuevoJugador);
    }
    //start game
    gameSimulation();

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.send("Server simulation is done!");
    res.end();
});

app.post('/getInfo', (req, res) =>{
    console.log("Obteniendo informacion...");
    const body = req.body;
    
    var respuesta = {
        players : jugadores
    }
    res.statusCode = 200;
    res.json(respuesta);
    res.end();
});

//FUNCTIONS AND METHODS
async function gameSimulation(){
    console.log("let the simulation begin!");    
    console.log(jugadores);
    var i = 0
    while (maximacasilla < 120){i++;
    //for(var i = 0; i < 10 ; i++){
        await sleep(500);
        console.log("TURNO #"+i+".................................!");
        for(j in jugadores){
            jugador = jugadores[j];
            console.log(jugador);
            //tirar dado
            tirarDados();
            //bonificacion si es doble 6
            verificaDobleSeis();
            //avanar casilla
            avanzarCasillas();
            //bonificacion si es ultima casilla
            ultima=verificaUltimaCasilla();
            console.log(jugador);
            if (ultima){
                break;
            }
        }
    }
    console.log("End of the game...");
    for(jfinal in jugadores){
        console.log(jugadores[jfinal]);
    }
    console.log("Maxima casilla: "+maximacasilla);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function tirarDados(){
    //Llamar a servicio tirar
    //llenar datos de tiro
    tiro.dadoa = Math.floor(Math.random() * 6) + 1;
    tiro.dadob = Math.floor(Math.random() * 6) + 1;
}

function verificaDobleSeis(){
    if (tiro.dadoa == 6 && tiro.dadob == 6){
        jugador.punteo = jugador.punteo + 10;
        console.log("DOBLE SEIS !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    }
}

function verificaUltimaCasilla(){
    if (jugador.casilla >= 120){
        jugador.punteo = jugador.punteo + 10;
        console.log("ULTIMA CASILLA >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        return true;
    }
    return false
}

function avanzarCasillas(){
    jugador.casilla = jugador.casilla + tiro.dadoa + tiro.dadob;
    casilla = obtenerCasilla(jugador.casilla);
    if (casilla != null){
        //es tesoro?
        if (casilla.tipo == "A"){
            //toma el valor del tesoro
            jugador.punteo = jugador.punteo + casilla.tipo_valor;
        }
        //es trampa?
        if (casilla.tipo == "B"){
            //regresa el doble de lo que salio en dados.
            jugador.casilla = jugador.casilla - ((tiro.dadoa + tiro.dadob) * 2);
            if (jugador.casilla < 0){
                jugador.casilla = 0;
            }
        }
    }
    //comparar maxima casilla
    if (jugador.casilla > maximacasilla){
        maximacasilla = jugador.casilla;
    }
    
}

function obtenerCasilla(numCasilla) {
    var resultado = _.find(juego,{numero:numCasilla});
    if(resultado == null || resultado == undefined){
        console.error("No existe casilla!");
        return null;
    }
    return resultado;
}

function init_new_game(){
    juego = [];
    jugadores = [];
    maximacasilla = 0;
    console.log(jugador);

    casilla = {
        numero: 0,
        tipo: "",
        tipo_valor:0
    };

    jugador={
        nombre:"SAPROYECTO",
        punteo:0,
        casilla:0
    };
    
    tiro = {
        dadoa: 0,
        dadob: 0
    };

    var new_casilla;
    casilla.tipo="A"; casilla.numero=1; casilla.tipo_valor = 1; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="C"; casilla.numero=2; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="C"; casilla.numero=3; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=4; casilla.tipo_valor = 2; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="B"; casilla.numero=5; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=6; casilla.tipo_valor = 3; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=7; casilla.tipo_valor = 5; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=8; casilla.tipo_valor = 1; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="C"; casilla.numero=9; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=10; casilla.tipo_valor = 3; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=11; casilla.tipo_valor = 1; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="B"; casilla.numero=12; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=13; casilla.tipo_valor = 2; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=14; casilla.tipo_valor = 1; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=15; casilla.tipo_valor = 4; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="B"; casilla.numero=16; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=17; casilla.tipo_valor = 2; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="C"; casilla.numero=18; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=19; casilla.tipo_valor = 1; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=20; casilla.tipo_valor = 3; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="B"; casilla.numero=21; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="B"; casilla.numero=22; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=23; casilla.tipo_valor = 4; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=24; casilla.tipo_valor = 2; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="C"; casilla.numero=25; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="B"; casilla.numero=26; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=27; casilla.tipo_valor = 1; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=28; casilla.tipo_valor = 3; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="C"; casilla.numero=29; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="C"; casilla.numero=30; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=31; casilla.tipo_valor = 4; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=32; casilla.tipo_valor = 4; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="B"; casilla.numero=33; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="C"; casilla.numero=34; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=35; casilla.tipo_valor = 1; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=36; casilla.tipo_valor = 5; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="C"; casilla.numero=37; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=38; casilla.tipo_valor = 3; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="B"; casilla.numero=39; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="B"; casilla.numero=40; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=41; casilla.tipo_valor = 2; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=42; casilla.tipo_valor = 2; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="C"; casilla.numero=43; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="B"; casilla.numero=44; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="B"; casilla.numero=45; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=46; casilla.tipo_valor = 3; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=47; casilla.tipo_valor = 1; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=48; casilla.tipo_valor = 4; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="C"; casilla.numero=49; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=50; casilla.tipo_valor = 1; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="C"; casilla.numero=51; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="B"; casilla.numero=52; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=53; casilla.tipo_valor = 5; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="C"; casilla.numero=54; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=55; casilla.tipo_valor = 2; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="B"; casilla.numero=56; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=57; casilla.tipo_valor = 2; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="C"; casilla.numero=58; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=59; casilla.tipo_valor = 1; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="C"; casilla.numero=60; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=61; casilla.tipo_valor = 1; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="B"; casilla.numero=62; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="B"; casilla.numero=63; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=64; casilla.tipo_valor = 3; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="C"; casilla.numero=65; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=66; casilla.tipo_valor = 1; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=67; casilla.tipo_valor = 5; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=68; casilla.tipo_valor = 2; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="B"; casilla.numero=69; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=70; casilla.tipo_valor = 4; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="C"; casilla.numero=71; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=72; casilla.tipo_valor = 1; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="C"; casilla.numero=73; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=74; casilla.tipo_valor = 2; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="B"; casilla.numero=75; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=76; casilla.tipo_valor = 2; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="B"; casilla.numero=77; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=78; casilla.tipo_valor = 3; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="B"; casilla.numero=79; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="C"; casilla.numero=80; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=81; casilla.tipo_valor = 2; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="C"; casilla.numero=82; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=83; casilla.tipo_valor = 5; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="B"; casilla.numero=84; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="B"; casilla.numero=85; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="B"; casilla.numero=86; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="C"; casilla.numero=87; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=88; casilla.tipo_valor = 4; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=89; casilla.tipo_valor = 2; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="C"; casilla.numero=90; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=91; casilla.tipo_valor = 1; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=92; casilla.tipo_valor = 3; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=93; casilla.tipo_valor = 3; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="B"; casilla.numero=94; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="C"; casilla.numero=95; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=96; casilla.tipo_valor = 1; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=97; casilla.tipo_valor = 2; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="C"; casilla.numero=98; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="B"; casilla.numero=99; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=100; casilla.tipo_valor = 4; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="C"; casilla.numero=101; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=102; casilla.tipo_valor = 1; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="C"; casilla.numero=103; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=104; casilla.tipo_valor = 1; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="C"; casilla.numero=105; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="B"; casilla.numero=106; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="B"; casilla.numero=107; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=108; casilla.tipo_valor = 3; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=109; casilla.tipo_valor = 2; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="C"; casilla.numero=110; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="B"; casilla.numero=111; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="C"; casilla.numero=112; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=113; casilla.tipo_valor = 1; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=114; casilla.tipo_valor = 3; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="B"; casilla.numero=115; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="B"; casilla.numero=116; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=117; casilla.tipo_valor = 5; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=118; casilla.tipo_valor = 1; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="B"; casilla.numero=119; casilla.tipo_valor = 0; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);
    casilla.tipo="A"; casilla.numero=120; casilla.tipo_valor = 4; new_casilla = Object.assign({}, casilla); juego.push(new_casilla);

    //console.log(juego);
}