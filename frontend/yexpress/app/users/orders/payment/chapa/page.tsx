"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { getApiUrlOrNull } from "@/lib/apiUrl";

function ChapaReturnInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState("Confirming your payment…");
  const [failed, setFailed] = useState(false);
  const txRef = searchParams.get("tx_ref");
  const API_URL = getApiUrlOrNull();

  const verify = useCallback(async () => {
    if (!txRef || !API_URL) {
      setMessage(
        !API_URL ? "App configuration error (missing API URL)." : "Missing payment reference."
      );
      setFailed(true);
      return;
    }
    setFailed(false);
    setMessage("Confirming your payment…");
    try {
      await axios.post(
        `${API_URL}/user/chapa/verify`,
        { tx_ref: txRef },
        { withCredentials: true }
      );
      router.replace("/users/orders");
    } catch {
      setMessage(
        "We could not confirm the payment automatically. You can retry, open Chapa again, or check your orders."
      );
      setFailed(true);
    }
  }, [txRef, API_URL, router]);

  const resumeCheckout = async () => {
    if (!txRef || !API_URL) return;
    setMessage("Opening Chapa…");
    try {
      const { data } = await axios.post(
        `${API_URL}/user/chapa/resume-checkout`,
        { tx_ref: txRef },
        { withCredentials: true }
      );
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      setMessage("Could not get a payment link. Try again later.");
      setFailed(true);
    } catch {
      setMessage("Could not resume payment. Check your orders or contact support.");
      setFailed(true);
    }
  };

  useEffect(() => {
    verify();
  }, [verify]);

  return (
    <div className="max-w-md mx-auto min-h-[50vh] flex flex-col items-center justify-center gap-6 px-4 py-12">
      {!failed && <Loader2 className="w-8 h-8 animate-spin text-gray-500" />}
      <p className="text-center text-gray-700 dark:text-gray-300">{message}</p>
      {failed && (
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <button
            type="button"
            onClick={() => verify()}
            className="px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black text-sm font-medium"
          >
            Retry confirmation
          </button>
          <button
            type="button"
            onClick={() => resumeCheckout()}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium"
          >
            Open Chapa again
          </button>
          <Link
            href="/users/orders"
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium text-center"
          >
            View orders
          </Link>
        </div>
      )}
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
