/**
 * Created by pkarwatka on 13.03.15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var noteSchema = new mongoose.Schema({

    createdAt: Date,
    updatedAt: Date,

    content: String,
    type: String,

    files: [Schema.Types.Mixed],

    parentId: { type: mongoose.Schema.ObjectId },
    parentType: String,

    owner: String
});




module.exports = mongoose.model('Note', noteSchema);
module.exports.schema = noteSchema;
