import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// PUT /api/contacts/[id] — mark as read
export async function PUT(
    _request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const contact = await prisma.contactSubmission.update({
            where: { id: params.id },
            data: { isRead: true },
        });
        return NextResponse.json({ ...contact, date: contact.createdAt.toISOString(), read: contact.isRead });
    } catch (error) {
        console.error('PUT /api/contacts/[id] error:', error);
        return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 });
    }
}

// DELETE /api/contacts/[id]
export async function DELETE(
    _request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.contactSubmission.delete({ where: { id: params.id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DELETE /api/contacts/[id] error:', error);
        return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 });
    }
}
