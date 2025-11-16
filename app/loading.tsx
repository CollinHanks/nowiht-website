import PageLoader from "@/components/loading/PageLoader";

/**
 * Global Loading UI - Next.js Built-in
 * 
 * Automatically shown when:
 * 1. Route change takes time (>200ms)
 * 2. Slow network or heavy page load
 * 3. Server components loading
 * 
 * NOT shown on fast navigation (<200ms)
 * 
 * This creates a Suspense boundary automatically!
 */
export default function Loading() {
  return <PageLoader />;
}