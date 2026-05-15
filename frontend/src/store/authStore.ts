import { create } from 'zustand';
import { User } from '../types';
import api from '../api/client';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
  init: () => void;
  setAuth: (token: string, user: User) => void;
  updateUser: (user: User) => void;
}

const _token = localStorage.getItem('token');
const _userStr = localStorage.getItem('user');

export const useAuthStore = create<AuthState>((set) => ({
  user: _token && _userStr ? JSON.parse(_userStr) : null,
  token: _token,
  loading: false,

  init() {},

  async login(email, password) {
    set({ loading: true });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      set({ token: data.token, user: data.user });
    } finally {
      set({ loading: false });
    }
  },

  async register(email, name, password) {
    set({ loading: true });
    try {
      const { data } = await api.post('/auth/register', { email, name, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      set({ token: data.token, user: data.user });
    } finally {
      set({ loading: false });
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },

  setAuth(token: string, user: User) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ token, user });
  },

  updateUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },
}));
