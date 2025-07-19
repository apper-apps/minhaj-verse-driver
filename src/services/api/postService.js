import postsData from "@/services/mockData/posts.json"

let posts = [...postsData.posts]

export const postService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...posts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return posts.find(post => post.Id === parseInt(id))
  },

  async create(postData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newPost = {
      Id: Math.max(...posts.map(p => p.Id)) + 1,
      ...postData,
      likes: 0,
      isFeatured: false,
      timestamp: new Date().toISOString()
    }
    posts.unshift(newPost)
    return newPost
  },

  async update(id, postData) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = posts.findIndex(post => post.Id === parseInt(id))
    if (index !== -1) {
      posts[index] = { ...posts[index], ...postData }
      return posts[index]
    }
    return null
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = posts.findIndex(post => post.Id === parseInt(id))
    if (index !== -1) {
      const deletedPost = posts.splice(index, 1)[0]
      return deletedPost
    }
    return null
  },

  async likePost(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const index = posts.findIndex(post => post.Id === parseInt(id))
    if (index !== -1) {
      posts[index].likes += 1
      return posts[index]
    }
    return null
  }
}