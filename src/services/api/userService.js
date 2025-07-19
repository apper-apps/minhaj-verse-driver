import usersData from "@/services/mockData/users.json"

let users = [...usersData.users]

export const userService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...users]
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return users.find(user => user.Id === parseInt(id))
  },

  async create(userData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newUser = {
      Id: Math.max(...users.map(u => u.Id)) + 1,
      ...userData,
      walletBalance: 0,
      joinDate: new Date().toISOString()
    }
    users.push(newUser)
    return newUser
  },

  async update(id, userData) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = users.findIndex(user => user.Id === parseInt(id))
    if (index !== -1) {
      users[index] = { ...users[index], ...userData }
      return users[index]
    }
    return null
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = users.findIndex(user => user.Id === parseInt(id))
    if (index !== -1) {
      const deletedUser = users.splice(index, 1)[0]
      return deletedUser
    }
    return null
  },

  async getCurrentUser() {
    await new Promise(resolve => setTimeout(resolve, 200))
    // Simulate getting current user from localStorage or session
    const currentUserId = localStorage.getItem("currentUserId")
    if (currentUserId) {
      return users.find(user => user.Id === parseInt(currentUserId))
    }
    return users[0] // Default to first user for demo
  }
}