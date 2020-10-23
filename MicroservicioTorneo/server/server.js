const express = require('express');
const bodyParser = require('body-parser')
const apiRoutes = require('./routes');

const app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/torneo', apiRoutes);
app.listen(app.get('port'), () => {
    console.log(`server running on ${app.get('port')}`);
});