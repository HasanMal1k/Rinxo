import React, { Suspense, useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, RefreshCw } from 'lucide-react';

// Loading skeleton component
const CryptoCardSkeleton = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 bg-gray-200 rounded w-24 mb-1"></div>
          <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-28 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </div>
    ))}
  </div>
);

// Main data display component
const CryptoData = ({ data, onRefresh }) => {
  const formatNumber = (num) => {
    if (!num) return '$0';
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  const getPriceChangeColor = (change) => {
    return change >= 0 ? 'text-green-500' : 'text-red-500';
  };

  const getPriceChangeIcon = (change) => {
    return change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  };

  if (!data || data.length === 0) return <CryptoCardSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-yellow-500" />
          <h2 className="text-2xl md:text-3xl font-bold">Top Performers</h2>
        </div>
        <button 
          onClick={onRefresh}
          className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {data.map((coin) => (
          <div key={coin.id} className="bg-white rounded-lg shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-medium">{coin.name}</h3>
                <p className="text-gray-500 text-xs uppercase">{coin.symbol}</p>
              </div>
              <img className="h-12 w-12 rounded-full" src={coin.image} alt={coin.name} />
            </div>
            <div className="text-2xl font-bold">{formatNumber(coin.current_price)}</div>
            <div className={`flex items-center mt-2 ${getPriceChangeColor(coin.price_change_percentage_24h)}`}>
              {getPriceChangeIcon(coin.price_change_percentage_24h)}
              <span className="ml-1 font-medium">
                {coin.price_change_percentage_24h?.toFixed(2)}% (24h)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main component with data fetching
const CryptoDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const calculateTopCoins = (data) => {
    if(data == null) return
    else{
      return data.sort((a, b) => b.current_price - a.current_price).slice(0, 4)
    }   
  }

  const fetchData = async () => {
    setLoading(true);
    try {
      const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd';
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'x-cg-demo-api-key': 'CG-HKbf9aAEKRYPYFtKP22aGvs3'
        }
      };
      const response = await fetch(url, options);
      const result = await response.json();
      setData(calculateTopCoins(result));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        {loading ? <CryptoCardSkeleton /> : <CryptoData data={data} onRefresh={fetchData} />}
      </div>
    </div>
  );
};

export default CryptoDashboard;