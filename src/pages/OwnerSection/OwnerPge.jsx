import React from "react";
import { Link } from "react-router-dom";
import {
    ShoppingBag,
    Users,
    Package,
    DollarSign,
    Star,
    MessageCircle,
    Plus,
    Settings,
    Truck,
    TrendingUp,
    ChevronRight,
    Store
} from "lucide-react";

// A modern, responsive Owner dashboard with tasteful visuals.
// No external UI libs required beyond lucide-react (icons) + Tailwind.
// Replace mock data with live data when your API is ready.

const kpis = [
    {
        title: "Today's Orders",
        value: "28",
        delta: "+12%",
        icon: Package,
        badge: "Live",
    },
    {
        title: "Revenue (BDT)",
        value: "৳ 34,750",
        delta: "+8%",
        icon: DollarSign,
        badge: "Today",
    },
    {
        title: "Active Customers",
        value: "412",
        delta: "+3%",
        icon: Users,
        badge: "This week",
    },
    {
        title: "Avg. Rating",
        value: "4.7",
        delta: "+0.1",
        icon: Star,
        badge: "All time",
    },
];

const recentOrders = [
    { id: "#A1021", customer: "Hasan Mahmud", items: 3, total: 780, status: "Processing" },
    { id: "#A1020", customer: "Nusrat Jahan", items: 1, total: 450, status: "Ready" },
    { id: "#A1019", customer: "Rakibul Islam", items: 5, total: 1490, status: "Out for delivery" },
    { id: "#A1018", customer: "Mehedi Hasan", items: 2, total: 620, status: "Delivered" },
];

const quickActions = [
    { label: "Add New Product", icon: Plus, to: "/owner/products/new", subtle: false },
    { label: "Manage Orders", icon: Package, to: "/owner/orders", subtle: true },
    { label: "Delivery Queue", icon: Truck, to: "/owner/deliveries", subtle: true },
    { label: "Messages", icon: MessageCircle, to: "/messages", subtle: true },
    { label: "Store Settings", icon: Settings, to: "/settings", subtle: true },
];

function StatCard({ title, value, delta, icon: Icon, badge }) {
    return (
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="absolute right-0 top-0 h-24 w-24 -translate-y-6 translate-x-6 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 opacity-80 blur-2xl" />
            <div className="flex items-start justify-between">
                <div>
                    <div className="mb-1 flex items-center gap-2 text-sm text-slate-500">
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
              {badge}
            </span>
                        <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="text-emerald-600">{delta}</span>
                    </div>
                    <h3 className="text-slate-700">{title}</h3>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
                </div>
                <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 ring-1 ring-inset ring-indigo-100">
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </div>
    );
}

function ActionCard({ label, icon: Icon, to, subtle }) {
    return (
        <Link
            to={to}
            className={`group flex items-center justify-between rounded-2xl border p-4 transition ${
                subtle
                    ? "border-slate-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/60"
                    : "border-indigo-200 bg-indigo-50 hover:bg-indigo-100"
            }`}
        >
            <div className="flex items-center gap-3">
                <div className={`rounded-xl p-2 ring-1 ring-inset ${subtle ? "bg-white ring-slate-200" : "bg-white ring-indigo-200"}`}>
                    <Icon className={`h-5 w-5 ${subtle ? "text-slate-700" : "text-indigo-700"}`} />
                </div>
                <span className={`font-medium ${subtle ? "text-slate-800" : "text-indigo-900"}`}>{label}</span>
            </div>
            <ChevronRight className={`h-5 w-5 ${subtle ? "text-slate-400" : "text-indigo-700"}`} />
        </Link>
    );
}

export default function OwnerPage() {
    return (
        <main className="min-h-screen bg-slate-50">
            {/* Top Bar */}
            <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
                            <Store className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-slate-900">Owner Dashboard</h1>
                            <p className="text-xs text-slate-500">Smart Bakery Management System</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            to="/"
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Home
                        </Link>
                        <Link
                            to="/shop"
                            className="rounded-xl bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                        >
                            Go to Shop
                        </Link>
                    </div>
                </div>
            </header>

            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* KPI Grid */}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {kpis.map((k) => (
                        <StatCard key={k.title} {...k} />
                    ))}
                </div>

                {/* Two-Column Area */}
                <div className="mt-8 grid gap-6 lg:grid-cols-12">
                    {/* Left: Recent Orders */}
                    <div className="lg:col-span-7">
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="flex items-center justify-between border-b border-slate-200 p-5">
                                <div>
                                    <h2 className="text-base font-semibold text-slate-900">Recent Orders</h2>
                                    <p className="text-sm text-slate-500">Track the latest customer activity</p>
                                </div>
                                <Link to="/owner/orders" className="text-sm font-medium text-indigo-700 hover:underline">
                                    View all
                                </Link>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {recentOrders.map((o) => (
                                    <div key={o.id} className="flex items-center justify-between px-5 py-4">
                                        <div className="flex min-w-0 items-center gap-4">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-100">
                                                <ShoppingBag className="h-5 w-5" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-slate-900">
                                                    {o.id}
                                                </p>
                                                <p className="truncate text-sm text-slate-500">
                                                    {o.customer} • {o.items} items
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className="text-sm font-semibold text-slate-900">৳ {o.total}</p>
                                                <p className="text-xs text-slate-500">BDT</p>
                                            </div>
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                                                    o.status === "Delivered"
                                                        ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                                                        : o.status.includes("delivery")
                                                            ? "bg-blue-50 text-blue-700 ring-blue-200"
                                                            : o.status === "Ready"
                                                                ? "bg-amber-50 text-amber-700 ring-amber-200"
                                                                : "bg-slate-50 text-slate-700 ring-slate-200"
                                                }`}
                                            >
                        {o.status}
                      </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Quick Actions */}
                    <div className="lg:col-span-5">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <h2 className="text-base font-semibold text-slate-900">Quick Actions</h2>
                                    <p className="text-sm text-slate-500">Manage your store faster</p>
                                </div>
                            </div>
                            <div className="grid gap-3">
                                {quickActions.map((a) => (
                                    <ActionCard key={a.label} {...a} />
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-50 to-white p-6 shadow-sm ring-1 ring-inset ring-indigo-100">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-base font-semibold text-slate-900">Tips to boost sales</h3>
                                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
                                        <li>Keep popular items in stock before weekends.</li>
                                        <li>Reply to messages within 15 minutes.</li>
                                        <li>Offer bundle discounts on pastries.</li>
                                    </ul>
                                </div>
                                <TrendingUp className="h-6 w-6 text-indigo-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="border-t border-slate-200 bg-white/60">
                <div className="mx-auto max-w-7xl px-4 py-6 text-center text-xs text-slate-500 sm:px-6 lg:px-8">
                    © {new Date().getFullYear()} Smart Bakery • Owner Console
                </div>
            </footer>
        </main>
    );
}
