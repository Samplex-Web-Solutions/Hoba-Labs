import { useAuthStore } from '../store/authStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const authHeader = () => {
  const token = useAuthStore.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function registerApi(userData) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Registration failed');
  return data;
}

export async function loginApi(credentials) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Login failed');
  return data;
}

export const saveOnboardingApi = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/auth/onboarding`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(formData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to save onboarding');
  return data;
};

export const linkTelegramApi = async ({ telegramId, username, phone, password }) => {
  const response = await fetch(`${API_BASE_URL}/auth/link-telegram`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ telegram_id: telegramId, username, phone, password }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to link Telegram account');
  return data;
};

export async function getSubscriptionPlansApi() {
  const response = await fetch(`${API_BASE_URL}/subscription/plans`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch subscription plans');
  return data;
}

export async function initializeSubscriptionPaymentApi(planKey) {
  const response = await fetch(`${API_BASE_URL}/subscription/initialize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ plan_key: planKey }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to initialize payment');
  return data;
}

export async function verifySubscriptionPaymentApi(reference) {
  const response = await fetch(`${API_BASE_URL}/subscription/verify/${reference}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to verify transaction');
  return data;
}

export const fetchSignalsApi = async (token) => {
  const response = await fetch(`${API_BASE_URL}/signals`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();

  if (!response.ok) {
    // Check if the backend blocked the request due to an expired subscription
    if (response.status === 403) {
      // You can throw a specific error type or object so your component knows to redirect
      const error = new Error(data.message || 'Subscription expired');
      error.isSubscriptionExpired = true;
      throw error;
    }

    throw new Error(data.message || 'Failed to fetch signals');
  }

  return data.signals;
};