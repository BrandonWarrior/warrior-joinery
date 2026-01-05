

declare global {
    interface Window {
      gtag?: (...args: any[]) => void;
      dataLayer?: any[];
    }
  }
  
  export function track(event: string, params: Record<string, any> = {}) {
    if (typeof window === "undefined") return;
 
    if (import.meta.env.DEV) return;
  
    if (typeof window.gtag === "function") {
      window.gtag("event", event, params);
    }
  }
  