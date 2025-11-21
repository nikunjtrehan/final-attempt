
export interface Expert {
  id: string;
  name: string;
  title: string;
  company: string;
  rateHour: number;
  rateMinute: number;
  rating: number;
  reviews: number;
  skills: string[];
  bio: string;
  type: 'individual' | 'enterprise';
  image: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  bio?: string;
  phoneNumber?: string;
}

export type PageView = 'home' | 'browse' | 'profile' | 'login' | 'signup' | 'verify-email' | 'my-profile';

export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
}
