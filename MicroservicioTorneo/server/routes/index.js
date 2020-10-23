const express = require('express');
const db = require('../db/index');
const bodyParser = require('body-parser');
const router = express.Router();


router.get('/', async (req, res, next) => {
    try{
        let results = await db.all();
        res.json(results);
        
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});


router.get('/:id', async (req, res, next) => {
    try{
        let results = await db.one(req.params.id);
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


router.post('/insertar', async (req, res, next) => {
    try{
        console.log("esto trae el body "+req.body)
        let results = await db.insertar(req.body.nombre, req.body.llaves, req.body.url,req.body.idjuego);
        
        res.json(results);
        
        
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});
module.exports = router
