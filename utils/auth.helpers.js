const GoogleStrategy = require("passport-google-oauth20").Strategy;
const initAuth = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((user, done) => {
        done(null, user);
    });
    passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback",
        },
        (token, refreshToken, profile, done) => {
            return done(null, {
                profile: profile,
                token: token,
            });
        }));
};

const checkAuth = (req, res, next) => {
    if (!req.session.token) {
        return res.redirect(res.locals.route.get("login").url(req.locale))
    }
    next()
}

module.exports = {
    initAuth: initAuth,
    checkAuth: checkAuth,
}