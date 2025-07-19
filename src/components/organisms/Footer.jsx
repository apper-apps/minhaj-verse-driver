import { useLanguage } from "@/hooks/useLanguage"
import ApperIcon from "@/components/ApperIcon"

const Footer = () => {
  const { t, isRTL } = useLanguage()

  return (
    <footer className="bg-gradient-to-r from-primary to-primary-light text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className={`${isRTL ? "text-right" : "text-left"}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <ApperIcon name="BookHeart" size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-display font-bold">Minhaj Verse</h3>
                <p className="text-sm opacity-90">Islamic Education Platform</p>
              </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              Empowering children with Islamic knowledge through modern technology and engaging learning experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div className={`${isRTL ? "text-right" : "text-left"}`}>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <ApperIcon name="Link" size={16} />
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/classes" className="opacity-80 hover:opacity-100 transition-opacity">
                  Browse Classes
                </a>
              </li>
              <li>
                <a href="/posts" className="opacity-80 hover:opacity-100 transition-opacity">
                  Qur&apos;an Posts
                </a>
              </li>
              <li>
                <a href="/contact" className="opacity-80 hover:opacity-100 transition-opacity">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className={`${isRTL ? "text-right" : "text-left"}`}>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <ApperIcon name="Mail" size={16} />
              Get in Touch
            </h4>
            <div className="space-y-2 text-sm opacity-80">
              <p className="flex items-center gap-2">
                <ApperIcon name="Mail" size={14} />
                admin@mtrad.com
              </p>
              <p className="flex items-center gap-2">
                <ApperIcon name="Globe" size={14} />
                www.minhajverse.com
              </p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm opacity-80 text-center md:text-left">
              © 2024 Minhaj Verse. All rights reserved.
            </p>
            <p className="text-sm font-medium bg-white/20 px-4 py-2 rounded-xl">
              {t("poweredBy")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer