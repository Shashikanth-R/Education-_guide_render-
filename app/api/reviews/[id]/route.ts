import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// DELETE /api/reviews/[id]
export async function DELETE(
    _request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const review = await prisma.review.findUnique({ where: { id: params.id } });
        if (!review) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        await prisma.review.delete({ where: { id: params.id } });

        // Recalculate business rating
        const reviews = await prisma.review.findMany({
            where: { businessId: review.businessId, approved: true },
        });
        const avgRating =
            reviews.length > 0
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                : 0;

        await prisma.business.update({
            where: { id: review.businessId },
            data: {
                rating: Math.round(avgRating * 10) / 10,
                reviewCount: reviews.length,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DELETE /api/reviews/[id] error:', error);
        return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
    }
}
