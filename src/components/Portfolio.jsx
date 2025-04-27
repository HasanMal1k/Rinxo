import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown, Plus, Wallet, MoreVertical } from 'lucide-react';

// Sample portfolio data
const generatePortfolioData = () => {
  return [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', amount: 0.0728, value: 4768.52, price: 65432.89, allocation: 44.65, change24h: 2.34, color: '#F7931A' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', amount: 0.85, value: 2992.22, price: 3521.43, allocation: 28.03, change24h: -1.27, color: '#627EEA' },
    { id: 'solana', name: 'Solana', symbol: 'SOL', amount: 10.5, value: 1343.27, price: 127.93, allocation: 12.58, change24h: 5.67, color: '#00FFA3' },
    { id: 'binancecoin', name: 'Binance Coin', symbol: 'BNB', amount: 2.15, value: 1234.36, price: 574.12, allocation: 11.56, change24h: 0.51, color: '#F3BA2F' },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA', amount: 740, value: 333.00, price: 0.45, allocation: 3.12, change24h: -0.83, color: '#0033AD' },
  ];
};

// Performance history data
const generatePerformanceData = () => {
  return [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 4500 },
    { name: 'Mar', value: 4200 },
    { name: 'Apr', value: 5100 },
    { name: 'May', value: 4800 },
    { name: 'Jun', value: 5300 },
    { name: 'Jul', value: 5800 },
    { name: 'Aug', value: 6200 },
    { name: 'Sep', value: 5900 },
    { name: 'Oct', value: 6500 },
    { name: 'Nov', value: 7000 },
    { name: 'Dec', value: 7500 },
  ];
};

const Portfolio = () => {
  const [portfolioData, setPortfolioData] = useState(generatePortfolioData());
  const [performanceData, setPerformanceData] = useState(generatePerformanceData());
  const [timeframe, setTimeframe] = useState('1Y');
  
  // Calculate totals
  const totalValue = portfolioData.reduce((sum, asset) => sum + asset.value, 0);
  const totalChange = portfolioData.reduce((sum, asset) => sum + (asset.value * asset.change24h / 100), 0);
  const totalChangePercent = (totalChange / totalValue) * 100;
  
  // Format functions
  const formatCurrency = (value) => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
  
  const formatPercent = (value) => {
    return `${value.toFixed(2)}%`;
  };
  
  return (
    <div className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Portfolio</h1>
        
        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-800 rounded-lg p-6 col-span-2">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-lg font-medium text-gray-300">Total Balance</h2>
                <div className="text-3xl font-bold mt-1">{formatCurrency(totalValue)}</div>
              </div>
              <div className={`flex items-center ${totalChangePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {totalChangePercent >= 0 ? <TrendingUp className="mr-1 h-5 w-5" /> : <TrendingDown className="mr-1 h-5 w-5" />}
                <span className="font-medium">{formatPercent(totalChangePercent)} (24h)</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <button className="bg-yellow-500 text-gray-900 font-medium px-4 py-2 rounded-lg flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Add Funds
              </button>
              <button className="bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center">
                <Wallet className="mr-2 h-4 w-4" />
                Withdraw
              </button>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-300 mb-4">Allocation</h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={portfolioData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {portfolioData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                    itemStyle={{ color: '#F3F4F6' }}
                  />
                  <Legend 
                    formatter={(value, entry, index) => portfolioData[index].symbol}
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Portfolio Performance */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-300">Portfolio Performance</h2>
            <div className="flex items-center gap-2">
              <button 
                className={`px-3 py-1 rounded-lg text-sm ${timeframe === '1W' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700'}`}
                onClick={() => setTimeframe('1W')}
              >
                1W
              </button>
              <button 
                className={`px-3 py-1 rounded-lg text-sm ${timeframe === '1M' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700'}`}
                onClick={() => setTimeframe('1M')}
              >
                1M
              </button>
              <button 
                className={`px-3 py-1 rounded-lg text-sm ${timeframe === '3M' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700'}`}
                onClick={() => setTimeframe('3M')}
              >
                3M
              </button>
              <button 
                className={`px-3 py-1 rounded-lg text-sm ${timeframe === '1Y' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700'}`}
                onClick={() => setTimeframe('1Y')}
              >
                1Y
              </button>
              <button 
                className={`px-3 py-1 rounded-lg text-sm ${timeframe === 'ALL' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700'}`}
                onClick={() => setTimeframe('ALL')}
              >
                ALL
              </button>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                  itemStyle={{ color: '#F3F4F6' }}
                />
                <Line type="monotone" dataKey="value" stroke="#EAB308" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Assets List */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-300 mb-4">Your Assets</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr className="text-left text-xs text-gray-400">
                  <th className="px-4 py-3 font-medium">Asset</th>
                  <th className="px-4 py-3 font-medium text-right">Price</th>
                  <th className="px-4 py-3 font-medium text-right">24h</th>
                  <th className="px-4 py-3 font-medium text-right">Holdings</th>
                  <th className="px-4 py-3 font-medium text-right">Value</th>
                  <th className="px-4 py-3 font-medium text-right">Allocation</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {portfolioData.map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-700">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full" style={{ backgroundColor: asset.color }}></div>
                        <div className="ml-3">
                          <div className="font-medium">{asset.name}</div>
                          <div className="text-gray-400 text-sm">{asset.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      {formatCurrency(asset.price)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <div className={`flex items-center justify-end ${asset.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {asset.change24h >= 0 ? 
                          <ArrowUp className="h-4 w-4 mr-1" /> : 
                          <ArrowDown className="h-4 w-4 mr-1" />
                        }
                        {formatPercent(asset.change24h)}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <div className="font-medium">{asset.amount}</div>
                      <div className="text-gray-400 text-sm">{asset.symbol}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right font-medium">
                      {formatCurrency(asset.value)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      {formatPercent(asset.allocation)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <button className="text-gray-400 hover:text-white">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;