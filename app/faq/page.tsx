'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronDown } from 'lucide-react';
import { FAQ_DATA } from '@/lib/constants';

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

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

            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
                    <p className="text-xl text-gray-600">Find answers to common questions about LocalBiz</p>
                </div>

                <div className="space-y-8">
                    {FAQ_DATA.map((section, sectionIdx) => (
                        <div key={sectionIdx} className="bg-white rounded-xl shadow-lg p-6 mdp-8">
                            <h2 className="text-2xl font-bold mb-6 text-blue-600">{section.category}</h2>
                            <div className="space-y-4">
                                {section.questions.map((faq, idx) => {
                                    const globalIdx = sectionIdx * 100 + idx;
                                    const isOpen = openIndex === globalIdx;

                                    return (
                                        <div key={idx} className="border-b last:border-0 pb-4 last:pb-0">
                                            <button
                                                onClick={() => setOpenIndex(isOpen ? null : globalIdx)}
                                                className="w-full flex items-center justify-between text-left py-3 hover:text-blue-600 transition"
                                            >
                                                <h3 className="font-semibold text-lg pr-4">{faq.question}</h3>
                                                <ChevronDown
                                                    className={`w-5 h-5 flex-shrink-0 transition-transform ${isOpen ? 'transform rotate-180' : ''
                                                        }`}
                                                />
                                            </button>
                                            {isOpen && (
                                                <div className="mt-3 text-gray-600 leading-relaxed">
                                                    {faq.answer}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-center text-white">
                    <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
                    <p className="mb-6 opacity-90">Our team is here to help you.</p>
                    <Link
                        href="/contact"
                        className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition"
                    >
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
}
