import { useState, useEffect, createContext, useContext } from 'react';
import { User, AuthState } from '../types/user';
import { useTheme } from '../contexts/ThemeContext';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => void;
  updateProfile: (updates: Partial<User['profile']>) => void;
  updatePreferences: (updates: Partial<User['preferences']>) => void;
  updateUserStats: (stats: Partial<User['stats']>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthProvider = (): AuthContextType => {
  const { setTheme } = useTheme();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = () => {
      try {
        const savedUser = localStorage.getItem('prepbuddy-user');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          // Convert date strings back to Date objects
          user.createdAt = new Date(user.createdAt);
          user.lastLoginAt = new Date(user.lastLoginAt);
          
          // Apply user's theme preference
          if (user.preferences?.theme) {
            setTheme(user.preferences.theme);
          }
          
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Error loading user session:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkExistingSession();
  }, [setTheme]);

  const signIn = async (email: string, password: string): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For development, we'll create a user or load existing one
      let user: User;
      const existingUsers = JSON.parse(localStorage.getItem('prepbuddy-users') || '[]');
      const existingUser = existingUsers.find((u: User) => u.email === email);
      
      if (existingUser) {
        user = {
          ...existingUser,
          lastLoginAt: new Date(),
          createdAt: new Date(existingUser.createdAt),
        };
      } else {
        // Create new user for development
        user = createDefaultUser(email, email.split('@')[0]);
      }
      
      // Apply user's theme preference
      if (user.preferences?.theme) {
        setTheme(user.preferences.theme);
      }
      
      // Save user session
      localStorage.setItem('prepbuddy-user', JSON.stringify(user));
      
      // Update users list
      const updatedUsers = existingUsers.filter((u: User) => u.email !== email);
      updatedUsers.push(user);
      localStorage.setItem('prepbuddy-users', JSON.stringify(updatedUsers));
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Sign in failed. Please try again.',
      }));
    }
  };

  const signUp = async (email: string, password: string, name: string): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('prepbuddy-users') || '[]');
      const userExists = existingUsers.some((u: User) => u.email === email);
      
      if (userExists) {
        throw new Error('User already exists with this email');
      }
      
      // Create new user
      const user = createDefaultUser(email, name);
      
      // Apply user's theme preference
      if (user.preferences?.theme) {
        setTheme(user.preferences.theme);
      }
      
      // Save user session
      localStorage.setItem('prepbuddy-user', JSON.stringify(user));
      
      // Add to users list
      existingUsers.push(user);
      localStorage.setItem('prepbuddy-users', JSON.stringify(existingUsers));
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Sign up failed. Please try again.',
      }));
    }
  };

  const signOut = () => {
    localStorage.removeItem('prepbuddy-user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  const updateProfile = (updates: Partial<User['profile']>) => {
    if (!authState.user) return;
    
    const updatedUser = {
      ...authState.user,
      profile: { ...authState.user.profile, ...updates },
    };
    
    localStorage.setItem('prepbuddy-user', JSON.stringify(updatedUser));
    setAuthState(prev => ({ ...prev, user: updatedUser }));
  };

  const updatePreferences = (updates: Partial<User['preferences']>) => {
    if (!authState.user) return;
    
    const updatedUser = {
      ...authState.user,
      preferences: { ...authState.user.preferences, ...updates },
    };
    
    // Save user data to localStorage
    localStorage.setItem('prepbuddy-user', JSON.stringify(updatedUser));
    
    // Update the auth state
    setAuthState(prev => ({ ...prev, user: updatedUser }));
    
    // If it's a theme update, use the ThemeContext's setTheme function directly
    // Our improved ThemeContext will handle all the synchronization
    if (updates.theme && (updates.theme === 'light' || updates.theme === 'dark')) {
      setTheme(updates.theme);
    }
  };

  const updateUserStats = (stats: Partial<User['stats']>) => {
    if (!authState.user) return;
    
    // Check if stats are actually different to avoid unnecessary updates
    const hasChanges = Object.entries(stats).some(
      ([key, value]) => authState.user?.stats[key as keyof User['stats']] !== value
    );
    
    // Only update if there are actual changes
    if (!hasChanges) return;
    
    const updatedUser = {
      ...authState.user,
      stats: { ...authState.user.stats, ...stats },
    };
    
    // Use a batch update approach
    const batchUpdate = () => {
      // Update local storage
      localStorage.setItem('prepbuddy-user', JSON.stringify(updatedUser));
      
      // Update users list
      const existingUsers = JSON.parse(localStorage.getItem('prepbuddy-users') || '[]');
      const updatedUsers = existingUsers.map((u: User) => 
        u.email === updatedUser.email ? updatedUser : u
      );
      localStorage.setItem('prepbuddy-users', JSON.stringify(updatedUsers));
      
      // Update state
      setAuthState(prev => ({ ...prev, user: updatedUser }));
    };
    
    // Use setTimeout to break the circular dependency
    setTimeout(batchUpdate, 0);
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    updateProfile,
    updatePreferences,
    updateUserStats,
  };
};

// Helper function to create a default user with realistic data
const createDefaultUser = (email: string, name: string): User => {
  return {
    id: Date.now().toString(),
    email,
    name,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    createdAt: new Date(),
    lastLoginAt: new Date(),
    preferences: {
      theme: 'light',
      notifications: true,
      studyReminders: true,
      weeklyReports: true,
    },
    profile: {
      bio: '',
      learningGoals: ['Improve my skills', 'Learn new technologies', 'Advance my career'],
      preferredStudyTime: 'evening',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      studyLevel: 'intermediate',
    },
    stats: {
      totalStudyTime: 0,
      plansCompleted: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalXP: 0,
      level: 1,
    },
  };
};

export { AuthContext };