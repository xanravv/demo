const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');

require('../models/User');
const User = mongoose.model('users');

router.get('/login', (req, res) => {res.render('users/login');});
router.get('/registerOld', (req, res) => {res.render('users/register');});
router.get('/profile', (req, res) => {res.render('production/profile');});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect:'/',
        failureRedirect:'/',
        failureFlash:true
    })(req, res, next);
});

router.post('/register', (req, res) => {
    let errors = [];
    if(!req.body.password) {
        errors.push({text: 'Geef aub een paswoord op'});
    }
    if(req.body.password.length < 4) {
        errors.push({text: 'Password must be at least 4 characters'});
    }
    if (errors.length > 0) {
        res.render('users/register', {
            errors:errors,
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
        });
    } else {
        User.findOne({email:req.body.email})
        .then (user => {
            if(user){
                req.flash('error_msg', 'Email already registered')
                res.redirect('/');
            } else {
                const newUser = new User ({
                    firstName:req.body.firstName,
                    lastName:req.body.lastName,
                    email:req.body.email,
                    age:req.body.age,
                    bankAccount:req.body.bankAccount,
                    password:req.body.password,
                    companyName:req.body.companyName,
                    companyInformation:req.body.companyInformation,
                    companySports:[{
                        sport:req.body.companySport,
                        price:req.body.companySportPrice
                    }],
                    branche:req.body.branche,
                    location:req.body.location,
                    personalInformation:req.body.personalInformation,
                    interests:req.body.interests,
                    messages:req.body.messages,
                    notifications:req.body.notifications,
                    employee:req.body.roleEmployee,
                    kid:req.body.roleKid,
                    company:req.body.roleCompany
                })

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) {throw err};
                        newUser.password = hash;
                        newUser.save()
                        .then(() => {
                            req.flash('error', 'Geregistreerd!');
                            res.redirect('/');
                        })
                        .catch (err => {
                            console.log(err);
                        return;
                        })
                    });
                });

            }
        })
    }
});

router.put('/:id', ensureAuthenticated, (req, res) => {
    User.findOne({
        _id: req.params.id
    })
        .then(user => {
            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.email = req.body.email;
            user.age = req.body.age;
            user.bankAccount = req.body.bankAccount;
            user.subsidyAccount = req.body.subsidyAccount;
            user.password = req.body.password;
            user.companyName = req.body.companyName;
            user.companyInformation = req.body.companyInformation;
            user.branche = req.body.branche;
            user.location = req.body.location;
            user.personalInformation = req.body.personalInformation;
            user.interests = req.body.interests;
            user.messages = req.body.messages;
            user.notifications = req.body.notifications;
            user.employee = req.body.roleEmployee;
            user.kid = req.body.roleKid;
            user.company = req.body.roleCompany;

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(req.body.password, salt, (err, hash) => {
                    if(err) {throw err};
                    user.password = hash;
                    user.save()
                        .then(() => {
                            req.flash('success_msg', 'Gegevens bijgewerkt');
                            res.redirect('/');
                        })
                        .catch (err => {
                            console.log(err);
                            return;
                        })
                });
            });
        });
});

router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
})

module.exports = router;