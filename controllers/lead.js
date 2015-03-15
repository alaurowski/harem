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

module.exports = function (app) {

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
    app.get('/lead/index', function (req, res) {


        var filter = {}; // TODO: add filtering capabilities
        var query = Lead.find(filter, 'contact title subtitle source state createdAt modifiedAt owner tags', {}).populate('contact');
        query.exec(function (err, docs) {
            res.json(docs);
        });
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
            existingLead.cv = req.body.files;
            // social media
            existingLead.social.linkedin = req.body.linkedin;
            existingLead.social.goldenline = req.body.goldenline;
            existingLead.social.facebook = req.body.facebook;


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
                        err.errors.status = ApiStatus.STATUS_VALIDATION_ERROR;
                        err.errors.code = ApiStatus.CODE_VALIDATION_ERROR;

                        res.json(err.errors);
                        return;
                    }


                    existingLead.contact = existingContact._id;
                    existingLead.save(function (err2, savedLead) {

                        //if (req.files.cvfile.size !== 0) {
                        //    fs.exists(req.files.cvfile.path, function(exists) {
                        //        if(exists){
                        //            var fileName = req.files.cvfile.name;
                        //            var originalName = req.files.cvfile.originalname;
                        //            var mimeType = req.files.cvfile.mimetype;
                        //            // check is allowed
                        //            if(allowedMimeTypes.indexOf(mimeType) !== -1){
                        //                var file = new File({
                        //                    src: fileName,
                        //                    originalName: originalName,
                        //                    content : 'Cv',
                        //                    parentId : savedLead._id
                        //                });
                        //
                        //                file.save(function(err, savedFile) {
                        //                    if (err) return res.json({ status: err, code: ApiStatus.CODE_ERROR });
                        //                    savedLead.file = savedFile;
                        //
                        //                    savedLead.save(function(err) {
                        //                        if (err) {
                        //                            return res.json({ status: err, code: ApiStatus.CODE_ERROR });
                        //                        }
                        //                    });
                        //                });
                        //
                        //            }else{
                        //                return res.json({ status: err, code: ApiStatus.CODE_ERROR });
                        //            }
                        //        }
                        //    });
                        //}


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