'use strict';

var express = require('express');
const path = require('path');
const fs = require('fs');
// https://github.com/auth0/node-jsonwebtoken
var jwt = require('jsonwebtoken');

var app = express();

var privateKey = fs.readFileSync('./private.key','utf8');
//var publicKey = fs.readFileSync('./public.key','utf8');

var microservicio_juegos = {
    cliente_id: 'micro-juegos',
    cliente_secret: 'secret-juegos-micro'
};
// Sample claims payload with user defined fields (this can be anything, but briefer is better):
var payload={};
// Populate with fields and data
payload.scope = "Dados.tirar";
//Print payload
console.log("Payload: " + JSON.stringify(payload));




/*
    Sign
*/
// Expiration timespan: https://github.com/auth0/node-jsonwebtoken#token-expiration-exp-claim
var exp = "60s";

// JWT Token Options, see: https://tools.ietf.org/html/rfc7519#section-4.1 for the meaning of these
var signOptions = {
    expiresIn: exp,//expiracion en
    algorithm: "RS256" //algoritmo
};
console.log("Options: " + JSON.stringify(signOptions));
console.log("\n");


/** RUTA RAIZ */
app.get('/', function (req, res) {
    res.send("Servidor de Tokens");
  });


/** RUTA OBTENCION DE TOKEN */
app.post('/getToken', function (req, res) {
    var userpass = new Buffer((req.headers.authorization || '').split(' ')[1] || '', 'base64').toString();

    if (userpass !== (microservicio_juegos.cliente_id+':'+microservicio_juegos.cliente_secret)) {
        res.writeHead(401, { 'Basic-Authenticate': 'Basic realm="nope"' });
        res.end('HTTP Error 401 Unauthorized: Access is denied');
        return;
    }

    jwt.sign(payload, privateKey, signOptions,(err,token)=>{
        res.json({
            token: token,
            
        })
    });

/*
    jwt.sign({user: microservicio_juegos}, microservicio_juegos.cliente_secret, {expiresIn:'30s'},(err,token)=>{
        res.json({
            token: token,
            
        })
    });

    var token = jwt.sign(payload, privateKey, signOptions);
    console.log("Token: " + token);
    console.log("\n");
*/
});

/*
//Verify
// Notice the `algorithms: ["RS256"]` which goes with public/private keys
var verifyOptions = {
    issuer : iss,
    subject: sub,
    audience: aud,
    maxAge: exp,
    algorithms: ["RS256"]
};

var verified = jwt.verify(token, publicKey, verifyOptions);
console.log("Verified: " + JSON.stringify(verified));

// Decode
console.log("\n");
var decoded = jwt.decode(token, {complete: true});
console.log("Docoded Header: " + JSON.stringify( decoded.header));
console.log("Docoded Payload: " +  JSON.stringify(decoded.payload));

process.exitCode = 0;
*/


app.listen(8080, function () {
    console.log('Microservice \'Dados\' listening on port 8080!');
  });

  