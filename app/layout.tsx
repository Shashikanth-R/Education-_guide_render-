import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'EducationGuide - Find the Best Schools & Educational Institutions Near You',
    description: 'Discover top-rated schools, kindergartens, preschools, and educational centers in your area. Read reviews, check facilities, and make informed decisions for your child\'s education.',
    keywords: 'schools, kindergartens, preschools, education, educational institutions, student reviews, school ratings, best schools',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    );
}
