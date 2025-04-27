import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, 
  ArrowUp, 
  ArrowDown, 
  ChevronDown, 
  LineChart, 
  BarChart2, 
  Maximize, 
  Minimize,
  RefreshCw,
  Search,
  Settings
} from 'lucide-react';

// Available trading pairs
const tradingPairs = [
  { symbol: 'BTCUSDT', name: 'Bitcoin', basePrice: 84947.4 },
  { symbol: 'ETHUSDT', name: 'Ethereum', basePrice: 3521.43 },
  { symbol: 'SOLUSDT', name: 'Solana', basePrice: 127.93 },
  { symbol: 'BNBUSDT', name: 'Binance Coin', basePrice: 574.12 },
  { symbol: 'ADAUSDT', name: 'Cardano', basePrice: 0.45 },
  { symbol: 'DOGEUSDT', name: 'Dogecoin', basePrice: 0.12 },
  { symbol: 'XRPUSDT', name: 'XRP', basePrice: 0.58 }
];

// Sample data generation functions
const generateCandleData = (days = 30, volatility = 0.02, startPrice) => {
  const data = [];
  let currentPrice = startPrice;
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    for (let h = 0; h < 24; h += 2) { // 2-hour candles
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(h);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
      
      // Random movement
      const change = currentPrice * (Math.random() * volatility * 2 - volatility);
      const open = currentPrice;
      const close = currentPrice + change;
      const high = Math.max(open, close) + Math.random() * Math.abs(change);
      const low = Math.min(open, close) - Math.random() * Math.abs(change);
      const volume = Math.random() * 1000 + 100;
      
      data.push({
        date,
        time: date.getTime(),
        open,
        high,
        low,
        close,
        volume
      });
      
      currentPrice = close;
    }
  }
  
  return data;
};

const generateOrderBookData = (currentPrice, depth = 10) => {
  const asks = [];
  const bids = [];
  
  // Generate asks (sell orders) - higher than current price
  for (let i = 0; i < depth; i++) {
    const price = currentPrice + (i + 1) * 0.5 + Math.random() * 0.5;
    const amount = Math.random() * 4 + 1; // Random amount between 1 and 5
    const total = price * amount;
    
    asks.push({
      price: +price.toFixed(1),
      amount: +amount.toFixed(2),
      total: +total.toFixed(2)
    });
  }
  
  // Generate bids (buy orders) - lower than current price
  for (let i = 0; i < depth; i++) {
    const price = currentPrice - (i + 1) * 0.5 - Math.random() * 0.5;
    const amount = Math.random() * 4 + 1; // Random amount between 1 and 5
    const total = price * amount;
    
    bids.push({
      price: +price.toFixed(1),
      amount: +amount.toFixed(2),
      total: +total.toFixed(2)
    });
  }
  
  return { asks: asks.reverse(), bids };
};

const TradingView = () => {
  const [candleData, setCandleData] = useState([]);
  const [orderBook, setOrderBook] = useState({ asks: [], bids: [] });
  const [currentPair, setCurrentPair] = useState(tradingPairs[0]);
  const [currentPrice, setCurrentPrice] = useState(tradingPairs[0].basePrice);
  const [timeframe, setTimeframe] = useState('15m');
  const [orderType, setOrderType] = useState('limit');
  const [orderAmount, setOrderAmount] = useState('');
  const [orderPrice, setOrderPrice] = useState('');
  const [intervalId, setIntervalId] = useState(null);
  const candleChartRef = useRef(null);
  
  // Draw candlestick chart
  const drawCandleChart = () => {
    if (!candleChartRef.current || candleData.length === 0) return;
    
    const canvas = candleChartRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // Set canvas size to match display size
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Chart dimensions
    const padding = { top: 20, right: 10, bottom: 30, left: 70 };
    const chartWidth = canvas.width - padding.left - padding.right;
    const chartHeight = canvas.height - padding.top - padding.bottom;
    
    // Calculate data range
    const visibleData = candleData.slice(-80); // Show last 80 candles
    
    if (visibleData.length === 0) return;
    
    const maxPrice = Math.max(...visibleData.map(d => d.high));
    const minPrice = Math.min(...visibleData.map(d => d.low));
    const priceRange = maxPrice - minPrice;
    
    // Add 5% padding to price range
    const paddedMaxPrice = maxPrice + priceRange * 0.05;
    const paddedMinPrice = minPrice - priceRange * 0.05;
    const paddedPriceRange = paddedMaxPrice - paddedMinPrice;
    
    // Calculate scales
    const xScale = chartWidth / visibleData.length;
    const yScale = chartHeight / paddedPriceRange;
    
    // Draw price axis (Y-axis)
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, padding.top + chartHeight);
    ctx.stroke();
    
    // Draw price labels
    ctx.fillStyle = '#888';
    ctx.font = '11px Arial';
    ctx.textAlign = 'right';
    
    const priceSteps = 6;
    for (let i = 0; i <= priceSteps; i++) {
      const y = padding.top + chartHeight - (i / priceSteps * chartHeight);
      const price = paddedMinPrice + (i / priceSteps * paddedPriceRange);
      
      // Draw grid line
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartWidth, y);
      ctx.stroke();
      
      // Draw price label
      ctx.fillText(price.toFixed(1), padding.left - 5, y + 4);
    }
    
    // Draw time axis (X-axis)
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top + chartHeight);
    ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
    ctx.stroke();
    
    // Draw time labels
    ctx.fillStyle = '#888';
    ctx.textAlign = 'center';
    
    const timeSteps = 6;
    for (let i = 0; i <= timeSteps; i++) {
      const x = padding.left + (i / timeSteps * chartWidth);
      const dataIndex = Math.floor(i / timeSteps * (visibleData.length - 1));
      if (dataIndex >= 0 && dataIndex < visibleData.length) {
        const date = new Date(visibleData[dataIndex].time);
        
        // Format time label
        const label = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
        
        // Draw grid line
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(x, padding.top);
        ctx.lineTo(x, padding.top + chartHeight);
        ctx.stroke();
        
        // Draw time label
        ctx.fillText(label, x, padding.top + chartHeight + 15);
      }
    }
    
    // Draw moving average line (20 period)
    const periods = 20;
    if (visibleData.length > periods) {
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      
      for (let i = periods - 1; i < visibleData.length; i++) {
        const maSum = visibleData.slice(i - periods + 1, i + 1).reduce((sum, d) => sum + d.close, 0);
        const ma = maSum / periods;
        const x = padding.left + (i - (visibleData.length - 80)) * xScale;
        const y = padding.top + chartHeight - ((ma - paddedMinPrice) / paddedPriceRange * chartHeight);
        
        if (i === periods - 1) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.stroke();
    }
    
    // Draw candles
    visibleData.forEach((candle, i) => {
      const x = padding.left + i * xScale;
      const open = padding.top + chartHeight - ((candle.open - paddedMinPrice) / paddedPriceRange * chartHeight);
      const close = padding.top + chartHeight - ((candle.close - paddedMinPrice) / paddedPriceRange * chartHeight);
      const high = padding.top + chartHeight - ((candle.high - paddedMinPrice) / paddedPriceRange * chartHeight);
      const low = padding.top + chartHeight - ((candle.low - paddedMinPrice) / paddedPriceRange * chartHeight);
      
      // Draw high-low line
      ctx.strokeStyle = candle.close >= candle.open ? '#0ECB81' : '#F6465D';
      ctx.beginPath();
      ctx.moveTo(x + xScale / 2, high);
      ctx.lineTo(x + xScale / 2, low);
      ctx.stroke();
      
      // Draw candle body
      const candleWidth = Math.max(xScale * 0.8, 1);
      ctx.fillStyle = candle.close >= candle.open ? '#0ECB81' : '#F6465D';
      ctx.fillRect(
        x + (xScale - candleWidth) / 2,
        Math.min(open, close),
        candleWidth,
        Math.abs(close - open) || 1
      );
    });
    
    // Draw current price line
    const currentY = padding.top + chartHeight - ((currentPrice - paddedMinPrice) / paddedPriceRange * chartHeight);
    
    ctx.strokeStyle = '#3399FF';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 3]);
    ctx.beginPath();
    ctx.moveTo(padding.left, currentY);
    ctx.lineTo(padding.left + chartWidth, currentY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw current price label
    ctx.fillStyle = '#3399FF';
    ctx.fillRect(padding.left + chartWidth, currentY - 10, 60, 20);
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText(currentPrice.toFixed(1), padding.left + chartWidth + 30, currentY + 4);
  };
  
  const setupDataUpdates = (pair) => {
    // Clear existing interval if any
    if (intervalId) {
      clearInterval(intervalId);
    }
    
    // Set up new interval for this pair
    const newIntervalId = setInterval(() => {
      // Simulate price movement
      setCurrentPrice(prevPrice => {
        const priceChange = prevPrice * (Math.random() * 0.002 - 0.001);
        return +(prevPrice + priceChange).toFixed(1);
      });
      
      // Add new candle or update last candle
      setCandleData(prev => {
        if (prev.length === 0) return prev;
        
        const lastCandle = prev[prev.length - 1];
        const now = new Date();
        const last2Hours = new Date(now);
        last2Hours.setHours(now.getHours() - (now.getHours() % 2));
        last2Hours.setMinutes(0);
        last2Hours.setSeconds(0);
        last2Hours.setMilliseconds(0);
        
        if (lastCandle.time === last2Hours.getTime()) {
          // Update existing candle
          const updatedCandle = {
            ...lastCandle,
            close: currentPrice,
            high: Math.max(lastCandle.high, currentPrice),
            low: Math.min(lastCandle.low, currentPrice),
            volume: lastCandle.volume + Math.random() * 10
          };
          
          return [...prev.slice(0, -1), updatedCandle];
        } else {
          // Add new candle
          const newCandle = {
            date: last2Hours,
            time: last2Hours.getTime(),
            open: lastCandle.close,
            high: Math.max(lastCandle.close, currentPrice),
            low: Math.min(lastCandle.close, currentPrice),
            close: currentPrice,
            volume: Math.random() * 100
          };
          
          return [...prev, newCandle];
        }
      });
      
      // Update order book based on new price
      setOrderBook(generateOrderBookData(currentPrice));
    }, 2000);
    
    // Save the interval ID
    setIntervalId(newIntervalId);
    
    return newIntervalId;
  };
  
  const handlePairChange = (pair) => {
    // Clear existing interval
    if (intervalId) {
      clearInterval(intervalId);
    }
    
    // Update state with new pair
    setCurrentPair(pair);
    setCurrentPrice(pair.basePrice);
    
    // Generate new data for the selected pair
    const newCandles = generateCandleData(30, 0.02, pair.basePrice);
    setCandleData(newCandles);
    
    // Generate new order book
    const newOrderBook = generateOrderBookData(pair.basePrice);
    setOrderBook(newOrderBook);
    
    // Update order price to new current price
    setOrderPrice(pair.basePrice.toFixed(1));
    
    // Setup new data updates for this pair
    setupDataUpdates(pair);
  };
  
  // Initialize data when component mounts
  useEffect(() => {
    // Generate sample data for initial pair
    const candles = generateCandleData(30, 0.02, currentPair.basePrice);
    setCandleData(candles);
    
    const book = generateOrderBookData(currentPrice);
    setOrderBook(book);
    
    // Update order price to current price
    setOrderPrice(currentPrice.toFixed(1));
    
    // Setup data updates
    const id = setupDataUpdates(currentPair);
    
    // Cleanup function
    return () => {
      if (id) {
        clearInterval(id);
      }
    };
  }, []); // Empty dependency array means this runs once on mount
  
  // Draw chart when data changes
  useEffect(() => {
    drawCandleChart();
  }, [candleData, currentPrice]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      drawCandleChart();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [candleData]);
  
  // Format large numbers
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
    return num.toFixed(2);
  };
  
  // Calculate price change
  const priceChange = candleData.length > 0 
    ? ((currentPrice - candleData[0].open) / candleData[0].open * 100)
    : 0;
  
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Header */}
      <div className="border-b border-gray-800 px-4 py-2">
        {/* Trading Pair Selector */}
        <div className="flex overflow-x-auto hide-scrollbar mb-4 pb-2">
          {tradingPairs.map(pair => (
            <button
              key={pair.symbol}
              className={`px-4 py-2 mr-2 rounded-lg whitespace-nowrap ${
                currentPair.symbol === pair.symbol 
                  ? 'bg-yellow-500 text-gray-900 font-medium' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => handlePairChange(pair)}
            >
              {pair.symbol}
            </button>
          ))}
        </div>
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Symbol and price */}
          <div className="flex items-center">
            <div className="mr-4">
              <div className="flex items-center">
                <h1 className="text-xl font-bold">{currentPair.symbol} Perpetual</h1>
              </div>
              <div className="flex items-center mt-1">
                <span className="text-2xl font-bold mr-2">{currentPrice.toFixed(1)}</span>
                <span className={`text-sm ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-gray-400">
              <div className="flex justify-between">
                <span>Mark Price</span>
                <span className="text-white">{(currentPrice - 0.1).toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span>24h High</span>
                <span className="text-white">{(currentPrice * 1.02).toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span>Index Price</span>
                <span className="text-white">{(currentPrice + 0.2).toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span>24h Low</span>
                <span className="text-white">{(currentPrice * 0.98).toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span>Funding Rate</span>
                <span className="text-white">-0.0044% / 06:36:17</span>
              </div>
              <div className="flex justify-between">
                <span>24h Volume</span>
                <span className="text-white">1265188.21 {currentPair.symbol.replace('USDT', '')}</span>
              </div>
            </div>
          </div>
          
          {/* Timeframe selection */}
          <div className="flex border border-gray-800 rounded text-sm">
            <button className={`px-2 py-1 ${timeframe === '1m' ? 'bg-gray-800' : ''}`} onClick={() => setTimeframe('1m')}>1m</button>
            <button className={`px-2 py-1 ${timeframe === '5m' ? 'bg-gray-800' : ''}`} onClick={() => setTimeframe('5m')}>5m</button>
            <button className={`px-2 py-1 ${timeframe === '15m' ? 'bg-gray-800' : ''}`} onClick={() => setTimeframe('15m')}>15m</button>
            <button className={`px-2 py-1 ${timeframe === '1h' ? 'bg-gray-800' : ''}`} onClick={() => setTimeframe('1h')}>1h</button>
            <button className={`px-2 py-1 ${timeframe === '4h' ? 'bg-gray-800' : ''}`} onClick={() => setTimeframe('4h')}>4h</button>
            <button className={`px-2 py-1 ${timeframe === '1d' ? 'bg-gray-800' : ''}`} onClick={() => setTimeframe('1d')}>1d</button>
            <button className={`px-2 py-1 ${timeframe === '1w' ? 'bg-gray-800' : ''}`} onClick={() => setTimeframe('1w')}>1w</button>
          </div>
          
          {/* Chart type and indicators */}
          <div className="flex space-x-2">
            <button className="p-2 rounded border border-gray-800">
              <LineChart className="h-5 w-5" />
            </button>
            <button className="p-2 rounded border border-gray-800">
              <BarChart2 className="h-5 w-5" />
            </button>
            <button className="p-2 rounded border border-gray-800">
              <Settings className="h-5 w-5" />
            </button>
            <button className="p-2 rounded border border-gray-800">
              <Maximize className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col lg:flex-row">
        {/* Chart area - 75% */}
        <div className="lg:w-3/4 border-r border-gray-800 p-2">
          <div className="relative h-[calc(100vh-200px)]">
            <canvas ref={candleChartRef} className="w-full h-full"></canvas>
          </div>
        </div>
        
        {/* Order book and trading form - 25% */}
        <div className="lg:w-1/4">
          <div className="border-b border-gray-800">
            <div className="flex">
              <button className="flex-1 py-2 px-4 text-center font-medium border-b-2 border-yellow-500">Order Book</button>
              <button className="flex-1 py-2 px-4 text-center font-medium text-gray-400">Trades</button>
            </div>
          </div>
          
          {/* Order Book */}
          <div className="h-[40vh] overflow-y-auto p-2">
            <div className="text-xs text-gray-500 flex justify-between mb-1">
              <span>Price(USDT)</span>
              <span>Amount({currentPair.symbol.replace('USDT', '')})</span>
              <span>Total</span>
            </div>
            
            {/* Asks (Sell orders) */}
            <div className="space-y-1">
              {orderBook.asks.map((ask, i) => (
                <div key={`ask-${i}`} className="flex justify-between text-xs">
                  <span className="text-red-500">{ask.price.toFixed(1)}</span>
                  <span>{ask.amount.toFixed(3)}</span>
                  <span>{ask.total.toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            {/* Current price */}
            <div className="my-2 py-1 border-y border-gray-800 flex justify-between items-center">
              <span className="text-lg font-bold">{currentPrice.toFixed(1)}</span>
              <span className={`text-sm ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                {priceChange >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                {Math.abs(priceChange).toFixed(2)}%
              </span>
            </div>
            
            {/* Bids (Buy orders) */}
            <div className="space-y-1">
              {orderBook.bids.map((bid, i) => (
                <div key={`bid-${i}`} className="flex justify-between text-xs">
                  <span className="text-green-500">{bid.price.toFixed(1)}</span>
                  <span>{bid.amount.toFixed(3)}</span>
                  <span>{bid.total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Trading Form */}
          <div className="p-4 border-t border-gray-800">
            <div className="mb-4">
              <div className="flex mb-2">
                <button 
                  className={`flex-1 py-2 text-center font-medium ${orderType === 'limit' ? 'bg-gray-800' : 'text-gray-400'}`}
                  onClick={() => setOrderType('limit')}
                >
                  Limit
                </button>
                <button 
                  className={`flex-1 py-2 text-center font-medium ${orderType === 'market' ? 'bg-gray-800' : 'text-gray-400'}`}
                  onClick={() => setOrderType('market')}
                >
                  Market
                </button>
                <button 
                  className={`flex-1 py-2 text-center font-medium ${orderType === 'stop' ? 'bg-gray-800' : 'text-gray-400'}`}
                  onClick={() => setOrderType('stop')}
                >
                  Stop
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-400 mb-1">Price</div>
                  <div className="flex items-center bg-gray-800 rounded">
                    <input 
                      type="text" 
                      className="bg-transparent p-2 w-full focus:outline-none"
                      value={orderPrice}
                      onChange={(e) => setOrderPrice(e.target.value)}
                      disabled={orderType === 'market'}
                    />
                    <span className="pr-2 text-gray-400">USDT</span>
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-gray-400 mb-1">Amount</div>
                  <div className="flex items-center bg-gray-800 rounded">
                    <input 
                      type="text" 
                      className="bg-transparent p-2 w-full focus:outline-none"
                      value={orderAmount}
                      onChange={(e) => setOrderAmount(e.target.value)}
                    />
                    <span className="pr-2 text-gray-400">{currentPair.symbol.replace('USDT', '')}</span>
                  </div>
                </div>
                
                <div className="flex justify-between py-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="25"
                    className="w-full"
                    onChange={(e) => setOrderAmount((e.target.value / 100 * 1).toFixed(4))}
                  />
                </div>
                
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
                
                <div className="flex space-x-2 mt-4">
                  <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded font-medium">Buy / Long</button>
                  <button className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded font-medium">Sell / Short</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Positions and order info */}
      <div className="border-t border-gray-800 p-4">
        <div className="flex mb-2 border-b border-gray-800">
          <button className="py-2 px-4 border-b-2 border-yellow-500 font-medium">Positions(0)</button>
          <button className="py-2 px-4 text-gray-400 font-medium">Open Orders(2)</button>
          <button className="py-2 px-4 text-gray-400 font-medium">Order History</button>
          <button className="py-2 px-4 text-gray-400 font-medium">Trade History</button>
        </div>
        
        <div className="text-center py-8 text-gray-400">
          No open positions
        </div>
      </div>
    </div>
  );
};

export default TradingView;