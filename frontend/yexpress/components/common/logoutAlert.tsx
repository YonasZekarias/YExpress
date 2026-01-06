// LogoutAlert component
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/store/authStore";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react"; // Add this import

const LogoutAlert: React.FC = () => {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false); 

  const handleLogout = async () => {
    await logout(); 
    setIsOpen(false);
    router.push("/");
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="logout"
          className="w-full flex items-center justify-start px-4 py-3 text-sm font-medium hover:bg-slate-100"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
          <AlertDialogDescription>
            You will need to login again to access your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-rose-600 hover:bg-rose-700"
            onClick={handleLogout}
          >
            Logout
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogoutAlert;