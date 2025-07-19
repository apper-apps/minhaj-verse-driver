import classesData from "@/services/mockData/classes.json"

let classes = [...classesData.classes]

export const classService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 350))
    return [...classes]
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 250))
    return classes.find(cls => cls.Id === parseInt(id))
  },

  async create(classData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newClass = {
      Id: Math.max(...classes.map(c => c.Id)) + 1,
      ...classData,
      students: 0
    }
    classes.push(newClass)
    return newClass
  },

  async update(id, classData) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = classes.findIndex(cls => cls.Id === parseInt(id))
    if (index !== -1) {
      classes[index] = { ...classes[index], ...classData }
      return classes[index]
    }
    return null
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = classes.findIndex(cls => cls.Id === parseInt(id))
    if (index !== -1) {
      const deletedClass = classes.splice(index, 1)[0]
      return deletedClass
    }
    return null
  },

  async joinClass(classId, userId) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const classIndex = classes.findIndex(cls => cls.Id === parseInt(classId))
    if (classIndex !== -1) {
      classes[classIndex].students += 1
      return classes[classIndex]
    }
    return null
  }
}