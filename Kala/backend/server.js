const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const artworkRoutes = require("./routes/artworkRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(cors()); 
app.use(express.json()); 

app.get("/", (req, res) => {
  res.send("Kala API is running...");
});

app.use("/api/users", userRoutes);
app.use("/api/artworks", artworkRoutes);
app.use("/api/upload", uploadRoutes); 

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
