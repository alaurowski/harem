/**
 * Created by pkarwatka on 13.03.15.
 */
var mongoose = require('mongoose');

var attachmentSchema = new mongoose.Schema({

    createdAt: Date,
    updatedAt: Date,

    content: String,
    fileName: String,

    parentId: { type: mongoose.Schema.ObjectId },
    parentType: String,

    owner: String
});




module.exports = mongoose.model('Attachment', attachmentSchema);
module.exports.schema = attachmentSchema;