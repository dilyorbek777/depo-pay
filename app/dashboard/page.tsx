'use client';

import { useState, useEffect } from "react";
import { useAuth, SignOutButton, useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
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
            console.log(result);
            
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
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    Loading dashboard data...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 text-primary pb-12">

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
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "cards" ? "bg-white text-primary shadow-sm" : "text-slate-600 hover:text-primary"
                                }`}
                        >
                            <LayoutDashboard className="w-4 h-4" /> My Cards
                        </button>
                        <button
                            onClick={() => setActiveTab("transfer")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "transfer" ? "bg-white text-primary shadow-sm" : "text-slate-600 hover:text-primary"
                                }`}
                        >
                            <ArrowLeftRight className="w-4 h-4" /> Transfer
                        </button>
                        <button
                            onClick={() => setActiveTab("history")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "history" ? "bg-white text-primary shadow-sm" : "text-slate-600 hover:text-primary"
                                }`}
                        >
                            <History className="w-4 h-4" /> History
                        </button>
                        <button
                            onClick={() => setActiveTab("topup")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "topup" ? "bg-white text-primary shadow-sm" : "text-slate-600 hover:text-primary"
                                }`}
                        >
                            <PlusCircle className="w-4 h-4" /> Top-Up
                        </button>
                        <button
                            onClick={() => setActiveTab("profile")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "profile" ? "bg-white text-primary shadow-sm" : "text-slate-600 hover:text-primary"
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
                        className={`flex flex-col items-center gap-1 text-[10px] font-bold ${activeTab === "cards" ? "text-primary" : "text-slate-500"
                            }`}
                    >
                        <LayoutDashboard className="w-5 h-5" /> Cards
                    </button>
                    <button
                        onClick={() => setActiveTab("transfer")}
                        className={`flex flex-col items-center gap-1 text-[10px] font-bold ${activeTab === "transfer" ? "text-primary" : "text-slate-500"
                            }`}
                    >
                        <ArrowLeftRight className="w-5 h-5" /> Transfer
                    </button>
                    <button
                        onClick={() => setActiveTab("history")}
                        className={`flex flex-col items-center gap-1 text-[10px] font-bold ${activeTab === "history" ? "text-primary" : "text-slate-500"
                            }`}
                    >
                        <History className="w-5 h-5" /> History
                    </button>
                    <button
                        onClick={() => setActiveTab("topup")}
                        className={`flex flex-col items-center gap-1 text-[10px] font-bold ${activeTab === "topup" ? "text-primary" : "text-slate-500"
                            }`}
                    >
                        <PlusCircle className="w-5 h-5" /> Top-Up
                    </button>
                    <button
                        onClick={() => setActiveTab("profile")}
                        className={`flex flex-col items-center gap-1 text-[10px] font-bold ${activeTab === "profile" ? "text-primary" : "text-slate-500"
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
                    <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-100/80 p-6 sm:p-8 transition-all max-w-2xl mx-auto relative overflow-hidden">
                        {/* Ambient Decorative Accents */}
                        <div className="absolute -top-16 -right-16 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

                        {/* Header */}
                        <div className="flex items-center gap-4 border-b border-slate-100 pb-5 mb-6 relative z-10">
                            <div className="p-3.5 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100/60 text-indigo-600 rounded-2xl shadow-sm">
                                <Send className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-black text-primary tracking-tight">
                                    Transfer Money
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                                    Send instant funds directly to any verified 16-digit card number.
                                </p>
                            </div>
                        </div>

                        {/* Global Error Banner */}
                        {transferError && (
                            <div className="flex items-center gap-3 bg-rose-50/90 border border-rose-200/80 text-rose-700 px-4 py-3.5 rounded-2xl text-sm mb-6 animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
                                <span className="font-medium">{transferError}</span>
                            </div>
                        )}

                        <form onSubmit={handleTransfer} className="space-y-6 relative z-10">
                            {/* Source Card Select */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <Label
                                        htmlFor="card-select"
                                        className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
                                    >
                                        Select Source Card
                                    </Label>
                                    {selectedCardId && (
                                        <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                                            Card Selected
                                        </span>
                                    )}
                                </div>
                                <div className="relative group">
                                    <select
                                        id="card-select"
                                        value={selectedCardId}
                                        onChange={(e) => setSelectedCardId(e.target.value)}
                                        className="w-full appearance-none bg-slate-50/80 hover:bg-slate-50 border border-slate-200/90 rounded-2xl px-4 py-3.5 text-sm font-semibold text-primary focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all cursor-pointer pr-10 shadow-sm"
                                        required
                                    >
                                        <option value="" disabled>
                                            Choose a card to send from
                                        </option>
                                        {userCards?.map((card: any) => (
                                            <option key={card._id} value={card._id}>
                                                •••• {card.number16digit.slice(-4)} — Balance: ${card.balance.toFixed(2)}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-slate-600 transition-colors">
                                        <ChevronDown className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>

                            {/* Recipient Card Input */}
                            <div>
                                <Label
                                    htmlFor="recipient-card"
                                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
                                >
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
                                        className="w-full bg-slate-50/80 hover:bg-slate-50 border border-slate-200/90 rounded-2xl px-4 py-3.5 font-mono text-base font-bold tracking-widest text-primary focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all placeholder:text-slate-400 shadow-sm"
                                        required
                                    />
                                </div>

                                {/* Recipient Validation Badges */}
                                {recipientCard && (
                                    <div className="mt-2.5 flex items-center gap-2.5 text-xs text-emerald-700 font-semibold bg-emerald-50/90 border border-emerald-200/80 px-3.5 py-2.5 rounded-xl shadow-xs animate-in fade-in">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                        <span>Verified Recipient: <strong className="text-emerald-950 font-bold">{recipientCard.holderName}</strong></span>
                                    </div>
                                )}

                                {cleanCardNumber.length === 16 && !recipientCard && (
                                    <div className="mt-2.5 flex items-center gap-2.5 text-xs text-rose-700 font-medium bg-rose-50/90 border border-rose-200/80 px-3.5 py-2.5 rounded-xl shadow-xs animate-in fade-in">
                                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                                        <span>Card not found. Please double-check the 16-digit card number.</span>
                                    </div>
                                )}
                            </div>

                            {/* Transfer Amount Input */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <Label
                                        htmlFor="amount"
                                        className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
                                    >
                                        Transfer Amount
                                    </Label>
                                    <span className="text-[11px] font-medium text-slate-400">USD ($)</span>
                                </div>

                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-extrabold text-lg">
                                        $
                                    </span>
                                    <Input
                                        id="amount"
                                        type="number"
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0.01"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full pl-9 pr-4 py-3.5 bg-slate-50/80 hover:bg-slate-50 border border-slate-200/90 rounded-2xl text-xl font-extrabold text-primary focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all shadow-sm"
                                        required
                                    />
                                </div>

                                {/* Breakdown Details Card */}
                                <div className="mt-3 bg-slate-50/60 border border-slate-100 rounded-2xl p-3.5 space-y-2 text-xs">
                                    <div className="flex items-center justify-between text-slate-500">
                                        <span>Standard Processing Fee (0.7%)</span>
                                        <span className="font-semibold text-slate-700">
                                            ${amount ? (parseFloat(amount) * 0.007).toFixed(2) : '0.00'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 font-bold text-slate-800">
                                        <span>Total Deduction</span>
                                        <span className="text-indigo-600 text-sm">
                                            ${amount ? (parseFloat(amount) * 1.007).toFixed(2) : '0.00'}
                                        </span>
                                    </div>
                                </div>

                                {amountError && (
                                    <p className="mt-2 text-xs font-semibold text-rose-600 px-1">{amountError}</p>
                                )}
                            </div>

                            {/* Submit Action */}
                            <button
                                type="submit"
                                onClick={() => {
                                    console.log(transferDetails);
                                }}
                                className="w-full bg-primary hover:bg-indigo-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-primary/10 hover:shadow-indigo-500/20 transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] mt-4"
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
                            <div className="p-3 bg-indigo-50 text-primary rounded-2xl">
                                <History className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-extrabold text-primary tracking-tight">Transaction History</h2>
                                <p className="text-xs sm:text-sm text-slate-500">Track all your transfers and top-ups.</p>
                            </div>
                        </div>

                        {!transferHistory || transferHistory.length === 0 ? (
                            <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                <p className="text-slate-500 text-sm font-medium">No transaction history recorded yet.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                                            <th className="py-3 px-4">Date</th>
                                            <th className="py-3 px-4">Type</th>
                                            <th className="py-3 px-4">Card</th>
                                            <th className="py-3 px-4 text-right">Amount</th>
                                            <th className="py-3 px-4 text-right">Fee</th>
                                            <th className="py-3 px-4 text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-sm font-medium">
                                        {transferHistory.map((transfer: any) => {
                                            const isTopUp = transfer.metadata?.type === "topup";
                                            const isSent = transfer.fromUserId === userId && !isTopUp;
                                            const cardNumber = isTopUp ? transfer.fromCardNumber : (isSent ? transfer.toCardNumber : transfer.fromCardNumber);
                                            const formattedCardNumber = cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ');

                                            return (
                                                <tr key={transfer._id} className="hover:bg-slate-50/80 transition-colors">
                                                    <td className="py-4 px-4 text-slate-600 text-xs">
                                                        {new Date(transfer.timestamp * 1000).toLocaleString()}
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        {isTopUp ? (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                                <PlusCircle className="w-3 h-3 text-emerald-600" /> Top-Up
                                                            </span>
                                                        ) : isSent ? (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-100">
                                                                <ArrowUpRight className="w-3 h-3 text-rose-600" /> Sent
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                                                                <ArrowDownLeft className="w-3 h-3 text-blue-600" /> Received
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="py-4 px-4 font-mono text-slate-700 font-semibold text-xs">
                                                        {formattedCardNumber}
                                                    </td>
                                                    <td className="py-4 px-4 text-right font-extrabold text-primary">
                                                        ${transfer.amount.toFixed(2)}
                                                    </td>
                                                    <td className="py-4 px-4 text-right text-slate-400 text-xs">
                                                        ${transfer.fee.toFixed(2)}
                                                    </td>
                                                    <td className="py-4 px-4 text-right font-extrabold text-primary">
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
                    <div className="bg-card text-card-foreground rounded-3xl border border-border/80 shadow-xl shadow-slate-900/5 p-6 sm:p-8 transition-all max-w-2xl mx-auto relative overflow-hidden">
                        {/* Ambient Decorative Blur Accents using theme variables */}
                        <div className="absolute -top-16 -right-16 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

                        {/* Header */}
                        <div className="flex items-center gap-4 border-b border-border/60 pb-5 mb-6 relative z-10">
                            <div className="p-3.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-500/20 shadow-sm">
                                <PlusCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                                    Top-up Balance
                                </h2>
                                <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                                    Instantly add funds to your card using the secure Stripe payment gateway.
                                </p>
                            </div>
                        </div>

                        {/* Global Error Banner */}
                        {topUpError && (
                            <div className="flex items-center gap-3 bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3.5 rounded-2xl text-sm mb-6 animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="w-5 h-5 shrink-0 text-destructive" />
                                <span className="font-medium">{topUpError}</span>
                            </div>
                        )}

                        <div className="space-y-6 relative z-10">
                            {/* Target Card Selection */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <Label
                                        htmlFor="topup-card-select"
                                        className="block text-xs font-bold text-foreground/80 uppercase tracking-wider"
                                    >
                                        Select Target Card
                                    </Label>
                                    {topUpCardId && (
                                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                                            Card Selected
                                        </span>
                                    )}
                                </div>
                                <div className="relative group">
                                    <select
                                        id="topup-card-select"
                                        value={topUpCardId}
                                        onChange={(e) => setTopUpCardId(e.target.value)}
                                        className="w-full appearance-none bg-muted/50 hover:bg-muted/80 border border-input rounded-2xl px-4 py-3.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-card transition-all cursor-pointer pr-10 shadow-xs"
                                        required
                                    >
                                        <option value="" disabled>
                                            Choose target card
                                        </option>
                                        {userCards?.map((card: any) => (
                                            <option key={card._id} value={card._id}>
                                                •••• {card.number16digit.slice(-4)} — Current Balance: ${card.balance.toFixed(2)}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground group-hover:text-foreground transition-colors">
                                        <ChevronDown className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>

                            {/* Top-up Amount Input */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <Label
                                        htmlFor="topup-amount"
                                        className="block text-xs font-bold text-foreground/80 uppercase tracking-wider"
                                    >
                                        Top-up Amount
                                    </Label>
                                    <span className="text-[11px] font-medium text-muted-foreground">USD ($)</span>
                                </div>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-extrabold text-lg">
                                        $
                                    </span>
                                    <Input
                                        id="topup-amount"
                                        type="number"
                                        placeholder="0.00"
                                        step="0.01"
                                        min="1.00"
                                        value={topUpAmount}
                                        onChange={(e) => setTopUpAmount(e.target.value)}
                                        className="w-full pl-9 pr-4 py-3.5 bg-muted/50 hover:bg-muted/80 border border-input rounded-2xl text-xl font-extrabold text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-card transition-all shadow-xs"
                                        required
                                    />
                                </div>
                                <p className="mt-2 text-xs text-muted-foreground px-1 font-medium flex items-center justify-between">
                                    <span>Minimum top-up amount: $1.00</span>
                                    {topUpAmount && parseFloat(topUpAmount) >= 1 && (
                                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                                            Valid Amount
                                        </span>
                                    )}
                                </p>
                            </div>

                            {/* Quick Presets */}
                            <div>
                                <p className="text-xs font-bold text-foreground/80 uppercase tracking-wider mb-2.5">
                                    Quick Presets
                                </p>
                                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                                    {[10, 50, 100, 200, 500, 1000].map((preset) => {
                                        const isSelected = topUpAmount === preset.toString();
                                        return (
                                            <button
                                                key={preset}
                                                type="button"
                                                onClick={() => setTopUpAmount(preset.toString())}
                                                className={`py-2.5 px-3 rounded-2xl border text-sm font-extrabold transition-all duration-200 active:scale-95 ${isSelected
                                                    ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-500/20"
                                                    : "bg-muted/50 border-input text-foreground hover:bg-muted hover:border-border"
                                                    }`}
                                            >
                                                ${preset}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Submit Action Button */}
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
                                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/50 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] disabled:scale-100 cursor-pointer disabled:cursor-not-allowed mt-2"
                            >
                                {topUpLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Redirecting to Stripe...</span>
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
                        {/* User Profile Card */}
                        <div className="bg-card text-card-foreground rounded-3xl border border-border/80 shadow-xl shadow-slate-900/5 p-6 sm:p-8 transition-all relative overflow-hidden">
                            {/* Ambient Decorative Blur Accent */}
                            <div className="absolute -top-16 -right-16 w-36 h-36 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
                                <div className="flex items-center gap-5">
                                    {user?.imageUrl ? (
                                        <div className="relative group">
                                            <img
                                                src={user.imageUrl}
                                                alt="Profile"
                                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-primary/10 shadow-md transition-transform group-hover:scale-105"
                                            />
                                            <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-card rounded-full" />
                                        </div>
                                    ) : (
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xl sm:text-2xl shadow-inner">
                                            {user?.fullName?.charAt(0) || "U"}
                                        </div>
                                    )}
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                                                {user?.fullName || "User"}
                                            </h1>
                                            <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary dark:text-primary-foreground rounded-full text-xs font-bold uppercase tracking-wider">
                                                {userData?.role || "user"}
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            {user?.emailAddresses[0]?.emailAddress}
                                        </p>
                                    </div>
                                </div>

                                <SignOutButton>
                                    <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/20 px-5 py-2.5 rounded-2xl font-semibold text-sm transition-all shadow-xs active:scale-95 cursor-pointer">
                                        <LogOut className="w-4 h-4" />
                                        Sign Out
                                    </button>
                                </SignOutButton>
                            </div>
                        </div>

                        {/* Analytics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Member Since Card */}
                            <div className="bg-card text-card-foreground rounded-3xl border border-border/80 shadow-sm p-6 flex items-center gap-4 hover:border-border/100 transition-all">
                                <div className="p-3 bg-primary/10 text-primary rounded-2xl border border-primary/20">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                        Member Since
                                    </h3>
                                    <p className="text-xl sm:text-2xl font-extrabold text-foreground mt-0.5">
                                        {userData?.registeredAt
                                            ? new Date(userData.registeredAt * 1000).toLocaleDateString()
                                            : "N/A"}
                                    </p>
                                </div>
                            </div>

                            {/* Total Cards Card */}
                            <div className="bg-card text-card-foreground rounded-3xl border border-border/80 shadow-sm p-6 flex items-center gap-4 hover:border-border/100 transition-all">
                                <div className="p-3 bg-primary/10 text-primary rounded-2xl border border-primary/20">
                                    <CreditCard className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                        Total Cards
                                    </h3>
                                    <p className="text-xl sm:text-2xl font-extrabold text-foreground mt-0.5">
                                        {userCards?.length || 0}
                                    </p>
                                </div>
                            </div>

                            {/* Total Balance Card */}
                            <div className="bg-card text-card-foreground rounded-3xl border border-border/80 shadow-sm p-6 flex items-center gap-4 hover:border-border/100 transition-all">
                                <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-500/20">
                                    <Wallet className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                        Total Balance
                                    </h3>
                                    <p className="text-xl sm:text-2xl font-extrabold text-foreground mt-0.5">
                                        $
                                        {userCards
                                            ?.reduce((sum: number, card: any) => sum + card.balance, 0)
                                            .toFixed(2) || "0.00"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </main>

            {/* ==================== TRANSFER SUCCESS MODAL ==================== */}
            <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
                <DialogContent className="sm:max-w-md rounded-3xl p-6 sm:p-8 bg-card text-card-foreground border border-border/80 shadow-2xl relative overflow-hidden">
                    {/* Ambient Glow */}
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

                    <DialogHeader className="flex flex-col items-center justify-center text-center space-y-3 pb-2 relative z-10">
                        <div className="w-14 h-14 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center border border-emerald-500/20 shadow-inner">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <DialogTitle className="text-2xl font-extrabold text-foreground tracking-tight">
                            Transfer Successful!
                        </DialogTitle>
                        <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                            Your funds have been processed and transferred successfully.
                        </p>
                    </DialogHeader>

                    {transferDetails &&
                        (

                            <div className="space-y-4 my-2 relative z-10">
                                {/* Highlight Banner */}
                                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 text-center">
                                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                                        Amount Transferred
                                    </p>
                                    <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight mt-1">
                                        ${(transferDetails.totalDeducted - transferDetails.fee).toFixed(2)}
                                    </p>
                                </div>

                                {/* Receiver Details Card */}
                                <div className="bg-muted/40 border border-border/80 rounded-2xl p-4 flex items-center gap-3">
                                    {transferDetails.receiverAvatar ? (
                                        <img
                                            src={transferDetails.receiverAvatar}
                                            alt="Receiver"
                                            className="w-11 h-11 rounded-xl object-cover border border-border"
                                        />
                                    ) : (
                                        <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-base border border-primary/20">
                                            {transferDetails.receiverName?.charAt(0) || "R"}
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                            Recipient
                                        </p>
                                        <p className="text-sm font-extrabold text-foreground truncate">
                                            {transferDetails.holderName || "Unknown Receiver"}
                                        </p>
                                        <p className="text-xs text-muted-foreground font-mono truncate">
                                            {transferDetails.receiverCardNumber
                                                ? `•••• ${transferDetails.receiverCardNumber.slice(-4)}`
                                                : transferDetails.receiverEmail || "N/A"}
                                        </p>
                                    </div>
                                </div>

                                {/* Transaction Breakdown */}
                                <div className="bg-muted/50 border border-border/80 rounded-2xl p-4 space-y-3 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            Transfer Amount
                                        </span>
                                        <span className="font-bold text-foreground">
                                            ${(transferDetails.totalDeducted - transferDetails.fee).toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            Fee (0.7%)
                                        </span>
                                        <span className="font-bold text-destructive">
                                            +${transferDetails.fee.toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="h-px bg-border my-1" />

                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-foreground/80 uppercase tracking-wider">
                                            Total Deducted
                                        </span>
                                        <span className="font-extrabold text-foreground text-base">
                                            ${transferDetails.totalDeducted.toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center pt-1">
                                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            New Balance
                                        </span>
                                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                                            ${transferDetails.newSenderBalance.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    <DialogFooter className="mt-4 relative z-10">
                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3.5 px-6 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-[0.99] cursor-pointer"
                        >
                            Done
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}