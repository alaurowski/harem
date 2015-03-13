/**
 * Created by pkarwatka on 13.03.15.
 */
var mongoose = require('mongoose');

var noteSchema = new mongoose.Schema({

    createdAt: Date,
    updatedAt: Date,

    content: String,
    type: String,

    lead: { type: mongoose.Schema.ObjectId, ref: 'leadSchema'},

    owner: String
});




module.exports = mongoose.model('Note', noteSchema);
