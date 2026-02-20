'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, ChevronLeft } from 'lucide-react';
import { isAdminAuthenticated, setAdminAuth } from '@/lib/api';
import { ADMIN_PASSWORD } from '@/lib/constants';
import Logo from '@/components/Logo';

export default function AdminLoginPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isAdminAuthenticated()) {
            router.push('/admin/dashboard');
        }
    }, [router]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        if (password === ADMIN_PASSWORD) {
            setAdminAuth(true);
            router.push('/admin/dashboard');
        } else {
            setError('Incorrect password. Please try again.');
            setPassword('');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center px-4">
            <div className="absolute top-4 left-4">
                <Link href="/" className="flex items-center text-white hover:text-gray-200">
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    Back to Home
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 w-full max-w-md">
                <div className="text-center mb-8">
                    {/* Brand Logo */}
                    <div className="flex justify-center mb-5">
                        <Logo size="xl" linked={false} glow={true} />
                    </div>
                    <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-7 h-7 text-blue-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-1">Admin Login</h1>
                    <p className="text-gray-500 text-sm">Enter your password to access the dashboard</p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                            placeholder="Enter admin password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition font-semibold"
                    >
                        Login
                    </button>
                </form>


            </div>
        </div>
    );
}
