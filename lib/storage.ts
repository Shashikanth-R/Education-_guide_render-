'use client';

import { Business, Review, ContactSubmission, Analytics, SearchFilters } from './types';
import { SAMPLE_BUSINESSES, CATEGORIES } from './constants';
import { generateId } from './utils';

// Storage keys for education guide
const STORAGE_KEYS = {
    BUSINESSES: 'eduguide_schools',
    REVIEWS: 'eduguide_reviews',
    FAVORITES: 'eduguide_favorites',
    CONTACTS: 'eduguide_contacts',
    ADMIN_AUTH: 'eduguide_admin',
    DATA_VERSION: 'eduguide_data_version',
};

// Increment this whenever SAMPLE_BUSINESSES changes to force a refresh
const DATA_VERSION = '4';

// Initialize storage with sample data
export function initializeStorage() {
    if (typeof window === 'undefined') return;

    // If data version changed, clear businesses so fresh data is loaded
    const storedVersion = localStorage.getItem(STORAGE_KEYS.DATA_VERSION);
    if (storedVersion !== DATA_VERSION) {
        localStorage.removeItem(STORAGE_KEYS.BUSINESSES);
        localStorage.setItem(STORAGE_KEYS.DATA_VERSION, DATA_VERSION);
    }

    const existingBusinesses = localStorage.getItem(STORAGE_KEYS.BUSINESSES);
    if (!existingBusinesses) {
        localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(SAMPLE_BUSINESSES));
    }

    if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
        localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify([]));
    }

    if (!localStorage.getItem(STORAGE_KEYS.FAVORITES)) {
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify([]));
    }

    if (!localStorage.getItem(STORAGE_KEYS.CONTACTS)) {
        localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify([]));
    }
}

// Business operations
export function getAllBusinesses(): Business[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.BUSINESSES);
    return data ? JSON.parse(data) : [];
}

export function getBusinessById(id: string): Business | null {
    const businesses = getAllBusinesses();
    return businesses.find((b) => b.id === id) || null;
}

export function addBusiness(business: Omit<Business, 'id' | 'createdAt' | 'viewCount' | 'rating' | 'reviewCount'>): Business {
    const newBusiness: Business = {
        ...business,
        id: generateId(),
        createdAt: new Date().toISOString(),
        viewCount: 0,
        rating: 0,
        reviewCount: 0,
    };

    const businesses = getAllBusinesses();
    businesses.push(newBusiness);
    localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(businesses));
    return newBusiness;
}

export function updateBusiness(id: string, updates: Partial<Business>): Business | null {
    const businesses = getAllBusinesses();
    const index = businesses.findIndex((b) => b.id === id);

    if (index === -1) return null;

    businesses[index] = { ...businesses[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(businesses));
    return businesses[index];
}

export function deleteBusiness(id: string): boolean {
    const businesses = getAllBusinesses();
    const filtered = businesses.filter((b) => b.id !== id);

    if (filtered.length === businesses.length) return false;

    localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(filtered));
    return true;
}

export function incrementViewCount(id: string): void {
    const business = getBusinessById(id);
    if (business) {
        updateBusiness(id, { viewCount: business.viewCount + 1 });
    }
}

export function searchBusinesses(filters: SearchFilters): Business[] {
    let businesses = getAllBusinesses();

    if (filters.query) {
        const query = filters.query.toLowerCase();
        businesses = businesses.filter(
            (b) =>
                b.name.toLowerCase().includes(query) ||
                b.description.toLowerCase().includes(query) ||
                b.category.toLowerCase().includes(query)
        );
    }

    if (filters.category) {
        businesses = businesses.filter((b) => b.category === filters.category);
    }

    if (filters.location) {
        const location = filters.location.toLowerCase();
        businesses = businesses.filter((b) =>
            b.location.city.toLowerCase().includes(location) ||
            b.address.toLowerCase().includes(location)
        );
    }

    if (filters.rating) {
        businesses = businesses.filter((b) => b.rating >= filters.rating!);
    }

    if (filters.priceRange) {
        businesses = businesses.filter((b) => b.priceRange === filters.priceRange);
    }

    return businesses;
}

// Review operations
export function getAllReviews(): Review[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    return data ? JSON.parse(data) : [];
}

export function getReviewsByBusinessId(businessId: string): Review[] {
    return getAllReviews().filter((r) => r.businessId === businessId && r.approved);
}

export function addReview(review: Omit<Review, 'id' | 'date' | 'helpful' | 'approved'>): Review {
    const newReview: Review = {
        ...review,
        id: generateId(),
        date: new Date().toISOString(),
        helpful: 0,
        approved: true, // Auto-approve for demo
    };

    const reviews = getAllReviews();
    reviews.push(newReview);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));

    // Update business rating
    updateBusinessRating(review.businessId);

    return newReview;
}

export function deleteReview(id: string): boolean {
    const reviews = getAllReviews();
    const review = reviews.find((r) => r.id === id);
    const filtered = reviews.filter((r) => r.id !== id);

    if (filtered.length === reviews.length) return false;

    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(filtered));

    // Update business rating
    if (review) updateBusinessRating(review.businessId);

    return true;
}

function updateBusinessRating(businessId: string): void {
    const reviews = getReviewsByBusinessId(businessId);
    const avgRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    updateBusiness(businessId, {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length,
    });
}

// Favorites operations
export function getFavorites(): string[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return data ? JSON.parse(data) : [];
}

export function addToFavorites(businessId: string): void {
    const favorites = getFavorites();
    if (!favorites.includes(businessId)) {
        favorites.push(businessId);
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    }
}

export function removeFromFavorites(businessId: string): void {
    const favorites = getFavorites();
    const filtered = favorites.filter((id) => id !== businessId);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(filtered));
}

export function isFavorite(businessId: string): boolean {
    return getFavorites().includes(businessId);
}

export function getFavoriteBusinesses(): Business[] {
    const favoriteIds = getFavorites();
    const businesses = getAllBusinesses();
    return businesses.filter((b) => favoriteIds.includes(b.id));
}

// Contact submissions
export function getAllContacts(): ContactSubmission[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.CONTACTS);
    return data ? JSON.parse(data) : [];
}

export function addContact(contact: Omit<ContactSubmission, 'id' | 'date' | 'read'>): ContactSubmission {
    const newContact: ContactSubmission = {
        ...contact,
        id: generateId(),
        date: new Date().toISOString(),
        read: false,
    };

    const contacts = getAllContacts();
    contacts.push(newContact);
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
    return newContact;
}

export function markContactAsRead(id: string): void {
    const contacts = getAllContacts();
    const contact = contacts.find((c) => c.id === id);
    if (contact) {
        contact.read = true;
        localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
    }
}

export function deleteContact(id: string): boolean {
    const contacts = getAllContacts();
    const filtered = contacts.filter((c) => c.id !== id);

    if (filtered.length === contacts.length) return false;

    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(filtered));
    return true;
}

// Admin authentication
export function setAdminAuth(isAuthenticated: boolean): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, JSON.stringify(isAuthenticated));
}

export function isAdminAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    const data = localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
    return data ? JSON.parse(data) : false;
}

export function adminLogout(): void {
    setAdminAuth(false);
}

// Analytics
export function getAnalytics(): Analytics {
    const businesses = getAllBusinesses();
    const reviews = getAllReviews();
    const favorites = getFavorites();
    const contacts = getAllContacts();

    // Calculate popular categories
    const categoryCounts: { [key: string]: number } = {};
    businesses.forEach((b) => {
        categoryCounts[b.category] = (categoryCounts[b.category] || 0) + 1;
    });

    const popularCategories = Object.entries(categoryCounts)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    // Get trending businesses (most viewed in last period)
    const trendingBusinesses = [...businesses]
        .sort((a, b) => b.viewCount - a.viewCount)
        .slice(0, 10);

    return {
        totalBusinesses: businesses.length,
        totalReviews: reviews.length,
        totalFavorites: favorites.length,
        totalContacts: contacts.length,
        popularCategories,
        trendingBusinesses,
    };
}

// Get categories with counts
export function getCategoriesWithCounts() {
    const businesses = getAllBusinesses();
    return CATEGORIES.map((category) => ({
        ...category,
        count: businesses.filter((b) => b.category === category.id).length,
    }));
}
