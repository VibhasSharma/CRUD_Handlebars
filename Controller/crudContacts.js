const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Contact = mongoose.model('ContactCollection');

router.get('/', (req,res) => {
    res.render('contacts/addOrEdit', {
        viewTitle: "Create a new Contact"
    });
});

router.post('/', (req,res) => {   //route already provided in server.js
    insertRecord(req,res);
});

function insertRecord(req, res) {
    var contact = new Contact();
    contact.fName = req.body.fName;
    contact.lName = req.body.lName;
    contact.email = req.body.email;
    contact.dob = req.body.dob;
    contact.company = req.body.company;
    
    contact.save((err, doc) => {
        if(!err){
            res.redirect('contactsList/list');
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


router.get('/list', (req, res) => {
    Contact.find((err, docs) => {
        if(!err){
            res.render('contacts/list', {        // contacts directory > list.hbs file
                // contactDocuments: context.contactDocuments
                list: docs.map(Contact => Contact.toJSON())
            });
            // console.log(docs);
        }else{
            console.log('Error in retrieving contact List: '+ err);
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
            default:
                break;
        }
    }
};

//Click on pencil icon and edit the contact details
router.get('/:id', (req, res) => {   //This is the mongo DB id inorder to retrieve a specific record
    Contact.findById(req.params.id, (err, doc) => {
        if(!err){
            res.render('contacts/addOrEdit', {
                viewTitle: "Update Contact Information",
                contactUpdate: doc.toJSON
            });
            console.log(doc);
        }else{
            console.log('Error in retrieving contact List: '+ err);
        }
    });
});

module.exports = router;