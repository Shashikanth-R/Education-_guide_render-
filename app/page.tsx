'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, TrendingUp, Star, ChevronRight } from 'lucide-react';
import { getAnalytics } from '@/lib/api';
import { CATEGORIES } from '@/lib/constants';
import { Business } from '@/lib/types';
import HeroSlider from '@/components/HeroSlider';
import Logo from '@/components/Logo';

export default function Home() {
    const [searchQuery, setSearchQuery] = useState('');
    const [location, setLocation] = useState('');
    const categories = CATEGORIES;
    const [trendingBusinesses, setTrendingBusinesses] = useState<Business[]>([]);
    const [loadingTrending, setLoadingTrending] = useState(true);
    const [errorTrending, setErrorTrending] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setLoadingTrending(true);
        setErrorTrending(false);
        getAnalytics().then(analytics => {
            setTrendingBusinesses((analytics.trendingBusinesses || []).slice(0, 6));
        }).catch((err) => {
            console.error('Failed to load trending businesses:', err);
            setErrorTrending(true);
        }).finally(() => {
            setLoadingTrending(false);
        });
    }, []);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchQuery) params.set('query', searchQuery);
        if (location) params.set('location', location);
        window.location.href = `/search?${params.toString()}`;
    };

    const handleCategoryClick = (categoryId: string) => {
        window.location.href = `/search?category=${categoryId}`;
    };

    if (!mounted) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pastel-blue via-pastel-lavender to-pastel-pink">
            {/* Header */}
            <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Logo size="lg" linked={true} glow={true} />
                        <nav className="hidden md:flex items-center space-x-6">
                            <Link href="/" className="text-gray-700 hover:text-pastel-purple-dark transition">Home</Link>
                            <Link href="/search" className="text-gray-700 hover:text-pastel-blue-dark transition">Browse</Link>
                            <Link href="/favorites" className="text-gray-700 hover:text-pastel-pink-dark transition">Favorites</Link>
                            <Link href="/contact" className="text-gray-700 hover:text-pastel-mint-dark transition">Contact</Link>
                            <Link href="/about" className="text-gray-700 hover:text-pastel-lavender-dark transition">About</Link>
                            <Link href="/admin" className="bg-gradient-to-r from-pastel-blue-dark to-pastel-purple-dark text-white px-4 py-2 rounded-lg hover:shadow-lg transition">
                                Admin
                            </Link>
                        </nav>
                        <button className="md:hidden p-2">
                            <div className="w-6 h-0.5 bg-gray-700 mb-1"></div>
                            <div className="w-6 h-0.5 bg-gray-700 mb-1"></div>
                            <div className="w-6 h-0.5 bg-gray-700"></div>
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Slider */}
            <HeroSlider />

            {/* Search Bar */}
            <section className="py-8 px-4 bg-white/80 backdrop-blur-sm shadow-sm">
                <div className="container mx-auto max-w-4xl">
                    <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-6">
                        <p className="text-center text-gray-500 text-sm mb-4 font-medium">🔍 Search from 1,000+ institutions across Bahrain</p>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 flex items-center border-2 border-gray-200 rounded-lg px-4 py-3 focus-within:border-blue-500 transition">
                                <Search className="text-gray-400 mr-3" />
                                <input
                                    type="text"
                                    placeholder="Search for schools, kindergartens..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    className="flex-1 outline-none text-gray-700"
                                />
                            </div>
                            <div className="flex-1 flex items-center border-2 border-gray-200 rounded-lg px-4 py-3 focus-within:border-blue-500 transition">
                                <MapPin className="text-gray-400 mr-3" />
                                <input
                                    type="text"
                                    placeholder="Location (city, area...)"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    className="flex-1 outline-none text-gray-700"
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                className="bg-gradient-to-r from-[#0099FF] via-[#6C63FF] to-[#E91E63] text-white px-8 py-3 rounded-lg font-semibold hover:shadow-xl transform hover:scale-105 transition"
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-16 px-4 bg-white/50">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">Browse by Category</h2>
                        <Link href="/search" className="text-blue-600 hover:text-blue-700 flex items-center">
                            View All <ChevronRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                        {categories.slice(0, 16).map((category, idx) => {
                            // Unique gradient per card for non-image categories
                            const gradients = [
                                'from-blue-400 to-indigo-600',
                                'from-pink-400 to-rose-600',
                                'from-emerald-400 to-teal-600',
                                'from-amber-400 to-orange-500',
                                'from-violet-400 to-purple-600',
                                'from-cyan-400 to-blue-500',
                                'from-fuchsia-400 to-pink-600',
                                'from-lime-400 to-green-600',
                                'from-red-400 to-rose-600',
                                'from-sky-400 to-cyan-600',
                                'from-orange-400 to-amber-600',
                                'from-teal-400 to-emerald-600',
                                'from-indigo-400 to-violet-600',
                                'from-rose-400 to-pink-600',
                                'from-green-400 to-teal-500',
                                'from-yellow-400 to-amber-500',
                            ];
                            return (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategoryClick(category.id)}
                                    className="relative rounded-2xl overflow-hidden group cursor-pointer"
                                    style={{
                                        height: '200px',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.10)',
                                        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
                                    }}
                                    onMouseEnter={e => {
                                        (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(0,0,0,0.22)';
                                        (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px) scale(1.02)';
                                    }}
                                    onMouseLeave={e => {
                                        (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.10)';
                                        (e.currentTarget as HTMLElement).style.transform = 'translateY(0) scale(1)';
                                    }}
                                >
                                    {/* Background — photo or gradient */}
                                    {category.image ? (
                                        <img
                                            src={category.image}
                                            alt={category.name}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className={`absolute inset-0 bg-gradient-to-br ${gradients[idx % gradients.length]}`} />
                                    )}

                                    {/* Subtle top shine */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

                                    {/* Bottom gradient for text legibility */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent pointer-events-none" />

                                    {/* Content */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-end pb-5 px-3">
                                        {/* Frosted emoji badge */}
                                        <div
                                            className="mb-2 flex items-center justify-center rounded-full"
                                            style={{
                                                width: 52,
                                                height: 52,
                                                background: 'rgba(255,255,255,0.18)',
                                                backdropFilter: 'blur(8px)',
                                                border: '1.5px solid rgba(255,255,255,0.35)',
                                                fontSize: 26,
                                                transition: 'transform 0.3s ease',
                                            }}
                                        >
                                            {category.icon}
                                        </div>
                                        <h3 className="font-semibold text-white text-sm text-center leading-snug" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}>
                                            {category.name}
                                        </h3>
                                        <p className="text-white/70 text-xs mt-0.5 font-medium tracking-wide">
                                            {category.count} listings
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Trending Businesses */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex items-center mb-8">
                        <TrendingUp className="w-8 h-8 text-orange-500 mr-3" />
                        <h2 className="text-3xl font-bold text-gray-800">Top Rated Schools</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loadingTrending ? (
                            // Loading Skeletons
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="bg-white rounded-xl shadow-md h-80 animate-pulse" />
                            ))
                        ) : errorTrending ? (
                            <div className="col-span-full bg-red-50 border border-red-200 text-red-700 px-6 py-8 rounded-xl text-center">
                                <p className="text-lg font-medium mb-2">Unable to load institutions</p>
                                <p className="text-sm opacity-75">There was a problem connecting to the database. Please try again later.</p>
                            </div>
                        ) : trendingBusinesses.length > 0 ? (
                            trendingBusinesses.map((business) => (
                                <Link
                                    key={business.id}
                                    href={`/business/${business.id}`}
                                    className="bg-white rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300 overflow-hidden group"
                                >
                                    <div className="h-48 relative overflow-hidden">
                                        {business.coverImage ? (
                                            <img
                                                src={business.coverImage}
                                                alt={business.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-pastel-peach via-pastel-yellow to-pastel-mint" />
                                        )}
                                        {business.verified && (
                                            <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                                                ✓ Verified
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-blue-600 transition">
                                            {business.name}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{business.description}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                                <span className="font-semibold text-gray-700">{business.rating}</span>
                                                <span className="text-gray-500 text-sm ml-1">({business.reviewCount})</span>
                                            </div>
                                            <span className="text-blue-600 text-sm font-medium">{business.priceRange}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full bg-blue-50 border border-blue-200 text-blue-700 px-6 py-8 rounded-xl text-center">
                                <p className="text-lg font-medium">No institutions found</p>
                                <p className="text-sm opacity-75">Check back later for new listings.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4 bg-gradient-to-r from-pastel-blue-dark via-pastel-lavender-dark to-pastel-pink-dark">
                <div className="container mx-auto max-w-4xl text-center text-white">
                    <h2 className="text-4xl font-bold mb-4">Own a School or Educational Institution?</h2>
                    <p className="text-xl mb-8 opacity-90">
                        Get your institution listed on EducationGuide and reach thousands of parents and students
                    </p>
                    <Link
                        href="/contact"
                        className="inline-block bg-white text-pastel-purple-dark px-8 py-4 rounded-lg font-semibold hover:shadow-xl transform hover:scale-105 transition"
                    >
                        Contact Us Today
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-  white py-12 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h3 className="font-bold text-xl mb-4">EducationGuide</h3>
                            <p className="text-gray-400 text-sm">
                                Your trusted education directory. Find, review, and connect with the best schools and educational institutions in your area.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li><Link href="/search" className="hover:text-white transition">Browse Schools</Link></li>
                                <li><Link href="/favorites" className="hover:text-white transition">My Favorites</Link></li>
                                <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
                                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Popular Categories</h4>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li><Link href="/search?category=kindergartens" className="hover:text-white transition">Kindergartens</Link></li>
                                <li><Link href="/search?category=preschools" className="hover:text-white transition">Preschools</Link></li>
                                <li><Link href="/search?category=primary-schools" className="hover:text-white transition">Primary Schools</Link></li>
                                <li><Link href="/search?category=secondary-schools" className="hover:text-white transition">Secondary Schools</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Help</h4>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
                                <li><Link href="/how-it-works" className="hover:text-white transition">How It Works</Link></li>
                                <li><Link href="/contact" className="hover:text-white transition">Support</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
                        <p>&copy; 2026 EducationGuide. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
