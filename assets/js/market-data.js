const rowsContainer = document.getElementById('market-rows');

const fallbackCoins = [
  {
    symbol: 'btc',
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    current_price: 95382,
    price_change_percentage_24h: -0.11,
    sparkline_in_7d: { price: [1,2,1,2,1,2,1] }
  },
  {
    symbol: 'eth',
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    current_price: 3316,
    price_change_percentage_24h: 0.67,
    sparkline_in_7d: { price: [1,2,2,3,2,3,4] }
  },
  {
    symbol: 'sol',
    image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
    current_price: 182,
    price_change_percentage_24h: 1.92,
    sparkline_in_7d: { price: [1,1,2,2,3,4,3] }
  }
];

let lastGoodData = fallbackCoins;

async function fetchMarketData() {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?' +
      'vs_currency=usd&order=market_cap_desc&per_page=7&page=1&sparkline=true',
      { cache: 'no-store' }
    );

    if (!res.ok) throw new Error('Bad response');

    const coins = await res.json();

    if (!Array.isArray(coins) || coins.length === 0) {
      throw new Error('Empty data');
    }

    lastGoodData = coins;
    renderRows(coins);

  } catch (e) {
    console.warn('Using fallback market data');
    renderRows(lastGoodData);
  }
}

function renderRows(coins) {
  rowsContainer.innerHTML = '';

  coins.forEach(coin => {
    if (!coin || !coin.current_price || !coin.symbol) return;

    const change = Number(coin.price_change_percentage_24h) || 0;
    const isUp = change >= 0;

    const row = document.createElement('div');
    row.className = 'grid grid-cols-6 items-center py-4 text-sm';

    row.innerHTML = `
      <div class="col-span-2 flex items-center gap-3">
        <img src="${coin.image}" class="w-6 h-6 rounded-full" onerror="this.style.display='none'" />
        <span class="text-white uppercase">
          ${coin.symbol} / USD
        </span>
      </div>

      <div class="text-white">
        $${Number(coin.current_price).toLocaleString()}
      </div>

      <div class="${isUp ? 'text-green-400' : 'text-red-400'}">
        ${isUp ? '+' : ''}${change.toFixed(2)}%
      </div>

      <div class="${isUp ? 'text-green-400' : 'text-red-400'} text-xs">
        ${sparkline(coin.sparkline_in_7d?.price)}
      </div>

      <div class="text-right">
        <button class="px-3 py-1 text-xs rounded-full border border-white/20 hover:border-white/40">
          Trade
        </button>
      </div>
    `;

    rowsContainer.appendChild(row);
  });
}

function sparkline(data) {
  if (!Array.isArray(data) || data.length < 2) return '─ ─ ─';

  const slice = data.slice(-16);
  return slice.map((v, i) =>
    i === 0 ? '╱' : v > slice[i - 1] ? '╱' : '╲'
  ).join('');
}

fetchMarketData();
setInterval(fetchMarketData, 60000);
