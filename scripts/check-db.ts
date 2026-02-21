import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Database Connection Diagnostic ---');
    console.log('Environment:', process.env.NODE_ENV);
    console.log('DATABASE_URL starts with:', process.env.DATABASE_URL?.substring(0, 20) + '...');

    try {
        console.log('\nAttempting to connect and query businesses...');
        const count = await prisma.business.count();
        console.log('✅ Connection successful!');
        console.log(`Successfully queried ${count} businesses.`);

        console.log('\nFetching sample business...');
        const first = await prisma.business.findFirst();
        if (first) {
            console.log('Sample data found:', first.name);
        } else {
            console.log('No data found in "businesses" table.');
        }

    } catch (error: any) {
        console.error('\n❌ Connection failed!');
        console.error('Error Name:', error.name);
        console.error('Error Code:', error.code);
        console.error('Error Message:', error.message);

        if (error.message.includes('Can\'t reach database server')) {
            console.log('\nPossible issues:');
            console.log('1. The database server is down.');
            console.log('2. The connection string is incorrect.');
            console.log('3. Firewall/IP restrictions (Supabase settings).');
        }
    } finally {
        await prisma.$disconnect();
    }
}

main();
