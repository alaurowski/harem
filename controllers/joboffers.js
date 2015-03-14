/**
 * Created by pkarwatka on 13.03.15.
 */
var JobOffer = require('../models/JobOffer');
var mongoose = require('mongoose');
var fs = require("fs");

module.exports = function(app){



    /**
     * List job offers
     */
    app.get('/joboffers/index',function(req,res){


        var filter = {}; // TODO: add filtering capabilities
        var query = JobOffer.find(filter, 'title', { });
        query.exec(function (err, docs) {

            res.json(docs);

        });
    });




}