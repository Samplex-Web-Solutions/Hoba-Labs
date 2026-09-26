import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      subscription: null,
      isAuthenticated: false,
      isLoadingAuth: true,

      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),

      // Use this after login/register/link-telegram, since those now return a token too.
      login: (user, token) => set({ user, token, isAuthenticated: !!user }),

      setSubscription: (subscription) => set({ subscription }),
      setLoadingAuth: (isLoadingAuth) => set({ isLoadingAuth }),

      completeOnboarding: () => set((state) => ({
        user: state.user ? { ...state.user, onboarding_completed: true } : { onboarding_completed: true }
      })),

      logout: () => set({ user: null, token: null, subscription: null, isAuthenticated: false }),
    }),
    {
      name: 'hobalabs-auth-storage',
    }
  )
);
