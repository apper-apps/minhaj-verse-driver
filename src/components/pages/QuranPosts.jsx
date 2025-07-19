import { useState, useEffect } from "react"
import { useLanguage } from "@/hooks/useLanguage"
import { postService } from "@/services/api/postService"
import { userService } from "@/services/api/userService"
import { toast } from "react-toastify"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Input from "@/components/atoms/Input"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import SearchBar from "@/components/molecules/SearchBar"
import ApperIcon from "@/components/ApperIcon"

const QuranPosts = () => {
  const { t } = useLanguage()
  const [posts, setPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newPost, setNewPost] = useState({
    content: "",
    ayahReference: "",
    ayahText: ""
  })
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [postsData, userData] = await Promise.all([
        postService.getAll(),
        userService.getCurrentUser()
      ])
      
      setPosts(postsData)
      setFilteredPosts(postsData)
      setCurrentUser(userData)
    } catch (err) {
      setError("Failed to load posts")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredPosts(posts)
      return
    }
    
    const filtered = posts.filter(post =>
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.ayahReference.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredPosts(filtered)
  }

  const handleCreatePost = async (e) => {
    e.preventDefault()
    
    if (!newPost.content.trim()) {
      toast.error("Please enter some content")
      return
    }

    setCreating(true)
    
    try {
      const postData = {
        userId: currentUser.Id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        content: newPost.content,
        ayahReference: newPost.ayahReference,
        ayahText: newPost.ayahText
      }
      
      await postService.create(postData)
      toast.success("Post created successfully! 🎉")
      
      // Reset form
      setNewPost({ content: "", ayahReference: "", ayahText: "" })
      setShowCreateForm(false)
      
      // Reload posts
      const updatedPosts = await postService.getAll()
      setPosts(updatedPosts)
      setFilteredPosts(updatedPosts)
      
    } catch (err) {
      toast.error("Failed to create post")
    } finally {
      setCreating(false)
    }
  }

  const handleLikePost = async (postId) => {
    try {
      await postService.likePost(postId)
      
      // Update local state
      const updatedPosts = posts.map(post =>
        post.Id === postId ? { ...post, likes: post.likes + 1 } : post
      )
      setPosts(updatedPosts)
      setFilteredPosts(updatedPosts)
      
      toast.success("❤️ Liked!")
    } catch (err) {
      toast.error("Failed to like post")
    }
  }

  if (loading) return <Loading message="Loading Qur'an posts..." />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold text-transparent bg-gradient-to-r from-primary to-primary-light bg-clip-text mb-4">
            🕌 {t("quranPosts")}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Share and discover beautiful Qur'anic reflections and Islamic wisdom
          </p>
          
          {/* Search */}
          <div className="flex justify-center mb-6">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search posts, authors, or ayahs..."
            />
          </div>

          {/* Create Post Button */}
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            variant="primary"
            size="lg"
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            {t("createPost")}
          </Button>
        </div>

        {/* Create Post Form */}
        {showCreateForm && (
          <Card className="p-6 mb-8">
            <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
              <ApperIcon name="Edit3" size={20} />
              ✨ Create New Post
            </h3>
            
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Reflection
                </label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Share your thoughts, reflections, or Islamic wisdom..."
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl resize-none focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  rows="4"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📖 Ayah Reference (Optional)
                  </label>
                  <Input
                    value={newPost.ayahReference}
                    onChange={(e) => setNewPost(prev => ({ ...prev, ayahReference: e.target.value }))}
                    placeholder="e.g., Surah Al-Baqarah 2:255"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📜 Ayah Text (Optional)
                  </label>
                  <Input
                    value={newPost.ayahText}
                    onChange={(e) => setNewPost(prev => ({ ...prev, ayahText: e.target.value }))}
                    placeholder="Enter the ayah translation..."
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={creating}
                  variant="primary"
                >
                  {creating ? (
                    <>
                      <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Send" size={16} className="mr-2" />
                      Share Post
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  variant="ghost"
                >
                  {t("cancel")}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Posts List */}
        {filteredPosts.length === 0 ? (
          <Empty
            title="No Posts Found"
            description="No posts match your search criteria. Try different keywords or create the first post!"
            action={() => setShowCreateForm(true)}
            actionLabel="Create First Post"
            icon="MessageSquare"
          />
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <Card key={post.Id} className="p-6 hover:shadow-lg transition-all">
                {/* Post Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-3xl">{post.userAvatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-900">
                        {post.userName}
                      </span>
                      {post.isFeatured && (
                        <Badge variant="warning">
                          ⭐ Featured
                        </Badge>
                      )}
                      <span className="text-sm text-gray-500">
                        • {new Date(post.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="mb-4">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {post.content}
                  </p>
                  
                  {/* Ayah Quote */}
                  {post.ayahReference && (
                    <div className="bg-gradient-to-r from-primary/5 to-primary-light/5 p-4 rounded-xl border-l-4 border-primary mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ApperIcon name="Book" size={16} className="text-primary" />
                        <span className="text-sm font-medium text-primary">
                          📖 {post.ayahReference}
                        </span>
                      </div>
                      {post.ayahText && (
                        <p className="text-gray-700 italic leading-relaxed">
                          "{post.ayahText}"
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Post Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={() => handleLikePost(post.Id)}
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-red-500"
                    >
                      <ApperIcon name="Heart" size={16} className="mr-1" />
                      {post.likes}
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="text-gray-600">
                      <ApperIcon name="MessageCircle" size={16} className="mr-1" />
                      Comment
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="text-gray-600">
                      <ApperIcon name="Share2" size={16} className="mr-1" />
                      Share
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-gray-600">
                      <ApperIcon name="Bookmark" size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Inspiration Section */}
        <Card className="mt-8 p-6 bg-gradient-to-r from-primary/5 to-primary-light/5">
          <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
            <ApperIcon name="Lightbulb" size={20} />
            💡 Share Islamic Wisdom
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📖</span>
              <div>
                <h4 className="font-medium mb-1">Qur'anic Reflections</h4>
                <p className="text-gray-600">Share meaningful verses and their impact on your life</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🤲</span>
              <div>
                <h4 className="font-medium mb-1">Daily Lessons</h4>
                <p className="text-gray-600">Post insights from your Islamic studies and prayers</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🌟</span>
              <div>
                <h4 className="font-medium mb-1">Inspire Others</h4>
                <p className="text-gray-600">Help fellow learners grow in their faith journey</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default QuranPosts