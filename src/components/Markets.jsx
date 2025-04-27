import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Search, ArrowDown } from 'lucide-react';

const Markets = () => {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleMarkets, setVisibleMarkets] = useState(18);

  const fetchMarketData = async () => {
    setLoading(true);
    try {
      const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&sparkline=false';
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'x-cg-demo-api-key': 'CG-HKbf9aAEKRYPYFtKP22aGvs3'
        }
      };
      const response = await fetch(url, options);
      const data = await response.json();
      setMarkets(data);
    } catch (error) {
      console.error('Error fetching market data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
  }, []);

  const formatNumber = (num) => {
    if (!num) return '$0';
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  const filteredMarkets = markets.filter(market => 
    market.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    market.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleShowMore = () => {
    setVisibleMarkets(prev => prev + 18);
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full text-blue-700 font-medium text-sm mb-4">
            Cryptocurrency Markets
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Global Crypto Market Overview
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore real-time market data for top cryptocurrencies, including price, market cap, and 24-hour performance.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search cryptocurrencies by name or symbol..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6">
                <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        )}

        {/* Markets Grid */}
        {!loading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMarkets.slice(0, visibleMarkets).map((market) => (
                <div 
                  key={market.id} 
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <img 
                        src={market.image} 
                        alt={market.name} 
                        className="h-10 w-10 mr-3 rounded-full"
                      />
                      <div>
                        <h3 className="text-lg font-semibold">{market.name}</h3>
                        <p className="text-gray-500 text-sm uppercase">{market.symbol}</p>
                      </div>
                    </div>
                    <div className={`flex items-center ${market.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {market.price_change_percentage_24h >= 0 ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      <span className="font-medium text-sm">
                        {market.price_change_percentage_24h.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Price</div>
                      <div className="text-xl font-bold">{formatNumber(market.current_price)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Market Cap</div>
                      <div className="text-lg font-semibold">{formatNumber(market.market_cap)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">24h Volume</div>
                      <div className="text-lg font-semibold">{formatNumber(market.total_volume)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Circulating Supply</div>
                      <div className="text-lg font-semibold">{formatNumber(market.circulating_supply)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Show More Button */}
            {filteredMarkets.length > visibleMarkets && (
              <div className="text-center mt-8">
                <button 
                  onClick={handleShowMore}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
                >
                  Show More Cryptocurrencies
                  <ArrowDown className="ml-2 h-5 w-5" />
                </button>
              </div>
            )}
          </>
        )}

        {/* No Results State */}
        {!loading && filteredMarkets.length === 0 && (
          <div className="text-center py-16">
            <div className="mb-4">
              <DollarSign className="h-16 w-16 mx-auto text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No Cryptocurrencies Found
            </h2>
            <p className="text-gray-600">
              Try adjusting your search term or explore other cryptocurrencies.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Markets;