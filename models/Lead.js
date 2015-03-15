/**
 * Created by pkarwatka on 13.03.15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var leadSchema = new mongoose.Schema({

    createdAt: Date,
    updatedAt: Date,
    subtitle: { type: String, required: true, trim: true }, /** Stanowisko */
    state: {},
    stateHistory: Array,
    tags : Array,
    files: [mongoose.Schema.Mixed],
    cv : {},
    source: {
        sourceName : String,
        recommendedBy : String
    },
    contact: { type: mongoose.Schema.ObjectId, ref: 'Contact'},
    owner: String,
    description : String
});


module.exports = mongoose.model('Lead', leadSchema);
