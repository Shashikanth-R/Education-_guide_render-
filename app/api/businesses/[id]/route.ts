import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET /api/businesses/[id]
export async function GET(
    _request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const business = await prisma.business.findUnique({ where: { id: params.id } });
        if (!business) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        return NextResponse.json({
            ...business,
            images: JSON.parse(business.images || '[]'),
            workingHours: JSON.parse(business.workingHours || '[]'),
            location: { latitude: business.latitude, longitude: business.longitude, city: business.city },
            createdAt: business.createdAt.toISOString(),
        });
    } catch (error) {
        console.error('GET /api/businesses/[id] error:', error);
        return NextResponse.json({ error: 'Failed to fetch business' }, { status: 500 });
    }
}

// PUT /api/businesses/[id]
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const {
            name, category, description, phone, email, address,
            location, images, coverImage, workingHours, priceRange,
            featured, verified, rating, reviewCount, viewCount,
        } = body;

        const updated = await prisma.business.update({
            where: { id: params.id },
            data: {
                ...(name !== undefined && { name }),
                ...(category !== undefined && { category }),
                ...(description !== undefined && { description }),
                ...(phone !== undefined && { phone }),
                ...(email !== undefined && { email }),
                ...(address !== undefined && { address }),
                ...(location?.city !== undefined && { city: location.city }),
                ...(location?.latitude !== undefined && { latitude: location.latitude }),
                ...(location?.longitude !== undefined && { longitude: location.longitude }),
                ...(images !== undefined && { images: JSON.stringify(images) }),
                ...(coverImage !== undefined && { coverImage }),
                ...(workingHours !== undefined && { workingHours: JSON.stringify(workingHours) }),
                ...(priceRange !== undefined && { priceRange }),
                ...(featured !== undefined && { featured }),
                ...(verified !== undefined && { verified }),
                ...(rating !== undefined && { rating }),
                ...(reviewCount !== undefined && { reviewCount }),
                ...(viewCount !== undefined && { viewCount }),
            },
        });

        return NextResponse.json({
            ...updated,
            images: JSON.parse(updated.images || '[]'),
            workingHours: JSON.parse(updated.workingHours || '[]'),
            location: { latitude: updated.latitude, longitude: updated.longitude, city: updated.city },
            createdAt: updated.createdAt.toISOString(),
        });
    } catch (error) {
        console.error('PUT /api/businesses/[id] error:', error);
        return NextResponse.json({ error: 'Failed to update business' }, { status: 500 });
    }
}

// DELETE /api/businesses/[id]
export async function DELETE(
    _request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.business.delete({ where: { id: params.id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DELETE /api/businesses/[id] error:', error);
        return NextResponse.json({ error: 'Failed to delete business' }, { status: 500 });
    }
}
