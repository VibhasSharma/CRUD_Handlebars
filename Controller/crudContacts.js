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
    if(req.body._id == ''){
        insertRecord(req,res);
    }else{
        updateRecord(req, res)
    }    
});

function insertRecord(req, res) {
    var contact = new Contact();
    contact.fName = req.body.fName;
    contact.lName = req.body.lName;
    contact.email = req.body.email;
    contact.phoneNumber = req.body.phoneNumber;
    contact.dob = req.body.dob;
    contact.company = req.body.company;
    contact.nameInitials = req.body.nameInitials;
    
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

function updateRecord(req, res) {
    Contact.findOneAndUpdate({_id: req.body._id}, req.body, {new: true}, (err, doc) => {           //With new: true, inside of the doc variable we'll have the 
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
            // console.log(docs);
        }else{
            console.log('Error in retrieving contact List: '+ err);
        }
    });
});

// Contact Card
router.get('/card', (req, res) => {
    Contact.find((err, docs) => {
        if(!err){
            res.render('contacts/card', {        // contacts directory > card.hbs file
                list: docs.map(Contact => Contact.toJSON())
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