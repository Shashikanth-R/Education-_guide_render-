'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, Star, MapPin, Phone, ChevronLeft } from 'lucide-react';
import { getFavoriteBusinesses, removeFromFavorites } from '@/lib/api';
import { Business } from '@/lib/types';

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState<Business[]>([]);

    useEffect(() => {
        getFavoriteBusinesses().then(setFavorites);
    }, []);

    const handleRemove = async (id: string) => {
        removeFromFavorites(id);
        const updated = await getFavoriteBusinesses();
        setFavorites(updated);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <Link href="/" className="flex items-center text-blue-600 hover:text-blue-700">
                        <ChevronLeft className="w-5 h-5 mr-1" />
                        Back to Home
                    </Link>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="flex items-center mb-8">
                    <Heart className="w-8 h-8 text-red-500 fill-current mr-3" />
                    <h1 className="text-3xl font-bold text-gray-800">My Favorites</h1>
                </div>

                {favorites.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favorites.map((business) => (
                            <div key={business.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden">
                                <div className="h-48 relative overflow-hidden">
                                    {business.coverImage ? (
                                        <img
                                            src={business.coverImage}
                                            alt={business.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500" />
                                    )}
                                </div>
                                <div className="p-5">
                                    <Link href={`/business/${business.id}`}>
                                        <h3 className="font-bold text-lg text-gray-800 mb-2 hover:text-blue-600 transition">
                                            {business.name}
                                        </h3>
                                    </Link>
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{business.description}</p>

                                    <div className="flex items-center mb-3">
                                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                        <span className="font-semibold">{business.rating}</span>
                                        <span className="text-gray-500 text-sm ml-1">({business.reviewCount})</span>
                                    </div>

                                    <div className="flex gap-2">
                                        <a
                                            href={`tel:${business.phone}`}
                                            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center text-sm"
                                        >
                                            <Phone className="w-4 h-4 mr-1" />
                                            Call
                                        </a>
                                        <button
                                            onClick={() => handleRemove(business.id)}
                                            className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg hover:bg-red-200 transition text-sm font-medium"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-xl shadow-md">
                        <Heart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Favorites Yet</h2>
                        <p className="text-gray-600 mb-6">Start adding businesses to your favorites!</p>
                        <Link href="/search" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold">
                            Browse Businesses
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
