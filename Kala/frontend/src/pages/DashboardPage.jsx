
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader"; 

const DashboardPage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [loadingArtworks, setLoadingArtworks] = useState(true);

 
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [imageUrl, setImageUrl] = useState(""); 
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!storedUserInfo) {
      navigate("/login");
    } else {
      setUserInfo(storedUserInfo);
      fetchArtistArtworks(storedUserInfo._id);
    }
  }, [navigate]);

  const fetchArtistArtworks = async (artistId) => {
    try {
      setLoadingArtworks(true);
      const { data } = await axios.get("/api/artworks");
      setArtworks(data.filter((art) => art.artist._id === artistId));
      setLoadingArtworks(false);
    } catch (error) {
      console.error("Could not fetch artworks", error);
      setLoadingArtworks(false);
    }
  };

 
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    setError("");

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`, 
        },
      };

      
      const { data } = await axios.post("/api/upload", formData, config);


      setImageUrl(data.imageUrl);
      setUploading(false);
    } catch (error) {
      console.error("Image upload failed:", error);
      setError("Image upload failed. Please try again.");
      setUploading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!imageUrl) {
      setError("Please upload an image first.");
      return;
    }
    setError("");
    setSuccess("");

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const newArtwork = {
        title,
        description,
        price: Number(price),
        dimensions,
        imageUrl,
      };
      await axios.post("/api/artworks", newArtwork, config);

      
      setTitle("");
      setDescription("");
      setPrice("");
      setDimensions("");
      setImageUrl("");
      document.getElementById("image-upload-input").value = null; 
      setSuccess("Artwork added successfully!");

      fetchArtistArtworks(userInfo._id);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create artwork");
    }
  };

  if (!userInfo) return <Loader />;

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Artist Dashboard
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Add New Artwork</h2>
            {error && (
              <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">
                {error}
              </p>
            )}
            {success && (
              <p className="bg-green-100 text-green-700 p-3 rounded mb-4 text-center">
                {success}
              </p>
            )}
            <form onSubmit={submitHandler}>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border rounded"
                  rows="3"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">
                  Price (₹)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">
                  Dimensions (e.g., 24 x 18 inches)
                </label>
                <input
                  type="text"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Image</label>
                <input
                  id="image-upload-input"
                  type="file"
                  onChange={uploadFileHandler}
                  className="w-full p-2 border rounded text-sm"
                />
                {uploading && (
                  <div className="mt-2">
                    <Loader />
                  </div>
                )}
                {imageUrl && !uploading && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Image Preview:</p>
                    <img
                      src={imageUrl}
                      alt="preview"
                      className="h-24 w-auto rounded"
                    />
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-amber-600 text-white py-2 rounded-lg font-semibold hover:bg-amber-700 disabled:bg-gray-400"
              >
                {uploading ? "Uploading..." : "Add Artwork"}
              </button>
            </form>
          </div>
        </div>

        
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Your Collection</h2>
          {loadingArtworks ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {artworks.length > 0 ? (
                artworks.map((art) => (
                  <div
                    key={art._id}
                    className="bg-white p-4 rounded-lg shadow-md"
                  >
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="w-full h-48 object-cover rounded mb-2"
                    />
                    <h3 className="font-semibold">{art.title}</h3>
                    <p>₹{art.price.toLocaleString("en-IN")}</p>
                    
                  </div>
                ))
              ) : (
                <p className="text-gray-600">
                  You haven't added any artwork yet. Use the form to add your
                  first piece!
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
