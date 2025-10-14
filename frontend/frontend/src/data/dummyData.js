// Dummy data for the agriculture application

export const weatherData = {
  current: {
    temperature: 24,
    humidity: 65,
    windSpeed: 12,
    condition: 'Partly Cloudy',
    pressure: 1013,
    visibility: 10,
    uvIndex: 5
  },
  forecast: [
    { 
      day: 'Today', 
      date: '2025-10-13',
      temp: { high: 28, low: 18 }, 
      condition: 'sunny',
      humidity: 60,
      precipitation: 0
    },
    { 
      day: 'Tomorrow', 
      date: '2025-10-14',
      temp: { high: 26, low: 16 }, 
      condition: 'cloudy',
      humidity: 70,
      precipitation: 20
    },
    { 
      day: 'Wed', 
      date: '2025-10-15',
      temp: { high: 22, low: 14 }, 
      condition: 'rainy',
      humidity: 85,
      precipitation: 75
    },
    { 
      day: 'Thu', 
      date: '2025-10-16',
      temp: { high: 25, low: 17 }, 
      condition: 'sunny',
      humidity: 55,
      precipitation: 5
    },
    { 
      day: 'Fri', 
      date: '2025-10-17',
      temp: { high: 23, low: 15 }, 
      condition: 'cloudy',
      humidity: 65,
      precipitation: 30
    }
  ]
};

export const cropData = [
  {
    id: 1,
    name: 'Wheat',
    variety: 'Winter Wheat',
    area: 45,
    status: 'Healthy',
    currentYield: 3.2,
    expectedYield: 3.5,
    trend: 'up',
    lastWatered: '2 days ago',
    plantingDate: '2024-09-15',
    harvestDate: '2025-06-15',
    soilMoisture: 75,
    growthStage: 'Flowering'
  },
  {
    id: 2,
    name: 'Corn',
    variety: 'Sweet Corn',
    area: 30,
    status: 'Needs Water',
    currentYield: 2.8,
    expectedYield: 3.0,
    trend: 'down',
    lastWatered: '5 days ago',
    plantingDate: '2024-04-20',
    harvestDate: '2024-08-30',
    soilMoisture: 45,
    growthStage: 'Grain Filling'
  },
  {
    id: 3,
    name: 'Soybeans',
    variety: 'Round Up Ready',
    area: 25,
    status: 'Excellent',
    currentYield: 4.1,
    expectedYield: 4.0,
    trend: 'up',
    lastWatered: '1 day ago',
    plantingDate: '2024-05-10',
    harvestDate: '2024-10-15',
    soilMoisture: 80,
    growthStage: 'Pod Development'
  }
];

export const marketPrices = [
  {
    id: 1,
    name: 'Wheat',
    category: 'grains',
    currentPrice: 245.50,
    previousPrice: 240.00,
    unit: 'per quintal',
    location: 'Mumbai',
    lastUpdated: '2 hours ago',
    volume: '1,245 tons',
    marketTrend: 'up',
    weeklyChange: 2.3,
    monthlyChange: 5.1
  },
  {
    id: 2,
    name: 'Rice (Basmati)',
    category: 'grains',
    currentPrice: 425.75,
    previousPrice: 430.00,
    unit: 'per quintal',
    location: 'Delhi',
    lastUpdated: '1 hour ago',
    volume: '890 tons',
    marketTrend: 'down',
    weeklyChange: -0.9,
    monthlyChange: 1.2
  },
  {
    id: 3,
    name: 'Corn',
    category: 'grains',
    currentPrice: 178.25,
    previousPrice: 175.50,
    unit: 'per quintal',
    location: 'Pune',
    lastUpdated: '3 hours ago',
    volume: '2,150 tons',
    marketTrend: 'up',
    weeklyChange: 1.6,
    monthlyChange: 3.8
  }
];

export const farmActivities = [
  {
    id: 1,
    date: '2025-10-13',
    time: '08:30 AM',
    activity: 'Watered corn field (Section B)',
    type: 'irrigation',
    crop: 'Corn',
    area: '30 acres',
    status: 'completed'
  },
  {
    id: 2,
    date: '2025-10-12',
    time: '06:00 AM',
    activity: 'Applied fertilizer to wheat crops',
    type: 'fertilization',
    crop: 'Wheat',
    area: '45 acres',
    status: 'completed'
  },
  {
    id: 3,
    date: '2025-10-11',
    time: '07:15 AM',
    activity: 'Harvested soybeans (Section A)',
    type: 'harvest',
    crop: 'Soybeans',
    area: '15 acres',
    status: 'completed'
  },
  {
    id: 4,
    date: '2025-10-10',
    time: '09:00 AM',
    activity: 'Pest inspection completed',
    type: 'inspection',
    crop: 'All',
    area: '100 acres',
    status: 'completed'
  }
];

export const soilData = {
  ph: 6.8,
  nitrogen: 42,
  phosphorus: 18,
  potassium: 225,
  organicMatter: 3.2,
  moisture: 68,
  temperature: 22,
  lastTested: '2025-09-15'
};

export const farmStats = {
  totalArea: 100,
  cultivatedArea: 95,
  activeCrops: 3,
  totalYield: 340,
  averageYield: 3.4,
  waterUsage: 2400,
  energyUsage: 1850,
  co2Saved: 12.5
};