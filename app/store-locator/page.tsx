"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Search, Navigation } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// REAL STORE DATA - REPLACE WITH SUPABASE
const STORES = [
  {
    id: 1,
    name: "NOWIHT Istanbul Nişantaşı",
    address: "Teşvikiye Mahallesi, Valikonağı Caddesi No:45",
    city: "Istanbul",
    district: "Nişantaşı",
    phone: "+90 212 555 01 01",
    email: "nisantasi@nowiht.com",
    coordinates: { lat: 41.0472, lng: 28.9944 },
    hours: {
      weekdays: "10:00 - 20:00",
      saturday: "10:00 - 20:00",
      sunday: "12:00 - 18:00",
    },
    featured: true,
  },
  {
    id: 2,
    name: "NOWIHT Istanbul Bomonti",
    address: "Merkez Mahallesi, Abide-i Hürriyet Caddesi No:211, Sinpaş Queen",
    city: "Istanbul",
    district: "Şişli",
    phone: "+90 212 555 02 02",
    email: "bomonti@nowiht.com",
    coordinates: { lat: 41.0585, lng: 28.9836 },
    hours: {
      weekdays: "10:00 - 22:00",
      saturday: "10:00 - 22:00",
      sunday: "10:00 - 22:00",
    },
    featured: false,
  },
  {
    id: 3,
    name: "NOWIHT Ankara",
    address: "Çankaya Mahallesi, Tunalı Hilmi Caddesi No:112/A",
    city: "Ankara",
    district: "Çankaya",
    phone: "+90 312 555 03 03",
    email: "ankara@nowiht.com",
    coordinates: { lat: 39.9208, lng: 32.8541 },
    hours: {
      weekdays: "10:00 - 20:00",
      saturday: "10:00 - 20:00",
      sunday: "12:00 - 18:00",
    },
    featured: false,
  },
  {
    id: 4,
    name: "NOWIHT Antalya",
    address: "Liman Mahallesi, Atatürk Bulvarı No:89",
    city: "Antalya",
    district: "Konyaaltı",
    phone: "+90 242 555 04 04",
    email: "antalya@nowiht.com",
    coordinates: { lat: 36.8969, lng: 30.7133 },
    hours: {
      weekdays: "10:00 - 22:00",
      saturday: "10:00 - 22:00",
      sunday: "10:00 - 22:00",
    },
    featured: false,
  },
  {
    id: 5,
    name: "NOWIHT Izmir",
    address: "Alsancak Mahallesi, Kıbrıs Şehitleri Caddesi No:140/A",
    city: "Izmir",
    district: "Konak",
    phone: "+90 232 555 05 05",
    email: "izmir@nowiht.com",
    coordinates: { lat: 38.4375, lng: 27.1467 },
    hours: {
      weekdays: "10:00 - 20:00",
      saturday: "10:00 - 20:00",
      sunday: "12:00 - 18:00",
    },
    featured: false,
  },
];

const CITIES = ["All", "Istanbul", "Ankara", "Antalya", "Izmir"];

export default function StoreLocatorPage() {
  const [mounted, setMounted] = useState(false);
  const [stores] = useState(STORES);
  const [selectedCity, setSelectedCity] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStore, setSelectedStore] = useState<any>(STORES[0]);

  useEffect(() => {
    setMounted(true);
    // TODO: Fetch from Supabase
  }, []);

  const filteredStores = stores.filter((store) => {
    const matchesCity = selectedCity === "All" || store.city === selectedCity;
    const matchesSearch =
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.district.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesSearch;
  });

  // Update selected store when filters change
  useEffect(() => {
    if (filteredStores.length > 0 && !filteredStores.find(s => s.id === selectedStore?.id)) {
      setSelectedStore(filteredStores[0]);
    }
  }, [filteredStores, selectedStore]);

  const handleGetDirections = (store: any) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${store.coordinates.lat},${store.coordinates.lng}`;
    window.open(url, "_blank");
  };

  if (!mounted) {
    return (
      <>
        <Header />
        <div className="min-h-screen pt-20 flex items-center justify-center">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="bg-white min-h-screen">
        {/* Hero */}
        <section className="py-24 px-6 border-b">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <p className="text-sm tracking-[0.3em] uppercase text-gray-400 mb-6">Store Locator</p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-light mb-6 leading-tight">
                Visit Our Stores
              </h1>
              <p className="text-xl text-gray-600 font-light leading-relaxed">
                Experience NOWIHT in person. Discover our collections and receive personalized styling at our locations.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 px-6 bg-gray-50 border-b">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
              {/* City Filter */}
              <div className="flex flex-wrap gap-3">
                {CITIES.map((city) => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`px-4 py-2 text-sm font-medium transition-all ${
                      selectedCity === city
                        ? "bg-black text-white"
                        : "bg-white border border-gray-300 hover:border-black"
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative w-full lg:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by location..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:border-black focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Map + List */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Google Maps */}
              <div className="order-2 lg:order-1">
                <div className="sticky top-24">
                  <div className="relative aspect-square bg-gray-100 border border-gray-200 overflow-hidden">
                    {selectedStore ? (
                      <iframe
                        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${selectedStore.coordinates.lat},${selectedStore.coordinates.lng}&zoom=15`}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      ></iframe>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                          <p className="text-gray-600 font-light">Select a store</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600 font-light">
                      Showing: <strong>{selectedStore?.name}</strong>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Click on any store card to update the map
                    </p>
                  </div>
                </div>
              </div>

              {/* Store List */}
              <div className="order-1 lg:order-2 space-y-6">
                {filteredStores.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-gray-500 font-light">No stores found. Try a different search.</p>
                  </div>
                ) : (
                  filteredStores.map((store, i) => (
                    <motion.div
                      key={store.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => setSelectedStore(store)}
                      className={`border p-6 cursor-pointer transition-all ${
                        selectedStore?.id === store.id
                          ? "border-black bg-gray-50"
                          : "hover:border-black bg-white"
                      } ${store.featured ? "bg-gray-50" : ""}`}
                    >
                      {/* Store Name */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-medium mb-1">{store.name}</h3>
                          <p className="text-sm text-gray-600">
                            {store.district}, {store.city}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {store.featured && (
                            <span className="bg-black text-white px-2 py-1 text-xs tracking-wider">
                              FLAGSHIP
                            </span>
                          )}
                          {selectedStore?.id === store.id && (
                            <span className="bg-gray-800 text-white px-2 py-1 text-xs tracking-wider">
                              ON MAP
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Address */}
                      <div className="flex items-start gap-3 mb-4">
                        <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-700 font-light">{store.address}</p>
                      </div>

                      {/* Contact */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <a href={`tel:${store.phone}`} className="text-gray-700 hover:text-black transition-colors">
                            {store.phone}
                          </a>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <a href={`mailto:${store.email}`} className="text-gray-700 hover:text-black transition-colors">
                            {store.email}
                          </a>
                        </div>
                      </div>

                      {/* Hours */}
                      <div className="border-t pt-4 mb-4">
                        <div className="flex items-start gap-3 mb-2">
                          <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                          <div className="text-sm text-gray-700">
                            <p className="mb-1">
                              <span className="font-medium">Mon - Fri:</span> {store.hours.weekdays}
                            </p>
                            <p className="mb-1">
                              <span className="font-medium">Saturday:</span> {store.hours.saturday}
                            </p>
                            <p>
                              <span className="font-medium">Sunday:</span> {store.hours.sunday}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGetDirections(store);
                        }}
                        className="w-full bg-black text-white py-3 hover:bg-gray-800 transition-all flex items-center justify-center gap-2 font-medium tracking-wider text-sm"
                      >
                        <Navigation className="w-5 h-5" />
                        <span>GET DIRECTIONS</span>
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-20 px-6 bg-gray-50 border-t">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-light mb-6">Visit Us Today</h2>
            <p className="text-lg text-gray-600 font-light leading-relaxed mb-8">
              Our knowledgeable staff is ready to help you find the perfect pieces for your wardrobe. 
              Experience the quality and craftsmanship of NOWIHT in person.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-medium mb-2">Personal Styling</h3>
                <p className="text-sm text-gray-600">Complimentary styling consultation</p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Alterations</h3>
                <p className="text-sm text-gray-600">In-store tailoring services</p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Exclusive Access</h3>
                <p className="text-sm text-gray-600">Early access to new collections</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}