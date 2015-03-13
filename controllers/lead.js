/**
 * Created by pkarwatka on 13.03.15.
 */
var Lead = require('../models/Lead');
var Contact = require('../models/Contact');
var mongoose = require('mongoose');


module.exports = function(app){


    app.get('/lead/index',function(req,res){
        res.send('/ called successfully...');
    });


    app.post('/lead/edit',function(req,res) {

        Lead.findOne({_id: new mongoose.Schema.ObjectId(req.body._id)}, function (err, existingLead) {


            var existingContact = null;
            if (!existingLead) {
                existingLead = new Lead();
                existingLead.createdAt = new Date();
            }


             var contactId = null;
             if (existingLead.contact) {
                contactId = existingLead.contact.id;
             }

                // populate existing lead


                Contact.findOne({_id: contactId }, function (err, existingContact) {

                    if (!existingContact) {
                        existingContact = new Contact();
                    }

                    // populate existing contact


                    existingContact.save(function (err) {
                        if (err) throw err;


                        existingLead.contact = existingContact;
                        existingLead.save(function (err2) {

                            if (err2) throw err2;
                        });

                    });


                });




        });

    });




}