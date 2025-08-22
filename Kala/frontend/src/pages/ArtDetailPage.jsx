import axios from 'axios';
import React, { useState ,useEffect} from 'react'
import { Link, useParams } from 'react-router-dom'
import Loader from '../components/Loader';

const ArtDetailPage = () => {

    const {id} = useParams();
    const [artwork,setArtwork]=useState(null);
    const [loading,setLoading]= useState(true);

    useEffect(()=>{
        const fetchArtwork = async () =>{
            try{
                setLoading(true);
                const {data} = await axios.get(`/api/artworks/${id}`);
                setArtwork(data);
                setLoading(false);
            }catch(error){
                console.log("Error fetching artwork:",error);
                setLoading(false);
            }
        };
        fetchArtwork();
    },[id]);

    if(loading) return <Loader/>;
    if(!artwork) return <div className='text-center py-20'>Artwork not found.</div>

  return (
    <div className="container mx-auto px-6 py-12">
      <Link
        to="/marketplace"
        className="flex items-center text-gray-600 hover:text-amber-600 mb-8"
      >
        &larr; <span className="ml-2">Back to Marketplace</span>
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            className="w-full h-auto object-contain rounded-md"
          />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-800">{artwork.title}</h1>
          {artwork.artist && (
            <Link
              to={`/artist/${artwork.artist._id}`}
              className="mt-2 text-lg text-gray-600 cursor-pointer hover:underline"
            >
              by{" "}
              <span className="font-semibold text-amber-700">
                {artwork.artist.name}
              </span>
            </Link>
          )}
          <div className="mt-4 text-3xl font-bold text-gray-900">
            ₹{artwork.price.toLocaleString("en-IN")}
          </div>
          <div className="mt-6 space-y-4">
            <button className="w-full bg-amber-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-amber-700">
              Buy Now
            </button>
            <button className="w-full bg-gray-200 text-gray-800 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-300">
              View in Your Room (AR)
            </button>
            <div className="mt-8 border-t pt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Details
              </h3>
              <p className="text-gray-700">
                <span className="font-semibold">Art Form:</span>{" "}
                {artwork.artist ? artwork.artist.artForm : "N/A"}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Dimensions:</span>{" "}
                {artwork.dimensions}
              </p>
              <p className="text-gray-700 mt-4">{artwork.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArtDetailPage;