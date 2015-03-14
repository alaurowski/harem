/**
 * Created by pkarwatka on 13.03.15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Tag = require('./Tag');
var File = require('./File');

var leadSchema = new mongoose.Schema({

    createdAt: Date,
    updatedAt: Date,

    title: { type: String, required: true, trim: true }, /** could be name of contract */
    subtitle: { type: String, required: true, trim: true }, /** Stanowisko */

    state: { type: String, required: true, trim: true },
    stateHistory: Array,

    tags : String,

    files: [File.schema],

    source: String,
    contact: { type: mongoose.Schema.ObjectId, ref: 'Contact'},

    owner: String
});


module.exports = mongoose.model('Lead', leadSchema);
