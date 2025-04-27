import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Clock, DollarSign, TrendingUp, TrendingDown, Calendar, ArrowRight } from 'lucide-react';

// Sample data to mimic CoinGecko API response
const generateSampleData = () => {
  // Create sample balance chart data
  const balanceData = [];
  let balance = 5000;
  const profitTarget = 5200;
  const maxDrawdown = 4500;
  let dailyDrawdown = 4700;
  
  for (let i = 0; i <= 49; i += 7) {
    if (i < 35) {
      balance = 5000 - Math.random() * 100;
    } else {
      balance = balance * 0.3; // Simulate a drop
    }
    
    balanceData.push({
      day: i,
      Balance: balance,
      'Profit target': profitTarget,
      'Max Drawdown': maxDrawdown,
      'Daily Drawdown': dailyDrawdown,
    });
  }

  // Create sample instruments data
  const instrumentsData = [];
  const instruments = ['btcusdt', 'bltusdt', 'dogeusdt', 'ethusdt', 'solusdt'];
  
  for (let i = 0; i <= 49; i += 7) {
    const data = {
      day: i,
    };
    
    instruments.forEach(inst => {
      data[inst] = Math.floor(Math.random() * 3);
    });
    
    instrumentsData.push(data);
  }

  return {
    balanceData,
    instrumentsData
  };
};

const Dashboard = () => {
  const [activeTimeframe, setActiveTimeframe] = useState('Week');
  const [sampleData, setSampleData] = useState(generateSampleData());
  const [currentBalance, setCurrentBalance] = useState(4709.56);
  const [equity, setEquity] = useState(4709.56);
  const [daysTraded, setDaysTraded] = useState(11);
  const [dailyDrawdown, setDailyDrawdown] = useState(4703.16);
  const [maxDrawdown, setMaxDrawdown] = useState(4500);
  
  // Format date like 16/1/2025 - 25/2/2025
  const getDateRange = () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 40);
    const endDate = new Date();
    
    const formatDate = (date) => {
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };
    
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };
  
  const dateRange = getDateRange();

  return (
    <div className="bg-gray-900 text-white">
      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {/* Current Balance */}
          <div className="bg-gray-800 p-5 rounded-lg">
            <div className="mb-3">
              <h3 className="text-lg font-medium">Current balance</h3>
              <div className="flex items-center text-xs text-gray-400">
                <Clock className="mr-1 h-3 w-3" />
                <span>Updated every minute (in $)</span>
              </div>
            </div>
            <div className="text-3xl font-bold">{currentBalance.toLocaleString()}</div>
          </div>
          
          {/* Equity */}
          <div className="bg-gray-800 p-5 rounded-lg">
            <div className="mb-3">
              <h3 className="text-lg font-medium">Equity</h3>
              <div className="flex items-center text-xs text-gray-400">
                <Clock className="mr-1 h-3 w-3" />
                <span>Updated every minute (in $)</span>
              </div>
            </div>
            <div className="text-3xl font-bold">{equity.toLocaleString()}</div>
          </div>
          
          {/* Days Traded */}
          <div className="bg-gray-800 p-5 rounded-lg">
            <div className="mb-3">
              <h3 className="text-lg font-medium">Days traded</h3>
              <div className="flex items-center text-xs text-gray-400">
                <Clock className="mr-1 h-3 w-3" />
                <span>Updated every day at 12:05 AM (UTC)</span>
              </div>
            </div>
            <div className="text-3xl font-bold">{daysTraded}</div>
          </div>
          
          {/* Daily Drawdown */}
          <div className="bg-gray-800 p-5 rounded-lg">
            <div className="mb-3">
              <h3 className="text-lg font-medium">Daily Drawdown</h3>
              <div className="flex items-center text-xs text-gray-400">
                <Clock className="mr-1 h-3 w-3" />
                <span>Updated every day at 12:05 AM (UTC) (in $)</span>
              </div>
            </div>
            <div className="text-3xl font-bold">{dailyDrawdown.toLocaleString()}</div>
          </div>
          
          {/* Max Drawdown */}
          <div className="bg-gray-800 p-5 rounded-lg">
            <div className="mb-3">
              <h3 className="text-lg font-medium">Max Drawdown</h3>
              <div className="flex items-center text-xs text-gray-400">
                <span>Static (in $)</span>
              </div>
            </div>
            <div className="text-3xl font-bold">{maxDrawdown.toLocaleString()}</div>
          </div>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Balance Chart */}
          <div className="bg-gray-800 p-5 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-medium">Balance</h3>
                <div className="text-xs text-gray-400">
                  <div>Check your balance</div>
                  <div>Created Date 16/01/2025</div>
                  <div>Close date: 25/02/2025</div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className={`px-4 py-2 rounded ${activeTimeframe === 'Week' ? 'bg-yellow-500 text-black' : 'bg-gray-700'}`} onClick={() => setActiveTimeframe('Week')}>Week</button>
                <button className={`px-4 py-2 rounded ${activeTimeframe === 'Month' ? 'bg-yellow-500 text-black' : 'bg-gray-700'}`} onClick={() => setActiveTimeframe('Month')}>Month</button>
                <button className={`px-4 py-2 rounded ${activeTimeframe === 'Year' ? 'bg-yellow-500 text-black' : 'bg-gray-700'}`} onClick={() => setActiveTimeframe('Year')}>Year</button>
                <button className="px-3 py-2 rounded bg-gray-700">
                  <Calendar className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="text-xs text-gray-400 text-right mb-2">{dateRange}</div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sampleData.balanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="day" stroke="#888" label={{ value: 'Days', position: 'insideBottom', offset: -5 }} />
                  <YAxis stroke="#888" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#333', border: 'none' }}
                    itemStyle={{ color: '#fff' }} 
                  />
                  <Legend />
                  <Line type="monotone" dataKey="Balance" stroke="#D4AF37" strokeWidth={2} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="Profit target" stroke="#4CAF50" strokeWidth={2} />
                  <Line type="monotone" dataKey="Max Drawdown" stroke="#F44336" strokeWidth={2} />
                  <Line type="monotone" dataKey="Daily Drawdown" stroke="#E57373" strokeWidth={2} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Instruments Chart */}
          <div className="bg-gray-800 p-5 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-medium">Instruments</h3>
                <div className="text-xs text-gray-400">Check your instruments</div>
              </div>
              <div className="flex space-x-2">
                <button className={`px-4 py-2 rounded ${activeTimeframe === 'Week' ? 'bg-yellow-500 text-black' : 'bg-gray-700'}`} onClick={() => setActiveTimeframe('Week')}>Week</button>
                <button className={`px-4 py-2 rounded ${activeTimeframe === 'Month' ? 'bg-yellow-500 text-black' : 'bg-gray-700'}`} onClick={() => setActiveTimeframe('Month')}>Month</button>
                <button className={`px-4 py-2 rounded ${activeTimeframe === 'Year' ? 'bg-yellow-500 text-black' : 'bg-gray-700'}`} onClick={() => setActiveTimeframe('Year')}>Year</button>
                <button className="px-3 py-2 rounded bg-gray-700">
                  <Calendar className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="text-xs text-gray-400 text-right mb-2">{dateRange}</div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sampleData.instrumentsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="day" stroke="#888" label={{ value: 'Days', position: 'insideBottom', offset: -5 }} />
                  <YAxis stroke="#888" label={{ value: 'Trades', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#333', border: 'none' }}
                    itemStyle={{ color: '#fff' }} 
                  />
                  <Legend />
                  <Bar dataKey="btcusdt" stackId="a" fill="#D4AF37" />
                  <Bar dataKey="bltusdt" stackId="a" fill="#AED581" />
                  <Bar dataKey="dogeusdt" stackId="a" fill="#81C784" />
                  <Bar dataKey="ethusdt" stackId="a" fill="#4CAF50" />
                  <Bar dataKey="solusdt" stackId="a" fill="#26A69A" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-6 mb-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold mb-2">Ready to explore more?</h3>
              <p className="text-gray-300">Check out detailed statistics and manage your portfolio more effectively.</p>
            </div>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-6 py-3 rounded-lg flex items-center">
              Go to Portfolio <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;