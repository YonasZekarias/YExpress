import { LoadingState } from "@/components/ui/loading-state";

export default function Loading() {
  return (
    <LoadingState
      variant="fullscreen"
      message="Loading YExpress…"
      description="Hang tight while we prepare the storefront."
    />
  );
}
