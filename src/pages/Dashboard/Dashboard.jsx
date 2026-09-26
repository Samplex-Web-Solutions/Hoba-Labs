import React from 'react'
import { useAuthStore } from '../../store/authStore'

const Dashboard = () => {
  const { user } = useAuthStore()
  const logout = () => {
    useAuthStore.getState().setUser(null)
    localStorage.removeItem('authState')
  }

  return (
    <div>Dashboard <br />
      Welcome, {user?.firstName} {user?.lastName} <br />
      Phone: {user?.phone} <br />

      <button className='bg-red-800 m-10 hover:bg-red-600 ease-in-out duration-500 text-white rounded-full px-6 py-4' onClick={logout} name="logout">
        Logout navigate(/login)
      </button>
    </div>
  )
}

export default Dashboard