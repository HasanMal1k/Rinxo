import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Nav from './components/Nav'
import Hero from './components/Hero'
import CryptoDashboard from './components/CryptoDashboard'
import CryptoTable from './components/CryptoTable'
import HowItWorks from './components/HowItWorks'
import WhatIsRinxo from './components/WhatIsRinxo'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Nav/>
    <Hero/>
    <CryptoDashboard/>
    <CryptoTable/>   
    <HowItWorks/>
    <WhatIsRinxo/>
  </StrictMode>,
)
