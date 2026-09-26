import { useAuthStore } from '../store/authStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Reads the current token straight from the store (works outside React components too).
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

// No more userId in the payload — the backend now identifies the user from
// the Authorization header (the JWT issued at login/register).
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

// Links Telegram to the current account. If the user is already logged in
// (has a token), phone/password are omitted and the backend trusts the
// session instead. If not, pass { phone, password } as well.
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
