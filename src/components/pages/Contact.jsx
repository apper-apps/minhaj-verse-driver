import { useState } from "react"
import { useLanguage } from "@/hooks/useLanguage"
import { toast } from "react-toastify"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import ApperIcon from "@/components/ApperIcon"

const Contact = () => {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all required fields")
      return
    }

    setSending(true)
    
    try {
      // Simulate sending email to admin@mtrad.com
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success("Message sent successfully! We'll get back to you soon. 📧")
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      })
      
    } catch (err) {
      toast.error("Failed to send message. Please try again.")
    } finally {
      setSending(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold text-transparent bg-gradient-to-r from-primary to-primary-light bg-clip-text mb-4">
            📞 {t("contact")}
          </h1>
          <p className="text-xl text-gray-600">
            Get in touch with our team. We're here to help with your Islamic education journey!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="p-8">
            <h2 className="font-display font-bold text-2xl mb-6 flex items-center gap-2">
              <ApperIcon name="Mail" size={24} />
              📩 Send us a Message
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <Input
                  value={formData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  placeholder="What is this about?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder="Tell us how we can help you..."
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl resize-none focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  rows="6"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={sending}
                variant="primary"
                size="lg"
                className="w-full"
              >
                {sending ? (
                  <>
                    <ApperIcon name="Loader2" size={20} className="mr-2 animate-spin" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Send" size={20} className="mr-2" />
                    {t("send")} Message
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Details */}
            <Card className="p-6">
              <h3 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
                <ApperIcon name="MapPin" size={20} />
                🏢 Contact Information
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <ApperIcon name="Mail" size={20} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Email</h4>
                    <p className="text-gray-600">admin@mtrad.com</p>
                    <p className="text-sm text-gray-500">We respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
                    <ApperIcon name="Clock" size={20} className="text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Support Hours</h4>
                    <p className="text-gray-600">Monday - Friday</p>
                    <p className="text-sm text-gray-500">9:00 AM - 6:00 PM (UTC)</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
                    <ApperIcon name="Globe" size={20} className="text-success" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Languages</h4>
                    <p className="text-gray-600">English, Urdu, Arabic</p>
                    <p className="text-sm text-gray-500">Multilingual support available</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* FAQ Section */}
            <Card className="p-6">
              <h3 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
                <ApperIcon name="HelpCircle" size={20} />
                ❓ Frequently Asked Questions
              </h3>
              
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    How do I add funds to my wallet?
                  </h4>
                  <p className="text-sm text-gray-600">
                    Go to your Wallet page and click "Add Funds". You can add between $1-$1000 per transaction.
                  </p>
                </div>

                <div className="border-l-4 border-secondary pl-4">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Can I join classes without payment?
                  </h4>
                  <p className="text-sm text-gray-600">
                    All classes require payment. Make sure you have sufficient wallet balance before joining.
                  </p>
                </div>

                <div className="border-l-4 border-success pl-4">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    How do I become a teacher?
                  </h4>
                  <p className="text-sm text-gray-600">
                    Contact our admin team to discuss teacher qualifications and approval process.
                  </p>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 bg-gradient-to-r from-primary/5 to-primary-light/5">
              <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                <ApperIcon name="Zap" size={20} />
                🚀 Quick Actions
              </h3>
              
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <ApperIcon name="Book" size={16} className="mr-3" />
                  Browse Help Center
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ApperIcon name="MessageSquare" size={16} className="mr-3" />
                  Community Forum
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ApperIcon name="FileText" size={16} className="mr-3" />
                  Terms & Conditions
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom Section */}
        <Card className="mt-8 p-6 text-center bg-gradient-to-r from-accent/5 to-primary/5">
          <h3 className="font-display font-bold text-xl mb-2">
            🤝 We're Here to Help!
          </h3>
          <p className="text-gray-600 mb-4">
            Our dedicated support team is committed to providing you with the best Islamic education experience. 
            Don't hesitate to reach out with any questions or concerns.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <ApperIcon name="Heart" size={16} className="text-red-500" />
            <span>Made with love for the Islamic community</span>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Contact