const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const TransactionSchema = new Schema({
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
    subject:{
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model('trxs', TransactionSchema);