var mongoose = require('mongoose');

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
    nativeState: {
        type: String,
        required:'This field is required'
    },
    city: {
        type: String,
        required:'This field is required'
    },
    dob: {
        type: String,
        required:'This field is required'
    },
    company: {
        type: String,
        required:true
    },
    nameInitials: {
        type: String
    },
    daysLeft: {
        type: Number
    },
    yearOfBirth: {
        type: Number
    }

});

// Custom validation for email
mongoose.model('ContactCollection', contactSchema);
module.exports = {contactSchema};