import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/businesses — fetch all businesses with optional filters
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('query') || '';
        const category = searchParams.get('category') || '';
        const location = searchParams.get('location') || '';
        const rating = parseFloat(searchParams.get('rating') || '0');
        const priceRange = searchParams.get('priceRange') || '';

        const businesses = await prisma.business.findMany({
            where: {
                AND: [
                    query ? {
                        OR: [
                            { name: { contains: query } },
                            { description: { contains: query } },
                            { category: { contains: query } },
                        ],
                    } : {},
                    category ? { category: { equals: category } } : {},
                    location ? {
                        OR: [
                            { city: { contains: location } },
                            { address: { contains: location } },
                        ],
                    } : {},
                    rating > 0 ? { rating: { gte: rating } } : {},
                    priceRange ? { priceRange: { equals: priceRange } } : {},
                ],
            },
            orderBy: { createdAt: 'desc' },
        });

        // Parse JSON fields
        const parsed = businesses.map((b) => ({
            ...b,
            images: JSON.parse(b.images || '[]'),
            workingHours: JSON.parse(b.workingHours || '[]'),
            location: { latitude: b.latitude, longitude: b.longitude, city: b.city },
            createdAt: b.createdAt.toISOString(),
        }));

        return NextResponse.json(parsed);
    } catch (error: any) {
        console.error('GET /api/businesses error:', error);
        // Log more details if it's a Prisma error
        if (error.code) console.error('Error code:', error.code);
        if (error.meta) console.error('Error meta:', error.meta);

        return NextResponse.json({
            error: 'Failed to fetch businesses',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    }
}

// POST /api/businesses — create a new business
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            name, category, description, phone, email, address,
            location, images, coverImage, workingHours, priceRange,
            featured, verified,
        } = body;

        const business = await prisma.business.create({
            data: {
                name,
                category,
                description,
                phone,
                email,
                address,
                city: location?.city || '',
                latitude: location?.latitude || 0,
                longitude: location?.longitude || 0,
                images: JSON.stringify(images || []),
                coverImage: coverImage || null,
                workingHours: JSON.stringify(workingHours || []),
                priceRange: priceRange || '$$',
                featured: featured || false,
                verified: verified || false,
            },
        });

        return NextResponse.json({
            ...business,
            images: JSON.parse(business.images),
            workingHours: JSON.parse(business.workingHours),
            location: { latitude: business.latitude, longitude: business.longitude, city: business.city },
            createdAt: business.createdAt.toISOString(),
        }, { status: 201 });
    } catch (error: any) {
        console.error('POST /api/businesses error:', error);
        if (error.code) console.error('Error code:', error.code);

        return NextResponse.json({
            error: 'Failed to create business',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    }
}
