import type { ExportedHandler } from '@cloudflare/workers-types';

export default {
  async fetch(request: Request, env: any, ctx: any): Promise<Response> {
    try {
      const url = new URL(request.url);
      // Handle static assets first
      if (
        url.pathname.startsWith("/assets/") ||
        url.pathname.endsWith(".css") ||
        url.pathname.endsWith(".js") ||
        url.pathname.endsWith(".png") ||
        url.pathname.endsWith(".jpg") ||
        url.pathname.endsWith(".ico") ||
        url.pathname.endsWith(".svg") ||
        url.pathname.endsWith(".woff") ||
        url.pathname.endsWith(".woff2")
      ) {
        try {
          const assetRequest = new Request(url.toString());
          const asset = await env.ASSETS.fetch(assetRequest);
          if (asset.status === 200) {
            const headers = new Headers(asset.headers);
            headers.set("Cache-Control", "public, max-age=31536000, immutable");
            return new Response(asset.body, {
              status: asset.status,
              headers,
            });
          }
        } catch (error) {
          console.error("Asset fetch error:", error);
        }
      }
      // Serve the main application HTML shell for all other requests
      const cssFile = "root-YXtYQCjF.css";
      const jsFile = "entry.client-Dlm1bF5e.js";
      const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Browser Detect</title>
    <link rel="icon" href="https://cdn.prod.website-files.com/66445dc4463de54bfd7fe2cf/6669534e971bb780fb08bfba_favicon.png" type="image/png" />
    <link rel="stylesheet" href="/assets/${cssFile}" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/assets/${jsFile}"></script>
  </body>
</html>`;
      return new Response(html, {
        headers: {
          "Content-Type": "text/html",
          "Cache-Control": "no-cache, no-store, must-revalidate"
        },
      });
    } catch (error) {
      console.error("Worker error:", error);
      return new Response(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        {
          status: 500,
          headers: {
            "Content-Type": "text/plain",
          },
        }
      );
    }
  },
};



