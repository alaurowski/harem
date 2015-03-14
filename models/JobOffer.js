/**
 * Created by pkarwatka on 13.03.15.
 */
var mongoose = require('mongoose');

var joSchema = new mongoose.Schema({

    title: { type: String, require: true }
});

module.exports = mongoose.model('JobOffer', joSchema);