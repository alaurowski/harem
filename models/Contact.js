/**
 * Created by pkarwatka on 13.03.15.
 */
var mongoose = require('mongoose');

var contactSchema = new mongoose.Schema({
    createdAt: Date,
    updatedAt: Date,
    firstName: { type: String, required: true, trim: true},
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: false, trim: true,  match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'] },
    phone: { type: String, required: false, trim: true },
    social : {
        linkedin : { type: String, default: '' },
        goldenline : { type: String, default: '' },
        facebook : { type: String, default: '' }
    },
    country: String,
    city: String,
    address: String
});




module.exports = mongoose.model('Contact', contactSchema);
