const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

require('../models/User');
const User = mongoose.model('users');

router.get('/', ensureAuthenticated, (req, res) => {
    User.find({'company':true})
        .sort({date:'desc'})
        .then(company => {
            res.render('production/companies', {
                company:company
            });
        });
});

router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('production/companiesAdd');
});

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    User.findOne({
        _id: req.params.id
    })
        .then(company => {
            res.render('production/companiesEdit', {
                company:company
            });
        });
});

router.get('/detail/:id', ensureAuthenticated, (req, res) => {
    User.findOne({
        _id: req.params.id
    })
        .then(company => {
            res.render('production/companiesDetail', {
                company:company
            });
        });
});


router.delete('/:id', (req, res) => {
    User.remove({_id: req.params.id})
        .then(() => {
            req.flash('success_msg', 'Verwijderd!');
            res.redirect('/companies');
        });
});

module.exports = router;