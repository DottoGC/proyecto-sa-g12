import { json } from "express";
import { controlTorneo, insertarLlave, insertarPartida } from "../db";

var express = require('express');
var db = require('../db/index');
var bodyParser = require('body-parser');
var router = express.Router();


router.get('/listaTorneos', async (req, res, next) => {
    try{
        let results = await db.all();
        res.json(results);
        
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
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

router.delete('/:id', async (req, res, next) => {
    try{
        let results = await db.borrar(req.params.id);
        res.json(results);
        
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});



router.post('/insertarTorneo', async (req, res, next) => {
    var jugadores: Array<number> = req.body.jugadores;
    var matriz: Array<Array<number>> = new Array<Array<number>>();
    var cantidadj = jugadores.length;
    var json : any = {406:"error con comunicación a bd"};
    try{
        if (cantidadj % 2 == 0){
            
            var idtorneo:any = await db.insertar(req.body.nombre, req.body.llaves, req.body.url,req.body.idjuego);
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
                    var llave: any = await db.insertarLlave(6,6,idpartida);
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


module.exports = router
