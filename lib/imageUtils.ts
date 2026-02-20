/**
 * Image utility functions for handling image uploads, compression, and validation
 */

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_WIDTH = 800;
const MAX_HEIGHT = 600;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

/**
 * Validate if a file is a valid image and within size limits
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
    if (!file) {
        return { valid: false, error: 'No file provided' };
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
        return { valid: false, error: 'Invalid file type. Please upload JPG, PNG, or WebP images.' };
    }

    if (file.size > MAX_FILE_SIZE) {
        return { valid: false, error: 'File size exceeds 2MB. Please choose a smaller image.' };
    }

    return { valid: true };
}

/**
 * Compress and convert image to base64
 */
export async function compressImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;

                // Calculate new dimensions while maintaining aspect ratio
                if (width > MAX_WIDTH || height > MAX_HEIGHT) {
                    const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
                    width = width * ratio;
                    height = height * ratio;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Failed to get canvas context'));
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);

                // Convert to base64 with compression
                const quality = 0.8; // 80% quality
                const base64 = canvas.toDataURL('image/jpeg', quality);
                resolve(base64);
            };

            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target?.result as string;
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

/**
 * Get a random gradient background as fallback
 */
export function getRandomGradient(): string {
    const gradients = [
        'from-pastel-peach via-pastel-yellow to-pastel-mint',
        'from-pastel-blue via-pastel-lavender to-pastel-pink',
        'from-blue-400 to-purple-500',
        'from-pink-400 to-orange-400',
        'from-green-400 to-blue-500',
        'from-purple-400 to-pink-500',
        'from-yellow-400 to-red-400',
        'from-indigo-400 to-cyan-400',
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
}

/**
 * Create a placeholder image URL (for future use)
 */
export function getPlaceholderImage(text: string): string {
    // This could be replaced with a service like placeholder.com or a local SVG generator
    return `https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=${encodeURIComponent(text)}`;
}
