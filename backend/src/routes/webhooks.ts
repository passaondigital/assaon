import express from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const router = express.Router();

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'whsec_dev_secret';
const LOG_PATH = path.join(process.cwd(), 'data', 'webhook-events.log');

function logEvent(payload: object) {
  fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true });
  fs.appendFileSync(LOG_PATH, JSON.stringify({ receivedAt: new Date().toISOString(), ...payload }) + '\n');
}

function verifySignature(payload: string, signature: string | undefined): boolean {
  if (!signature) return false;
  const expected = 'sha256=' + crypto.createHmac('sha256', WEBHOOK_SECRET).update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

// Generic inbound webhook receiver
router.post('/receive', express.raw({ type: 'application/json' }), (req, res) => {
  const rawBody = req.body.toString();
  const signature = req.headers['x-assaon-signature'] as string;

  if (!verifySignature(rawBody, signature)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  logEvent(payload);
  console.log(`[Webhook] Received event: ${payload.event}`);
  res.json({ received: true });
});

// Stripe webhook receiver
router.post('/stripe', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  // TODO: Use stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  const rawBody = req.body.toString();

  let event: Record<string, unknown>;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return res.status(400).send('Webhook error: Invalid JSON');
  }

  logEvent({ source: 'stripe', ...event });

  switch (event.type) {
    case 'payment_intent.succeeded':
      console.log('[Webhook] Stripe: payment succeeded');
      break;
    case 'customer.subscription.created':
      console.log('[Webhook] Stripe: subscription created');
      break;
    case 'customer.subscription.deleted':
      console.log('[Webhook] Stripe: subscription cancelled');
      break;
    default:
      console.log(`[Webhook] Stripe: unhandled event ${event.type}`);
  }

  res.json({ received: true });
});

// GitHub webhook receiver
router.post('/github', express.raw({ type: '*/*' }), (req, res) => {
  const event = req.headers['x-github-event'] as string;
  const delivery = req.headers['x-github-delivery'] as string;

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(req.body.toString());
  } catch {
    return res.status(400).send('Invalid JSON');
  }

  logEvent({ source: 'github', event, delivery, ...payload });
  console.log(`[Webhook] GitHub: ${event} — delivery ${delivery}`);

  res.json({ received: true });
});

export default router;
