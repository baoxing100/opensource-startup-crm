import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testSession() {
    try {
        console.log('Testing session validation...');
        
        // Get the current session ID from our test
        const sessionId = '51950877-3c75-4cc2-9ee3-e1537f71c3fe';
        
        console.log(`Looking for session: ${sessionId}`);
        
        // Check if session exists in database (this is what hooks.server.js does)
        const user = await prisma.user.findFirst({
            where: {
                session_id: sessionId
            }
        });
        
        if (user) {
            console.log('✅ Session is valid in database');
            console.log(`  User: ${user.email}`);
            console.log(`  Session ID: ${user.session_id}`);
            
            // Check if user has organizations
            const userOrgs = await prisma.userOrganization.findMany({
                where: { userId: user.id },
                include: {
                    organization: true
                }
            });
            
            console.log(`  Organizations: ${userOrgs.length}`);
            userOrgs.forEach(org => {
                console.log(`    - ${org.organization.name} (${org.role})`);
            });
            
        } else {
            console.log('❌ Session not found in database');
            
            // Check what sessions exist
            const allSessions = await prisma.user.findMany({
                where: {
                    session_id: { not: null }
                },
                select: {
                    email: true,
                    session_id: true,
                    lastLogin: true
                }
            });
            
            console.log(`Found ${allSessions.length} users with sessions:`);
            allSessions.forEach(u => {
                console.log(`  - ${u.email}: ${u.session_id} (${u.lastLogin})`);
            });
        }
        
    } catch (error) {
        console.error('❌ Session test error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

testSession();