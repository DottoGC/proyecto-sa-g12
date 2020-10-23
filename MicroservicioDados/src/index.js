
var express = require('express');
var addRequestId = require('express-request-id')();

var app = express();
app.use(addRequestId);


let respuesta = {
    error: false,
    codigo: 200,
    cantidad: 0,
    dados: ''
   };


app.get('/', function (req, res) {
  res.send("Microservicio de Dados");
});


function getRandomInt() {
    return Math.floor(Math.random() * (7 - 1)) + 1;
}

app.route('/tirar/:id')
    .get(function (req, res) {
        var numDados=parseInt(req.params.id)
        console.log('Tirando '+numDados+' dados...');

        var cadena=[]    
        for (var i = 0; i < numDados; i++) {
            cadena.push(getRandomInt())
        }    
        
        respuesta.cantidad= numDados
        respuesta.dados= cadena
            

        res.send(respuesta);
    })



app.listen(8080, function () {
  console.log('Microservice \'Dados\' listening on port 8080!');
});