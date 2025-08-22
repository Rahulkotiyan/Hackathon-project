const Artwork = require('../models/ArtworkModel.js');

const getArtworks = async(req,res)=>{
    const artworks = await Artwork.find({}).populate('artist','name artForm');
    res.json(artworks);
};

const getArtworkById = async(req,res)=>{
    const artwork = await Artwork.findById(req.params.id).populate(
      "artist",
      "name artForm profileImage"
    );
    if(artwork){
        res.json(artwork);
    }else{
        res.status(404).json({message:'Artwork not found'});
    }
};

const createArtwork = async(req,res)=>{
    const {title,description,price,dimensions,imageUrl}=req.body;

    const artwork = new Artwork({
        title,
        description,
        price,
        dimensions,
        imageUrl,
        artist:req.user._id,
    });

    const createArtwork = await artwork.save();
    res.status(201).json(createArtwork);
};

const updateArtWork = async(req,res)=>{
    const {title,description,price,dimensions,imageUrl}=req.body;
    const artwork = await Artwork.findById(req.params.id);

    if(artwork){
        if(artwork.artist.toString()!== req.user._id.toString()){
            return res.status(401).json({message:"Not authorised"});
        }
        artwork.title=title||artwork.title;
        artwork.description = description || artwork.description;
        artwork.price = price || artwork.price;
        artwork.dimensions = dimensions || artwork.dimensions;
        artwork.imageUrl = imageUrl || artwork.imageUrl;

        const updateArtWork = await artwork.save();
        res.json(updateArtWork);
    }else{
        res.status(404).json({message:'Artwork not found'});
    }
};

const deleteArtwork = async(req,res)=>{
    const artwork = await Artwork.findById(req.params.id);

    if(artwork){
        if(artwork.artist.toString()!==req.user._id.toString()){
            return res.status(401).json({message:'Not authorised'});
        }
        await artwork.remove();
        res.json({message:'Artwork removed'});
    }else{
        res.status(404).json({message:'Artwork not found'});
    }
};

module.exports={getArtworks,getArtworkById,createArtwork,updateArtWork,deleteArtwork};