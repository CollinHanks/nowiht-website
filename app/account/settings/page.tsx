// app/account/settings/page.tsx
// Premium Account Settings with Toast + Validation (FIXED)

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  User,
  MapPin,
  Shield,
  Settings as SettingsIcon,
  Loader2,
  Save,
  Plus,
  ArrowLeft,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Tabs, { Tab } from "@/components/ui/Tabs";
import AddressCard from "@/components/account/AddressCard";
import AddressFormModal from "@/components/account/AddressFormModal";
import DeleteConfirmModal from "@/components/account/DeleteConfirmModal";
import { useToast } from "@/store/toastStore";
import type { Address, AddressFormData } from "@/types";
import {
  profileSchema,
  changePasswordSchema,
  emailPreferencesSchema,
} from "@/lib/validations/settings";

// Tab definitions
const TABS: Tab[] = [
  { id: "profile", label: "PROFILE", icon: <User className="w-4 h-4" /> },
  { id: "addresses", label: "ADDRESSES", icon: <MapPin className="w-4 h-4" /> },
  { id: "security", label: "SECURITY", icon: <Shield className="w-4 h-4" /> },
  { id: "preferences", label: "PREFERENCES", icon: <SettingsIcon className="w-4 h-4" /> },
];

export default function AccountSettingsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const toast = useToast();

  // Tab state
  const [activeTab, setActiveTab] = useState("profile");

  // Profile state
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Addresses state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressModalMode, setAddressModalMode] = useState<"create" | "edit">("create");
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Security state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Preferences state
  const [preferences, setPreferences] = useState({
    orderUpdates: true,
    newsletter: true,
    promotions: false,
    smsNotifications: false,
  });
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/account/settings");
    }
  }, [status, router]);

  // Fetch user profile
  useEffect(() => {
    if (status === "authenticated") {
      fetchProfile();
    }
  }, [status]);

  // Fetch data when tab changes
  useEffect(() => {
    if (status === "authenticated") {
      if (activeTab === "addresses") {
        fetchAddresses();
      } else if (activeTab === "preferences") {
        fetchPreferences();
      }
    }
  }, [activeTab, status]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/user");
      if (res.ok) {
        const data = await res.json();
        setProfileData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  const fetchAddresses = async () => {
    setIsLoadingAddresses(true);
    try {
      const res = await fetch("/api/addresses");
      if (res.ok) {
        const data = await res.json();
        setAddresses(data);
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  const fetchPreferences = async () => {
    try {
      const res = await fetch("/api/user/preferences");
      if (res.ok) {
        const data = await res.json();
        setPreferences(data);
      }
    } catch (error) {
      console.error("Failed to fetch preferences:", error);
    }
  };

  // Profile handlers
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    setProfileErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileErrors({});

    // Validate with Zod
    const result = profileSchema.safeParse({
      name: profileData.name,
      phone: profileData.phone,
    });

    if (!result.success) {
      const errors: Record<string, string> = {};
      // ✅ FIXED: Use .issues instead of .errors (Zod v4)
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0] as string] = issue.message;
        }
      });
      setProfileErrors(errors);
      toast.error("Validation Error", "Please check your input");
      return;
    }

    setIsSavingProfile(true);

    try {
      const res = await fetch("/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileData.name,
          phone: profileData.phone,
        }),
      });

      if (res.ok) {
        toast.success("Profile Updated", "Your profile has been updated successfully");
      } else {
        toast.error("Update Failed", "Failed to update profile");
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
      toast.error("Error", "An unexpected error occurred");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Address handlers
  const handleAddAddress = () => {
    setAddressModalMode("create");
    setEditingAddress(null);
    setIsAddressModalOpen(true);
  };

  const handleEditAddress = (address: Address) => {
    setAddressModalMode("edit");
    setEditingAddress(address);
    setIsAddressModalOpen(true);
  };

  const handleDeleteAddress = (addressId: string) => {
    setDeletingAddressId(addressId);
    setIsDeleteModalOpen(true);
  };

  const handleSaveAddress = async (data: AddressFormData) => {
    try {
      if (addressModalMode === "create") {
        const res = await fetch("/api/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          await fetchAddresses();
          setIsAddressModalOpen(false);
          toast.success("Address Added", "New address has been added successfully");
        } else {
          toast.error("Failed", "Could not create address");
        }
      } else if (addressModalMode === "edit" && editingAddress) {
        const res = await fetch(`/api/addresses/${editingAddress.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          await fetchAddresses();
          setIsAddressModalOpen(false);
          toast.success("Address Updated", "Address has been updated successfully");
        } else {
          toast.error("Failed", "Could not update address");
        }
      }
    } catch (error) {
      console.error("Failed to save address:", error);
      toast.error("Error", "An unexpected error occurred");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingAddressId) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/addresses/${deletingAddressId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchAddresses();
        setIsDeleteModalOpen(false);
        setDeletingAddressId(null);
        toast.success("Address Deleted", "Address has been removed");
      } else {
        toast.error("Failed", "Could not delete address");
      }
    } catch (error) {
      console.error("Failed to delete address:", error);
      toast.error("Error", "An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  // Password handlers
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setPasswordErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordErrors({});

    // Validate with Zod
    const result = changePasswordSchema.safeParse(passwordData);

    if (!result.success) {
      const errors: Record<string, string> = {};
      // ✅ FIXED: Use .issues instead of .errors (Zod v4)
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0] as string] = issue.message;
        }
      });
      setPasswordErrors(errors);
      toast.error("Validation Error", "Please check your input");
      return;
    }

    setIsChangingPassword(true);

    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Password Changed", "Your password has been updated successfully");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error("Change Failed", data.error || "Failed to change password");
      }
    } catch (error) {
      console.error("Failed to change password:", error);
      toast.error("Error", "An unexpected error occurred");
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Preferences handlers
  const handlePreferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setPreferences((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSavePreferences = async () => {
    setIsSavingPreferences(true);

    try {
      const res = await fetch("/api/user/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      });

      if (res.ok) {
        toast.success("Preferences Saved", "Your preferences have been updated");
      } else {
        toast.error("Save Failed", "Failed to save preferences");
      }
    } catch (error) {
      console.error("Failed to save preferences:", error);
      toast.error("Error", "An unexpected error occurred");
    } finally {
      setIsSavingPreferences(false);
    }
  };

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const deletingAddress = addresses.find((a) => a.id === deletingAddressId);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          {/* Back Link */}
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Account</span>
          </Link>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-light tracking-wide mb-2">
              ACCOUNT SETTINGS
            </h1>
            <p className="text-gray-600">Manage your profile and preferences</p>
          </div>

          {/* Tabs */}
          <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

          {/* Tab Content */}
          <div className="mt-8">
            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <div className="max-w-2xl">
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      placeholder="Jane Doe"
                      className="w-full px-4 py-3 border border-gray-300 text-sm tracking-wide focus:outline-none focus:border-black transition-colors"
                    />
                    {profileErrors.name && (
                      <p className="text-xs text-red-600 mt-1">{profileErrors.name}</p>
                    )}
                  </div>

                  {/* Email (Read-only) */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={profileData.email}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 text-sm tracking-wide bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Email address cannot be changed
                    </p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 border border-gray-300 text-sm tracking-wide focus:outline-none focus:border-black transition-colors"
                    />
                    {profileErrors.phone && (
                      <p className="text-xs text-red-600 mt-1">{profileErrors.phone}</p>
                    )}
                  </div>

                  {/* Save Button */}
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="w-full md:w-auto px-8 py-3 bg-black text-white text-sm font-medium tracking-wider hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSavingProfile ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>SAVING...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>SAVE CHANGES</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* ADDRESSES TAB */}
            {activeTab === "addresses" && (
              <div>
                <div className="mb-6">
                  <button
                    onClick={handleAddAddress}
                    className="w-full md:w-auto px-6 py-3 bg-black text-white text-sm font-medium tracking-wider hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>ADD NEW ADDRESS</span>
                  </button>
                </div>

                {isLoadingAddresses && (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                )}

                {!isLoadingAddresses && addresses.length === 0 && (
                  <div className="text-center py-12 border border-gray-200">
                    <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Addresses Yet</h3>
                    <p className="text-gray-600 mb-6">
                      Add your first shipping address to get started
                    </p>
                    <button
                      onClick={handleAddAddress}
                      className="px-6 py-3 bg-black text-white text-sm font-medium tracking-wider hover:bg-gray-900 transition-colors"
                    >
                      ADD ADDRESS
                    </button>
                  </div>
                )}

                {!isLoadingAddresses && addresses.length > 0 && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {addresses.map((address) => (
                      <AddressCard
                        key={address.id}
                        address={address}
                        onEdit={handleEditAddress}
                        onDelete={handleDeleteAddress}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === "security" && (
              <div className="max-w-2xl">
                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium mb-2">
                          Current Password
                        </label>
                        <input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          placeholder="Enter current password"
                          className="w-full px-4 py-3 border border-gray-300 text-sm tracking-wide focus:outline-none focus:border-black transition-colors"
                        />
                        {passwordErrors.currentPassword && (
                          <p className="text-xs text-red-600 mt-1">
                            {passwordErrors.currentPassword}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
                          New Password
                        </label>
                        <input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          placeholder="Enter new password"
                          className="w-full px-4 py-3 border border-gray-300 text-sm tracking-wide focus:outline-none focus:border-black transition-colors"
                        />
                        {passwordErrors.newPassword && (
                          <p className="text-xs text-red-600 mt-1">
                            {passwordErrors.newPassword}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                          Confirm New Password
                        </label>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          placeholder="Confirm new password"
                          className="w-full px-4 py-3 border border-gray-300 text-sm tracking-wide focus:outline-none focus:border-black transition-colors"
                        />
                        {passwordErrors.confirmPassword && (
                          <p className="text-xs text-red-600 mt-1">
                            {passwordErrors.confirmPassword}
                          </p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isChangingPassword}
                        className="w-full md:w-auto px-8 py-3 bg-black text-white text-sm font-medium tracking-wider hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isChangingPassword ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>UPDATING...</span>
                          </>
                        ) : (
                          <span>UPDATE PASSWORD</span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Two-Factor Authentication (Placeholder) */}
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-medium mb-2">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Add an extra layer of security to your account
                    </p>
                    <button
                      type="button"
                      className="px-6 py-3 border border-gray-300 text-sm font-medium tracking-wider hover:border-black transition-colors"
                    >
                      ENABLE 2FA
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* PREFERENCES TAB */}
            {activeTab === "preferences" && (
              <div className="max-w-2xl">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Email Preferences</h3>
                    <div className="space-y-3">
                      <label className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          name="orderUpdates"
                          checked={preferences.orderUpdates}
                          onChange={handlePreferenceChange}
                          className="mt-0.5 w-4 h-4 text-black border-gray-300 focus:ring-black"
                        />
                        <div>
                          <p className="text-sm font-medium">Order Updates</p>
                          <p className="text-xs text-gray-600">
                            Receive notifications about your orders
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          name="newsletter"
                          checked={preferences.newsletter}
                          onChange={handlePreferenceChange}
                          className="mt-0.5 w-4 h-4 text-black border-gray-300 focus:ring-black"
                        />
                        <div>
                          <p className="text-sm font-medium">Newsletter</p>
                          <p className="text-xs text-gray-600">
                            Get exclusive offers and style updates
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          name="promotions"
                          checked={preferences.promotions}
                          onChange={handlePreferenceChange}
                          className="mt-0.5 w-4 h-4 text-black border-gray-300 focus:ring-black"
                        />
                        <div>
                          <p className="text-sm font-medium">Promotions</p>
                          <p className="text-xs text-gray-600">
                            Receive special offers and discounts
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          name="smsNotifications"
                          checked={preferences.smsNotifications}
                          onChange={handlePreferenceChange}
                          className="mt-0.5 w-4 h-4 text-black border-gray-300 focus:ring-black"
                        />
                        <div>
                          <p className="text-sm font-medium">SMS Notifications</p>
                          <p className="text-xs text-gray-600">
                            Receive text messages about your orders
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSavePreferences}
                    disabled={isSavingPreferences}
                    className="w-full md:w-auto px-8 py-3 bg-black text-white text-sm font-medium tracking-wider hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSavingPreferences ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>SAVING...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>SAVE PREFERENCES</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Modals */}
      <AddressFormModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSave={handleSaveAddress}
        address={editingAddress}
        mode={addressModalMode}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        addressLabel={deletingAddress?.label || ""}
      />
    </>
  );
}  