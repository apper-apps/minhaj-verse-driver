import { Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Header from "@/components/organisms/Header"
import Footer from "@/components/organisms/Footer"
import Home from "@/components/pages/Home"
import MyClasses from "@/components/pages/MyClasses"
import Whiteboard from "@/components/pages/Whiteboard"
import QuranPosts from "@/components/pages/QuranPosts"
import MyWallet from "@/components/pages/MyWallet"
import Profile from "@/components/pages/Profile"
import Contact from "@/components/pages/Contact"
import AdminDashboard from "@/components/pages/AdminDashboard"
import { LanguageProvider } from "@/hooks/useLanguage"

function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/classes" element={<MyClasses />} />
            <Route path="/whiteboard" element={<Whiteboard />} />
            <Route path="/posts" element={<QuranPosts />} />
<Route path="/wallet" element={<MyWallet />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </LanguageProvider>
  )
}

export default App