import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useLanguage } from "@/hooks/useLanguage"
import { userService } from "@/services/api/userService"
import { classService } from "@/services/api/classService"
import { postService } from "@/services/api/postService"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import ApperIcon from "@/components/ApperIcon"

const Home = () => {
  const { t, isRTL } = useLanguage()
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({})
  const [recentClasses, setRecentClasses] = useState([])
  const [recentPosts, setRecentPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [userData, classesData, postsData] = await Promise.all([
        userService.getCurrentUser(),
        classService.getAll(),
        postService.getAll()
      ])

      setUser(userData)
      setRecentClasses(classesData.slice(0, 3))
      setRecentPosts(postsData.slice(0, 3))
      
      setStats({
        totalClasses: classesData.length,
        totalPosts: postsData.length,
        walletBalance: userData?.walletBalance || 0
      })
    } catch (err) {
      setError("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading message="Loading your dashboard..." />
  if (error) return <Error message={error} onRetry={loadDashboardData} />

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-transparent bg-gradient-to-r from-primary to-primary-light bg-clip-text mb-4">
              {t("welcome")}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              🌙 Assalamu Alaikum, {user?.name || "Dear Student"}! 
              Welcome to your Islamic learning journey.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary-light/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <ApperIcon name="BookOpen" size={24} className="text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">{stats.totalClasses}</p>
                  <p className="text-gray-600">Available Classes</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-secondary/5 to-warning/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                  <ApperIcon name="MessageSquare" size={24} className="text-secondary" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-secondary">{stats.totalPosts}</p>
                  <p className="text-gray-600">Qur&apos;an Posts</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-success/5 to-green-200/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                  <ApperIcon name="Wallet" size={24} className="text-success" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-success">${stats.walletBalance}</p>
                  <p className="text-gray-600">Wallet Balance</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
            🚀 Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link to="/classes">
              <Button variant="primary" className="w-full h-20 flex-col gap-2">
                <ApperIcon name="BookOpen" size={24} />
                Browse Classes
              </Button>
            </Link>
            <Link to="/whiteboard">
              <Button variant="secondary" className="w-full h-20 flex-col gap-2">
                <ApperIcon name="PenTool" size={24} />
                Start Learning
              </Button>
            </Link>
            <Link to="/posts">
              <Button variant="outline" className="w-full h-20 flex-col gap-2">
                <ApperIcon name="MessageSquare" size={24} />
                Share Knowledge
              </Button>
            </Link>
            <Link to="/wallet">
              <Button variant="ghost" className="w-full h-20 flex-col gap-2">
                <ApperIcon name="Wallet" size={24} />
                Manage Wallet
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Classes */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold text-gray-900 flex items-center gap-2">
                <ApperIcon name="BookOpen" size={20} />
                📚 Popular Classes
              </h2>
              <Link to="/classes">
                <Button variant="ghost" size="sm">
                  View All
                  <ApperIcon name="ArrowRight" size={16} className="ml-1" />
                </Button>
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentClasses.map((classItem) => (
                <Card key={classItem.Id} className="p-4 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center text-white font-bold">
                      {classItem.title.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {classItem.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        👩‍🏫 {classItem.teacher}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="primary">${classItem.price}</Badge>
                        <Badge variant="default">{classItem.students} students</Badge>
                        <Badge variant="success">{classItem.difficulty}</Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Posts */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold text-gray-900 flex items-center gap-2">
                <ApperIcon name="MessageSquare" size={20} />
                🕌 Recent Posts
              </h2>
              <Link to="/posts">
                <Button variant="ghost" size="sm">
                  View All
                  <ApperIcon name="ArrowRight" size={16} className="ml-1" />
                </Button>
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <Card key={post.Id} className="p-4 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">{post.userAvatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-900">
                          {post.userName}
                        </span>
                        {post.isFeatured && (
                          <Badge variant="warning">⭐ Featured</Badge>
                        )}
                      </div>
                      <p className="text-gray-700 mb-3 leading-relaxed">
                        {post.content}
                      </p>
                      {post.ayahReference && (
                        <div className="bg-primary/5 p-3 rounded-lg mb-3">
                          <p className="text-sm font-medium text-primary mb-1">
                            📖 {post.ayahReference}
                          </p>
                          <p className="text-sm text-gray-600 italic">
                            "{post.ayahText}"
                          </p>
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <ApperIcon name="Heart" size={14} />
                          {post.likes}
                        </span>
                        <span>{new Date(post.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home