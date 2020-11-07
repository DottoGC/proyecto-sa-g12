'use strict';

var express = require('express');
const path = require('path');
const fs = require('fs');
// https://github.com/auth0/node-jsonwebtoken
var jwt = require('jsonwebtoken');

var app = express();


//********* BASE DE DATOS ***********************/
const mysql = require('mysql');
const con = mysql.createConnection({
    host: "db-micro",
    port: 3306,
    user: "root",
    password: "root",
    database: "projectsa"
  });
  
  con.connect(function(err) {
    if (err) console.log(err);
    console.log("Connected!");
  });
//***********************************************/


var privateKey = fs.readFileSync('./src/private.key','utf8');
//var publicKey = fs.readFileSync('./public.key','utf8');

/*
var microservicio_juegos = {
    cliente_id: 'micro-juegos',
    cliente_secret: 'secret-juegos-micro'
};

var microservicio_torneos = {
    cliente_id: 'micro-torneos',
    cliente_secret: 'secret-torneos-micro'
};
*/


// Sample claims payload with user defined fields (this can be anything, but briefer is better):
var payload={};
// Populate with fields and data
//payload.scope = "Dados.tirar";
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
    con.query('select * from microservicios', (err, rows) => {
        if(err){
            console.log(err);
        }
        console.log(rows[0].client_id);
    })
    
    res.send("Servidor de Tokens");

  });


/** RUTA OBTENCION DE TOKEN */
app.post('/token', function (req, res) {
    var userpass = new Buffer((req.headers.authorization || '').split(' ')[1] || '', 'base64').toString();

    var arrayDeCadenas = userpass.split(':');
    console.log(arrayDeCadenas[0]);
    console.log(arrayDeCadenas[1]);
    var cadenaQuery='select scopes from microservicios where client_id='.concat('\'').concat(arrayDeCadenas[0]).concat('\'').concat(' and client_secret='.concat('\'').concat(arrayDeCadenas[1]).concat('\''));
    console.log(cadenaQuery);

    var result=undefined;
    //payload.scope = "Dados.tirar";
    con.query(cadenaQuery, (err, rows) => {
        if(err){
            console.log(err);
        }

        result=rows[0];
        console.log(result);

        if (result !==undefined) {
            console.log(result);
            console.log(result.scopes);
            console.log(result.scopes.split(','));

            //payload.scopes = result.scopes;
            payload.scopes = result.scopes.split(',');
            jwt.sign(payload, privateKey, signOptions,(err,token)=>{
                    res.json({
                        jwt: token,
                        
                    })
                    return;
                });       

            
        }else{
            res.writeHead(401, { 'Basic-Authenticate': 'Basic realm="nope"' });
            res.end('HTTP Error 401 Unauthorized: Access is denied');
            return;

        }
    
    
    })



/*
    if ( (userpass === (microservicio_juegos.cliente_id+':'+microservicio_juegos.cliente_secret)) || (userpass === (microservicio_torneos.cliente_id+':'+microservicio_torneos.cliente_secret))) {
	    jwt.sign(payload, privateKey, signOptions,(err,token)=>{
		        res.json({
		            token: token,
		            
		        })
		    	
		    });       

    	return;
    }*/

/*
        res.writeHead(401, { 'Basic-Authenticate': 'Basic realm="nope"' });
        res.end('HTTP Error 401 Unauthorized: Access is denied');
        return;*/


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
    console.log('Servidor de Tokens, listening on port 8080!');

  });

  