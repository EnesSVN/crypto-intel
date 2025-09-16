export function GET() {
  return new Response(
    `User-agent: *\nAllow: /\nSitemap: ${
      process.env.NEXT_PUBLIC_BASE_URL ?? ""
    }/sitemap.xml`
  );
}
