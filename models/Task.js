/**
 * Created by pkarwatka on 13.03.15.
 */
var mongoose = require('mongoose');

var taskSchema = new mongoose.Schema({
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    content: { type: String},
    due: Date,
    extra: String,
    completed: Boolean,
    parentId: {type: mongoose.Schema.ObjectId},
    parentType: { type: String },
    status: String,
    owner: String
});

module.exports = mongoose.model('Task', taskSchema);