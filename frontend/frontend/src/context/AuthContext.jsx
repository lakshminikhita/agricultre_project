import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      console.log('AuthContext: Initializing auth for basic project...');
      const currentUser = authService.getCurrentUser();
      
      console.log('AuthContext: Initial check - user:', !!currentUser);
      
      // BASIC PROJECT: Only check for user (no token authentication needed)
      if (currentUser) {
        console.log('AuthContext: User found in localStorage, setting user');
        setUser(currentUser);
      } else {
        console.log('AuthContext: No user found, user needs to login');
        setUser(null);
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password, userType = 'FARMER') => {
    try {
      console.log('AuthContext.login called with:', { email, password: '***', userType });
      const userData = await authService.login(email, password, userType);
      console.log('AuthContext received userData from authService:', userData);
      
      // authService.login now returns { token, id, name, email, userType }
      // store only the user portion in context
      if (userData) {
        const userObj = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          userType: userData.userType,
        };
        console.log('AuthContext setting user:', userObj);
        setUser(userObj);
        return userObj;
      }
      console.warn('AuthContext: No userData returned from authService');
      return null;
    } catch (error) {
      console.error('AuthContext.login error:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: authService.isAuthenticated(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};