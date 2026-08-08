import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { FarmerProfile } from '../types/agri';
import { authService, AuthState, LoginPayload } from '../services/authService';

interface AuthContextType {
  user: FarmerProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<AuthState>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<FarmerProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    token: null,
  });
  const [loading, setLoading] = useState(true);

  const initAuth = useCallback(async () => {
    try {
      setLoading(true);
      const profile = await authService.getProfile();
      if (profile) {
        setAuthState({
          user: profile,
          isAuthenticated: true,
          token: 'agriverse_jwt_token_session',
        });
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          token: null,
        });
      }
    } catch (e) {
      console.error('Auth initialization error:', e);
      setAuthState({ user: null, isAuthenticated: false, token: null });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const login = async (payload: LoginPayload) => {
    setLoading(true);
    try {
      const res = await authService.login(payload);
      setAuthState(res);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setAuthState({ user: null, isAuthenticated: false, token: null });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<FarmerProfile>) => {
    const updated = await authService.updateProfile(updates);
    setAuthState((prev) => ({ ...prev, user: updated }));
  };

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        isAuthenticated: authState.isAuthenticated,
        loading,
        login,
        logout,
        updateProfile,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
