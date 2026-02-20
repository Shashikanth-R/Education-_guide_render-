'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Trash2, Star, Edit } from 'lucide-react';
import { isAdminAuthenticated, getAllBusinesses, deleteBusiness } from '@/lib/api';
import { Business } from '@/lib/types';

export default function ManageBusinessesPage() {
    const router = useRouter();
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!isAdminAuthenticated()) {
            router.push('/admin');
            return;
        }
        loadBusinesses();
    }, [router]);

    const loadBusinesses = async () => {
        const data = await getAllBusinesses();
        setBusinesses(data);
    };

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete "${name}"?`)) {
            await deleteBusiness(id);
            loadBusinesses();
        }
    };

    const filteredBusinesses = businesses.filter(b =>
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white p-6">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold">EducationGuide Admin</h1>
                </div>
                <Link href="/admin/dashboard" className="flex items-center px-4 py-3 hover:bg-gray-800 rounded-lg transition">
                    <ChevronLeft className="w-5 h-5 mr-3" />
                    Back to Dashboard
                </Link>
            </div>

            {/* Main Content */}
            <div className="ml-64 p-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Manage Schools</h2>
                    <p className="text-gray-600 mt-1">View, edit, and delete school listings</p>
                </div>

                {/* Search */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <input
                        type="text"
                        placeholder="Search schools..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                    />
                </div>

                {/* Businesses List */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">School</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Rating</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Views</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredBusinesses.map((business) => (
                                    <tr key={business.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-semibold text-gray-800">{business.name}</div>
                                                <div className="text-sm text-gray-600">{business.phone}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="capitalize text-gray-700">{business.category}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                                <span className="font-semibold">{business.rating}</span>
                                                <span className="text-gray-500 text-sm ml-1">({business.reviewCount})</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700">{business.viewCount}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                {business.verified && (
                                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                                        Verified
                                                    </span>
                                                )}
                                                {business.featured && (
                                                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                                                        Featured
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/admin/dashboard/edit/${business.id}`}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(business.id, business.name)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredBusinesses.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            No schools found
                        </div>
                    )}
                </div>

                <div className="mt-6 text-gray-600 text-sm">
                    Showing {filteredBusinesses.length} of {businesses.length} schools
                </div>
            </div>
        </div>
    );
}
