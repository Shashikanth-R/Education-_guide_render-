import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/analytics
export async function GET() {
    try {
        const [businesses, reviews, contacts] = await Promise.all([
            prisma.business.findMany(),
            prisma.review.findMany(),
            prisma.contactSubmission.findMany(),
        ]);

        // Category counts
        const categoryCounts: { [key: string]: number } = {};
        businesses.forEach((b) => {
            categoryCounts[b.category] = (categoryCounts[b.category] || 0) + 1;
        });

        const popularCategories = Object.entries(categoryCounts)
            .map(([category, count]) => ({ category, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        const trendingBusinesses = [...businesses]
            .sort((a, b) => b.viewCount - a.viewCount)
            .slice(0, 10)
            .map((b) => ({
                ...b,
                images: JSON.parse(b.images || '[]'),
                workingHours: JSON.parse(b.workingHours || '[]'),
                location: { latitude: b.latitude, longitude: b.longitude, city: b.city },
                createdAt: b.createdAt.toISOString(),
            }));

        return NextResponse.json({
            totalBusinesses: businesses.length,
            totalReviews: reviews.length,
            totalFavorites: 0, // Favorites are per-user (kept in localStorage)
            totalContacts: contacts.length,
            popularCategories,
            trendingBusinesses,
        });
    } catch (error: any) {
        console.error('GET /api/analytics error:', error);
        if (error.code) console.error('Error code:', error.code);
        return NextResponse.json({
            error: 'Failed to fetch analytics',
            details: error.message
        }, { status: 500 });
    }
}
