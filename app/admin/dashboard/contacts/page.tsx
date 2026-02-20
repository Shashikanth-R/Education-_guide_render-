'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Mail, Trash2, Check } from 'lucide-react';
import { isAdminAuthenticated, getAllContacts, markContactAsRead, deleteContact } from '@/lib/api';
import { ContactSubmission } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export default function ContactsPage() {
    const router = useRouter();
    const [contacts, setContacts] = useState<ContactSubmission[]>([]);

    useEffect(() => {
        if (!isAdminAuthenticated()) {
            router.push('/admin');
            return;
        }
        loadContacts();
    }, [router]);

    const loadContacts = async () => {
        const data = await getAllContacts();
        setContacts(data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    };

    const handleMarkRead = async (id: string) => {
        await markContactAsRead(id);
        loadContacts();
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this message?')) {
            await deleteContact(id);
            loadContacts();
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white p-6">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold">LocalBiz Admin</h1>
                </div>
                <Link href="/admin/dashboard" className="flex items-center px-4 py-3 hover:bg-gray-800 rounded-lg transition">
                    <ChevronLeft className="w-5 h-5 mr-3" />
                    Back to Dashboard
                </Link>
            </div>

            {/* Main Content */}
            <div className="ml-64 p-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Contact Messages</h2>
                    <p className="text-gray-600 mt-1">View and manage messages from users</p>
                </div>

                <div className="space-y-4">
                    {contacts.map((contact) => (
                        <div
                            key={contact.id}
                            className={`bg-white rounded-xl shadow-md p-6 ${!contact.read ? 'border-l-4 border-blue-600' : ''}`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-bold text-lg">{contact.name}</h3>
                                        {!contact.read && (
                                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                                New
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                        <div className="flex items-center">
                                            <Mail className="w-4 h-4 mr-1" />
                                            {contact.email}
                                        </div>
                                        <div>{formatDate(contact.date)}</div>
                                    </div>
                                    <div className="font-semibold text-gray-800 mb-2">
                                        Subject: {contact.subject}
                                    </div>
                                    <p className="text-gray-700">{contact.message}</p>
                                </div>

                                <div className="flex gap-2 ml-4">
                                    {!contact.read && (
                                        <button
                                            onClick={() => handleMarkRead(contact.id)}
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                                            title="Mark as Read"
                                        >
                                            <Check className="w-5 h-5" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(contact.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {contacts.length === 0 && (
                        <div className="bg-white rounded-xl shadow-md p-12 text-center">
                            <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-800 mb-2">No Messages</h3>
                            <p className="text-gray-600">No contact submissions yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
