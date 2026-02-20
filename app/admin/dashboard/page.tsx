'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    LogOut,
    BarChart,
    Building2,
    MessageSquare,
    Star,
    Heart,
    TrendingUp,
    Plus,
    Settings,
} from 'lucide-react';
import { isAdminAuthenticated, adminLogout, getAnalytics, getAllContacts } from '@/lib/api';
import Logo from '@/components/Logo';

export default function AdminDashboardPage() {
    const router = useRouter();
    const [analytics, setAnalytics] = useState<any>(null);
    const [unreadContacts, setUnreadContacts] = useState(0);

    useEffect(() => {
        if (!isAdminAuthenticated()) {
            router.push('/admin');
            return;
        }

        (async () => {
            try {
                const data = await getAnalytics();
                setAnalytics(data);
                const contacts = await getAllContacts();
                setUnreadContacts(contacts.filter((c: any) => !c.read).length);
            } catch (err) {
                console.error('Failed to load dashboard:', err);
            }
        })();
    }, [router]);

    const handleLogout = () => {
        adminLogout();
        router.push('/admin');
    };

    if (!analytics) return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white p-6">
                <div className="mb-8 pb-6 border-b border-gray-700">
                    <Logo size="sm" linked={true} className="brightness-0 invert" />
                    <p className="text-gray-400 text-xs mt-2 uppercase tracking-widest font-semibold">Admin Panel</p>
                </div>

                <nav className="space-y-2">
                    <Link href="/admin/dashboard" className="flex items-center px-4 py-3 bg-blue-600 rounded-lg">
                        <BarChart className="w-5 h-5 mr-3" />
                        Dashboard
                    </Link>
                    <Link href="/admin/dashboard/add-business" className="flex items-center px-4 py-3 hover:bg-gray-800 rounded-lg transition">
                        <Plus className="w-5 h-5 mr-3" />
                        Add Business
                    </Link>
                    <Link href="/admin/dashboard/manage" className="flex items-center px-4 py-3 hover:bg-gray-800 rounded-lg transition">
                        <Building2 className="w-5 h-5 mr-3" />
                        Manage Businesses
                    </Link>
                    <Link href="/admin/dashboard/contacts" className="flex items-center px-4 py-3 hover:bg-gray-800 rounded-lg transition">
                        <MessageSquare className="w-5 h-5 mr-3" />
                        Contact Messages
                        {unreadContacts > 0 && (
                            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">{unreadContacts}</span>
                        )}
                    </Link>
                </nav>

                <button
                    onClick={handleLogout}
                    className="absolute bottom-6 left-6 right-6 flex items-center px-4 py-3 hover:bg-gray-800 rounded-lg transition"
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                </button>
            </div>

            {/* Main Content */}
            <div className="ml-64 p-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Dashboard Overview</h2>
                    <p className="text-gray-600 mt-1">Welcome back! Here's what's happening.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Total Businesses</p>
                                <p className="text-3xl font-bold text-gray-800 mt-2">{analytics.totalBusinesses}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <Building2 className="w-8 h-8 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Total Reviews</p>
                                <p className="text-3xl font-bold text-gray-800 mt-2">{analytics.totalReviews}</p>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-lg">
                                <Star className="w-8 h-8 text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Total Favorites</p>
                                <p className="text-3xl font-bold text-gray-800 mt-2">{analytics.totalFavorites}</p>
                            </div>
                            <div className="bg-red-100 p-3 rounded-lg">
                                <Heart className="w-8 h-8 text-red-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Contact Messages</p>
                                <p className="text-3xl font-bold text-gray-800 mt-2">{analytics.totalContacts}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-lg">
                                <MessageSquare className="w-8 h-8 text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Popular Categories */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h3 className="text-xl font-bold mb-4">Popular Categories</h3>
                    <div className="space-y-3">
                        {analytics.popularCategories.map((cat: any, idx: number) => (
                            <div key={idx} className="flex items-center">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium capitalize">{cat.category}</span>
                                        <span className="text-gray-600">{cat.count} businesses</span>
                                    </div>
                                    <div className="bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full"
                                            style={{ width: `${(cat.count / analytics.totalBusinesses) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Trending Businesses */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center mb-4">
                        <TrendingUp className="w-6 h-6 text-orange-500 mr-2" />
                        <h3 className="text-xl font-bold">Trending Businesses</h3>
                    </div>
                    <div className="space-y-3">
                        {analytics.trendingBusinesses.slice(0, 5).map((business: any) => (
                            <div key={business.id} className="flex items-center justify-between py-3 border-b last:border-0">
                                <div>
                                    <h4 className="font-semibold">{business.name}</h4>
                                    <p className="text-sm text-gray-600">{business.category}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">{business.viewCount} views</p>
                                    <p className="text-sm text-gray-600">⭐ {business.rating}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
