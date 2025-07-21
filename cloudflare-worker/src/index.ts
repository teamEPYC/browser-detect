/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

// export default {
// 	async fetch(request, env, ctx): Promise<Response> {
// 		return new Response('Hello World!!');
// 	},
// } satisfies ExportedHandler<Env>;
  


import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { env } from 'hono/adapter'

// If you're using MailChannels (Cloudflare native) or another email API (e.g. Resend, SendGrid), replace the send logic accordingly.

const app = new Hono()

// Enable CORS
// app.use('*', cors({
//   origin: 'https://browser-detect-two.vercel.app',
//   allowMethods: ['POST'],
//   allowHeaders: ['Content-Type']
// }))
app.use('*', cors({
origin: '*',
allowMethods: ['GET', 'POST', 'OPTIONS'],
allowHeaders: ['Content-Type'],
}))
  

// Email sending endpoint
app.post('/send-email', async (c) => {
  const { SMTP_USER, SMTP_PASS } = env<{ SMTP_USER: string; SMTP_PASS: string }>(c)

  const { to, subject, html } = await c.req.json()

  if (!to || !subject || !html) {
    return c.json({ error: 'Missing required fields' }, 400)
  }

  try {
	const result = await fetch('https://api.mailchannels.net/tx/v1/send', {
	  method: 'POST',
	  headers: { 'Content-Type': 'application/json' },
	  body: JSON.stringify({
		personalizations: [{ to: [{ email: to }] }],
		from: {
		  email: SMTP_USER,
		  name: 'EPYC Browser Detection',
		},
		subject,
		content: [{ type: 'text/html', value: html }],
	  }),
	})
  
	if (!result.ok) {
	  const errorText = await result.text()
	  console.error('MailChannels error:', errorText)
	  throw new Error(errorText)
	}
  
	return c.json({ success: true })
  } catch (err: any) {
	console.error('Worker error:', err.message)
	return c.json({ success: false, error: err.message }, 500)
  }
  
})

// Health check
app.get('/', (c) => c.text('Browser Detect API is running'))

export default app
