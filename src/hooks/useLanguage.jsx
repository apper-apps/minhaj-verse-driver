import React, { createContext, useContext, useState, useEffect } from "react"

const LanguageContext = createContext()

const translations = {
  en: {
    welcome: "Welcome to Minhaj Verse",
    home: "Home",
    myClasses: "My Classes",
    whiteboard: "Whiteboard", 
    quranPosts: "Qur'an Posts",
    myWallet: "My Wallet",
    profile: "Profile",
    contact: "Contact",
    poweredBy: "Powered by Muhammad Tahir Raza (MTRAD)",
    balance: "Balance",
    startLearning: "Start Learning",
    joinClass: "Join Class",
    createPost: "Create Post",
    loading: "Loading...",
    error: "Something went wrong",
    retry: "Try Again",
    empty: "No content available",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    view: "View",
    send: "Send",
    clear: "Clear",
    student: "Student",
    teacher: "Teacher"
  },
  ur: {
    welcome: "منہاج ورس میں خوش آمدید",
    home: "ہوم",
    myClasses: "میری کلاسیں",
    whiteboard: "وائٹ بورڈ",
    quranPosts: "قرآن پوسٹس",
    myWallet: "میرا بٹوا",
    profile: "پروفائل",
    contact: "رابطہ",
    poweredBy: "محمد طاہر رضا (MTRAD) کی طرف سے تیار",
    balance: "بیلنس",
    startLearning: "سیکھنا شروع کریں",
    joinClass: "کلاس میں شامل ہوں",
    createPost: "پوسٹ بنائیں",
    loading: "لوڈ ہو رہا ہے...",
    error: "کچھ غلط ہوا",
    retry: "دوبارہ کوشش کریں",
    empty: "کوئی مواد دستیاب نہیں",
    save: "محفوظ کریں",
    cancel: "منسوخ",
    delete: "حذف کریں",
    edit: "ترمیم",
    view: "دیکھیں",
    send: "بھیجیں",
    clear: "صاف کریں",
    student: "طالب علم",
    teacher: "استاد"
  },
  ar: {
    welcome: "مرحباً بكم في منهاج ورس",
    home: "الرئيسية",
    myClasses: "فصولي",
    whiteboard: "السبورة",
    quranPosts: "منشورات القرآن",
    myWallet: "محفظتي",
    profile: "الملف الشخصي",
    contact: "اتصال",
    poweredBy: "مدعوم من محمد طاهر رضا (MTRAD)",
    balance: "الرصيد",
    startLearning: "ابدأ التعلم",
    joinClass: "انضم للفصل",
    createPost: "إنشاء منشور",
    loading: "جاري التحميل...",
    error: "حدث خطأ ما",
    retry: "حاول مرة أخرى",
    empty: "لا يوجد محتوى متاح",
    save: "حفظ",
    cancel: "إلغاء",
    delete: "حذف",
    edit: "تحرير",
    view: "عرض",
    send: "إرسال",
    clear: "مسح",
    student: "طالب",
    teacher: "معلم"
  }
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en")

  useEffect(() => {
    const savedLang = localStorage.getItem("minhaj-language")
    if (savedLang && translations[savedLang]) {
      setLanguage(savedLang)
    }
  }, [])

  useEffect(() => {
    document.body.className = language === "ur" || language === "ar" ? "rtl" : ""
    localStorage.setItem("minhaj-language", language)
  }, [language])

  const t = (key) => {
    return translations[language][key] || translations.en[key] || key
  }

  const value = {
    language,
    setLanguage,
    t,
    isRTL: language === "ur" || language === "ar"
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}