import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  isGuest: boolean;
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
  const [username, setUsername] = useState<string | null>(null);

  const isGuest = username === 'guest';

  useEffect(() => {
    const authStatus = localStorage.getItem('kdm_auth');
    const savedUser = localStorage.getItem('kdm_user');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      setUsername(savedUser);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    // Admin account
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      setUsername(username);
      localStorage.setItem('kdm_auth', 'true');
      localStorage.setItem('kdm_user', username);
      return true;
    }

    // Guest account
    if (username === 'guest' && password === 'guest123') {
      setIsAuthenticated(true);
      setUsername(username);
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
      setUsername(username);
      localStorage.setItem('kdm_auth', 'true');
      localStorage.setItem('kdm_user', username);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername(null);
    localStorage.removeItem('kdm_auth');
    localStorage.removeItem('kdm_user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, isGuest, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};