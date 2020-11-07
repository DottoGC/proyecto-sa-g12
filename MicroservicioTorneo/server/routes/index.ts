import { AxiosError, AxiosResponse} from "axios";
import { json } from "express";
import { nextTick } from "process";
import { callbackify } from "util";
import { controlTorneo, insertarLlave, insertarPartida } from "../db";

var express = require('express');
var db = require('../db/index');
var axios = require('axios');
var bodyParser = require('body-parser');
var router = express.Router();
const path = require('path');
var fs = require('fs');
const jwt = require('jsonwebtoken');


var http = require('http');
var _ = require('lodash');
var logger = fs.createWriteStream('./server/log.txt', {
    flags: 'a' // 'a' means appending (old data will be preserved)
})
function addLog(newlog){
    logger.write(newlog+"\n");
}

var auth = require('../authToken');
var http = require('http');
var _ = require('lodash');


var jugadores: Array<Number> = new Array<Number>();




//TODO ESTO ES PARA DESENCRIPTAR TOKENS QUE SOLICITAN CONSUMIR TUS SERVICIOS DE TU MICROSERVICIO
var publicKey = fs.readFileSync('./server/routes/public.key','utf8');
var verifyOptions = {
    algorithms: ["RS256"],
    maxAge: "60s"    
};

// ------------ listas--------------
router.get('/listaTorneos', async (req, res, next) => {
    try{
        let results = await db.all();
        res.json(results);
        
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.post('/listaUsers',   async (req, res, next) => {
    

    var llave = req.body.llave1;

    console.log("llave: "+llave);
    axios.post('http://34.69.29.183:80/listajugadores',{
        llave: llave
    })
    .then(function(response:AxiosResponse){
        console.log("funcion then");
        console.log("response: "+response.data.rows);
        for (var i = 0; i< response.data.rows.length;i++){
            //console.log("for: "+i);
            jugadores.push(Number(response.data.rows[i].id));
        }
        console.log("jugadores: "+jugadores.length);
        res.send(res.json(response.data));
    }).catch(function(e:AxiosError){
        res.send(e.message);
    });
    
    
});

router.get('/listaJuegos', async (req, res, next) => {


    try{
        let results = await db.allJuegos();
        res.json(results);
        
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
  axios.get('http://34.69.29.183:80/jugadores')
    .then(function(response:AxiosResponse){
        res.send(res.json(response.data));
    }).catch(function(e:AxiosError){
        res.send(e.message);
    });
    

    
});


//---------------- put partidas--------------------

router.put('/partidas2/:id', async (req, res, next) => {
    try{
        var idpartida:String = req.params.id;
        var punteo:Array<Number>= req.body.marcador;

router.put('/partidas/:id', async (req, res, next) => {
    try{
        var idpartida:String = req.params.id;
        var punteo:Array<Number>= req.body.punteo;

        if(punteo[0]> punteo[1]){
            console.log("jugador 1 ganador");
            db.setPunteo(idpartida,punteo[0],punteo[1]);
            db.getGanador(idpartida,"1");

 
        }else if(punteo[0]< punteo[1]){
            console.log("jugador 2 ganador");
            db.setPunteo(idpartida,punteo[0],punteo[1]);
            db.getGanador(idpartida,"2");

        }
        res.json({
            201:"partida lista",
            "partida":idpartida
        });
        
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.put('/partidas/:id',verifytoken, async (req, res, next) => {

    jwt.verify(req.jwt,publicKey,verifyOptions,(err)=>{

router.put('/partidas2/:id',verifytoken, async (req, res, next) => {

    jwt.verify(req.token,publicKey,verifyOptions,(err)=>{

        if(err){
            //res.sendStatus(403);
            res.send("error 403");
        }else{

            var decoded = jwt.decode(req.jwt, {complete: true});
            var exist = validateScope(decoded.payload.scopes,'torneos.partida.put')
            console.log(exist);
            if(exist){
                try{
                    var idpartida:String = req.params.id;
                    var punteo:Array<Number>= req.body.marcador;
                    if(punteo[0]> punteo[1]){
                        console.log("jugador 1 ganador");
                        db.setPunteo(idpartida,punteo[0],punteo[1]);
                        db.getGanador(idpartida,"1");
                        addLog("Partida terminada:"+idpartida+" ganador: jugador 1 (local).\n");
                    }else if(punteo[0]< punteo[1]){
                        console.log("jugador 2 ganador");
                        db.setPunteo(idpartida,punteo[0],punteo[1]);
                        db.getGanador(idpartida,"2");
                        addLog("Partida terminada:"+idpartida+" ganador: jugador 2 (visitante).\n");
                    }
                    res.json({
                        201:"partida lista",
                        "partida":idpartida
                    });
                    
                } catch(e) {
                    console.log(e);
                    res.sendStatus(500);
                }
                //res.send(respuesta);
    
                res.json({
                    header: decoded.header,
                    payload: decoded.payload,
                    mensaje: "post fue recibido"
                    
                });
            }else{
                res.sendStatus(403);
            }
 
            var decoded = jwt.decode(req.token, {complete: true});
            try{
                var idpartida:String = req.params.id;
                var punteo:Array<Number>= req.body.punteo;
                if(punteo[0]> punteo[1]){
                    console.log("jugador 1 ganador");
                    db.setPunteo(idpartida,punteo[0],punteo[1]);
                    db.getGanador(idpartida,"1");
                    
                }else if(punteo[0]< punteo[1]){
                    console.log("jugador 2 ganador");
                    db.setPunteo(idpartida,punteo[0],punteo[1]);
                    db.getGanador(idpartida,"2");
                }
                res.json({
                    201:"partida lista",
                    "partida":idpartida
                });
                
            } catch(e) {
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

    
});


router.get('/getTorneo', async (req, res, next) => {
    try{
        console.log("esto trae el body get torneo "+req.body.idtorneo)
        let results = await db.one(req.body.idtorneo);
        res.json(results);
        
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});

//------------------delete torneo, users, juegos-------------------
router.post('/deleteUser',   async (req, res, next) => {

    funcionBorrar(req,res,async function(){
        
    }.bind(this));

    });

    
});
router.post('/deleteJuego', async (req, res, next) => {


    try{
        let results = await db.borrarJuego(req.params.id);
        res.json(results);
        
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }

    axios.delete('http://34.69.29.183:80/jugadores/'+req.body.id)
    .then(function(response:AxiosResponse){
        res.send(res.json(response.data));
    }).catch(function(e:AxiosError){
        res.send(e.message);
    });
    

    
});
router.delete('/:id', async (req, res, next) => {
    try{
        let results = await db.borrar(req.params.id);
        res.json(results);
        
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});




//-------------------------inserts torneo, users, juego-----------------
router.post('/insertUser',   async (req, res, next) => {


    funcionInsertar(req,res,async function(){
        
    }.bind(this));


    });

    
});

router.post('/insertJuego',   async (req, res, next) => {

    console.log("insert juego "+req.body.nombre);
    try{
        let results = await db.insertarJuego(req.body.nombre, req.body.url);
        res.json(results);
        addLog("juego insertardo:"+req.body.nombre+" url: "+req.body.url+"\n");
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }


    axios.post('http://34.69.29.183:80/jugadores',{
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        correo: req.body.correo,
        password: req.body.password,
        administrador: req.body.administrador1
    })
    .then(function(response:AxiosResponse){
        res.send(res.json(response.data));
    }).catch(function(e:AxiosError){
        res.send(e.message);
    });

    
});



router.post('/insertarTorneo',  async (req, res, next) => {
    
    

    funcionLista(req,res,async function(){

        var matriz: Array<Array<number>> = new Array<Array<number>>();
        var json : any = {406:"error con comunicación a bd"};
        try{
            var llave = req.body.llave1;
            console.log("llave: "+llave);
            var cantidadj = jugadores.length;

            //console.log("talegueo");
            if (cantidadj % 2 == 0){
                //console.log("entro al if");

            console.log("talegueo");
            if (cantidadj % 2 == 0){
                console.log("entro al if");

                console.log("cantidad jugadores: "+cantidadj);
                var idtorneo:any = await db.insertar(req.body.nombre, req.body.llave1, req.body.url,req.body.idjuego);
                var arreglopartidas: Array<number> = new Array<number>();
                jugadores.sort(function(a,b){
                    return (Math.random()-0.5)
                });
                var a:number = -2, b:number = -1;
                var partidas = cantidadj / 2;
                for ( var i = 0; i < partidas; i++){
                    a = a + 2;
                    b = b +2;

                    console.log("------------torneo:"+idtorneo);

                    var idpartida:any = await db.insertarPartida(idtorneo);
                    console.log("------------partida :"+idpartida);
                    var llave:any = await db.insertarLlave(jugadores[a],jugadores[b],idpartida);
                    arreglopartidas.push(Number(idpartida));
                    
                }
                partidas = partidas /2;
                matriz.push(arreglopartidas);
                while(partidas >= 1){
                    arreglopartidas = new Array<number>();
                    for(var i = 0; i < partidas; i++){

                        console.log("while idpartida:"+idpartida);

                        var idpartida: any = await db.insertarPartida(idtorneo);
                        var llave: any = await db.insertarLlave(0,0,idpartida);
                        arreglopartidas.push(Number(idpartida));
                    }
                    partidas = partidas /2 ;
                    matriz.push(arreglopartidas);
                }
            
            }
            for(var i=1;i<matriz.length;i++){
                var x = 0;
                for(var j=0;j<matriz[i].length;j++){

                    console.log("esto tiene la matriz"+matriz);

                    db.controlTorneo(matriz[i][j],matriz[i-1][x],matriz[i-1][x+1]);
                    x += 2;
                }
            }
            json = {"estado":201,"torneo":idtorneo, "partidas":matriz};
            res.json(json);
         addLog("torneo insertardo:"+idtorneo+" partidas: "+matriz.length+"\n");

        } catch(e) {
            console.log(e);
            res.sendStatus(500);
        }
        }.bind(this));
        //--------------insertar torneo------------------

    
});

//-------------------update------------------

router.post('/updateUser',  async (req, res, next) => {


    funcionUpdate(req,res,async function(){
        
    }.bind(this));

    });
    

    
});
router.post('/updateJuego',  async (req, res, next) => {
    

    try{
        let results = await db.updateJuego(req.params.id);
        res.json(results);
        
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }

    axios.put('http://34.69.29.183:80/jugadores/:'+req.body.id1,{
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
    });
    

    
});


//------------------------login--------------------
router.post('/login',  async (req, res, next) => {

    funcionLogin(req,res,async function(){
        
    }.bind(this));

    });
    

    
});

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
router.post('/token', async (req, res, next) => {
    
    /*axios.post('http://35.232.54.106/token')
    .then(function(response:AxiosResponse){
        res.send(res.json(response.data.token));
    }).catch(function(e:AxiosError){
        res.send(e.message);
    });*/
    axios.post('http://35.232.54.106/token',{
        
    },{
        headers:{
            'Authorization': `Basic bWljcm8tanVlZ29zOnNlY3JldC1qdWVnb3MtbWljcm8=` 
        }
    })
    .then(function(response:AxiosResponse){
        res.send(res.json(response.data));
    }).catch(function(e:AxiosError){
        res.send(e.message);
    });
    
    
});
// Authorization: Bearer <token>

router.post("/generar",  async (req, res) => {
    axios.post('http://35.223.103.13:3000/generar', {
        id: req.body.id,
        jugadores : req.body.jugadores
    }).then(function (response:AxiosResponse) {
        res.send(JSON.stringify(response.data));
    }).catch(function (error:AxiosError) {
        res.send(error.message);
    });
});

router.post("/simular",  async (req, res) => {
    axios.post('http://35.223.103.13:3000/simular', {
        id: req.body.id,
        jugadores : req.body.jugadores
    }).then(function (response:AxiosResponse) {
        res.send(JSON.stringify(response.data));
    }).catch(function (error:AxiosError) {
        res.send(error.message);
    });
});
function validateScope(scopes,idruta)
{
    var result=false;
    /*scopes.forEach(
        
        element => (element==idruta)? true: false
    
    );*/
    scopes.forEach(function(word) {
        console.log(word);
        console.log(idruta);
        if (word === idruta) {
          console.log(true);
          result=true;
        }

      });
      return result;
}



function verifytoken(req,res,next){
    const bearerHeader=req.headers['authorization'];

    if(typeof bearerHeader !=='undefined'){
        const bearerToken=bearerHeader.split(" ")[1];

        req.jwt=bearerToken;

        next();
    }else{
        res.sendStatus(403) //ruta o acceso prohibido
    }
}

function funcionLista(req,res,callback){
    listarUsuarios(req,res,function(){
        return callback();
    }.bind(this));
}

function funcionInsertar(req,res, callback){
    insertarUsuario(req,res,function(){
        return callback();
    }.bind(this));
}


function funcionUpdate(req,res, callback){
    updateUsuario(req,res,function(){
        return callback();
    }.bind(this));
}

function funcionBorrar(req,res, callback){
    deleteUsuario(req,res,function(){
        return callback();
    }.bind(this));
}
function funcionLogin(req,res, callback){
    loginUsuario(req,res,function(){

function funcionLista(callback){
    listarUsuarios(function(){

        return callback();
    }.bind(this));
}


function insertarUsuario(req,res,callback){
    console.log("verificar auth...");
    llamarServicioAuth(function(bearerToken){
        //console.log(bearerToken);
        jwt.verify(bearerToken,publicKey,verifyOptions,(err)=>{
            if(err){
                console.log("error auth...");
                return callback();
            }else{
                //Logica para tirar dados......!
                console.log("llamando servicio insertar...");
                llamarServicioInsertar(req,res, bearerToken,function(){
                    return callback();
                }.bind(this));
            }  
        });
    }.bind(this));
}

function updateUsuario(req,res,callback){
    console.log("verificar auth...");
    llamarServicioAuth(function(bearerToken){
        //console.log(bearerToken);
        jwt.verify(bearerToken,publicKey,verifyOptions,(err)=>{
            if(err){
                console.log("error auth...");
                return callback();
            }else{
                //Logica para tirar dados......!
                console.log("llamando servicio update...");
                llamarServicioUpdate(req,res, bearerToken,function(){
                    return callback();
                }.bind(this));
            }  
        });
    }.bind(this));
}

function deleteUsuario(req,res,callback){
    console.log("verificar auth...");
    llamarServicioAuth(function(bearerToken){
        //console.log(bearerToken);
        jwt.verify(bearerToken,publicKey,verifyOptions,(err)=>{
            if(err){
                console.log("error auth...");
                return callback();
            }else{
                //Logica para tirar dados......!
                console.log("llamando servicio delete...");
                llamarServicioDelete(req,res, bearerToken,function(){
                    return callback();
                }.bind(this));
            }  
        });
    }.bind(this));
}

function loginUsuario(req,res,callback){
    console.log("verificar auth...");
    llamarServicioAuth(function(bearerToken){
        //console.log(bearerToken);
        jwt.verify(bearerToken,publicKey,verifyOptions,(err)=>{
            if(err){
                console.log("error auth...");
                return callback();
            }else{
                //Logica para tirar dados......!
                console.log("llamando servicio login...");
                llamarServicioLogin(req,res, bearerToken,function(){
                    return callback();
                }.bind(this));
            }  
        });
    }.bind(this));
}
function listarUsuarios(req,res,callback){


    console.log("verificar auth...");
    llamarServicioAuth(function(bearerToken){
        //console.log(bearerToken);
        jwt.verify(bearerToken,publicKey,verifyOptions,(err)=>{
            if(err){
                console.log("error auth...");
                return callback();
            }else{
                //Logica para tirar dados......!
                console.log("llamando servicio listar...");

                llamarServicioListar(req,res,bearerToken,function(){

            return callback();
                }.bind(this));
            }  
        });
    }.bind(this));
}
function llamarServicioAuth(callback) {
    var objAuth = {'Authorization': 'Basic bWljcm8tanVlZ29zOnNlY3JldC1qdWVnb3MtbWljcm8='};
    var optionsAuth = {
        host : '35.232.54.106',
        path : '/token',
        method : 'POST',
        headers: objAuth
    };
    var bearerToken = "";
    console.log("->>>>>>  Consumiendo servicio de jugadores -> POST -> 35.232.54.106/Token")
    var reqAuth = http.request(optionsAuth, function(res) {
        console.log("statusCode: ", res.statusCode);
        res.on('data', function(d) {
            //console.info('POST result:'+d+'\n');
            //process.stdout.write(d+'\n');
            var data = JSON.parse(d);

            bearerToken = data.jwt;
            console.log("token: "+bearerToken);
            addLog("autenticación de token"+bearerToken+"\n");

            bearerToken = data.token;
            console.log("token: "+bearerToken);

            return callback(bearerToken);
        });
    }.bind(this));
    reqAuth.end();
}

function llamarServicioListar(req,res,bearerToken,callback){
    
    
    
    var j = axios.post('http://34.69.29.183:80/listajugadores',{
        llave: req.body.llave1
    }, {
        headers:{
            'Authorization': `Bearer ${bearerToken}` 
        }
    })
    .then(function(response:AxiosResponse){
        console.log("->>>>>>  Consumiendo servicio de jugadores -> POST -> http://34.69.29.183:80/jugadores")

function llamarServicioListar(bearerToken,callback){
    var objAuth = {'Authorization': 'Bearer '+bearerToken};
    var llave = {'llave': '2'};
    var optionsdados = {
        host : '34.69.29.183',
        path : ':80/listajugadores',
        method : 'POST',
        headers: objAuth,
        body : llave
    };
    var j = axios.post('http://34.69.29.183:80/listajugadores',{
        llave: 2
    }, {
        headers:{
            'Authorization': `Basic ${bearerToken}` 
        }
    })
    .then(function(response:AxiosResponse){
        console.log("->>>>>>  Consumiendo servicio de jugadores -> POST -> http://34.69.29.183:80/listajugadores")

        for (var i = 0; i< response.data.rows.length;i++){
            console.log("id: "+response.data.rows[i].id);
            jugadores.push(Number(response.data.rows[i].id));
        }

        //res.send(res.json(response.data));
        console.log("jugadores: "+jugadores.length);
        addLog("llamada servicio jugadores\n");
        return callback(jugadores);
        
    }).catch(function(e:AxiosError){
        res.send(e.message);
    });
  
}

function llamarServicioInsertar(req, res,bearerToken,callback){
    
    console.log("llamar servicio insertar");
    axios.post('http://34.69.29.183:80/jugadores',{
        nombres: req.body.nombres1,
        apellidos: req.body.apellidos1,
        correo: req.body.correo1,
        password: req.body.password1,
        administrador: req.body.administrador1
    }, {
        headers:{
            'Authorization': `Bearer ${bearerToken}` 
        }
    })
    .then(function(response:AxiosResponse){
        res.send(res.json(response.data));
        console.log("si inserto");
        addLog("llamada a servicio insertar http://34.69.29.183:80/jugadores "+res.json(response.data)+"\n");
        return callback();
    }).catch(function(e:AxiosError){
        res.send(e.message);
    });
    
    
}

function llamarServicioUpdate(req,res, bearerToken,callback){
    
    console.log("llamar servicio update");
    axios.put('http://34.69.29.183:80/jugadores/'+req.body.id1,{
        nombres: req.body.nombres1,
        apellidos: req.body.apellidos1,
        correo: req.body.correo1,
        password: req.body.password1,
        administrador: req.body.administrador1
    }, {
        headers:{
            'Authorization': `Bearer ${bearerToken}` 
        }
    })
    .then(function(response:AxiosResponse){
        res.send(res.json(response.data));
        console.log("si update");
        addLog("llamada a servicio update http://34.69.29.183:80/jugadores/id "+res.json(response.data)+"\n");
        return callback();
    }).catch(function(e:AxiosError){
        res.send(e.message);
    });
    
    
}
function llamarServicioDelete(req,res, bearerToken,callback){
    
    console.log("llamar servicio delete");
    axios.delete('http://34.69.29.183:80/jugadores/'+req.body.id1,{
        headers:{
            'Authorization': `Bearer ${bearerToken}` 
        }
    })
    .then(function(response:AxiosResponse){
        res.send(res.json(response.data));
        console.log("si delete");
        addLog("llamada a servicio borrar http://34.69.29.183:80/jugadores/id"+res.json(response.data)+"\n");
        return callback();
    }).catch(function(e:AxiosError){
        res.send(e.message);
    });
    
    
}

function llamarServicioLogin(req,res, bearerToken,callback){
    
    console.log("llamar servicio login");
    axios.post('http://34.69.29.183:80/login',{
        correo: req.body.correo1,
        password: req.body.password1
    }, {
        headers:{
            'Authorization': `Bearer ${bearerToken}` 
        }
    })
    .then(function(response:AxiosResponse){
        res.send(res.json(response.data));
        console.log("si login");
        addLog("llamada a servicio login http://34.69.29.183:80/login "+res.json(response.data)+"\n");
        return callback();
    }).catch(function(e:AxiosError){
        res.send(e.message);
    });
    
    
}



        console.log("jugadores: "+jugadores.length);
        return callback(jugadores);
        //res.send(res.json(response.data));
    }).catch(function(e:AxiosError){
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

module.exports = router
