// import environment variables.
require('dotenv').config()

// import node modules.
const express = require('express')
const cookieParser = require('cookie-parser')
const compression = require('compression')
const helmet = require('helmet')
const path = require('path')
const cookieSession = require('cookie-session')
const cookieSessionConfig = require('./config/cookieSession.config')
const { hasData } = require('./utils')
const { addNunjucksFilters } = require('./filters')
const csp = require('./config/csp.config')
const csrf = require('csurf')
const mongoose = require('mongoose')
const passport = require('passport');
const { initAuth } = require('./utils')

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// check to see if we have a custom configRoutes function
let { configRoutes, routes, locales } = require('./config/routes.config')

if (!configRoutes) configRoutes = require('./utils/route.helpers').configRoutes
if (!locales) locales = ['en', 'fr']

// initialize application.
const app = express()

initAuth(passport)
app.use(passport.initialize())

// general app configuration.
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser(process.env.app_session_secret))
app.use(require('./config/i18n.config').init)

// CSRF setup
app.use(
  csrf({
    cookie: true,
    signed: true,
  }),
)

// append csrfToken to all responses
app.use(function(req, res, next) {
  res.locals.csrfToken = req.csrfToken()
  next()
})

// in production: use redis for sessions
// but this works for now
app.use(cookieSession(cookieSessionConfig))

// public assets go here (css, js, etc)
app.use(express.static(path.join(__dirname, 'public')))

// dnsPrefetchControl controls browser DNS prefetching
// frameguard to prevent clickjacking
// hidePoweredBy to remove the X-Powered-By header
// hsts for HTTP Strict Transport Security
// ieNoOpen sets X-Download-Options for IE8+
// noSniff to keep clients from sniffing the MIME type
// xssFilter adds some small XSS protections
app.use(helmet())
app.use(helmet.contentSecurityPolicy({ directives: csp }))
// gzip response body compression.
app.use(compression())

// auth stuff
// app.use(cookieSession({
//   name: 'session',
//   keys: ['SECRECT KEY'],
//   maxAge: 24 * 60 * 60 * 1000,
// }));
// app.use(cookieParser());

// app.get('/', (req, res) => {
//   if (req.session.token) {
//       res.cookie('token', req.session.token);
//       res.json({
//           status: 'session cookie set',
//       });
//   } else {
//       res.cookie('token', '')
//       res.json({
//           status: 'session cookie not set',
//       });
//   }
// });

app.get('/logout', (req, res) => {
  req.logout();
  req.session = null;
  res.redirect('/');
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile"],
  }),
)

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/google" }),
  function(req, res) {
    // Successful authentication, redirect home.
    req.session.profile = req.user.profile;
    req.session.token = req.user.token;
    res.redirect("/");
  },
);

// Adding values/functions to app.locals means we can access them in our templates
app.locals.GITHUB_SHA = process.env.GITHUB_SHA || null
app.locals.hasData = hasData

// set default views path
app.locals.basedir = path.join(__dirname, './views')
app.set('views', [path.join(__dirname, './views')])

app.routes = configRoutes(app, routes, locales)

// view engine setup
const nunjucks = require('nunjucks')

const env = nunjucks
  .configure([...app.get('views'), 'views/macros'], {
    autoescape: true,
    express: app,
  })
  .addGlobal('$env', process.env)

addNunjucksFilters(env)

nunjucks.installJinjaCompat()

app.set('view engine', 'njk')

module.exports = app
