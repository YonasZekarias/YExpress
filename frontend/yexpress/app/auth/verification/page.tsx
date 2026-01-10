"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import useAuthStore from "@/store/authStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const VerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const pendingUser = useAuthStore(state => state.pendingUser)
  const router = useRouter();
  // Handles input change and auto-move
  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return; 

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move to next automatically
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // Handle backspace focus move
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const fullCode = code.join("");
    const email = pendingUser?.email;
    if (!email) {
      toast.error("No pending user email found.");
      return;
    }
    axios.post("http://127.0.0.1:5000/api/auth/verify-email", { email, code: fullCode })
      .then(response => {
        toast.success(response.data.message || "Email verified successfully!");
        router.push("/auth/signin");
        console.log("Verification code:", fullCode);
      })
      .catch(error => {
        toast.error("Failed to verify email.");
        console.error("Verification error:", error);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 font-sans px-4">
      <Card className="w-full max-w-md bg-white shadow-md">
        <CardHeader className="text-center">
          <CardTitle className="text-indigo-500 text-2xl font-semibold">
            Email Verification
          </CardTitle>
          <CardDescription className="mt-1 text-gray-600">
            Enter the 6-digit code we sent to your email address.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4">
            <div className="flex justify-center gap-2">
              {code.map((digit, i) => (
                <Input
                  key={i}
                  maxLength={1}
                  value={digit}
                  inputMode="numeric"
                  onChange={(e) => handleChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  ref={(el) => { inputsRef.current[i] = el; }}
                  className="w-12 h-12 text-center text-black text-lg font-semibold border-gray-300 focus-visible:ring-indigo-500"
                />
              ))}
            </div>

            <p className="text-center text-sm text-gray-500">
              Didn’t receive a code?
              <button
                className="ml-1 text-indigo-500 hover:underline"
                type="button"
              >
                Resend
              </button>
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white"
            onClick={handleSubmit}
          >
            Verify Email
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerificationPage;
