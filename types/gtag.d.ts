// Google Analytics Types
// Add to: types/gtag.d.ts

interface Window {
  gtag: (
    command: 'consent' | 'config' | 'event' | 'set',
    targetOrAction: string,
    params?: {
      [key: string]: any;
      analytics_storage?: 'granted' | 'denied';
      ad_storage?: 'granted' | 'denied';
      ad_user_data?: 'granted' | 'denied';
      ad_personalization?: 'granted' | 'denied';
    }
  ) => void;
}

export { };