interface Window {
  fathom?: {
    trackPageview: (opts?: { url?: string; referrer?: string }) => void;
    trackEvent: (eventName: string, opts?: { _value?: number }) => void;
  };
}
