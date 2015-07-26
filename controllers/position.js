var Position = require('../models/Positions');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

Schema = mongoose.Schema;

module.exports = function (app) {

    // add position
    app.post('/position', function(req, res) {

    });


    // get position
    app.get('/position', function(req, res){
        var query = Position.find({});
        query.exec(function (err, docs) {
            res.json(docs);
            return;
        });
    });


}