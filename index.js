const express = require("express");
// This will parse cookie header and populate requested cookies
const cookieParser = require("cookie-parser");
// This will parse incoming request bodies i.e (req.body)
const bodyParser = require("body-parser");

const app = express();
const db = require("./config/database");
const { PORT, MONGODB_URL, SESSION_SECRET_KEY } = process.env;
const expressLayouts = require("express-ejs-layouts");
// This section is used for session cookies
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");

const MongoStore = require("connect-mongo")(session);
const flash = require("connect-flash");
const customMware = require("./config/middleware");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(expressLayouts);

// This is to set up view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// mongo store is used to store the session cookie in the db
app.use(
  session({
    name: "Employee review system",
    //TODO change secret before deployment
    secret: "abcd",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: new MongoStore(
      {
        mongooseConnection: db,
        autoRemove: "disabled",
      },
      function (err) {
        console.log(err || "connect-mongo setup done");
      }
    ),
  })
);

app.use(passport.initialize());
app.use(passport.session());

// sets the authenticated user in the response
app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

// use express router
app.use("/", require("./routes"));

app.listen(8000, (err) => {
  if (err) {
    console.log(`Error in running the server: ${err}`);
  }
  console.log(`Server is running on port: ${8000}`);
});
