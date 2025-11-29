import { apiService } from '@/services/api.service';
import * as SecureStore from 'expo-secure-store';
import { AUTH_CONFIG } from '@/config/constants';
import {
  SignInProps,
  RegisterCredentials,
  AuthResponse,
  User,
  LoginCredentials,
} from '@/types/auth.types';

class AuthService {
  async login(credentials: LoginCredentials): Promise<SignInProps> {
    try {
      console.log('Login attempt with:', credentials);
      // Simulate API call
      const res = await apiService.post('/user/signin', credentials);
      console.log('Login response:', res);

      // Store tokens securely
      if (res.success) {
        await SecureStore.setItemAsync(AUTH_CONFIG.TOKEN_KEY, res.token);

        await SecureStore.setItemAsync(
          AUTH_CONFIG.USER_KEY,
          JSON.stringify(res.user)
        );

        return res;
      }
    } catch (error) {
      throw new Error(
        'Login failed. Please check your credentials and try again.'
      );
    }
  }

  async register(credentials: RegisterCredentials): Promise<SignInProps> {
    try {
      console.log('Register attempt with:', credentials);
      const res=await apiService.post('/user/signup', credentials);
      console.log('Register response:', res);
      if(res.success){

        await SecureStore.setItemAsync(AUTH_CONFIG.TOKEN_KEY, res.token);


        await SecureStore.setItemAsync(
          AUTH_CONFIG.USER_KEY,
          JSON.stringify(res.user)
        );

        return res;
      }
    } catch (error) {
      throw new Error('Registration failed. Please try again.');
    }
  }

  async logout(): Promise<void> {
    try {
      const res=await apiService.post('/user/signout');
      console.log('Logout response:', res);

      // Clear stored tokens
      await SecureStore.deleteItemAsync(AUTH_CONFIG.TOKEN_KEY);
      // await SecureStore.deleteItemAsync(AUTH_CONFIG.REFRESH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(AUTH_CONFIG.USER_KEY);

    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  async getStoredUser(): Promise<User | null> {
    try {
      const userData = await SecureStore.getItemAsync(AUTH_CONFIG.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting stored user:', error);
      return null;
    }
  }

  async getStoredToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(AUTH_CONFIG.TOKEN_KEY);
    } catch (error) {
      console.error('Error getting stored token:', error);
      return null;
    }
  }

  async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = await SecureStore.getItemAsync(
        AUTH_CONFIG.REFRESH_TOKEN_KEY
      );
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Simulate token refresh
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newToken = 'new-mock-jwt-token';
      await SecureStore.setItemAsync(AUTH_CONFIG.TOKEN_KEY, newToken);

      return newToken;
    } catch (error) {
      console.error('Error refreshing token:', error);
      await this.logout();
      return null;
    }
  }
}

export const authService = new AuthService();
