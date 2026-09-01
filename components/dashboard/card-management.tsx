'use client'

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import { Button } from "../ui/button";

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
  const user = useQuery(api.users.getUserByClerkId,
    userId ? { user_id: userId } : "skip"
  );
  const cards = useQuery(api.users.getUserCards,
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

  // Generate random color
  const generateRandomColor = () => {
    const colors = [
      "#3b82f6", // blue
      "#ef4444", // red
      "#10b981", // green
      "#f59e0b", // amber
      "#8b5cf6", // purple
      "#ec4899", // pink
      "#06b6d4", // cyan
      "#f97316", // orange
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleAddCard = async () => {
    if (!userId) return;

    try {
      await addCard({
        user_id: userId,
        balance: newCard.balance,
        color: newCard.color,
      });

      // Reset form with new random color
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
    return <div>Loading user data...</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Card Management</h2>


      {/* Existing Cards */}
      <div className="space-y-4 mb-6">
        <h3 className="text-xl font-semibold">Your Cards ({cards?.length || 0})</h3>

        {!cards || cards.length === 0 ? (
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <p className="text-gray-600">No cards added yet. Add your first card above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cards.map((card: Card) => (
              <div
                key={card._id}
                onClick={() => setFlippedCard(flippedCard === card._id ? null : card._id)}
                className="relative h-[200px] cursor-pointer"
                style={{ perspective: "1000px" }}
              >
                <div
                  className="relative w-full h-full transition-transform duration-500"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: flippedCard === card._id ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                >
                  {/* Front of card */}
                  <div
                    className="absolute w-full h-full rounded-lg p-6 text-white shadow-md backface-hidden"
                    style={{
                      backgroundColor: card.color,
                      backfaceVisibility: "hidden"
                    }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <p className="text-sm opacity-80">Card Number</p>
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-mono tracking-wider">
                            {card.number16digit.replace(/(\d{4})/g, '$1 ').trim()}
                          </p>
                          <button
                            onClick={(e) => handleCopyCardNumber(card.number16digit, card._id, e)}
                            className="text-xs opacity-60 hover:opacity-100 transition"
                            title="Copy card number"
                          >
                            {copiedCard === card._id ? (
                              <span className="text-green-300">✓</span>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm opacity-80">Balance</p>
                        <p className="text-2xl font-bold">${card.balance.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="mt-12">
                      <p className="text-sm opacity-80">Card Holder</p>
                      <p className="text-lg font-semibold flex justify-between items-center">{card.holderName} <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCard(card._id);
                        }}
                        variant="destructive"
                        size="sm"
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </Button></p>


                    </div>

                  </div>

                  {/* Back of card */}
                  <div
                    className="absolute w-full h-full rounded-lg p-6 text-white shadow-md flex flex-col items-center justify-center"
                    style={{
                      backgroundColor: card.color,
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)"
                    }}
                  >
                    <p className="text-sm opacity-80 mb-2">Expires</p>
                    <p className="text-3xl font-bold">
                      {new Date(card.expiresAt * 1000).toLocaleDateString()}
                    </p>
                    <p className="text-xs opacity-60 mt-4">Click to flip back</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Add New Card Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Add New Card</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Initial Balance</label>
            <input
              type="number"
              value={newCard.balance}
              onChange={(e) => setNewCard({ ...newCard, balance: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Card Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={newCard.color}
                onChange={(e) => setNewCard({ ...newCard, color: e.target.value })}
                className="w-12 h-10 border rounded-md cursor-pointer"
              />
              <input
                type="text"
                value={newCard.color}
                onChange={(e) => setNewCard({ ...newCard, color: e.target.value })}
                className="flex-1 px-3 py-2 border rounded-md"
                placeholder="#3b82f6"
              />
            </div>
          </div>
        </div>
        <Button
          onClick={handleAddCard}
          className="mt-4 w-full md:w-auto"
        >
          Add Card
        </Button>
      </div>


    </div>
  );
}
