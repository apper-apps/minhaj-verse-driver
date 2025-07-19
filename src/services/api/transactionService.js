import transactionsData from "@/services/mockData/transactions.json"

let transactions = [...transactionsData.transactions]

export const transactionService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...transactions].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return transactions.find(transaction => transaction.Id === parseInt(id))
  },

  async getByUserId(userId) {
    await new Promise(resolve => setTimeout(resolve, 250))
    return transactions.filter(t => 
      t.fromUserId === parseInt(userId) || t.toUserId === parseInt(userId)
    ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  },

  async create(transactionData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newTransaction = {
      Id: Math.max(...transactions.map(t => t.Id)) + 1,
      ...transactionData,
      timestamp: new Date().toISOString()
    }
    transactions.unshift(newTransaction)
    return newTransaction
  },

  async processPayment(fromUserId, toUserId, amount, type, description) {
    await new Promise(resolve => setTimeout(resolve, 500))
    const commission = amount * 0.1 // 10% commission
    const newTransaction = {
      Id: Math.max(...transactions.map(t => t.Id)) + 1,
      fromUserId: parseInt(fromUserId),
      toUserId: parseInt(toUserId),
      amount: parseFloat(amount),
      commission: parseFloat(commission),
      type,
      description,
      timestamp: new Date().toISOString()
    }
    transactions.unshift(newTransaction)
    return newTransaction
  }
}