import type { EntryContext } from "react-router";

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  loadContext: any
) {
  // For client-side only mode, just return a basic HTML shell
  // The client will handle all rendering
  return new Response(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Browser Detect</title>
      </head>
      <body>
        <div id="root"></div>
      </body>
    </html>
  `, {
    headers: {
      "Content-Type": "text/html",
    },
    status: responseStatusCode,
  });
}