const crypto = require('crypto');
const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || 'sec_3vFp9Kj2rL7xY4wM1qBz8Cd5hNg';
const payload = JSON.stringify({
  meta: { event_name: 'subscription_created', custom_data: { user_id: '69a6cad0a9904582c7c62c47' } },
  data: { id: 'sub_123', attributes: { customer_id: 'cus_456', variant_id: 1360090, status: 'active', renews_at: new Date(Date.now() + 30*24*60*60*1000).toISOString() } }
});
const hmac = crypto.createHmac('sha256', secret);
const signature = hmac.update(payload).digest('hex');

fetch('http://localhost:4000/api/subscription/webhook', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/vnd.api+json',
    'X-Signature': signature
  },
  body: payload
}).then(r => r.json()).then(console.log).catch(console.error);
