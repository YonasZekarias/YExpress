import { LoadingState } from "@/components/ui/loading-state";

export default function Loading() {
  return (
    <LoadingState
      variant="page"
      message="Loading products…"
      description="Fetching the catalog and filters."
    />
  );
}
