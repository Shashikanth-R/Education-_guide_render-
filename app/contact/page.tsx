'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, ChevronLeft, Send } from 'lucide-react';
import { addContact } from '@/lib/api';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await addContact(formData);
            setSubmitted(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setSubmitted(false), 5000);
        } catch (err: any) {
            console.error('Failed to submit contact:', err);
            setError(err.message || 'Failed to send message. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <Link href="/" className="flex items-center text-blue-600 hover:text-blue-700">
                        <ChevronLeft className="w-5 h-5 mr-1" />
                        Back to Home
                    </Link>
                </div>
            </header>

            <div className="container mx-auto px-4 py-12 max-w-6xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Book your slots now!</h1>
                    <p className="text-xl text-gray-600">Contact Us</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Contact Form */}
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>

                        {submitted && (
                            <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                                Thank you! Your message has been sent successfully.
                            </div>
                        )}

                        {error && (
                            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Email *</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Subject *</label>
                                <input
                                    type="text"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Message *</label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    rows={6}
                                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="w-5 h-5 mr-2" />
                                {loading ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>

                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                                        <Phone className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Mobile No.</h3>
                                        <p className="text-gray-600">1311 5133</p>
                                        <p className="text-gray-600">3352 9555</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                                        <Mail className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Email</h3>
                                        <p className="text-gray-600">Media@educationguide.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
                            <h3 className="text-2xl font-bold mb-4">Book Your Slot Now!</h3>
                            <p className="mb-6 opacity-90">Call us directly or drop us an email — we'd love to have you on board.</p>
                            <a href="tel:13115133" className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition">
                                Call Now
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
