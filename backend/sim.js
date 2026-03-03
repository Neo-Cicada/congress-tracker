const crypto = require('crypto');
const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || 'sec_3vFp9Kj2rL7xY4wM1qBz8Cd5hNg';
const payload = JSON.stringify({
  meta: { event_name: 'test', custom_data: null },
  data: {}
});
const hmac = crypto.createHmac('sha256', secret);
const signature = hmac.update(payload).digest('hex');

fetch('https://good-rooms-eat.loca.lt/api/subscription/webhook', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/vnd.api+json',
    'X-Signature': signature
  },
  body: payload
}).then(r => r.text()).then(t => console.log('Response:', t)).catch(console.error);
