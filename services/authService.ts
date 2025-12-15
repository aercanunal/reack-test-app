import { User, UserRole, AuthState } from '../types';

const STORAGE_KEY_TOKEN = 'blog_auth_token';
const STORAGE_KEY_USER = 'blog_auth_user';

// Mock Users
const ADMIN_USER: User = {
  id: '1',
  username: 'admin',
  displayName: 'Ahmet Ercan Unal',
  role: UserRole.ADMIN,
  avatarUrl: 'https://picsum.photos/200',
};

const REGULAR_USER: User = {
  id: '2',
  username: 'user',
  displayName: 'Ziyaretçi',
  role: UserRole.USER,
  avatarUrl: 'https://picsum.photos/201',
};

export const AuthService = {
  login: async (username: string): Promise<AuthState> => {
    // Simulating network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    let user: User;
    if (username === 'admin') {
      user = ADMIN_USER;
    } else {
      user = { ...REGULAR_USER, username, displayName: username };
    }

    // Mock JWT Token generation (random string)
    const token = `eyJh...${Math.random().toString(36).substring(7)}`;

    localStorage.setItem(STORAGE_KEY_TOKEN, token);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));

    return {
      user,
      token,
      isAuthenticated: true,
    };
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    localStorage.removeItem(STORAGE_KEY_USER);
  },

  getAuthState: (): AuthState => {
    const token = localStorage.getItem(STORAGE_KEY_TOKEN);
    const userStr = localStorage.getItem(STORAGE_KEY_USER);
    
    if (token && userStr) {
      return {
        token,
        user: JSON.parse(userStr),
        isAuthenticated: true,
      };
    }
    return {
      token: null,
      user: null,
      isAuthenticated: false,
    };
  },

  hasRole: (user: User | null, role: UserRole): boolean => {
    return user?.role === role;
  }
};