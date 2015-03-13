/**
 * Created by pkarwatka on 13.03.15.
 */
var mongoose = require('mongoose');

var contactSchema = new mongoose.Schema({

    createdAt: Date,
    updatedAt: Date,

    firstName: String,
    lastName: String,

    facebookUrl: String,
    linkedinUrl: String,

    country: String,
    city: String,
    address: String

});




module.exports = mongoose.model('Contact', contactSchema);
