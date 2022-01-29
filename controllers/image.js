const clarifai = require("clarifai");

const app = new Clarifai.App({
  apiKey: "f0d194222a4c48029fddfc6e72fa40a2",
});

const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Unable to work API"));
};

const handleImage = (req, res, db) => {
  const { id } = req.body;

  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0].entries);
    })
    .catch((err) => res.status(400).json("Unable to get entries..."));
};

module.exports = {
  handleImage: handleImage,
  handleApiCall: handleApiCall,
};
