// src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      subscription: null,
      isAuthenticated: false,
      isLoadingAuth: true,

      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),

      // Explicitly saving both user and token
      login: (user, token) => set({ user, token, isAuthenticated: !!user }),

      setSubscription: (subscription) => set({ subscription }),
      setLoadingAuth: (isLoadingAuth) => set({ isLoadingAuth }),

      // Update specific properties on the user object (e.g. after profile edit)
      updateUser: (updatedUser) => set((state) => ({
        user: state.user ? { ...state.user, ...updatedUser } : updatedUser
      })),

      // Specifically toggle or unlock EA access in state (e.g. after license key redemption)
      updateEaAccess: (hasAccess) => set((state) => ({
        user: state.user ? { ...state.user, ea_access: hasAccess } : { ea_access: hasAccess }
      })),

      completeOnboarding: () => set((state) => ({
        user: state.user ? { ...state.user, onboarding_completed: true } : { onboarding_completed: true }
      })),

      logout: () => set({ user: null, token: null, subscription: null, isAuthenticated: false }),
    }),
    {
      name: 'hobalabs-auth-storage',
      // Explicitly serialize and persist token, user, and subscription state
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        subscription: state.subscription,
      }),
    }
  )
);