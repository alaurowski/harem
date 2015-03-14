/**
 * Created by Bartosz on 2015-03-14.
 */
var mongoose = require('mongoose');

var fileSchema = new mongoose.Schema({
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    src: String,
    originalName: String,

    content: String,

    parentId: { type: mongoose.Schema.ObjectId },
    parentType: String,

    owner: String
});

module.exports = mongoose.model('File', fileSchema);
module.exports.schema = fileSchema;