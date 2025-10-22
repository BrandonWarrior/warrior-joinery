// Lightweight GA4 helper.
// Safe if GA isn't present or you're in dev — it becomes a no-op.

declare global {
    interface Window {
      gtag?: (...args: any[]) => void;
      dataLayer?: any[];
    }
  }
  
  export function track(event: string, params: Record<string, any> = {}) {
    if (typeof window === "undefined") return;
    // Don’t send events during local dev
    // (remove this check if you want dev events)
    if (import.meta.env.DEV) return;
  
    if (typeof window.gtag === "function") {
      window.gtag("event", event, params);
    }
  }
  