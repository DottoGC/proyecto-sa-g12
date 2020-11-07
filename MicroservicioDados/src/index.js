var express = require('express');
const path = require('path');
const fs = require('fs');
var jwt=require('jsonwebtoken')

var app = express();

//TODO ESTO ES PARA DESENCRIPTAR TOKENS QUE SOLICITAN CONSUMIR TUS SERVICIOS DE TU MICROSERVICIO
var publicKey = fs.readFileSync('./public.key','utf8');
var verifyOptions = {
    algorithms: ["RS256"],
    maxAge: "60s"    
};


let respuesta = {
    error: false,
    codigo: 200,
    cantidad: -1,
    dados: -1
   };


app.get('/', function (req, res) {
  res.send("Microservicio de Dados");
});


function getRandomInt() {
    return Math.floor(Math.random() * (7 - 1)) + 1;
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

app.route('/tirar/:id')
    .post(verifytoken,function (req, res) {

        jwt.verify(req.jwt,publicKey,verifyOptions,(err)=>{
            if(err){
                //respuesta.error=true
                //respuesta.codigo=403
               // respuesta.datos=-1
                //respuesta.cantidad=-1
                res.sendStatus(403);
                //res.send(respuesta);
            }else{
                var decoded = jwt.decode(req.jwt, {complete: true});

                //console.log(decoded.payload.scopes);
                var exist=validateScope(decoded.payload.scopes,'dados.tirar');
                console.log(exist);
                if(exist){
                    var numDados=parseInt(req.params.id)
                    console.log('Tirando '+numDados+' dados...');
    
                    var cadena=[]    
                    for (var i = 0; i < numDados; i++) {
                        cadena.push(getRandomInt())
                    }    
                    
                    respuesta.error= false//Numero de dados
                    respuesta.codigo= 200//Numero de dados
                    respuesta.cantidad= numDados//Numero de dados
                    respuesta.dados= cadena//Suma de puntos entre los N dados                
    
                    //res.send(respuesta);
                    decoded.payload.dados=cadena;
                    res.json({
                        header: decoded.header,
                        payload: decoded.payload,
                        //respuesta,
                    });
                }else{
                    res.sendStatus(403)
                }




               /* res.json({
                    mensaje: "post fue recibido",
                    dados: req.params.id,
                    authData: authData
                });*/
            }
        });

        /*var numDados=parseInt(req.params.id)
        console.log('Tirando '+numDados+' dados...');

        var cadena=[]    
        for (var i = 0; i < numDados; i++) {
            cadena.push(getRandomInt())
        }    
        
        respuesta.cantidad= numDados
        respuesta.dados= cadena
            

        res.send(respuesta);*/
    })


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


app.listen(8080, function () {
  console.log('Microservice \'Dados\' listening on port 8080!');
});
