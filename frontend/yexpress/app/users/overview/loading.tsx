import { LoadingState } from "@/components/ui/loading-state";

export default function Loading() {
  return (
    <LoadingState
      variant="page"
      message="Loading your overview…"
      description="Gathering orders, wishlist, and quick stats."
    />
  );
}
