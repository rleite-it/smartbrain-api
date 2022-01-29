const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const db = require("knex")({
  client: "pg",
  connection: {
    host: "postgresql-cubic-98195",
    user: "postgres",
    password: "password",
    database: "smart-brain",
  },
});

const app = express();

app.use(express.json());
app.use(cors());

// GET ALL USERS
app.get("/", (req, res) => {});

// SIGN IN
app.post("/signin", (req, res) => {
  signin.handleSignIn(req, res, db, bcrypt);
});

// REGISTER
app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

// GET PROFILE
app.get("/profile/:id", (req, res) => {
  profile.handleProfileGet(req, res, db);
});

// ADD IMAGE ENTRY
app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});

// IMAGE URL
app.post("/imageurl", (req, res) => image.handleApiCall(req, res));

app.listen(process.env.PORT || 3000, () => {
  console.log(`app is runnin on port ${process.env.PORT}`);
});
