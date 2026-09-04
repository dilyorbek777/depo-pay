import React from "react";
import { Bell, Home, BarChart2, Scan, Wallet, User, ChevronRight } from "lucide-react";

export default function WalletCardComponent() {
  const transactions = [
    {
      id: 1,
      name: "Peterberg",
      type: "Transfered to Bank",
      amount: "- $19.30",
      bgColor: "bg-sky-300",
    },
    {
      id: 2,
      name: "Mark Henry",
      type: "Transfered to Payee",
      amount: "- $13.60",
      bgColor: "bg-amber-200",
    },
    {
      id: 3,
      name: "Pinto Salary",
      type: "Transfered to Bank",
      amount: "- $13.60",
      bgColor: "bg-rose-200",
    },
  ];

  return (
    <div className="flex justify-center items-center py-16 bg-transparent max-md:hidden min-h-screen">
      {/* Outer Wrapper with Background Gradient Card */}
      <div className="relative flex justify-center items-center">
        {/* Colorful Gradient Backdrop */}
        <div className="absolute -top-10 w-[420px] h-[260px] rounded-[36px] bg-gradient-to-r from-orange-300 via-pink-300 to-indigo-400 shadow-xl opacity-90 -z-0" />

        {/* Phone Container */}
        <div className="relative z-10 w-[340px] h-[680px] bg-white rounded-[44px] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-[6px] border-slate-100 flex flex-col justify-between overflow-hidden">
          
          {/* Top Notch / Earpiece */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-14 h-1 bg-slate-300 rounded-full z-20" />

          {/* Screen Content */}
          <div className="flex-1 overflow-y-auto no-scrollbar pt-4 pb-12 px-2">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="w-6" /> {/* Spacer */}
              <h2 className="text-base font-bold text-primary">My Wallets</h2>
              <button className="relative p-1.5 rounded-full hover:bg-slate-100 transition-colors">
                <Bell className="w-5 h-5 text-primary" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-amber-500 rounded-full" />
              </button>
            </div>

            {/* Gauge Spending Indicator */}
            <div className="flex flex-col items-center my-2">
              <div className="relative w-48 h-24 overflow-hidden flex justify-center items-end">
                {/* Background Gauge Arch */}
                <div className="w-44 h-44 rounded-full border-[18px] border-slate-200 border-b-transparent border-l-transparent -rotate-45" />
                {/* Active Colored Gauge Arch */}
                <div className="absolute w-44 h-44 rounded-full border-[18px] border-amber-500 border-b-transparent border-l-transparent -rotate-[115deg]" />
                
                {/* Needle Indicator */}
                <div className="absolute bottom-1 left-1/2 w-1 h-14 bg-primary/80 rounded-full origin-bottom -translate-x-1/2 rotate-[25deg] shadow-md" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-2 border-white" />
              </div>

              <p className="text-[11px] text-slate-400 font-medium mt-3">This Month Spends</p>
              <h1 className="text-2xl font-black text-primary tracking-tight">$2745.90</h1>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 my-6">
              <button className="bg-primary hover:bg-primary/80 text-white font-semibold text-xs py-3 px-4 rounded-xl shadow-lg shadow-primary/20 transition-all">
                Add Balance
              </button>
              <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-semibold text-xs py-3 px-4 rounded-xl transition-all">
                Withdraw
              </button>
            </div>

            {/* Last Transferred Section */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-slate-800 text-xs">Last Transferred</h3>
                <button className="text-[11px] text-amber-500 font-bold flex items-center hover:underline">
                  See All <ChevronRight className="w-3 h-3 ml-0.5" />
                </button>
              </div>

              {/* Transactions List */}
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50/80 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${tx.bgColor}`} />
                      <div>
                        <p className="text-xs font-bold text-slate-800">{tx.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{tx.type}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-rose-500">{tx.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Nav Bar */}
          <div className="absolute bottom-3 left-4 right-4 bg-white/90 backdrop-blur-md py-2.5 px-5 rounded-2xl flex justify-between items-center z-30 shadow-sm border border-slate-100">
            <button className="text-slate-400 hover:text-slate-600">
              <Home className="w-4 h-4" />
            </button>
            <button className="text-slate-400 hover:text-slate-600">
              <BarChart2 className="w-4 h-4" />
            </button>
            <button className="text-slate-400 hover:text-slate-600">
              <Scan className="w-4 h-4" />
            </button>
            <button className="text-indigo-600 p-1.5 bg-indigo-50 rounded-xl">
              <Wallet className="w-4 h-4" />
            </button>
            <button className="text-slate-400 hover:text-slate-600">
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}