"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  Plus,
  Edit2,
  Trash2,
  CreditCard,
  Settings as SettingsIcon,
  Truck,
  Percent,
  X,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useToast } from "@/store/toastStore";
import { SettingsService, ShippingZone, ShippingMethod, TaxRate } from "@/lib/services/SettingsService";

type Tab = "general" | "shipping" | "tax" | "payments";

interface GeneralSettings {
  store_name: string;
  store_email: string;
  store_phone: string;
  currency: string;
  currency_symbol: string;
  default_tax_rate: string;
  free_shipping_threshold: string;
  default_shipping_cost: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  enabled: boolean;
  test_mode: boolean;
  public_key?: string;
  secret_key?: string;
}

export default function AdminSettingsPage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  // General Settings
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    store_name: "NOWIHT",
    store_email: "hello@nowiht.com",
    store_phone: "+1 (555) 123-4567",
    currency: "USD",
    currency_symbol: "$",
    default_tax_rate: "10",
    free_shipping_threshold: "100",
    default_shipping_cost: "10",
  });

  // Shipping Data
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([]);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);

  // Tax Data
  const [taxRates, setTaxRates] = useState<TaxRate[]>([]);

  // Payment Data (Mock for now - will be replaced with Stripe integration)
  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      name: "Stripe",
      enabled: false,
      test_mode: true,
      public_key: "pk_test_...",
      secret_key: "sk_test_...",
    },
    {
      id: "2",
      name: "PayPal",
      enabled: false,
      test_mode: true,
    },
  ]);

  // Modals
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [showMethodModal, setShowMethodModal] = useState(false);
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [editingZone, setEditingZone] = useState<ShippingZone | null>(null);
  const [editingMethod, setEditingMethod] = useState<ShippingMethod | null>(null);
  const [editingTax, setEditingTax] = useState<TaxRate | null>(null);

  // Form States
  const [zoneForm, setZoneForm] = useState({
    name: "",
    countries: [] as string[],
    isActive: true,
  });

  const [methodForm, setMethodForm] = useState({
    zoneId: "",
    name: "",
    description: "",
    rateType: "flat" as "flat" | "weight" | "price",
    rate: 0,
    estimatedDays: "",
    isActive: true,
  });

  const [taxForm, setTaxForm] = useState({
    name: "",
    country: "",
    state: "",
    rate: 0,
    isActive: true,
  });

  // Fetch all data on mount
  useEffect(() => {
    setMounted(true);
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      // Load general settings
      const settings = await SettingsService.getAll();
      setGeneralSettings({
        store_name: settings.store_name || "NOWIHT",
        store_email: settings.store_email || "hello@nowiht.com",
        store_phone: settings.store_phone || "+1 (555) 123-4567",
        currency: settings.currency || "USD",
        currency_symbol: settings.currency_symbol || "$",
        default_tax_rate: String(settings.default_tax_rate || 10),
        free_shipping_threshold: String(settings.free_shipping_threshold || 100),
        default_shipping_cost: String(settings.default_shipping_cost || 10),
      });

      // Load shipping data
      const zones = await SettingsService.getShippingZones();
      setShippingZones(zones);

      const methods = await SettingsService.getShippingMethods();
      setShippingMethods(methods);

      // Load tax rates
      const taxes = await SettingsService.getTaxRates();
      setTaxRates(taxes);
    } catch (error) {
      console.error("Error loading settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // GENERAL SETTINGS HANDLERS
  // ═══════════════════════════════════════════════════════════════

  const handleSaveGeneral = async () => {
    setIsSaving(true);
    try {
      const settingsToUpdate: Record<string, any> = {
        store_name: generalSettings.store_name,
        store_email: generalSettings.store_email,
        store_phone: generalSettings.store_phone,
        currency: generalSettings.currency,
        currency_symbol: generalSettings.currency_symbol,
        default_tax_rate: parseFloat(generalSettings.default_tax_rate),
        free_shipping_threshold: parseFloat(generalSettings.free_shipping_threshold),
        default_shipping_cost: parseFloat(generalSettings.default_shipping_cost),
      };

      await SettingsService.updateMultiple(settingsToUpdate);
      toast.success("General settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // SHIPPING ZONE HANDLERS
  // ═══════════════════════════════════════════════════════════════

  const handleOpenZoneModal = (zone?: ShippingZone) => {
    if (zone) {
      setEditingZone(zone);
      setZoneForm({
        name: zone.name,
        countries: zone.countries,
        isActive: zone.isActive,
      });
    } else {
      setEditingZone(null);
      setZoneForm({
        name: "",
        countries: [],
        isActive: true,
      });
    }
    setShowZoneModal(true);
  };

  const handleSaveZone = async () => {
    try {
      if (editingZone) {
        // Update existing zone
        await SettingsService.updateShippingZone(editingZone.id, zoneForm);
        toast.success("Shipping zone updated");
      } else {
        // Create new zone
        await SettingsService.createShippingZone(zoneForm);
        toast.success("Shipping zone created");
      }
      setShowZoneModal(false);
      loadAllData(); // Reload data
    } catch (error) {
      console.error("Error saving zone:", error);
      toast.error("Failed to save shipping zone");
    }
  };

  const handleDeleteZone = async (id: string) => {
    if (!confirm("Delete this shipping zone? All associated shipping methods will also be deleted.")) return;

    try {
      await SettingsService.deleteShippingZone(id);
      toast.success("Shipping zone deleted");
      loadAllData();
    } catch (error) {
      console.error("Error deleting zone:", error);
      toast.error("Failed to delete shipping zone");
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // SHIPPING METHOD HANDLERS
  // ═══════════════════════════════════════════════════════════════

  const handleOpenMethodModal = (method?: ShippingMethod) => {
    if (method) {
      setEditingMethod(method);
      setMethodForm({
        zoneId: method.zoneId,
        name: method.name,
        description: method.description || "",
        rateType: method.rateType,
        rate: method.rate,
        estimatedDays: method.estimatedDays || "",
        isActive: method.isActive,
      });
    } else {
      setEditingMethod(null);
      setMethodForm({
        zoneId: shippingZones[0]?.id || "",
        name: "",
        description: "",
        rateType: "flat",
        rate: 0,
        estimatedDays: "",
        isActive: true,
      });
    }
    setShowMethodModal(true);
  };

  const handleSaveMethod = async () => {
    try {
      if (editingMethod) {
        // Update existing method
        await SettingsService.updateShippingMethod(editingMethod.id, methodForm);
        toast.success("Shipping method updated");
      } else {
        // Create new method
        await SettingsService.createShippingMethod(methodForm);
        toast.success("Shipping method created");
      }
      setShowMethodModal(false);
      loadAllData();
    } catch (error) {
      console.error("Error saving method:", error);
      toast.error("Failed to save shipping method");
    }
  };

  const handleDeleteMethod = async (id: string) => {
    if (!confirm("Delete this shipping method?")) return;

    try {
      await SettingsService.deleteShippingMethod(id);
      toast.success("Shipping method deleted");
      loadAllData();
    } catch (error) {
      console.error("Error deleting method:", error);
      toast.error("Failed to delete shipping method");
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // TAX RATE HANDLERS
  // ═══════════════════════════════════════════════════════════════

  const handleOpenTaxModal = (tax?: TaxRate) => {
    if (tax) {
      setEditingTax(tax);
      setTaxForm({
        name: tax.name,
        country: tax.country,
        state: tax.state || "",
        rate: tax.rate,
        isActive: tax.isActive,
      });
    } else {
      setEditingTax(null);
      setTaxForm({
        name: "",
        country: "",
        state: "",
        rate: 0,
        isActive: true,
      });
    }
    setShowTaxModal(true);
  };

  const handleSaveTax = async () => {
    try {
      if (editingTax) {
        // Update existing tax rate
        await SettingsService.updateTaxRate(editingTax.id, taxForm);
        toast.success("Tax rate updated");
      } else {
        // Create new tax rate
        await SettingsService.createTaxRate(taxForm);
        toast.success("Tax rate created");
      }
      setShowTaxModal(false);
      loadAllData();
    } catch (error) {
      console.error("Error saving tax rate:", error);
      toast.error("Failed to save tax rate");
    }
  };

  const handleDeleteTax = async (id: string) => {
    if (!confirm("Delete this tax rate?")) return;

    try {
      await SettingsService.deleteTaxRate(id);
      toast.success("Tax rate deleted");
      loadAllData();
    } catch (error) {
      console.error("Error deleting tax rate:", error);
      toast.error("Failed to delete tax rate");
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // PAYMENT HANDLERS (Mock)
  // ═══════════════════════════════════════════════════════════════

  const handleTogglePayment = async (id: string) => {
    toast.info("Payment gateway integration coming in Phase 10");
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: "general" as Tab, label: "General", icon: SettingsIcon },
    { id: "shipping" as Tab, label: "Shipping", icon: Truck },
    { id: "tax" as Tab, label: "Tax", icon: Percent },
    { id: "payments" as Tab, label: "Payments", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="p-2 hover:bg-gray-100 transition-colors rounded-lg"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-light">Settings</h1>
              <p className="text-sm text-gray-600">
                Manage store configuration
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6 border-b">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all relative ${activeTab === tab.id
                      ? "text-black"
                      : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>


      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {/* GENERAL TAB */}
          {activeTab === "general" && (
            <motion.div
              key="general"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Store Information */}
              <div className="bg-white border p-6">
                <h2 className="text-lg font-light mb-6">Store Information</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Store Name
                    </label>
                    <input
                      type="text"
                      value={generalSettings.store_name}
                      onChange={(e) =>
                        setGeneralSettings({
                          ...generalSettings,
                          store_name: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Store Email
                    </label>
                    <input
                      type="email"
                      value={generalSettings.store_email}
                      onChange={(e) =>
                        setGeneralSettings({
                          ...generalSettings,
                          store_email: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Store Phone
                    </label>
                    <input
                      type="tel"
                      value={generalSettings.store_phone}
                      onChange={(e) =>
                        setGeneralSettings({
                          ...generalSettings,
                          store_phone: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Currency
                    </label>
                    <select
                      value={generalSettings.currency}
                      onChange={(e) =>
                        setGeneralSettings({
                          ...generalSettings,
                          currency: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black transition-colors"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Tax & Shipping Defaults */}
              <div className="bg-white border p-6">
                <h2 className="text-lg font-light mb-6">
                  Default Tax & Shipping
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Default Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={generalSettings.default_tax_rate}
                      onChange={(e) =>
                        setGeneralSettings({
                          ...generalSettings,
                          default_tax_rate: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Free Shipping Threshold ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={generalSettings.free_shipping_threshold}
                      onChange={(e) =>
                        setGeneralSettings({
                          ...generalSettings,
                          free_shipping_threshold: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Default Shipping Cost ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={generalSettings.default_shipping_cost}
                      onChange={(e) =>
                        setGeneralSettings({
                          ...generalSettings,
                          default_shipping_cost: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSaveGeneral}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-black text-white px-8 py-3 hover:bg-gray-800 transition-all disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* SHIPPING TAB */}
          {activeTab === "shipping" && (
            <motion.div
              key="shipping"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Shipping Zones */}
              <div className="bg-white border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-light">Shipping Zones</h2>
                  <button
                    onClick={() => handleOpenZoneModal()}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 hover:bg-gray-800 transition-all text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Zone
                  </button>
                </div>

                <div className="space-y-4">
                  {shippingZones.map((zone) => (
                    <div
                      key={zone.id}
                      className="border p-4 flex items-center justify-between"
                    >
                      <div>
                        <h3 className="font-medium">{zone.name}</h3>
                        <p className="text-sm text-gray-600">
                          {zone.countries.join(", ")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium ${zone.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                            }`}
                        >
                          {zone.isActive ? "Active" : "Inactive"}
                        </span>
                        <button
                          onClick={() => handleOpenZoneModal(zone)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteZone(zone.id)}
                          className="p-2 hover:bg-red-50 text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {shippingZones.length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                      No shipping zones configured. Add your first zone to get started.
                    </p>
                  )}
                </div>
              </div>

              {/* Shipping Methods */}
              <div className="bg-white border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-light">Shipping Methods</h2>
                  <button
                    onClick={() => handleOpenMethodModal()}
                    disabled={shippingZones.length === 0}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 hover:bg-gray-800 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                    Add Method
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Method
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Zone
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Rate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Delivery Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {shippingMethods.map((method) => {
                        const zone = shippingZones.find(z => z.id === method.zoneId);
                        return (
                          <tr key={method.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium">
                              {method.name}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {zone?.name || "Unknown"}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              ${method.rate.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {method.estimatedDays || "—"}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-medium ${method.isActive
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                  }`}
                              >
                                {method.isActive ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleOpenMethodModal(method)}
                                  className="p-2 hover:bg-gray-100 transition-colors"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteMethod(method.id)}
                                  className="p-2 hover:bg-red-50 text-red-600 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {shippingMethods.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    {shippingZones.length === 0
                      ? "Add shipping zones first to create shipping methods."
                      : "No shipping methods configured. Add your first method to get started."}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* TAX TAB */}
          {activeTab === "tax" && (
            <motion.div
              key="tax"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-light">Tax Rates by Region</h2>
                  <button
                    onClick={() => handleOpenTaxModal()}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 hover:bg-gray-800 transition-all text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Tax Rate
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Country
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          State/Province
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Tax Rate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {taxRates.map((tax) => (
                        <tr key={tax.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium">
                            {tax.name}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {tax.country}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {tax.state || "—"}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {tax.rate.toFixed(2)}%
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium ${tax.isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                                }`}
                            >
                              {tax.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenTaxModal(tax)}
                                className="p-2 hover:bg-gray-100 transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteTax(tax.id)}
                                className="p-2 hover:bg-red-50 text-red-600 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {taxRates.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    No tax rates configured. Add your first tax rate to get started.
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* PAYMENTS TAB */}
          {activeTab === "payments" && (
            <motion.div
              key="payments"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Info Banner */}
              <div className="bg-blue-50 border border-blue-200 p-6">
                <p className="text-sm text-blue-800">
                  <strong>Coming Soon:</strong> Payment gateway integration (Stripe, PayPal) will be available in Phase 10.
                  For now, this section displays placeholder data.
                </p>
              </div>

              {/* Payment Gateways */}
              <div className="bg-white border p-6">
                <h2 className="text-lg font-light mb-6">Payment Gateways</h2>

                <div className="space-y-6">
                  {paymentMethods.map((payment) => (
                    <div
                      key={payment.id}
                      className="border p-6 flex items-start justify-between opacity-50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <CreditCard className="w-5 h-5" />
                          <h3 className="text-lg font-medium">
                            {payment.name}
                          </h3>
                          <span
                            className={`px-2 py-1 text-xs font-medium ${payment.enabled
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                              }`}
                          >
                            {payment.enabled ? "Enabled" : "Disabled"}
                          </span>
                        </div>

                        {payment.public_key && (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Public Key
                              </label>
                              <input
                                type="text"
                                value={payment.public_key}
                                readOnly
                                disabled
                                className="w-full px-4 py-2 border border-gray-300 bg-gray-50 text-sm"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Secret Key
                              </label>
                              <input
                                type="password"
                                value={payment.secret_key}
                                readOnly
                                disabled
                                className="w-full px-4 py-2 border border-gray-300 bg-gray-50 text-sm"
                              />
                            </div>

                            <label className="flex items-center gap-2 text-sm">
                              <input
                                type="checkbox"
                                checked={payment.test_mode}
                                disabled
                                className="w-4 h-4"
                              />
                              <span>Test Mode</span>
                            </label>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleTogglePayment(payment.id)}
                        disabled
                        className="px-4 py-2 text-sm bg-gray-300 text-gray-500 cursor-not-allowed"
                      >
                        Coming Soon
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* MODALS */}
      {/* ═══════════════════════════════════════════════════════════════ */}

      {/* Shipping Zone Modal */}
      {showZoneModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white max-w-lg w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-light">
                {editingZone ? "Edit Shipping Zone" : "Add Shipping Zone"}
              </h2>
              <button
                onClick={() => setShowZoneModal(false)}
                className="p-2 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Zone Name
                </label>
                <input
                  type="text"
                  value={zoneForm.name}
                  onChange={(e) =>
                    setZoneForm({ ...zoneForm, name: e.target.value })
                  }
                  placeholder="e.g., United States"
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Countries (comma-separated)
                </label>
                <input
                  type="text"
                  value={zoneForm.countries.join(", ")}
                  onChange={(e) =>
                    setZoneForm({
                      ...zoneForm,
                      countries: e.target.value.split(",").map((c) => c.trim()),
                    })
                  }
                  placeholder="US, CA, MX"
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use * for worldwide
                </p>
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={zoneForm.isActive}
                  onChange={(e) =>
                    setZoneForm({ ...zoneForm, isActive: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm">Active</span>
              </label>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowZoneModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveZone}
                className="flex-1 px-4 py-2 bg-black text-white hover:bg-gray-800 transition-all"
              >
                {editingZone ? "Update" : "Create"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Shipping Method Modal */}
      {showMethodModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white max-w-lg w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-light">
                {editingMethod ? "Edit Shipping Method" : "Add Shipping Method"}
              </h2>
              <button
                onClick={() => setShowMethodModal(false)}
                className="p-2 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Shipping Zone
                </label>
                <select
                  value={methodForm.zoneId}
                  onChange={(e) =>
                    setMethodForm({ ...methodForm, zoneId: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black"
                >
                  {shippingZones.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Method Name
                </label>
                <input
                  type="text"
                  value={methodForm.name}
                  onChange={(e) =>
                    setMethodForm({ ...methodForm, name: e.target.value })
                  }
                  placeholder="e.g., Standard Shipping"
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description (optional)
                </label>
                <input
                  type="text"
                  value={methodForm.description}
                  onChange={(e) =>
                    setMethodForm({ ...methodForm, description: e.target.value })
                  }
                  placeholder="Brief description"
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Rate Type
                  </label>
                  <select
                    value={methodForm.rateType}
                    onChange={(e) =>
                      setMethodForm({
                        ...methodForm,
                        rateType: e.target.value as "flat" | "weight" | "price",
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black"
                  >
                    <option value="flat">Flat Rate</option>
                    <option value="weight">Per Weight</option>
                    <option value="price">Per Price</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Rate ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={methodForm.rate}
                    onChange={(e) =>
                      setMethodForm({
                        ...methodForm,
                        rate: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Estimated Delivery (optional)
                </label>
                <input
                  type="text"
                  value={methodForm.estimatedDays}
                  onChange={(e) =>
                    setMethodForm({
                      ...methodForm,
                      estimatedDays: e.target.value,
                    })
                  }
                  placeholder="e.g., 5-7 business days"
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black"
                />
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={methodForm.isActive}
                  onChange={(e) =>
                    setMethodForm({ ...methodForm, isActive: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm">Active</span>
              </label>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowMethodModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMethod}
                className="flex-1 px-4 py-2 bg-black text-white hover:bg-gray-800 transition-all"
              >
                {editingMethod ? "Update" : "Create"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Tax Rate Modal */}
      {showTaxModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white max-w-lg w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-light">
                {editingTax ? "Edit Tax Rate" : "Add Tax Rate"}
              </h2>
              <button
                onClick={() => setShowTaxModal(false)}
                className="p-2 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tax Rate Name
                </label>
                <input
                  type="text"
                  value={taxForm.name}
                  onChange={(e) =>
                    setTaxForm({ ...taxForm, name: e.target.value })
                  }
                  placeholder="e.g., New York Sales Tax"
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={taxForm.country}
                    onChange={(e) =>
                      setTaxForm({ ...taxForm, country: e.target.value })
                    }
                    placeholder="US"
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    State/Province (optional)
                  </label>
                  <input
                    type="text"
                    value={taxForm.state}
                    onChange={(e) =>
                      setTaxForm({ ...taxForm, state: e.target.value })
                    }
                    placeholder="NY"
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={taxForm.rate}
                  onChange={(e) =>
                    setTaxForm({ ...taxForm, rate: parseFloat(e.target.value) })
                  }
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black"
                />
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={taxForm.isActive}
                  onChange={(e) =>
                    setTaxForm({ ...taxForm, isActive: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm">Active</span>
              </label>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowTaxModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTax}
                className="flex-1 px-4 py-2 bg-black text-white hover:bg-gray-800 transition-all"
              >
                {editingTax ? "Update" : "Create"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
