/**
 * Created by pkarwatka on 13.03.15.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,

    leadSchema = new Schema({
    createdAt: Date,
    updatedAt: Date,
    subtitle:  { type: ObjectId, ref: 'Position' },
    state:  { type: ObjectId, ref: 'State' },
    stateHistory: Array,
    tags : Array,
    cv : {},
    source: {
        sourceName : { type: String, default: '' },
        recommendedBy : { type: String, default: '' }
    },
    contact: {
        fullName: { type: String, required: true, trim: true},
        email: { type: String, required: false, trim: true,  match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'] },
        phone: { type: String, required: false, trim: true },
        social : {
            linkedin : { type: String, default: '' },
            goldenline : { type: String, default: '' },
            facebook : { type: String, default: '' }
        },
        companyName: String,
        companyPosition: String,
        country: String,
        city: String,
        address: String
    },
    owner: { type: ObjectId, ref: 'User' },
    description : String
});

module.exports = mongoose.model('Lead', leadSchema);