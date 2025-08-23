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
    exportReady:{
      qualityCheck:{type:Boolean,default:false},
      materialCertification:{type:Boolean,default:false},
      durablePackaging:{type:Boolean,default:false},
      labelingComplete:{type:Boolean,default:false},
    },
  },
  {
    timestamps: true,
  }
);

const Artwork = mongoose.model("Artwork", artworkSchema);
module.exports = Artwork;
