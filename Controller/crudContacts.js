const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Contact = mongoose.model('ContactCollection');
const session = require('express-session'); 
const flash = require('connect-flash'); 
const { Collection } = require('mongoose');

router.get('/', (req,res) => {
    res.render('contacts/addOrEdit', {
        viewTitle: "Create a new Contact"
    });
});

router.get('/getContactsJSON', async (req, res) => {
    try{
        const contacts = await Contact.find();
        res.json(contacts);
    }catch(err){
        res.json({message: err});
    }
});

router.post('/', (req,res) => {   //route already provided in server.js
    if(req.body._id == ''){
        insertRecord(req,res);
    }else{
        updateRecord(req, res)
    }    
});

function insertRecord(req, res) {
    var contact = new Contact();
    contact.fName = req.body.fName;      //contact.(name in db model) = req.body.(name in html form)
    contact.lName = req.body.lName;
    contact.email = req.body.email;
    contact.phoneNumber = req.body.phoneNumber;
    contact.nativeStateSelect = req.body.nativeStateSelect;     // the options are fetched using the Select name attribute
    contact.dob = req.body.dob;
    contact.company = req.body.company;
    contact.nameInitials = req.body.nameInitials;
    contact.city = req.body.city;
    contact.daysLeft = req.body.daysLeft;
    // contact.daysLeft = daysLeftBirthday(contact.dob);     // If this value is set as null a record is created in MongoDB with null value, better this way
    contact.yearOfBirth = yearOfBirth(contact.dob); 

    contact.save((err, doc) => {
        if(!err){
            res.redirect('contactsList/list');
            console.log(contact.nativeStateSelect);
        }
        else{
            if(err.name == 'ValidationError'){
                console.log(err.name);
                handleValidationError(err, req.body);
                res.render("contacts/addOrEdit",{
                    viewTitle: "Create a new Contact",
                    contact: req.body
                });
            }   
            else{
            console.log("Error occured during record insertion: " + err);
            }
        }
    });
};


function updateRecord(req, res) {
    Contact.findOneAndUpdate({_id: req.body._id}, req.body, {new: true}, {useFindAndModify: false}, (err, doc) => {           //With new: true, inside of the doc variable we'll have the 
        if(!err){                                                                                  //value of updated fields, if false we'll have old value of record
            res.redirect('contactsList/list');
        }else{
            if(err.name == 'ValidationError'){
                handleValidationError(err, req.body);
                res.render('contacts/addOrEdit', {
                    viewTitle: 'Update Contact info',
                    contact: req.body
                })
            }else{
                console.log("Error during contact update" + err);
            }
        }                                                                                           
    });
}

// Contact List
router.get('/list', (req, res) => {
    Contact.find((err, docs) => {
        if(!err){
            res.render('contacts/list', {        // contacts directory > list.hbs file
                // contactDocuments: context.contactDocuments
                list: docs.map(Contact => Contact.toJSON())
            });
        }else{
            console.log('Error in retrieving contact List: '+ err);
        }
    });
});

router.use(session({ 
    secret:'secret', 
    saveUninitialized: true, 
    resave: true
})); 


// Flash Message Middleware
router.use((req, res, next) => {
    res.locals.message = req.session.message;
    // delete req.session.message;
    next();
});


// Contact Card, logic for number of days remaining till birthday calculation
router.get('/card', (req, res) => {
    Contact.find((err, docs) => {
        if(!err){
            
            docs.map(contact => contact.toJSON());
            docs.map(contact => {
                contact.daysLeft = daysLeftBirthday(contact.dob);

                if(contact.daysLeft < 10){
                    req.session.message = {
                        message: `${contact.fName}\'s birthday is in ${contact.daysLeft} days`,
                        intro: 'It\'s almost time, '
                    }      
                    if(contact.daysLeft == 1){
                        req.session.message = {
                            message: `${contact.fName}\'s birthday is tomorrow`,
                            intro: 'It\'s almost time, '
                        }   
                    }
                }
            });
            res.render('contacts/card', {        // contacts directory > card.hbs file
                list: docs.map(contact => contact.toJSON())
            });
        }else{
            console.log('Error in retrieving contact Card: '+ err);
        }
    });
});

function handleValidationError(err, body) {
    for (field in err.errors){
        switch (err.errors[field].path){
            case 'fName':
                body['fNameError'] = err.errors[field].message;
                break;
            case 'lName':
                body['lNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            case 'phoneNumber':
                body['phoneNumberError'] = err.errors[field].message;    
                break;
            case 'nativeState':
                body['nativeStateSelectError'] = err.errors[field].message;
                break;
            case 'dob':
                    body['dobError'] = err.errors[field].message;
                break;
            case 'company':
                body['companyError'] = err.errors[field].message;   
            default:
                break;
        }
    }
};

// function() calculate days remaining till birthday
function daysLeftBirthday(birthDateInput){
    var today = new Date();
    var parsedDate = new Date(birthDateInput);
    var date = parsedDate.getDate();
    var parsedMonth = parsedDate.getMonth();
    var actualMonth = parsedMonth+1;
    var birthday = [date, actualMonth]
    var bday = new Date(today.getFullYear(), birthday[1]-1, birthday[0]);
    
    if(today.getTime() > bday.getTime()){
        bday.setFullYear(bday.getFullYear()+1);
    }
    var diff = bday.getTime() - today.getTime();
    var days = Math.floor(diff/(60*60*24*1000));
    return (days + 1);
};

function yearOfBirth(birthDateInput){
    var parsedDateforYear = new Date(birthDateInput);
    var yob = parsedDateforYear.getFullYear();
    return yob;
}

//Click on pencil icon and edit the contact details
router.get('/:id', (req, res) => {   //This is the mongo DB id inorder to retrieve a specific record
    Contact.findById(req.params.id, (err, doc) => {
        if(!err){
            res.render('contacts/addOrEdit', {
                viewTitle: "Update Contact Information",
                contact: doc.toJSON()
            });
            // console.log(doc);
        }else{
            console.log('Error in retrieving contact List: '+ err);
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Contact.findByIdAndRemove(req.params.id, (err, doc) => {
        if(!err){
            res.redirect('/contactsList/list');
        }
        else{
            console.log('Error in deleting the contact: ' + err);
        }
    });
});

module.exports = router;