import { useState, useEffect } from "react"
import { userService } from "@/services/api/userService"
import { useLanguage } from "@/hooks/useLanguage"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"

const UserRole = () => {
  const { t } = useLanguage()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      setLoading(true)
      const userData = await userService.getCurrentUser()
      setUser(userData)
    } catch (error) {
      console.error("Error loading user:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 animate-pulse">
        <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
        <div className="w-16 h-4 bg-gray-200 rounded"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="flex items-center gap-2">
      <ApperIcon 
        name={user.role === "teacher" ? "GraduationCap" : "BookOpen"} 
        size={16} 
      />
      <Badge variant={user.role === "teacher" ? "primary" : "success"}>
        {t(user.role)}
      </Badge>
    </div>
  )
}

export default UserRole