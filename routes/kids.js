const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

require('../models/User');
require('../models/Transactions');
const transactionClass = require('../app/Transaction');
const User = mongoose.model('users');
const Transactions = mongoose.model('trxs');

router.get('/', ensureAuthenticated, (req, res) => {
    User.find({'kid':true})
        .sort({date:'desc'})
        .then(kid => {
            res.render('production/kids', {
                kid:kid
            });
        });
});

router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('production/kidsAdd');
});

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    User.findOne({
        _id: req.params.id
    })
    .then(kid => {
            res.render('production/kidsEdit', {
                kid:kid
            });
    });
});

router.get('/detail/:id', ensureAuthenticated, (req, res) => {
    User.findOne({
        _id: req.params.id
    })
        .then(kid => {
            res.render('production/kidsDetail', {
                kid:kid
            });
        });
});

router.delete('/:id', ensureAuthenticated, (req, res) => {
    User.remove({_id: req.params.id})
        .then(() => {
            req.flash('success_msg', 'Verwijderd!');
            res.redirect('/kids');
        });
});

router.put('/spend/:idUser/:idCompany', ensureAuthenticated, (req, res) => {
        let opties = req.body.option;

        let companyBankAccount;
        let newCompanyBankAccount;

        User.findOne({
            _id: req.params.idUser
        }).then(user => {
            if(user.bankAccount < req.body.costs) {
                req.flash('error', 'Onvoldoende tokens beschikbaar');
                res.redirect('/companies');
            } else {
                user.bankAccount = user.bankAccount - req.body.costs;

                let nieuwAantalGevolgdeLessen = Number(user.gevolgdeLessen) + 1;
                user.gevolgdeLessen = nieuwAantalGevolgdeLessen;

                user.save();

                User.findOne({
                    _id:req.params.idCompany
                }).then(company => {
                    companyBankAccount = company.bankAccount;
                    newCompanyBankAccount = Number(companyBankAccount) + Number(req.body.costs);
                    company.bankAccount = newCompanyBankAccount;
                    company.save();
                }).then(() => {
                    req.flash('success_msg', 'U heeft betaald');
                    res.redirect('/companies');
                });
            }
        });

        /* put in object and call function */
        let transactionObject = {
            idUser : req.params.idUser,
            idCompany : req.params.idCompany,
            amount : req.body.costs,
            subject: req.body.subject
        };

        transactionClass.spendTokens(transactionObject);

});

module.exports = router;