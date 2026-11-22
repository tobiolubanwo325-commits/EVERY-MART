/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Ship, Plane, Truck, Globe, ShieldCheck, FileText, BarChart3, Cpu,
  Bell, Search, Lock, Settings, Terminal, Video, Users, CheckCircle2,
  AlertTriangle, Clock, DollarSign, RefreshCw, Download, Plus,
  ChevronRight, Sparkles, Database, Activity, Wifi, WifiOff, ArrowUpRight,
  TrendingUp, Package, MapPin, Layers, Key, Send, X, Eye, ShoppingBag,
  User, Heart, Smartphone, Home, Sparkle, ZoomIn, ZoomOut, Compass,
  SmartphoneNfc, PhoneCall, Check, Globe2, ChevronDown, ChevronUp, ArrowLeft, Bot, MessageSquare, Minus, Maximize2, Minimize2, ShieldAlert, CheckCircle, XCircle, Gift, Sparkles as SparklesIcon
} from 'lucide-react';

// Types
interface Product {
  id: string;
  name: string;
  category: string;
  priceUSD: number;
  location: string;
  image: string;
  rating: number;
  seller: string;
  description: string;
}

interface Shipment {
  id: string;
  trackingNumber: string;
  origin: string;
  destination: string;
  mode: 'Ocean' | 'Air' | 'Rail' | 'Express';
  status: 'In Transit' | 'Customs Hold' | 'Out for Delivery' | 'Delivered' | 'Exception';
  eta: string;
  weight: string;
  cargo: string;
  valueUSD: number;
  coordinates: { lat: number; lng: number };
  timeline: { title: string; time: string; location: string; customsStatus: string; completed: boolean }[];
}

interface CountryInfo {
  name: string;
  code: string;
  flag: string;
  currency: string;
  symbol: string;
  rate: number;
  lang: string;
  langName: string;
  coordinates: { lat: number; lng: number };
}

interface SellerApplication {
  id: string;
  storeName: string;
  country: string;
  phone: string;
  sellingCategory: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: string;
}

const WORLD_COUNTRIES: CountryInfo[] = [
  { name: 'Nigeria', code: '+234', flag: '🇳🇬', currency: 'NGN', symbol: '₦', rate: 1500, lang: 'en', langName: 'English', coordinates: { lat: 9.0820, lng: 8.6753 } },
  { name: 'United States', code: '+1', flag: '🇺🇸', currency: 'USD', symbol: '$', rate: 1, lang: 'en', langName: 'English', coordinates: { lat: 37.0902, lng: -95.7129 } },
  { name: 'Spain', code: '+34', flag: '🇪🇸', currency: 'EUR', symbol: '€', rate: 0.92, lang: 'es', langName: 'Español', coordinates: { lat: 40.4637, lng: -3.7492 } },
  { name: 'United Kingdom', code: '+44', flag: '🇬🇧', currency: 'GBP', symbol: '£', rate: 0.79, lang: 'en', langName: 'English', coordinates: { lat: 55.3781, lng: -3.4360 } },
  { name: 'Japan', code: '+81', flag: '🇯🇵', currency: 'JPY', symbol: '¥', rate: 154, lang: 'ja', langName: '日本語', coordinates: { lat: 36.2048, lng: 138.2529 } },
  { name: 'France', code: '+33', flag: '🇫🇷', currency: 'EUR', symbol: '€', rate: 0.92, lang: 'fr', langName: 'Français', coordinates: { lat: 46.6034, lng: 1.8883 } },
  { name: 'India', code: '+91', flag: '🇮🇳', currency: 'INR', symbol: '₹', rate: 83, lang: 'hi', langName: 'हिन्दी', coordinates: { lat: 20.5937, lng: 78.9629 } },
  { name: 'United Arab Emirates', code: '+971', flag: '🇦🇪', currency: 'AED', symbol: 'AED', rate: 3.67, lang: 'ar', langName: 'العربية', coordinates: { lat: 23.4241, lng: 53.8478 } },
  { name: 'China', code: '+86', flag: '🇨🇳', currency: 'CNY', symbol: '¥', rate: 7.23, lang: 'zh', langName: '中文', coordinates: { lat: 35.8617, lng: 104.1954 } },
  { name: 'Germany', code: '+49', flag: '🇩🇪', currency: 'EUR', symbol: '€', rate: 0.92, lang: 'de', langName: 'Deutsch', coordinates: { lat: 51.1657, lng: 10.4515 } },
  { name: 'Brazil', code: '+55', flag: '🇧🇷', currency: 'BRL', symbol: 'R$', rate: 5.4, lang: 'pt', langName: 'Português', coordinates: { lat: -14.2350, lng: -51.9253 } },
  { name: 'Canada', code: '+1', flag: '🇨🇦', currency: 'CAD', symbol: 'CA$', rate: 1.38, lang: 'en', langName: 'English', coordinates: { lat: 56.1304, lng: -106.3468 } },
  { name: 'Australia', code: '+61', flag: '🇦🇺', currency: 'AUD', symbol: 'AU$', rate: 1.52, lang: 'en', langName: 'English', coordinates: { lat: -25.2744, lng: 133.7751 } },
  { name: 'Italy', code: '+39', flag: '🇮🇹', currency: 'EUR', symbol: '€', rate: 0.92, lang: 'it', langName: 'Italiano', coordinates: { lat: 41.8719, lng: 12.5674 } },
  { name: 'Mexico', code: '+52', flag: '🇲🇽', currency: 'MXN', symbol: 'MX$', rate: 18.5, lang: 'es', langName: 'Español', coordinates: { lat: 23.6345, lng: -102.5528 } },
  { name: 'South Africa', code: '+27', flag: '🇿🇦', currency: 'ZAR', symbol: 'R', rate: 18.2, lang: 'en', langName: 'English', coordinates: { lat: -30.5595, lng: 22.9375 } },
  { name: 'Ghana', code: '+233', flag: '🇬🇭', currency: 'GHS', symbol: 'GH₵', rate: 15.5, lang: 'en', langName: 'English', coordinates: { lat: 7.9465, lng: -1.0232 } }
];

const CATEGORIES = [
  { id: 'phones', name: 'Phones', icon: Smartphone },
  { id: 'electronics', name: 'Electronics', icon: Cpu },
  { id: 'home', name: 'Home', icon: Home },
  { id: 'furniture', name: 'Furniture', icon: Package },
  { id: 'beauty', name: 'Beauty', icon: Sparkles },
  { id: 'cars', name: 'Cars', icon: Truck },
  { id: 'food', name: 'Raw Food', icon: Globe },
  { id: 'baby', name: 'Baby', icon: Heart },
  { id: 'sports', name: 'Sports', icon: Activity },
  { id: 'fashion', name: 'Fashion', icon: ShoppingBag }
];

const MOCK_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Italian Pink Rose Stiletto Heels', category: 'fashion', priceUSD: 180, location: 'Milan / Lagos', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80', rating: 4.8, seller: 'EVERY MART Official', description: 'Handcrafted Italian designer pink rose stiletto heels for wedding royalty. Premium calfskin with crystal finish.' },
  { id: 'p2', name: 'Royal Rose Silk Gown', category: 'fashion', priceUSD: 240, location: 'Lagos', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80', rating: 4.9, seller: 'Galaxy Luxury', description: 'Exquisite deep pink and gold silk gown tailored with soft floral rose embroidery.' },
  { id: 'p3', name: 'Designer Rose Cocktail Dress', category: 'fashion', priceUSD: 135, location: 'Abuja', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80', rating: 4.7, seller: 'Orbit Styles', description: 'Trendy and chic rose-pink dress suitable for elite galas and wedding celebrations.' },
  { id: 'p4', name: 'Samsung Galaxy Ultra 5G Pink Gold', category: 'phones', priceUSD: 1200, location: 'Lagos', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80', rating: 4.9, seller: 'TechHub Global', description: 'Flagship-grade smartphone in rose gold edition featuring Dynamic AMOLED display and 200MP camera.' },
  { id: 'p5', name: 'Infinix Note Pro Elite', category: 'phones', priceUSD: 450, location: 'Ikeja', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80', rating: 4.6, seller: 'Mobile World', description: 'Blazing fast processor, curved 120Hz AMOLED display, and 120W HyperCharge technology.' },
  { id: 'p6', name: 'Xiaomi Redmi Flagship Note', category: 'phones', priceUSD: 380, location: 'Lagos', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80', rating: 4.7, seller: 'Gadget Express', description: 'Crystal clear 200MP camera system, lightning fast charging, and premium glass back.' },
  { id: 'p7', name: 'Luxury Baby Care Gift Set', category: 'baby', priceUSD: 95, location: 'Port Harcourt', image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80', rating: 5.0, seller: 'BabyCare Store', description: '100% organic cotton baby garments and medical-grade silicone essentials in a royal gift box.' },
  { id: 'p8', name: 'Executive Italian Rose Leather Bag', category: 'fashion', priceUSD: 350, location: 'London / Lagos', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80', rating: 4.9, seller: 'Artisan Leather', description: 'Full-grain pink rose leather executive handbag with 24k gold-plated hardware.' }
];

const INITIAL_SHIPMENTS: Shipment[] = [
  {
    id: 'shp-101',
    trackingNumber: 'EVY-9942-PAC',
    origin: 'Shanghai Port (SHA)',
    destination: 'Los Angeles Port (LAX)',
    mode: 'Ocean',
    status: 'In Transit',
    eta: '2026-12-04 14:00',
    weight: '24,500 kg',
    cargo: 'Consumer Electronics (5,000 units)',
    valueUSD: 320000,
    coordinates: { lat: 28.5, lng: -145.2 },
    timeline: [
      { title: 'Container Loaded', time: 'Nov 18, 08:30', location: 'Shanghai Port', customsStatus: 'Export Manifest Cleared', completed: true },
      { title: 'Customs Cleared Export', time: 'Nov 18, 22:00', location: 'Shanghai Customs', customsStatus: 'Inspection Passed (HS 8471)', completed: true },
      { title: 'Vessel Departed', time: 'Nov 19, 04:00', location: 'East China Sea', customsStatus: 'En Route to Pacific Waypoint', completed: true },
      { title: 'Arrival at LAX', time: 'Dec 04, 14:00', location: 'Port of Los Angeles', customsStatus: 'Pending US Customs Entry', completed: false }
    ]
  },
  {
    id: 'shp-102',
    trackingNumber: 'EVY-8831-EUR',
    origin: 'Frankfurt Hub (FRA)',
    destination: 'New York JFK (JFK)',
    mode: 'Air',
    status: 'Customs Hold',
    eta: '2026-11-24 18:30',
    weight: '1,200 kg',
    cargo: 'Medical Diagnostics',
    valueUSD: 130000,
    coordinates: { lat: 45.2, lng: -38.4 },
    timeline: [
      { title: 'Cargo Received', time: 'Nov 21, 10:00', location: 'Frankfurt Terminal', customsStatus: 'Cold Chain Verified (-20°C)', completed: true },
      { title: 'Flight Departed', time: 'Nov 21, 14:20', location: 'Frankfurt Airport', customsStatus: 'Airway Bill LH-404 Executed', completed: true },
      { title: 'Customs Review', time: 'Nov 22, 02:00', location: 'US Customs JFK', customsStatus: 'Hold: Additional FDA Document Required', completed: false }
    ]
  },
  {
    id: 'shp-103',
    trackingNumber: 'EVY-5510-EU',
    origin: 'Rotterdam Port',
    destination: 'Vienna Center',
    mode: 'Rail',
    status: 'In Transit',
    eta: '2026-11-25 11:00',
    weight: '32,000 kg',
    cargo: 'Solar Panels',
    valueUSD: 98000,
    coordinates: { lat: 50.1, lng: 8.6 },
    timeline: [
      { title: 'Loaded Train', time: 'Nov 21, 11:00', location: 'Rotterdam', customsStatus: 'EU Transit Declaration Approved', completed: true },
      { title: 'Vienna Arrival', time: 'Nov 25, 11:00', location: 'Vienna Hub', customsStatus: 'Scheduled Final Clearance', completed: false }
    ]
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'products' | 'live' | 'cart' | 'wallet' | 'seller' | 'radar' | 'orders' | 'product-detail' | 'owner-dashboard' | 'orbit-feature'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<Product[]>([]);
  const [walletBalanceUSD, setWalletBalanceUSD] = useState(1000);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Global Country Sync state
  const [currentCountry, setCurrentCountry] = useState<CountryInfo>(WORLD_COUNTRIES[0]);
  const [countrySearchQuery, setCountrySearchQuery] = useState('');
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);

  // Auth modal state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  // Seller Applications state for Owner Dashboard
  const [sellerApplications, setSellerApplications] = useState<SellerApplication[]>([
    { id: 'sel-1', storeName: 'Lagos Royal Rose Boutique', country: 'Nigeria', phone: '+234 8031234567', sellingCategory: 'Pink Rose Fashion', status: 'Pending', submittedAt: '2026-11-22 04:30' },
    { id: 'sel-2', storeName: 'Milan Gold & Rose', country: 'Spain', phone: '+34 612345678', sellingCategory: 'Luxury Shoes & Bags', status: 'Pending', submittedAt: '2026-11-22 05:10' }
  ]);
  const [newStoreName, setNewStoreName] = useState('My Rose Store');
  const [newSellerCategory, setNewSellerCategory] = useState('Smartphones & Fashion');
  const [sellerStatusMessage, setSellerStatusMessage] = useState<string | null>(null);

  // PWA Install prompt state
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(true);

  // Radar Map state
  const [mapZoom, setMapZoom] = useState(1);
  const [showShips, setShowShips] = useState(true);
  const [showPlanes, setShowPlanes] = useState(true);
  const [showTrucks, setShowTrucks] = useState(true);
  const [showHistoricalData, setShowHistoricalData] = useState(true);
  const [showWeatherPatterns, setShowWeatherPatterns] = useState(true);
  const [hoveredShipment, setHoveredShipment] = useState<Shipment | null>(null);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [clickedCoords, setClickedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const mapCenterOffset = useMemo(() => {
    if (clickedCoords) {
      return { x: clickedCoords.lng * 0.8, y: -clickedCoords.lat * 0.8 };
    }
    const latDiff = currentCountry.coordinates.lat;
    const lngDiff = currentCountry.coordinates.lng;
    return { x: lngDiff * 0.8, y: -latDiff * 0.8 };
  }, [currentCountry, clickedCoords]);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const lat = Math.round(-y / 4 * 100) / 100;
    const lng = Math.round(x / 4 * 100) / 100;

    setClickedCoords({ lat, lng });
    setToastMessage(`Location Selected: Lat ${lat}°, Lng ${lng}°`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // EVERY MART / EVERY MART AI Chat state
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiMinimized, setAiMinimized] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiMessages, setAiMessages] = useState<{ sender: 'user' | 'ai'; text: string; products?: Product[] }[]>([
    {
      sender: 'ai',
      text: 'Hello! I am EVERY MART AI. Ask me for any luxury product (e.g., "I want shoes" or "pink rose dress"), and I will show you real product photos with prices!',
      products: MOCK_PRODUCTS.slice(0, 4)
    }
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  // Expanded shipment IDs in 'My orders'
  const [expandedShipments, setExpandedShipments] = useState<Record<string, boolean>>({ 'shp-101': true });

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      alert("To install EVERY MART:\n- On iPhone/iPad: Tap the Share button in Safari and select 'Add to Home Screen'.\n- On Android: Tap the browser menu (3 dots) and select 'Install app' or 'Add to Home screen'.");
    }
  };

  const filteredCountries = useMemo(() => {
    return WORLD_COUNTRIES.filter(c =>
      c.name.toLowerCase().includes(countrySearchQuery.toLowerCase()) ||
      c.code.includes(countrySearchQuery) ||
      c.currency.toLowerCase().includes(countrySearchQuery.toLowerCase())
    );
  }, [countrySearchQuery]);

  const formatPrice = (priceUSD: number) => {
    const converted = priceUSD * currentCountry.rate;
    return `${currentCountry.symbol}${converted.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => {
      const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.seller.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleSendAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    const userText = aiQuery;
    setAiMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setAiQuery('');
    setAiLoading(true);

    const qLower = userText.toLowerCase();
    let matchedProducts: Product[] = [];
    if (qLower.includes('shoe') || qLower.includes('pink') || qLower.includes('heel') || qLower.includes('fashion') || qLower.includes('rose')) {
      matchedProducts = MOCK_PRODUCTS.filter(p => p.category === 'fashion');
    } else if (qLower.includes('phone') || qLower.includes('samsung') || qLower.includes('infinix')) {
      matchedProducts = MOCK_PRODUCTS.filter(p => p.category === 'phones');
    } else {
      matchedProducts = MOCK_PRODUCTS.slice(0, 4);
    }

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userText, country: currentCountry.name, currency: currentCountry.currency })
      });
      const data = await res.json();
      setAiMessages(prev => [...prev, {
        sender: 'ai',
        text: data.response || `Here are top luxury selections matching "${userText}" in ${currentCountry.name} (${currentCountry.currency}):`,
        products: matchedProducts.length > 0 ? matchedProducts : MOCK_PRODUCTS.slice(0, 4)
      }]);
    } catch (err) {
      setAiMessages(prev => [...prev, {
        sender: 'ai',
        text: `Here are matching luxury items available on EVERY MART:`,
        products: matchedProducts.length > 0 ? matchedProducts : MOCK_PRODUCTS.slice(0, 4)
      }]);
    } finally {
      setAiLoading(false);
    }
  };

  const pendingSellerCount = sellerApplications.filter(s => s.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-[#0d0714] text-slate-100 font-sans antialiased selection:bg-pink-500 selection:text-white relative overflow-x-hidden">

      {/* BACKGROUND DECORATIVE GLOWS & ROSES AESTHETIC */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-rose-500/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* TOAST NOTIFICATION FOR MAP CLICK */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3.5 rounded-2xl shadow-2xl font-bold text-xs flex items-center space-x-2 animate-in fade-in slide-in-from-top-4 duration-300 border border-pink-300">
          <MapPin className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* PWA INSTALL BANNER */}
      {showInstallBanner && (
        <div className="bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white px-4 py-3 flex items-center justify-between text-xs font-bold shadow-xl z-50 sticky top-0 backdrop-blur-md">
          <div className="flex items-center space-x-2">
            <SmartphoneNfc className="w-4 h-4 text-pink-200" />
            <span>Install EVERY MART on your phone to open instantly like WhatsApp!</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-1.5 bg-slate-950 text-pink-400 rounded-xl shadow hover:bg-slate-900 transition font-black border border-pink-500/50"
            >
              Install EVERY MART
            </button>
            <button onClick={() => setShowInstallBanner(false)} className="p-1 hover:bg-pink-700/50 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TOP HEADER */}
      <header className="border-b border-pink-500/30 bg-[#0d0714]/90 backdrop-blur-md sticky top-0 z-40 shadow-lg shadow-pink-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo with Pink Rose Phoenix */}
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setActiveTab('home')}>
            <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-pink-400 shadow-xl shadow-pink-500/30 flex items-center justify-center bg-slate-900 group-hover:scale-105 transition">
              <img
                src="/public/assets/aistudio/WhatsApp_Image_2026-11-22_at_2.14.48_PM_8d0c1fa2.jpeg"
                alt="EVERY MART Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="font-black text-lg tracking-wider bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300 bg-clip-text text-transparent drop-shadow">
                EVERY MART
              </div>
              <p className="text-[11px] text-pink-300/80 tracking-widest font-bold">
                BY SOFT LIFE
              </p>
            </div>
          </div>

          {/* Search bar top */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-pink-400" />
              <input
                type="text"
                placeholder="Search shoes, rose gowns, phones, luxury..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-900/90 border border-pink-500/40 text-xs text-slate-100 placeholder-pink-300/60 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-inner"
              />
            </div>
          </div>

          {/* Global Country Selector & Nav Actions */}
          <div className="flex items-center space-x-3 text-xs">
            
            <div className="relative">
              <button
                onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                className="flex items-center space-x-2 bg-slate-900 border border-pink-500/40 text-pink-300 px-3.5 py-2 rounded-2xl font-bold hover:border-pink-400 transition shadow"
              >
                <span>{currentCountry.flag}</span>
                <span>{currentCountry.name}</span>
                <span className="text-[10px] text-amber-300">({currentCountry.currency})</span>
                <ChevronDown className="w-3.5 h-3.5 text-pink-400" />
              </button>

              {countryDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-pink-500/40 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-3 border-b border-pink-500/20 bg-slate-950">
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-pink-400" />
                      <input
                        type="text"
                        placeholder="Search all 195+ countries..."
                        value={countrySearchQuery}
                        onChange={(e) => setCountrySearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-pink-500/30 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-pink-500"
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto p-1 divide-y divide-slate-800/50">
                    {filteredCountries.map(c => (
                      <button
                        key={c.name}
                        onClick={() => {
                          setCurrentCountry(c);
                          setCountryDropdownOpen(false);
                          setCountrySearchQuery('');
                          setClickedCoords(null);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between text-xs transition ${
                          currentCountry.name === c.name ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold' : 'hover:bg-slate-800 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span>{c.flag}</span>
                          <span>{c.name}</span>
                          <span className="opacity-75 font-mono">({c.code})</span>
                        </div>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-950/30 text-amber-300">{c.currency}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Owner Dashboard Button */}
            <button
              onClick={() => setActiveTab('owner-dashboard')}
              className="relative px-3.5 py-2 rounded-2xl bg-slate-900 border border-pink-500/40 text-pink-400 font-bold hover:bg-pink-500 hover:text-white transition flex items-center space-x-1 shadow"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Owner Admin</span>
              {pendingSellerCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center animate-bounce">
                  {pendingSellerCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setActiveTab('cart')}
              className="relative p-2.5 rounded-2xl bg-slate-900 border border-pink-500/40 text-pink-300 hover:bg-pink-500 hover:text-white transition shadow"
            >
              <ShoppingBag className="w-4 h-4" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pink-500 text-white font-bold text-[10px] flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>

            {userLoggedIn ? (
              <button
                onClick={() => setActiveTab('wallet')}
                className="px-4 py-2 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-bold shadow-lg shadow-pink-500/20 transition flex items-center space-x-1.5"
              >
                <User className="w-3.5 h-3.5" />
                <span>Account</span>
              </button>
            ) : (
              <button
                onClick={() => { setAuthMode('login'); setAuthModalOpen(true); }}
                className="px-4 py-2 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-bold shadow-lg shadow-pink-500/20 transition flex items-center space-x-1.5"
              >
                <span>Sign in</span>
              </button>
            )}

          </div>

        </div>
      </header>

      {/* NAVBAR LINKS WITH USER REQUESTED PHRASES */}
      <nav className="border-b border-pink-500/20 bg-slate-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-6 overflow-x-auto py-3 text-xs font-bold tracking-wide">
          {[
            { id: 'home', label: 'Home' },
            { id: 'products', label: 'Browse Products' },
            { id: 'live', label: 'Live shopping' },
            { id: 'wallet', label: 'My wallet' },
            { id: 'orders', label: 'My orders' },
            { id: 'seller', label: 'Sell on EVERY MART' },
            { id: 'radar', label: 'Global Fleet Radar' },
            { id: 'orbit-feature', label: 'Choose your orbit' },
            { id: 'owner-dashboard', label: 'Owner Dashboard' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`whitespace-nowrap transition flex items-center space-x-1 ${
                activeTab === tab.id
                  ? 'text-pink-400 border-b-2 border-pink-500 pb-0.5'
                  : 'text-slate-300 hover:text-pink-300'
              }`}
            >
              <span>{tab.label}</span>
              {tab.id === 'owner-dashboard' && pendingSellerCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* MAIN VIEW CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ================= 1. HOME VIEW (REDESIGNED LUXURY WITH HAPPY PEOPLE & ROSES) ================= */}
        {activeTab === 'home' && (
          <div className="space-y-12">
            
            {/* HERO BANNER - WEDDING INVITATION LUXURY STYLE WITH WOMAN IN PINK ROSE DRESS */}
            <div className="relative rounded-3xl overflow-hidden border-2 border-pink-500/40 bg-gradient-to-r from-slate-950 via-[#1a0b25] to-pink-950 p-8 sm:p-14 shadow-2xl shadow-pink-950/50">
              <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-40 bg-cover bg-center hidden md:block mix-blend-luminosity hover:mix-blend-normal transition duration-700" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80')` }}></div>
              
              <div className="max-w-xl space-y-6 relative z-10">
                <span className="px-4 py-1.5 rounded-full bg-pink-500/20 border border-pink-400/50 text-pink-300 text-xs font-black tracking-widest uppercase shadow">
                  🌹 EVERY MART LUXURY COLLECTION • 195+ COUNTRIES
                </span>
                
                <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight drop-shadow-md">
                  A little closer, <span className="bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300 bg-clip-text text-transparent">voice by voice.</span>
                </h1>

                <p className="text-sm sm:text-base text-pink-100/90 leading-relaxed font-medium">
                  Be there. Be heard. Choose your orbit. Discover breathtaking fashion, pink rose dresses, luxury jewelry, and smartphones from verified global vendors in {currentCountry.name}.
                </p>

                {/* Feature highlight badges as requested */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-3 py-1 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-bold">✨ Be there Be heard</span>
                  <span className="px-3 py-1 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold">🪐 Choose your orbit</span>
                  <span className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">💎 Frames & gifts</span>
                </div>

                <div className="pt-4 flex items-center space-x-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-3.5 w-4 h-4 text-pink-400" />
                    <input
                      type="text"
                      placeholder="Search pink rose dresses, shoes, phones..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-950 border border-pink-500/50 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-xl"
                    />
                  </div>
                  <button
                    onClick={() => setActiveTab('products')}
                    className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-black text-xs shadow-xl shadow-pink-500/30 transition whitespace-nowrap"
                  >
                    Explore Shop
                  </button>
                </div>
              </div>
            </div>

            {/* HAPPY PEOPLE & WEDDING INVITATION BANNER SHOWCASE */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="relative rounded-3xl overflow-hidden border border-pink-500/30 h-64 group shadow-xl">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80" alt="Happy woman in pink rose dress" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex flex-col justify-end p-6">
                  <span className="text-pink-400 text-[10px] font-black uppercase tracking-widest">Pink Rose Collection</span>
                  <h3 className="text-white font-bold text-base">Elegance in Every Thread</h3>
                </div>
              </div>

              <div className="relative rounded-3xl overflow-hidden border border-pink-500/30 h-64 group shadow-xl">
                <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=600&q=80" alt="People laughing and talking" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex flex-col justify-end p-6">
                  <span className="text-amber-400 text-[10px] font-black uppercase tracking-widest">Voice by Voice</span>
                  <h3 className="text-white font-bold text-base">Connected Globally</h3>
                </div>
              </div>

              <div className="relative rounded-3xl overflow-hidden border border-pink-500/30 h-64 group shadow-xl">
                <img src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=80" alt="Wedding invitation romance" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex flex-col justify-end p-6">
                  <span className="text-rose-400 text-[10px] font-black uppercase tracking-widest">Frames & Gifts</span>
                  <h3 className="text-white font-bold text-base">Frames of Pure Joy</h3>
                </div>
              </div>
            </div>

            {/* CATEGORIES BAR */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black text-pink-400 flex items-center space-x-2">
                  <SparklesIcon className="w-4 h-4 text-pink-400" />
                  <span>Shop by Category</span>
                </h2>
                <button onClick={() => { setSelectedCategory('all'); setActiveTab('products'); }} className="text-xs text-pink-300 font-bold hover:underline">View all</button>
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                {CATEGORIES.map(cat => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => { setSelectedCategory(cat.id); setActiveTab('products'); }}
                      className={`p-3 rounded-2xl border flex flex-col items-center justify-center space-y-2 transition ${
                        isSelected
                          ? 'bg-gradient-to-r from-pink-500 to-rose-500 border-pink-400 text-white shadow-lg shadow-pink-500/30'
                          : 'bg-slate-900 border-pink-500/20 text-slate-200 hover:border-pink-500/50'
                      }`}
                    >
                      <Icon className="w-5 h-5 text-pink-400 group-hover:text-white" />
                      <span className="text-[10px] font-bold text-center">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TRENDING PRODUCTS WITH REAL LUXURY PHOTOS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black text-pink-400">Trending Luxury on EVERY MART</h2>
                <button onClick={() => setActiveTab('products')} className="text-xs text-pink-300 font-bold hover:underline">Browse all products</button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {filteredProducts.slice(0, 8).map(prod => (
                  <div
                    key={prod.id}
                    onClick={() => { setSelectedProduct(prod); setActiveTab('product-detail'); }}
                    className="p-4 rounded-3xl border border-pink-500/30 bg-slate-900/90 flex flex-col justify-between space-y-3 group hover:border-pink-500/80 hover:shadow-2xl hover:shadow-pink-500/20 transition cursor-pointer"
                  >
                    <div className="relative h-48 rounded-2xl bg-slate-950 overflow-hidden border border-pink-500/20">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        loading="lazy"
                      />
                      <span className="absolute top-3 left-3 text-[10px] px-2.5 py-1 rounded-full bg-pink-500 text-white font-black shadow">
                        ★ {prod.rating}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-slate-100 group-hover:text-pink-400 transition truncate">{prod.name}</h3>
                      <div className="text-[10px] text-pink-300 mt-0.5">📍 {prod.location} • {prod.seller}</div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-pink-500/20">
                      <span className="font-black text-sm text-pink-400">{formatPrice(prod.priceUSD)}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); setCart([...cart, prod]); }}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white text-xs font-black transition shadow-md shadow-pink-500/20"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SMALL NUMBERS SIMPLE MATH & FRAMES & GIFTS BANNER */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-8 rounded-3xl border border-pink-500/40 bg-gradient-to-br from-pink-950/40 via-slate-900 to-slate-900 space-y-3 shadow-xl">
                <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-black">SMALL NUMBERS SIMPLE MATH</span>
                <h3 className="text-xl font-black text-white">Transparent Royal Pricing</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  No hidden fees, zero high commissions. Calculate your shipping and split payments in seconds with our transparent mathematical pricing model.
                </p>
              </div>

              <div className="p-8 rounded-3xl border border-rose-500/40 bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-900 space-y-3 shadow-xl">
                <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-black">FRAMES & GIFTS</span>
                <h3 className="text-xl font-black text-white">Gifts of Pure Joy</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Send luxury rose boxes, digital memory frames, and surprise gift packages to your loved ones anywhere in the world instantly.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* ================= CHOOSE YOUR ORBIT FEATURE VIEW ================= */}
        {activeTab === 'orbit-feature' && (
          <div className="space-y-6 max-w-3xl mx-auto py-6">
            <div className="text-center space-y-3">
              <span className="px-4 py-1.5 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-black uppercase tracking-widest">
                🪐 Choose Your Orbit
              </span>
              <h2 className="text-3xl font-black text-white">Select Your Lifestyle & Logistics Orbit</h2>
              <p className="text-xs text-slate-300 max-w-lg mx-auto">
                Tailor your EVERY MART experience. Choose your regional shipping orbit, currency preference, and exclusive vendor privileges.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              {[
                { title: 'Royal Fashion Orbit', desc: 'VIP access to Milan, Paris & Lagos pink rose couture collections.', price: 'Free Tier', active: true },
                { title: 'Global Express Orbit', desc: 'Priority air freight with guaranteed 48-hour customs clearance.', price: 'Gold Tier', active: false },
                { title: 'Soft Life Unlimited', desc: 'Zero platform fees, dedicated concierge, and insured escrow protection.', price: 'Royalty Tier', active: false }
              ].map((orbit, i) => (
                <div key={i} className={`p-6 rounded-3xl border ${orbit.active ? 'border-pink-500 bg-slate-900 shadow-2xl shadow-pink-500/20' : 'border-pink-500/20 bg-slate-950'} space-y-4 flex flex-col justify-between`}>
                  <div className="space-y-2">
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-pink-500/20 text-pink-300">{orbit.price}</span>
                    <h3 className="text-base font-bold text-white">{orbit.title}</h3>
                    <p className="text-xs text-slate-300">{orbit.desc}</p>
                  </div>
                  <button
                    onClick={() => alert(`Successfully selected ${orbit.title}!`)}
                    className={`w-full py-2.5 rounded-xl text-xs font-black transition ${orbit.active ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg' : 'bg-slate-800 text-pink-300 hover:bg-slate-700'}`}
                  >
                    {orbit.active ? 'Active Orbit' : 'Join Orbit'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 2. PRODUCTS PAGE ================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-pink-400">EVERY MART Luxury Marketplace</h2>
                <p className="text-xs text-slate-400">Browse phones, fashion, electronics, and verified vendor goods ({currentCountry.currency})</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {filteredProducts.map(prod => (
                <div
                  key={prod.id}
                  onClick={() => { setSelectedProduct(prod); setActiveTab('product-detail'); }}
                  className="p-4 rounded-3xl border border-pink-500/30 bg-slate-900/90 flex flex-col justify-between space-y-3 cursor-pointer group hover:border-pink-500/80 transition"
                >
                  <div className="h-48 rounded-2xl bg-slate-950 overflow-hidden border border-pink-500/20">
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" loading="lazy" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-slate-100 group-hover:text-pink-400 transition truncate">{prod.name}</h3>
                    <div className="text-[10px] text-pink-300 mt-0.5">📍 {prod.location} • {prod.seller}</div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-pink-500/20">
                    <span className="font-black text-sm text-pink-400">{formatPrice(prod.priceUSD)}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); setCart([...cart, prod]); }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white text-xs font-black transition shadow"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 3. PRODUCT DETAILS PAGE ================= */}
        {activeTab === 'product-detail' && selectedProduct && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <button
              onClick={() => setActiveTab('products')}
              className="flex items-center space-x-2 text-xs text-pink-400 font-bold hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Marketplace</span>
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-8 rounded-3xl border border-pink-500/40 bg-slate-900/95 shadow-2xl">
              <div className="h-80 rounded-2xl bg-slate-950 border border-pink-500/20 overflow-hidden shadow-inner flex items-center justify-center">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
              </div>

              <div className="space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-300 text-xs font-black uppercase">
                    {selectedProduct.category}
                  </span>
                  <h1 className="text-2xl font-black text-slate-100">{selectedProduct.name}</h1>
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="text-pink-400 font-bold">★ {selectedProduct.rating} Rating</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-pink-300">Seller: {selectedProduct.seller}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-400">📍 {selectedProduct.location}</span>
                  </div>
                  <div className="text-3xl font-black text-pink-400 pt-2">
                    {formatPrice(selectedProduct.priceUSD)}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-pink-500/20">
                    {selectedProduct.description}
                  </p>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => { setCart([...cart, selectedProduct]); alert(`${selectedProduct.name} added to cart!`); }}
                    className="flex-1 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-pink-500/40 text-pink-300 font-bold text-xs transition"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => { setCart([...cart, selectedProduct]); setActiveTab('cart'); }}
                    className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-black text-xs shadow-xl shadow-pink-500/30 transition"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 4. LIVE SHOPPING ================= */}
        {activeTab === 'live' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-black text-pink-400">EVERY MART Live Shopping</h2>
              <p className="text-xs text-slate-400">Watch luxury vendors show pink rose collections in real-time, ask questions and buy instantly.</p>
            </div>

            <div className="p-6 rounded-3xl border border-pink-500/30 bg-slate-900/80 space-y-4">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></span>
                <span className="font-bold text-sm text-rose-400">LIVE NOW</span>
              </div>

              <div className="relative h-72 rounded-2xl bg-slate-950 border border-pink-500/20 flex items-center justify-center overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80"
                  alt="Live show"
                  className="absolute inset-0 w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/80 to-pink-950/40 flex items-center justify-center">
                  <div className="text-center space-y-2 z-10">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xl flex items-center justify-center mx-auto shadow-lg">
                      🌹
                    </div>
                    <div className="font-bold text-sm text-white">Pink Rose Runway & Stiletto Showcase</div>
                    <div className="text-xs text-pink-300">EVERY MART Official Luxury Stream</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 5. WALLET ================= */}
        {activeTab === 'wallet' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-black text-pink-400">MY WALLET - EVERY PAY ({currentCountry.currency})</h2>
              <p className="text-xs text-slate-400">Top up, instant checkout, split small-small installment payments, and refunds.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl border border-pink-500/40 bg-gradient-to-br from-pink-950/30 to-slate-900 space-y-3 shadow-xl">
                <div className="text-xs text-slate-400">Available EVERY PAY Balance</div>
                <div className="text-3xl font-black text-pink-400">
                  {currentCountry.symbol}{(walletBalanceUSD * currentCountry.rate).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="text-[10px] text-emerald-400 font-bold">✓ Secure escrow protected ({currentCountry.name})</div>
              </div>

              <div className="sm:col-span-2 p-6 rounded-3xl border border-pink-500/40 bg-slate-900/90 space-y-4 shadow-xl">
                <h3 className="font-bold text-sm text-pink-400">Top Up Wallet</h3>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    defaultValue={Math.round(100 * currentCountry.rate)}
                    className="flex-1 p-3 rounded-2xl bg-slate-950 border border-pink-500/40 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <button
                    onClick={() => setWalletBalanceUSD(walletBalanceUSD + 100)}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-black text-xs transition shadow"
                  >
                    Add Funds ({currentCountry.currency})
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 6. ORDERS WITH INTERACTIVE TIMELINE ================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-black text-pink-400">My Orders & Detailed Location History</h2>
              <p className="text-xs text-slate-400">Click any shipment below to inspect detailed location history and customs status updates.</p>
            </div>

            <div className="space-y-4">
              {INITIAL_SHIPMENTS.map(s => {
                const isExpanded = expandedShipments[s.id];
                return (
                  <div key={s.id} className="rounded-3xl border border-pink-500/30 bg-slate-900/90 overflow-hidden transition shadow-xl">
                    
                    <div
                      onClick={() => setExpandedShipments({ ...expandedShipments, [s.id]: !isExpanded })}
                      className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-800/50 transition"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
                          {s.mode === 'Ocean' ? <Ship className="w-6 h-6" /> : s.mode === 'Air' ? <Plane className="w-6 h-6" /> : <Truck className="w-6 h-6" />}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-100 flex items-center space-x-2">
                            <span>{s.trackingNumber}</span>
                            <span className="text-[10px] px-2.5 py-1 rounded-full bg-pink-500/20 text-pink-300 font-bold">
                              {s.status}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">{s.cargo} ({s.weight})</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-right">
                          <div className="text-[10px] text-slate-400">Estimated Arrival</div>
                          <div className="text-xs font-bold text-pink-400">{s.eta}</div>
                        </div>
                        <button className="p-2.5 rounded-xl bg-slate-800 text-pink-400">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-6 border-t border-pink-500/20 bg-slate-950/80 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                          <div className="p-4 rounded-2xl bg-slate-900 border border-pink-500/20">
                            <div className="text-slate-400">Origin Port</div>
                            <div className="font-bold text-slate-200 mt-0.5">{s.origin}</div>
                          </div>
                          <div className="p-4 rounded-2xl bg-slate-900 border border-pink-500/20">
                            <div className="text-slate-400">Destination</div>
                            <div className="font-bold text-slate-200 mt-0.5">{s.destination}</div>
                          </div>
                          <div className="p-4 rounded-2xl bg-slate-900 border border-pink-500/20">
                            <div className="text-slate-400">Declared Value</div>
                            <div className="font-bold text-pink-400 mt-0.5">{formatPrice(s.valueUSD)}</div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-bold text-xs text-pink-400 mb-4 uppercase tracking-wider">Detailed Location History & Customs Status</h4>
                          <div className="space-y-4 pl-4 border-l-2 border-pink-500/40">
                            {s.timeline.map((t, idx) => (
                              <div key={idx} className="relative pl-6 space-y-1">
                                <div className={`absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-2 border-slate-950 ${t.completed ? 'bg-pink-500' : 'bg-slate-700'}`}></div>
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-xs text-slate-200">{t.title}</span>
                                  <span className="text-[10px] text-slate-400 font-mono">{t.time}</span>
                                </div>
                                <div className="text-xs text-pink-300 font-medium">📍 {t.location}</div>
                                <div className="text-[11px] px-3 py-1.5 rounded-xl bg-slate-900 border border-pink-500/20 text-slate-300 inline-block">
                                  🛡️ Customs: <strong className="text-pink-400">{t.customsStatus}</strong>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= 7. SELLER VERIFICATION ================= */}
        {activeTab === 'seller' && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div>
              <h2 className="text-lg font-black text-pink-400">Seller Registration & Verification</h2>
              <p className="text-xs text-slate-400">New sellers must wait for owner approval before they can sell or post products on EVERY MART.</p>
            </div>

            <div className="p-8 rounded-3xl border border-pink-500/35 bg-slate-900/90 space-y-4 text-xs shadow-2xl">
              {sellerStatusMessage && (
                <div className="p-4 rounded-2xl bg-pink-500/20 border border-pink-500 text-pink-200 font-bold">
                  {sellerStatusMessage}
                </div>
              )}

              <div>
                <label className="block font-bold mb-1.5 text-pink-300">Store Name</label>
                <input
                  type="text"
                  value={newStoreName}
                  onChange={(e) => setNewStoreName(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-950 border border-pink-500/40 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1.5 text-pink-300">Country (Synced)</label>
                  <input
                    type="text"
                    readOnly
                    value={`${currentCountry.flag} ${currentCountry.name}`}
                    className="w-full p-3 rounded-2xl bg-slate-950 border border-pink-500/40 text-pink-400 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1.5 text-pink-300">Selling Category</label>
                  <input
                    type="text"
                    value={newSellerCategory}
                    onChange={(e) => setNewSellerCategory(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-slate-950 border border-pink-500/40 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1.5 text-pink-300">Phone Number ({currentCountry.code})</label>
                <div className="flex space-x-2">
                  <div className="w-24 p-3 rounded-2xl bg-slate-950 border border-pink-500/40 text-pink-400 font-bold flex items-center justify-center">
                    {currentCountry.code}
                  </div>
                  <input
                    type="text"
                    placeholder="8031234567"
                    defaultValue="8031234567"
                    className="flex-1 p-3 rounded-2xl bg-slate-950 border border-pink-500/40 text-slate-100"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  const newApp: SellerApplication = {
                    id: `sel-${Date.now()}`,
                    storeName: newStoreName,
                    country: currentCountry.name,
                    phone: `${currentCountry.code} 8031234567`,
                    sellingCategory: newSellerCategory,
                    status: 'Pending',
                    submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
                  };
                  setSellerApplications([newApp, ...sellerApplications]);
                  setSellerStatusMessage("Application submitted! Your store is pending owner approval. You will be able to sell once approved by the admin.");
                }}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-black transition shadow-xl shadow-pink-500/30"
              >
                Submit Store for Owner Approval
              </button>
            </div>
          </div>
        )}

        {/* ================= 8. OWNER DASHBOARD ================= */}
        {activeTab === 'owner-dashboard' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-amber-400 flex items-center space-x-2">
                  <ShieldAlert className="w-5 h-5 text-amber-400" />
                  <span>Owner & Admin Dashboard — Seller Approvals</span>
                </h2>
                <p className="text-xs text-slate-300">Review new vendor registrations and approve or reject store applications.</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1.5 rounded-full bg-purple-950 text-amber-300 border border-amber-500/50 font-bold text-xs shadow">
                  {pendingSellerCount} Pending
                </span>
                <button
                  onClick={() => {
                    const headers = ['ID', 'Store Name', 'Country', 'Phone', 'Selling Category', 'Status', 'Submitted At'];
                    const rows = sellerApplications.map(s => [s.id, `"${s.storeName}"`, `"${s.country}"`, `"${s.phone}"`, `"${s.sellingCategory}"`, s.status, `"${s.submittedAt}"`]);
                    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement('a');
                    link.setAttribute('href', encodedUri);
                    link.setAttribute('download', `every_mart_sellers_${Date.now()}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/20 hover:from-amber-400 hover:to-amber-300 transition flex items-center space-x-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            <div className="rounded-3xl border overflow-hidden bg-gradient-to-br from-purple-950/60 via-slate-900 to-slate-950 border-amber-500/40 shadow-2xl">
              <div className="p-4 border-b border-amber-500/30 font-bold text-sm text-amber-300 flex items-center justify-between bg-slate-950/80">
                <span>New Seller Waiting For Your Approval</span>
                <span className="text-[10px] text-purple-300 font-mono">Gold & Deep Purple Admin Mode</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 bg-slate-950">
                      <th className="p-4 font-semibold">Store Name</th>
                      <th className="p-4 font-semibold">Country</th>
                      <th className="p-4 font-semibold">Phone</th>
                      <th className="p-4 font-semibold">Category</th>
                      <th className="p-4 font-semibold">Status</th>
                      <th className="p-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {sellerApplications.map(seller => (
                      <tr key={seller.id} className="hover:bg-slate-800/40 transition">
                        <td className="p-4 font-bold text-slate-100">{seller.storeName}</td>
                        <td className="p-4 text-pink-300">{seller.country}</td>
                        <td className="p-4 font-mono text-slate-300">{seller.phone}</td>
                        <td className="p-4 text-slate-300">{seller.sellingCategory}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            seller.status === 'Approved' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                            seller.status === 'Rejected' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                            'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}>
                            {seller.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          {seller.status === 'Pending' ? (
                            <>
                              <button
                                onClick={() => {
                                  setSellerApplications(sellerApplications.map(s => s.id === seller.id ? { ...s, status: 'Approved' } : s));
                                  alert(`Successfully approved ${seller.storeName}!`);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => {
                                  setSellerApplications(sellerApplications.map(s => s.id === seller.id ? { ...s, status: 'Rejected' } : s));
                                  alert(`Rejected ${seller.storeName}.`);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition"
                              >
                                Reject
                              </button>
                            </>
                          ) : (
                            <span className="text-slate-400 font-medium italic">Completed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= 9. GLOBAL FLEET RADAR MAP WITH FILTERABLE LEGEND ================= */}
        {activeTab === 'radar' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-pink-400">Global Shipping Lanes & Fleet Radar</h2>
                <p className="text-xs text-slate-400">Auto-centered on active country hub: <strong>{currentCountry.flag} {currentCountry.name}</strong></p>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 bg-slate-900 border border-pink-500/40 p-1 rounded-2xl">
                  <button
                    onClick={() => setMapZoom(Math.max(0.8, mapZoom - 0.2))}
                    className="p-2 hover:bg-pink-500 hover:text-white rounded-xl transition text-pink-400"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-black px-2 text-pink-300">{Math.round(mapZoom * 100)}%</span>
                  <button
                    onClick={() => setMapZoom(Math.min(1.8, mapZoom + 0.2))}
                    className="p-2 hover:bg-pink-500 hover:text-white rounded-xl transition text-pink-400"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Radar Map Container */}
            <div
              onClick={handleMapClick}
              className={`relative ${isMapFullscreen ? 'fixed inset-0 z-50 h-screen w-screen rounded-none p-6' : 'h-[440px]'} rounded-3xl border-2 border-pink-500/40 bg-slate-950 overflow-hidden flex items-center justify-center transition-all duration-300 cursor-crosshair shadow-2xl`}
            >
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const canvas = document.createElement('canvas');
                  canvas.width = 1200;
                  canvas.height = 800;
                  const ctx = canvas.getContext('2d');
                  if (!ctx) return;

                  ctx.fillStyle = '#090314';
                  ctx.fillRect(0, 0, canvas.width, canvas.height);

                  ctx.strokeStyle = 'rgba(236, 72, 153, 0.2)';
                  ctx.lineWidth = 1;
                  for (let x = 0; x < canvas.width; x += 60) {
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, canvas.height);
                    ctx.stroke();
                  }
                  for (let y = 0; y < canvas.height; y += 60) {
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(canvas.width, y);
                    ctx.stroke();
                  }

                  ctx.fillStyle = '#f43f5e';
                  ctx.font = 'bold 24px sans-serif';
                  ctx.fillText(`EVERY MART Global Fleet Radar - Hub: ${currentCountry.name} (${currentCountry.currency})`, 40, 60);

                  ctx.fillStyle = '#f59e0b';
                  ctx.font = '16px sans-serif';
                  ctx.fillText(`Active Layers: Ships (${showShips}), Planes (${showPlanes}), Trucks (${showTrucks}), Historical (${showHistoricalData}), Weather (${showWeatherPatterns})`, 40, 95);

                  ctx.beginPath();
                  ctx.arc(canvas.width / 2, canvas.height / 2, 12, 0, 2 * Math.PI);
                  ctx.fillStyle = '#ec4899';
                  ctx.fill();

                  INITIAL_SHIPMENTS.forEach((s, idx) => {
                    const x = 150 + idx * 320;
                    const y = 250 + (idx % 2) * 180;
                    ctx.fillStyle = '#1e1b4b';
                    ctx.strokeStyle = '#f43f5e';
                    ctx.lineWidth = 2;
                    ctx.fillRect(x, y, 260, 90);
                    ctx.strokeRect(x, y, 260, 90);

                    ctx.fillStyle = '#f3e8ff';
                    ctx.font = 'bold 16px sans-serif';
                    ctx.fillText(s.trackingNumber, x + 20, y + 35);
                    ctx.fillStyle = '#cbd5e1';
                    ctx.font = '14px sans-serif';
                    ctx.fillText(`Status: ${s.status}`, x + 20, y + 65);
                  });

                  const dataUrl = canvas.toDataURL('image/png');
                  const link = document.createElement('a');
                  link.href = dataUrl;
                  link.download = `soft_galaxy_fleet_radar_${currentCountry.code}_${Date.now()}.png`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  alert('Radar map image downloaded successfully as high-resolution PNG!');
                }}
                className="absolute top-4 left-4 z-30 px-3.5 py-2 rounded-2xl bg-slate-900/90 border border-pink-500/50 text-pink-300 font-bold text-xs shadow-xl hover:bg-pink-500 hover:text-white transition flex items-center space-x-1.5"
                title="Download Map Image as High-Resolution PNG"
              >
                <Download className="w-4 h-4" />
                <span>Download Map Image</span>
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); setIsMapFullscreen(!isMapFullscreen); }}
                className="absolute top-4 right-4 z-30 px-3.5 py-2 rounded-2xl bg-slate-900/90 border border-pink-500/50 text-pink-300 font-bold text-xs shadow-xl hover:bg-pink-500 hover:text-white transition flex items-center space-x-1.5"
                title="Toggle Fullscreen"
              >
                {isMapFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                <span>{isMapFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
              </button>

              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30 pointer-events-none"></div>

              <div
                className="relative w-full h-full flex items-center justify-center transition-transform duration-300"
                style={{
                  transform: `scale(${mapZoom}) translate(${mapCenterOffset.x}px, ${mapCenterOffset.y}px)`
                }}
              >
                {/* Weather Patterns Layer */}
                {showWeatherPatterns && (
                  <div className="absolute inset-0 pointer-events-none opacity-25">
                    <div className="absolute top-10 left-20 w-48 h-24 rounded-full bg-cyan-500/20 blur-xl animate-pulse"></div>
                    <div className="absolute bottom-16 right-32 w-64 h-32 rounded-full bg-indigo-500/20 blur-xl animate-pulse"></div>
                  </div>
                )}

                {/* Historical Data Layer */}
                {showHistoricalData && (
                  <svg className="absolute inset-0 w-full h-full opacity-35 text-amber-400 pointer-events-none" viewBox="0 0 800 400" fill="none">
                    <path d="M80 80 C 200 200, 400 50, 720 180" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                    <path d="M120 320 C 300 120, 500 350, 680 120" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                  </svg>
                )}

                <svg className="w-full h-full opacity-40 text-pink-500" viewBox="0 0 800 400" fill="none">
                  <path d="M100 120 Q 250 80, 400 150 T 700 100" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" />
                  <path d="M150 250 Q 300 300, 500 200 T 750 280" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" />
                </svg>

                <div className="absolute text-center pointer-events-none">
                  <div className="w-3.5 h-3.5 rounded-full bg-pink-400 animate-ping mx-auto"></div>
                  <div className="text-[10px] text-pink-200 font-bold mt-1 bg-slate-900/95 px-2.5 py-1 rounded-xl border border-pink-500/50 shadow">
                    {clickedCoords ? `Selected (${clickedCoords.lat}°, ${clickedCoords.lng}°)` : `${currentCountry.flag} ${currentCountry.name} Hub`}
                  </div>
                </div>

                {INITIAL_SHIPMENTS.map((s, i) => {
                  if (s.mode === 'Ocean' && !showShips) return null;
                  if (s.mode === 'Air' && !showPlanes) return null;
                  if (s.mode === 'Rail' && !showTrucks) return null;

                  const hasCustomsAlert = s.status === 'Customs Hold' || s.timeline.some(t => t.customsStatus.toLowerCase().includes('hold') || t.customsStatus.toLowerCase().includes('cleared') || t.customsStatus.toLowerCase().includes('passed'));

                  return (
                    <div
                      key={s.id}
                      onMouseEnter={() => setHoveredShipment(s)}
                      onMouseLeave={() => setHoveredShipment(null)}
                      className="absolute p-3 rounded-2xl bg-slate-900 border border-pink-500/60 shadow-2xl flex items-center space-x-2 cursor-pointer hover:scale-110 transition group"
                      style={{ top: `${30 + i * 22}%`, left: `${25 + i * 28}%` }}
                    >
                      {s.mode === 'Ocean' && <Ship className="w-4 h-4 text-pink-400" />}
                      {s.mode === 'Air' && <Plane className="w-4 h-4 text-yellow-400" />}
                      {s.mode === 'Rail' && <Truck className="w-4 h-4 text-amber-300" />}
                      <div>
                        <div className="text-[10px] font-bold text-pink-300">{s.trackingNumber}</div>
                        <div className="text-[9px] text-slate-400">{s.status}</div>
                      </div>

                      {hasCustomsAlert && (
                        <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg animate-bounce" title="Customs Cleared / Hold Status Update">
                          <Bell className="w-3 h-3 text-white" />
                        </div>
                      )}

                      {hoveredShipment?.id === s.id && (
                        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-56 p-3.5 rounded-2xl bg-slate-900 border border-pink-400 text-xs shadow-2xl z-50 pointer-events-none space-y-1.5">
                          <div className="font-bold text-pink-400 flex items-center justify-between">
                            <span>{s.trackingNumber}</span>
                            <span className="text-[10px] text-amber-300 font-mono">📍 {s.coordinates.lat}°, {s.coordinates.lng}°</span>
                          </div>
                          <div className="text-[11px] text-slate-200">Cargo: {s.cargo}</div>
                          <div className="text-[10px] text-emerald-400">Status: {s.status}</div>
                          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                            <span className="text-pink-300 font-bold flex items-center space-x-1">
                              <Clock className="w-3.5 h-3.5 text-pink-400" />
                              <span>ETA Countdown:</span>
                            </span>
                            <span className="font-mono font-bold text-amber-300">
                              {s.mode === 'Air' ? '12h 45m left' : s.mode === 'Ocean' ? '72h 15m left' : '36h 10m left'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* FILTERABLE LEGEND SECTION (USER REQUESTED: toggle visibility of ships, planes, trucks, historical data, and weather patterns individually inside legend) */}
            <div className="p-5 rounded-3xl border border-pink-500/40 bg-slate-900/90 flex flex-wrap items-center justify-around gap-4 text-xs shadow-xl">
              <div className="font-black text-pink-400 uppercase tracking-wider">Map Legend & Layers:</div>
              
              <button
                onClick={() => setShowShips(!showShips)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-2xl border transition ${showShips ? 'bg-pink-500/20 border-pink-500 text-pink-300 shadow-lg' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
              >
                <Ship className="w-4 h-4 text-pink-400" />
                <span className="font-bold">Ships: {showShips ? 'Shown' : 'Hidden'}</span>
              </button>

              <button
                onClick={() => setShowPlanes(!showPlanes)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-2xl border transition ${showPlanes ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300 shadow-lg' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
              >
                <Plane className="w-4 h-4 text-yellow-400" />
                <span className="font-bold">Planes: {showPlanes ? 'Shown' : 'Hidden'}</span>
              </button>

              <button
                onClick={() => setShowTrucks(!showTrucks)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-2xl border transition ${showTrucks ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-lg' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
              >
                <Truck className="w-4 h-4 text-amber-300" />
                <span className="font-bold">Trucks: {showTrucks ? 'Shown' : 'Hidden'}</span>
              </button>

              <button
                onClick={() => setShowHistoricalData(!showHistoricalData)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-2xl border transition ${showHistoricalData ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-lg' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
              >
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="font-bold">Historical Data: {showHistoricalData ? 'Shown' : 'Hidden'}</span>
              </button>

              <button
                onClick={() => setShowWeatherPatterns(!showWeatherPatterns)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-2xl border transition ${showWeatherPatterns ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-lg' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
              >
                <Activity className="w-4 h-4 text-cyan-400" />
                <span className="font-bold">Weather Patterns: {showWeatherPatterns ? 'Shown' : 'Hidden'}</span>
              </button>
            </div>

          </div>
        )}

        {/* ================= 10. CART VIEW ================= */}
        {activeTab === 'cart' && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div>
              <h2 className="text-lg font-black text-pink-400">Your Shopping Cart</h2>
              <p className="text-xs text-slate-400">Review selected items and pay with your EVERY PAY wallet ({currentCountry.currency}).</p>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3 bg-slate-900/80 rounded-3xl border border-pink-500/30 shadow-xl">
                <div className="text-4xl">🌹</div>
                <div className="font-bold text-sm text-white">Your cart is empty</div>
                <p className="text-xs text-slate-400">Add something royal from the marketplace and it will show up here.</p>
                <button
                  onClick={() => setActiveTab('home')}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-xs"
                >
                  Start shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-3xl border border-pink-500/30 bg-slate-900 flex items-center justify-between shadow-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-950 overflow-hidden border border-pink-500/30">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white">{item.name}</div>
                        <div className="text-[10px] text-pink-300">Seller: {item.seller}</div>
                      </div>
                    </div>
                    <div className="font-black text-sm text-pink-400">{formatPrice(item.priceUSD)}</div>
                  </div>
                ))}
                <div className="p-5 rounded-3xl border border-pink-500/40 bg-slate-900 flex items-center justify-between font-black text-base">
                  <span>Total ({currentCountry.currency}):</span>
                  <span className="text-pink-400">
                    {formatPrice(cart.reduce((sum, i) => sum + i.priceUSD, 0))}
                  </span>
                </div>
                <button
                  onClick={() => { alert(`Checkout successful via EVERY PAY wallet in ${currentCountry.currency}!`); setCart([]); }}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-black text-xs shadow-2xl shadow-pink-500/30 transition"
                >
                  Pay with EVERY PAY ({currentCountry.currency})
                </button>
              </div>
            )}
          </div>
        )}

      </main>

      {/* ================= FLOATING EVERY MART AI ASSISTANT ================= */}
      <div className="fixed bottom-6 right-6 z-50">
        {!aiChatOpen ? (
          <button
            onClick={() => setAiChatOpen(true)}
            className="flex items-center space-x-2.5 px-5 py-3.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:opacity-90 text-white font-black text-xs shadow-2xl shadow-pink-500/50 transition transform hover:scale-105 border border-pink-300"
          >
            <Bot className="w-5 h-5 text-white" />
            <span>EVERY MART AI (Free)</span>
          </button>
        ) : (
          <div className={`w-80 sm:w-96 ${aiMinimized ? 'h-14' : 'h-[520px]'} rounded-3xl border-2 border-pink-500/60 bg-slate-900 shadow-2xl flex flex-col overflow-hidden transition-all duration-300`}>
            
            <div className="p-3.5 bg-slate-950 border-b border-pink-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => { setAiChatOpen(false); setAiMinimized(false); setActiveTab('home'); }}
                  className="px-2.5 py-1 rounded-xl bg-pink-500 text-white hover:bg-pink-400 flex items-center space-x-1 font-black shadow transition"
                  title="Back to Home"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>BACK</span>
                </button>
                <div className="font-black text-pink-300 truncate max-w-[100px]">EVERY MART AI</div>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setAiMinimized(!aiMinimized)}
                  className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800"
                  title="Minimize"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => { setAiChatOpen(false); setAiMinimized(false); setActiveTab('home'); }}
                  className="p-1.5 rounded-lg text-slate-300 hover:bg-rose-950 hover:text-rose-300 font-bold"
                  title="Close and Return to Home"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!aiMinimized && (
              <>
                <div className="p-3 bg-slate-950/90 border-b border-pink-500/20 flex items-center justify-between">
                  <button
                    onClick={() => { setAiChatOpen(false); setAiMinimized(false); setActiveTab('home'); }}
                    className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-black text-xs flex items-center justify-center space-x-2 shadow-lg"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Main Page</span>
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs bg-slate-900/80">
                  {aiMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[90%] p-3.5 rounded-2xl ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-br-none shadow-md'
                          : 'bg-slate-800 text-slate-200 border border-pink-500/30 rounded-bl-none space-y-3'
                      }`}>
                        <p>{msg.text}</p>
                        {msg.products && msg.products.length > 0 && (
                          <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-700">
                            {msg.products.map(p => (
                              <div
                                key={p.id}
                                onClick={() => { setSelectedProduct(p); setActiveTab('product-detail'); setAiChatOpen(false); }}
                                className="p-2 rounded-2xl bg-slate-900 border border-pink-500/40 flex flex-col justify-between cursor-pointer hover:border-pink-400 transition group shadow"
                              >
                                <div className="h-24 rounded-xl bg-slate-950 overflow-hidden mb-1.5 border border-pink-500/20">
                                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                                </div>
                                <div className="text-left space-y-1">
                                  <div className="font-bold text-[10px] text-slate-100 truncate">{p.name}</div>
                                  <div className="font-black text-[10px] text-pink-400">{formatPrice(p.priceUSD)}</div>
                                </div>
                                <button className="mt-2 w-full py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-[9px] shadow">
                                  View / Buy
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {aiLoading && (
                    <div className="flex justify-start">
                      <div className="p-3 rounded-2xl bg-slate-800 text-pink-400 border border-pink-500/30 text-xs flex items-center space-x-2">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>EVERY MART AI is finding luxury products...</span>
                      </div>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSendAi} className="p-3 border-t border-pink-500/30 bg-slate-950 flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Ask e.g. 'I want shoes' or 'pink rose dress'..."
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    className="flex-1 p-3 rounded-2xl bg-slate-900 border border-pink-500/40 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <button
                    type="submit"
                    className="p-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-90 text-white shadow-lg shadow-pink-500/30 transition"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}

          </div>
        )}
      </div>

      {/* ================= SIGNIN / SIGNUP MODAL ================= */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md p-8 rounded-3xl border-2 border-pink-500/50 bg-slate-900 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="font-black text-base text-pink-400">
                {authMode === 'login' ? 'Sign in to EVERY MART' : 'Create Account'}
              </div>
              <button onClick={() => setAuthModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1.5 text-pink-300">Selected Country (Synced)</label>
                <input
                  type="text"
                  readOnly
                  value={`${currentCountry.flag} ${currentCountry.name} (${currentCountry.currency})`}
                  className="w-full p-3 rounded-2xl bg-slate-950 border border-pink-500/40 text-pink-400 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1.5 text-pink-300">Phone Number ({currentCountry.code})</label>
                <div className="flex space-x-2">
                  <div className="w-24 p-3 rounded-2xl bg-slate-950 border border-pink-500/40 text-pink-400 font-bold flex items-center justify-center">
                    {currentCountry.code}
                  </div>
                  <input
                    type="tel"
                    placeholder="8031234567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1 p-3 rounded-2xl bg-slate-950 border border-pink-500/40 text-slate-100"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  setUserLoggedIn(true);
                  setAuthModalOpen(false);
                  alert(`Successfully authenticated for ${currentCountry.name} (${currentCountry.code} ${phoneNumber})`);
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-black transition shadow-xl shadow-pink-500/30 mt-2"
              >
                {authMode === 'login' ? 'Sign in' : `Create Account & Start Shopping (${currentCountry.currency})`}
              </button>

              <div className="text-center pt-2">
                <button
                  onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                  className="text-pink-400 hover:underline font-bold text-[11px]"
                >
                  {authMode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="mt-20 border-t border-pink-500/30 bg-slate-950 py-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="font-black text-pink-400 text-base">EVERY MART</div>
            <p className="text-[11px] leading-relaxed text-slate-300">
              A little closer, voice by voice. Be there. Be heard. Choose your orbit. Pay with your EVERY PAY wallet in {currentCountry.currency}.
            </p>
          </div>
          <div>
            <div className="font-bold text-pink-300 mb-3">Buy</div>
            <ul className="space-y-2 text-[11px]">
              <li><button onClick={() => setActiveTab('products')} className="hover:text-pink-400">All products</button></li>
              <li><button onClick={() => setActiveTab('live')} className="hover:text-pink-400">Live shopping</button></li>
              <li><button onClick={() => setActiveTab('wallet')} className="hover:text-pink-400">My wallet</button></li>
              <li><button onClick={() => setActiveTab('orders')} className="hover:text-pink-400">My orders</button></li>
            </ul>
          </div>
          <div>
            <div className="font-bold text-pink-300 mb-3">Sell</div>
            <ul className="space-y-2 text-[11px]">
              <li><button onClick={() => setActiveTab('seller')} className="hover:text-pink-400">Become a seller</button></li>
              <li><button onClick={() => setActiveTab('seller')} className="hover:text-pink-400">Seller hub</button></li>
              <li><button onClick={() => setActiveTab('wallet')} className="hover:text-pink-400">Payouts</button></li>
            </ul>
          </div>
          <div>
            <div className="font-bold text-pink-300 mb-3">Frames & gifts</div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Small numbers simple math. Verified sellers only. EVERY PAY wallet checkout. Small-small installment plans.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-pink-500/20 text-center text-[11px] text-pink-300/80 font-bold">
          © 2026 EVERY MART BY SOFT LIFE • A little closer, voice by voice.
        </div>
      </footer>

    </div>
  );
}
