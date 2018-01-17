const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

require('../models/User');
const User = mongoose.model('users');

router.get('/', ensureAuthenticated, (req, res) => {
    User.find({})
        .sort({date:'desc'})
        .then(company => {
            res.render('production/table', {
                company:company
            });
        });
});

module.exports = router;