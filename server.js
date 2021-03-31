require('./Models/db');
var express = require('express');
const path = require('path');
const expressHandlebars = require('express-handlebars');
// const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const crudContacts = require('./Controller/crudContacts');
const bodyParser = require('body-parser');


var {contactSchema} = require('./Models/contact.model');


var app = express();

app.use(express.static('Public'));
app.use(bodyParser.urlencoded({
    extended: true                        
}));

app.use(bodyParser.json());
app.set('views', path.join(__dirname, '/views/'));
app.engine('hbs', expressHandlebars({
    // hbs: allowInsecurePrototypeAccess(expressHandlebars),
    
    extname: 'hbs', defaultLayout: 'mainLayout',
    layoutsDir: __dirname + '/views/layouts/',
}));
app.set('view engine', 'hbs');

app.listen(3000, () => {
    console.log('Server Started successfully on port : 3000');
});

app.use('/contactsList', crudContacts);