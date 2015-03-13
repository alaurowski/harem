/**
 * Created by pkarwatka on 13.03.15.
 */
var mongoose = require('mongoose');

var backgroundSchema = new mongoose.Schema({

    company: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },

    fromDate: {type: Date, required: true},
    toDate: {type: Date, required: false},

    description: String,
    due: Date,

    contact: { type: mongoose.Schema.ObjectId, ref: 'Contact'}
});




module.exports = mongoose.model('Background', backgroundSchema);
