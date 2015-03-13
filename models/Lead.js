/**
 * Created by pkarwatka on 13.03.15.
 */
var mongoose = require('mongoose');

var leadSchema = new mongoose.Schema({

    createdAt: Date,
    updatedAt: Date,

    title: String, /** could be name of contract */
    subtitle: String, /** Stanowisko */

    state: String,
    stateHistory: Array,

    tags: Array,
    attachments: Array,

    source: String,
    contact: { type: mongoose.Schema.ObjectId, ref: 'Contact'},

    owner: String
});




module.exports = mongoose.model('Lead', leadSchema);
