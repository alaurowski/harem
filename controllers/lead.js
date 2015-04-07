/**
 * Created by pkarwatka on 13.03.15.
 */
var Lead = require('../models/Lead');
var Note = require('../models/Note');
var Task = require('../models/Task');
var File = require('../models/File');
var LeadState = require('../models/LeadState');
var ApiStatus = require('../models/ApiStatus');
var Contact = require('../models/Contact');
var mongoose = require('mongoose');
var fs = require("fs");
var csv = require("fast-csv");
var mongoosePaginate = require("mongoose-paginate");
Schema = mongoose.Schema;

module.exports = function (app) {

    /**
     * Delete lead
     */
    app.post('/lead/delete/:lead_id', function(req, res) {
        var leadId = req.params.lead_id;
        Lead.remove({ _id: leadId }, function(err) {
            if (err) {
                return res.json({ status: err, code: ApiStatus.CODE_ERROR });
            }else{
                return res.json({ status: ApiStatus.STATUS_SUCCESS, code: ApiStatus.CODE_SUCCESS });
            }
        });
    });

    /**
     * Get available lead states
     */
    app.get('/lead/states', function(req, res){

        var query = LeadState.find({}, 'code name', {});
        query.exec(function (err, docs) {
            res.json(docs);
            return;
        });

    });


    /**
     * Get available subtitles for autocomplete
     */
    app.get('/lead/subtitle/fetch_all', function(req, res){
        Lead.find().distinct('subtitle', function(error, titles) {
            return res.json(titles);
        });
    });


    /**
     * Get available subtitles for autocomplete
     */
    app.get('/lead/tags/fetch_all', function(req, res){
        var query = Lead.find().distinct('tags', function(error, titles) {});
        var tags = new Array();

        query.exec(function (err, result) {
            for (var key in result) {
                tags.push( result[key].text)
            }
            return res.json(tags);
        });
    });

    /**
     * Change lead state in workflow
     */
    app.post('/lead/change_state', function (req, res) {
        Lead.findById(req.body._id, function (err, existingLead) {

            if (!existingLead) {
                res.json({status: ApiStatus.STATUS_ERROR, code: ApiStatus.CODE_ERROR});
                return;
            }

            existingLead.state = req.body.state;
            existingLead.save();

            res.json({status: ApiStatus.STATUS_SUCCESS, code: ApiStatus.CODE_SUCCESS});
            return;
        });
    });


    app.post('/lead/import', function (req, res) {

        var filename = "/Users/Marcin/Projects/data.csv";

        var stream = fs.createReadStream(filename); //TODO: file upload support

        csv
            .fromStream(stream, {headers: true})
            .validate(function (data) {

                var existingLead = new Lead();
                existingLead.createdAt = new Date();
                existingLead.title = data.name;
                existingLead.subtitle = data.title ? data.title : 'N/A';
                existingLead.state = 'New';
                existingLead.source = 'Linkedin';

                var existingContact = new Contact();
                var anames = data.name.trim(' ').replace("\t", '').split(' ');
                existingContact.firstName = anames[1];
                existingContact.lastName = anames[0];
                existingContact.email = anames[1][0].replace(/[^\w\s]/gi, '') + anames[0].replace(/[^\w\s]/gi, '') + '@divante.pl';
                existingContact.country = 'Polska'

                console.log("Importing row: " + JSON.stringify(data) + " " + JSON.stringify(anames));


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
            .on("data-invalid", function (data) {
                //do something with invalid row
            })
            .on("data", function (data) {
                console.log(data);
            })
            .on("end", function () {
                console.log("done");
            });


    });


    /**
     * List leads
     */
    app.get('/lead/index/:now_page/:items_per_page/:q?', function (req, res) {

        var page = req.params.now_page;
        var perPage = req.params.items_per_page;
        var q = req.params.q;

        Lead.paginate({'contact.firstName': q}, page, perPage, function (error, pageCount, paginatedResults, itemCount) {
            if (error) {
                if (error && error.errors) {
                    error.errors.status = ApiStatus.STATUS_VALIDATION_ERROR;
                    error.errors.code = ApiStatus.CODE_VALIDATION_ERROR;
                    res.json(error.errors);
                    return;
                }
            } else {
                var results = {};
                results.pages = pageCount;
                results.result = paginatedResults;
                res.json(results);
            }
        }, {populate: 'contact'});
    });

    /**
     * Load single lead
     *
     * @todo Need to push collected data to existingLead variable
     */
    app.get('/lead/fetch/:id', function (req, res) {
        var leadId = req.params.id;
        if (leadId) {
            Lead.findById(leadId, function (err, existingLead) {
                if (existingLead) {

                    console.log(existingLead);

                    res.json(existingLead);
                }
            }).populate("contact");
        }
    });

    /**
     * Save lead
     */
    app.post('/lead/save_tags',function(req,res) {
        Lead.findById(req.body._id, function (err, existingLead) {

            if (!existingLead) {
                res.json({status: ApiStatus.STATUS_ERROR, code: ApiStatus.CODE_ERROR});
                return;
            }

            existingLead.tags = req.body.tags;
            existingLead.save();

            res.json({status: ApiStatus.STATUS_SUCCESS, code: ApiStatus.CODE_SUCCESS});
            return;
        });
    });

    /**
     * Save lead
     */
    app.post('/lead/edit', function (req, res) {

        console.log(req.body);
        console.log('---------------------------------');

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

            existingLead.subtitle = req.body.subtitle;
            existingLead.state = req.body.state;
            existingLead.source.sourceName = req.body.source;
            existingLead.source.recommendedBy = req.body.recommendedBy;

            if(req.body.files !== undefined){
                existingLead.cv = req.body.files;
            }

            existingLead.description = req.body.description;
            existingLead.tags = req.body.tags;

            Contact.findById(contactId, function (err, existingContact) {

                if (!existingContact) {
                    existingContact = new Contact();
                }

                // populate existing contact data
                existingContact.firstName = req.body.firstName;
                existingContact.lastName = req.body.lastName;
                existingContact.email = req.body.email;
                existingContact.country = req.body.country;
                existingContact.city = req.body.city;
                existingContact.address = req.body.address;
                existingContact.phone = req.body.phone;
                // social media
                existingContact.social.linkedin = req.body.linkedin;
                existingContact.social.goldenline = req.body.goldenline;
                existingContact.social.facebook = req.body.facebook;

                existingContact.save(function (err) {
                    if (err && err.errors) {
                        err.errors.status = ApiStatus.STATUS_VALIDATION_ERROR;
                        err.errors.code = ApiStatus.CODE_VALIDATION_ERROR;

                        res.json(err.errors);
                        return;
                    }


                    existingLead.contact = existingContact._id;
                    existingLead.save(function (err2, savedLead) {

                        if (err2 && err2.errors) {
                            err2.errors.status = ApiStatus.STATUS_VALIDATION_ERROR;
                            err2.errors.code = ApiStatus.CODE_VALIDATION_ERROR;
                            res.json(err2.errors);
                            return;
                        }

                        res.json({
                            status: ApiStatus.STATUS_SUCCESS,
                            code: ApiStatus.CODE_SUCCESS,
                            lead_id: savedLead._id
                        });
                        return;

                    });

                });
            });
        });

    });


}