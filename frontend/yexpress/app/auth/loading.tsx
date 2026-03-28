import { LoadingState } from "@/components/ui/loading-state";

export default function Loading() {
  return (
    <LoadingState
      variant="fullscreen"
      message="Loading sign-in…"
      description="Preparing a secure session for you."
    />
  );
}
