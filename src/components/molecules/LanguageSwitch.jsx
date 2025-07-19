import { useLanguage } from "@/hooks/useLanguage"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const LanguageSwitch = () => {
  const { language, setLanguage } = useLanguage()

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ur", name: "اردو", flag: "🇵🇰" },
    { code: "ar", name: "العربية", flag: "🇸🇦" }
  ]

  return (
    <div className="flex items-center gap-2">
      <ApperIcon name="Globe" size={20} className="text-primary" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="bg-white border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-primary focus:outline-none"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default LanguageSwitch