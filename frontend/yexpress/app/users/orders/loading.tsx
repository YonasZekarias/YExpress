import { LoadingState } from "@/components/ui/loading-state";

export default function Loading() {
  return (
    <LoadingState
      variant="page"
      message="Loading your orders…"
      description="Fetching your purchase history."
    />
  );
}
