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
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {user?.imageUrl && (
                      <img
                        src={user.imageUrl}
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h1 className="text-2xl font-bold">
                        {user?.fullName || "User"}
                      </h1>
                      <p className="text-gray-600">{user?.emailAddresses[0]?.emailAddress}</p>
                      <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {userData?.role || "user"}
                      </span>
                    </div>
                  </div>
                  <SignOutButton>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
                      Sign Out
                    </button>
                  </SignOutButton>
                </div>
              </div>

              {/* User Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-700">Member Since</h3>
                  <p className="text-2xl font-bold">
                    {userData?.registeredAt
                      ? new Date(userData.registeredAt * 1000).toLocaleDateString()
                      : "N/A"
                    }
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-700">Total Cards</h3>
                  <p className="text-2xl font-bold">{userCards?.length || 0}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-700">Total Balance</h3>
                  <p className="text-2xl font-bold">
                    ${userCards?.reduce((sum, card) => sum + card.balance, 0).toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="cards">
              <CardManagement />
            </TabsContent>

            <TabsContent value="transfer">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6">Transfer Money</h2>

                {transferError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {transferError}
                  </div>
                )}

                <form onSubmit={handleTransfer} className="space-y-6">
                  <div>
                    <Label htmlFor="card-select">Select Card</Label>
                    <select
                      id="card-select"
                      value={selectedCardId}
                      onChange={(e) => setSelectedCardId(e.target.value)}
                      className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      required
                    >
                      <option value="">Select a card</option>
                      {userCards?.map((card) => (
                        <option key={card._id} value={card._id}>
                          **** **** **** {card.number16digit.slice(-4)} - Balance: ${card.balance.toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="recipient-card">Recipient Card Number (16 digits)</Label>
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
                      required
                    />
                    {recipientCard && (
                      <p className="mt-2 text-sm text-green-600 font-medium">
                        ✓ {recipientCard.holderName}
                      </p>
                    )}
                    {cleanCardNumber.length === 16 && !recipientCard && (
                      <p className="mt-2 text-sm text-red-600">
                        Card not found
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      min="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Fee: 0.7% (${amount ? (parseFloat(amount) * 0.007).toFixed(2) : '0.00'})
                    </p>
                    {amountError && (
                      <p className="mt-1 text-sm text-red-600">{amountError}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Transfer Money
                  </button>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="topup">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6">Top-up Balance</h2>

                {topUpError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {topUpError}
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="topup-card-select">Select Card</Label>
                    <select
                      id="topup-card-select"
                      value={topUpCardId}
                      onChange={(e) => setTopUpCardId(e.target.value)}
                      className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      required
                    >
                      <option value="">Select a card</option>
                      {userCards?.map((card) => (
                        <option key={card._id} value={card._id}>
                          **** **** **** {card.number16digit.slice(-4)} - Balance: ${card.balance.toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="topup-amount">Amount</Label>
                    <Input
                      id="topup-amount"
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      min="1.00"
                      value={topUpAmount}
                      onChange={(e) => setTopUpAmount(e.target.value)}
                      required
                    />
                    <p className="mt-1 text-sm text-gray-500">Minimum: $1.00</p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[10, 50, 100, 200, 500, 1000].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setTopUpAmount(amount.toString())}
                        className="py-2 px-4 border rounded-lg hover:bg-gray-50 transition text-sm font-medium"
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>

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
                    className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50"
                  >
                    {topUpLoading ? "Processing..." : "Top-up with Stripe"}
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
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                  isSent ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
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
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-600">Transfer Successful!</DialogTitle>
        </DialogHeader>
        <DialogContent>
          {transferDetails && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">Amount Transferred</p>
                <p className="text-2xl font-bold text-green-700">${(transferDetails.totalDeducted - transferDetails.fee).toFixed(2)}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Transfer Amount:</span>
                  <span className="font-semibold">${(transferDetails.totalDeducted - transferDetails.fee).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fee (0.7%):</span>
                  <span className="font-semibold text-red-600">${transferDetails.fee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600 font-semibold">Total Deducted:</span>
                  <span className="font-bold">${transferDetails.totalDeducted.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">New Balance:</span>
                  <span className="font-semibold text-green-600">${transferDetails.newSenderBalance.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
        <DialogFooter>
          <button
            onClick={() => setShowSuccessModal(false)}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Done
          </button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
