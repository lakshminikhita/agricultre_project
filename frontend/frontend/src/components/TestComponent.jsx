import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const TestComponent = () => {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [testUser, setTestUser] = useState({
    name: 'Test Farmer',
    email: 'testfarmer@example.com',
    password: 'password123',
    userType: 'FARMER',
    farmSize: '10 acres',
    farmLocation: 'Test Farm Location'
  });

  const runTest = async (testName, testFunction) => {
    setLoading(true);
    try {
      const result = await testFunction();
      setTestResults(prev => ({
        ...prev,
        [testName]: { success: true, data: result, error: null }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [testName]: { success: false, data: null, error: error.message }
      }));
    }
    setLoading(false);
  };

  const testRegisterUser = async () => {
    const response = await axios.post('http://localhost:8080/api/auth/register', testUser);
    return response.data;
  };

  const testLoginUser = async () => {
    const response = await axios.post('http://localhost:8080/api/auth/login', {
      email: testUser.email,
      password: testUser.password
    });
    return response.data;
  };

  const testFetchProducts = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:8080/api/products/all?size=10', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  };

  const testCreateProduct = async () => {
    const token = localStorage.getItem('token');
    const product = {
      name: 'Test Tomatoes',
      category: 'VEGETABLES',
      description: 'Fresh organic tomatoes',
      pricePerUnit: 50.0,
      unit: 'kg',
      quantityAvailable: 100,
      location: 'Test Farm',
      quality: 'Grade A',
      status: 'AVAILABLE'
    };
    const response = await axios.post('http://localhost:8080/api/products/create', product, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  };

  const testFetchMyProducts = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:8080/api/products/my-products', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  };

  const testMarketPrices = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:8080/api/market/prices?size=5', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  };

  const tests = [
    { name: 'Register User', function: testRegisterUser },
    { name: 'Login User', function: testLoginUser },
    { name: 'Fetch All Products', function: testFetchProducts },
    { name: 'Create Product', function: testCreateProduct },
    { name: 'Fetch My Products', function: testFetchMyProducts },
    { name: 'Market Prices', function: testMarketPrices }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">API Testing Component</h1>
          <p className="text-gray-600 mb-4">
            Test the API endpoints to ensure everything is working correctly.
          </p>
          
          {user && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-green-800">Current User:</h3>
              <p className="text-green-700">Name: {user.name}</p>
              <p className="text-green-700">Email: {user.email}</p>
              <p className="text-green-700">Type: {user.userType}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tests.map((test) => (
              <div key={test.name} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{test.name}</h3>
                <button
                  onClick={() => runTest(test.name, test.function)}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-medium"
                >
                  {loading ? 'Testing...' : 'Run Test'}
                </button>
                
                {testResults[test.name] && (
                  <div className={`mt-3 p-3 rounded-lg text-sm ${
                    testResults[test.name].success 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {testResults[test.name].success ? (
                      <div>
                        <p className="font-medium">✅ Success</p>
                        <pre className="mt-2 text-xs overflow-x-auto">
                          {JSON.stringify(testResults[test.name].data, null, 2)}
                        </pre>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium">❌ Failed</p>
                        <p className="mt-1">{testResults[test.name].error}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Test User Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={testUser.name}
                onChange={(e) => setTestUser({...testUser, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={testUser.email}
                onChange={(e) => setTestUser({...testUser, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={testUser.password}
                onChange={(e) => setTestUser({...testUser, password: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
              <select
                value={testUser.userType}
                onChange={(e) => setTestUser({...testUser, userType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="FARMER">FARMER</option>
                <option value="BUYER">BUYER</option>
                <option value="ADVISOR">ADVISOR</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Farm Size</label>
              <input
                type="text"
                value={testUser.farmSize}
                onChange={(e) => setTestUser({...testUser, farmSize: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Farm Location</label>
              <input
                type="text"
                value={testUser.farmLocation}
                onChange={(e) => setTestUser({...testUser, farmLocation: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestComponent;