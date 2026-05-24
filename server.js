const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PAY_TO = process.env.PAY_TO;

app.use(cors());
app.use(express.static('public'));

if (!PAY_TO) {
  console.error("❌ Thiếu PAY_TO trong .env");
  process.exit(1);
}

// x402 Route
app.get('/api/premium', (req, res) => {
  res.set('x402-payment-required', JSON.stringify({
    accepts: [{
      scheme: "exact",
      price: "$0.1",
      network: "eip155:8453",
      payTo: PAY_TO,
      description: "Mở khóa nội dung premium"
    }]
  }));

  res.status(402).json({ message: "Payment Required" });
});

// Trang chủ
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>x402 Payment</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-950 text-white min-h-screen flex items-center justify-center">
      <div class="max-w-md w-full bg-gray-900 rounded-3xl p-10 text-center border border-gray-700">
        <h1 class="text-4xl font-bold mb-2">🔐 x402 Payment</h1>
        <p class="text-gray-400 mb-8">Thanh toán USDC trên Base</p>
        
        <div class="bg-gray-800 rounded-2xl p-6 mb-8">
          <p class="text-gray-400">Nội dung Premium</p>
          <p class="text-4xl font-bold text-green-400 mt-1">$0.1 USDC</p>
        </div>

        <button onclick="pay()" class="w-full bg-blue-600 hover:bg-blue-700 py-5 rounded-2xl text-xl font-medium">
          Mở khóa ngay bằng x402
        </button>
      </div>

      <script>
        function pay() {
          window.location.href = '/api/premium';
        }
      </script>
    </body>
    </html>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server chạy trên port ${PORT}`));
