const axios = require('axios');
async function test() {
  const { data } = await axios.get('https://api.quiverquant.com/beta/live/congresstrading', {
    headers: { Authorization: 'Bearer 0841fa2fa40a25e8aa8a0a4f3e4af5f55e79dea2' }
  });
  const sorted = data.sort((a,b) => new Date(b.ReportDate) - new Date(a.ReportDate));
  console.log("Latest 5 by ReportDate:", sorted.slice(0, 5).map(x => ({ rep: x.Representative, report: x.ReportDate, tx: x.TransactionDate })));
}
test();
