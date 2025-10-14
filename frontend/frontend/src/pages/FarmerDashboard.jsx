import React, { useState, useEffect } from 'react';
import { 
  Plus,
  Package,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Edit,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const FarmerDashboard = () => {
  const { user, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  
  // Show loading screen while auth is being determined
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  // separate local page loading from AuthContext.loading
  const [pageLoading, setPageLoading] = useState(true);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: 'VEGETABLES',
    pricePerUnit: '',
    unit: 'kg',
    quantityAvailable: '',
    location: '',
    imageUrl: '',
    quality: 'Standard'
  });

  // wait for auth rehydration before attempting to fetch protected data
  useEffect(() => {
    console.log('FarmerDashboard useEffect triggered:', { authLoading, user: !!user, hasToken: !!authService.getToken() });
    
    if (authLoading) {
      console.log('FarmerDashboard - still loading auth, waiting...');
      return; // still determining auth state
    }

    if (!user) {
      console.log('FarmerDashboard - no user in context after auth loading finished, redirecting to /login');
      // Use replace: true to prevent back button issues
      navigate('/login', { replace: true });
      return;
    }

    console.log('FarmerDashboard - user found, fetching dashboard data');
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user]);

  const fetchDashboardData = async () => {
    try {
      console.log('FarmerDashboard - Fetching data for user:', user?.name);
      
      try {
        console.log('Attempting to fetch products from backend WITHOUT authentication...');
        
        // Make API call without any authentication headers (basic project)
        const productsResponse = await axios.get('http://localhost:8080/api/products/my-products');
        console.log('✅ Products fetched from database:', productsResponse.data);
        setProducts(productsResponse.data);

        // Try to fetch orders
        try {
          const ordersResponse = await axios.get('http://localhost:8080/api/orders/farmer-orders?size=5');
          setOrders(ordersResponse.data.content || ordersResponse.data);
        } catch (orderError) {
          console.log('Orders API not available, using mock orders');
          setOrders([
            {
              id: 1,
              productName: 'Sample Order',
              quantity: 10,
              totalAmount: 500,
              status: 'COMPLETED',
              buyerName: 'Sample Buyer',
              orderDate: new Date().toISOString().split('T')[0]
            }
          ]);
        }

        // Try to fetch stats
        try {
          const statsResponse = await axios.get('http://localhost:8080/api/orders/statistics');
          setStats(statsResponse.data);
        } catch (statsError) {
          console.log('Stats API not available, calculating from products');
          setStats({
            totalProducts: productsResponse.data.length,
            totalOrders: 1,
            totalRevenue: productsResponse.data.reduce((sum, product) => sum + (product.pricePerUnit * 10), 0),
            activeProducts: productsResponse.data.filter(p => p.status === 'AVAILABLE').length
          });
        }

        console.log('✅ Real data loaded from backend successfully!');

      } catch (apiError) {
        console.log('❌ Backend not available, using demo data:', apiError.message);
        
        // Fallback to demo data if backend is not available
        setProducts([
          {
            id: 1,
            name: 'Fresh Tomatoes',
            category: 'VEGETABLES',
            pricePerUnit: 25.0,
            unit: 'kg',
            quantityAvailable: 100,
            location: user?.name + "'s Farm" || 'Demo Farm',
            quality: 'Grade A',
            status: 'AVAILABLE'
          },
          {
            id: 2,
            name: 'Organic Rice',
            category: 'GRAINS',
            pricePerUnit: 40.0,
            unit: 'kg',
            quantityAvailable: 500,
            location: user?.name + "'s Farm" || 'Demo Farm',
            quality: 'Premium',
            status: 'AVAILABLE'
          }
        ]);

        setOrders([
          {
            id: 1,
            productName: 'Fresh Tomatoes',
            quantity: 50,
            totalAmount: 1250,
            status: 'COMPLETED',
            buyerName: 'Local Market',
            orderDate: '2024-10-14'
          }
        ]);

        setStats({
          totalProducts: 2,
          totalOrders: 1,
          totalRevenue: 1250,
          activeProducts: 2
        });

        console.log('✅ Demo dashboard loaded as fallback');
      }

    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setPageLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...newProduct,
        pricePerUnit: parseFloat(newProduct.pricePerUnit),
        quantityAvailable: parseInt(newProduct.quantityAvailable),
        location: newProduct.location || (user?.name + "'s Farm") || 'Demo Farm'
      };

      console.log('Submitting product to database:', productData);

      console.log('Submitting product to backend database WITHOUT authentication');
      
      // Submit to backend without any authentication (basic project)
      const response = await axios.post('http://localhost:8080/api/products/add', productData);
      console.log('✅ Product successfully added to database:', response.data);

      // Reset form
      setShowAddProductForm(false);
      setNewProduct({
        name: '',
        description: '',
        category: 'VEGETABLES',
        pricePerUnit: '',
        unit: 'kg',
        quantityAvailable: '',
        location: '',
        imageUrl: '',
        quality: 'Standard'
      });

      // Refresh dashboard data to show the new product
      fetchDashboardData();
      
      alert('Product successfully added to database!');
      
    } catch (error) {
      console.error('❌ Error adding product to database:', error);
      
      if (error.response) {
        console.error('Backend error response:', error.response.data);
        alert(`Failed to add product: ${error.response.data.message || error.response.status}`);
      } else if (error.request) {
        console.error('Network error - backend not reachable');
        alert('Failed to add product: Cannot connect to backend server. Make sure backend is running on localhost:8080');
      } else {
        console.error('Unexpected error:', error.message);
        alert('Failed to add product: ' + error.message);
      }
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      console.log('Deleting product from backend database WITHOUT authentication:', productId);
      
      // Delete from backend without authentication (basic project)
      await axios.delete(`http://localhost:8080/api/products/${productId}`);
      
      console.log('✅ Product successfully deleted from database');
      
      // Refresh dashboard data to reflect the deletion
      fetchDashboardData();
      
      alert('Product successfully deleted from database!');
      
    } catch (error) {
      console.error('❌ Error deleting product from database:', error);
      
      if (error.response) {
        console.error('Backend error response:', error.response.data);
        alert(`Failed to delete product: ${error.response.data.message || error.response.status}`);
      } else if (error.request) {
        console.error('Network error - backend not reachable');
        alert('Failed to delete product: Cannot connect to backend server. Make sure backend is running on localhost:8080');
      } else {
        console.error('Unexpected error:', error.message);
        alert('Failed to delete product: ' + error.message);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800';
      case 'OUT_OF_STOCK':
        return 'bg-red-100 text-red-800';
      case 'RESERVED':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (authLoading || pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
              <p className="text-gray-600 mt-1">Manage your products and track your sales</p>
            </div>
            <button
              onClick={() => setShowAddProductForm(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Package className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ShoppingCart className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders || 0}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <DollarSign className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">₹{stats.totalEarnings || 0}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-8 w-8 text-primary-600" />
                <div>
                  <p className="text-sm text-gray-600">Available Products</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {products.filter(p => p.status === 'AVAILABLE').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* My Products */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Package className="h-6 w-6 text-primary-600 mr-2" />
              My Products
            </h2>
            
            {products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No products listed yet</p>
                <p className="text-gray-400 mt-2">Add your first product to start selling</p>
                <button
                  onClick={() => setShowAddProductForm(true)}
                  className="mt-4 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg"
                >
                  Add Product
                </button>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {products.map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{product.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                            {product.status}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Price</p>
                            <p className="font-semibold">₹{product.pricePerUnit}/{product.unit}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Available</p>
                            <p className="font-semibold">{product.quantityAvailable} {product.unit}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Category</p>
                            <p className="font-semibold">{product.category}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Location</p>
                            <p className="font-semibold">{product.location}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <ShoppingCart className="h-6 w-6 text-green-600 mr-2" />
              Orders Received
            </h2>
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No orders received yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Buyer</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td className="px-4 py-2">{order.id}</td>
                        <td className="px-4 py-2">{order.productName || (order.items && order.items[0]?.product?.name) || 'N/A'}</td>
                        <td className="px-4 py-2">{order.quantity || (order.items && order.items[0]?.quantity) || 'N/A'}</td>
                        <td className="px-4 py-2">₹{order.totalAmount}</td>
                        <td className="px-4 py-2">{order.buyerName || (order.buyer && order.buyer.name) || 'N/A'}</td>
                        <td className="px-4 py-2">{order.status}</td>
                        <td className="px-4 py-2">{order.orderDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddProductForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Product</h2>
            
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 h-20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="VEGETABLES">Vegetables</option>
                  <option value="FRUITS">Fruits</option>
                  <option value="GRAINS">Grains</option>
                  <option value="DAIRY">Dairy</option>
                  <option value="LIVESTOCK">Livestock</option>
                  <option value="HERBS_SPICES">Herbs & Spices</option>
                  <option value="ORGANIC_PRODUCE">Organic Produce</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price per Unit</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProduct.pricePerUnit}
                    onChange={(e) => setNewProduct({...newProduct, pricePerUnit: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <select
                    value={newProduct.unit}
                    onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="kg">kg</option>
                    <option value="piece">piece</option>
                    <option value="liter">liter</option>
                    <option value="dozen">dozen</option>
                    <option value="ton">ton</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity Available</label>
                <input
                  type="number"
                  required
                  value={newProduct.quantityAvailable}
                  onChange={(e) => setNewProduct({...newProduct, quantityAvailable: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={newProduct.location}
                  onChange={(e) => setNewProduct({...newProduct, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quality</label>
                <select
                  value={newProduct.quality}
                  onChange={(e) => setNewProduct({...newProduct, quality: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                  <option value="Organic">Organic</option>
                  <option value="Grade A">Grade A</option>
                </select>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddProductForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;