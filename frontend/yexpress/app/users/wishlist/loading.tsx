import { LoadingState } from "@/components/ui/loading-state";

export default function Loading() {
  return (
    <LoadingState
      variant="page"
      message="Loading your wishlist…"
      description="Finding everything you’ve saved."
    />
  );
}
