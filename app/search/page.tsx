'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, MapPin, Filter, Star, Phone, ChevronLeft, Heart } from 'lucide-react';
import { searchBusinesses, isFavorite, addToFavorites, removeFromFavorites } from '@/lib/api';
import { CATEGORIES } from '@/lib/constants';
import { Business } from '@/lib/types';
import { isBusinessOpen } from '@/lib/utils';
import Logo from '@/components/Logo';

function SearchContent() {
    const searchParams = useSearchParams();
    const [results, setResults] = useState<Business[]>([]);
    const [query, setQuery] = useState(searchParams?.get('query') || '');
    const [location, setLocation] = useState(searchParams?.get('location') || '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams?.get('category') || '');
    const [minRating, setMinRating] = useState<number>(0);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(false);

    const categories = CATEGORIES;

    useEffect(() => {
        performSearch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const performSearch = async () => {
        setLoading(true);
        try {
            const filters: any = {};
            if (query) filters.query = query;
            if (location) filters.location = location;
            if (selectedCategory) filters.category = selectedCategory;
            if (minRating > 0) filters.rating = minRating;

            const searchResults = await searchBusinesses(filters);
            setResults(searchResults);

            // Update favorites
            const favSet = new Set<string>();
            searchResults.forEach((b: Business) => {
                if (isFavorite(b.id)) favSet.add(b.id);
            });
            setFavorites(favSet);
        } catch (err) {
            console.error('Search failed:', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = (businessId: string) => {
        if (favorites.has(businessId)) {
            removeFromFavorites(businessId);
            setFavorites(prev => {
                const newSet = new Set(prev);
                newSet.delete(businessId);
                return newSet;
            });
        } else {
            addToFavorites(businessId);
            setFavorites(prev => new Set(prev).add(businessId));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <Logo size="md" linked={true} glow={false} />
                        <Link href="/" className="text-blue-600 hover:text-blue-700 flex items-center text-sm font-medium">
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Back to Home
                        </Link>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Search Bar */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <div className="flex-1 flex items-center border-2 border-gray-200 rounded-lg px-4 py-3">
                            <Search className="text-gray-400 mr-3" size={20} />
                            <input
                                type="text"
                                placeholder="Search for schools, kindergartens..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="flex-1 outline-none"
                            />
                        </div>
                        <div className="flex-1 flex items-center border-2 border-gray-200 rounded-lg px-4 py-3">
                            <MapPin className="text-gray-400 mr-3" size={20} />
                            <input
                                type="text"
                                placeholder="City or Area..."
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="flex-1 outline-none"
                            />
                        </div>
                        <button
                            onClick={performSearch}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                        >
                            Search
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex items-center">
                            <Filter className="text-gray-500 mr-2" size={18} />
                            <span className="text-gray-700 font-medium mr-3">Filters:</span>
                        </div>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="border-2 border-gray-200 rounded-lg px-4 py-2 outline-none"
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                            ))}
                        </select>
                        <select
                            value={minRating}
                            onChange={(e) => setMinRating(Number(e.target.value))}
                            className="border-2 border-gray-200 rounded-lg px-4 py-2 outline-none"
                        >
                            <option value="0">Any Rating</option>
                            <option value="4">4+ Stars</option>
                            <option value="4.5">4.5+ Stars</option>
                        </select>
                        <button
                            onClick={performSearch}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>

                {/* Results */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {results.length} Schools Found
                        {selectedCategory && (
                            <span className="text-blue-600 ml-2">
                                in {categories.find(c => c.id === selectedCategory)?.name}
                            </span>
                        )}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.map((business) => {
                        const isOpen = isBusinessOpen(business.workingHours);
                        const isFav = favorites.has(business.id);

                        return (
                            <div
                                key={business.id}
                                className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden group"
                            >
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
                                    {business.verified && (
                                        <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                            ✓ Verified
                                        </div>
                                    )}
                                    <button
                                        onClick={() => toggleFavorite(business.id)}
                                        className="absolute top-3 right-3 bg-white p-2 rounded-full hover:bg-gray-100 transition"
                                    >
                                        <Heart
                                            className={`w-5 h-5 ${isFav ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                                        />
                                    </button>
                                    <div className="absolute bottom-3 left-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isOpen ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                            }`}>
                                            {isOpen ? 'Open Now' : 'Closed'}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <Link href={`/business/${business.id}`}>
                                        <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-blue-600 transition">
                                            {business.name}
                                        </h3>
                                    </Link>
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{business.description}</p>

                                    <div className="flex items-center mb-3">
                                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                        <span className="font-semibold">{business.rating}</span>
                                        <span className="text-gray-500 text-sm ml-1">({business.reviewCount} reviews)</span>
                                    </div>

                                    <div className="flex items-center text-gray-600 text-sm mb-2">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        <span className="line-clamp-1">{business.address}</span>
                                    </div>

                                    <div className="flex gap-2 mt-4">
                                        <a
                                            href={`tel:${business.phone}`}
                                            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center text-sm"
                                        >
                                            <Phone className="w-4 h-4 mr-1" />
                                            Call
                                        </a>
                                        <Link
                                            href={`/business/${business.id}`}
                                            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition flex items-center justify-center text-sm font-medium"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {results.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">No Results Found</h3>
                        <p className="text-gray-600">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-500">Loading search...</p></div>}>
            <SearchContent />
        </Suspense>
    );
}
