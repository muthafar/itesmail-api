if (process.env.NORDE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
require("./services/passport");
const authRoutes = require("./routes/authRoutes");
const billingRoutes = require("./routes/billingRoutes");
const surveyRoutes = require("./routes/surveyRoutes");

const MongoDBStore = require("connect-mongo");
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    optionsSuccessStatus: 200,
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("trust proxy", 1);
const sessionConfig = {
  store: MongoDBStore.create({
    mongoUrl: process.env.MONGODB_URI,
  }),
  name: "session",

  secret: process.env.COOKIE_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

app.use("/", authRoutes);
app.use("/", billingRoutes);
app.use("/api/surveys", surveyRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT);
