const mongoose = require("mongoose");

const artworkSchema = mongoose.Schema(
  {
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", 
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    dimensions: { type: String, required: true },
    story: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

const Artwork = mongoose.model("Artwork", artworkSchema);
module.exports = Artwork;
