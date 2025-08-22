import React from "react";
import { Link } from "react-router-dom";

const ArtCard = ({artwork})=>{
    const artist = artwork.artist;

    return (
      <Link to={`/art/${artwork._id}`} className="block">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden group cursor-pointer transform hover:-translate-y-2 transition-transform duration-300">
          <div className="relative overflow-hidden h-72">
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute top-0 right-0 bg-amber-600 text-white px-3 py-1 m-2 rounded-full text-sm font-semibold">
              ₹{artwork.price.toLocalString("en-IN")}
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 truncate">
              {artwork.title}
            </h3>
            <p>
                by {artist?artist.name:'Unknown Artist'} - <span className="font-medium text-amber-700">{artist?artist.artForm:'Folk Art'}</span>
            </p>
          </div>
        </div>
      </Link>
    );
}

export default ArtCard;