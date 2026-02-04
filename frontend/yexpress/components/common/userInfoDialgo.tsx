"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // Ensure you have this component
import { Separator } from "@/components/ui/separator"; // Ensure you have this component
import { 
  User, Mail, Phone, Shield, Calendar, 
  CheckCircle2, XCircle, Ban, Loader2 
} from "lucide-react";

import { getUserById } from "@/services/admin.service";
import useAuthStore from "@/store/authStore";
import { getProfile } from "@/services/common.service";

// --- Types ---
interface UserData {
  _id: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  isBanned: boolean;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserInfoDialogProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UserInfoDialog({ userId, open, onOpenChange }: UserInfoDialogProps) {
  const userRole = useAuthStore((state) => state.role);
  const router = useRouter();
  
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!open || !userId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        let response;
        if (userRole === "admin") {
          response = await getUserById(userId);
        } else {
          response = await getProfile();
        }
        setUserData(response.data);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Unable to load user information.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, open, userRole]);

  // --- Helper for Date Formatting ---
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden gap-0">
        
        {/* HEADER SECTION */}
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            User Profile
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Loading details...</p>
            </div>
          ) : error ? (
            <div className="py-8 text-center text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p>{error}</p>
            </div>
          ) : userData ? (
            <div className="space-y-6">
              {/* TOP PROFILE CARD */}
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl border border-border">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                  {userData.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">{userData.username}</h2>
                  <div className="flex gap-2 mt-1">
                    <Badge variant={userData.role === "admin" ? "default" : "secondary"} className="uppercase text-[10px]">
                      {userData.role}
                    </Badge>
                    {userData.isBanned ? (
                      <Badge variant="destructive" className="flex items-center gap-1 text-[10px]">
                        <Ban className="w-3 h-3" /> Banned
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-green-600 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 text-[10px] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* DETAILS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-4">
                <InfoItem 
                  icon={<Mail className="w-4 h-4" />} 
                  label="Email Address" 
                  value={userData.email} 
                />
                <InfoItem 
                  icon={<Phone className="w-4 h-4" />} 
                  label="Phone Number" 
                  value={userData.phone || "Not provided"} 
                />
                <InfoItem 
                  icon={<Shield className="w-4 h-4" />} 
                  label="Verification" 
                  value={
                    <span className={`flex items-center gap-1.5 ${userData.verified ? 'text-green-600' : 'text-amber-600'}`}>
                      {userData.verified ? (
                        <><CheckCircle2 className="w-4 h-4" /> Verified</>
                      ) : (
                        <><XCircle className="w-4 h-4" /> Unverified</>
                      )}
                    </span>
                  } 
                />
                <InfoItem 
                  icon={<Calendar className="w-4 h-4" />} 
                  label="Joined On" 
                  value={formatDate(userData.createdAt)} 
                />
              </div>
            </div>
          ) : null}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-6 bg-muted/40 border-t flex justify-end gap-3">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>

          {userData && userRole === "admin" && !loading && (
             <Button variant="destructive" className="gap-2">
               <Ban className="w-4 h-4" />
               {userData.isBanned ? "Unban User" : "Ban User"}
               {/* Note: changed label to Ban/Unban based on logic usually needed here, or 'Delete' if strictly delete */}
             </Button>
          )}

          {userData && userRole === "user" && !loading && (
            <Button 
              onClick={() => {
                router.push('/users/profile');
                onOpenChange(false);
              }} 
            >
              Edit Profile
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// --- Sub-component for neat layout ---
function InfoItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: React.ReactNode }) {
  return (
    <div className="flex flex-col space-y-1.5">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-sm font-medium text-foreground pl-6">
        {value}
      </div>
    </div>
  );
}