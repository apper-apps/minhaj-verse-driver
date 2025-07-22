import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { format } from "date-fns"
import { activityService } from "@/services/api/activityService"
import { userService } from "@/services/api/userService"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Input from "@/components/atoms/Input"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import ApperIcon from "@/components/ApperIcon"

const UserActivityTimeline = () => {
  const [activities, setActivities] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedUser, setSelectedUser] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [dateRange, setDateRange] = useState({
    start: "",
    end: ""
  })

  const activityTypes = [
    { value: "", label: "All Activities" },
    { value: "login", label: "Logins" },
    { value: "content_view", label: "Content Views" },
    { value: "post_interaction", label: "Post Interactions" },
    { value: "transaction", label: "Transactions" }
  ]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [activitiesData, usersData] = await Promise.all([
        activityService.getAll(),
        userService.getAll()
      ])
      
      setActivities(activitiesData)
      setUsers(usersData)
      
      toast.success("Activity data loaded successfully")
    } catch (err) {
      setError("Failed to load activity data")
      toast.error("Failed to load activity data")
    } finally {
      setLoading(false)
    }
  }

  const getFilteredActivities = () => {
    let filtered = [...activities]

    // Filter by user
    if (selectedUser) {
      filtered = filtered.filter(activity => activity.userId === parseInt(selectedUser))
    }

    // Filter by type
    if (selectedType) {
      filtered = filtered.filter(activity => activity.type === selectedType)
    }

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(activity => 
        activity.userName.toLowerCase().includes(search) ||
        activity.action.toLowerCase().includes(search) ||
        activity.details.toLowerCase().includes(search)
      )
    }

    // Filter by date range
    if (dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start)
      const endDate = new Date(dateRange.end)
      filtered = filtered.filter(activity => {
        const activityDate = new Date(activity.timestamp)
        return activityDate >= startDate && activityDate <= endDate
      })
    }

    return filtered
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case "login": return "LogIn"
      case "content_view": return "Eye"
      case "post_interaction": return "MessageSquare"
      case "transaction": return "CreditCard"
      default: return "Activity"
    }
  }

  const getActivityColor = (type) => {
    switch (type) {
      case "login": return "bg-blue-100 text-blue-600"
      case "content_view": return "bg-green-100 text-green-600"
      case "post_interaction": return "bg-purple-100 text-purple-600"
      case "transaction": return "bg-orange-100 text-orange-600"
      default: return "bg-gray-100 text-gray-600"
    }
  }

  const getBadgeVariant = (type) => {
    switch (type) {
      case "login": return "default"
      case "content_view": return "success"
      case "post_interaction": return "secondary"
      case "transaction": return "warning"
      default: return "outline"
    }
  }

  const handleClearFilters = () => {
    setSelectedUser("")
    setSelectedType("")
    setSearchTerm("")
    setDateRange({ start: "", end: "" })
    toast.info("Filters cleared")
  }

  if (loading) return <Loading message="Loading user activities..." />
  if (error) return <Error message={error} onRetry={loadData} />

  const filteredActivities = getFilteredActivities()

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="p-6 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* User Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by User
            </label>
            <select 
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="">All Users</option>
              {users.map(user => (
                <option key={user.Id} value={user.Id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
          </div>

          {/* Activity Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Activity Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {activityTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <Input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <Input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="w-full"
            />
          </div>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              icon="Search"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="flex items-center gap-2"
            >
              <ApperIcon name="X" size={16} />
              Clear Filters
            </Button>
            <Button
              onClick={loadData}
              className="flex items-center gap-2"
            >
              <ApperIcon name="RotateCcw" size={16} />
              Refresh
            </Button>
          </div>
        </div>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing {filteredActivities.length} of {activities.length} activities
        </p>
        <div className="flex items-center gap-2">
          <ApperIcon name="Filter" size={16} className="text-gray-400" />
          <span className="text-sm text-gray-500">
            {(selectedUser || selectedType || searchTerm || dateRange.start || dateRange.end) ? 
              "Filtered results" : "All results"}
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {filteredActivities.length === 0 ? (
          <Card className="p-8 text-center">
            <ApperIcon name="Search" size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Activities Found</h3>
            <p className="text-gray-600">
              Try adjusting your filters or search terms to find activities.
            </p>
          </Card>
        ) : (
          filteredActivities.map((activity, index) => (
            <Card key={activity.Id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                {/* Activity Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getActivityColor(activity.type)}`}>
                  <ApperIcon name={getActivityIcon(activity.type)} size={20} />
                </div>

                {/* Activity Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{activity.userAvatar}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900">{activity.userName}</h4>
                        <p className="text-gray-600 text-sm">{activity.action}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={getBadgeVariant(activity.type)}>
                        {activity.type.replace('_', ' ')}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(activity.timestamp), 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                  </div>

                  {/* Activity Details */}
                  {activity.details && (
                    <p className="text-gray-600 text-sm mb-2">{activity.details}</p>
                  )}

                  {/* Technical Details */}
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    {activity.ipAddress && (
                      <span className="flex items-center gap-1">
                        <ApperIcon name="Globe" size={12} />
                        {activity.ipAddress}
                      </span>
                    )}
                    {activity.userAgent && (
                      <span className="flex items-center gap-1">
                        <ApperIcon name="Monitor" size={12} />
                        {activity.userAgent.split('/')[0]}
                      </span>
                    )}
                    {activity.postId && (
                      <span className="flex items-center gap-1">
                        <ApperIcon name="Link" size={12} />
                        Post ID: {activity.postId}
                      </span>
                    )}
                    {activity.transactionId && (
                      <span className="flex items-center gap-1">
                        <ApperIcon name="Receipt" size={12} />
                        Transaction ID: {activity.transactionId}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default UserActivityTimeline