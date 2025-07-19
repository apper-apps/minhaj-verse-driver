import { useState, useEffect } from "react"
import { useLanguage } from "@/hooks/useLanguage"
import { classService } from "@/services/api/classService"
import { userService } from "@/services/api/userService"
import { transactionService } from "@/services/api/transactionService"
import { toast } from "react-toastify"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import SearchBar from "@/components/molecules/SearchBar"
import ApperIcon from "@/components/ApperIcon"

const MyClasses = () => {
  const { t } = useLanguage()
  const [classes, setClasses] = useState([])
  const [filteredClasses, setFilteredClasses] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [joiningClass, setJoiningClass] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [classesData, userData] = await Promise.all([
        classService.getAll(),
        userService.getCurrentUser()
      ])
      
      setClasses(classesData)
      setFilteredClasses(classesData)
      setCurrentUser(userData)
    } catch (err) {
      setError("Failed to load classes")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredClasses(classes)
      return
    }
    
    const filtered = classes.filter(cls =>
      cls.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredClasses(filtered)
  }

  const handleJoinClass = async (classItem) => {
    if (!currentUser) {
      toast.error("Please log in to join classes")
      return
    }

    if (currentUser.walletBalance < classItem.price) {
      toast.error("Insufficient wallet balance")
      return
    }

    setJoiningClass(classItem.Id)
    
    try {
      // Process payment
      await transactionService.processPayment(
        currentUser.Id,
        2, // Teacher ID (simplified)
        classItem.price,
        "lesson",
        `Payment for ${classItem.title}`
      )

      // Update user wallet
      const updatedBalance = currentUser.walletBalance - classItem.price
      await userService.update(currentUser.Id, { walletBalance: updatedBalance })
      setCurrentUser(prev => ({ ...prev, walletBalance: updatedBalance }))

      // Join class
      await classService.joinClass(classItem.Id, currentUser.Id)
      
      toast.success(`Successfully joined ${classItem.title}! 🎉`)
      
      // Refresh classes data
      const updatedClasses = await classService.getAll()
      setClasses(updatedClasses)
      setFilteredClasses(updatedClasses)
      
    } catch (err) {
      toast.error("Failed to join class. Please try again.")
    } finally {
      setJoiningClass(null)
    }
  }

  if (loading) return <Loading message="Loading classes..." />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold text-transparent bg-gradient-to-r from-primary to-primary-light bg-clip-text mb-4">
            📚 {t("myClasses")}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover amazing Islamic education classes taught by qualified teachers
          </p>
          
          {/* Search */}
          <div className="flex justify-center mb-8">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search classes, teachers, or topics..."
            />
          </div>
        </div>

        {/* Classes Grid */}
        {filteredClasses.length === 0 ? (
          <Empty
            title="No Classes Found"
            description="No classes match your search criteria. Try different keywords or browse all available classes."
            icon="BookOpen"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((classItem) => (
              <Card key={classItem.Id} className="p-6 hover:shadow-xl transition-all duration-300">
                {/* Class Header */}
                <div className="mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center text-white font-bold text-xl mb-4">
                    {classItem.title.charAt(0)}
                  </div>
                  <h3 className="text-xl font-display font-bold text-gray-900 mb-2">
                    {classItem.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {classItem.description}
                  </p>
                </div>

                {/* Teacher Info */}
                <div className="flex items-center gap-2 mb-4">
                  <ApperIcon name="User" size={16} className="text-primary" />
                  <span className="text-sm font-medium text-gray-700">
                    👩‍🏫 {classItem.teacher}
                  </span>
                </div>

                {/* Schedule */}
                <div className="flex items-center gap-2 mb-4">
                  <ApperIcon name="Calendar" size={16} className="text-secondary" />
                  <span className="text-sm text-gray-600">
                    🕐 {classItem.schedule}
                  </span>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-2 mb-4">
                  <ApperIcon name="Clock" size={16} className="text-accent" />
                  <span className="text-sm text-gray-600">
                    ⏱️ {classItem.duration}
                  </span>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="primary" className="font-bold">
                    💰 ${classItem.price}
                  </Badge>
                  <Badge variant="success">
                    👥 {classItem.students} students
                  </Badge>
                  <Badge variant="secondary">
                    📊 {classItem.difficulty}
                  </Badge>
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => handleJoinClass(classItem)}
                  disabled={joiningClass === classItem.Id || !currentUser || currentUser.walletBalance < classItem.price}
                  className="w-full"
                  variant="primary"
                >
                  {joiningClass === classItem.Id ? (
                    <>
                      <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                      Joining...
                    </>
                  ) : currentUser && currentUser.walletBalance < classItem.price ? (
                    <>
                      <ApperIcon name="CreditCard" size={16} className="mr-2" />
                      Insufficient Balance
                    </>
                  ) : (
                    <>
                      <ApperIcon name="BookOpen" size={16} className="mr-2" />
                      {t("joinClass")}
                    </>
                  )}
                </Button>

                {/* Wallet Balance Warning */}
                {currentUser && currentUser.walletBalance < classItem.price && (
                  <p className="text-xs text-error mt-2 text-center">
                    💳 Add funds to your wallet to join this class
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* User Balance Info */}
        {currentUser && (
          <Card className="mt-8 p-6 bg-gradient-to-r from-primary/5 to-primary-light/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <ApperIcon name="Wallet" size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    💰 Your Wallet Balance
                  </h3>
                  <p className="text-3xl font-bold text-primary">
                    ${currentUser.walletBalance}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <ApperIcon name="Plus" size={16} className="mr-2" />
                Add Funds
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

export default MyClasses