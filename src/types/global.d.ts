interface Window {
  dataLayer: any[];
  gtag: (...args: any[]) => void;
}

declare module 'mixpanel-browser';
declare module 'uuid'; 