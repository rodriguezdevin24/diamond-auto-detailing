const mongoose = require("mongoose");

const imageSchema = new Mongoose.schema({
  before: {
    type: String,
    required: true,
  },

  after: {
    type: String,
    required: false,
  },
}, {timeStamp: true});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
