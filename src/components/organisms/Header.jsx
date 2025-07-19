import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useLanguage } from "@/hooks/useLanguage"
import Button from "@/components/atoms/Button"
import LanguageSwitch from "@/components/molecules/LanguageSwitch"
import WalletDisplay from "@/components/molecules/WalletDisplay"
import UserRole from "@/components/molecules/UserRole"
import ApperIcon from "@/components/ApperIcon"

const Header = () => {
  const { t, isRTL } = useLanguage()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: t("home"), href: "/", icon: "Home" },
    { name: t("myClasses"), href: "/classes", icon: "BookOpen" },
    { name: t("whiteboard"), href: "/whiteboard", icon: "PenTool" },
    { name: t("quranPosts"), href: "/posts", icon: "MessageSquare" },
    { name: t("myWallet"), href: "/wallet", icon: "Wallet" },
    { name: t("profile"), href: "/profile", icon: "User" },
    { name: t("contact"), href: "/contact", icon: "Mail" }
  ]

  const isActivePage = (href) => {
    return location.pathname === href
  }

  return (
    <header className="bg-white shadow-card border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:scale-105 transition-transform">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center">
              <ApperIcon name="BookHeart" size={24} className="text-white" />
            </div>
            <div className={`${isRTL ? "text-right" : "text-left"}`}>
              <h1 className="text-xl font-display font-bold text-primary">
                Minhaj Verse
              </h1>
              <p className="text-xs text-gray-600 leading-none">
                Islamic Education
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActivePage(item.href)
                    ? "bg-primary text-white shadow-button"
                    : "text-gray-700 hover:text-primary hover:bg-primary/10 hover:scale-105"
                }`}
              >
                <ApperIcon name={item.icon} size={16} />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="hidden lg:flex items-center gap-4">
            <UserRole />
            <WalletDisplay />
            <LanguageSwitch />
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <WalletDisplay />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <ApperIcon name={mobileMenuOpen ? "X" : "Menu"} size={20} />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100">
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                    isActivePage(item.href)
                      ? "bg-primary text-white shadow-button"
                      : "text-gray-700 hover:text-primary hover:bg-primary/10"
                  }`}
                >
                  <ApperIcon name={item.icon} size={20} />
                  {item.name}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <UserRole />
                <LanguageSwitch />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header