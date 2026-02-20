'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
    id: number;
    type: 'ad' | 'category';
    title: string;
    subtitle: string;
    description: string;
    cta: string;
    ctaLink: string;
    gradient: string;
    emoji: string;
    badge?: string;
}

const SLIDES: Slide[] = [
    {
        id: 1,
        type: 'ad',
        title: 'Find the Perfect School',
        subtitle: 'for Your Child',
        description: 'Explore 1,000+ verified schools, kindergartens, and educational institutions across Bahrain.',
        cta: 'Start Exploring',
        ctaLink: '/search',
        gradient: 'from-[#0099FF] via-[#6C63FF] to-[#E91E63]',
        emoji: '🎓',
        badge: 'Trusted by 10,000+ Families',
    },
    {
        id: 2,
        type: 'category',
        title: 'Kindergartens',
        subtitle: '& Pre-Schools',
        description: 'Give your child the best start with our curated list of top kindergartens and nurseries in Bahrain.',
        cta: 'Browse Kindergartens',
        ctaLink: '/search?category=kindergartens',
        gradient: 'from-[#FF6B6B] via-[#FF8E53] to-[#FFC107]',
        emoji: '👶',
        badge: '244+ Listed',
    },
    {
        id: 3,
        type: 'category',
        title: 'Private Schools',
        subtitle: 'Top Rated',
        description: 'Discover the best private schools offering world-class education and modern facilities.',
        cta: 'Browse Private Schools',
        ctaLink: '/search?category=private-schools',
        gradient: 'from-[#11998e] via-[#38ef7d] to-[#11998e]',
        emoji: '🏫',
        badge: '200+ Schools',
    },
    {
        id: 4,
        type: 'category',
        title: 'British Curriculum',
        subtitle: 'International Schools',
        description: 'Find schools following the British curriculum — offering IGCSE, A-Levels, and more.',
        cta: 'Browse British Schools',
        ctaLink: '/search?category=british-curriculum',
        gradient: 'from-[#1a1a2e] via-[#16213e] to-[#0f3460]',
        emoji: '🇬🇧',
        badge: '30+ Schools',
    },
    {
        id: 5,
        type: 'category',
        title: 'Universities',
        subtitle: '& Higher Education',
        description: 'Explore top universities and colleges in Bahrain for undergraduate and postgraduate programs.',
        cta: 'Browse Universities',
        ctaLink: '/search?category=universities',
        gradient: 'from-[#8360c3] via-[#2ebf91] to-[#8360c3]',
        emoji: '🎓',
        badge: '28+ Institutions',
    },
    {
        id: 6,
        type: 'ad',
        title: 'List Your Institution',
        subtitle: 'Reach More Families',
        description: 'Get your school or educational center listed on EducationGuide and connect with thousands of parents.',
        cta: 'Contact Us Today',
        ctaLink: '/contact',
        gradient: 'from-[#E91E63] via-[#9C27B0] to-[#673AB7]',
        emoji: '📢',
        badge: 'Free Listing Available',
    },
    {
        id: 7,
        type: 'category',
        title: 'Special Education',
        subtitle: 'Centers & Therapy',
        description: 'Find specialized education centers, therapy clinics, and support services for children with special needs.',
        cta: 'Browse Centers',
        ctaLink: '/search?category=special-education',
        gradient: 'from-[#f7971e] via-[#ffd200] to-[#f7971e]',
        emoji: '💛',
        badge: '18+ Centers',
    },
    {
        id: 8,
        type: 'category',
        title: 'Sports Facilities',
        subtitle: '& Academies',
        description: 'Discover sports academies, clubs, and facilities to keep your child active and healthy.',
        cta: 'Browse Sports',
        ctaLink: '/search?category=sports-facilities',
        gradient: 'from-[#00b09b] via-[#96c93d] to-[#00b09b]',
        emoji: '⚽',
        badge: '50+ Facilities',
    },
];

export default function HeroSlider() {
    const [current, setCurrent] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [direction, setDirection] = useState<'left' | 'right'>('right');

    const goTo = useCallback((index: number, dir: 'left' | 'right' = 'right') => {
        if (isAnimating) return;
        setIsAnimating(true);
        setDirection(dir);
        setTimeout(() => {
            setCurrent(index);
            setIsAnimating(false);
        }, 400);
    }, [isAnimating]);

    const next = useCallback(() => {
        goTo((current + 1) % SLIDES.length, 'right');
    }, [current, goTo]);

    const prev = useCallback(() => {
        goTo((current - 1 + SLIDES.length) % SLIDES.length, 'left');
    }, [current, goTo]);

    // Auto-play every 5 seconds
    useEffect(() => {
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, [next]);

    const slide = SLIDES[current];

    return (
        <div className="relative w-full overflow-hidden" style={{ height: '520px' }}>
            {/* Slide Background */}
            <div
                className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} transition-all duration-700`}
            />

            {/* Animated pattern overlay */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
            </div>

            {/* Slide Content */}
            <div
                className={`absolute inset-0 flex items-center justify-center px-8 transition-all duration-400 ${isAnimating
                        ? direction === 'right'
                            ? 'opacity-0 translate-x-8'
                            : 'opacity-0 -translate-x-8'
                        : 'opacity-100 translate-x-0'
                    }`}
                style={{ transition: 'opacity 0.4s ease, transform 0.4s ease' }}
            >
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        {/* Text Content */}
                        <div className="text-white max-w-2xl text-center md:text-left">
                            {slide.badge && (
                                <div className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-4 border border-white/30">
                                    ✨ {slide.badge}
                                </div>
                            )}
                            <h2 className="text-4xl md:text-6xl font-extrabold leading-tight mb-2 drop-shadow-lg">
                                {slide.title}
                            </h2>
                            <h3 className="text-2xl md:text-4xl font-bold text-white/80 mb-4">
                                {slide.subtitle}
                            </h3>
                            <p className="text-lg text-white/90 mb-8 max-w-lg leading-relaxed">
                                {slide.description}
                            </p>
                            <Link
                                href={slide.ctaLink}
                                className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-8 py-4 rounded-2xl shadow-2xl hover:shadow-white/30 hover:scale-105 transition-all duration-300 text-lg"
                            >
                                {slide.cta}
                                <ChevronRight className="w-5 h-5" />
                            </Link>
                        </div>

                        {/* Emoji / Icon */}
                        <div className="hidden md:flex items-center justify-center">
                            <div className="text-[160px] leading-none drop-shadow-2xl select-none animate-bounce-slow">
                                {slide.emoji}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Prev / Next Buttons */}
            <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-200 hover:scale-110 z-10 border border-white/30"
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-200 hover:scale-110 z-10 border border-white/30"
                aria-label="Next slide"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {SLIDES.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i, i > current ? 'right' : 'left')}
                        className={`transition-all duration-300 rounded-full ${i === current
                                ? 'w-8 h-3 bg-white'
                                : 'w-3 h-3 bg-white/40 hover:bg-white/70'
                            }`}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>

            {/* Slide counter */}
            <div className="absolute top-4 right-16 bg-black/20 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full border border-white/20">
                {current + 1} / {SLIDES.length}
            </div>
        </div>
    );
}
