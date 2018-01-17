const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const {ensureAuthenticated} = require('../helpers/auth');

require('../models/Transactions');
require('../models/Subsidy');
const Transaction = mongoose.model('trxs');
const SubsidyTransaction = mongoose.model('subsidytrxs');

router.get('/', ensureAuthenticated, (req, res) => {
    if(res.locals.user.municipality) {
        Transaction.find({})
            .populate('from')
            .populate('to')
            .sort({date:'desc'})
            .then(transaction => {
                res.render('production/transactions', {
                    transaction:transaction
                });
            });
    }
    if(res.locals.user.kid) {
        Transaction.find({from: res.locals.user.id})
            .populate('from')
            .populate('to')
            .sort({date:'desc'})
            .then(transaction => {
                res.render('production/transactions', {
                    transaction:transaction
                });
            });
    }

    if(res.locals.user.company) {
        Transaction.find({to: res.locals.user.id})
            .populate('from')
            .populate('to')
            .sort({date:'desc'})
            .then(transaction => {
                res.render('production/transactions', {
                    transaction:transaction
                });
            });
    }

});


router.get('/subsidy', ensureAuthenticated, (req, res) => {
    SubsidyTransaction.find({})
        .populate('from')
        .populate('to')
        .sort({date:'desc'})
        .then(subsidy => {
            console.log(subsidy);
            res.render('production/subsidy', {
                subsidy:subsidy
            });
        });
});

module.exports = router;