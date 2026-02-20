'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { isAdminAuthenticated, getBusinessById, updateBusiness } from '@/lib/api';
import { CATEGORIES, PRICE_RANGES } from '@/lib/constants';
import { validateImageFile, compressImage } from '@/lib/imageUtils';
import { ChevronLeft, Save, Upload, X } from 'lucide-react';

export default function EditBusinessPage() {
    const router = useRouter();
    const params = useParams();
    const businessId = params?.id as string;

    const categories = CATEGORIES;
    const [imagePreview, setImagePreview] = useState<string>('');
    const [imageError, setImageError] = useState<string>('');
    const [isCompressing, setIsCompressing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        priceRange: '$$' as any,
        featured: false,
        verified: false,
        coverImage: '',
    });

    useEffect(() => {
        if (!isAdminAuthenticated()) {
            router.push('/admin');
            return;
        }
        (async () => {
            const business = await getBusinessById(businessId);
            if (!business) {
                alert('School not found!');
                router.push('/admin/dashboard/manage');
                return;
            }
            setFormData({
                name: business.name,
                category: business.category,
                description: business.description,
                phone: business.phone,
                email: business.email,
                address: business.address,
                city: business.location.city,
                priceRange: business.priceRange,
                featured: business.featured,
                verified: business.verified,
                coverImage: business.coverImage || '',
            });
            if (business.coverImage) setImagePreview(business.coverImage);
            setLoading(false);
        })();
    }, [router, businessId]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImageError('');
        const validation = validateImageFile(file);

        if (!validation.valid) {
            setImageError(validation.error || 'Invalid image');
            return;
        }

        try {
            setIsCompressing(true);
            const compressed = await compressImage(file);
            setImagePreview(compressed);
            setFormData({ ...formData, coverImage: compressed });
        } catch (error) {
            setImageError('Failed to process image. Please try another file.');
            console.error(error);
        } finally {
            setIsCompressing(false);
        }
    };

    const removeImage = () => {
        setImagePreview('');
        setFormData({ ...formData, coverImage: '' });
        setImageError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateBusiness(businessId, {
                name: formData.name,
                category: formData.category,
                description: formData.description,
                phone: formData.phone,
                email: formData.email,
                address: formData.address,
                location: {
                    latitude: 12.9716,
                    longitude: 77.5946,
                    city: formData.city,
                },
                coverImage: formData.coverImage || undefined,
                priceRange: formData.priceRange,
                featured: formData.featured,
                verified: formData.verified,
            });
            alert('School/Institution updated successfully!');
            router.push('/admin/dashboard/manage');
        } catch (err) {
            alert('Failed to update school. Please try again.');
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-xl font-semibold text-gray-700">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white p-6">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold">EducationGuide Admin</h1>
                </div>
                <Link href="/admin/dashboard/manage" className="flex items-center px-4 py-3 hover:bg-gray-800 rounded-lg transition">
                    <ChevronLeft className="w-5 h-5 mr-3" />
                    Back to Manage
                </Link>
            </div>

            {/* Main Content */}
            <div className="ml-64 p-8">
                <div className="max-w-4xl">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">Edit School/Institution</h2>
                        <p className="text-gray-600 mt-1">Update the details for this educational institution</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Image Upload Section */}
                            <div>
                                <label className="block text-sm font-medium mb-2">School Cover Image</label>
                                {!imagePreview ? (
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition">
                                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                                        <p className="text-sm text-gray-500 mb-4">JPG, PNG or WebP (max 2MB)</p>
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/jpg,image/png,image/webp"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            id="image-upload"
                                            disabled={isCompressing}
                                        />
                                        <label
                                            htmlFor="image-upload"
                                            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition"
                                        >
                                            {isCompressing ? 'Processing...' : 'Choose Image'}
                                        </label>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-64 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                                {imageError && (
                                    <p className="text-red-500 text-sm mt-2">{imageError}</p>
                                )}
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">School/Institution Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Category *</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Description *</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Phone *</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Email *</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Address *</label>
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">City *</label>
                                    <input
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Fee Range</label>
                                <select
                                    value={formData.priceRange}
                                    onChange={(e) => setFormData({ ...formData, priceRange: e.target.value as any })}
                                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                                >
                                    {PRICE_RANGES.map(range => (
                                        <option key={range.value} value={range.value}>{range.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-6">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.featured}
                                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                        className="w-5 h-5 text-blue-600"
                                    />
                                    <span className="ml-2 font-medium">Featured School</span>
                                </label>

                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.verified}
                                        onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                                        className="w-5 h-5 text-blue-600"
                                    />
                                    <span className="ml-2 font-medium">Verified School</span>
                                </label>
                            </div>

                            <div className="flex gap-4 pt-6">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center"
                                >
                                    <Save className="w-5 h-5 mr-2" />
                                    Update School/Institution
                                </button>
                                <button
                                    type="button"
                                    onClick={() => router.push('/admin/dashboard/manage')}
                                    className="px-8 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
