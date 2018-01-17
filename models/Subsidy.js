const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const SubsidySchema = new Schema({
    from:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    to:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    amount:{
        type: Number,
        required: true
    },
    transactionId:{
        type: Schema.Types.ObjectId,
        ref: 'trxs'
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model('subsidytrxs', SubsidySchema);