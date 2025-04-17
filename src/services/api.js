// frontend/src/services/api.js
const API_BASE_URL = 'http://localhost:3000/api'
export const getBuildings = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/building`)
    if (!response.ok) {
      throw new Error('Failed to fetch buildings')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching buildings:', error)
    throw error
  }
}

export const createBuilding = async (buildingData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/building/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(buildingData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to create building')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating building:', error)
    throw error
  }
}

export const updateBuilding = async (id, buildingData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/building/${id}/edit`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(buildingData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to update building')
    }

    return await response.json()
  } catch (error) {
    console.error('Error updating building:', error)
    throw error
  }
}

export const deleteBuilding = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/building/${id}/edit`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to delete building')
    }

    return await response.json()
  } catch (error) {
    console.error('Error deleting building:', error)
    throw error
  }
}

export const getBuildingRooms = async (id) => {
  const response = await fetch(`${API_BASE_URL}/building/${id}/rooms`)
  if (!response.ok) throw new Error('Failed to fetch rooms')
  return response.json()
}
