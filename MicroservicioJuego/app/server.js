const http = require('http');
const _ = require('lodash');
const fs = require('fs');
//SERVER CONTANTS............................................................
const hostname = '0.0.0.0';
const port = 3000;

//IMPORTS....................................................................
var express = require('express');
var jwt=require('jsonwebtoken')
const { Console } = require('console');
const { randomInt } = require('crypto');
const { bind } = require('lodash');
var app = express();

//Variables
var juego = [];
var jugadores = [];
var maximacasilla = 0;
var ganador ="";
var punteoMaximo = 0;
var turno = 0;
var jugadoractual ="";

//var para juegos
var ronda = 0;
var finjuego = false;

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

//TODO ESTO ES PARA DESENCRIPTAR TOKENS QUE SOLICITAN CONSUMIR TUS SERVICIOS DE TU MICROSERVICIO
var microservicio_juegos = {
    cliente_id: 'micro-juegos',
    cliente_secret: 'secret-juegos-micro'
};

var publicKey = fs.readFileSync('./public.key','utf8');
var verifyOptions = {
    algorithms: ["RS256"],
    maxAge: "60s"    
};


//SERVER START...............................................................
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  init_new_game();
});

//API.................................................................
app.get('/', (req, res) =>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.send("Server GAMES is running SA proyecto 1 del 2020...");
    res.end();
});

app.post('/generate', (req, res) =>{
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
    jugador = jugadores[ronda];
    jugadoractual = jugador.nombre;
    console.log(jugadoractual);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.send("New game is started!");
    res.end();
});

app.post('/simulate', (req, res) =>{
    console.log("Start simulation...");
    const body = req.body;

    gameSimulation();

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.send("Server simulation is done!");
    res.end();
});

app.post('/fullsimulate', (req, res) =>{
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
    jugadoractual = jugadores[ronda];
    gameFullSimulation();

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.send("Server simulation is done!");
    res.end();
});

app.post('/tirar', (req, res) =>{
    console.log("Tirando...");
    //const body = req.body;
    funcionTirar();
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.send("Tiro hecho!");
    res.end();
})

app.post('/getInfo', (req, res) =>{
    console.log("Obteniendo informacion...");
    const body = req.body;

    var respuesta = {
        players : jugadores,
        ganador : ganador,
        punteoMaximo : punteoMaximo,
        turno : turno,
        jugadoractual: jugadoractual
    }
    res.statusCode = 200;
    res.json(respuesta);
    res.end();
});

//FUNCTIONS AND METHODS

// Authorization: Bearer <token>
function verifytoken(req,res,next){
    const bearerHeader=req.headers['authorization'];

    if(typeof bearerHeader !=='undefined'){
        const bearerToken=bearerHeader.split(" ")[1];
        req.token=bearerToken;
        next();
    }else{
        res.sendStatus(403) //ruta o acceso prohibido
    }
}

function funcionTirar(){
    if (!finjuego){
        //tirar dado
        console.log("tirando dados...");
        tirarDados(function(){
            console.log("fin tirar dados...");
            verificaUltimaCasilla(function(ultima){
                console.log("verificando ultima casilla...");
                console.log(jugador);
                if (ultima){
                    finjuego = true;
                    //set resultados
                    console.log("End of the game...");
                    for(jfinal in jugadores){
                        console.log(jugadores[jfinal]);
                    }
                    console.log("Maxima casilla: "+maximacasilla);
                    
                    punteoMaximo = 0;
                    for (let i = 0; i<jugadores.length; i++){
                        if (jugadores[i].punteo > punteoMaximo){
                            punteoMaximo = jugadores[i].punteo;
                            ganador = jugadores[i].nombre;
                        }
                    }
                    console.log("El ganador del juego es "+ganador+" con un total de "+punteoMaximo+" puntos.")
                }
                else{
                    //set proximo turno
                    setNextTurn();
                }
            }.bind(this));
        }.bind(this));
    }

}

async function gameFullSimulation(){
    console.log("let the full simulation begin!");    
    console.log(jugadores);
    var i = 0
    while (maximacasilla < 120){
        i++;
    //for(var i = 0; i < 10 ; i++){
        //await sleep(500);
        console.log("TURNO #"+i+".................................!");
        turno = i;
        for(j in jugadores){
            if (!finjuego){
                jugador = jugadores[j];
                jugadoractual = jugador.nombre;
                
                console.log(" - Turno "+i+"........"+jugador);
                //tirar dado
                tirarDados(function(){
                    console.log("fin tirar dados...");
                    verificaUltimaCasilla(function(ultima){
                        console.log("verificando ultima casilla...");
                        console.log(jugador);
                        if (ultima){
                            finjuego = true;
                            setResults();
                        }
                    }.bind(this));
                }.bind(this));
                await sleep(1000);
            }
        }
    }
}

async function gameSimulation(){
    console.log("let the simulation begin!");
    var i = turno;
    while (maximacasilla < 120){
        console.log("TURNO #"+i+".................................!");
        turno = i;
        for(j in jugadores){
            //(function(j){
                //var x = j;
                //console.log(j);
                if (!finjuego){
                    jugador = jugadores[j];
                    jugadoractual = jugador.nombre;
                    //console.log(jugador);
                    //tirar dado
                    tirarDados(function(){
                        console.log("fin tirar dados...");
                        verificaUltimaCasilla(function(ultima){
                            console.log("verificando ultima casilla...");
                            console.log(jugador);
                            if (ultima){
                                finjuego = true;
                                setResults();
                            }
                        }.bind(this));
                    }.bind(this));
                    //})(j);
                    await sleep(1000);
                }
        }
        i++;
    }
}

function setResults(){
    console.log("End of the game...");
    for(jfinal in jugadores){
        console.log(jugadores[jfinal]);
    }
    console.log("Maxima casilla: "+maximacasilla);
    
    punteoMaximo = 0;
    for (let i = 0; i<jugadores.length; i++){
        if (jugadores[i].punteo > punteoMaximo){
            punteoMaximo = jugadores[i].punteo;
            ganador = jugadores[i].nombre;
        }
    }
    console.log("El ganador del juego es "+ganador+" con un total de "+punteoMaximo+" puntos.")
}

function setNextTurn(){
    //aumento de turno
    ronda = ronda + 1;
    if(ronda <jugadores.length){
        jugador = jugadores[ronda];
        jugadoractual = jugador.nombre;
    }
    else{
        ronda = 0;
        turno = turno + 1; //cambio de turno cada vuelta de ronda
        jugador = jugadores[ronda];
        jugadoractual = jugador.nombre;
    }
    console.log("siguiente turno..."+ronda);
}

function sleep(period){
    return new Promise(resolve => setTimeout(() => resolve(), period));
}

function tirarDados(callback){
    //Llamar a servicio tirar
    console.log("verificar auth...");
    llamarServicioAuth(function(bearerToken){
        //console.log(bearerToken);
        jwt.verify(bearerToken,publicKey,verifyOptions,(err)=>{
            if(err){
                console.log("error auth...");
                return callback();
            }else{
                //Logica para tirar dados......!
                console.log("llamando servicio tirar...");
                llamarServicioTirar(bearerToken,function(){
                    verificaDobleSeis(function(){
                        return callback();
                    }.bind(this));
                }.bind(this));
            }  
        });
    }.bind(this));
}

function llamarServicioAuth(callback) {
    let objAuth = {'Authorization': 'Basic bWljcm8tanVlZ29zOnNlY3JldC1qdWVnb3MtbWljcm8='};
    var optionsAuth = {
        host : '35.232.54.106',
        path : '/token',
        method : 'POST',
        headers: objAuth
    };
    var bearerToken = "";
    console.log("->>>>>>  Consumiendo servicio de dados -> POST -> 35.232.54.106/getToken")
    var reqAuth = http.request(optionsAuth, function(res) {
        console.log("statusCode: ", res.statusCode);
        res.on('data', function(d) {
            //console.info('POST result:'+d+'\n');
            //process.stdout.write(d+'\n');
            var data = JSON.parse(d);
            bearerToken = data.token;
            //console.log("token: "+bearerToken);
            return callback(bearerToken);
        });
    }.bind(this));
    reqAuth.end();
}

function llamarServicioTirar(bearerToken,callback){
    objAuth = {'Authorization': 'Bearer '+bearerToken};
    var optionsdados = {
        host : '34.69.221.75',
        path : '/tirar/2',
        method : 'POST',
        headers: objAuth
    };

    console.log("->>>>>>  Consumiendo servicio de dados -> POST -> 34.69.221.75/tirar/2")
    var reqDados = http.request(optionsdados, function(res) {
        //console.log("statusCode: ", res.statusCode);
        res.on('data', function(d) {
            //console.info('POST result:'+d+'\n');
            process.stdout.write(d+'\n');
            var dresponse = JSON.parse(d);
            console.log (">>>>>>>>>>>>>>>>>>>>>>TIRO realizado!")
            console.log(dresponse);
            try{
                tiro.dadoa = dresponse.respuesta.dados[0];
                tiro.dadob = dresponse.respuesta.dados[1];
            }
            catch(e){
                tiro.dadoa = dresponse.dados[0];
                tiro.dadob = dresponse.dados[1];
            }
            return callback();
        });
    }.bind(this));
    reqDados.end();
    reqDados.on('error', function(e) {
        tiro.dadoa = Math.floor(Math.random() * 6) + 1;
        tiro.dadob = Math.floor(Math.random() * 6) + 1;
        console.error(e);
    }.bind(this));
}

function verificaDobleSeis(callback){
    console.log("verificando doble seis...");
    if (tiro.dadoa == 6 && tiro.dadob == 6){
        jugador.punteo = jugador.punteo + 10;
        console.log("DOBLE SEIS !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    }
     //avanar casilla
    avanzarCasillas(function(){
        return callback();
    }.bind(this));
}

function avanzarCasillas(callback){
    console.log("avanzando casillas...");
    console.log(jugador);
    jugador.casilla = jugador.casilla + tiro.dadoa + tiro.dadob;
    obtenerCasilla(jugador.casilla, function(casilla){
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
        return callback();
    }.bind(this));
}

function verificaUltimaCasilla(callback){
    if (jugador.casilla >= 120){
        jugador.punteo = jugador.punteo + 10;
        console.log("ULTIMA CASILLA >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        return callback(true);
    }
    return callback(false);
}

function obtenerCasilla(numCasilla, callback) {
    console.log("obteniendo casilla #"+numCasilla);
    var resultado = _.find(juego,{numero:numCasilla});
    if(resultado == null || resultado == undefined){
        console.error("No existe casilla!");
        return callback(null);
    }
    return callback(resultado);
}

function init_new_game(){
    juego = [];
    jugadores = [];
    maximacasilla = 0;
    ganador ="";
    punteoMaximo = 0;
    console.log(jugador);
    turno = 1;
    jugadoractual ="";

    ronda = 0;
    finjuego = false;

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
}