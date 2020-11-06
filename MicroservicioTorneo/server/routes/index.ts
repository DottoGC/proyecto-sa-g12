import { AxiosError, AxiosResponse} from "axios";
import { json } from "express";
import { controlTorneo, insertarLlave, insertarPartida } from "../db";

var express = require('express');
var db = require('../db/index');
var axios = require('axios');
var bodyParser = require('body-parser');
var router = express.Router();
const path = require('path');
var fs = require('fs');
const jwt = require('jsonwebtoken');

var jugadores: Array<Number> = new Array<Number>();
var cantidadj:number = 0;



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

router.post('/listaUsers', async (req, res, next) => {
    
    var llave = req.body.llave1;
    console.log("llave: "+llave);
    axios.post('http://34.69.29.183:80/listajugadores',{
        llave: llave
    })
    .then(function(response:AxiosResponse){
        console.log("funcion then");
        console.log("response: "+response.data[0].id);
        for (var i = 0; i< response.data.length;i++){
            //console.log("for: "+i);
            jugadores.push(Number(response.data[i].id));
        }
        console.log("jugadores: "+jugadores.length);
        res.send(res.json(response.data));
    }).catch(function(e:AxiosError){
        res.send(e.message);
    });
    
    
});

router.get('/listaJuegos', async (req, res, next) => {

    axios.get('http://34.69.29.183:80/jugadores')
    .then(function(response:AxiosResponse){
        res.send(res.json(response.data));
    }).catch(function(e:AxiosError){
        res.send(e.message);
    });
    
    
});


//---------------- put partidas--------------------
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

router.put('/partidas2/:id',verifytoken, async (req, res, next) => {

    jwt.verify(req.token,publicKey,verifyOptions,(err)=>{
        if(err){
            //res.sendStatus(403);
            res.send("error 403");
        }else{
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
router.post('/deleteUser', async (req, res, next) => {

    axios.delete('http://34.69.29.183:80/jugadores/'+req.body.id1)
    .then(function(response:AxiosResponse){
        res.send(res.json(response.data));
    }).catch(function(e:AxiosError){
        res.send(e.message);
    });
    
    
});
router.post('/deleteJuego', async (req, res, next) => {

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
router.post('/insertUser', async (req, res, next) => {

    axios.post('http://34.69.29.183:80/jugadores',{
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

router.post('/insertJuego', async (req, res, next) => {

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

router.post('/insertarTorneo', async (req, res, next) => {
    
    
    //--------------insertar torneo------------------
    var matriz: Array<Array<number>> = new Array<Array<number>>();
    
    
    var json : any = {406:"error con comunicación a bd"};
    try{
        var llave = req.body.llave1;
        console.log("llave: "+llave);
        var a = await axios.post('http://34.69.29.183:80/listajugadores',{
            llave: llave
        })
        .then(function(response:AxiosResponse){
            console.log("funcion then");
            console.log("response: "+response.data[0].id);
            for (var i = 0; i< response.data.length;i++){
                //console.log("for: "+i);
                jugadores.push(Number(response.data[i].id));
            }
            console.log("jugadores: "+jugadores.length);
            cantidadj = jugadores.length;
            //res.send(res.json(response.data));
        }).catch(function(e:AxiosError){
            res.send(e.message);
        });
        
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
        
        
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
    
});

//-------------------update------------------

router.post('/updateUser', async (req, res, next) => {
    console.log("id: "+req.body.id1);
    axios.put('http://34.69.29.183:80/jugadores/'+req.body.id1,{
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
router.post('/updateJuego', async (req, res, next) => {
    
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
router.post('/login', async (req, res, next) => {
    var correo = req.body.correo;
    var password = req.body.password;
    axios.get('http://34.69.29.183:80/login',{
        
        correo: req.body.correo1,
        password: req.body.password1,
        
    })
    .then(function(response:AxiosResponse){
        res.send(res.json(response.data));
    }).catch(function(e:AxiosError){
        res.send(e.message);
    });
    
    
});


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
module.exports = router
