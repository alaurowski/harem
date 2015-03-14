/**
 * Created by pkarwatka on 13.03.15.
 */
var mongoose = require('mongoose');

var taskSchema = new mongoose.Schema({
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    content: { type: String, required: true },
    due: Date,
    parentId: {type: mongoose.Schema.ObjectId, required: true },
    parentType: { type: String, required: true },
    status: String,
    owner: String
});

module.exports = mongoose.model('Task', taskSchema);