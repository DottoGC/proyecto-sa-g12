'use strict';

var express = require('express');
const path = require('path');
const fs = require('fs');
// https://github.com/auth0/node-jsonwebtoken
var jwt = require('jsonwebtoken');

var app = express();


//********* LOG ***********************/
var logger = fs.createWriteStream('./src/log.txt', {
    flags: 'a' // 'a' means appending (old data will be preserved)
})

var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();


function addLog(newlog){
    logger.write(date+" "+time+" - "+newlog+"\n");
}


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

var payload={};
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
    addLog('>> Usuario que esta pidiendo un token: '+arrayDeCadenas);

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
            addLog('>> Scopes del usuario: '+payload.scopes);
            jwt.sign(payload, privateKey, signOptions,(err,token)=>{
                addLog('>> Token que se enviara: '+token);
                addLog('>>');
                    res.json({
                        jwt: token,
                        
                    })
                    return;
                });       

            
        }else{
            res.writeHead(401, { 'Basic-Authenticate': 'Basic realm="nope"' });
            res.end('HTTP Error 401 Unauthorized: Access is denied');
            addLog('>> HTTP Error 401 Unauthorized: Access is denied');
            return;

        }
    
    
    })

});



/** RUTA OBTENCION DE TOKEN */
app.post('/token', function (req, res) {
    var userpass = new Buffer((req.headers.authorization || '').split(' ')[1] || '', 'base64').toString();

    var arrayDeCadenas = userpass.split(':');
    console.log(arrayDeCadenas[0]);
    console.log(arrayDeCadenas[1]);
    addLog('>> Usuario que esta pidiendo un token: '+arrayDeCadenas);
    
    //var cadenaQuery='select scopes from microservicios where client_id='.concat('\'').concat(arrayDeCadenas[0]).concat('\'').concat(' and client_secret='.concat('\'').concat(arrayDeCadenas[1]).concat('\''));
    var cadenaQuery='select scopes from microservicios where client_id='.concat('\'').concat(req.query["id"]).concat('\'').concat(' and client_secret='.concat('\'').concat(req.query["secret"]).concat('\''));
    
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
            addLog('>> Scopes del usuario: '+payload.scopes);
            jwt.sign(payload, privateKey, signOptions,(err,token)=>{
                addLog('>> Token que se enviara: '+token);
                addLog('>>');
                    res.json({
                        jwt: token,
                        
                    })
                    return;
                });       

            
        }else{
            res.writeHead(401, { 'Basic-Authenticate': 'Basic realm="nope"' });
            res.end('HTTP Error 401 Unauthorized: Access is denied');
            addLog('>> HTTP Error 401 Unauthorized: Access is denied');
            return;

        }
    
    
    })

});


app.listen(8080, function () {
    console.log('Servidor de Tokens, listening on port 8080!');
    addLog('>> Servidor de Tokens, listening on port 8080 in docker and 80 in vm!');
  });

  