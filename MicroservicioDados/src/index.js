
var express = require('express');
var addRequestId = require('express-request-id')();
var jwt=require('jsonwebtoken')

var app = express();
app.use(addRequestId);


var microservicio_juegos = {
    cliente_id: 'micro-juegos',
    cliente_secret: 'secret-juegos-micro'
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


app.post('/getToken', function (req, res) {

    var userpass = new Buffer((req.headers.authorization || '').split(' ')[1] || '', 'base64').toString();

    if (userpass !== (microservicio_juegos.cliente_id+':'+microservicio_juegos.cliente_secret)) {
        res.writeHead(401, { 'Basic-Authenticate': 'Basic realm="nope"' });
        res.end('HTTP Error 401 Unauthorized: Access is denied');
        return;
    }

    //console.log(userpass);
    //console.log(req.body.client_secret);
    //console.log(req.header.grant_type);

    /*repartidorRestaurante = {
        pedido: req.body.pedido,
        cliente: req.body.cliente,
        direccion: req.body.direccion,
    };*/

    jwt.sign({user: microservicio_juegos}, microservicio_juegos.cliente_secret, {expiresIn:'30s'},(err,token)=>{
        res.json({
            token: token,
            
        })
    });

});




function getRandomInt() {
    return Math.floor(Math.random() * (7 - 1)) + 1;
}


app.route('/tirar/:id')
    .post(verifytoken,function (req, res) {

        jwt.verify(req.token,microservicio_juegos.cliente_secret,(err,authData)=>{
            if(err){
                respuesta.error=true
                respuesta.codigo=403
                //res.sendStatus(403);
                res.send(respuesta);
            }else{

                var numDados=parseInt(req.params.id)
                console.log('Tirando '+numDados+' dados...');

                var cadena=[]    
                for (var i = 0; i < numDados; i++) {
                    cadena.push(getRandomInt())
                }    
                
                respuesta.cantidad= false//Numero de dados
                respuesta.codigo= 200//Numero de dados
                respuesta.cantidad= numDados//Numero de dados
                respuesta.dados= cadena//Suma de puntos entre los N dados                

                //res.send(respuesta);

                res.json({
                    mensaje: "post fue recibido",
                    dados: req.params.id,
                    respuesta,
                    authData: authData,
                });


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
        req.token=bearerToken;
        next();
    }else{
        res.sendStatus(403) //ruta o acceso prohibido
    }

}


app.listen(8080, function () {
  console.log('Microservice \'Dados\' listening on port 8080!');
});
