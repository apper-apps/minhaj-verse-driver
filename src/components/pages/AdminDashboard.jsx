import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { useLanguage } from "@/hooks/useLanguage"
import Card from "@/components/atoms/Card"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import UserActivityTimeline from "@/components/organisms/UserActivityTimeline"
import ApperIcon from "@/components/ApperIcon"

const AdminDashboard = () => {
  const { t, isRTL } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Show welcome toast for admin dashboard
    toast.info("Welcome to Admin Dashboard", {
      position: "top-right",
      autoClose: 3000
    })
  }, [])

  if (loading) return <Loading message="Loading admin dashboard..." />
  if (error) return <Error message={error} onRetry={() => setError(null)} />

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header Section */}
      <div className="bg-white shadow-card border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center">
              <ApperIcon name="Shield" size={24} className="text-white" />
            </div>
            <div className={`${isRTL ? "text-right" : "text-left"}`}>
              <h1 className="text-3xl font-display font-bold text-primary">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Monitor user activities and platform analytics
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <ApperIcon name="Users" size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">156</p>
                <p className="text-sm text-gray-600">Total Users</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <ApperIcon name="Activity" size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
                <p className="text-sm text-gray-600">Total Activities</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <ApperIcon name="TrendingUp" size={24} className="text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">89%</p>
                <p className="text-sm text-gray-600">Engagement Rate</p>
              </div>
            </div>
          </Card>
        </div>

        {/* User Activity Timeline */}
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">User Activity Timeline</h2>
            <p className="text-gray-600">
              Monitor and analyze user interactions across the platform
            </p>
          </div>
          <UserActivityTimeline />
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboard