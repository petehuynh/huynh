import { initializeCopyAnalytics } from '../core/analyticsTracker';
import '../styles/globals.css';
// Initialize analytics on the client side only
if (typeof window !== 'undefined') {
    initializeCopyAnalytics({
        analyticsProvider: 'gtag',
        enableABTesting: true,
        providerConfig: {
            apiKey: process.env.NEXT_PUBLIC_ANALYTICS_API_KEY,
        },
    }).catch(console.error);
}
export default function App({ Component, pageProps }) {
    return React.createElement(Component, { ...pageProps });
}
//# sourceMappingURL=_app.js.map