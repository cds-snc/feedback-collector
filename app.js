// import environment variables.
require('dotenv').config()

// import node modules.
const express = require('express')
const cookieParser = require('cookie-parser')
const compression = require('compression')
const helmet = require('helmet')
const path = require('path')
const sessionConfig = require('./config/session.config')
const { hasData } = require('./utils')
const { addNunjucksFilters } = require('./filters')
const csp = require('./config/csp.config')
const mongoose = require('mongoose')
const passport = require('passport');
const { initAuth } = require('./utils')
const cors = require("cors")

mongoose.connect(process.env.MONGO_URL, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
  useFindAndModify: false, 
  useCreateIndex: true,
});
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
app.use(cors())

// in production: use redis for sessions
// but this works for now
app.use(sessionConfig)

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

app.get('/logout', (req, res) => {
  req.session.token = null
  req.session.profile = null
  res.redirect('/')
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
  (req, res) => {
    // Successful authentication, redirect home.
    req.session.profile = req.user.profile;
    req.session.token = req.user.token;
    req.session.save((err) => {
      if(err) {
        console.log("error!!!!!!!", err)
      }
      res.redirect("/");
    })
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
