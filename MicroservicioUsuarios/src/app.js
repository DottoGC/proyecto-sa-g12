const express = require('express'),
    path = require('path'),
    morgan = require('morgan'),
    mysql = require('mysql'),
    myConnection = require('express-myconnection');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
//const PassportLocal = require('passport-local').Strategy;
const LocalStrategy = require("passport-local").Strategy;

    const app = express();


// importing routes
const customerRoutes = require('./routes/customer');

// settings
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middlewares
app.use(morgan('dev'));
app.use(myConnection(mysql, {
    host: 'localhost',
    user: 'root',
    password: 'password',
    port: 3306,
    database: 'usuarios_bd'
  }, 'single'));
app.use(express.urlencoded({extended: true}));
app.use(cookieParser('secreto'));
app.use(session({
    secret: 'secreto',
    resave: true,
    saveUninitialized:true
}));

app.use(passport.initialize());
app.use(passport.session());



passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    done(null, {id:1, name: "Cody"});
});



// routes
app.use('/', customerRoutes);

// static files
app.use(express.static(path.join(__dirname, 'public')));

/*passport.use(new LocalStrategy(function(username, password, done){    
    if(username === 'Mitchi' && password === "123"){
        return done(null,{id:1, name:"Cody"});        
    }
    done(null,false);
}));*/

passport.use(
    "local.signin",
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
        passReqToCallback: true
      },
      async (req, username, password, done) => {
          let contra;          
        req.getConnection((err, conn) => {
            conn.query("SELECT * FROM usuario WHERE id = ?", [username], (err, rows) => {
                if(password === rows[0].password){
                    return done(null,{id:rows[0].id, name:rows[0].nombres + rows[0].apellidos});        
                }else{
                    done(null,false);
                }
                console.log(rows[0]);
            });
          });
        
      }
    )
  );

// starting the server
app.listen(app.get('port'), () => {
    console.log(`server on port ${app.get('port')}`);
  });

