const express = require('express');
const app = express();
const mysql = require('mysql');
const morgan = require('morgan');
const myConnection = require('express-myconnection');
const bodyParser = require('body-parser');

var jwt=require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

require('./database');

let respuesta = {
    error: false,
    codigo: 200
   };


//TODO ESTO ES PARA DESENCRIPTAR TOKENS QUE SOLICITAN CONSUMIR TUS SERVICIOS DE TU MICROSERVICIO
var publicKey = fs.readFileSync('./src/public.key','utf8');
var verifyOptions = {
    algorithms: ["RS256"],
    maxAge: "60s"    
};




// middlewares
app.use(morgan('dev'));
app.use(myConnection(mysql, {
    host: 'db-mysql',
    user: 'root',
    password: 'root',
    port: 3306,
    database: 'usuarios_bd'
  }, 'single'));
app.use(express.urlencoded({extended: true}));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.listen(3000, ()=>{
    console.log('server on port 3000');
})

var logger = fs.createWriteStream('./src/log.txt', {
    flags: 'a' // 'a' means appending (old data will be preserved)
});

function addLog(newlog){
    logger.write(newlog+"\n");
}

app.post('/prueba', verifytoken, function (req, res) {
    jwt.verify(req.jwt,publicKey,verifyOptions,(err)=>{
        if(err){      
            respuesta.error=true
            respuesta.codigo=403
            res.send(respuesta);
        }else{
            var decoded = jwt.decode(req.jwt, {complete: true});

            var exist=validateScope(decoded.payload.scopes,'dados.tirar');
            console.log(exist);
            if(exist){
                    req.getConnection((err,conn) => {
                    conn.query('SELECT * FROM usuario', (err, rows) => {
                        if(err){
                            console.log(err);
                            res.json(err);
                        }
                        res.json({
                            header: decoded.header,
                            payload: decoded.payload,
                            mensaje: "post fue recibido",
                            rows,
                        });
                    });
                }); 
            }else{
                res.sendStatus(403);
            }
            
            //--
        }
    });
});

//*********************************************************************************************
//*********************************************************************************************
//*********************************************************************************************
//*********************************************************************************************
//*********************************************************************************************



//devuelve arreglo de jugadores para juegos
app.post('/listajugadores', verifytoken, function (req, res) {
    jwt.verify(req.jwt,publicKey,verifyOptions,(err)=>{
        if(err){  
            addLog(" >> Error en token lista jugadores.");    
            respuesta.error=true
            respuesta.codigo=403
            res.send(respuesta);
        }else{                        
            var decoded = jwt.decode(req.jwt, {complete: true});

            var exist=validateScope(decoded.payload.scopes,'usuarios.jugadores.get');
            //console.log(exist);
            if(exist){
                var cantidadjugadores = 0;
                var llave = req.body.llave;
                console.log("llave ", llave);
                if(llave == 1){
                    cantidadjugadores = 2;
                }else if(llave == 2){
                    cantidadjugadores = 4;
                }else if(llave == 3){
                    cantidadjugadores = 8;
                }else if(llave == 4){
                    cantidadjugadores = 16;
                }else if(llave == 5){
                    cantidadjugadores = 32;
                }
                addLog(" >> Cantidad de jugadores para torneo de jugadores.", cantidadjugadores);                
                console.log("cantidad jugadores", cantidadjugadores);
                req.getConnection((err,conn) => {
                    conn.query('SELECT id FROM usuario ORDER BY RAND() LIMIT ?', cantidadjugadores, (err, rows) => {
                        if(err){
                            console.log(err);
                            res.json(err);
                        }
                        res.json({
                            header: decoded.header,
                            payload: decoded.payload,
                            mensaje: "Lista jugadores enviada.",
                            rows,
                        });
                    });
                });
                addLog(" >> Retorna lista de jugadores.");
            }else{
                addLog(" >> Error en token lista jugadores.");
                res.sendStatus(403);
            }

            

        }
    });
});
//agregar un usuario nuevo.
app.post('/jugadores', verifytoken, function (req, res) {
    jwt.verify(req.jwt,publicKey,verifyOptions,(err)=>{
        if(err){   
            addLog(" >> Error en token jugadores post.");   
            respuesta.error=true
            respuesta.codigo=403
            res.send(respuesta);
        }else{
            var decoded = jwt.decode(req.jwt, {complete: true});

            var exist=validateScope(decoded.payload.scopes,'usuarios.jugadores.post');
            //console.log(exist);
            if(exist){
                req.getConnection((err, conn) => {
                    conn.query('INSERT INTO  usuario set ?', req.body, (err, rows) =>{
                        if(err){
                            console.log(err);
                            res.json(err);
                        }
                        addLog(" >> se creo usuario ", req.body.nombres);
                        res.json({
                            header: decoded.header,
                            payload: decoded.payload,
                            mensaje: "Jugador agregado satisfactoriamente",                        
                        });
                    })
                });
            }else{
                addLog(" >> Error en token crear usuario.");
                res.sendStatus(403);
            }
            //--
        }
    });
});

//devolver un solo usuario por id
app.get('/jugadores/:id', verifytoken, function (req, res) {
    jwt.verify(req.jwt,publicKey,verifyOptions,(err)=>{
        if(err){  
            addLog(" >> Error en token devolver un solo usuario.");    
            respuesta.error=true
            respuesta.codigo=403
            res.send(respuesta);
        }else{
            var decoded = jwt.decode(req.jwt, {complete: true});

            var exist=validateScope(decoded.payload.scopes,'usuarios.jugadores.get');
            console.log(exist);
            if(exist){
                const  id  = req.params.id;
                console.log(id);
                req.getConnection((err, conn) => {
                    conn.query("SELECT * FROM usuario WHERE id = ?", [id], (err, rows) => {
                        if(err){
                            console.log(err);
                            res.json(err);
                        }
                        addLog(" >> jugador devuelto.");
                        res.json({
                            header: decoded.header,
                            payload: decoded.payload,
                            mensaje: "Jugador devuelto.",
                            rows: rows[0],
                        });
                    });
                });
            }else{
                addLog(" >> Error en token.");
                res.sendStatus(403);
            }

            
            //--
        }
    });
});

//actualizar un usuario
app.put('/jugadores/:id', verifytoken, function (req, res) {
    jwt.verify(req.jwt,publicKey,verifyOptions,(err)=>{
        if(err){ 
            addLog(" >> Error en token actualizar usuario.");     
            respuesta.error=true
            respuesta.codigo=403
            res.send(respuesta);
        }else{
            var decoded = jwt.decode(req.jwt, {complete: true});

            var exist=validateScope(decoded.payload.scopes,'usuarios.jugadores.put');
            console.log(exist);
            if(exist){
                const id = req.params.id;
                const user = req.body;
                req.getConnection((err, conn) => {
                    conn.query('UPDATE usuario set ? where id = ?', [user, id], (err, rows) => {
                        addLog(" >> Jugador actualizado.");
                        res.json({
                            header: decoded.header,
                            payload: decoded.payload,
                            mensaje: "Jugador actualizado.",
                        });
                    });
                });
            }else{
                addLog(" >> Error en token actualizar usuario.");
                res.sendStatus(403);
            }
            //--
        }
    });
});

//eliminar un usuario
app.delete('/jugadores/:id', verifytoken, function (req, res) {
    jwt.verify(req.jwt,publicKey,verifyOptions,(err)=>{
        if(err){     
            addLog(" >> Error en token eliminar usuario."); 
            respuesta.error=true
            respuesta.codigo=403
            res.send(respuesta);
        }else{
            var decoded = jwt.decode(req.jwt, {complete: true});
            var exist=validateScope(decoded.payload.scopes,'usuarios.jugadores.delete');
            console.log(exist);
            if(exist){
                const id = req.params.id;
                req.getConnection((err, conn) => {
                    conn.query('DELETE from usuario where id = ?', [id], (err, rows) => {
                        addLog(" >> Usuario eliminado.");
                        res.json({
                            header: decoded.header,
                            payload: decoded.payload,
                            mensaje: "Jugador eliminado.",                        
                        });
                    });
                });
            }else{
                addLog(" >> Error en token eliminar usuario.");
                res.sendStatus(403);
            }
            
            //--
        }
    });
});

//login
app.post('/login', verifytoken, function (req, res) {
    jwt.verify(req.jwt,publicKey,verifyOptions,(err)=>{
        if(err){   
            addLog(" >> Error en token login.");   
            respuesta.error=true
            respuesta.codigo=403
            res.send(respuesta);
        }else{
            var decoded = jwt.decode(req.jwt, {complete: true});

            var exist=validateScope(decoded.payload.scopes,'usuarios.login');
            console.log(exist);
            if(exist){
                const user = req.body;
                req.getConnection((err, conn) => {
                    conn.query("SELECT * FROM usuario WHERE correo = ?", [user.correo], (err, rows) => { 
                        if(err){
                            console.log(err);
                            res.json(err);
                        }
                        if(user.password == rows[0].password){
                            addLog(" >> Login satisfactorio para usuario ");
                            res.json({
                                header: decoded.header,
                                payload: decoded.payload,
                                mensaje: "Login satisfactorio.",
                                rows,
                            });
                        }else{
                            res.json({
                                header: decoded.header,
                                payload: decoded.payload,
                                mensaje: "Login Error.",
                                code: 400,
                            });
                        }
                        
                    });
                });
            }else{
                addLog(" >> Error en token.");
                res.sendStatus(403);
            }

           
            //--
        }
    });
});



// Authorization: Bearer <token>
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

