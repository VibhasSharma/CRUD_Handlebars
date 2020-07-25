var mongoose = require('mongoose');
var DateOnly = require('mongoose-dateonly')(mongoose);

var contactSchema = new mongoose.Schema({
    fName: {
        type: String,
        required:'This field is required'
    },
    lName: {
        type: String,
        required: 'This field is required'
    },
    email: {
        type: String,
        required:'This field is required'
    },
    phoneNumber: {
        type: Number,
        required:'This field is required'
    },
    dob: {
        type: String
    },
    company: {
        type: String,
        required:true
    },
    nameInitials: {
        type: String
    }

});

// Custom validation for email


mongoose.model('ContactCollection', contactSchema);
module.exports = {contactSchema};