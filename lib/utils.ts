import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { WorkingHours } from "./types";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// Calculate distance between two coordinates (in km)
export function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Math.round(distance * 10) / 10;
}

// Check if business is currently open
export function isBusinessOpen(workingHours: WorkingHours[]): boolean {
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format

    const todayHours = workingHours.find(
        (hours) => hours.day.toLowerCase() === currentDay.toLowerCase()
    );

    if (!todayHours || todayHours.isClosed) {
        return false;
    }

    return currentTime >= todayHours.open && currentTime <= todayHours.close;
}

// Format working hours for display
export function formatWorkingHours(workingHours: WorkingHours[]): string {
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
    const todayHours = workingHours.find(
        (hours) => hours.day.toLowerCase() === currentDay.toLowerCase()
    );

    if (!todayHours) return 'Hours not available';
    if (todayHours.isClosed) return 'Closed today';

    return `${todayHours.open} - ${todayHours.close}`;
}

// Format phone number
export function formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
        return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    return phone;
}

// Validate email
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Calculate average rating
export function calculateAverageRating(ratings: number[]): number {
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, rating) => acc + rating, 0);
    return Math.round((sum / ratings.length) * 10) / 10;
}

// Format date
export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

// Format relative time (e.g., "2 days ago")
export function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
}

// Generate ID
export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
