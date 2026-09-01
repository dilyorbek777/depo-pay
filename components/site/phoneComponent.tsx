import React from "react";
import {
  Bell,
  Send,
  ArrowUpRight,
  Receipt,
  Percent,
  Home,
  BarChart2,
  Wallet,
  User,
  Scan,
  ChevronRight,
} from "lucide-react";

export default function PhoneComponent() {
  return (
    <div className="flex justify-center items-center py-10 max-md:hidden bg-transparent min-h-screen ">
      {/* Phone Shell */}
      <div className="relative w-[360px] h-[740px] bg-white rounded-[48px] p-4  inset-shadow-sm inset-shadow-indigo-500/50 shadow-sm shadow-indigo-200 border-[8px] border-slate-200 flex flex-col justify-between overflow-hidden">
        
        {/* Top Speaker / Notch */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-1 bg-slate-300 rounded-full z-20" />

        {/* Scrollable Screen Content */}
        <div className="flex-1 overflow-hidden pt-4 pb-14 px-2">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-200" />
              <div>
                <p className="text-xs text-indigo-600 font-semibold">Hi, John!</p>
                <h2 className="text-sm font-bold text-slate-900">Welcome Back</h2>
              </div>
            </div>
            <button className="relative p-2 rounded-full hover:bg-slate-100 transition-colors">
              <Bell className="w-5 h-5 text-slate-700" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-orange-500 rounded-full" />
            </button>
          </div>

          {/* Account Balance Row */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-slate-500 font-medium">Account Balance</p>
              <h1 className="text-xl font-black text-slate-900">$5345.90</h1>
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-md shadow-indigo-200 transition-all">
              Add Card
            </button>
          </div>

          {/* Credit Card */}
          <div className="relative w-full h-44 rounded-2xl p-5 text-white flex flex-col justify-between overflow-hidden shadow-xl shadow-indigo-200/50 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 mb-6">
            <div className="flex justify-between items-center z-10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-white/30 backdrop-blur-md rounded-lg flex items-center justify-center font-bold text-sm">
                  $
                </div>
                <span className="font-semibold text-sm tracking-wide">PrimePay</span>
              </div>
              {/* Card Chip Icon */}
              <div className="w-9 h-7 border border-white/40 rounded-md bg-white/20 grid grid-cols-2 gap-0.5 p-1">
                <div className="bg-white/40 rounded-[1px]" />
                <div className="bg-white/40 rounded-[1px]" />
                <div className="bg-white/40 rounded-[1px]" />
                <div className="bg-white/40 rounded-[1px]" />
              </div>
            </div>

            <div className="z-10">
              <h3 className="text-2xl font-bold tracking-tight">$5345.90</h3>
            </div>

            <div className="flex justify-between items-end z-10 text-[10px] tracking-wider font-semibold">
              <div>
                <p className="text-white/60 text-[8px] uppercase">Card Holder</p>
                <p className="uppercase">ALIEN PIXELS</p>
              </div>
              <span className="text-lg italic font-extrabold tracking-tighter">VISA</span>
            </div>
          </div>

          {/* Action Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 text-center cursor-pointer hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                <Send className="w-4 h-4 -rotate-45 ml-0.5" />
              </div>
              <span className="text-xs font-semibold text-slate-800">Send / Receive</span>
            </div>

            <div className="bg-slate-100/70 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 text-center cursor-pointer hover:bg-slate-100 transition-colors">
              <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-700">Transfer Money</span>
            </div>

            <div className="bg-slate-100/70 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 text-center cursor-pointer hover:bg-slate-100 transition-colors">
              <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center">
                <Receipt className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-700">Recharge & Bills</span>
            </div>

            <div className="bg-slate-100/70 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 text-center cursor-pointer hover:bg-slate-100 transition-colors">
              <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center">
                <Percent className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-700">Voucher & Rewards</span>
            </div>
          </div>

          {/* History Section */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-slate-900 text-sm">History</h3>
              <button className="text-xs text-indigo-600 font-semibold flex items-center hover:underline">
                See All <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>

            <div className="bg-slate-100/70 rounded-2xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 to-indigo-500" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Paid to</p>
                  <p className="text-xs font-bold text-slate-800">John Bosko 9958</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-900">$56</p>
                <p className="text-[10px] text-slate-400 font-medium">Debited</p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Bottom Navigation */}
        <div className="absolute bottom-2 left-4 right-4 bg-white/80 backdrop-blur-md py-3 px-6 rounded-3xl flex justify-between items-center z-30 shadow-lg border border-slate-100">
          <button className="text-indigo-600">
            <Home className="w-5 h-5" />
          </button>
          <button className="text-slate-400 hover:text-slate-600">
            <BarChart2 className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 -mt-6 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center border-2 border-white shadow-md hover:bg-indigo-200 transition-colors">
            <Scan className="w-5 h-5" />
          </button>
          <button className="text-slate-400 hover:text-slate-600">
            <Wallet className="w-5 h-5" />
          </button>
          <button className="text-slate-400 hover:text-slate-600">
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}