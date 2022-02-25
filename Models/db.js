const mongoose = require('mongoose');
require('./contact.model');
mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27017/ContactsDB');
const URI = 'mongodb+srv://admin:admin1@cluster0.5w5dt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
mongoose.connect(URI, { useUnifiedTopology: true }, () => {
    console.log("Connected to MongoAtlas")
});
