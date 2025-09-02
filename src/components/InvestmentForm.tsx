"use client"

import { useState } from "react"

interface InvestmentFormProps {
  songId: string
  availableAmount: number
}

export function InvestmentForm({ songId, availableAmount }: InvestmentFormProps) {
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)

  const handleInvest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || parseFloat(amount) <= 0) return

    setLoading(true)

    try {
      const response = await fetch("/api/investments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          songId,
          amount: parseFloat(amount),
        }),
      })

      if (response.ok) {
        const { checkoutUrl } = await response.json()
        window.location.href = checkoutUrl
      } else {
        const error = await response.json()
        alert(error.error || "Failed to create investment")
      }
    } catch (error) {
      alert("Failed to create investment")
    } finally {
      setLoading(false)
    }
  }

  const quickAmounts = [10, 25, 50, 100].filter(amt => amt <= availableAmount)
  const maxAmount = Math.min(availableAmount, 1000)

  return (
    <form onSubmit={handleInvest} className="space-y-3 sm:space-y-4">
      <div>
        <label className="block text-white text-xs sm:text-sm font-medium mb-2">
          Investment Amount ($)
        </label>
        <input
          type="number"
          min="1"
          max={maxAmount}
          step="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount to invest"
          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
          disabled={loading || availableAmount <= 0}
        />
        <p className="text-white/50 text-xs mt-1">
          Max: ${availableAmount.toFixed(0)}
        </p>
      </div>

      {/* Quick amount buttons */}
      {quickAmounts.length > 0 && (
        <div>
          <p className="text-white/70 text-xs sm:text-sm mb-2">Quick select:</p>
          <div className="flex gap-2 flex-wrap">
            {quickAmounts.map((quickAmount) => (
              <button
                key={quickAmount}
                type="button"
                onClick={() => setAmount(quickAmount.toString())}
                className="px-2 sm:px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm rounded-lg border border-white/20 hover:border-white/40 transition-all"
                disabled={loading}
              >
                ${quickAmount}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Investment preview */}
      {amount && parseFloat(amount) > 0 && parseFloat(amount) <= availableAmount && (
        <div className="p-2 sm:p-3 bg-purple-500/20 border border-purple-500/30 rounded-lg">
          <p className="text-white/80 text-xs sm:text-sm">
            You'll own <span className="text-purple-400 font-medium">
              {((parseFloat(amount) / (availableAmount + parseFloat(amount))) * 100).toFixed(2)}%
            </span> of future royalties
          </p>
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > availableAmount || availableAmount <= 0}
        className="w-full py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 sm:h-5 w-4 sm:w-5 border-b-2 border-white mr-2"></div>
            <span className="text-xs sm:text-sm">Processing...</span>
          </div>
        ) : availableAmount <= 0 ? (
          "Fully Funded"
        ) : (
          `Invest $${amount || "0"}`
        )}
      </button>
    </form>
  )
}