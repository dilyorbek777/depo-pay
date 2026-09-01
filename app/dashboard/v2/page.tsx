"use client"

import React, { useState } from "react";
import {
    LayoutDashboard,
    Wallet,
    ArrowUpRight,
    TrendingUp,
    CreditCard,
    Settings,
    Bell,
    Search,
    Menu,
    X,
    Send,
    Plus,
    Receipt,
    Percent,
} from "lucide-react";

export default function DashboardPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#F5F5F5] text-[#4E4E4E] font-sans flex flex-col lg:flex-row">

            {/* ========================================== */}
            {/* 1. MOBILE HEADER & NAVIGATION TOGGLE       */}
            {/* ========================================== */}
            {/* LOCATOR: Mobile Navigation Header Bar */}
            <header className="lg:hidden bg-white px-4 py-3 border-b border-gray-200 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#625FFB] flex items-center justify-center text-white font-bold text-lg">
                        P
                    </div>
                    <span className="font-bold text-[#231656] text-lg">PrimePay</span>
                </div>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 text-[#231656] hover:bg-[#F8F8F8] rounded-lg transition-colors"
                    aria-label="Toggle Menu"
                >
                    {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </header>

            {/* ========================================== */}
            {/* 2. SIDEBAR CONTAINER                       */}
            {/* ========================================== */}
            {/* LOCATOR: Sidebar Navigation Panel */}
            <aside
                className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-[#F8F8F8] border-r border-gray-200 flex flex-col justify-between p-6 transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                    }`}
            >
                <div>
                    {/* Logo Brand */}
                    <div className="hidden lg:flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 rounded-xl bg-[#625FFB] flex items-center justify-center text-white font-bold text-xl shadow-md shadow-[#625FFB]/30">
                            P
                        </div>
                        <h1 className="text-xl font-bold text-[#231656]">PrimePay</h1>
                    </div>

                    {/* Navigation Links */}
                    <nav className="space-y-1">
                        <NavItem icon={<LayoutDashboard />} label="Dashboard" active />
                        <NavItem icon={<Wallet />} label="Wallets" />
                        <NavItem icon={<CreditCard />} label="Cards" />
                        <NavItem icon={<TrendingUp />} label="Analytics" />
                        <NavItem icon={<Settings />} label="Settings" />
                    </nav>
                </div>

                {/* User Quick Profile Section */}
                <div className="pt-6 border-t border-gray-200/80 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#625FFB]/20 border border-[#625FFB] flex items-center justify-center text-[#231656] font-bold">
                        JD
                    </div>
                    <div className="overflow-hidden">
                        <h4 className="text-sm font-bold text-[#231656] truncate">John Doe</h4>
                        <p className="text-xs text-[#4E4E4E] truncate">john@primepay.com</p>
                    </div>
                </div>
            </aside>

            {/* Backdrop for Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-black/40 z-30 lg:hidden"
                />
            )}

            {/* ========================================== */}
            {/* 3. MAIN CONTENT CANVAS                     */}
            {/* ========================================== */}
            {/* LOCATOR: Main Content Canvas Container */}
            <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-[1600px] mx-auto w-full space-y-8">

                {/* ========================================== */}
                {/* 3A. TOP DASHBOARD HEADER & SEARCH          */}
                {/* ========================================== */}
                {/* LOCATOR: Top Bar Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#231656]">
                            Dashboard Overview
                        </h1>
                        <p className="text-sm text-[#4E4E4E] mt-1">
                            Welcome back! Here is what's happening with your accounts today.
                        </p>
                    </div>

                    {/* Search & Actions */}
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4E4E4E]" />
                            <input
                                type="text"
                                placeholder="Search transaction..."
                                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#625FFB]"
                            />
                        </div>
                        <button
                            className="p-2.5 bg-white border border-gray-200 rounded-xl text-[#231656] hover:bg-[#F8F8F8] relative transition-colors"
                            aria-label="Notifications"
                        >
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-[#625FFB] rounded-full" />
                        </button>
                    </div>
                </div>

                {/* ========================================== */}
                {/* 3B. HERO STYLE GUIDE BANNER                */}
                {/* ========================================== */}
                {/* LOCATOR: Top Gradient Hero Banner */}
                <div className="relative w-full rounded-2xl p-6 sm:p-8 overflow-hidden bg-gradient-to-r from-[#625FFB] via-indigo-500 to-sky-300 text-white shadow-lg">
                    <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="relative z-10 max-w-xl space-y-3">
                        <span className="bg-white/20 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                            Pro Feature
                        </span>
                        <h2 className="text-xl sm:text-2xl font-bold">
                            Ready To Launch Your Online Payment App
                        </h2>
                        <p className="text-sm text-white/90 leading-relaxed">
                            A simple yet modern solution to showcase and manage your money efficiently.
                        </p>
                        <div className="pt-2">
                            <button className="bg-[#231656] hover:bg-[#231656]/90 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-md">
                                Upgrade Account
                            </button>
                        </div>
                    </div>
                </div>

                {/* ========================================== */}
                {/* 3C. KEY METRICS GRID                       */}
                {/* ========================================== */}
                {/* LOCATOR: Metrics & Balance Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard
                        title="Total Account Balance"
                        amount="$5,345.90"
                        change="+12.5%"
                        isPositive
                    />
                    <MetricCard
                        title="This Month Spends"
                        amount="$2,745.90"
                        change="-4.2%"
                        isPositive={false}
                    />
                    <MetricCard
                        title="Total Revenue"
                        amount="$14,820.00"
                        change="+8.1%"
                        isPositive
                    />
                    <MetricCard
                        title="Active Cards"
                        amount="3 Cards"
                        change="Active"
                        isPositive
                    />
                </div>

                {/* ========================================== */}
                {/* 3D. DASHBOARD MAIN CONTENT GRID            */}
                {/* ========================================== */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT 2 COLUMNS: Quick Actions & Recent Transactions */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* LOCATOR: Quick Actions Panel */}
                        <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="text-lg font-bold text-[#231656] mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <ActionButton icon={<Send className="-rotate-45" />} label="Send / Receive" />
                                <ActionButton icon={<ArrowUpRight />} label="Transfer Money" />
                                <ActionButton icon={<Receipt />} label="Recharge & Bills" />
                                <ActionButton icon={<Percent />} label="Vouchers" />
                            </div>
                        </section>

                        {/* LOCATOR: Recent Transactions List */}
                        <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-[#231656]">Recent Transactions</h3>
                                <button className="text-xs text-[#625FFB] font-bold hover:underline">
                                    See All
                                </button>
                            </div>

                            <div className="space-y-4">
                                <TransactionRow
                                    name="Peterberg"
                                    category="Transferred to Bank"
                                    amount="-$19.30"
                                    date="Today, 2:45 PM"
                                    bgColor="bg-sky-100 text-sky-600"
                                />
                                <TransactionRow
                                    name="Mark Henry"
                                    category="Transferred to Payee"
                                    amount="-$13.60"
                                    date="Yesterday, 5:12 PM"
                                    bgColor="bg-amber-100 text-amber-600"
                                />
                                <TransactionRow
                                    name="Pinto Salary"
                                    category="Transferred to Bank"
                                    amount="+$2,400.00"
                                    date="28 Aug 2026"
                                    isCredit
                                    bgColor="bg-rose-100 text-rose-600"
                                />
                            </div>
                        </section>
                    </div>

                    {/* RIGHT 1 COLUMN: Active Card Preview & Wallets Widget */}
                    <div className="space-y-8">

                        {/* LOCATOR: Active Credit Card Preview */}
                        <section className="bg-[#F8F8F8] p-6 rounded-2xl border border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-base font-bold text-[#231656]">My Primary Card</h3>
                                <button className="text-[#625FFB] p-1 rounded-lg hover:bg-gray-200 transition-colors">
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Digital Card component styled with Primary/Secondary Theme */}
                            <div className="relative w-full h-48 rounded-2xl p-5 text-white flex flex-col justify-between overflow-hidden shadow-xl bg-gradient-to-br from-[#231656] via-indigo-900 to-[#625FFB]">
                                <div className="flex justify-between items-center z-10">
                                    <span className="font-semibold text-sm tracking-wide">PrimePay</span>
                                    <div className="w-8 h-6 border border-white/40 rounded bg-white/20 grid grid-cols-2 gap-0.5 p-1">
                                        <div className="bg-white/50 rounded-[1px]" />
                                        <div className="bg-white/50 rounded-[1px]" />
                                        <div className="bg-white/50 rounded-[1px]" />
                                        <div className="bg-white/50 rounded-[1px]" />
                                    </div>
                                </div>

                                <div className="z-10">
                                    <p className="text-xs text-white/70">Balance</p>
                                    <h3 className="text-2xl font-bold tracking-tight">$5,345.90</h3>
                                </div>

                                <div className="flex justify-between items-end z-10 text-[10px] tracking-wider font-semibold">
                                    <div>
                                        <p className="text-white/60 text-[8px] uppercase">Card Holder</p>
                                        <p className="uppercase">JOHN DOE</p>
                                    </div>
                                    <span className="text-base italic font-extrabold">VISA</span>
                                </div>
                            </div>
                        </section>

                        {/* LOCATOR: Monthly Spending Gauge Widget */}
                        <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center">
                            <h3 className="text-base font-bold text-[#231656] w-full text-left mb-4">
                                Monthly Spending Limit
                            </h3>

                            {/* Gauge UI */}
                            <div className="relative w-44 h-22 overflow-hidden flex justify-center items-end mt-2">
                                <div className="w-40 h-40 rounded-full border-[14px] border-[#F8F8F8] border-b-transparent border-l-transparent -rotate-45" />
                                <div className="absolute w-40 h-40 rounded-full border-[14px] border-[#625FFB] border-b-transparent border-l-transparent -rotate-[110deg]" />
                                <div className="absolute bottom-1 left-1/2 w-1 h-12 bg-[#231656] rounded-full origin-bottom -translate-x-1/2 rotate-[20deg]" />
                            </div>

                            <p className="text-xs text-[#4E4E4E] font-medium mt-3">This Month Spends</p>
                            <h4 className="text-xl font-extrabold text-[#231656] mt-0.5">$2,745.90</h4>

                            <div className="w-full grid grid-cols-2 gap-3 mt-6">
                                <button className="bg-[#625FFB] hover:bg-[#625FFB]/90 text-white font-semibold text-xs py-2.5 rounded-xl transition-all shadow-sm">
                                    Add Balance
                                </button>
                                <button className="bg-[#F8F8F8] hover:bg-gray-200 text-[#4E4E4E] font-semibold text-xs py-2.5 rounded-xl transition-all">
                                    Withdraw
                                </button>
                            </div>
                        </section>

                    </div>
                </div>
            </main>
        </div>
    );
}

{/* ========================================== */ }
{/* 4. HELPER COMPONENTS                       */ }
{/* ========================================== */ }

// LOCATOR: Sidebar Navigation Link Component
function NavItem({
    icon,
    label,
    active = false,
}: {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
}) {
    return (
        <a
            href="#"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${active
                    ? "bg-[#625FFB] text-white shadow-md shadow-[#625FFB]/20"
                    : "text-[#4E4E4E] hover:bg-gray-200/60 hover:text-[#231656]"
                }`}
        >
            {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" })}
            <span>{label}</span>
        </a>
    );
}

// LOCATOR: Summary Metric Card Component
function MetricCard({
    title,
    amount,
    change,
    isPositive,
}: {
    title: string;
    amount: string;
    change: string;
    isPositive: boolean;
}) {
    return (
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-xs text-[#4E4E4E] font-medium">{title}</p>
            <div className="flex items-baseline justify-between mt-2">
                <h3 className="text-xl font-extrabold text-[#231656]">{amount}</h3>
                <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-md ${isPositive
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-rose-50 text-rose-600"
                        }`}
                >
                    {change}
                </span>
            </div>
        </div>
    );
}

// LOCATOR: Quick Action Button Component
function ActionButton({
    icon,
    label,
}: {
    icon: React.ReactNode;
    label: string;
}) {
    return (
        <button className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#F8F8F8] hover:bg-[#625FFB]/10 hover:text-[#625FFB] transition-all group">
            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 text-[#231656] flex items-center justify-center group-hover:bg-[#625FFB] group-hover:text-white transition-all shadow-sm">
                {React.cloneElement(icon as React.ReactElement, { className: "w-4 h-4" })}
            </div>
            <span className="text-xs font-semibold text-[#4E4E4E] group-hover:text-[#625FFB] mt-2 text-center">
                {label}
            </span>
        </button>
    );
}

// LOCATOR: Transaction Item Row Component
function TransactionRow({
    name,
    category,
    amount,
    date,
    isCredit = false,
    bgColor,
}: {
    name: string;
    category: string;
    amount: string;
    date: string;
    isCredit?: boolean;
    bgColor: string;
}) {
    return (
        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F8F8F8] transition-colors">
            <div className="flex items-center gap-3">
                <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${bgColor}`}
                >
                    {name.charAt(0)}
                </div>
                <div>
                    <h4 className="text-sm font-bold text-[#231656]">{name}</h4>
                    <p className="text-xs text-[#4E4E4E]">{category}</p>
                </div>
            </div>
            <div className="text-right">
                <p
                    className={`text-sm font-bold ${isCredit ? "text-emerald-600" : "text-[#231656]"
                        }`}
                >
                    {amount}
                </p>
                <p className="text-[10px] text-gray-400">{date}</p>
            </div>
        </div>
    );
}