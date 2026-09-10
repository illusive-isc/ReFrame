import { absolute, pages } from '$lib/site';

export const prerender = true;

export function GET() {
	const today = new Date().toISOString().slice(0, 10);
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
	.map(
		(p) => `	<url>
		<loc>${absolute(p.path)}</loc>
		<lastmod>${today}</lastmod>
		<changefreq>weekly</changefreq>
		<priority>${p.priority}</priority>
	</url>`
	)
	.join('\n')}
</urlset>
`;
	return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
