import React, { useEffect, useState } from 'react'
import Loader from '../components/Loader';
import ArtCard from '../components/ArtCard';
import axios from "../api/axios";
import { Link } from "react-router-dom";

const HomePage = () => {

    const[artworks,setArtworks] = useState([]);
    const[loading,setLoading] = useState(true);

    useEffect(()=>{
        const fetchArtworks = async () =>{
            try{
                setLoading(true);
                const {data} = await axios.get("/artworks");
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
    <div>
      <section
        className="h-[60vh] flex items-center justify-center text-center bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(254,243,226,0.8),rgba(254, 243, 226, 0.8)), url('https://placehold.co/1920x1080/FEF3E2/4A4A4A?text=Folk+Art+Collage')",
        }}
      >
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight">
            The Soul of India
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mt-4 max-w-3xl mx-auto">
            Discover and own authentic folk art directly from the hands of
            master artisans.
          </p>
          <Link>Explore the collection</Link>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
            Featured Artworks
          </h2>
          {
            loading?<Loader/>:(
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
                    {
                        artworks.slice(0.4).map(art=>(
                            <ArtCard key={art._id} artwork={art}/>
                        ))
                    }
                </div>
            )
          }
        </div>
      </section>
    </div>
  );
}

export default HomePage;