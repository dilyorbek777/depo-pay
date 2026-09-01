'use client'

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import CardManagement from "@/components/dashboard/card-management";
import Newsletter from '@/components/site/newsletter'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from "@/components/ui/dialog"
import { useSearchParams } from "next/navigation"
import { AlertCircle, Calendar, CheckCircle2, ChevronDown, CreditCard, LogOut, PlusCircle, Send, Wallet } from "lucide-react";

export default function DashboardPage() {
  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const searchParams = useSearchParams();
  const userData = useQuery(api.users.getUserByClerkId,
    userId ? { user_id: userId } : "skip"
  );
  const userCards = useQuery(api.users.getUserCards,
    userId ? { user_id: userId } : "skip"
  );

  // Transfer state
  const [selectedCardId, setSelectedCardId] = useState<string>("");
  const [recipientCardNumber, setRecipientCardNumber] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [transferError, setTransferError] = useState<string>("");
  const [amountError, setAmountError] = useState<string>("");
  const [transferSuccess, setTransferSuccess] = useState<string>("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [transferDetails, setTransferDetails] = useState<any>(null);

  // Top-up state
  const [topUpCardId, setTopUpCardId] = useState<string>("");
  const [topUpAmount, setTopUpAmount] = useState<string>("");
  const [topUpError, setTopUpError] = useState<string>("");
  const [topUpLoading, setTopUpLoading] = useState(false);
  const topUpCard = useMutation(api.users.topUpCard);

  // Handle Stripe payment success return
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const success = searchParams.get('success');

    if (success === 'true' && sessionId) {
      handleStripePaymentSuccess(sessionId);
    }
  }, [searchParams]);

  const handleStripePaymentSuccess = async (sessionId: string) => {
    try {
      // Fetch session details from Stripe to get metadata
      const response = await fetch(`/api/stripe/session?session_id=${sessionId}`);
      const session = await response.json();

      if (session.metadata?.cardId && session.metadata?.amount) {
        await topUpCard({
          cardId: session.metadata.cardId as any,
          amount: parseFloat(session.metadata.amount),
        });
        console.log('Card balance updated successfully');
      }
    } catch (error) {
      console.error('Failed to update balance after payment:', error);
    }
  };

  const cleanCardNumber = recipientCardNumber.replace(/\s/g, '');
  const recipientCard = useQuery(api.users.getCardByNumber,
    cleanCardNumber.length === 16 ? { cardNumber: cleanCardNumber } : "skip"
  );

  const transferHistory = useQuery(api.users.getTransferHistory,
    userId ? { user_id: userId } : "skip"
  );

  // Format card number with spaces every 4 digits
  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    const groups = digits.match(/.{1,4}/g) || [];
    return groups.join(' ');
  };

  const transferMoney = useMutation(api.users.transferMoney);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setTransferError("");
    setAmountError("");
    setTransferSuccess("");

    if (!selectedCardId || !recipientCardNumber || !amount) {
      setTransferError("Please fill in all fields");
      return;
    }

    const cleanCardNumber = recipientCardNumber.replace(/\s/g, '');
    if (cleanCardNumber.length !== 16 || !/^\d+$/.test(cleanCardNumber)) {
      setTransferError("Card number must be exactly 16 digits");
      return;
    }

    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      setTransferError("Please enter a valid amount");
      return;
    }

    try {
      const result = await transferMoney({
        senderCardId: selectedCardId as any,
        recipientCardNumber: cleanCardNumber,
        amount: transferAmount,
      });
      setTransferDetails(result);
      setShowSuccessModal(true);
      setRecipientCardNumber("");
      setAmount("");
      setSelectedCardId("");
    } catch (error: any) {
      const errorMessage = error.message || error.toString() || "Transfer failed";
      if (errorMessage.includes("Not enough money") || errorMessage.includes("Insufficient balance")) {
        setAmountError("Not enough money");
      } else {
        setTransferError(errorMessage);
      }
    }
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Sign In Required</h1>
            <p className="text-gray-600 mb-6">Please sign in to access your dashboard</p>
            <SignInButton mode="modal">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                Sign In
              </button>
            </SignInButton>
          </div>
        </main>
        <Newsletter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="cards" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="cards">Cards</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="transfer">Transfer</TabsTrigger>
              <TabsTrigger value="topup">Top-up</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-8">
              {/* User Profile Header */}
              {/* Profile Header */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 transition-all">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    {user?.imageUrl ? (
                      <div className="relative group">
                        <img
                          src={user.imageUrl}
                          alt="Profile"
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-indigo-50 shadow-md transition-transform group-hover:scale-105"
                        />
                        <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl sm:text-2xl shadow-inner">
                        {user?.fullName?.charAt(0) || "U"}
                      </div>
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                          {user?.fullName || "User"}
                        </h1>
                        <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider">
                          {userData?.role || "user"}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-500">
                        {user?.emailAddresses[0]?.emailAddress}
                      </p>
                    </div>
                  </div>

                  <SignOutButton>
                    <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/60 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm active:scale-95">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </SignOutButton>
                </div>
              </div>

              {/* User Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 flex items-center gap-4 hover:border-slate-300 transition-all">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Member Since</h3>
                    <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                      {userData?.registeredAt
                        ? new Date(userData.registeredAt * 1000).toLocaleDateString()
                        : "N/A"
                      }
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 flex items-center gap-4 hover:border-slate-300 transition-all">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Cards</h3>
                    <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                      {userCards?.length || 0}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 flex items-center gap-4 hover:border-slate-300 transition-all">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Balance</h3>
                    <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                      ${userCards?.reduce((sum, card) => sum + card.balance, 0).toFixed(2) || "0.00"}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="cards">
              <CardManagement />
            </TabsContent>

            <TabsContent value="transfer">
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 transition-all max-w-2xl mx-auto">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-5 mb-6">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                    <Send className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                      Transfer Money
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Send funds instantly to any registered card holder.
                    </p>
                  </div>
                </div>

                {transferError && (
                  <div className="flex items-center gap-3 bg-rose-50 border border-rose-200/80 text-rose-700 px-4 py-3 rounded-2xl text-sm mb-6 animate-in fade-in">
                    <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
                    <span>{transferError}</span>
                  </div>
                )}

                <form onSubmit={handleTransfer} className="space-y-5">
                  {/* Select Source Card */}
                  <div>
                    <Label htmlFor="card-select" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Select Source Card
                    </Label>
                    <div className="relative">
                      <select
                        id="card-select"
                        value={selectedCardId}
                        onChange={(e) => setSelectedCardId(e.target.value)}
                        className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer pr-10"
                        required
                      >
                        <option value="">Choose a card to send from</option>
                        {userCards?.map((card) => (
                          <option key={card._id} value={card._id}>
                            •••• {card.number16digit.slice(-4)} — Balance: ${card.balance.toFixed(2)}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Recipient Card Input */}
                  <div>
                    <Label htmlFor="recipient-card" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Recipient Card Number (16 digits)
                    </Label>
                    <div className="relative">
                      <Input
                        id="recipient-card"
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={formatCardNumber(recipientCardNumber)}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 16);
                          setRecipientCardNumber(value);
                        }}
                        maxLength={19}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
                        required
                      />
                    </div>

                    {recipientCard && (
                      <div className="mt-2.5 flex items-center gap-2 text-sm text-emerald-600 font-semibold bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-xl">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Recipient: {recipientCard.holderName}</span>
                      </div>
                    )}

                    {cleanCardNumber.length === 16 && !recipientCard && (
                      <div className="mt-2.5 flex items-center gap-2 text-sm text-rose-600 font-medium bg-rose-50 border border-rose-100 px-3 py-2 rounded-xl">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>Card not found. Please double check the number.</span>
                      </div>
                    )}
                  </div>

                  {/* Transfer Amount Input */}
                  <div>
                    <Label htmlFor="amount" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Transfer Amount
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-base">$</span>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        min="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        required
                      />
                    </div>

                    <div className="mt-2 flex items-center justify-between text-xs text-slate-500 px-1">
                      <span>Standard Processing Fee (0.7%)</span>
                      <span className="font-semibold text-slate-700">
                        ${amount ? (parseFloat(amount) * 0.007).toFixed(2) : '0.00'}
                      </span>
                    </div>

                    {amountError && (
                      <p className="mt-1.5 text-xs font-semibold text-rose-600 px-1">{amountError}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 active:scale-[0.99] mt-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Confirm & Transfer Money</span>
                  </button>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="topup">
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 transition-all max-w-2xl mx-auto">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-5 mb-6">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                    <PlusCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                      Top-up Balance
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Instantly add funds to your card using Stripe payment gateway.
                    </p>
                  </div>
                </div>

                {topUpError && (
                  <div className="flex items-center gap-3 bg-rose-50 border border-rose-200/80 text-rose-700 px-4 py-3 rounded-2xl text-sm mb-6 animate-in fade-in">
                    <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
                    <span>{topUpError}</span>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Select Destination Card */}
                  <div>
                    <Label htmlFor="topup-card-select" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Select Card to Fund
                    </Label>
                    <div className="relative">
                      <select
                        id="topup-card-select"
                        value={topUpCardId}
                        onChange={(e) => setTopUpCardId(e.target.value)}
                        className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer pr-10"
                        required
                      >
                        <option value="">Choose target card</option>
                        {userCards?.map((card) => (
                          <option key={card._id} value={card._id}>
                            •••• {card.number16digit.slice(-4)} — Current Balance: ${card.balance.toFixed(2)}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Top Up Amount Input */}
                  <div>
                    <Label htmlFor="topup-amount" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Top-up Amount
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-base">$</span>
                      <Input
                        id="topup-amount"
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        min="1.00"
                        value={topUpAmount}
                        onChange={(e) => setTopUpAmount(e.target.value)}
                        className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                        required
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-slate-500 px-1 font-medium">Minimum top-up amount: $1.00</p>
                  </div>

                  {/* Quick Select Amount Chips */}
                  <div>
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">Quick Presets</p>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                      {[10, 50, 100, 200, 500, 1000].map((amount) => {
                        const isSelected = topUpAmount === amount.toString();
                        return (
                          <button
                            key={amount}
                            type="button"
                            onClick={() => setTopUpAmount(amount.toString())}
                            className={`py-2.5 px-3 rounded-xl border text-sm font-extrabold transition-all active:scale-95 ${isSelected
                                ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-200"
                                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300"
                              }`}
                          >
                            ${amount}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={async () => {
                      if (!topUpCardId || !topUpAmount) {
                        setTopUpError("Please select a card and enter an amount");
                        return;
                      }

                      const amount = parseFloat(topUpAmount);
                      if (isNaN(amount) || amount < 1) {
                        setTopUpError("Minimum top-up amount is $1.00");
                        return;
                      }

                      setTopUpError("");
                      setTopUpLoading(true);

                      try {
                        const response = await fetch('/api/stripe/checkout', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            cardId: topUpCardId,
                            amount: topUpAmount,
                          }),
                        });

                        const data = await response.json();

                        if (!response.ok) {
                          throw new Error(data.error || 'Failed to create checkout session');
                        }

                        if (data.url) {
                          window.location.href = data.url;
                        }
                      } catch (error: any) {
                        setTopUpError(error.message || 'Failed to initiate payment');
                        setTopUpLoading(false);
                      }
                    }}
                    disabled={topUpLoading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:scale-100 mt-2"
                  >
                    {topUpLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>Top-up with Stripe</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6">Transfer History</h2>

                {!transferHistory || transferHistory.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No transfer history yet</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">From/To</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Fee</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transferHistory.map((transfer) => {
                          const isSent = transfer.fromUserId === userId;
                          const cardNumber = isSent ? transfer.toCardNumber : transfer.fromCardNumber;
                          const formattedCardNumber = cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ');

                          return (
                            <tr key={transfer._id} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-4 text-sm">
                                {new Date(transfer.timestamp * 1000).toLocaleString()}
                              </td>
                              <td className="py-3 px-4 text-sm">
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${isSent ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                  }`}>
                                  {isSent ? 'Sent' : 'Received'}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-sm font-mono">
                                {formattedCardNumber}
                              </td>
                              <td className="py-3 px-4 text-sm font-semibold">
                                ${transfer.amount.toFixed(2)}
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-500">
                                ${transfer.fee.toFixed(2)}
                              </td>
                              <td className="py-3 px-4 text-sm font-semibold">
                                ${transfer.totalDeducted.toFixed(2)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6 sm:p-8 bg-white border border-slate-100 shadow-2xl">
          <DialogHeader className="flex flex-col items-center justify-center text-center space-y-3 pb-2">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100 shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <DialogTitle className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Transfer Successful!
            </DialogTitle>
            <p className="text-xs sm:text-sm text-slate-500">
              Your funds have been processed and transferred successfully.
            </p>
          </DialogHeader>

          {transferDetails && (
            <div className="space-y-5 my-2">
              {/* Highlight Box */}
              <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-5 text-center">
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Amount Transferred</p>
                <p className="text-3xl font-extrabold text-emerald-600 tracking-tight mt-1">
                  ${(transferDetails.totalDeducted - transferDetails.fee).toFixed(2)}
                </p>
              </div>

              {/* Transaction Breakdown */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3 text-sm">
                <div className="flex justify-between items-center text-slate-600">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Transfer Amount</span>
                  <span className="font-bold text-slate-800">
                    ${(transferDetails.totalDeducted - transferDetails.fee).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-600">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Fee (0.7%)</span>
                  <span className="font-bold text-rose-500">
                    +${transferDetails.fee.toFixed(2)}
                  </span>
                </div>

                <div className="h-px bg-slate-200 my-1" />

                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Total Deducted</span>
                  <span className="font-extrabold text-slate-900 text-base">
                    ${transferDetails.totalDeducted.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">New Balance</span>
                  <span className="font-extrabold text-emerald-600">
                    ${transferDetails.newSenderBalance.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="mt-4">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.99]"
            >
              Done
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
