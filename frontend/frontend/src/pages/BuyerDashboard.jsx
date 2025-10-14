import React, { useState, useEffect } from 'react';
import { 
  Search,
  ShoppingCart,
  Package,
  TrendingUp,
  DollarSign,
  Filter,
  MapPin,
  Star,
  Plus,
  Minus,
  Eye,
  Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const BuyerDashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);

  const [orderForm, setOrderForm] = useState({
    deliveryAddress: '',
    notes: ''
  });

  const categories = [
    'VEGETABLES', 'FRUITS', 'GRAINS', 'DAIRY', 'LIVESTOCK', 
    'HERBS_SPICES', 'ORGANIC_PRODUCE', 'PROCESSED_GOODS', 'SEEDS_PLANTS', 'OTHER'
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log('BuyerDashboard - Fetching data for buyer:', user?.name);
      
      try {
        // Try to fetch available products from backend
        const productsResponse = await axios.get('http://localhost:8080/api/products/all?size=50');
        setProducts(productsResponse.data.content || productsResponse.data || []);
        console.log('✅ Products fetched from database for buyer:', productsResponse.data);

        // Try to fetch buyer's orders
        try {
          const ordersResponse = await axios.get('http://localhost:8080/api/orders/my-orders?size=10');
          setOrders(ordersResponse.data.content || []);
        } catch (orderError) {
          console.log('Orders API not available, using demo orders');
          setOrders([
            {
              id: 1,
              productName: 'Demo Order - Organic Tomatoes',
              quantity: 5,
              totalAmount: 125,
              status: 'DELIVERED',
              orderDate: new Date().toISOString().split('T')[0]
            }
          ]);
        }

      } catch (apiError) {
        console.log('❌ Backend not available, using demo data for buyer:', apiError.message);
        
        // Fallback demo data for buyers
        setProducts([
          {
            id: 1,
            name: 'Fresh Organic Tomatoes',
            description: 'Locally grown organic tomatoes, pesticide-free',
            category: 'VEGETABLES',
            pricePerUnit: 25.0,
            unit: 'kg',
            quantityAvailable: 100,
            farmer: { id: 1, name: 'John Farmer', email: 'john@farm.com' },
            status: 'AVAILABLE',
            quality: 'Organic',
            location: 'Green Valley Farm'
          },
          {
            id: 2,
            name: 'Premium Basmati Rice',
            description: 'High quality aged basmati rice',
            category: 'GRAINS',
            pricePerUnit: 80.0,
            unit: 'kg',
            quantityAvailable: 50,
            farmer: { id: 2, name: 'Rice Master', email: 'rice@farm.com' },
            status: 'AVAILABLE',
            quality: 'Premium',
            location: 'Rice Fields Valley'
          },
          {
            id: 3,
            name: 'Farm Fresh Apples',
            description: 'Crispy red apples from mountain farms',
            category: 'FRUITS',
            pricePerUnit: 120.0,
            unit: 'kg',
            quantityAvailable: 75,
            farmer: { id: 3, name: 'Apple Orchard', email: 'apples@farm.com' },
            status: 'AVAILABLE',
            quality: 'Premium',
            location: 'Mountain Apple Farm'
          }
        ]);
        
        setOrders([
          {
            id: 1,
            productName: 'Demo Order - Organic Tomatoes',
            quantity: 5,
            totalAmount: 125,
            status: 'DELIVERED',
            orderDate: new Date().toISOString().split('T')[0]
          }
        ]);
        
        console.log('✅ Demo data loaded for buyer dashboard!');
      }

    } catch (error) {
      console.error('Error fetching buyer dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      let url = 'http://localhost:8080/api/products/all?size=50';
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);
      
      if (params.toString()) {
        url += '&' + params.toString();
      }

      const response = await axios.get(url);
      setProducts(response.data.content || response.data || []);
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  const addToCart = (product, quantity = 1) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: Math.min(item.quantity + quantity, product.quantityAvailable) }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity }]);
    }
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      setCart(cart.filter(item => item.product.id !== productId));
    } else {
      setCart(cart.map(item => 
        item.product.id === productId 
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => 
      total + (item.product.pricePerUnit * item.quantity), 0
    );
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    try {
      const orderData = {
        deliveryAddress: orderForm.deliveryAddress,
        notes: orderForm.notes,
        items: cart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        }))
      };

      await axios.post('http://localhost:8080/api/orders/create', orderData);

      alert('Order placed successfully!');
      setCart([]);
      setShowOrderForm(false);
      setOrderForm({ deliveryAddress: '', notes: '' });
      fetchDashboardData();
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800';
      case 'OUT_OF_STOCK':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
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
              <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
              <p className="text-gray-600 mt-1">Discover fresh produce from local farmers</p>
            </div>
            <button
              onClick={() => setShowCart(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2 relative"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Cart ({cart.length})</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
          </form>
        </div>

        {/* Products Grid */}
        {/* Orders Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Orders</h2>
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">You have not placed any orders yet.</p>
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
                      <td className="px-4 py-2">{order.status}</td>
                      <td className="px-4 py-2">{order.orderDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)} mt-1`}>
                      {product.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary-600">₹{product.pricePerUnit}</p>
                    <p className="text-sm text-gray-600">per {product.unit}</p>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <Package className="h-4 w-4" />
                    <span>{product.quantityAvailable} {product.unit} available</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{product.location}</span>
                  </div>
                </div>

                {product.quality && (
                  <div className="mb-4">
                    <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {product.quality}
                    </span>
                  </div>
                )}

                <button
                  onClick={() => addToCart(product)}
                  disabled={product.status !== 'AVAILABLE' || product.quantityAvailable === 0}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2 rounded-lg font-medium flex items-center justify-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No products found</p>
            <p className="text-gray-400 mt-2">Try adjusting your search filters</p>
          </div>
        )}
      </div>

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
              <button
                onClick={() => setShowCart(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <div>
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product.name}</h4>
                        <p className="text-sm text-gray-600">₹{item.product.pricePerUnit}/{item.product.unit}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.quantityAvailable}
                          className="p-1 text-gray-500 hover:text-gray-700 disabled:text-gray-300"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="font-semibold">₹{(item.product.pricePerUnit * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total: ₹{getTotalAmount().toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => {
                      setShowCart(false);
                      setShowOrderForm(true);
                    }}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-medium"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order Form Modal */}
      {showOrderForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Place Order</h2>
            
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                <textarea
                  required
                  value={orderForm.deliveryAddress}
                  onChange={(e) => setOrderForm({...orderForm, deliveryAddress: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 h-20"
                  placeholder="Enter your delivery address..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                <textarea
                  value={orderForm.notes}
                  onChange={(e) => setOrderForm({...orderForm, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 h-16"
                  placeholder="Any special instructions..."
                />
              </div>

              <div className="border-t pt-4">
                <p className="text-lg font-semibold mb-4">Total: ₹{getTotalAmount().toFixed(2)}</p>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowOrderForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
                >
                  Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerDashboard;