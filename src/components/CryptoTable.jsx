import React, { useState, useEffect } from 'react';
import { ArrowUpDown, Search } from 'lucide-react';

const CryptoTable = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'market_cap_rank', direction: 'asc' });

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&sparkline=false';
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': 'CG-HKbf9aAEKRYPYFtKP22aGvs3'
          }
        };
        const response = await fetch(url, options);
        const data = await response.json();
        setCoins(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, []);

  const formatNumber = (num) => {
    if (!num) return '$0';
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  const formatPercent = (num) => {
    if (!num) return '0%';
    return `${num.toFixed(2)}%`;
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedCoins = [...coins].sort((a, b) => {
    if (!a[sortConfig.key] || !b[sortConfig.key]) return 0;
    
    const compareResult = 
      typeof a[sortConfig.key] === 'string'
        ? a[sortConfig.key].localeCompare(b[sortConfig.key])
        : a[sortConfig.key] - b[sortConfig.key];
        
    return sortConfig.direction === 'asc' ? compareResult : -compareResult;
  });

  const filteredCoins = sortedCoins.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
      {/* Search Bar */}
      <div className='text-3xl font-bold mt-6 mb-5'>Market Statistics</div>
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search cryptocurrencies..."
          className="pl-10 p-2 w-full border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table Container */}
      <div className="mt-4 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Rank
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Coin
                    </th>
                    <th 
                      scope="col" 
                      className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 cursor-pointer"
                      onClick={() => handleSort('current_price')}
                    >
                      <div className="flex items-center justify-end gap-2">
                        Price
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="hidden sm:table-cell px-3 py-3.5 text-right text-sm font-semibold text-gray-900 cursor-pointer"
                      onClick={() => handleSort('price_change_percentage_24h')}
                    >
                      <div className="flex items-center justify-end gap-2">
                        24h Change
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="hidden md:table-cell px-3 py-3.5 text-right text-sm font-semibold text-gray-900 cursor-pointer"
                      onClick={() => handleSort('market_cap')}
                    >
                      <div className="flex items-center justify-end gap-2">
                        Market Cap
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </th>
                    <th scope="col" className="hidden lg:table-cell px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                      Volume (24h)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredCoins.map((coin) => (
                    <tr key={coin.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                        #{coin.market_cap_rank}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                          <div>
                            <div className="font-medium text-gray-900">{coin.name}</div>
                            <div className="text-gray-500">{coin.symbol.toUpperCase()}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-gray-900">
                        {formatNumber(coin.current_price)}
                      </td>
                      <td className={`hidden sm:table-cell whitespace-nowrap px-3 py-4 text-sm text-right
                        ${coin.price_change_percentage_24h > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatPercent(coin.price_change_percentage_24h)}
                      </td>
                      <td className="hidden md:table-cell whitespace-nowrap px-3 py-4 text-sm text-right text-gray-900">
                        {formatNumber(coin.market_cap)}
                      </td>
                      <td className="hidden lg:table-cell whitespace-nowrap px-3 py-4 text-sm text-right text-gray-900">
                        {formatNumber(coin.total_volume)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoTable;