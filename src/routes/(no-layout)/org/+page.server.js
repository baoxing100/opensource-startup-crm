import { env } from '$env/dynamic/private';
import prisma from '$lib/prisma'

import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
    // Check if user is authenticated
    if (!locals.user) {
        throw redirect(307, '/login');
    }
    
    // Fetch organizations associated with this user
    const userOrgs = await prisma.userOrganization.findMany({
        where: {
            userId: locals.user.id
        },
        include: {
            organization: true
        }
    });
    
    // Extract the organization data
    const orgs = userOrgs.map(userOrg => ({
        id: userOrg.organization.id,
        name: userOrg.organization.name,
        logo: userOrg.organization.logo,
        role: userOrg.role
    }));

    // If user has exactly one organization, auto-select it
    if (orgs.length === 1) {
        const org = orgs[0];
        throw redirect(307, '/app');
    }
    
    return { orgs };
}
