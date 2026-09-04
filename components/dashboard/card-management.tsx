'use client';

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { Copy, Check, Trash2, Plus, CreditCard as CardIcon, Sparkles } from "lucide-react";

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
    color: "#3b82f6", // Default blue color
  });

  const [flippedCard, setFlippedCard] = useState<string | null>(null);
  const [copiedCard, setCopiedCard] = useState<string | null>(null);

  // Preset colors matching modern card aesthetics
  const presetColors = [
    "#3b82f6", // Blue
    "#8b5cf6", // Purple
    "#ec4899", // Pink
    "#10b981", // Emerald
    "#f59e0b", // Amber
    "#06b6d4", // Cyan
    "#1e293b", // Slate
  ];

  const generateRandomColor = () => {
    return presetColors[Math.floor(Math.random() * presetColors.length)];
  };

  const handleAddCard = async () => {
    if (!userId) return;

    try {
      await addCard({
        user_id: userId,
        balance: newCard.balance,
        color: newCard.color,
      });

      setNewCard({
        balance: 0,
        color: generateRandomColor(),
      });
    } catch (error) {
      console.error("Error adding card:", error);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      await deleteCard({ card_id: cardId as any });
    } catch (error) {
      console.error("Error deleting card:", error);
      alert("Failed to delete card. It may have already been deleted.");
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-slate-500 font-medium">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          Loading user data...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
            Card Management
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage your virtual cards, balances, and issue new digital cards instantly.
          </p>
        </div>
      </div>

      {/* Main Grid: Cards & Creation Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left 2 Columns: User's Cards Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-primary flex items-center gap-2">
              <CardIcon className="w-5 h-5 text-indigo-600" />
              Your Cards
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">
              {cards?.length || 0} Active
            </span>
          </div>

          {!cards || cards.length === 0 ? (
            <div className="border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center bg-slate-50/50">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <CardIcon className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-primary text-base">No cards issued yet</h4>
              <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                Create your first digital payment card using the creation panel to get started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {cards.map((card: Card) => (
                <div
                  key={card._id}
                  onClick={() => setFlippedCard(flippedCard === card._id ? null : card._id)}
                  className="relative h-[220px] cursor-pointer group"
                  style={{ perspective: "1000px" }}
                >
                  <div
                    className="relative w-full h-full transition-transform duration-700 ease-in-out"
                    style={{
                      transformStyle: "preserve-3d",
                      transform: flippedCard === card._id ? "rotateY(180deg)" : "rotateY(0deg)",
                    }}
                  >
                    {/* Front of Card */}
                    <div
                      className="absolute inset-0 rounded-2xl p-5 text-white shadow-xl flex flex-col justify-between overflow-hidden border border-white/20"
                      style={{
                        backgroundColor: card.color,
                        backfaceVisibility: "hidden",
                      }}
                    >
                      {/* Decorative Gloss Glow */}
                      <div className="absolute -top-12 -right-12 w-36 h-36 bg-white/20 rounded-full blur-xl pointer-events-none" />

                      {/* Top Row: Chip & Balance */}
                      <div className="flex justify-between items-start z-10">
                        {/* SIM Chip Simulation */}
                        <div className="w-9 h-7 border border-white/40 rounded-md bg-white/20 grid grid-cols-2 gap-0.5 p-1 backdrop-blur-sm">
                          <div className="bg-white/40 rounded-[1px]" />
                          <div className="bg-white/40 rounded-[1px]" />
                          <div className="bg-white/40 rounded-[1px]" />
                          <div className="bg-white/40 rounded-[1px]" />
                        </div>

                        <div className="text-right">
                          <p className="text-[10px] uppercase font-semibold text-white/70 tracking-wider">Balance</p>
                          <p className="text-xl font-extrabold tracking-tight">${card.balance.toFixed(2)}</p>
                        </div>
                      </div>

                      {/* Middle Row: Card Number & Copy Button */}
                      <div className="z-10 my-auto">
                        <p className="text-[10px] uppercase font-semibold text-white/70 mb-0.5 tracking-wider">Card Number</p>
                        <div className="flex items-center gap-2">
                          <p className="text-base font-mono font-bold tracking-widest text-white/95">
                            {card.number16digit.replace(/(\d{4})/g, '$1 ').trim()}
                          </p>
                          <button
                            onClick={(e) => handleCopyCardNumber(card.number16digit, card._id, e)}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all text-white/80 hover:text-white"
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

                      {/* Bottom Row: Holder Name & Delete Action */}
                      <div className="flex justify-between items-end z-10">
                        <div>
                          <p className="text-[9px] uppercase font-semibold text-white/70 tracking-wider">Card Holder</p>
                          <p className="text-xs font-bold uppercase tracking-wider text-white truncate max-w-[140px]">
                            {card.holderName}
                          </p>
                        </div>

                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCard(card._id);
                          }}
                          variant="destructive"
                          size="sm"
                          className="h-8 px-2.5 bg-red-500/80 hover:bg-red-600 text-white backdrop-blur-md border border-white/20 rounded-xl transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Back of Card */}
                    <div
                      className="absolute inset-0 rounded-2xl p-6 text-white shadow-xl flex flex-col justify-between overflow-hidden border border-white/20"
                      style={{
                        backgroundColor: card.color,
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      {/* Magnetic Strip */}
                      <div className="w-[calc(100%+3rem)] -mx-6 h-10 bg-black/80 mt-2" />

                      {/* CVV & Expiry */}
                      <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 flex justify-between items-center">
                        <div>
                          <p className="text-[10px] uppercase font-semibold text-white/70">Expires</p>
                          <p className="text-base font-bold font-mono">
                            {new Date(card.expiresAt * 1000).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] uppercase font-semibold text-white/70">CVC</p>
                          <p className="text-sm font-bold font-mono tracking-widest">***</p>
                        </div>
                      </div>

                      <p className="text-[11px] text-center text-white/60 font-medium pb-1">
                        Tap card again to flip front
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Column: Create New Card Form */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-primary">Add New Card</h3>
              <p className="text-xs text-slate-500">Configure parameters for your new card</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Balance Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Initial Balance
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  value={newCard.balance}
                  onChange={(e) => setNewCard({ ...newCard, balance: parseFloat(e.target.value) || 0 })}
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-primary focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Color Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Card Accent Color
              </label>
              
              {/* Preset Swatches */}
              <div className="flex flex-wrap gap-2 mb-3">
                {presetColors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setNewCard({ ...newCard, color: c })}
                    className={`w-7 h-7 rounded-full transition-transform ${
                      newCard.color === c ? "scale-110 ring-2 ring-indigo-600 ring-offset-2" : "hover:scale-105"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>

              {/* Custom Color Input */}
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={newCard.color}
                  onChange={(e) => setNewCard({ ...newCard, color: e.target.value })}
                  className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer p-0.5 bg-slate-50"
                />
                <input
                  type="text"
                  value={newCard.color}
                  onChange={(e) => setNewCard({ ...newCard, color: e.target.value })}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
                  placeholder="#3B82F6"
                />
              </div>
            </div>
          </div>

          <Button
            onClick={handleAddCard}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 mt-2"
          >
            <Plus className="w-4 h-4" /> Issue Card
          </Button>
        </div>
      </div>
    </div>
  );
}