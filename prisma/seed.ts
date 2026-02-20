import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Map filenames to category IDs
const CATEGORY_MAP: Record<string, string> = {
    'Amusement_Centers_and_Parks.json': 'amusement-parks',
    'Art,_Dance_and_Music.json': 'arts-music',
    'Book_Shop.json': 'book-shops',
    'British_Curriculum.json': 'british-curriculum',
    'CCTV_and_Security.json': 'cctv-security',
    'Child_Clinics_and_Hosp.json': 'child-clinics',
    'Directorates.json': 'directorates',
    'Govt_Schools.json': 'govt-schools',
    'Insti_and_Edu_Centers.json': 'education-centers',
    'KGs.json': 'kindergartens',
    'Language_Training.json': 'language-training',
    'Private_School.json': 'private-schools',
    'Resources_Centers.json': 'resource-centers',
    'Special_Education.json': 'special-education',
    'Sports_Facilities.json': 'sports-facilities',
    'Stationery.json': 'stationery',
    'Uniforms.json': 'uniforms',
    'Universities.json': 'universities',
    'computer_suppliers.json': 'computer-suppliers',
};

// Per-file field mappings for files with unusual formats
// Format: { nameField, phoneField, areaField }
const FILE_FIELD_MAP: Record<string, { nameField: string; phoneField?: string; areaField?: string }> = {
    // Standard files with explicit name column matching category
    'British_Curriculum.json': { nameField: 'British Curriculum', areaField: 'Area' },
    'Directorates.json': { nameField: 'Directorates', areaField: 'Area' },
    'Govt_Schools.json': { nameField: 'Government Schools', areaField: 'Area' },
    'Insti_and_Edu_Centers.json': { nameField: 'Training Institutes and Educational Centers', areaField: 'Area' },
    'Language_Training.json': { nameField: 'Language Training', areaField: 'Area' },
    'Resources_Centers.json': { nameField: 'Resources Centers', areaField: 'Area' },
    'Universities.json': { nameField: 'Universities', areaField: 'Area' },
    'Amusement_Centers_and_Parks.json': { nameField: 'Amusement Centers & Parks', areaField: 'Area' },
    'Sports_Facilities.json': { nameField: 'Sports & Games Training Facilities', areaField: 'Area' },
    // KG/Private use same key
    'KGs.json': { nameField: 'Kindergartens & Pre-Schools', areaField: 'Area' },
    'Private_School.json': { nameField: 'Kindergartens & Pre-Schools', areaField: 'Area' },
    // Special Education uses 'Special Education School'
    'Special_Education.json': { nameField: 'Special Education School', phoneField: 'nan', areaField: 'nan_1' },
    // "nan-format" files: name=nan, phone=nan_1, area=nan_2
    'Art,_Dance_and_Music.json': { nameField: 'nan', phoneField: 'nan_1', areaField: 'nan_2' },
    'Book_Shop.json': { nameField: 'nan', phoneField: 'nan_1', areaField: 'nan_2' },
    'CCTV_and_Security.json': { nameField: 'nan', phoneField: 'nan_1', areaField: 'nan_2' },
    'Stationery.json': { nameField: 'nan', phoneField: 'nan_1', areaField: 'nan_2' },
    'Uniforms.json': { nameField: 'nan', phoneField: 'nan_1', areaField: 'nan_2' },
    'computer_suppliers.json': { nameField: 'nan', phoneField: 'nan_1', areaField: 'nan_2' },
    // Child Clinics: column headers are first-row values from original Excel
    // Name column = 'Al Hilal Multi Specialty Medical Center'
    // Phone column = '17824444' (numeric key)
    // Area column = 'Manama' (place-name key — value is the actual city)
    'Child_Clinics_and_Hosp.json': { nameField: 'Al Hilal Multi Specialty Medical Center', phoneField: '17824444', areaField: 'Manama' },
};

function extractField(item: Record<string, unknown>, fieldKey: string | undefined, fallbackKeys: string[] = []): string {
    if (fieldKey) {
        const val = item[fieldKey];
        if (val !== undefined && val !== null && String(val).trim() !== '') {
            return String(val).trim();
        }
    }
    for (const key of fallbackKeys) {
        const val = item[key];
        if (val !== undefined && val !== null && String(val).trim() !== '') {
            return String(val).trim();
        }
    }
    return '';
}

function cleanPhone(raw: string): string {
    // Remove trailing .0 from numeric-string phones like "17820301.0"
    return raw.replace(/\.0$/, '').replace(/\s+/g, '');
}

async function main() {
    console.log('🌱 Starting database seed from data/ directory...');

    await prisma.review.deleteMany();
    await prisma.business.deleteMany();
    console.log('🧹 Cleared existing data');

    const dataDir = path.join(process.cwd(), 'data');
    const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.json'));

    let totalCount = 0;
    let skippedCount = 0;

    for (const file of files) {
        console.log(`📂 Processing ${file}...`);
        const filePath = path.join(dataDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(fileContent);

        const contentKey = Object.keys(jsonData)[0];
        const items: Record<string, unknown>[] = Array.isArray(jsonData) ? jsonData : jsonData[contentKey];

        if (!Array.isArray(items)) {
            console.warn(`⚠️ Skipping ${file}: no array found`);
            continue;
        }

        const categoryId = CATEGORY_MAP[file] || 'education-centers';
        const fieldMap = FILE_FIELD_MAP[file];
        let fileCount = 0;

        for (const item of items) {
            // --- Extract name ---
            const name = fieldMap
                ? extractField(item, fieldMap.nameField)
                : extractField(item, 'Name', ['Institute Name', 'Center Name', 'School Name', 'Shop Name']);

            // Skip empty / blank rows
            if (!name || name.trim().length < 2) {
                skippedCount++;
                continue;
            }

            // --- Extract phone ---
            let phone = '';
            if (fieldMap?.phoneField) {
                phone = cleanPhone(extractField(item, fieldMap.phoneField, ['Telephone', 'Phone']));
            } else {
                phone = cleanPhone(extractField(item, 'Telephone', ['Phone', 'Contact', 'Mobile']));
            }

            // --- Extract area ---
            const city = fieldMap?.areaField
                ? extractField(item, fieldMap.areaField, ['Area'])
                : extractField(item, 'Area') || 'Bahrain';

            const email = String(item['Email'] || item['E-mail'] || '').toLowerCase().trim();
            const address = String(item['Address'] || item['Location'] || '').trim();

            await prisma.business.create({
                data: {
                    name: name.trim(),
                    category: categoryId,
                    description: `${name.trim()} is a ${categoryId.replace(/-/g, ' ')} located in ${city || 'Bahrain'}.`,
                    phone: phone,
                    email: email,
                    address: address,
                    city: city || 'Bahrain',
                    latitude: 26.2 + (Math.random() * 0.1),
                    longitude: 50.5 + (Math.random() * 0.1),
                    images: '[]',
                    workingHours: '[]',
                    priceRange: '$$',
                    featured: false,
                    verified: true,
                    rating: 0,
                    reviewCount: 0,
                    viewCount: 0,
                },
            });
            fileCount++;
            totalCount++;
        }

        console.log(`   ✅ Added ${fileCount} records from ${file}`);
    }

    console.log(`\n✅ Seeded ${totalCount} businesses from ${files.length} files`);
    console.log(`⏭️ Skipped ${skippedCount} empty/blank rows`);
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
