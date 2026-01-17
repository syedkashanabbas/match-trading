const rowsContainer = document.getElementById('market-rows');

/* ---------- FALLBACK DATA (USED IF API FAILS) ---------- */
const fallbackCoins = [
  {
    symbol: 'btc',
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    current_price: 95382,
    price_change_percentage_24h: -0.11,
    sparkline_in_7d: { price: [1,2,1,2,1,2,1,2] }
  },
  {
    symbol: 'eth',
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    current_price: 3316,
    price_change_percentage_24h: 0.67,
    sparkline_in_7d: { price: [1,2,2,3,2,3,4,3] }
  },
  {
    symbol: 'sol',
    image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
    current_price: 182,
    price_change_percentage_24h: 1.92,
    sparkline_in_7d: { price: [1,1,2,2,3,4,3,4] }
  }
];

let lastGoodData = fallbackCoins;

/* ---------- FETCH MARKET DATA ---------- */
async function fetchMarketData() {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?' +
      'vs_currency=usd&order=market_cap_desc&per_page=7&page=1&sparkline=true',
      { cache: 'no-store' }
    );

    if (!res.ok) throw new Error('Bad API response');

    const coins = await res.json();

    if (!Array.isArray(coins) || coins.length === 0) {
      throw new Error('Empty market data');
    }

    lastGoodData = coins;
    renderRows(coins);

  } catch (err) {
    console.warn('Market API failed, using fallback data');
    renderRows(lastGoodData);
  }
}

/* ---------- RENDER ROWS ---------- */
function renderRows(coins) {
  rowsContainer.innerHTML = '';

  coins.forEach(coin => {
    if (!coin || !coin.symbol || !coin.current_price) return;

    const change = Number(coin.price_change_percentage_24h) || 0;
    const isUp = change >= 0;

    const row = document.createElement('div');
    row.className = `
    grid grid-cols-2 gap-y-3 py-5
    md:grid-cols-6 md:gap-y-0 md:py-4
    `;



    row.innerHTML = `
  <!-- Pair -->
  <div class="flex items-center gap-3 md:col-span-2">
    <img src="${coin.image}" class="w-7 h-7 rounded-full" />
    <span class="text-white font-medium">
      ${coin.symbol.toUpperCase()} / USD
    </span>
  </div>

  <!-- Price -->
  <div class="text-white text-base md:text-sm">
    $${Number(coin.current_price).toLocaleString()}
  </div>

  <!-- Change -->
  <div class="${isUp ? 'text-green-400' : 'text-red-400'} text-sm">
    ${isUp ? '+' : ''}${change.toFixed(2)}%
  </div>

  <!-- Mobile-only stacked price+change -->
  <div class="col-span-2 flex justify-between md:hidden text-sm">
    <span class="text-white">
      $${Number(coin.current_price).toLocaleString()}
    </span>
    <span class="${isUp ? 'text-green-400' : 'text-red-400'}">
      ${isUp ? '+' : ''}${change.toFixed(2)}%
    </span>
  </div>

  <!-- Chart (desktop only) -->
  <div class="hidden md:block ${isUp ? 'text-green-400' : 'text-red-400'} text-xs">
    ${sparkline(coin.sparkline_in_7d?.price)}
  </div>

  <!-- Action (desktop only) -->
  <div class="hidden md:block text-right">
    <button class="px-3 py-1 text-xs rounded-full border border-white/20 hover:border-white/40">
      Trade
    </button>
  </div>
`;



    rowsContainer.appendChild(row);
  });
}

/* ---------- SPARKLINE ---------- */
function sparkline(data) {
  if (!Array.isArray(data) || data.length < 2) return '─ ─ ─';

  const slice = data.slice(-16);
  return slice.map((v, i) =>
    i === 0 ? '╱' : v > slice[i - 1] ? '╱' : '╲'
  ).join('');
}

/* ---------- INIT ---------- */
fetchMarketData();
setInterval(fetchMarketData, 60000);
