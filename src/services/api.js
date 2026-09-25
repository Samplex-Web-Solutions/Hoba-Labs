const API_BASE_URL = import.meta.env.VITE_API_URL; 

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

export async function saveOnboardingApi(onboardingData) {
  const response = await fetch(`${API_BASE_URL}/auth/onboarding`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(onboardingData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to save onboarding');
  return data;
}