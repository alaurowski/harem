/**
 * Created by pkarwatka on 13.03.15.
 */
var mongoose = require('mongoose');

var activityLogSchema = new mongoose.Schema({

    createdAt: Date,

    content: String,
    type: String,

    parentId: { type: mongoose.Schema.ObjectId },
    parentType: String,

    owner: String
});




module.exports = mongoose.model('ActivityLog', activityLogSchema);
