import { PrismaClient } from '@prisma/client';
import { dev } from '$app/environment';

// Initialize Prisma client
const prisma = new PrismaClient();

/**
 * GET handler for sitemap.xml
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET() {
  try {
    // Base URL for the site (adjust for production)
    const baseUrl = dev ? 'http://localhost:5173' : 'https://abetworks.in';
    
    // Fetch all published blog posts
    const blogPosts = await prisma.blogPost.findMany({
      where: {
        draft: false
      },
      select: {
        slug: true,
        updatedAt: true,
      }
    });
    
    // Define manual URLs you want to include
    const manualUrls = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/about', priority: '0.8', changefreq: 'monthly' },
      { url: '/contact', priority: '0.8', changefreq: 'monthly' },
    ];
    
    // Start building the XML string
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Add manual URLs to the sitemap
    manualUrls.forEach((page) => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += '  </url>\n';
    });
    
    // Add blog posts to the sitemap
    blogPosts.forEach((post) => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/blog/${post.slug}</loc>\n`;
      xml += `    <lastmod>${post.updatedAt.toISOString()}</lastmod>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.7</priority>\n';
      xml += '  </url>\n';
    });
    
    // Close the XML string
    xml += '</urlset>';
    
    // Return XML response
    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'max-age=3600'
      }
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response('Error generating sitemap', { status: 500 });
  } finally {
    // Disconnect from Prisma to avoid memory leaks
    await prisma.$disconnect();
  }
}
