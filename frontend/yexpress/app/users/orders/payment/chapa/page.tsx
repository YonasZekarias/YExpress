"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Loader2 } from "lucide-react";

function ChapaReturnInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState("Confirming your payment…");
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const tx_ref = searchParams.get("tx_ref");
    if (!tx_ref || !API_URL) {
      setMessage(
        !API_URL ? "App configuration error." : "Missing payment reference."
      );
      return;
    }

    axios
      .post(`${API_URL}/user/chapa/verify`, { tx_ref }, { withCredentials: true })
      .then(() => {
        router.replace("/users/orders");
      })
      .catch(() => {
        setMessage(
          "We could not confirm the payment automatically. Check your orders or try again."
        );
      });
  }, [searchParams, router, API_URL]);

  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4 px-4">
      <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      <p className="text-center text-gray-700 dark:text-gray-300">{message}</p>
    </div>
  );
}

export default function ChapaPaymentReturnPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[40vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
        </div>
      }
    >
      <ChapaReturnInner />
    </Suspense>
  );
}
