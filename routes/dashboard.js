const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../models/Transactions');
const Transaction = mongoose.model('trxs');

const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');

router.get('/', ensureAuthenticated,(req, res) => {res.render('production/index')});

module.exports = router;
