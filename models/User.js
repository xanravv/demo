const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
    firstName:{
        type: String,
        default: null
    },
    lastName:{
        type: String,
        default: null
    },
    email:{
        type: String,
        required: true
    },
    age:{
        type: Number,
        default: null
    },
    gevolgdeLessen:{
        type: Number,
        default: null
    },
    bankAccount:{
        type: Number,
        default:null
    },
    subsidyAccount:{
        type: Number,
        default:null
    },
    password:{
        type: String,
        required: true
    },
    companyName:{
        type: String,
        default:null
    },
    companyInformation: {
        type: String,
        default:null
    },
    companySports: [{
        sport: String,
        price: Number
    }],
    branche:{
        type: String,
        default:null
    },
    location:{
        type: String,
        default:null
    },
    personalInformation: {
        type: String,
        default:null
    },
    interests:{
        type: String,
        default: null
    },
    messages :{
        type: Object,
        default: null
    },
    notifications: {
        type: Object,
        default:null
    },
    municipality:{
        type: Boolean,
        default: false
    },
    employee:{
        type: Boolean,
        default: false
    },
    kid:{
        type: Boolean,
        default: false
    },
    company:{
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('users', UserSchema);