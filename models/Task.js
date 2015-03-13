/**
 * Created by pkarwatka on 13.03.15.
 */
var mongoose = require('mongoose');

var taskSchema = new mongoose.Schema({

    createdAt: Date,
    updatedAt: Date,

    content: String,
    due: Date,

    parentId: { type: mongoose.Schema.ObjectId },
    parentType: String,

    owner: String
});




module.exports = mongoose.model('Task', taskSchema);
