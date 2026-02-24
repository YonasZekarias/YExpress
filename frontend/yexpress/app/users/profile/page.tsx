"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { ProfileCard } from "@/components/users/profile-card";
import { PersonalInformation } from "@/components/users/personel-information";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react"; 
import Loading from "../loading";

export default function ProfilePage() {
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    createdAt: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/me/profile`, { withCredentials: true });
        const user = res.data;
        
        setProfileData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          phone: user.phone || "",
          createdAt: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A",
        });
      } catch (error) {
        console.error(error);
        toast.error("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleFieldChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/me/profile`, {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone
      }, { withCredentials: true });

      toast.success("Profile updated successfully!");
      setHasChanges(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Loading/>
   );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-900 p-6">
      <main className="max-w-4xl mx-auto space-y-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Profile</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your account settings</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Avatar & Basic Info */}
          <div className="lg:w-1/3 space-y-6">
            <ProfileCard
              firstName={profileData.firstName}
              lastName={profileData.lastName}
              email={profileData.email}
              memberSince={profileData.createdAt}
            />
          </div>

          {/* Right: Editable Fields */}
          <div className="lg:w-2/3 space-y-6">
            <PersonalInformation
              firstName={profileData.firstName}
              lastName={profileData.lastName}
              email={profileData.email}
              phone={profileData.phone}
              onFieldChange={handleFieldChange}
            />

            <div className="flex justify-end gap-4 pt-4 border-t dark:border-slate-800">
              <Button 
                variant="ghost" 
                onClick={() => window.location.reload()} 
                disabled={!hasChanges || isSaving}
              >
                Cancel
              </Button>
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white px-8"
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}