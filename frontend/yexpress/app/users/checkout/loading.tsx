import { LoadingState } from "@/components/ui/loading-state";

export default function Loading() {
  return (
    <LoadingState
      variant="page"
      message="Loading checkout…"
      description="Preparing your cart summary."
    />
  );
}
