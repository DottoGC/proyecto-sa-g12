var axios = require('axios');
const mysql = require('mysql');

var fs = require('fs');


var logger = fs.createWriteStream('./server/log.txt', {
    flags: 'a' // 'a' means appending (old data will be preserved)
})
function addLog(newlog){
    logger.write(newlog+"\n");
}

const pool = mysql.createPool({
    connectionLimit:10,
    password: 'mariajuana1.',
    user: 'moino',
    database: 'proyectosa',
    host: 'localhost',
    port: '3306',
    multipleStatements : true
});

const con = mysql.createConnection({

  
    host: 'db-mysql',
    port: '3306',
    user: 'admin',
    password: '1234',

    database: 'proyectosa'
});
let proyectobd = {};

proyectobd.all = () => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM torneo`, (err,results) =>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
};


proyectobd.allJuegos = () => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM juego`, (err,results) =>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
};



proyectobd.one = (id) => {
    return new Promise((resolve, reject) => {

        pool.query(`SELECT * FROM torneo,partida, llave2 WHERE torneo.idtorneo= ? AND  partida.idpartida= llave2.idpartida AND partida.idtorneo=torneo.idtorneo`, [id], (err,results) =>{

            if(err){
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
};
proyectobd.borrar = (id) => {
    return new Promise((resolve, reject) => {
        pool.query(`DELETE from torneo WHERE idtorneo= ?`, [id], (err,results) =>{
            if(err){
                return reject(err);
            }            addLog("torneo borrado:\n");
            return resolve('BORRADO');
        });
    });
};
proyectobd.borrarJuego = (id) => {
    return new Promise((resolve, reject) => {
        pool.query(`DELETE from juego WHERE idjuego= ?`, [id], (err,results) =>{
            if(err){
                return reject(err);
            }
            addLog("juego borrado:\n");

            return resolve('BORRADO');
        });
    });
};


proyectobd.insertar = (nombre,llaves,url,idjuego) => {
    
        
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO torneo(nombre,llaves,url,idjuego) VALUES ('" + nombre + "'," + llaves + ",'" + url + "'," + idjuego + ");";
            con.query(query, (err, res) => {
            if (err) throw err;           

            addLog("torneo creado:\n");

            resolve(res.insertId);
            });
        });
    
    
};

proyectobd.insertarJuego = (nombre,url) => {
    
        
    return new Promise((resolve, reject) => {
        const query = "INSERT INTO juego(nombre,url) VALUES ('" + nombre + "','" + url+"');";
        con.query(query, (err, res) => {
        if (err) throw err;
        addLog("juego creado:"+nombre+"url: "+url+"\n");           
        resolve(res.insertId);
        });
    });





proyectobd.insertarPartida = (idtorneo) => {
    
        
    return new Promise((resolve, reject) => {
        const query = "INSERT INTO partida(idtorneo) VALUES (" + idtorneo + ");";
        con.query(query, (err, res) => {
        if (err) throw err;           
        console.log("insertar partida"+res.insertId)
        resolve(res.insertId);
        
        });
    });


};
proyectobd.insertarLlave= (idusuario1,idusuario2,idpartida) => {
    
    console.log("esto trae partida"+idpartida);    
    return new Promise((resolve, reject) => {

        const query = "INSERT INTO  llave2(idusuario1,idusuario2,punteo1,punteo2,idpartida) VALUES (" + idusuario1 + ","+ idusuario2 +",0,0,"+ idpartida +");";

        con.query(query, (err, res) => {
        if (err) throw err;           
        
        resolve(res.insertId);
        });
    });


};
proyectobd.setPunteo= (idpartida,punteo1,punteo2) => {
    
    console.log("setpunteo "+idpartida+" "+punteo1+" "+punteo2);    

    const query = "UPDATE  llave2 SET punteo1="+punteo1+", punteo2="+punteo2+" WHERE idpartida="+idpartida+";" 

    con.query(query, (err, res) => {
        if (err) throw err;           
        console.log("partida "+idpartida+" punteo actualizado");
    });



};

proyectobd.updateJuego= (idjuego,nombre,url) => {
    
    //console.log("setpunteo "+idpartida+" "+punteo1+" "+punteo2);    
    const query = "UPDATE juego SET nombre="+nombre+", url="+url+" WHERE idjuego="+idjuego+";" 
    con.query(query, (err, res) => {
        if (err) throw err;           
        console.log("partida "+idpartida+" punteo actualizado");
    });



};

proyectobd.getGanador= (idpartida,numero) => {
    
    console.log("esto trae getganador "+idpartida+"numero "+numero);    
    

    const query = "SELECT idusuario"+numero+" AS usuario from  llave2 where idpartida="+idpartida+";"

    con.query(query, (err, res) => {
        if (err) throw err;           
        if (res.length>0){
            const ganador = res[0].usuario;
            proyectobd.partidaSiguiente(idpartida,ganador);
        }else{
            console.log("get ganador error, no existe la partida o id del jugador ")
        }


    
    });



};


proyectobd.refresh= (idpartida,ganador,local) => {
    
    console.log("esto trae idpartida refresh "+idpartida+"ganador "+ganador);    
    var usuario = "idusuario2";
    if(local==1){
        usuario = "idusuario1";
    }


    const query = "update  llave2 set "+usuario+"="+ganador+" where idpartida="+idpartida+";"

    con.query(query, (err, res) => {
        if (err) throw err;           
        console.log("partida actualizada");
    });

    addLog("partida actualizada:\n");

};


proyectobd.partidaSiguiente= (idpartida,ganador) => {
    
    console.log("esto trae idpartida siguiente "+idpartida+"ganador "+ganador);    
    
    const query = "SELECT idpartida1 from controltorneo where idpartida2="+idpartida+";"
    con.query(query, (err, res) => {
        if (err) throw err;           
        if (res.length>0){
            console.log("entro al if");
            proyectobd.refresh(res[0].idpartida1,ganador,1);
        }else{
            const query = "SELECT idpartida1 from controltorneo where idpartida3="+idpartida+";"
            con.query(query, (err, res) => {
                if (err) throw err;
                if (res.length > 0){
                    proyectobd.refresh(res[0].idpartida1,ganador,0);
                }
            });
    
        }
    
    });

    addLog("partida siguiente:\n");

};


proyectobd.controlTorneo= (id1,id2,id3) => {
    
    return new Promise((resolve, reject) => {
        const query = "INSERT INTO controltorneo(idpartida1,idpartida2,idpartida3) VALUES (" + id1 + ","+ id2 +","+ id3 +");";
        con.query(query, (err, res) => {
        if (err) throw err;           

        addLog("control de torneo creado:\n");
        resolve(res.insertId);
        });
    });
    

        resolve(res.insertId);
        });
    });



};



module.exports = proyectobd;