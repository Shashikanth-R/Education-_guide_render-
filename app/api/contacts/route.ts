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
    } catch (error) {
        console.error('GET /api/contacts error:', error);
        return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
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
    } catch (error) {
        console.error('POST /api/contacts error:', error);
        return NextResponse.json({ error: 'Failed to submit contact' }, { status: 500 });
    }
}
