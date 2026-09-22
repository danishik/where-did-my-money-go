import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Basic origin check — replace with your actual Vercel domain once deployed
  const allowed = ['https://where-did-my-money-go-nu.vercel.app', 'http://localhost:5173'];
  const origin = req.headers.origin || '';
  if (!allowed.includes(origin)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Password check  ← NEW
  const providedPassword = req.headers['x-app-password'];
  if (providedPassword !== process.env.APP_PASSWORD) {
    return res.status(401).json({ error: 'Incorrect password' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}