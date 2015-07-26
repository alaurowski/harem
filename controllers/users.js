var Users = require('../models/User');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

Schema = mongoose.Schema;

module.exports = function (app) {

    // get users
    app.get('/users', function(req, res){
        var query = Users.find({});
        query.exec(function (err, docs) {
            res.json(docs);
            return;
        });
    });
}