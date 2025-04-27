import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './trading.css'
import Nav from './components/Nav'
import Hero from './components/Hero'
import CryptoDashboard from './components/CryptoDashboard'
import CryptoTable from './components/CryptoTable'
import HowItWorks from './components/HowItWorks'
import WhatIsRinxo from './components/WhatIsRinxo'
import Footer from './components/Footer'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Portfolio from './components/Portfolio'
import TradingPage from './components/TradingPage'

// HomePage component that combines all the sections
const HomePage = () => (
  <>
    <Nav />
    <Hero />
    <CryptoDashboard />
    <CryptoTable />   
    <HowItWorks />
    <WhatIsRinxo />
    <Footer />
  </>
)

// DashboardPage component with dashboard layout
const DashboardPage = () => (
  <>
    <Nav />
    <Dashboard />
    <Footer />
  </>
)

// PortfolioPage component
const PortfolioPage = () => (
  <>
    <Nav />
    <Portfolio />
    <Footer />
  </>
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/trading" element={<TradingPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)