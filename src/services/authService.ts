import AsyncStorage from '@react-native-async-storage/async-storage';
import { FarmerProfile } from '../types/agri';

export interface AuthState {
  user: FarmerProfile | null;
  isAuthenticated: boolean;
  token: string | null;
}

export interface LoginPayload {
  name: string;
  location: string;
  state: string;
  district: string;
}

const STORAGE_KEY = '@agriverse_user_profile';

export class AuthService {
  private currentUser: FarmerProfile | null = null;

  async login(payload: LoginPayload): Promise<AuthState> {
    const { name, location, state, district } = payload;
    if (!name.trim() || !location.trim() || !state.trim() || !district.trim()) {
      throw new Error('All 4 fields (Full Name, Location, State, and District) are mandatory.');
    }

    const profile: FarmerProfile = {
      name: name.trim(),
      location: location.trim(),
      state: state.trim(),
      district: district.trim(),
      farmSizeAcres: 12.5,
      soilTypes: ['Alluvial Loam', 'Clay Loam'],
      primaryCrops: ['Wheat', 'Basmati Rice', 'Mustard'],
      memberSince: '2026',
      phone: '',
      email: '',
    };

    this.currentUser = profile;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));

    return {
      user: profile,
      isAuthenticated: true,
      token: 'agriverse_jwt_token_session',
    };
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    await AsyncStorage.removeItem(STORAGE_KEY);
  }

  async getProfile(): Promise<FarmerProfile | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data) as FarmerProfile;
        if (parsed && parsed.name && parsed.location && parsed.state && parsed.district) {
          this.currentUser = parsed;
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load profile from storage:', e);
    }
    this.currentUser = null;
    return null;
  }

  async updateProfile(profile: Partial<FarmerProfile>): Promise<FarmerProfile> {
    if (this.currentUser) {
      this.currentUser = { ...this.currentUser, ...profile };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.currentUser));
    }
    return this.currentUser!;
  }
}

export const authService = new AuthService();
export default authService;
