import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Filter, 
  Calendar,
  MapPin,
  DollarSign,
  BarChart3,
  RefreshCw
} from 'lucide-react';

const MarketPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('today');
  const [sortBy, setSortBy] = useState('name');

  // Dummy market data
  const marketData = [
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
      marketTrend: 'up'
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
      marketTrend: 'down'
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
      marketTrend: 'up'
    },
    {
      id: 4,
      name: 'Soybeans',
      category: 'oilseeds',
      currentPrice: 385.60,
      previousPrice: 390.25,
      unit: 'per quintal',
      location: 'Indore',
      lastUpdated: '45 min ago',
      volume: '675 tons',
      marketTrend: 'down'
    },
    {
      id: 5,
      name: 'Cotton',
      category: 'cash-crops',
      currentPrice: 520.00,
      previousPrice: 515.75,
      unit: 'per quintal',
      location: 'Nagpur',
      lastUpdated: '2 hours ago',
      volume: '1,890 tons',
      marketTrend: 'up'
    },
    {
      id: 6,
      name: 'Tomatoes',
      category: 'vegetables',
      currentPrice: 35.75,
      previousPrice: 42.50,
      unit: 'per kg',
      location: 'Bangalore',
      lastUpdated: '30 min ago',
      volume: '456 tons',
      marketTrend: 'down'
    },
    {
      id: 7,
      name: 'Onions',
      category: 'vegetables',
      currentPrice: 28.90,
      previousPrice: 25.20,
      unit: 'per kg',
      location: 'Nashik',
      lastUpdated: '1 hour ago',
      volume: '2,340 tons',
      marketTrend: 'up'
    },
    {
      id: 8,
      name: 'Sugarcane',
      category: 'cash-crops',
      currentPrice: 325.40,
      previousPrice: 320.00,
      unit: 'per ton',
      location: 'Lucknow',
      lastUpdated: '4 hours ago',
      volume: '3,450 tons',
      marketTrend: 'up'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'grains', label: 'Grains' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'oilseeds', label: 'Oilseeds' },
    { value: 'cash-crops', label: 'Cash Crops' }
  ];

  const timeframes = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'price', label: 'Price' },
    { value: 'change', label: 'Price Change' }
  ];

  // Filter and sort logic
  const filteredAndSortedData = useMemo(() => {
    let filtered = marketData.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort data
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return b.currentPrice - a.currentPrice;
        case 'change':
          const aChange = ((a.currentPrice - a.previousPrice) / a.previousPrice) * 100;
          const bChange = ((b.currentPrice - b.previousPrice) / b.previousPrice) * 100;
          return bChange - aChange;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, sortBy]);

  const calculateChange = (current, previous) => {
    const change = current - previous;
    const percentage = (change / previous) * 100;
    return { change, percentage };
  };

  const getPriceChangeColor = (current, previous) => {
    return current > previous ? 'text-green-600' : 'text-red-600';
  };

  const marketSummary = {
    totalItems: filteredAndSortedData.length,
    avgPrice: filteredAndSortedData.reduce((sum, item) => sum + item.currentPrice, 0) / filteredAndSortedData.length,
    topGainer: filteredAndSortedData.reduce((max, item) => {
      const change = calculateChange(item.currentPrice, item.previousPrice);
      const maxChange = calculateChange(max.currentPrice, max.previousPrice);
      return change.percentage > maxChange.percentage ? item : max;
    }, filteredAndSortedData[0] || {}),
    topLoser: filteredAndSortedData.reduce((min, item) => {
      const change = calculateChange(item.currentPrice, item.previousPrice);
      const minChange = calculateChange(min.currentPrice, min.previousPrice);
      return change.percentage < minChange.percentage ? item : min;
    }, filteredAndSortedData[0] || {})
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <BarChart3 className="h-8 w-8 text-primary-600 mr-3" />
                Market Prices
              </h1>
              <p className="text-gray-600 mt-1">Real-time commodity prices and market trends</p>
            </div>
            <button className="flex items-center bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </button>
          </div>
        </div>

        {/* Market Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Commodities</p>
                <p className="text-2xl font-bold text-gray-900">{marketSummary.totalItems}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Price</p>
                <p className="text-2xl font-bold text-gray-900">₹{marketSummary.avgPrice?.toFixed(2)}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Top Gainer</p>
                <p className="text-lg font-semibold text-gray-900">{marketSummary.topGainer?.name}</p>
                <p className="text-sm text-green-600">
                  +{calculateChange(marketSummary.topGainer?.currentPrice || 0, marketSummary.topGainer?.previousPrice || 1).percentage.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Top Loser</p>
                <p className="text-lg font-semibold text-gray-900">{marketSummary.topLoser?.name}</p>
                <p className="text-sm text-red-600">
                  {calculateChange(marketSummary.topLoser?.currentPrice || 0, marketSummary.topLoser?.previousPrice || 1).percentage.toFixed(1)}%
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search commodities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Timeframe */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
              >
                {timeframes.map(timeframe => (
                  <option key={timeframe.value} value={timeframe.value}>
                    {timeframe.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    Sort by {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Market Data Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Live Market Data</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commodity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Change
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Volume
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedData.map((item) => {
                  const change = calculateChange(item.currentPrice, item.previousPrice);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-3 ${
                            item.category === 'grains' ? 'bg-yellow-400' :
                            item.category === 'vegetables' ? 'bg-green-400' :
                            item.category === 'oilseeds' ? 'bg-orange-400' :
                            'bg-blue-400'
                          }`}></div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-500 capitalize">{item.category.replace('-', ' ')}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          ₹{item.currentPrice.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">{item.unit}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`flex items-center ${getPriceChangeColor(item.currentPrice, item.previousPrice)}`}>
                          {item.currentPrice > item.previousPrice ? (
                            <TrendingUp className="h-4 w-4 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 mr-1" />
                          )}
                          <div>
                            <div className="text-sm font-medium">
                              {change.change > 0 ? '+' : ''}₹{change.change.toFixed(2)}
                            </div>
                            <div className="text-sm">
                              ({change.change > 0 ? '+' : ''}{change.percentage.toFixed(2)}%)
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.volume}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                          {item.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.lastUpdated}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Price Alert Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Price Alerts</h2>
          <p className="text-gray-600 mb-4">
            Set up price alerts to get notified when your selected commodities reach your target prices.
          </p>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors">
            Set Price Alert
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketPage;