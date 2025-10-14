import React, { useState } from 'react';
import { 
  Brain, 
  Beaker, 
  Thermometer, 
  Droplets, 
  Zap,
  TrendingUp,
  Calendar,
  MapPin,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const CropPrediction = () => {
  const [formData, setFormData] = useState({
    cropType: '',
    soilPh: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    temperature: '',
    humidity: '',
    rainfall: '',
    plantingDate: '',
    location: '',
    farmSize: ''
  });
  
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const cropTypes = [
    'Wheat', 'Rice', 'Corn', 'Soybeans', 'Barley', 'Cotton', 'Tomatoes', 'Potatoes'
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate AI prediction with dummy data
    setTimeout(() => {
      const randomYield = (Math.random() * 5 + 2).toFixed(2);
      const confidence = Math.floor(Math.random() * 15 + 85);
      
      setPrediction({
        yield: randomYield,
        confidence: confidence,
        recommendations: [
          'Maintain soil pH between 6.0-7.0 for optimal growth',
          'Consider applying additional nitrogen fertilizer',
          'Monitor weather conditions for potential drought stress',
          'Implement integrated pest management practices'
        ],
        riskFactors: [
          { factor: 'Weather Risk', level: 'Low', color: 'green' },
          { factor: 'Soil Quality', level: 'Good', color: 'green' },
          { factor: 'Pest Risk', level: 'Medium', color: 'yellow' },
          { factor: 'Market Volatility', level: 'High', color: 'red' }
        ],
        harvestDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString()
      });
      setIsLoading(false);
    }, 2000);
  };

  const getRiskColor = (color) => {
    switch (color) {
      case 'green':
        return 'bg-green-100 text-green-800';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800';
      case 'red':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Brain className="h-8 w-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">Crop Yield Prediction</h1>
          </div>
          <p className="text-gray-600">
            Use AI-powered analytics to predict your crop yields and get actionable recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Farm & Crop Details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Crop Type
                  </label>
                  <select
                    name="cropType"
                    value={formData.cropType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select crop type</option>
                    {cropTypes.map((crop) => (
                      <option key={crop} value={crop}>{crop}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Farm Size (acres)
                  </label>
                  <input
                    type="number"
                    name="farmSize"
                    value={formData.farmSize}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., 50"
                  />
                </div>
              </div>

              {/* Location and Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="City, State"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Planting Date
                  </label>
                  <input
                    type="date"
                    name="plantingDate"
                    value={formData.plantingDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Soil Parameters */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Beaker className="h-5 w-5 mr-2 text-blue-600" />
                  Soil Parameters
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Soil pH Level
                    </label>
                    <input
                      type="number"
                      name="soilPh"
                      value={formData.soilPh}
                      onChange={handleInputChange}
                      step="0.1"
                      min="0"
                      max="14"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="6.5"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nitrogen (N) ppm
                    </label>
                    <input
                      type="number"
                      name="nitrogen"
                      value={formData.nitrogen}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="40"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phosphorus (P) ppm
                    </label>
                    <input
                      type="number"
                      name="phosphorus"
                      value={formData.phosphorus}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="20"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Potassium (K) ppm
                    </label>
                    <input
                      type="number"
                      name="potassium"
                      value={formData.potassium}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="200"
                    />
                  </div>
                </div>
              </div>

              {/* Environmental Conditions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Thermometer className="h-5 w-5 mr-2 text-red-600" />
                  Environmental Conditions
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Avg Temperature (°C)
                    </label>
                    <input
                      type="number"
                      name="temperature"
                      value={formData.temperature}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="25"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Humidity (%)
                    </label>
                    <input
                      type="number"
                      name="humidity"
                      value={formData.humidity}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="60"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rainfall (mm)
                    </label>
                    <input
                      type="number"
                      name="rainfall"
                      value={formData.rainfall}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="800"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-primary-600 hover:bg-primary-700'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Analyzing...</span>
                  </div>
                ) : (
                  <>
                    <Brain className="inline h-5 w-5 mr-2" />
                    Generate Prediction
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Prediction Results */}
          <div className="space-y-6">
            {prediction ? (
              <>
                {/* Main Prediction */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
                    Prediction Results
                  </h2>
                  
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-primary-600 mb-2">
                      {prediction.yield} tons/acre
                    </div>
                    <p className="text-gray-600">Expected Yield</p>
                    <div className="mt-4">
                      <div className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {prediction.confidence}% Confidence
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Expected Harvest</p>
                      <p className="font-semibold">{prediction.harvestDate}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <Zap className="h-6 w-6 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Growth Rate</p>
                      <p className="font-semibold">Optimal</p>
                    </div>
                  </div>
                </div>

                {/* Risk Factors */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                    Risk Assessment
                  </h3>
                  
                  <div className="space-y-3">
                    {prediction.riskFactors.map((risk, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-700">{risk.factor}</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(risk.color)}`}>
                          {risk.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    AI Recommendations
                  </h3>
                  
                  <div className="space-y-3">
                    {prediction.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Ready for Prediction
                </h3>
                <p className="text-gray-600">
                  Fill out the form on the left to get AI-powered crop yield predictions 
                  and personalized recommendations for your farm.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropPrediction;