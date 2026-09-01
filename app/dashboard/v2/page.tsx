'use client';

import { useState, useEffect } from "react";
import { useAuth, SignOutButton, useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useSearchParams } from "next/navigation";
import CardManagement from "@/components/dashboard/card-management";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
    CreditCard,
    Send,
    AlertCircle,
    ChevronDown,
    CheckCircle2,
    PlusCircle,
    LayoutDashboard,
    ArrowLeftRight,
    User as UserIcon,
    History,
    ArrowUpRight,
    ArrowDownLeft,
    Calendar,
    Wallet,
    LogOut,
} from "lucide-react";

import Image from "next/image";

export default function DashboardPageV2() {
    const { userId } = useAuth();
    const { user } = useUser();
    const searchParams = useSearchParams();

    // Queries
    const userData = useQuery(
        api.users.getUserByClerkId,
        userId ? { user_id: userId } : "skip"
    );
    const userCards = useQuery(
        api.users.getUserCards,
        userId ? { user_id: userId } : "skip"
    );
    const transferHistory = useQuery(
        api.users.getTransferHistory,
        userId ? { user_id: userId } : "skip"
    );

    // Tab State Management
    const [activeTab, setActiveTab] = useState<"cards" | "transfer" | "history" | "topup" | "profile">("cards");

    // Local States: Transfer Money
    const [selectedCardId, setSelectedCardId] = useState<string>("");
    const [recipientCardNumber, setRecipientCardNumber] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const [transferError, setTransferError] = useState<string>("");
    const [amountError, setAmountError] = useState<string>("");
    const [transferSuccess, setTransferSuccess] = useState<string>("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [transferDetails, setTransferDetails] = useState<any>(null);

    // Local States: Top Up Balance
    const [topUpCardId, setTopUpCardId] = useState<string>("");
    const [topUpAmount, setTopUpAmount] = useState<string>("");
    const [topUpError, setTopUpError] = useState<string>("");
    const [topUpLoading, setTopUpLoading] = useState(false);

    // Convex Mutations & Queries for Transfer/Top-Up
    const topUpCard = useMutation(api.users.topUpCard);
    const transferMoney = useMutation(api.users.transferMoney);

    const cleanCardNumber = recipientCardNumber.replace(/\s/g, '');
    const recipientCard = useQuery(
        api.users.getCardByNumber,
        cleanCardNumber.length === 16 ? { cardNumber: cleanCardNumber } : "skip"
    );

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

    // Helper Card Number Formatting
    const formatCardNumber = (value: string) => {
        const digits = value.replace(/\D/g, '').slice(0, 16);
        const groups = digits.match(/.{1,4}/g) || [];
        return groups.join(' ');
    };

    // Transfer Handler Logic
    const handleTransfer = async (e: React.FormEvent) => {
        e.preventDefault();
        setTransferError("");
        setAmountError("");
        setTransferSuccess("");

        if (!selectedCardId || !recipientCardNumber || !amount) {
            setTransferError("Please fill in all fields");
            return;
        }

        const cleanCard = recipientCardNumber.replace(/\s/g, '');
        if (cleanCard.length !== 16 || !/^\d+$/.test(cleanCard)) {
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
                recipientCardNumber: cleanCard,
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

    if (!userData) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="flex items-center gap-3 text-slate-500 font-medium">
                    <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    Loading dashboard data...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 text-slate-900 pb-12">

            {/* ==================== NAVBAR ==================== */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">

                        <Image src={'/Logo.svg'} alt='Logo' width={1000} className='w-40 h-10' height={0} />

                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60">
                        <button
                            onClick={() => setActiveTab("cards")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "cards" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
                                }`}
                        >
                            <LayoutDashboard className="w-4 h-4" /> My Cards
                        </button>
                        <button
                            onClick={() => setActiveTab("transfer")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "transfer" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
                                }`}
                        >
                            <ArrowLeftRight className="w-4 h-4" /> Transfer
                        </button>
                        <button
                            onClick={() => setActiveTab("history")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "history" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
                                }`}
                        >
                            <History className="w-4 h-4" /> History
                        </button>
                        <button
                            onClick={() => setActiveTab("topup")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "topup" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
                                }`}
                        >
                            <PlusCircle className="w-4 h-4" /> Top-Up
                        </button>
                        <button
                            onClick={() => setActiveTab("profile")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "profile" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
                                }`}
                        >
                            <UserIcon className="w-4 h-4" /> Profile
                        </button>
                    </nav>

                    {/* User Info */}
                    <div className="flex items-center gap-3">
                        {user?.imageUrl && (
                            <img src={user.imageUrl} alt="User Avatar" className="w-8 h-8 rounded-full border border-slate-200" />
                        )}
                        <span className="text-xs font-semibold text-slate-700 hidden sm:inline-block">
                            {user?.fullName || "User"}
                        </span>
                    </div>
                </div>

                {/* Mobile Navigation Bar */}
                <div className="md:hidden flex items-center justify-around border-t border-slate-200/60 bg-white py-2 px-2">
                    <button
                        onClick={() => setActiveTab("cards")}
                        className={`flex flex-col items-center gap-1 text-[10px] font-bold ${activeTab === "cards" ? "text-indigo-600" : "text-slate-500"
                            }`}
                    >
                        <LayoutDashboard className="w-5 h-5" /> Cards
                    </button>
                    <button
                        onClick={() => setActiveTab("transfer")}
                        className={`flex flex-col items-center gap-1 text-[10px] font-bold ${activeTab === "transfer" ? "text-indigo-600" : "text-slate-500"
                            }`}
                    >
                        <ArrowLeftRight className="w-5 h-5" /> Transfer
                    </button>
                    <button
                        onClick={() => setActiveTab("history")}
                        className={`flex flex-col items-center gap-1 text-[10px] font-bold ${activeTab === "history" ? "text-indigo-600" : "text-slate-500"
                            }`}
                    >
                        <History className="w-5 h-5" /> History
                    </button>
                    <button
                        onClick={() => setActiveTab("topup")}
                        className={`flex flex-col items-center gap-1 text-[10px] font-bold ${activeTab === "topup" ? "text-indigo-600" : "text-slate-500"
                            }`}
                    >
                        <PlusCircle className="w-5 h-5" /> Top-Up
                    </button>
                    <button
                        onClick={() => setActiveTab("profile")}
                        className={`flex flex-col items-center gap-1 text-[10px] font-bold ${activeTab === "profile" ? "text-indigo-600" : "text-slate-500"
                            }`}
                    >
                        <UserIcon className="w-5 h-5" /> Profile
                    </button>
                </div>
            </header>

            {/* ==================== MAIN CONTENT ==================== */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">

                {/* TAB 1: CARDS MANAGEMENT */}
                {activeTab === "cards" && (
                    <div className="space-y-8">
                        <CardManagement />
                    </div>
                )}

                {/* TAB 2: TRANSFER MONEY */}
                {activeTab === "transfer" && (
                    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 transition-all max-w-2xl mx-auto">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-5 mb-6">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                                <Send className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Transfer Money</h2>
                                <p className="text-xs sm:text-sm text-slate-500">Send funds instantly to any registered card holder.</p>
                            </div>
                        </div>

                        {transferError && (
                            <div className="flex items-center gap-3 bg-rose-50 border border-rose-200/80 text-rose-700 px-4 py-3 rounded-2xl text-sm mb-6 animate-in fade-in">
                                <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
                                <span>{transferError}</span>
                            </div>
                        )}

                        <form onSubmit={handleTransfer} className="space-y-5">
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
                                        {userCards?.map((card: any) => (
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

                            <div>
                                <Label htmlFor="recipient-card" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                    Recipient Card Number (16 digits)
                                </Label>
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

                                {amountError && <p className="mt-1.5 text-xs font-semibold text-rose-600 px-1">{amountError}</p>}
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 active:scale-[0.99] mt-2"
                            >
                                <Send className="w-4 h-4" />
                                <span>Confirm & Transfer Money</span>
                            </button>
                        </form>
                    </div>
                )}

                {/* TAB 3: TRANSFER HISTORY */}
                {activeTab === "history" && (
                    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 transition-all max-w-5xl mx-auto">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-5 mb-6">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                                <History className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Transfer History</h2>
                                <p className="text-xs sm:text-sm text-slate-500">Track all your incoming and outgoing payments.</p>
                            </div>
                        </div>

                        {!transferHistory || transferHistory.length === 0 ? (
                            <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                <p className="text-slate-500 text-sm font-medium">No transfer history recorded yet.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                                            <th className="py-3 px-4">Date</th>
                                            <th className="py-3 px-4">Type</th>
                                            <th className="py-3 px-4">From / To Card</th>
                                            <th className="py-3 px-4 text-right">Amount</th>
                                            <th className="py-3 px-4 text-right">Fee</th>
                                            <th className="py-3 px-4 text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-sm font-medium">
                                        {transferHistory.map((transfer: any) => {
                                            const isSent = transfer.fromUserId === userId;
                                            const cardNumber = isSent ? transfer.toCardNumber : transfer.fromCardNumber;
                                            const formattedCardNumber = cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ');

                                            return (
                                                <tr key={transfer._id} className="hover:bg-slate-50/80 transition-colors">
                                                    <td className="py-4 px-4 text-slate-600 text-xs">
                                                        {new Date(transfer.timestamp * 1000).toLocaleString()}
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span
                                                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${isSent
                                                                ? 'bg-rose-50 text-rose-700 border border-rose-100'
                                                                : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                                                }`}
                                                        >
                                                            {isSent ? (
                                                                <>
                                                                    <ArrowUpRight className="w-3 h-3 text-rose-600" /> Sent
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <ArrowDownLeft className="w-3 h-3 text-emerald-600" /> Received
                                                                </>
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 font-mono text-slate-700 font-semibold text-xs">
                                                        {formattedCardNumber}
                                                    </td>
                                                    <td className="py-4 px-4 text-right font-extrabold text-slate-900">
                                                        ${transfer.amount.toFixed(2)}
                                                    </td>
                                                    <td className="py-4 px-4 text-right text-slate-400 text-xs">
                                                        ${transfer.fee.toFixed(2)}
                                                    </td>
                                                    <td className="py-4 px-4 text-right font-extrabold text-slate-900">
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
                )}

                {/* TAB 4: TOP-UP BALANCE */}
                {activeTab === "topup" && (
                    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 transition-all max-w-2xl mx-auto">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-5 mb-6">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                                <PlusCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Top-up Balance</h2>
                                <p className="text-xs sm:text-sm text-slate-500">Instantly add funds to your card using Stripe payment gateway.</p>
                            </div>
                        </div>

                        {topUpError && (
                            <div className="flex items-center gap-3 bg-rose-50 border border-rose-200/80 text-rose-700 px-4 py-3 rounded-2xl text-sm mb-6 animate-in fade-in">
                                <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
                                <span>{topUpError}</span>
                            </div>
                        )}

                        <div className="space-y-6">
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
                                        {userCards?.map((card: any) => (
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

                            <div>
                                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">Quick Presets</p>
                                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                                    {[10, 50, 100, 200, 500, 1000].map((preset) => {
                                        const isSelected = topUpAmount === preset.toString();
                                        return (
                                            <button
                                                key={preset}
                                                type="button"
                                                onClick={() => setTopUpAmount(preset.toString())}
                                                className={`py-2.5 px-3 rounded-xl border text-sm font-extrabold transition-all active:scale-95 ${isSelected
                                                    ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-200"
                                                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300"
                                                    }`}
                                            >
                                                ${preset}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <button
                                onClick={async () => {
                                    if (!topUpCardId || !topUpAmount) {
                                        setTopUpError("Please select a card and enter an amount");
                                        return;
                                    }

                                    const numVal = parseFloat(topUpAmount);
                                    if (isNaN(numVal) || numVal < 1) {
                                        setTopUpError("Minimum top-up amount is $1.00");
                                        return;
                                    }

                                    setTopUpError("");
                                    setTopUpLoading(true);

                                    try {
                                        const response = await fetch('/api/stripe/checkout', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ cardId: topUpCardId, amount: topUpAmount }),
                                        });

                                        const data = await response.json();
                                        if (!response.ok) throw new Error(data.error || 'Failed to create checkout session');
                                        if (data.url) window.location.href = data.url;
                                    } catch (err: any) {
                                        setTopUpError(err.message || 'Failed to initiate payment');
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
                )}

                {/* TAB 5: PROFILE */}
                {activeTab === "profile" && (
                    <div className="space-y-6 max-w-4xl mx-auto">
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
                                        ${userCards?.reduce((sum: number, card: any) => sum + card.balance, 0).toFixed(2) || "0.00"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </main>

            {/* ==================== TRANSFER SUCCESS MODAL ==================== */}
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
                            <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-5 text-center">
                                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Amount Transferred</p>
                                <p className="text-3xl font-extrabold text-emerald-600 tracking-tight mt-1">
                                    ${(transferDetails.totalDeducted - transferDetails.fee).toFixed(2)}
                                </p>
                            </div>

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