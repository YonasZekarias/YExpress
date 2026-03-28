import { LoadingState } from "@/components/ui/loading-state";

export default function Loading() {
  return (
    <LoadingState
      variant="page"
      message="Loading product…"
      description="Getting details, images, and options."
    />
  );
}
