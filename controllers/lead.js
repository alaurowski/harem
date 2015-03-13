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

                // populate existing lead data
            existingLead.title = req.body.title;
            existingLead.subtitle = req.body.subtitle;
            existingLead.state = req.body.state;
            existingLead.source = req.body.source;


                Contact.findOne({_id: contactId }, function (err, existingContact) {

                    if (!existingContact) {
                        existingContact = new Contact();
                    }

                    // populate existing contact data
                    existingContact.firstName = req.body.firstName;
                    existingContact.lastName = req.body.lastName;
                    existingContact.email = req.body.email;
                    existingContact.linkedinUrl = req.body.linkedinUrl;
                    existingContact.facebookUrl = req.body.facebookUrl;
                    existingContact.country = req.body.country;
                    existingContact.city = req.body.city;
                    existingContact.address = req.body.address;

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