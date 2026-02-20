export interface WorkingHours {
    day: string;
    open: string;
    close: string;
    isClosed: boolean;
}

export interface Business {
    id: string;
    name: string;
    category: string;
    description: string;
    phone: string;
    email: string;
    address: string;
    location: {
        latitude: number;
        longitude: number;
        city: string;
    };
    images: string[];
    coverImage?: string; // Base64 encoded image or URL
    workingHours: WorkingHours[];
    priceRange: '$' | '$$' | '$$$' | '$$$$';
    featured: boolean;
    verified: boolean;
    rating: number;
    reviewCount: number;
    createdAt: string;
    viewCount: number;
}

export interface Category {
    id: string;
    name: string;
    icon: string;
    description: string;
    count: number;
    image?: string; // Optional background image path (from /public)
}

export interface Review {
    id: string;
    businessId: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
    helpful: number;
    approved: boolean;
}

export interface ContactSubmission {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    date: string;
    read: boolean;
}

export interface AdminUser {
    username: string;
    isAuthenticated: boolean;
}

export interface SearchFilters {
    category?: string;
    location?: string;
    rating?: number;
    priceRange?: string;
    openNow?: boolean;
    query?: string;
}

export interface Analytics {
    totalBusinesses: number;
    totalReviews: number;
    totalFavorites: number;
    totalContacts: number;
    popularCategories: { category: string; count: number }[];
    trendingBusinesses: Business[];
}
