import activitiesData from "@/services/mockData/activities.json"

let activities = [...activitiesData.activities]

export const activityService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...activities].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return activities.find(activity => activity.Id === parseInt(id))
  },

  async getByUserId(userId) {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...activities]
      .filter(activity => activity.userId === parseInt(userId))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  },

  async create(activityData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newActivity = {
      Id: Math.max(...activities.map(a => a.Id)) + 1,
      ...activityData,
      timestamp: new Date().toISOString()
    }
    activities.unshift(newActivity)
    return newActivity
  },

  async update(id, activityData) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = activities.findIndex(activity => activity.Id === parseInt(id))
    if (index !== -1) {
      activities[index] = { ...activities[index], ...activityData }
      return activities[index]
    }
    return null
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = activities.findIndex(activity => activity.Id === parseInt(id))
    if (index !== -1) {
      const deletedActivity = activities.splice(index, 1)[0]
      return deletedActivity
    }
    return null
  },

  async getActivityTypes() {
    await new Promise(resolve => setTimeout(resolve, 200))
    const types = [...new Set(activities.map(activity => activity.type))]
    return types.sort()
  },

  async getActivitiesByDateRange(startDate, endDate) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    return [...activities]
      .filter(activity => {
        const activityDate = new Date(activity.timestamp)
        return activityDate >= start && activityDate <= end
      })
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }
}