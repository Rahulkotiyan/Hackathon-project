import React, { useEffect, useState } from 'react'
import Loader from '../components/Loader';
import ArtCard from '../components/ArtCard';
import axios from "../api/axios";

const MarketplacePage = () => {

    const[artworks,setArtworks] = useState([]);
    const[loading,setLoading] = useState(true);

    useEffect(()=>{
        const fetchArtworks = async ()=>{
            try{
                setLoading(true);
                const{data} = await axios.get('/artworks');
                setArtworks(data);
                setLoading(false);
            }catch(error){
                console.error("Error fetching artworks:",error);
                setLoading(false);
            }
        };
        fetchArtworks();
    },[]);


  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
        Marketplace
      </h1>
      <p className='text-center text-gray-600 mb-10'>Browse our curated collection of traditional Indian folk art.</p>
      {loading?<Loader/>:(
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
            {
                artworks.map(art=>(
                    <ArtCard key={art._id} artwork={art}/>
                ))
            }
        </div>
      )}
    </div>
  );
}

export default MarketplacePage