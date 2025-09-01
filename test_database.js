import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabase() {
    try {
        console.log('Testing database connection...');
        
        // Test connection
        await prisma.$connect();
        console.log('✅ Database connected successfully');
        
        // Check if test user exists
        const user = await prisma.user.findUnique({
            where: { email: 'vinayak@abetworks.in' },
            select: {
                id: true,
                email: true,
                name: true,
                isEmailVerified: true,
                password: true,
                session_id: true,
                lastLogin: true
            }
        });
        
        if (user) {
            console.log('✅ Test user found:');
            console.log(`  ID: ${user.id}`);
            console.log(`  Email: ${user.email}`);
            console.log(`  Name: ${user.name}`);
            console.log(`  Email Verified: ${user.isEmailVerified}`);
            console.log(`  Has Password: ${user.password ? 'Yes' : 'No'}`);
            console.log(`  Session ID: ${user.session_id || 'None'}`);
            console.log(`  Last Login: ${user.lastLogin || 'Never'}`);
        } else {
            console.log('❌ Test user not found');
            
            // Check if any users exist
            const userCount = await prisma.user.count();
            console.log(`Total users in database: ${userCount}`);
            
            if (userCount > 0) {
                const users = await prisma.user.findMany({
                    select: { email: true, isEmailVerified: true },
                    take: 5
                });
                console.log('Sample users:');
                users.forEach(u => console.log(`  - ${u.email} (verified: ${u.isEmailVerified})`));
            }
        }
        
        // Check organizations for the user
        if (user) {
            const userOrgs = await prisma.userOrganization.findMany({
                where: { userId: user.id },
                include: {
                    organization: {
                        select: { id: true, name: true }
                    }
                }
            });
            
            console.log(`\n✅ User organizations: ${userOrgs.length}`);
            userOrgs.forEach(org => {
                console.log(`  - ${org.organization.name} (ID: ${org.organization.id}, Role: ${org.role})`);
            });
        }
        
    } catch (error) {
        console.error('❌ Database error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

testDatabase();