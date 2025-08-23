
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";

const EditModal = ({ artwork, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...artwork });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Edit Artwork</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="3"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Dimensions</label>
            <input
              type="text"
              name="dimensions"
              value={formData.dimensions}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [loadingArtworks, setLoadingArtworks] = useState(true);

  
  const [editingArtwork, setEditingArtwork] = useState(null);

 
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchArtistArtworks = useCallback(async (artistId) => {
    try {
      setLoadingArtworks(true);
      const { data } = await axios.get("/api/artworks");
      setArtworks(data.filter((art) => art.artist._id === artistId));
      setLoadingArtworks(false);
    } catch (error) {
      console.error("Could not fetch artworks", error);
      setLoadingArtworks(false);
    }
  }, []);

  useEffect(() => {
    const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!storedUserInfo) {
      navigate("/login");
    } else {
      setUserInfo(storedUserInfo);
      fetchArtistArtworks(storedUserInfo._id);
    }
  }, [navigate, fetchArtistArtworks]);

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
      setTimeout(() => setSuccess(""), 3000); 

      fetchArtistArtworks(userInfo._id);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create artwork");
    }
  };

  
  const handleDelete = async (artworkId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this artwork? This cannot be undone."
      )
    ) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        await axios.delete(`/api/artworks/${artworkId}`, config);
        fetchArtistArtworks(userInfo._id); 
      } catch (error) {
        setError("Failed to delete artwork.");
      }
    }
  };

  const handleUpdate = async (updatedArtwork) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.put(
        `/api/artworks/${updatedArtwork._id}`,
        updatedArtwork,
        config
      );
      setEditingArtwork(null); 
      fetchArtistArtworks(userInfo._id); 
    } catch (error) {
      setError("Failed to update artwork.");
    }
  };

  if (!userInfo) return <Loader />;

  return (
    <div className="container mx-auto px-6 py-12">
      {editingArtwork && (
        <EditModal
          artwork={editingArtwork}
          onClose={() => setEditingArtwork(null)}
          onSave={handleUpdate}
        />
      )}
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
                    className="bg-white p-4 rounded-lg shadow-md flex flex-col"
                  >
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="w-full h-48 object-cover rounded mb-2"
                    />
                    <div className="flex-grow">
                      <h3 className="font-semibold">{art.title}</h3>
                      <p>₹{art.price.toLocaleString("en-IN")}</p>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4 border-t pt-3">
                      <button
                        onClick={() => setEditingArtwork(art)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(art._id)}
                        className="text-sm font-medium text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">
                  You haven't added any artwork yet.
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
