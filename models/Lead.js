/**
 * Created by pkarwatka on 13.03.15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require("mongoose-paginate");

var leadSchema = new mongoose.Schema({
    createdAt: Date,
    updatedAt: Date,
    subtitle: { type: String, required: true, trim: true }, /** Stanowisko */
    state: {},
    stateHistory: Array,
    tags : Array,
    //files: [mongoose.Schema.Mixed],
    cv : {},
    source: {
        sourceName : { type: String, default: '' },
        recommendedBy : { type: String, default: '' }
    },
    contact: { type: mongoose.Schema.ObjectId, ref: 'Contact'},
    owner: String,
    description : String
});

leadSchema.plugin( mongoosePaginate );
module.exports = mongoose.model('Lead', leadSchema);
