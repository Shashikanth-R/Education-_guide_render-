import Link from 'next/link';
import { ChevronLeft, Target, Users, Award } from 'lucide-react';

export default function AboutPage() {
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
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-6">About EducationGuide</h1>
                    <p className="text-xl text-gray-600">
                        Your trusted partner in finding the best educational institutions for your children
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-12">
                    <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                    <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                        <p>
                            EducationGuide was founded with a simple mission: to help parents find the best educational institutions for their children.
                            We understand that choosing a school or kindergarten—whether it's for your toddler's first preschool experience or your child's
                            primary education—is one of the most important decisions you'll make as a parent.
                        </p>
                        <p>
                            That's why we created a platform that makes it easy to discover, compare, and connect with schools and educational centers.
                            Our comprehensive directory features verified institutions, authentic reviews from other parents, and detailed information to help you
                            make confident, informed decisions about your child's education.
                        </p>
                        <p>
                            Today, EducationGuide serves thousands of parents and hundreds of educational institutions, helping communities thrive through better
                            educational choices and stronger connections between schools and families.
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-12">
                    <h2 className="text-3xl font-bold mb-6">Education Guide</h2>
                    <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                        <p>
                            The Education Guide is a flagship publication by <strong>GPH Global Ventures</strong>, under its parent company <strong>Ain Al Khaleej</strong>, dedicated to promoting educational awareness and delivering insightful coverage of schools, universities, and academic institutions across <strong>Bahrain</strong> and the <strong>Kingdom of Saudi Arabia</strong>.
                        </p>
                        <p>
                            Published quarterly in both print and digital formats, the Education Guide has earned a strong reputation as a trusted reference for parents, students, educators, and key decision-makers. Building on the outstanding success of the 2022, 2023, 2024, and 2025 editions, the upcoming <strong>Education Guide 2026</strong> continues this momentum, achieving consistently high readership and engagement.
                        </p>
                        <p>
                            The Guide is strategically distributed among high-income communities, influential stakeholders, and decision-making audiences, with targeted circulation across <strong>Bahrain</strong> and the <strong>KSA Navy Base</strong>, ensuring premium visibility and maximum impact for participating institutions.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Target className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Our Mission</h3>
                        <p className="text-gray-600">
                            To empower parents and educators by connecting them with quality educational institutions through accurate information and genuine reviews from families.
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Our Community</h3>
                        <p className="text-gray-600">
                            Thousands of parents and hundreds of schools working together to build better educational opportunities for children.
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Award className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Our Values</h3>
                        <p className="text-gray-600">
                            Trust, transparency, and community-first approach in everything we do.
                        </p>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-12 text-center text-white">
                    <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
                    <p className="text-lg mb-8 opacity-90">
                        Whether you're looking for the perfect school for your child or want to list your institution, we're here to help.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/search" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition">
                            Browse Schools
                        </Link>
                        <Link href="/contact" className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
