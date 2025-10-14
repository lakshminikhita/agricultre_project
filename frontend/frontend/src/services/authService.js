import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth/';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const original = err.config;

    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(err);
  }
);

class AuthService {
  async login(email, password, userType = 'FARMER') {
    console.log('AuthService.login called with:', { email, password: '***', userType });
    
    try {
      // TRY BACKEND FIRST - if available
      const response = await api.post('signin', {
        email,
        password,
      });

      console.log('✅ Login successful via backend:', response.data);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        const userObj = {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          userType: response.data.userType,
        };
        localStorage.setItem('user', JSON.stringify(userObj));
        return userObj;
      }
    } catch (error) {
      console.log('❌ Backend login failed, using demo mode:', error.message);
    }
    
    // FALLBACK: DEMO MODE for basic project
    if (email && password) {
      console.log('✅ Using demo login for basic project');
      
      // Check if user was registered in demo mode
      const registeredUser = localStorage.getItem('registeredUser');
      if (registeredUser) {
        const regUser = JSON.parse(registeredUser);
        if (regUser.email === email) {
          console.log('✅ Found registered demo user:', regUser);
          localStorage.setItem('user', JSON.stringify(regUser));
          return regUser;
        }
      }
      
      // Determine user type based on email pattern or explicit selection
      let finalUserType = userType;
      if (email.includes('buyer') || email.includes('customer')) {
        finalUserType = 'BUYER';
      } else if (email.includes('farmer') || email.includes('farm')) {
        finalUserType = 'FARMER';
      }
      
      const userObj = {
        id: finalUserType === 'BUYER' ? 2 : 1,
        name: email.split('@')[0] || 'Demo User', // Use email prefix as name
        email: email,
        userType: finalUserType,
      };

      // Store user data only (no token needed for basic project)
      localStorage.setItem('user', JSON.stringify(userObj));
      console.log('✅ User stored for basic project:', userObj);
      return userObj;
    }

    throw new Error('Login failed - please provide email and password');
  }

  async register(userData) {
    console.log('AuthService.register called with:', userData);
    
    try {
      // TRY BACKEND FIRST - if available
      const response = await api.post('signup', userData);
      console.log('✅ Registration successful via backend:', response.data);
      return response.data;
    } catch (error) {
      console.log('❌ Backend registration failed, using demo mode:', error.message);
      
      // FALLBACK: DEMO MODE for basic project
      if (userData.email && userData.password && userData.name) {
        console.log('✅ Using demo registration for basic project');
        
        const userObj = {
          id: userData.userType === 'BUYER' ? 2 : 1,
          name: userData.name,
          email: userData.email,
          userType: userData.userType || 'FARMER',
        };

        // Store user data for future login
        localStorage.setItem('registeredUser', JSON.stringify(userObj));
        console.log('✅ Demo user registered successfully:', userObj);
        
        return { message: 'Registration successful! You can now sign in.' };
      }
      
      throw new Error('Registration failed - please provide all required information');
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated() {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  async getCurrentUserProfile() {
    const response = await api.get('me');
    return response.data;
  }
}

export default new AuthService();