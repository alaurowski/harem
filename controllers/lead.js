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
var Position = require('../models/Positions');
var mongoose = require('mongoose');
var fs = require("fs");
var csv = require("fast-csv");
var bodyParser = require('body-parser')

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

    app.get('/lead/export', function (req, res) {

    });

    app.get('/lead/import', function (req, res) {
        var fileName = req.params.id;

        var stream = fs.createReadStream(fileName);

        csv
            .fromStream(stream, {headers: true})
            .validate(function (data) {

                var anames = data.name.trim(' ').replace("\t", '').split(' ');

                var existingLead = new Lead();
                existingLead.createdAt = new Date();
                existingLead.title = data.name;
                existingLead.subtitle = data.title ? data.title : 'N/A';
                existingLead.state = 'New';
                existingLead.source = 'Linkedin';
                existingLead.contact.fullName = anames[0] + ' ' + anames[1];
                existingLead.contact.email = anames[1][0].replace(/[^\w\s]/gi, '') + anames[0].replace(/[^\w\s]/gi, '') + '@divante.pl';
                existingLead.contact.country = 'Polska'

               // console.log("Importing row: " + JSON.stringify(data) + " " + JSON.stringify(anames));

                existingLead.save(function (err) {
                    if (err && err.errors) {
                        res.json(err.errors);
                    }
                });
            })
            .on("data-invalid", function (data) {
                //do something with invalid row
            })
            .on("data", function (data) {
             //   console.log(data);
            })
            .on("end", function () {
                console.log("done");
            });
    });


    /**
     * List leads
     */
    app.post('/lead/index/:now_page/:items_per_page', function (req, res) {
        console.log('BODY:');
        console.log(req.body);

        var page = parseInt(req.params.now_page);
        page -= 1;
        var perPage = parseInt(req.params.items_per_page);

        var statusFilter =  req.body.q_status;
        var tagFilter =  req.body.q_tags;
        var searchFilter =  req.body.q_search;
        var queryFilters ;

        var filters = [];

        if(searchFilter){
            filters.push({
                $or:[
                    {
                        "contact.email":new RegExp(searchFilter, 'i')
                    },
                    {
                        "contact.fullName":new RegExp(searchFilter, 'i')
                    },
                    {
                        "contact.city":new RegExp(searchFilter, 'i')
                    },
                    {
                        "contact.country":new RegExp(searchFilter, 'i')
                    },
                    {
                        "owner":new RegExp(searchFilter, 'i')
                    }
                ]
            });
        }



        if(tagFilter){
            var tags = tagFilter.split(',');
            filters.push({ tags: { $elemMatch: { text: {$in:tags} } }  });
        }

        if(statusFilter) {
            var statusList = statusFilter.split(',');
            filters.push({ 'state.code': { $in : statusList} });
        }

        var query = Lead.find();

        for (var i = 0; i < filters.length; i++) {
            query.where(filters[i]);
        }

        query.skip(page * perPage)
            .limit(perPage)
            .sort({ createdAt: 'desc'})

        query.exec(function (error, leads) {

            if(error){
                return res.json({ status: error, code: ApiStatus.CODE_ERROR });
            }



            var query2 = Lead.find();

            for (var i = 0; i < filters.length; i++) {
                query2.count(filters[i]);
            }

            query2.find().count(function(error, count) {
                if(error){
                    return res.json({ status: error, code: ApiStatus.CODE_ERROR });
                }else{
                    var results = {};
                    results.pages = parseInt(Math.ceil(count/perPage));
                    results.result = leads;
                    res.json(results);
                }
            });
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
                    res.json(existingLead);
                }
            });
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

            //console.log(req.body);

            if (!existingLead) {
                existingLead = new Lead();
                existingLead.createdAt = new Date();

                existingLead.owner = req.user.profile.name || req.user.email;
                existingLead.state = { name: 'New', code: 'new' };
            } else {
                existingLead.owner = req.body.owner;
                existingLead.state = req.body.state;
            }

            existingLead.subtitle = req.body.subtitle;

            existingLead.description = req.body.description;
            existingLead.tags = req.body.tags;

            existingLead.source.sourceName = req.body.source;
            existingLead.source.recommendedBy = req.body.recommendedBy;

            existingLead.contact.fullName = req.body.fullName;
            existingLead.contact.email = req.body.email;
            existingLead.contact.country = req.body.country;
            existingLead.contact.city = req.body.city;
            existingLead.contact.address = req.body.address;
            existingLead.contact.phone = req.body.phone;
            existingLead.contact.social.linkedin = req.body.linkedin;
            existingLead.contact.social.goldenline = req.body.goldenline;
            existingLead.contact.social.facebook = req.body.facebook;

            existingLead.contact.companyName = req.body.companyName;
            existingLead.contact.companyPosition = req.body.companyPosition;



            if(req.body.files !== undefined){
                existingLead.cv = req.body.files;
            }

            Position.findOne({ name: req.body.subtitle }, function (err, positionDoc) {
                if (!positionDoc) {
                    positionDoc = new Position();
                    positionDoc.name = req.body.subtitle;
                    positionDoc.save();
                }
            });

            existingLead.save(function (error, savedLead) {
                if (error && error.errors) {
                    error.errors.status = ApiStatus.STATUS_VALIDATION_ERROR;
                    error.errors.code = ApiStatus.CODE_VALIDATION_ERROR;
                    res.json(error.errors);
                    return false;
                }else{
                    res.json({
                        status: ApiStatus.STATUS_SUCCESS,
                        code: ApiStatus.CODE_SUCCESS,
                        lead_id: savedLead._id
                    });
                    return true;
                }
            });


        });

    });


}