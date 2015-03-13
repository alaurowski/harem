/**
 * Created by pkarwatka on 13.03.15.
 */
var mongoose = require('mongoose');

var leadStateSchema = new mongoose.Schema({
    code: String,
    name: String

});




module.exports = mongoose.model('LeadState', leadStateSchema);
