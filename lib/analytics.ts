type AnalyticsParams = Record<string, string | number | boolean | undefined>;

type AnalyticsWindow = Window & {
  gtag?: (command: "event", eventName: string, params?: AnalyticsParams) => void;
};

/** Sends a GA4 event when analytics is configured, without breaking local/dev use. */
export function trackEvent(eventName: string, params?: AnalyticsParams) {
  if (typeof window === "undefined") return;

  const gtag = (window as AnalyticsWindow).gtag;
  if (typeof gtag === "function") gtag("event", eventName, params);
}
