import { useState, useEffect } from "react"
import { useLanguage } from "@/hooks/useLanguage"
import { userService } from "@/services/api/userService"
import { transactionService } from "@/services/api/transactionService"
import { toast } from "react-toastify"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Input from "@/components/atoms/Input"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"

const MyWallet = () => {
  const { t } = useLanguage()
  const [user, setUser] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showAddFunds, setShowAddFunds] = useState(false)
  const [addAmount, setAddAmount] = useState("")
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    loadWalletData()
  }, [])

  const loadWalletData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const userData = await userService.getCurrentUser()
      setUser(userData)
      
      if (userData) {
        const transactionsData = await transactionService.getByUserId(userData.Id)
        setTransactions(transactionsData)
      }
    } catch (err) {
      setError("Failed to load wallet data")
    } finally {
      setLoading(false)
    }
  }

  const handleAddFunds = async (e) => {
    e.preventDefault()
    
    const amount = parseFloat(addAmount)
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount")
      return
    }

    if (amount > 1000) {
      toast.error("Maximum amount per transaction is $1000")
      return
    }

    setProcessing(true)
    
    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Create transaction record
      await transactionService.create({
        fromUserId: "admin",
        toUserId: user.Id,
        amount: amount,
        commission: 0,
        type: "credit",
        description: "Wallet Top-up"
      })
      
      // Update user balance
      const newBalance = user.walletBalance + amount
      await userService.update(user.Id, { walletBalance: newBalance })
      setUser(prev => ({ ...prev, walletBalance: newBalance }))
      
      // Refresh transactions
      const updatedTransactions = await transactionService.getByUserId(user.Id)
      setTransactions(updatedTransactions)
      
      toast.success(`Successfully added $${amount} to your wallet! 💰`)
      setAddAmount("")
      setShowAddFunds(false)
      
    } catch (err) {
      toast.error("Failed to add funds. Please try again.")
    } finally {
      setProcessing(false)
    }
  }

  const getTransactionIcon = (type) => {
    switch (type) {
      case "credit": return "Plus"
      case "debit": return "Minus"
      case "lesson": return "BookOpen"
      default: return "ArrowUpDown"
    }
  }

  const getTransactionColor = (type, isFromUser) => {
    if (type === "lesson") {
      return isFromUser ? "error" : "success"
    }
    return type === "credit" ? "success" : "error"
  }

  if (loading) return <Loading message="Loading wallet..." />
  if (error) return <Error message={error} onRetry={loadWalletData} />

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold text-transparent bg-gradient-to-r from-primary to-primary-light bg-clip-text mb-4">
            💰 {t("myWallet")}
          </h1>
          <p className="text-xl text-gray-600">
            Manage your education funds and track your spending
          </p>
        </div>

        {/* Wallet Overview */}
        <Card className="p-8 mb-8 bg-gradient-to-br from-primary/5 to-primary-light/5">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-light rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Wallet" size={32} className="text-white" />
            </div>
            <h2 className="text-sm text-gray-600 mb-2">💳 Current Balance</h2>
            <p className="text-5xl font-bold text-transparent bg-gradient-to-r from-primary to-primary-light bg-clip-text mb-4">
              ${user?.walletBalance || 0}
            </p>
            <div className="flex items-center justify-center gap-2">
              <Badge variant="primary">
                {user?.role === "teacher" ? "👩‍🏫 Teacher" : "👨‍🎓 Student"}
              </Badge>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setShowAddFunds(true)}
              variant="primary"
              size="lg"
            >
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add Funds
            </Button>
            <Button variant="outline" size="lg">
              <ApperIcon name="Send" size={16} className="mr-2" />
              Send Money
            </Button>
            <Button variant="ghost" size="lg">
              <ApperIcon name="Download" size={16} className="mr-2" />
              Export History
            </Button>
          </div>
        </Card>

        {/* Add Funds Form */}
        {showAddFunds && (
          <Card className="p-6 mb-8">
            <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
              <ApperIcon name="CreditCard" size={20} />
              💳 Add Funds to Wallet
            </h3>
            
            <form onSubmit={handleAddFunds} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount to Add
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Input
                    type="number"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="pl-8"
                    min="1"
                    max="1000"
                    step="0.01"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Minimum: $1 • Maximum: $1000 per transaction
                </p>
              </div>

              {/* Quick Amount Buttons */}
              <div className="flex gap-2 flex-wrap">
                {[10, 25, 50, 100, 200].map(amount => (
                  <Button
                    key={amount}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAddAmount(amount.toString())}
                  >
                    ${amount}
                  </Button>
                ))}
              </div>
              
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={processing}
                  variant="primary"
                >
                  {processing ? (
                    <>
                      <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="CreditCard" size={16} className="mr-2" />
                      Add ${addAmount || "0"}
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowAddFunds(false)}
                  variant="ghost"
                >
                  {t("cancel")}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Transaction History */}
        <Card className="p-6">
          <h3 className="font-display font-bold text-lg mb-6 flex items-center gap-2">
            <ApperIcon name="History" size={20} />
            📊 Transaction History
          </h3>
          
          {transactions.length === 0 ? (
            <Empty
              title="No Transactions Yet"
              description="Your transaction history will appear here once you start using your wallet."
              action={() => setShowAddFunds(true)}
              actionLabel="Add First Funds"
              icon="Receipt"
            />
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => {
                const isFromUser = transaction.fromUserId === user?.Id
                const isToUser = transaction.toUserId === user?.Id
                const amount = transaction.amount
                const isPositive = isToUser && !isFromUser
                
                return (
                  <div
                    key={transaction.Id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isPositive 
                          ? "bg-success/10 text-success" 
                          : "bg-error/10 text-error"
                      }`}>
                        <ApperIcon 
                          name={getTransactionIcon(transaction.type)} 
                          size={20} 
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {transaction.description}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {new Date(transaction.timestamp).toLocaleDateString()} • 
                          {new Date(transaction.timestamp).toLocaleTimeString()}
                        </p>
                        {transaction.commission > 0 && (
                          <p className="text-xs text-gray-500">
                            Commission: ${transaction.commission}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className={`text-lg font-bold ${
                        isPositive ? "text-success" : "text-error"
                      }`}>
                        {isPositive ? "+" : "-"}${amount}
                      </p>
                      <Badge 
                        variant={getTransactionColor(transaction.type, isFromUser)}
                        className="text-xs"
                      >
                        {transaction.type}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>

        {/* Wallet Tips */}
        <Card className="mt-8 p-6 bg-gradient-to-r from-accent/5 to-primary/5">
          <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
            <ApperIcon name="Lightbulb" size={20} />
            💡 Wallet Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔒</span>
              <div>
                <h4 className="font-medium mb-1">Safe & Secure</h4>
                <p className="text-gray-600">Your wallet is protected with advanced security measures</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <h4 className="font-medium mb-1">Instant Payments</h4>
                <p className="text-gray-600">Pay for classes instantly without delays</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">📈</span>
              <div>
                <h4 className="font-medium mb-1">Track Spending</h4>
                <p className="text-gray-600">Monitor your education investments easily</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default MyWallet