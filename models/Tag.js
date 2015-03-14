/**
 * Created by pkarwatka on 13.03.15.
 */
var mongoose = require('mongoose');

var tagSchema = new mongoose.Schema({

    tag: String,
    type: String,

    parentId: { type: mongoose.Schema.ObjectId },
    parentType: String,

    color: String
});

module.exports = mongoose.model('Tag', tagSchema);