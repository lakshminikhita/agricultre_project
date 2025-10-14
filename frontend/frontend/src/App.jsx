import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import FarmerDashboard from './pages/FarmerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CropPrediction from './pages/CropPrediction';
import MarketPage from './pages/MarketPage';
import ContactPage from './pages/ContactPage';
import TestComponent from './components/TestComponent';
import './index.css';

function App() {

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <FarmerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/buyer-dashboard" 
                element={
                  <ProtectedRoute>
                    <BuyerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin-dashboard" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/crop-prediction" 
                element={
                  <ProtectedRoute>
                    <CropPrediction />
                  </ProtectedRoute>
                } 
              />
              <Route path="/market" element={<MarketPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/test" element={<TestComponent />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;