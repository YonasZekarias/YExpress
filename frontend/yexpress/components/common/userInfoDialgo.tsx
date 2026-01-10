"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { getUserById, banUnbanUser } from "@/services/admin.service";
import useAuthStore from "@/store/authStore";
import toast from "react-hot-toast";

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

const UserInfoDialog = ({ userId, open, onOpenChange }: UserInfoDialogProps) => {
  const userRole = useAuthStore((state) => state.role);

  const [userData, setUserData] = useState<UserData>({
    _id: "",
    username: "",
    email: "",
    phone: "",
    role: "",
    isBanned: false,
    verified: false,
    createdAt: "",
    updatedAt: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract fetch logic into a reusable function
  const fetchUserData = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      setError(null);
      const response = await getUserById(userId);
      setUserData(response.data);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchUserData();
    }
  }, [userId, open]);

  // Handle Ban/Unban
  const handleBanUnban = async () => {
    try {
      await banUnbanUser(userId);
      toast.success("User status updated successfully");
      await fetchUserData(); // Refresh user data after action
    } catch (error) {
      console.error(error);
      toast.error("Failed to update user status");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>User Information</DialogTitle>
          <DialogDescription>Detailed information about the user.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {loading ? (
            <p className="text-gray-700 dark:text-gray-300">Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <Info label="Username" value={userData.username} />
              <Info label="Email" value={userData.email} />
              <Info label="Phone" value={userData.phone} />
              <Info label="Role" value={userData.role} />
              <Info label="Status" value={userData.isBanned ? "Banned" : "Active"} />
              <Info label="Verified" value={userData.verified ? "Yes" : "No"} />
              <Info label="Joined On" value={new Date(userData.createdAt).toLocaleDateString()} />
              <Info label="Last Updated" value={new Date(userData.updatedAt).toLocaleDateString()} />
            </>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>

          {userRole === "admin" && (
            <Button variant="destructive">Delete User</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserInfoDialog;

const Info = ({ label, value }: { label: string; value: string | boolean }) => (
  <div>
    <h3 className="font-medium text-gray-900 dark:text-gray-100">{label}</h3>
    <p className="text-gray-700 dark:text-gray-300">{value.toString()}</p>
  </div>
);
