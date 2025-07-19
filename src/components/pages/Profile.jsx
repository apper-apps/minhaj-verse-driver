import { useState, useEffect } from "react"
import { useLanguage } from "@/hooks/useLanguage"
import { userService } from "@/services/api/userService"
import { toast } from "react-toastify"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Input from "@/components/atoms/Input"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import ApperIcon from "@/components/ApperIcon"

const Profile = () => {
  const { t, language, setLanguage } = useLanguage()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    language: "en"
  })

  const avatars = ["👦", "👧", "👨‍🎓", "👩‍🎓", "👨‍🏫", "👩‍🏫", "🧔", "👱‍♀️", "👱‍♂️"]

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const userData = await userService.getCurrentUser()
      setUser(userData)
      setEditForm({
        name: userData.name,
        email: userData.email,
        language: userData.language || "en"
      })
    } catch (err) {
      setError("Failed to load profile data")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    
    if (!editForm.name.trim()) {
      toast.error("Name is required")
      return
    }

    setSaving(true)
    
    try {
      const updatedUser = await userService.update(user.Id, editForm)
      setUser(updatedUser)
      setEditing(false)
      
      // Update app language if changed
      if (editForm.language !== language) {
        setLanguage(editForm.language)
      }
      
      toast.success("Profile updated successfully! ✨")
      
    } catch (err) {
      toast.error("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarChange = async (avatar) => {
    try {
      const updatedUser = await userService.update(user.Id, { avatar })
      setUser(updatedUser)
      toast.success("Avatar updated! 🎉")
    } catch (err) {
      toast.error("Failed to update avatar")
    }
  }

  if (loading) return <Loading message="Loading profile..." />
  if (error) return <Error message={error} onRetry={loadUserData} />

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold text-transparent bg-gradient-to-r from-primary to-primary-light bg-clip-text mb-4">
            👤 {t("profile")}
          </h1>
          <p className="text-xl text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="p-6 text-center">
              <div className="mb-6">
                <div className="text-6xl mb-4">{user?.avatar || "👤"}</div>
                <h2 className="text-xl font-display font-bold text-gray-900 mb-2">
                  {user?.name}
                </h2>
                <p className="text-gray-600 mb-4">{user?.email}</p>
                <div className="flex justify-center gap-2">
                  <Badge variant={user?.role === "teacher" ? "primary" : "success"}>
                    {user?.role === "teacher" ? "👩‍🏫 Teacher" : "👨‍🎓 Student"}
                  </Badge>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-primary/5 rounded-xl">
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Wallet" size={16} className="text-primary" />
                    <span className="text-sm text-gray-700">Wallet Balance</span>
                  </div>
                  <span className="font-bold text-primary">${user?.walletBalance}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-secondary/5 rounded-xl">
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Calendar" size={16} className="text-secondary" />
                    <span className="text-sm text-gray-700">Member Since</span>
                  </div>
                  <span className="font-bold text-secondary">
                    {new Date(user?.joinDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Card>

            {/* Avatar Selection */}
            <Card className="p-6 mt-6">
              <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                <ApperIcon name="Smile" size={20} />
                🎭 Choose Avatar
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {avatars.map((avatar, index) => (
                  <button
                    key={index}
                    onClick={() => handleAvatarChange(avatar)}
                    className={`text-3xl p-3 rounded-xl border-2 transition-all hover:scale-110 ${
                      user?.avatar === avatar
                        ? "border-primary bg-primary/10"
                        : "border-gray-200 hover:border-primary/50"
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Profile Settings */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-xl flex items-center gap-2">
                  <ApperIcon name="Settings" size={20} />
                  ⚙️ Profile Settings
                </h3>
                {!editing && (
                  <Button
                    onClick={() => setEditing(true)}
                    variant="outline"
                    size="sm"
                  >
                    <ApperIcon name="Edit" size={16} className="mr-2" />
                    {t("edit")}
                  </Button>
                )}
              </div>

              {editing ? (
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <Input
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Language
                    </label>
                    <select
                      value={editForm.language}
                      onChange={(e) => setEditForm(prev => ({ ...prev, language: e.target.value }))}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="en">🇺🇸 English</option>
                      <option value="ur">🇵🇰 اردو (Urdu)</option>
                      <option value="ar">🇸🇦 العربية (Arabic)</option>
                    </select>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      disabled={saving}
                      variant="primary"
                    >
                      {saving ? (
                        <>
                          <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <ApperIcon name="Save" size={16} className="mr-2" />
                          {t("save")}
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        setEditing(false)
                        setEditForm({
                          name: user.name,
                          email: user.email,
                          language: user.language || "en"
                        })
                      }}
                      variant="ghost"
                    >
                      {t("cancel")}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <span className="text-gray-900">{user?.name}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <span className="text-gray-900">{user?.email}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Type
                      </label>
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <Badge variant={user?.role === "teacher" ? "primary" : "success"}>
                          {user?.role === "teacher" ? "👩‍🏫 Teacher" : "👨‍🎓 Student"}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                      </label>
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <span className="text-gray-900">
                          {user?.language === "ur" && "🇵🇰 اردو"}
                          {user?.language === "ar" && "🇸🇦 العربية"}
                          {(!user?.language || user?.language === "en") && "🇺🇸 English"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Account Actions */}
            <Card className="p-6 mt-6">
              <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                <ApperIcon name="Shield" size={20} />
                🔐 Account Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start">
                  <ApperIcon name="Key" size={16} className="mr-3" />
                  Change Password
                </Button>
                <Button variant="outline" className="justify-start">
                  <ApperIcon name="Download" size={16} className="mr-3" />
                  Export Data
                </Button>
                <Button variant="outline" className="justify-start">
                  <ApperIcon name="Bell" size={16} className="mr-3" />
                  Notifications
                </Button>
                <Button variant="outline" className="justify-start">
                  <ApperIcon name="HelpCircle" size={16} className="mr-3" />
                  Help & Support
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile