'use strict';

var express = require('express'),
    route = express.Router();

route.post('/', function(/*req, res, next*/) {
    // no argv create new or error if any argv
});

route.put('/', function(/*req, res, next*/) {
    // no argv - update many
    // argv: id - update one if exists
});

route.get('/', function(/*req, res, next*/) {
    // no argv - get all
    // argv: id - get one if exists
});

route.delete('/', function(/*req, res, next*/) {
    // no argv - delete many
    // argv: id - delete if exists

});

module.exports = route;
