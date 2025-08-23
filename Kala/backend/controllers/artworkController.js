const Artwork = require('../models/ArtworkModel.js');
const User = require('../models/UserModel.js');


const updateVerificationStatus = async (artistId) => {
    try {
        const artworkCount = await Artwork.countDocuments({ artist: artistId });
        const isVerified = artworkCount >= 3;
        await User.findByIdAndUpdate(artistId, { isVerified: isVerified });
    } catch (error) {
        console.error("Error updating verification status:", error);
    }
};

const createArtwork = async (req, res) => {
    const { title, description, price, dimensions, imageUrl } = req.body;

    const artwork = new Artwork({
        title,
        description,
        price,
        dimensions,
        imageUrl,
        artist: req.user._id,
    });

    const createdArtwork = await artwork.save();

    
    await updateVerificationStatus(req.user._id);

    res.status(201).json(createdArtwork);
};


const deleteArtwork = async (req, res) => {
    const artwork = await Artwork.findById(req.params.id);

    if (artwork) {
        if (artwork.artist.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorised' });
        }

        const artistId = artwork.artist; // 
        await artwork.deleteOne();

   
        await updateVerificationStatus(artistId);

        res.json({ message: 'Artwork removed' });
    } else {
        res.status(404).json({ message: 'Artwork not found' });
    }
};



const getArtworks = async (req, res) => {
    const artworks = await Artwork.find({}).populate('artist', 'name artForm');
    res.json(artworks);
};

const getArtworkById = async (req, res) => {
    const artwork = await Artwork.findById(req.params.id).populate(
      "artist",
      "name artForm profileImage isVerified" 
    );
    if (artwork) {
        res.json(artwork);
    } else {
        res.status(404).json({ message: 'Artwork not found' });
    }
};

const updateArtwork = async (req, res) => {
    const { title, description, price, dimensions, imageUrl,exportReady } = req.body;
    const artwork = await Artwork.findById(req.params.id);

    if (artwork) {
        if (artwork.artist.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorised" });
        }
        artwork.title = title || artwork.title;
        artwork.description = description || artwork.description;
        artwork.price = price || artwork.price;
        artwork.dimensions = dimensions || artwork.dimensions;
        artwork.imageUrl = imageUrl || artwork.imageUrl;

        if(exportReady){
            artwork.exportReady=exportReady;
        }

        const updatedArtwork = await artwork.save();
        res.json(updatedArtwork);
    } else {
        res.status(404).json({ message: 'Artwork not found' });
    }
};

module.exports = { getArtworks, getArtworkById, createArtwork, updateArtwork, deleteArtwork };