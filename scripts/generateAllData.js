const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const constantsPath = path.join(__dirname, '..', 'lib', 'constants.ts');

// ─── Area → [lat, lng] for Bahrain ───────────────────────────────────────────
const areaCoords = {
    'Manama': [26.2235, 50.5860], 'Central': [26.19, 50.53],
    'Hamad Town': [26.1148, 50.5080], 'North': [26.15, 50.48],
    'Rifaa': [26.1296, 50.555], 'Riffa': [26.1296, 50.555],
    'Muharaq': [26.2672, 50.6097], 'Muharraq': [26.2672, 50.6097],
    'Sitraa': [26.15, 50.57], 'Sitra': [26.15, 50.57],
    'Jad Hafs': [26.21, 50.54], 'Western': [26.17, 50.45],
    'Isa Town': [26.17, 50.55], 'IsaTown': [26.17, 50.55],
    'Isa town': [26.17, 50.55], 'North Riffa': [26.14, 50.56],
    'Salmabad': [26.16, 50.58], 'Diyar': [26.28, 50.62],
    'Diyar Al Muharraq': [26.28, 50.62], 'Hamala': [26.18, 50.46],
    'Adliya': [26.21, 50.59], 'Budaiya': [26.20, 50.44],
    'Saar': [26.19, 50.47], 'Hidd': [26.25, 50.65],
    'Juffair': [26.21, 50.60], 'Busaiteen': [26.26, 50.63],
    'Sanabis': [26.22, 50.55], 'Galali': [26.27, 50.64],
    'Janabiya': [26.18, 50.48], 'Aali': [26.16, 50.53],
    'Sanad': [26.18, 50.56], 'Bilad Al Qadeem': [26.20, 50.55],
    'Zinj': [26.21, 50.57], 'Gufool': [26.22, 50.58],
    'Um al Hassam': [26.21, 50.57], 'Umm Al Hassam': [26.21, 50.57],
    'West Riffa': [26.13, 50.55], 'Jablat Hebshi': [26.20, 50.55],
    'Nuwaidrat': [26.15, 50.56], 'Salmaniya': [26.21, 50.58],
    'Seef': [26.24, 50.56], 'Amwaj': [26.28, 50.63],
    'Tubli': [26.19, 50.58], 'Zallaq': [26.07, 50.47],
    'Sakhir': [26.04, 50.55], 'Sakheer': [26.04, 50.55],
    'Arad': [26.25, 50.63], 'Abu Saiba': [26.20, 50.47],
    'Buri': [26.15, 50.57], 'Riffa AlShamali': [26.14, 50.56],
    'East Riffa': [26.13, 50.57], 'Eker': [26.15, 50.57],
    'Hamad town': [26.1148, 50.5080], 'Janabia': [26.18, 50.48],
    'Dar Kulaib': [26.17, 50.50], 'Malikiyah': [26.26, 50.47],
};

function getCoords(area) {
    if (!area) return [26.2235, 50.5860];
    const t = area.trim();
    return areaCoords[t] || [26.2235, 50.5860];
}

// Escape a string for use inside single-quoted TypeScript string literals
function esc(str) {
    return (str || '').toString().replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/[\r\n]+/g, ' ').trim();
}

// ─── File → category mapping ──────────────────────────────────────────────────
const FILE_MAP = [
    {
        file: 'KGs.json',
        categoryId: 'kindergartens',
        categoryName: 'Kindergartens',
        icon: '👶',
        description: 'Kindergartens and early childhood education centers',
        rootKey: "KG's",
        nameField: 'Kindergartens & Pre-Schools',
    },
    {
        file: 'Private_School.json',
        categoryId: 'private-schools',
        categoryName: 'Private Schools',
        icon: '🏫',
        description: 'Private schools offering quality education in Bahrain',
        rootKey: 'Private School',
        nameField: 'Kindergartens & Pre-Schools',
    },
    {
        file: 'British_Curriculum.json',
        categoryId: 'british-curriculum',
        categoryName: 'British Curriculum',
        icon: '🇬🇧',
        description: 'Schools following the British curriculum',
        rootKey: 'British Curriculum',
        nameField: 'British Curriculum',
    },
    {
        file: 'Govt_Schools.json',
        categoryId: 'govt-schools',
        categoryName: 'Government Schools',
        icon: '🏛️',
        description: 'Government schools across Bahrain',
        rootKey: 'Govt. Schools',
        nameField: 'Government Schools',
    },
    {
        file: 'Universities.json',
        categoryId: 'universities',
        categoryName: 'Universities & Colleges',
        icon: '🎓',
        description: 'Universities and higher education institutions',
        rootKey: 'Universities',
        nameField: 'Universities',
    },
    {
        file: 'Insti_and_Edu_Centers.json',
        categoryId: 'education-centers',
        categoryName: 'Institutes & Education Centers',
        icon: '📚',
        description: 'Training institutes and education centers',
        rootKey: null, // will auto-detect
        nameField: null,
    },
    {
        file: 'Special_Education.json',
        categoryId: 'special-education',
        categoryName: 'Special Education',
        icon: '💛',
        description: 'Special education schools and therapy centers',
        rootKey: 'Special Education',
        nameField: 'Special Education School',
        phoneField: 'nan',
        areaField: 'nan_1',
    },
    {
        file: 'Language_Training.json',
        categoryId: 'language-training',
        categoryName: 'Language Training',
        icon: '🗣️',
        description: 'Language training and learning centers',
        rootKey: null,
        nameField: null,
    },
    {
        file: 'Art,_Dance_and_Music.json',
        categoryId: 'arts-music',
        categoryName: 'Art, Dance & Music',
        icon: '🎨',
        description: 'Art, dance, and music schools and studios',
        rootKey: null,
        nameField: null,
    },
    {
        file: 'Sports_Facilities.json',
        categoryId: 'sports-facilities',
        categoryName: 'Sports Facilities',
        icon: '⚽',
        description: 'Sports facilities, clubs, and academies',
        rootKey: null,
        nameField: null,
    },
    {
        file: 'Amusement_Centers_and_Parks.json',
        categoryId: 'amusement-parks',
        categoryName: 'Amusement Centers & Parks',
        icon: '🎡',
        description: 'Amusement centers, parks, and entertainment venues',
        rootKey: 'Amusement Centers & Parks',
        nameField: 'Amusement Centers & Parks',
    },
    {
        file: 'Child_Clinics_and_Hosp.json',
        categoryId: 'child-clinics',
        categoryName: 'Child Clinics & Hospitals',
        icon: '🏥',
        description: 'Pediatric clinics and children\'s hospitals',
        rootKey: null,
        nameField: null,
    },
    {
        file: 'Resources_Centers.json',
        categoryId: 'resource-centers',
        categoryName: 'Resource Centers',
        icon: '📖',
        description: 'Educational resource and support centers',
        rootKey: null,
        nameField: null,
    },
    {
        file: 'Directorates.json',
        categoryId: 'directorates',
        categoryName: 'Directorates',
        icon: '🏢',
        description: 'Educational directorates and government bodies',
        rootKey: null,
        nameField: null,
    },
    {
        file: 'CCTV_and_Security.json',
        categoryId: 'cctv-security',
        categoryName: 'CCTV & Security',
        icon: '📷',
        description: 'CCTV and security system providers',
        rootKey: null,
        nameField: null,
    },
    {
        file: 'Book_Shop.json',
        categoryId: 'book-shops',
        categoryName: 'Book Shops',
        icon: '📕',
        description: 'Book shops and educational bookstores',
        rootKey: null,
        nameField: null,
    },
    {
        file: 'Stationery.json',
        categoryId: 'stationery',
        categoryName: 'Stationery',
        icon: '✏️',
        description: 'Stationery and school supply stores',
        rootKey: null,
        nameField: null,
    },
    {
        file: 'Uniforms.json',
        categoryId: 'uniforms',
        categoryName: 'Uniforms',
        icon: '👕',
        description: 'School uniform shops and suppliers',
        rootKey: null,
        nameField: null,
    },
    {
        file: 'computer_suppliers.json',
        categoryId: 'computer-suppliers',
        categoryName: 'Computer Suppliers',
        icon: '💻',
        description: 'Computer and technology suppliers for schools',
        rootKey: null,
        nameField: null,
    },
];

// Auto-detect root key and name field from a JSON object
function autoDetect(obj) {
    const keys = Object.keys(obj);
    const rootKey = keys[0];
    const entries = obj[rootKey];
    if (!entries || !entries.length) return { rootKey, nameField: null };
    const first = entries[0];
    // Find the name field: usually matches the root key or has 'Name' in it
    const entryKeys = Object.keys(first);
    // Try exact match first
    if (first[rootKey] !== undefined) return { rootKey, nameField: rootKey };
    // Try common name fields
    for (const k of entryKeys) {
        const kl = k.toLowerCase();
        if (kl.includes('name') || kl === rootKey.toLowerCase()) {
            return { rootKey, nameField: k };
        }
    }
    // Fallback: first non-standard field
    const standardFields = ['telephone', 'fax', 'area', 'email', 'address', 'category', 'po box', 'no', 'website', 'nan', 'nan_1', 'edu. level', 'education'];
    for (const k of entryKeys) {
        if (!standardFields.includes(k.toLowerCase())) {
            return { rootKey, nameField: k };
        }
    }
    return { rootKey, nameField: entryKeys[0] };
}

// ─── Process all files ────────────────────────────────────────────────────────
const allBusinesses = [];
const categories = [];
const globalSeen = new Set();
let globalId = 1;

for (const mapping of FILE_MAP) {
    const filePath = path.join(dataDir, mapping.file);
    if (!fs.existsSync(filePath)) {
        console.warn(`⚠️  File not found: ${mapping.file}`);
        continue;
    }

    const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    let rootKey = mapping.rootKey;
    let nameField = mapping.nameField;

    if (!rootKey || !nameField) {
        const detected = autoDetect(raw);
        rootKey = rootKey || detected.rootKey;
        nameField = nameField || detected.nameField;
    }

    const entries = raw[rootKey] || [];
    console.log(`📂 ${mapping.file}: ${entries.length} entries (rootKey="${rootKey}", nameField="${nameField}")`);

    const catSeen = new Set();
    let catCount = 0;

    for (const entry of entries) {
        const name = (entry[nameField] || '').toString().trim();
        if (!name) continue;

        const dedupeKey = `${mapping.categoryId}::${name.toLowerCase()}`;
        if (catSeen.has(dedupeKey)) continue;
        catSeen.add(dedupeKey);

        const phone = (entry['Telephone'] || entry[mapping.phoneField] || '').toString().trim().replace(/\s+/g, '');
        const email = (entry['Email'] || '').toString().trim();
        const address = (entry['Address'] || '').toString().trim();
        const area = (entry['Area'] || entry[mapping.areaField] || '').toString().trim();
        const [lat, lng] = getCoords(area);
        const city = area || 'Bahrain';

        // Extra info for govt schools
        const eduLevel = entry['Edu. Level'] ? ` | Level: ${entry['Edu. Level']}` : '';
        const gender = entry['Education'] ? ` | ${entry['Education']}` : '';
        const website = entry['Website'] ? ` | ${entry['Website']}` : '';

        const description = `${name} is a ${mapping.categoryName.toLowerCase()} located in ${city}, Bahrain.${eduLevel}${gender}${website}`;

        allBusinesses.push({
            id: String(globalId++),
            name,
            category: mapping.categoryId,
            description,
            phone,
            email,
            address: address || `${city}, Bahrain`,
            lat, lng,
            city,
            rating: (4.0 + Math.round(Math.random() * 10) / 10).toFixed(1),
            reviewCount: Math.floor(Math.random() * 60) + 10,
            viewCount: Math.floor(Math.random() * 400) + 50,
        });
        catCount++;
    }

    categories.push({
        id: mapping.categoryId,
        name: mapping.categoryName,
        icon: mapping.icon,
        description: mapping.description,
        count: catCount,
    });

    console.log(`   ✅ ${catCount} unique entries added`);
}

console.log(`\n🎯 Total businesses: ${allBusinesses.length}`);
console.log(`🗂️  Total categories: ${categories.length}`);

// ─── Generate TypeScript ──────────────────────────────────────────────────────

// CATEGORIES block
let categoriesTs = 'export const CATEGORIES: Category[] = [\n';
for (const c of categories) {
    categoriesTs += `    {\n`;
    categoriesTs += `        id: '${esc(c.id)}',\n`;
    categoriesTs += `        name: '${esc(c.name)}',\n`;
    categoriesTs += `        icon: '${c.icon}',\n`;
    categoriesTs += `        description: '${esc(c.description)}',\n`;
    categoriesTs += `        count: ${c.count},\n`;
    categoriesTs += `    },\n`;
}
categoriesTs += '];';

// SAMPLE_BUSINESSES block
let businessesTs = 'export const SAMPLE_BUSINESSES: Business[] = [\n';
for (const b of allBusinesses) {
    businessesTs += `    {\n`;
    businessesTs += `        id: '${esc(b.id)}',\n`;
    businessesTs += `        name: '${esc(b.name)}',\n`;
    businessesTs += `        category: '${esc(b.category)}',\n`;
    businessesTs += `        description: '${esc(b.description)}',\n`;
    businessesTs += `        phone: '${esc(b.phone)}',\n`;
    businessesTs += `        email: '${esc(b.email)}',\n`;
    businessesTs += `        address: '${esc(b.address)}',\n`;
    businessesTs += `        location: {\n`;
    businessesTs += `            latitude: ${b.lat},\n`;
    businessesTs += `            longitude: ${b.lng},\n`;
    businessesTs += `            city: '${esc(b.city)}',\n`;
    businessesTs += `        },\n`;
    businessesTs += `        images: [],\n`;
    businessesTs += `        workingHours: DEFAULT_WORKING_HOURS,\n`;
    businessesTs += `        priceRange: '$$',\n`;
    businessesTs += `        featured: false,\n`;
    businessesTs += `        verified: true,\n`;
    businessesTs += `        rating: ${b.rating},\n`;
    businessesTs += `        reviewCount: ${b.reviewCount},\n`;
    businessesTs += `        createdAt: new Date().toISOString(),\n`;
    businessesTs += `        viewCount: ${b.viewCount},\n`;
    businessesTs += `    },\n`;
}
businessesTs += '];';

// ─── Update constants.ts ──────────────────────────────────────────────────────
let constants = fs.readFileSync(constantsPath, 'utf8');

// Replace CATEGORIES block
const catStart = constants.indexOf('export const CATEGORIES: Category[] = [');
if (catStart === -1) { console.error('Cannot find CATEGORIES'); process.exit(1); }
let catDepth = 0, catEnd = -1;
for (let i = catStart + 'export const CATEGORIES: Category[] = ['.length; i < constants.length; i++) {
    if (constants[i] === '[') catDepth++;
    if (constants[i] === ']') {
        if (catDepth === 0) { catEnd = i + 1; if (constants[catEnd] === ';') catEnd++; break; }
        catDepth--;
    }
}
constants = constants.slice(0, catStart) + categoriesTs + constants.slice(catEnd);

// Replace SAMPLE_BUSINESSES block
const bizMarker = 'export const SAMPLE_BUSINESSES: Business[] = [';
const bizStart = constants.indexOf(bizMarker);
if (bizStart === -1) { console.error('Cannot find SAMPLE_BUSINESSES'); process.exit(1); }
let bizDepth = 0, bizEnd = -1;
for (let i = bizStart + bizMarker.length; i < constants.length; i++) {
    if (constants[i] === '[') bizDepth++;
    if (constants[i] === ']') {
        if (bizDepth === 0) { bizEnd = i + 1; if (constants[bizEnd] === ';') bizEnd++; break; }
        bizDepth--;
    }
}
constants = constants.slice(0, bizStart) + businessesTs + constants.slice(bizEnd);

fs.writeFileSync(constantsPath, constants, 'utf8');
console.log('\n✅ constants.ts updated successfully!');
