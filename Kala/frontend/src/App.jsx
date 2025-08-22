import React from "react";
import { Routes,Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import MarketplacePage from "./pages/MarketplacePage";
import ArtDetailPage from "./pages/ArtDetailPage";
import ArtistProfilePage from "./pages/ArtistProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import Footer from "./components/Footer";



export default function App(){
  return (
    <div className="flex flex-col min-h-screen bg-cream-50 text-gray-900">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/art/:id" element={<ArtDetailPage />} />
          <Route path="/artist/:id" element={<ArtistProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </main>
      <Footer/>
    </div>
  );
}