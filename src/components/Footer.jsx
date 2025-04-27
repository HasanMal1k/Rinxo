import React from 'react';
import { Twitter, Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="mb-6">
              <img src="./rinxo_logo.svg" alt="Rinxo" className="h-10" />
            </div>
            <p className="text-gray-400 mb-6">
              Rinxo is a leading cryptocurrency trading platform that offers a secure and user-friendly experience for all your digital asset needs.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-yellow-300 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-300 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-300 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-300 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-yellow-300 transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-yellow-300 transition-colors">Buy Crypto</a></li>
              <li><a href="#" className="hover:text-yellow-300 transition-colors">Sell Crypto</a></li>
              <li><a href="#" className="hover:text-yellow-300 transition-colors">Markets</a></li>
              <li><a href="#" className="hover:text-yellow-300 transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-yellow-300 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-yellow-300 transition-colors">Trading Guide</a></li>
              <li><a href="#" className="hover:text-yellow-300 transition-colors">API Documentation</a></li>
              <li><a href="#" className="hover:text-yellow-300 transition-colors">Fees</a></li>
              <li><a href="#" className="hover:text-yellow-300 transition-colors">Security</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Mail size={18} className="mr-3 mt-1 flex-shrink-0" />
                <span>support@rinxo.com</span>
              </li>
              <li className="flex items-start">
                <Phone size={18} className="mr-3 mt-1 flex-shrink-0" />
                <span>+1 (800) 123-4567</span>
              </li>
              <li className="flex items-start">
                <MapPin size={18} className="mr-3 mt-1 flex-shrink-0" />
                <span>123 Crypto Street, Digital City, 10101</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 mt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>© {currentYear} Rinxo. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex flex-wrap gap-4">
              <a href="#" className="hover:text-yellow-300 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-yellow-300 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-yellow-300 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;