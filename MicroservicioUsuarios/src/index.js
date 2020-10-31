const express = require('express');
const app = express();
const mysql = require('mysql');
const morgan = require('morgan');
const myConnection = require('express-myconnection');
const bodyParser = require('body-parser');

require('./database');






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

app.get('/users', (req, res) => {
    req.getConnection((err,conn) => {
        conn.query('SELECT * from usuario', (err, rows) => {
            if(err){
                console.log(err);
                res.json(err);
            }
            res.send(rows);
        })
    })

});


app.post('/jugadores', (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('INSERT INTO  usuario set ?', req.body, (err, rows) =>{
            if(err){
                console.log(err);
                res.json(err);
            }
            console.log(req.body.nombres);
            res.send("exito");
        })
    })
})


app.get('/jugadores/:id', (req, res) => {
    const  id  = req.params.id;
    console.log(id);
    req.getConnection((err, conn) => {
        conn.query("SELECT * FROM usuario WHERE id = ?", [id], (err, rows) => {
            if(err){
                console.log(err);
                res.json(err);
            }
            console.log(rows[0].nombres);
            res.send(rows);
          });
    })
})

app.put('/jugadores/:id', (req, res) => {
    const id = req.params.id;
    const user = req.body;
    req.getConnection((err, conn) => {
        conn.query('UPDATE usuario set ? where id = ?', [user, id], (err, rows) => {
            res.send(rows);
        });
    })
})

app.get('/login', (req, res) => {
    const user = req.body;
    req.getConnection((err, conn) => {
        conn.query("SELECT * FROM usuario WHERE correo = ?", [user.correo], (err, rows) => { //modificar para que sea correo y no id
            if(err){
                console.log(err);
                res.json(err);
            }
            if(user.password === rows[0].password){
                res.send(rows[0]);
            }
            
          });
    })
})