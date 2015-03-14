/**
 * Created by pkarwatka on 13.03.15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Note = require('./Note');
var Task = require('./Task');
var Tag = require('./Tag');
var File = require('./File');

var leadSchema = new mongoose.Schema({

    createdAt: Date,
    updatedAt: Date,

    title: { type: String, required: true, trim: true }, /** could be name of contract */
    subtitle: { type: String, required: true, trim: true }, /** Stanowisko */

    state: { type: String, required: true, trim: true },
    stateHistory: Array,

    tasks : [{ type: Schema.Types.ObjectId, ref: 'Task' }],
    tags : [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    notes : [{ type: Schema.Types.ObjectId, ref: 'Note' }],

    files: [File.schema],

    source: String,
    contact: { type: mongoose.Schema.ObjectId, ref: 'Contact'},

    owner: String
});


module.exports = mongoose.model('Lead', leadSchema);
