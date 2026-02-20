'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Star, Phone, Mail, MapPin, Clock, ChevronLeft, Heart } from 'lucide-react';
import {
    getBusinessById,
    incrementViewCount,
    getReviewsByBusinessId,
    addReview,
    isFavorite,
    addToFavorites,
    removeFromFavorites
} from '@/lib/api';
import { Business, Review } from '@/lib/types';
import { isBusinessOpen, formatWorkingHours } from '@/lib/utils';

export default function BusinessDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [business, setBusiness] = useState<Business | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [newReview, setNewReview] = useState({ userName: '', rating: 5, comment: '' });
    const [favorite, setFavorite] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (params?.id) {
            const id = params.id as string;
            (async () => {
                try {
                    const biz = await getBusinessById(id);
                    if (biz) {
                        setBusiness(biz);
                        await incrementViewCount(id);
                        const revs = await getReviewsByBusinessId(id);
                        setReviews(revs);
                        setFavorite(isFavorite(id));
                    }
                } finally {
                    setLoading(false);
                }
            })();
        }
    }, [params]);

    const toggleFavorite = () => {
        if (!business) return;
        if (favorite) {
            removeFromFavorites(business.id);
            setFavorite(false);
        } else {
            addToFavorites(business.id);
            setFavorite(true);
        }
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!business || !newReview.userName || !newReview.comment) return;
        setSubmitting(true);
        try {
            const review = await addReview({
                businessId: business.id,
                userName: newReview.userName,
                rating: newReview.rating,
                comment: newReview.comment,
            });
            setReviews([review, ...reviews]);
            setNewReview({ userName: '', rating: 5, comment: '' });
            // Refresh business data to update rating
            const updated = await getBusinessById(business.id);
            if (updated) setBusiness(updated);
        } finally {
            setSubmitting(false);
        }
    };


    if (!business) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🏢</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Business Not Found</h2>
                    <Link href="/" className="text-blue-600 hover:text-blue-700">
                        Return to Home
                    </Link>
                </div>
            </div>
        );
    }

    const isOpen = isBusinessOpen(business.workingHours);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <button onClick={() => router.back()} className="flex items-center text-blue-600 hover:text-blue-700">
                        <ChevronLeft className="w-5 h-5 mr-1" />
                        Back
                    </button>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Hero Section */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                    <div className="h-64 md:h-96 relative overflow-hidden">
                        {business.coverImage ? (
                            <img
                                src={business.coverImage}
                                alt={business.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600" />
                        )}
                        {business.verified && (
                            <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-full font-semibold flex items-center">
                                ✓ Verified Business
                            </div>
                        )}
                        {business.featured && (
                            <div className="absolute top-4 right-20 bg-orange-500 text-white px-4 py-2 rounded-full font-semibold">
                                ⭐ Featured
                            </div>
                        )}
                        <button
                            onClick={toggleFavorite}
                            className="absolute top-4 right-4 bg-white p-3 rounded-full hover:bg-gray-100 transition"
                        >
                            <Heart className={`w-6 h-6 ${favorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                        </button>
                    </div>

                    <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                            <div className="mb-4 md:mb-0">
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{business.name}</h1>
                                <p className="text-gray-600 mb-4">{business.description}</p>

                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-5 h-5 ${i < Math.floor(business.rating)
                                                    ? 'text-yellow-400 fill-current'
                                                    : 'text-gray-300'
                                                    }`}
                                            />
                                        ))}
                                        <span className="ml-2 font-semibold text-lg">{business.rating}</span>
                                        <span className="text-gray-500 ml-1">({business.reviewCount} reviews)</span>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full font-semibold ${isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {isOpen ? '● Open Now' : '● Closed'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <a
                                    href={`tel:${business.phone}`}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center font-semibold"
                                >
                                    <Phone className="w-5 h-5 mr-2" />
                                    Call Now
                                </a>
                                <a
                                    href={`mailto:${business.email}`}
                                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition flex items-center font-semibold"
                                >
                                    <Mail className="w-5 h-5 mr-2" />
                                    Email
                                </a>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-bold text-lg mb-3 flex items-center">
                                    <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                                    Location
                                </h3>
                                <p className="text-gray-700">{business.address}</p>
                                <p className="text-gray-600 text-sm mt-1">{business.location.city}</p>
                            </div>

                            <div>
                                <h3 className="font-bold text-lg mb-3 flex items-center">
                                    <Clock className="w-5 h-5 mr-2 text-blue-600" />
                                    Working Hours
                                </h3>
                                <div className="space-y-1">
                                    {business.workingHours.map((hours) => {
                                        const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }) === hours.day;
                                        return (
                                            <div key={hours.day} className={`flex justify-between text-sm ${isToday ? 'font-semibold text-blue-600' : 'text-gray-700'}`}>
                                                <span>{hours.day}</span>
                                                <span>{hours.isClosed ? 'Closed' : `${hours.open} - ${hours.close}`}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                    <h2 className="text-2xl font-bold mb-6">Reviews ({reviews.length})</h2>

                    {/* Add Review Form */}
                    <div className="mb-8 pb-8 border-b">
                        <h3 className="font-bold text-lg mb-4">Write a Review</h3>
                        <form onSubmit={handleSubmitReview} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Your Name</label>
                                <input
                                    type="text"
                                    value={newReview.userName}
                                    onChange={(e) => setNewReview({ ...newReview, userName: e.target.value })}
                                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                        <button
                                            key={rating}
                                            type="button"
                                            onClick={() => setNewReview({ ...newReview, rating })}
                                            className={`p-2 rounded-lg transition ${newReview.rating >= rating ? 'text-yellow-400' : 'text-gray-300'
                                                }`}
                                        >
                                            <Star className="w-8 h-8 fill-current" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Your Review</label>
                                <textarea
                                    value={newReview.comment}
                                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                    rows={4}
                                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
                            >
                                Submit Review
                            </button>
                        </form>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-6">
                        {reviews.map((review) => (
                            <div key={review.id} className="border-b pb-6 last:border-0">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h4 className="font-semibold text-gray-800">{review.userName}</h4>
                                        <div className="flex items-center mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                                        }`}
                                                />
                                            ))}
                                            <span className="text-gray-500 text-sm ml-2">
                                                {new Date(review.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-700">{review.comment}</p>
                            </div>
                        ))}
                        {reviews.length === 0 && (
                            <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
