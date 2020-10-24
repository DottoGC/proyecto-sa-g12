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
        pool.query(`SELECT * FROM torneo WHERE idtorneo= ?`, [id], (err,results) =>{
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

module.exports = proyectobd;