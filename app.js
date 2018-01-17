const express = require('express');
const path = require('path');
const exphbs  = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const {ensureAuthenticated, ensureGuest} = require('./helpers/auth');

const app = express();

const ideas = require('./routes/idea');
const users = require('./routes/users');
const kids = require('./routes/kids');
const companies = require('./routes/companies');
const transactions = require('./routes/transactions');
const dashboard = require('./routes/dashboard');
const inbox = require('./routes/inbox');
const table = require('./routes/table');
const calendar = require('./routes/calendar');
const contacts = require('./routes/contacts');

require('./config/passport')(passport);
const db = require('./config/database');

mongoose.Promise = global.Promise;
mongoose.connect(db.mongoURI, {
  useMongoClient: true
})
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));

const {formatDate} = require('./helpers/hbs');

app.engine('handlebars', exphbs({
    helpers:{
      formatDate:formatDate
    },
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'));
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  res.locals.kid = req.kid || null;
  next();
});

app.get('/', ensureGuest, (req, res) => {res.render('production/login')});
app.use('/dashboard', dashboard);
app.use('/ideas', ideas);
app.use('/users', users);
app.use('/kids', kids);
app.use('/companies', companies);
app.use('/transactions', transactions);
app.use('/inbox', inbox);
app.use('/table', table);
app.use('/calendar', calendar);
app.use('/contacts', contacts);
app.get('*', (req, res, next) => {res.render('404');})
app.put('*', (req, res, next) => {res.render('404');})
app.delete('*', (req, res, next) => {res.render('404');})

const port = process.env.PORT || 5000;
app.listen(port, () =>{console.log(`Server started on port ${port}`);});