'use client';

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { 
  Copy, 
  Check, 
  Trash2, 
  Plus, 
  CreditCard as CardIcon, 
  Sparkles, 
  Eye, 
  EyeOff, 
  RefreshCw,
  ShieldCheck,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Card {
  _id: string;
  number16digit: string;
  balance: number;
  color: string;
  holderName: string;
  createdAt: number;
  expiresAt: number;
}

export default function CardManagement() {
  const { userId } = useAuth();
  const user = useQuery(
    api.users.getUserByClerkId,
    userId ? { user_id: userId } : "skip"
  );
  const cards = useQuery(
    api.users.getUserCards,
    userId ? { user_id: userId } : "skip"
  );
  const addCard = useMutation(api.users.addCard);
  const deleteCard = useMutation(api.users.deleteCard);

  const [newCard, setNewCard] = useState({
    balance: 0,
    color: "#6366f1", // Default Indigo
  });

  const [flippedCard, setFlippedCard] = useState<string | null>(null);
  const [copiedCard, setCopiedCard] = useState<string | null>(null);
  const [showNumbers, setShowNumbers] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modern vibrant card presets
  const presetColors = [
    { name: "Indigo", hex: "#6366f1" },
    { name: "Midnight", hex: "#0f172a" },
    { name: "Emerald", hex: "#10b981" },
    { name: "Rose", hex: "#f43f5e" },
    { name: "Violet", hex: "#8b5cf6" },
    { name: "Ocean", hex: "#06b6d4" },
    { name: "Amber", hex: "#f59e0b" },
  ];

  const toggleShowNumber = (cardId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowNumbers(prev => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  const handleAddCard = async () => {
    if (!userId || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addCard({
        user_id: userId,
        balance: newCard.balance,
        color: newCard.color,
      });

      // Reset form with a random color
      const randomPreset = presetColors[Math.floor(Math.random() * presetColors.length)].hex;
      setNewCard({
        balance: 0,
        color: randomPreset,
      });
    } catch (error) {
      console.error("Error adding card:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCard = async (cardId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteCard({ card_id: cardId as any });
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  const handleCopyCardNumber = (cardNumber: string, cardId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(cardNumber);
    setCopiedCard(cardId);
    setTimeout(() => setCopiedCard(null), 2000);
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-primary rounded-full animate-spin" />
          <Sparkles className="w-5 h-5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-slate-500 font-medium text-sm">Fetching your digital wallet...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Secure Vault
          </div>
          <h2 className="text-3xl font-extrabold text-primary tracking-tight">
            Virtual Cards
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Issue, manage, and inspect your digital virtual cards with real-time balance tracking.
          </p>
        </div>

        {/* Total Wallet Summary Badge */}
        <div className="bg-gradient-to-r from-primary to-indigo-950 text-white px-5 py-3 rounded-2xl shadow-lg flex items-center gap-4">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Active Balance</p>
            <p className="text-xl font-extrabold tracking-tight">
              ${cards?.reduce((sum: number, c: Card) => sum + (c.balance || 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2 }) || "0.00"}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
            <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
          </div>
        </div>
      </div>

      {/* Main Container Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: List of Cards */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-primary flex items-center gap-2">
              <CardIcon className="w-5 h-5 text-primary" />
              Issued Cards
            </h3>
            <span className="text-xs font-bold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
              {cards?.length || 0} / 10 Active
            </span>
          </div>

          {!cards || cards.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center bg-slate-50/50 flex flex-col items-center justify-center"
            >
              <div className="w-14 h-14 bg-indigo-50 text-primary rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                <CardIcon className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-primary text-base">No active virtual cards</h4>
              <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">
                Use the card creator to issue your first custom digital payment card instantly.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <AnimatePresence>
                {cards.map((card: Card) => {
                  const isFlipped = flippedCard === card._id;
                  const isVisible = showNumbers[card._id];

                  return (
                    <motion.div
                      key={card._id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={() => setFlippedCard(isFlipped ? null : card._id)}
                      className="relative h-[220px] cursor-pointer group"
                      style={{ perspective: "1000px" }}
                    >
                      <div
                        className="relative w-full h-full transition-transform duration-700 ease-out"
                        style={{
                          transformStyle: "preserve-3d",
                          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                        }}
                      >
                        {/* ================= Front Side ================= */}
                        <div
                          className="absolute inset-0 rounded-2xl p-5 text-white shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden border border-white/20 group-hover:scale-[1.02]"
                          style={{
                            backgroundColor: card.color,
                            backfaceVisibility: "hidden",
                          }}
                        >
                          {/* Background Sheen & Hologram Accents */}
                          <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

                          {/* Top Header: Chip & Balance */}
                          <div className="flex justify-between items-start z-10">
                            <div className="flex items-center gap-3">
                              {/* Metallic Chip */}
                              <div className="w-10 h-7 rounded-md bg-gradient-to-tr from-amber-200 via-amber-400 to-amber-100 border border-amber-300/60 shadow-inner grid grid-cols-2 gap-0.5 p-1">
                                <div className="border-b border-r border-amber-600/40 rounded-[1px]" />
                                <div className="border-b border-l border-amber-600/40 rounded-[1px]" />
                                <div className="border-t border-r border-amber-600/40 rounded-[1px]" />
                                <div className="border-t border-l border-amber-600/40 rounded-[1px]" />
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="text-[10px] uppercase font-bold text-white/70 tracking-wider">Balance</p>
                              <p className="text-xl font-black tracking-tight">
                                ${card.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </p>
                            </div>
                          </div>

                          {/* Middle: Card Number & Actions */}
                          <div className="z-10 my-auto">
                            <p className="text-[9px] uppercase font-bold text-white/60 mb-1 tracking-wider">Card Number</p>
                            <div className="flex items-center justify-between">
                              <p className="text-base sm:text-lg font-mono font-bold tracking-widest text-white drop-shadow-sm">
                                {isVisible 
                                  ? card.number16digit.replace(/(\d{4})/g, '$1 ').trim()
                                  : `•••• •••• •••• ${card.number16digit.slice(-4)}`
                                }
                              </p>
                              
                              <div className="flex items-center gap-1 bg-black/20 backdrop-blur-md p-1 rounded-lg border border-white/10">
                                <button
                                  onClick={(e) => toggleShowNumber(card._id, e)}
                                  className="p-1.5 rounded-md hover:bg-white/20 transition-colors text-white/80 hover:text-white"
                                  title={isVisible ? "Hide number" : "Show number"}
                                >
                                  {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                                <button
                                  onClick={(e) => handleCopyCardNumber(card.number16digit, card._id, e)}
                                  className="p-1.5 rounded-md hover:bg-white/20 transition-colors text-white/80 hover:text-white"
                                  title="Copy card number"
                                >
                                  {copiedCard === card._id ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Bottom Row: Holder Name & Action */}
                          <div className="flex justify-between items-end z-10">
                            <div>
                              <p className="text-[9px] uppercase font-bold text-white/60 tracking-wider">Cardholder</p>
                              <p className="text-xs font-bold uppercase tracking-wider text-white truncate max-w-[130px]">
                                {card.holderName || "Valued Customer"}
                              </p>
                            </div>

                            <button
                              onClick={(e) => handleDeleteCard(card._id, e)}
                              className="p-2 bg-red-500/20 hover:bg-red-500/40 text-white backdrop-blur-md border border-white/20 rounded-xl transition-all"
                              title="Delete Card"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-100" />
                            </button>
                          </div>
                        </div>

                        {/* ================= Back Side ================= */}
                        <div
                          className="absolute inset-0 rounded-2xl text-white shadow-xl flex flex-col justify-between overflow-hidden border border-white/20 py-4"
                          style={{
                            backgroundColor: card.color,
                            backfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                          }}
                        >
                          {/* Magnetic Strip */}
                          <div className="w-full h-10 bg-slate-950/90 my-2" />

                          {/* CVV Box & Expiry */}
                          <div className="px-5 space-y-3">
                            <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/10 flex justify-between items-center">
                              <div>
                                <p className="text-[9px] uppercase font-bold text-white/60">Expires</p>
                                <p className="text-xs font-bold font-mono">
                                  {card.expiresAt ? new Date(card.expiresAt * 1000).toLocaleDateString(undefined, { month: '2-digit', year: '2-digit' }) : "12/28"}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-[9px] uppercase font-bold text-white/60">CVC / CVV</p>
                                <div className="bg-white text-primary px-2 py-0.5 rounded font-mono font-bold text-xs">
                                  ***
                                </div>
                              </div>
                            </div>
                            <p className="text-[10px] text-center text-white/60 font-medium">
                              Click card anytime to flip back
                            </p>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Right Column: Card Creation & Live Interactive Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-2.5 bg-indigo-50 text-primary rounded-xl">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-primary">Issue New Card</h3>
                <p className="text-xs text-slate-500">Configure parameters for instant card creation</p>
              </div>
            </div>

            {/* Live Interactive Preview */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Live Preview
              </label>
              <div 
                className="h-[180px] rounded-2xl p-5 text-white shadow-lg flex flex-col justify-between transition-all duration-300 relative overflow-hidden"
                style={{ backgroundColor: newCard.color }}
              >
                <div className="flex justify-between items-start z-10">
                  <div className="w-8 h-6 rounded bg-amber-300/80 border border-amber-200" />
                  <div className="text-right">
                    <p className="text-[9px] uppercase font-bold text-white/70">Balance</p>
                    <p className="text-lg font-black">${(newCard.balance || 0).toFixed(2)}</p>
                  </div>
                </div>

                <div className="z-10 font-mono font-bold tracking-widest text-sm text-white/90">
                  •••• •••• •••• 4242
                </div>

                <div className="flex justify-between items-end z-10">
                  <div>
                    <p className="text-[8px] uppercase font-bold text-white/60">Cardholder</p>
                    <p className="text-xs font-bold uppercase tracking-wider">{user?.name || "NEW HOLDER"}</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-white/20 rounded backdrop-blur-md">
                    DEPOPAY
                  </span>
                </div>
              </div>
            </div>

            {/* Form Inputs */}
            <div className="space-y-4">
              {/* Balance Field */}
              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                  Initial Balance ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    min="0"
                    value={newCard.balance || ''}
                    onChange={(e) => setNewCard({ ...newCard, balance: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-primary focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Color Preset Picker */}
              <div>
                <label className="block text-xs font-bold text-primary/80 uppercase tracking-wider mb-2">
                  Card Theme
                </label>
                <div className="grid grid-cols-7 gap-2 mb-3">
                  {presetColors.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setNewCard({ ...newCard, color: c.hex })}
                      className={`h-8 rounded-xl transition-all ${
                        newCard.color === c.hex 
                          ? "ring-2 ring-primary ring-offset-2 scale-105 shadow-md" 
                          : "hover:scale-105 opacity-80 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>

                {/* Hex Custom Input */}
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={newCard.color}
                    onChange={(e) => setNewCard({ ...newCard, color: e.target.value })}
                    className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer p-1 bg-slate-50"
                  />
                  <input
                    type="text"
                    value={newCard.color}
                    onChange={(e) => setNewCard({ ...newCard, color: e.target.value })}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold text-primary/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
                    placeholder="#6366F1"
                  />
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <Button
              onClick={handleAddCard}
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/80 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Issue Virtual Card
                </>
              )}
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}