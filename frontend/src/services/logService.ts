import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

function init() {
  Sentry.init({
    dsn: "https://903902b6063e45238feef431882df284@o4504239464448000.ingest.sentry.io/4504239466348544",
    integrations: [new BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}

function log(error: any) {
  Sentry.captureException(error);
}

export default {
  init,
  log,
};
