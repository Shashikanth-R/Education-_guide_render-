import Link from 'next/link';
import { ChevronLeft, Search, Star, Heart, TrendingUp } from 'lucide-react';

export default function HowItWorksPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-pastel-mint via-pastel-blue to-pastel-lavender">
            <header className="bg-white/90 backdrop-blur-md shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <Link href="/" className="flex items-center text-pastel-blue-dark hover:text-pastel-purple-dark transition">
                        <ChevronLeft className="w-5 h-5 mr-1" />
                        Back to Home
                    </Link>
                </div>
            </header>

            <div className="container mx-auto px-4 py-12 max-w-5xl">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-6 gradient-text-pastel">How LocalBiz Works</h1>
                    <p className="text-xl text-gray-700">Discover, connect, and grow with local businesses</p>
                </div>

                {/* For Users */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">For Users</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white/90 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition">
                            <div className="bg-gradient-to-br from-pastel-blue-dark to-pastel-purple-dark w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <Search className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-gray-800">1. Search & Discover</h3>
                            <p className="text-gray-600">
                                Search for businesses by name, category, or location. Use our advanced filters to find exactly what you need.
                            </p>
                        </div>

                        <div className="bg-white/90 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition">
                            <div className="bg-gradient-to-br from-pastel-pink-dark to-pastel-peach-dark w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <Star className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-gray-800">2. Read Reviews</h3>
                            <p className="text-gray-600">
                                Check ratings and read authentic reviews from other customers to make informed decisions.
                            </p>
                        </div>

                        <div className="bg-white/90 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition">
                            <div className="bg-gradient-to-br from-pastel-mint-dark to-pastel-green-dark w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <Heart className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-gray-800">3. Save & Connect</h3>
                            <p className="text-gray-600">
                                Save your favorite businesses and connect instantly via phone or email. Leave reviews to help others.
                            </p>
                        </div>
                    </div>
                </div>

                {/* For Business Owners */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">For Business Owners</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white/90 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition">
                            <div className="text-5xl mb-4">📝</div>
                            <h3 className="text-xl font-bold mb-4 text-gray-800">1. Get Listed</h3>
                            <p className="text-gray-600">
                                Contact us to get your business listed on our platform with complete details and images.
                            </p>
                        </div>

                        <div className="bg-white/90 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition">
                            <div className="text-5xl mb-4">📊</div>
                            <h3 className="text-xl font-bold mb-4 text-gray-800">2. Get Discovered</h3>
                            <p className="text-gray-600">
                                Reach thousands of potential customers searching for services in your area.
                            </p>
                        </div>

                        <div className="bg-white/90 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition">
                            <div className="text-5xl mb-4">📈</div>
                            <h3 className="text-xl font-bold mb-4 text-gray-800">3. Grow</h3>
                            <p className="text-gray-600">
                                Build your reputation with reviews and ratings. Get featured to stand out even more.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Key Features */}
                <div className="bg-white/90 rounded-2xl shadow-xl p-8 md:p-12">
                    <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Key Features</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex items-start">
                            <div className="bg-pastel-blue rounded-lg p-3 mr-4">
                                <Search className="w-6 h-6 text-pastel-blue-dark" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg mb-2">Advanced Search</h4>
                                <p className="text-gray-600">Filter by category, location, rating, and more</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="bg-pastel-pink rounded-lg p-3 mr-4">
                                <Star className="w-6 h-6 text-pastel-pink-dark" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg mb-2">Verified Reviews</h4>
                                <p className="text-gray-600">Authentic customer feedback and ratings</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="bg-pastel-lavender rounded-lg p-3 mr-4">
                                <TrendingUp className="w-6 h-6 text-pastel-lavender-dark" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg mb-2">Trending Businesses</h4>
                                <p className="text-gray-600">Discover popular and highly-rated businesses</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="bg-pastel-mint rounded-lg p-3 mr-4">
                                <Heart className="w-6 h-6 text-pastel-mint-dark" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg mb-2">Favorites</h4>
                                <p className="text-gray-600">Save and organize your favorite businesses</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-16 text-center">
                    <div className="bg-gradient-to-r from-pastel-blue-dark via-pastel-purple-dark to-pastel-pink-dark rounded-2xl p-12 text-white shadow-xl">
                        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                        <p className="text-lg mb-8 opacity-90">Join thousands of users discovering local businesses</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/search"
                                className="bg-white text-pastel-purple-dark px-8 py-3 rounded-lg font-semibold hover:shadow-xl transition"
                            >
                                Browse Businesses
                            </Link>
                            <Link
                                href="/contact"
                                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
                            >
                                List Your Business
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
