const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");

const db = require("knex")({
  client: "pg",
  connection: {
    host: "127.0.0.1",
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
  db.select("email", "hash")
    .from("login")
    .where("email", "=", req.body.email)
    .then((data) => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);

      if (isValid) {
        return db
          .select()
          .from("users")
          .where({ email: req.body.email })
          .then((user) => res.json(user[0]))
          .catch((err) => res.status(400).json("Unable to get user"));
      }
      return res.status(400).json("Wrong credentials");
    })
    .catch((err) => res.status(400).json("Wrong credentials"));
});

// REGISTER
app.post("/register", (req, res) => {
  const { email, name, password } = req.body;

  const hash = bcrypt.hashSync(password, 10);

  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .returning("*")
          .insert({
            email: loginEmail[0].email,
            name: name,
            joined: new Date(),
          })
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => res.status(400).json("Unable to Register"));
      })
      .then(trx.commit)
      .catch(trx.rollback);
  });
});

// GET PROFILE
app.get("/profile/:id", (req, res) => {
  const { id } = req.params;

  db.select()
    .from("users")
    .where({ id: id })
    .then((user) => {
      if (user.length) return res.json(user[0]);
      return res.status(400).json("Not Found");
    })
    .catch((err) => res.status(400).json("error getting user"));
});

// ADD IMAGE ENTRY
app.put("/image", (req, res) => {
  const { id } = req.body;

  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0].entries);
    })
    .catch((err) => res.status(400).json("Unable to get entries..."));
});

app.listen(3000, () => {
  console.log("app is running on port 3000");
});
