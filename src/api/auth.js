import axios from 'axios'

const API_URL = 'http://localhost:3000/api/auth' // Next.js Backend URL

// 🟢 Register
export const register = async (userData) => {
  return axios.post(`${API_URL}/register`, userData)
}

// 🔵 Login
export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials)
  localStorage.setItem('token', response.data.token) // Store JWT
  return response.data
}

// 🔴 Get User Info (Protected)
export const getUser = async () => {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('No token found')

  return axios.get(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

// 🚪 Logout
export const logout = () => {
  localStorage.removeItem('token')
}
