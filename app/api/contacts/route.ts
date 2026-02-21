import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET /api/contacts
export async function GET() {
    try {
        const contacts = await prisma.contactSubmission.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(
            contacts.map((c) => ({
                ...c,
                date: c.createdAt.toISOString(),
                read: c.isRead,
            }))
        );
    } catch (error: any) {
        console.error('GET /api/contacts error:', error);
        if (error.code) console.error('Error code:', error.code);
        return NextResponse.json({
            error: 'Failed to fetch contacts',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    }
}

// POST /api/contacts
export async function POST(request: NextRequest) {
    try {
        const { name, email, subject, message } = await request.json();

        const contact = await prisma.contactSubmission.create({
            data: { name, email, subject, message },
        });

        return NextResponse.json(
            { ...contact, date: contact.createdAt.toISOString(), read: contact.isRead },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('POST /api/contacts error:', error);
        if (error.code) console.error('Error code:', error.code);
        return NextResponse.json({
            error: 'Failed to submit contact',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    }
}
