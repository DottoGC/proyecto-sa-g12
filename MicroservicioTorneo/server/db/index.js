const mysql = require('mysql');

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
    host: 'localhost',
    port: '3306',
    user: 'moino',
    password: 'mariajuana1.',
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

proyectobd.one = (id) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM torneo,partida,llave WHERE torneo.idtorneo= ? AND  partida.idpartida=llave.idpartida AND partida.idtorneo=torneo.idtorneo`, [id], (err,results) =>{
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
            }
            return resolve('BORRADO');
        });
    });
};


proyectobd.insertar = (nombre,llaves,url,idjuego) => {
    
        
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO torneo(nombre,llaves,url,idjuego) VALUES ('" + nombre + "'," + llaves + ",'" + url + "'," + idjuego + ");";
            con.query(query, (err, res) => {
            if (err) throw err;           
            resolve(res.insertId);
            });
        });
    
    
};

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
        const query = "INSERT INTO llave(idusuario1,idusuario2,punteo1,punteo2,idpartida) VALUES (" + idusuario1 + ","+ idusuario2 +",0,0,"+ idpartida +");";
        con.query(query, (err, res) => {
        if (err) throw err;           
        
        resolve(res.insertId);
        });
    });


};

proyectobd.controlTorneo= (id1,id2,id3) => {
    
    console.log("esto trae id1 "+id1+"id2 "+id2+"id3 "+id3);    
    return new Promise((resolve, reject) => {
        const query = "INSERT INTO controltorneo(idpartida1,idpartida2,idpartida3) VALUES (" + id1 + ","+ id2 +","+ id3 +");";
        con.query(query, (err, res) => {
        if (err) throw err;           
        
        resolve(res.insertId);
        });
    });


};
module.exports = proyectobd;