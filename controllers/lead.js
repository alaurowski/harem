/**
 * Created by pkarwatka on 13.03.15.
 */
var Lead = require('../models/Lead');
var Note = require('../models/Note');
var Contact = require('../models/Contact');
var mongoose = require('mongoose');
var fs = require("fs");
var csv = require("fast-csv");

module.exports = function(app){

    app.post('/lead/import', function(req, res){

        var filename = "/Users/pkarwatka/Downloads/data.csv";

        var stream = fs.createReadStream(filename); //TODO: file upload support

        csv
            .fromStream(stream, {headers : true})
            .validate(function(data){

                var existingLead = new Lead();
                existingLead.createdAt = new Date();
                existingLead.title = data.name;
                existingLead.subtitle = data.title ? data.title :  'N/A' ;
                existingLead.state = 'New';
                existingLead.source = 'Linkedin';

                var existingContact = new Contact();
                var anames = data.name.trim(' ').replace("\t", '').split(' ');
                existingContact.firstName = anames[1];
                existingContact.lastName = anames[0];
                existingContact.email = anames[1][0].replace(/[^\w\s]/gi, '') + anames[0].replace(/[^\w\s]/gi, '') + '@divante.pl';
                existingContact.country = 'Polska'

                console.log("Importing row: " + JSON.stringify(data)+ " " + JSON.stringify(anames));


                existingContact.lead = existingLead;
                existingContact.save(function (err) {
                    if (err && err.errors) {
                        res.json(err.errors);
                    }


                    existingContact.lead.contact = existingContact._id;
                    existingContact.lead.save(function (err2) {

                        if (err2 && err2.errors) {
                            res.json(err2.errors);
                        }

                    });

                });


            })
            .on("data-invalid", function(data){
                //do something with invalid row
            })
            .on("data", function(data){
                console.log(data);
            })
            .on("end", function(){
                console.log("done");
            });


    });



    /**
     * List leads
     */
    app.get('/lead/index',function(req,res){


        var filter = {}; // TODO: add filtering capabilities
        var query = Lead.find(filter, 'contact title createdAt modifiedAt owner', { }).populate('contact');
        query.exec(function (err, docs) {

            res.json(docs);

        });
    });

    /**
     * Load single lead
     */
    app.get('/lead/fetch/:id',function(req, res){
        var leadId = req.params.id;
        if(leadId){
            Lead.findById(leadId, function (err, existingLead) {
                if(existingLead){



                    res.json(existingLead);
                }
            });
        }
    });

    /**
     * Save lead
     */
    app.post('/lead/edit',function(req,res) {

        Lead.findById(req.body._id, function (err, existingLead) {


            var existingContact = null;
            if (!existingLead) {
                existingLead = new Lead();
                existingLead.createdAt = new Date();
            }


             var contactId = null;
             if (existingLead.contact) {
                contactId = existingLead.contact;
             }

                // populate existing lead data
            existingLead.title = req.body.title;
            existingLead.subtitle = req.body.subtitle;
            existingLead.state = req.body.state;
            existingLead.source = req.body.source;


                Contact.findById(contactId, function (err, existingContact) {

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
                    existingContact.phone = req.body.phone;


                    existingContact.save(function (err) {
                        if (err && err.errors) {
                            res.json(err.errors);
                        }


                        existingLead.contact = existingContact._id;
                        existingLead.save(function (err2) {

                            if (err2 && err2.errors) {
                                res.json(err2.errors);
                            }

                        });

                    });


                });




        });

    });




}