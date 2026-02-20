/**
 * lib/api.ts
 * Async API client — replaces localStorage-based storage.ts
 * All functions call the Next.js API routes which connect to MySQL.
 */

import { Business, Review, ContactSubmission, Analytics, SearchFilters } from './types';

const BASE = '';

// ─── Businesses ────────────────────────────────────────────────────────────

export async function getAllBusinesses(): Promise<Business[]> {
    try {
        const res = await fetch(`${BASE}/api/businesses`);
        if (!res.ok) return [];
        return res.json();
    } catch {
        return [];
    }
}

export async function searchBusinesses(filters: SearchFilters): Promise<Business[]> {
    try {
        const params = new URLSearchParams();
        if (filters.query) params.set('query', filters.query);
        if (filters.category) params.set('category', filters.category);
        if (filters.location) params.set('location', filters.location);
        if (filters.rating) params.set('rating', filters.rating.toString());
        if (filters.priceRange) params.set('priceRange', filters.priceRange);

        const res = await fetch(`${BASE}/api/businesses?${params.toString()}`);
        if (!res.ok) return [];
        return res.json();
    } catch {
        return [];
    }
}

export async function getBusinessById(id: string): Promise<Business | null> {
    try {
        const res = await fetch(`${BASE}/api/businesses/${id}`);
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

export async function addBusiness(
    business: Omit<Business, 'id' | 'createdAt' | 'viewCount' | 'rating' | 'reviewCount'>
): Promise<Business> {
    const res = await fetch(`${BASE}/api/businesses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(business),
    });
    if (!res.ok) throw new Error('Failed to add business');
    return res.json();
}

export async function updateBusiness(id: string, updates: Partial<Business>): Promise<Business | null> {
    const res = await fetch(`${BASE}/api/businesses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Failed to update business');
    return res.json();
}

export async function deleteBusiness(id: string): Promise<boolean> {
    const res = await fetch(`${BASE}/api/businesses/${id}`, { method: 'DELETE' });
    return res.ok;
}

export async function incrementViewCount(id: string): Promise<void> {
    const business = await getBusinessById(id);
    if (business) {
        await updateBusiness(id, { viewCount: business.viewCount + 1 });
    }
}

// ─── Reviews ────────────────────────────────────────────────────────────────

export async function getAllReviews(): Promise<Review[]> {
    const res = await fetch(`${BASE}/api/reviews`);
    if (!res.ok) throw new Error('Failed to fetch reviews');
    return res.json();
}

export async function getReviewsByBusinessId(businessId: string): Promise<Review[]> {
    const res = await fetch(`${BASE}/api/reviews?businessId=${businessId}`);
    if (!res.ok) throw new Error('Failed to fetch reviews');
    return res.json();
}

export async function addReview(
    review: Omit<Review, 'id' | 'date' | 'helpful' | 'approved'>
): Promise<Review> {
    const res = await fetch(`${BASE}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review),
    });
    if (!res.ok) throw new Error('Failed to add review');
    return res.json();
}

export async function deleteReview(id: string): Promise<boolean> {
    const res = await fetch(`${BASE}/api/reviews/${id}`, { method: 'DELETE' });
    return res.ok;
}

// ─── Contacts ───────────────────────────────────────────────────────────────

export async function getAllContacts(): Promise<ContactSubmission[]> {
    const res = await fetch(`${BASE}/api/contacts`);
    if (!res.ok) throw new Error('Failed to fetch contacts');
    return res.json();
}

export async function addContact(
    contact: Omit<ContactSubmission, 'id' | 'date' | 'read'>
): Promise<ContactSubmission> {
    const res = await fetch(`${BASE}/api/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact),
    });
    if (!res.ok) throw new Error('Failed to submit contact');
    return res.json();
}

export async function markContactAsRead(id: string): Promise<void> {
    await fetch(`${BASE}/api/contacts/${id}`, { method: 'PUT' });
}

export async function deleteContact(id: string): Promise<boolean> {
    const res = await fetch(`${BASE}/api/contacts/${id}`, { method: 'DELETE' });
    return res.ok;
}

// ─── Analytics ──────────────────────────────────────────────────────────────

export async function getAnalytics(): Promise<Analytics> {
    try {
        const res = await fetch(`${BASE}/api/analytics`);
        if (!res.ok) return { totalBusinesses: 0, totalReviews: 0, totalContacts: 0, popularCategories: [], trendingBusinesses: [] } as any;
        return res.json();
    } catch {
        return { totalBusinesses: 0, totalReviews: 0, totalContacts: 0, popularCategories: [], trendingBusinesses: [] } as any;
    }
}

// ─── Favorites (kept in localStorage — user-specific) ──────────────────────

export function getFavorites(): string[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem('eduguide_favorites');
    return data ? JSON.parse(data) : [];
}

export function addToFavorites(businessId: string): void {
    const favorites = getFavorites();
    if (!favorites.includes(businessId)) {
        favorites.push(businessId);
        localStorage.setItem('eduguide_favorites', JSON.stringify(favorites));
    }
}

export function removeFromFavorites(businessId: string): void {
    const favorites = getFavorites().filter((id) => id !== businessId);
    localStorage.setItem('eduguide_favorites', JSON.stringify(favorites));
}

export function isFavorite(businessId: string): boolean {
    return getFavorites().includes(businessId);
}

export async function getFavoriteBusinesses(): Promise<Business[]> {
    const favoriteIds = getFavorites();
    if (favoriteIds.length === 0) return [];
    const all = await getAllBusinesses();
    return all.filter((b) => favoriteIds.includes(b.id));
}

// ─── Admin Auth (kept in localStorage — session only) ──────────────────────

export function setAdminAuth(isAuthenticated: boolean): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('eduguide_admin', JSON.stringify(isAuthenticated));
}

export function isAdminAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    const data = localStorage.getItem('eduguide_admin');
    return data ? JSON.parse(data) : false;
}

export function adminLogout(): void {
    setAdminAuth(false);
}
