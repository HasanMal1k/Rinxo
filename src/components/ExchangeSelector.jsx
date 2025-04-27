import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const exchanges = [
  {
    id: 'binance',
    name: 'Binance',
    logo: './exchange-logos/binance.png',
    pairs: ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'ADAUSDT']
  },
  {
    id: 'coinbase',
    name: 'Coinbase',
    logo: './exchange-logos/coinbase.png',
    pairs: ['BTC-USD', 'ETH-USD', 'SOL-USD', 'ADA-USD', 'DOGE-USD']
  },
  {
    id: 'kraken',
    name: 'Kraken',
    logo: './exchange-logos/kraken.png',
    pairs: ['XBT/USD', 'ETH/USD', 'SOL/USD', 'ADA/USD', 'DOT/USD']
  },
  {
    id: 'kucoin',
    name: 'KuCoin',
    logo: './exchange-logos/kucoin.png',
    pairs: ['BTC-USDT', 'ETH-USDT', 'SOL-USDT', 'KCS-USDT', 'DOT-USDT']
  },
  {
    id: 'bybit',
    name: 'Bybit',
    logo: './exchange-logos/bybit.png',
    pairs: ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'DOGEUSDT', 'SHIBUSDT']
  }
];

const ExchangeSelector = ({ onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentExchange, setCurrentExchange] = useState(exchanges[0]);
  const [currentPair, setCurrentPair] = useState(exchanges[0].pairs[0]);
  
  const handleExchangeSelect = (exchange) => {
    setCurrentExchange(exchange);
    setCurrentPair(exchange.pairs[0]);
    setIsOpen(false);
    onSelect({ exchange: exchange.id, pair: exchange.pairs[0] });
  };
  
  const handlePairSelect = (pair) => {
    setCurrentPair(pair);
    onSelect({ exchange: currentExchange.id, pair });
  };
  
  // Placeholder for exchange logo
  const ExchangeLogoPlaceholder = ({ name }) => (
    <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold">
      {name.substring(0, 1)}
    </div>
  );
  
  return (
    <div className="mb-4">
      <div className="flex items-center gap-4">
        {/* Exchange Selector */}
        <div className="relative">
          <button 
            className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded hover:bg-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {/* Use placeholder for demo - in production you'd use actual logos */}
            <ExchangeLogoPlaceholder name={currentExchange.name} />
            <span>{currentExchange.name}</span>
            <ChevronDown className="h-4 w-4" />
          </button>
          
          {/* Dropdown */}
          {isOpen && (
            <div className="absolute z-50 mt-1 w-60 bg-gray-800 rounded shadow-lg">
              <div className="p-2">
                <input
                  type="text"
                  placeholder="Search exchanges..."
                  className="w-full px-3 py-2 bg-gray-700 rounded text-sm focus:outline-none"
                />
              </div>
              <div className="max-h-60 overflow-y-auto">
                {exchanges.map(exchange => (
                  <button
                    key={exchange.id}
                    className="flex items-center gap-2 px-3 py-2 w-full text-left hover:bg-gray-700"
                    onClick={() => handleExchangeSelect(exchange)}
                  >
                    <ExchangeLogoPlaceholder name={exchange.name} />
                    <span>{exchange.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Trading Pair Selector */}
        <div className="flex overflow-x-auto hide-scrollbar">
          {currentExchange.pairs.map(pair => (
            <button
              key={pair}
              className={`px-3 py-1 whitespace-nowrap ${currentPair === pair ? 'text-yellow-500 border-b-2 border-yellow-500' : 'text-gray-400'}`}
              onClick={() => handlePairSelect(pair)}
            >
              {pair}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExchangeSelector;