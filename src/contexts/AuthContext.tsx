import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('kdm_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    // Admin account
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('kdm_auth', 'true');
      localStorage.setItem('kdm_user', username);
      return true;
    }

    // Guest account
    if (username === 'guest' && password === 'guest123') {
      setIsAuthenticated(true);
      localStorage.setItem('kdm_auth', 'true');
      localStorage.setItem('kdm_user', username);
      return true;
    }
    
    // Demo accounts
    const demoAccounts = [
      'demopesantren',
      'demopesantren1',
      'demopesantren2',
      'demopesantren3',
      'demopesantren4',
    ];
    
    if (demoAccounts.includes(username) && password === 'freeplan') {
      setIsAuthenticated(true);
      localStorage.setItem('kdm_auth', 'true');
      localStorage.setItem('kdm_user', username);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('kdm_auth');
    localStorage.removeItem('kdm_user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};