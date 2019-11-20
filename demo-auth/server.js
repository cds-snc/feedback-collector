const express = require("express"),
  app = express(),
  passport = require("passport"),
  auth = require("./auth"),
  cookieParser = require("cookie-parser"),
  cookieSession = require("cookie-session"),
  path = require("path");

auth(passport);
app.use(passport.initialize());

app.use(
  cookieSession({
    name: "session",
    keys: ["SECRECT KEY"],
    maxAge: 24 * 60 * 60 * 1000
  })
);
app.use(cookieParser());

app.get("/", (req, res) => {
  if (req.session.token) {
    res.cookie("token", req.session.token);
    res.json({
      status: "session cookie set",
      name: req.session.profile.displayName
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname + "/login.html"));
});

app.get("/logout", (req, res) => {
  req.logout();
  req.session = null;
  res.redirect("/");
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile"]
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/google" }),
  function(req, res) {
    // Successful authentication, redirect home.
    req.session.profile = req.user.profile;
    req.session.token = req.user.token;
    res.redirect("/");
  }
);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
