const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');

router.get('/', ensureAuthenticated,(req, res) => {
    res.render('production/calendar');
});

module.exports = router;
