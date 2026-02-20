import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET /api/reviews
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const businessId = searchParams.get('businessId');

        const reviews = await prisma.review.findMany({
            where: {
                ...(businessId ? { businessId } : {}),
                approved: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(
            reviews.map((r) => ({
                ...r,
                date: r.createdAt.toISOString(),
            }))
        );
    } catch (error) {
        console.error('GET /api/reviews error:', error);
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
}

// POST /api/reviews
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { businessId, userName, rating, comment } = body;

        const review = await prisma.review.create({
            data: {
                businessId,
                userName,
                rating: parseInt(rating),
                comment,
                approved: true,
            },
        });

        // Update business rating
        const reviews = await prisma.review.findMany({
            where: { businessId, approved: true },
        });
        const avgRating =
            reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

        await prisma.business.update({
            where: { id: businessId },
            data: {
                rating: Math.round(avgRating * 10) / 10,
                reviewCount: reviews.length,
            },
        });

        return NextResponse.json({ ...review, date: review.createdAt.toISOString() }, { status: 201 });
    } catch (error) {
        console.error('POST /api/reviews error:', error);
        return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
    }
}
