import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Loader from '../components/Loader';
import ArtCard from '../components/ArtCard';
import VerifiedBadge from '../components/VerifiedBadge';

const ArtistProfilePage = () => {

    const{id} = useParams();
    const[artist,setArtist] = useState(null);
    const[artworks,setArtworks]=useState([]);
    const[loading,setLoading] = useState(true);

    useEffect(()=>{
        const fetchArtistData = async()=>{
            try{
                setLoading(true);
                const{data:artistData} = await axios.get(`/api/users/${id}`);
                setArtist(artistData);

                const {data:allArtworks} = await axios.get('/api/artworks');
                setArtworks(allArtworks.filter(art=>art.artist._id===id));
                setLoading(fasle);
            }catch(error){
                console.log("Error fetching artist data:",error);
                setLoading(false);
            }
        };
        fetchArtistData();
    },[id]);

    if(loading) return <Loader/>;
    if(!artist) return <div className='text-center py-20'>Artist not found</div>

  return (
    <div className="bg-cream-50">
      <div className="container mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
          <img
            src={artist.profileImage}
            alt={artist.name}
            className="w-48 h-48 rounded-full object-cover shadow-xl border-4 border-white"
          />
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-gray-800">
              {artist.name}
              {artist.isVerified && <VerifiedBadge/>}
              </h1>
            <div className="mt-2 text-lg text-gray-600">
              {artist.artForm} Artist
            </div>
            <p className="mt-4 text-gray-700 max-w-2xl">
              {artist.bio || "This artist hasn't added a bio yet"}
            </p>
          </div>
        </div>
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
            Works by {artist.name}
          </h2>
          {artworks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {artworks.map((art) => (
                <ArtCard key={art._id} artwork={art} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">
              This artist has not uploaded any artwork yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ArtistProfilePage