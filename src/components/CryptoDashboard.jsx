import React, { Suspense, useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';

// Loading skeleton component
const CryptoCardSkeleton = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-36 mb-4"></div>
        <div className="h-12 bg-gray-200 rounded w-24"></div>
      </div>
    ))}
  </div>
);

// Main data display component
const CryptoData = ({ data }) => {
  const formatNumber = (num) => {
    if (!num) return '$0';
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  const getPriceChangeColor = (change) => {
    return change >= 0 ? 'text-green-500' : 'text-red-500';
  };

  if (!data || data.length === 0) return <CryptoCardSkeleton />;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <h2 className="text-3xl font-bold">Top Performers</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {data.map((coin) => (
          <div key={coin.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium">{coin.name}</h3>
              <img className='h-12' src={coin.image} alt="" />
            </div>
            <div className="text-2xl font-bold">{formatNumber(coin.current_price)}</div>
            <div className={`text-xs ${getPriceChangeColor(coin.price_change_percentage_24h)}`}>
              {coin.price_change_percentage_24h?.toFixed(2)}% (24h)
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
        return  data.sort((a, b) => b.current_price - a.current_price).slice(0, 4)
        
      }   
    }

    useEffect(() => {
      const fetchData = async () => {
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
          console.log(data)
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, []);
  
    return (
      <div className="container mx-auto p-4 max-w-7xl mt-11">
        {loading ? <CryptoCardSkeleton /> : <CryptoData data={data} />}
      </div>
    );
  };

export default CryptoDashboard;