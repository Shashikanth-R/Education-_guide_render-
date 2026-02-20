const fs = require('fs');
const path = require('path');

const kgsPath = path.join(__dirname, '..', 'KGs.json');
const constantsPath = path.join(__dirname, '..', 'lib', 'constants.ts');

const raw = JSON.parse(fs.readFileSync(kgsPath, 'utf8'));
const entries = raw["KG's"];

console.log(`Total KG entries: ${entries.length}`);

// Area to approximate lat/lng mapping for Bahrain areas
const areaCoords = {
  'Manama': [26.2235, 50.5860],
  'Hamad Town': [26.1148, 50.5080],
  'North': [26.1500, 50.4800],
  'Rifaa': [26.1296, 50.5550],
  'Muharaq': [26.2672, 50.6097],
  'Sitraa': [26.1500, 50.5700],
  'Jad Hafs': [26.2100, 50.5400],
  'Central': [26.1900, 50.5300],
  'Western': [26.1700, 50.4500],
  'Isa Town': [26.1700, 50.5500],
  'North Riffa': [26.1400, 50.5600],
  'Salmabad': [26.1600, 50.5800],
  'Diyar': [26.2800, 50.6200],
  'Hamala': [26.1800, 50.4600],
  'Adliya': [26.2100, 50.5900],
  'Budaiya': [26.2000, 50.4400],
  'Saar': [26.1900, 50.4700],
  'Hidd': [26.2500, 50.6500],
  'Juffair': [26.2100, 50.6000],
  'Busaiteen': [26.2600, 50.6300],
  'Sanabis': [26.2200, 50.5500],
  'Galali': [26.2700, 50.6400],
  'Janabiya': [26.1800, 50.4800],
  'Aali': [26.1600, 50.5300],
  'Sanad': [26.1800, 50.5600],
  'Bilad Al Qadeem': [26.2000, 50.5500],
  'Zinj': [26.2100, 50.5700],
  'Jannusan': [26.1700, 50.4900],
  'Suquayya': [26.2300, 50.5800],
  'Gufool': [26.2200, 50.5800],
  'Sitra': [26.1500, 50.5700],
  'Barbar': [26.2000, 50.4600],
  'Salmaniya': [26.2100, 50.5800],
  'Um al Hassam': [26.2100, 50.5700],
  'Jablat Hebshi': [26.2000, 50.5500],
  'West Riffa': [26.1300, 50.5500],
  'Diyar Al Muharraq': [26.2800, 50.6200],
  'IsaTown': [26.1700, 50.5500],
  'Isa town': [26.1700, 50.5500],
  'Bu Quwah': [26.2000, 50.5900],
  'Nuwaidrat': [26.1500, 50.5600],
  'A\'ali': [26.1600, 50.5300],
};

function getCoords(area) {
  if (!area) return [26.2235, 50.5860];
  const trimmed = area.trim();
  return areaCoords[trimmed] || [26.2235, 50.5860];
}

// Track existing names to skip duplicates
const seen = new Set();

const businesses = [];
let id = 1;

for (const entry of entries) {
  const name = (entry['Kindergartens & Pre-Schools'] || '').trim();
  if (!name || seen.has(name.toLowerCase())) continue;
  seen.add(name.toLowerCase());

  const phone = (entry['Telephone'] || '').toString().trim().replace(/\s+/g, '');
  const email = (entry['Email'] || '').toString().trim();
  const address = (entry['Address'] || '').toString().trim();
  const area = (entry['Area'] || '').toString().trim();
  const [lat, lng] = getCoords(area);

  const city = area || 'Bahrain';

  businesses.push({
    id: String(id++),
    name,
    category: 'kindergartens',
    description: `${name} is a kindergarten and pre-school located in ${city}, Bahrain. Dedicated to early childhood education and development.`,
    phone,
    email,
    address: address || `${city}, Bahrain`,
    location: { latitude: lat, longitude: lng, city },
    images: [],
    workingHours: 'DEFAULT_WORKING_HOURS',
    priceRange: '$$',
    featured: false,
    verified: true,
    rating: 4.0 + Math.round(Math.random() * 10) / 10,
    reviewCount: Math.floor(Math.random() * 60) + 10,
    createdAt: 'new Date().toISOString()',
    viewCount: Math.floor(Math.random() * 400) + 50,
  });
}

console.log(`Generated ${businesses.length} unique businesses`);

// Generate TypeScript
let ts = '';
for (const b of businesses) {
  ts += `    {\n`;
  ts += `        id: '${b.id}',\n`;
  ts += `        name: '${b.name.replace(/'/g, "\\'")}',\n`;
  ts += `        category: 'kindergartens',\n`;
  ts += `        description: '${b.description.replace(/'/g, "\\'")}',\n`;
  ts += `        phone: '${b.phone}',\n`;
  ts += `        email: '${b.email}',\n`;
  ts += `        address: '${b.address.replace(/'/g, "\\'")}',\n`;
  ts += `        location: {\n`;
  ts += `            latitude: ${b.location.latitude},\n`;
  ts += `            longitude: ${b.location.longitude},\n`;
  ts += `            city: '${b.location.city.replace(/'/g, "\\'")}',\n`;
  ts += `        },\n`;
  ts += `        images: [],\n`;
  ts += `        workingHours: DEFAULT_WORKING_HOURS,\n`;
  ts += `        priceRange: '$$',\n`;
  ts += `        featured: false,\n`;
  ts += `        verified: true,\n`;
  ts += `        rating: ${b.rating.toFixed(1)},\n`;
  ts += `        reviewCount: ${b.reviewCount},\n`;
  ts += `        createdAt: new Date().toISOString(),\n`;
  ts += `        viewCount: ${b.viewCount},\n`;
  ts += `    },\n`;
}

// Read constants.ts
let constants = fs.readFileSync(constantsPath, 'utf8');

// Replace SAMPLE_BUSINESSES array content
const startMarker = 'export const SAMPLE_BUSINESSES: Business[] = [';
const endMarker = '];';

const startIdx = constants.indexOf(startMarker);
if (startIdx === -1) {
  console.error('Could not find SAMPLE_BUSINESSES in constants.ts');
  process.exit(1);
}

// Find the matching closing ]; after the array
let depth = 0;
let endIdx = -1;
for (let i = startIdx + startMarker.length; i < constants.length; i++) {
  if (constants[i] === '[') depth++;
  if (constants[i] === ']') {
    if (depth === 0) {
      endIdx = i + 1; // include the ]
      // skip the ; too
      if (constants[endIdx] === ';') endIdx++;
      break;
    }
    depth--;
  }
}

if (endIdx === -1) {
  console.error('Could not find end of SAMPLE_BUSINESSES array');
  process.exit(1);
}

const newArray = `${startMarker}\n${ts}];`;
const newConstants = constants.slice(0, startIdx) + newArray + constants.slice(endIdx);

fs.writeFileSync(constantsPath, newConstants, 'utf8');
console.log('constants.ts updated successfully!');
