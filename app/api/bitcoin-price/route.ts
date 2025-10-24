import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(
      'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=BTC',
      {
        headers: {
          'X-CMC_PRO_API_KEY': '292d25fcdc594e4a95ce2cae21140c62',
          'Accept': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (data.data && data.data.BTC) {
      const btcData = data.data.BTC.quote.USD;
      return NextResponse.json({
        price: btcData.price,
        change24h: btcData.percent_change_24h || 0,
        marketCap: btcData.market_cap || 0,
        volume24h: btcData.volume_24h || 0,
      });
    }

    return NextResponse.json({ error: 'Invalid data' }, { status: 500 });
  } catch (error) {
    console.error('Error fetching Bitcoin price:', error);
    return NextResponse.json({ error: 'Failed to fetch price' }, { status: 500 });
  }
}
