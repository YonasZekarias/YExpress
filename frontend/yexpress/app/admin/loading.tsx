import { LoadingState } from "@/components/ui/loading-state";

export default function Loading() {
  return (
    <LoadingState
      variant="page"
      message="Loading admin…"
      description="Fetching dashboard tools and data."
    />
  );
}
