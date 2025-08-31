import prisma from '$lib/prisma'
import { redirect } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	const sessionId = await event.cookies.get('session');
	// console.log(sessionId, '-----------------sessionid')
	let user = null;
	if(sessionId && sessionId!=''){
	  user = await prisma.user.findFirst({
		where: {
		  session_id: sessionId
		}
	  })
	}
	  
	if (user) {
	  event.locals.user = user
	  
	  // Check if org cookie is set
	  const orgId = event.cookies.get('org');
	  if (orgId) {
	    // Check if the user is part of this organization
	    const userOrg = await prisma.userOrganization.findFirst({
	      where: {
	        userId: user.id,
	        organizationId: orgId
	      },
	      include: {
	        organization: true
	      }
	    });
	    
      if (userOrg) {
        // User has access to this organization, set it in locals
        event.locals.org = userOrg.organization;
        // Also set org_name from cookie if available
        const orgName = event.cookies.get('org_name');
        if (orgName) {
          try {
            event.locals.org_name = decodeURIComponent(orgName);
          } catch (e) {
            event.locals.org_name = orgName;
          }
        } else {
          event.locals.org_name = userOrg.organization.name;
        }
      } else {
        // User doesn't have access to this organization or orgId is stale.
        // Clear the invalid org cookies.
        event.cookies.delete('org', { path: '/' });
        event.cookies.delete('org_name', { path: '/' });
        // Redirect to the organization selection page.
        // The user is still authenticated.
        throw redirect(307, '/(no-layout)/org');
      }
	  }
	}
  
	// Check if the route starts with /app
	if (event.url.pathname.startsWith('/app')) {
	  if (!user) {
	    // User not authenticated
	    throw redirect(307, '/login');
	  }
	  
	  // For /app routes, also ensure an organization is selected
	  if (!event.locals.org) {
	    // If user is authenticated but no org is selected, redirect to org selection page
	    throw redirect(307, '/(no-layout)/org');
	  }
	  
	  // We already verified above that if org exists in locals, the user is part of it
	} 
	// Handle admin routes - only allow abetworks.in domain users
	else if (event.url.pathname.startsWith('/admin')) {
	  if (!user) {
	    throw redirect(307, '/login');
	  }
	  
	  // Check if user's email domain is abetworks.in
	  if (!user.email || !user.email.endsWith('@abetworks.in')) {
	    throw redirect(307, '/app');
	  }
	}
	// Handle other protected routes
	else if (event.url.pathname.includes('/org')) {
	  if (!user) {
	    throw redirect(307, '/login');
	  }
	}

	return resolve(event);
  }